import { GithubRepo, GithubUser, GithubUserCommits } from '@Itypes/github.interface';
import AppDataSource from '../db/database';
import { JobState } from '@models/job.model';
import { Repo } from '@models/repos.model';
import { Username } from '@models/username.model';
import aiService from '@services/ai.service';
import eventsService from '@services/events.service';
import githubService from '@services/github.service';
import reposService from '@services/repos.service';
import scoreService from '@services/score.service';
import usernameService from '@services/username.service';
import { logger } from '@utils/utils';
import { Job } from 'agenda';
import { GithubEvent } from '@Itypes/events.interface';

const refreshUsernames = async (job: Job) => {
  const jobStateRepository = AppDataSource.getRepository(JobState);
  const lastUserId = await usernameService.getLastUserId();
  const { lastProcessedUserId, jobState } = await initializeJobState(job, jobStateRepository);

  if (!lastUserId) {
    logger('error', 'No users found in the database');
    return;
  }

  const currentUser = await usernameService.get(lastProcessedUserId);

  if (!currentUser) {
    await handleNoUserFound(lastProcessedUserId, lastUserId, jobState, jobStateRepository, job);
    return;
  }

  if (shouldSkipUser(currentUser)) {
    await updateJobState(jobState, jobStateRepository, job, lastProcessedUserId + 1);
    return;
  }

  logger('info', `Processing user: ${currentUser.username}`);

  try {
    await processUser(currentUser, job);
  } catch (err) {
    logger('error', `Error updating user ${currentUser.username}: ${err}`);
  }

  await updateJobState(jobState, jobStateRepository, job, lastProcessedUserId + 1);
};

async function initializeJobState(job: Job, jobStateRepository: any) {
  let lastProcessedUserId = job.attrs.data?.lastProcessedUserId;
  let jobState: JobState | null = null;

  if (!lastProcessedUserId) {
    logger('info', 'No last processed user ID found, initializing job state');
    jobState = await jobStateRepository.findOne({ where: { jobName: 'refreshUsernames' } });
    lastProcessedUserId = jobState?.lastProcessedUserId || 0;
    if (!jobState) {
      jobState = await createNewJobState(jobStateRepository);
      lastProcessedUserId = 1;
    }
  }

  return { lastProcessedUserId, jobState };
}

async function createNewJobState(jobStateRepository: any) {
  logger('info', 'No job state found, creating new job state');
  const newJobState = new JobState();
  newJobState.jobName = 'refreshUsernames';
  newJobState.lastProcessedUserId = 1;
  await jobStateRepository.save(newJobState);
  return newJobState;
}

async function handleNoUserFound(
  lastProcessedUserId: number,
  lastUserId: number,
  jobState: JobState | null,
  jobStateRepository: any,
  job: Job,
) {
  logger('info', `No user in the database with ID ${lastProcessedUserId}`);

  if (lastProcessedUserId > lastUserId) {
    lastProcessedUserId = 0;
    logger('info', 'Resetting last processed user ID to 0');
    await updateJobState(jobState, jobStateRepository, job, 0);
  } else {
    await updateJobState(jobState, jobStateRepository, job, lastProcessedUserId + 1);
  }
}

function shouldSkipUser(user: Username) {
  const userDate = user.updated_at ? user.updated_at : user.created_at;
  const oneDayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
  if (userDate && userDate > oneDayAgo) {
    logger('info', `User ${user.username} updated within the last day, skipping`);
    return true;
  }
  return false;
}

async function processUser(user: Username, job: Job) {
  const { reposData, commits, pullRequests, userData, favLanguage, events } = await fetchGithubData(user.username);
  const score = await scoreService.calculateScore({ reposData, commits, pullRequests });
  const aiData = await generateAiData(user);
  const updatedUsername = await updateUsername(user, userData, score, favLanguage, aiData);
  await job.save();

  await processEvents(events, updatedUsername);
  await saveRepos(reposData, updatedUsername);

  logger('info', `User ${updatedUsername.username} updated`);
}

async function fetchGithubData(username: string) {
  logger('info', `Fetching ${username} Github data`);

  const [reposData, pullRequests, userData, events] = await Promise.all([
    githubService.getGithubUserRepositories(username),
    githubService.getGithubUserPullRequests(username),
    githubService.getGithubUserInformation(username),
    githubService.getGithubUserEvents(username),
  ]);

  // Fetch commits and favorite language after getting reposData
  const commits = await githubService.getGithubUserCommits(username, reposData);
  const favLanguage = await githubService.getGithubUserFavLanguage(reposData);

  const resp: {
    reposData: GithubRepo[];
    commits: GithubUserCommits[];
    pullRequests: any;
    userData: GithubUser;
    favLanguage: string;
    events: GithubEvent[];
  } = {
    reposData,
    commits,
    pullRequests,
    userData,
    favLanguage,
    events,
  };

  return resp;
}

async function generateAiData(user: Username) {
  const ai_description = user.ai_description || (await aiService.generateAiDescription(user));
  const ai_nickname = user.ai_nickname || (await aiService.generateAiNickname(user));
  return { ai_description, ai_nickname };
}

async function updateUsername(user: Username, userData: GithubUser, score: number, favLanguage: string, aiData: any) {
  return await usernameService.updateUsername({
    username: user.username,
    score,
    location: userData.location || 'Earth',
    fav_language: favLanguage,
    contributions: 0,
    avatar: userData.avatar_url,
    bio: userData.bio || '',
    name: userData.login,
    ai_description: aiData.ai_description,
    ai_nickname: aiData.ai_nickname,
    followers: userData.followers || 0,
    following: userData.following || 0,
    github_url: userData.html_url,
    twitter_username: '',
    ai_description_updated_at: new Date(),
    extra_score: 0,
    email: userData.email || '',
    created_at: new Date(userData.created_at),
    updated_at: new Date(),
  });
}

async function processEvents(events: GithubEvent[], updatedUsername: Username) {
  for (const event of events) {
    if (!event.payload.commits) continue;
    const eventExists = await eventsService.getEventByGithubId(event.id);
    if (eventExists) continue;

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
}

async function saveRepos(reposData: GithubRepo[], updatedUsername: Username) {
  const reposToSave = reposData.map((repo) => {
    const newRepo = new Repo();
    newRepo.username_id = updatedUsername.id;
    newRepo.name = repo.name;
    newRepo.description = repo.description || '';
    newRepo.github_url = repo.url;
    newRepo.stars = repo.stargazers_count || 0;
    newRepo.forks = repo.forks_count || 0;
    newRepo.issues = repo.open_issues_count || 0;
    newRepo.pull_requests = 0;
    newRepo.github_id = repo.id;
    newRepo.commits = 0;
    newRepo.comments = 0;
    newRepo.created_at = new Date();
    return newRepo;
  });
  await reposService.createMultipleRepos(reposToSave);
}

async function updateJobState(jobState: JobState | null, jobStateRepository: any, job: Job, newLastProcessedUserId: number) {
  if (jobState) {
    jobState.lastProcessedUserId = newLastProcessedUserId;
    await jobStateRepository.save(jobState);
  }
  job.attrs.data = { lastProcessedUserId: newLastProcessedUserId };
}

export default refreshUsernames;
