import AppDataSource from '../db/database';
import { JobState } from '@models/job.model';
import aiService from '@services/ai.service';
import eventsService from '@services/events.service';
import githubService from '@services/github.service';
import scoreService from '@services/score.service';
import usernameService from '@services/username.service';
import { logger } from '@utils/utils';
import { Job } from 'agenda';

const refreshUsernames = async (job: Job) => {
  const jobStateRepository = AppDataSource.getRepository(JobState);
  const lastUserId = usernameService.getLastUserId();
  let lastProcessedUserId = job.attrs.data?.lastProcessedUserId;
  let jobState: JobState | null = null;

  if (!lastProcessedUserId) {
    logger('info', 'No last processed user ID found, initializing job state');
    jobState = await jobStateRepository.findOne({ where: { jobName: 'refreshUsernames' } });
    lastProcessedUserId = jobState?.lastProcessedUserId || 0;
    if (!jobState) {
      logger('info', 'No job state found, creating new job state');
      jobState = new JobState();
      jobState.jobName = 'refreshUsernames';
      jobState.lastProcessedUserId = 1;
      await jobStateRepository.save(jobState);
      lastProcessedUserId = 1;
    }
  }

  const currentUser = await usernameService.get(lastProcessedUserId);

  if (!currentUser) {
    logger('info', `No user in the database with ID ${lastProcessedUserId}`);

    // Reset lastProcessedUserId to 0 if it exceeds 10
    if (lastProcessedUserId > lastUserId) {
      lastProcessedUserId = 0;
      logger('info', 'Resetting last processed user ID to 0');
    }

    if (jobState) {
      jobState.lastProcessedUserId = lastProcessedUserId + 1;
      await jobStateRepository.save(jobState);
    }
    job.attrs.data = { lastProcessedUserId: lastProcessedUserId + 1 };
    return;
  }

  // if updated_at is not more than 1 day old, skip
  const userDate = currentUser.updated_at ? currentUser.updated_at : currentUser.created_at;
  const oneDayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
  if (userDate && userDate < oneDayAgo) {
    logger('info', `User ${currentUser.username} updated more than a day ago, processing`);
  } else {
    logger('info', `User ${currentUser.username} updated within the last day, skipping`);
    if (jobState) {
      jobState.lastProcessedUserId = lastProcessedUserId + 1;
      await jobStateRepository.save(jobState);
    }
    job.attrs.data = { lastProcessedUserId: lastProcessedUserId + 1 };
    return;
  }

  logger('info', `Processing user: ${currentUser.username}`);

  try {
    const reposData = await githubService.getGithubUserRepositories(currentUser.username);
    const commits = await githubService.getGithubUserCommits(currentUser.username, reposData);
    const pullRequests = await githubService.getGithubUserPullRequests(currentUser.username);
    const userData = await githubService.getGithubUserInformation(currentUser.username);
    const favLanguage = await githubService.getGithubUserFavLanguage(reposData);
    const events = await githubService.getGithubUserEvents(currentUser.username);
    const score = await scoreService.calculateScore({
      reposData,
      commits,
      pullRequests,
    });
    const ai_description = currentUser.ai_description ? currentUser.ai_description : await aiService.generateAiDescription(currentUser);
    const ai_nickname = currentUser.ai_nickname ? currentUser.ai_nickname : await aiService.generateAiNickname(currentUser);
    const updatedUsername = await usernameService.updateUsername({
      username: currentUser.username,
      score,
      location: userData.location || 'Earth',
      fav_language: favLanguage,
      contributions: 0,
      avatar: userData.avatar_url,
      bio: userData.bio || '',
      name: userData.name,
      ai_description,
      ai_nickname,
      followers: userData.followers || 0,
      following: userData.following || 0,
      github_url: userData.html_url,
      twitter_username: '',
      ai_description_updated_at: new Date(),
      extra_score: 0,
      email: userData.email || '',
    });
    await job.save();

    for (const event of events) {
      const eventDTO = {
        username_id: updatedUsername.id,
        github_repo_id: event.repo.id,
        event_type: event.type,
        event_size: event.payload.size,
        github_id: event.id,
        message: event.payload.commits[0]?.message || '',
        event_date: new Date(event.created_at),
      };
      await eventsService.createEvent(eventDTO);
    }

    logger('info', `User ${updatedUsername.username} updated`);
  } catch (error) {
    logger('error', `Error updating user ${currentUser.username}: ${error}`);
  }

  if (jobState) {
    jobState.lastProcessedUserId = lastProcessedUserId + 1;
    await jobStateRepository.save(jobState);
  }
  job.attrs.data = { lastProcessedUserId: lastProcessedUserId + 1 };

  return;
};

export default refreshUsernames;
