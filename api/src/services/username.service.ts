import { Username } from '@models/username.model';
import githubService from '@services/github.service';
import scoreService from '@services/score.service';
import { UsernameDTO } from '@Itypes/username.interface';
import { In, Like, MoreThan } from 'typeorm';
import { GithubEvent } from '@models/github-events.model';

const getTrendingUsers = async () => {
  // get top 3 users with most events in the last 24 hours
  const events = await GithubEvent.find({
    where: { event_date: MoreThan(new Date(Date.now() - 24 * 60 * 60 * 1000)) },
    order: { event_size: 'DESC' },
    take: 3,
  });
  const users = await Username.find({ where: { id: In(events.map((event) => event.username_id)) } });
  return users;
};

const createUsername = async (data: UsernameDTO) => {
  const username = await Username.findOne({ where: { username: data.username } });

  if (username) {
    throw new Error('Username already exists');
  }

  const newUsername = new Username();
  newUsername.username = data.username;
  newUsername.score = data.score;
  newUsername.extra_score = data.extra_score;
  newUsername.location = data.location;
  newUsername.fav_language = data.fav_language;
  newUsername.contributions = data.contributions;
  newUsername.avatar = data.avatar;
  newUsername.bio = data.bio;
  newUsername.name = data.name;
  newUsername.followers = data.followers;
  newUsername.following = data.following;
  newUsername.github_url = data.github_url || '';
  newUsername.twitter_username = data.twitter_username || '';
  newUsername.ai_description = data.ai_description || '';
  newUsername.ai_nickname = data.ai_nickname || '';
  newUsername.ai_description_updated_at = data.ai_description_updated_at || new Date();

  const savedUsername = await newUsername.save();

  return savedUsername;
};

const updateUsername = async (data: UsernameDTO) => {
  const username = await Username.findOne({ where: { username: data.username } });
  const reposData = await githubService.getGithubUserRepositories(data.username);
  const commits = await githubService.getGithubUserCommits(data.username, reposData);
  const pullRequests = await githubService.getGithubUserPullRequests(data.username);
  const score = await scoreService.calculateScore({
    reposData,
    commits,
    pullRequests,
  });
  if (!username) {
    throw new Error('Username not found');
  }
  username.score = score;
  username.extra_score = 0;
  username.location = data.location;
  username.fav_language = data.fav_language;
  username.contributions = data.contributions;
  username.avatar = data.avatar;
  username.bio = data.bio;
  username.name = data.name;
  username.followers = data.followers;
  username.following = data.following;
  username.github_url = data.github_url || '';
  username.twitter_username = data.twitter_username || '';
  username.ai_description = data.ai_description || '';
  username.ai_nickname = data.ai_nickname || '';
  username.ai_description_updated_at = data.ai_description_updated_at || new Date();

  const savedUsername = await username.save();
  return savedUsername;
};

const findByUsername = async (username: string) => {
  const user = await Username.findOne({ where: { username } });
  if (!user) {
    throw new Error('Username not found');
  }
  return user;
};

const getAllUsernames = async () => {
  const users = await Username.find();
  return users;
};

const searchUsernames = async (query: string) => {
  const users = await Username.find({ where: { username: Like(`%${query}%`) } });

  return users;
};

const searchUsernamesSortedByScore = async (query: string) => {
  const users = await Username.find({ where: { username: Like(`%${query}%`) }, order: { score: 'DESC' } });
  return users;
};

const getTopUsers = async (limit: number) => {
  const users = await Username.find({ order: { score: 'DESC' }, take: limit });
  return users;
};

const get = async (id: number) => {
  const user = await Username.findOne({ where: { id } });
  return user;
};

const getRandomUser = async (): Promise<Username | null> => {
  const user = await Username.createQueryBuilder('user').select().orderBy('RAND()').getOne();
  return user;
};

const isUserTop10ByScore = async (score: number) => {
  const users = await Username.find({ order: { score: 'DESC' }, take: 10 });
  return users.some((user) => user.score === score);
};

const isUserTop1ByScore = async (score: number) => {
  const users = await Username.find({ order: { score: 'DESC' }, take: 1 });
  return users.some((user) => user.score === score);
};

export default {
  createUsername,
  updateUsername,
  findByUsername,
  getAllUsernames,
  searchUsernames,
  searchUsernamesSortedByScore,
  get,
  getTopUsers,
  getRandomUser,
  isUserTop10ByScore,
  isUserTop1ByScore,
  getTrendingUsers,
};
