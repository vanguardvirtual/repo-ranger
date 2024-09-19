import aiService from '@/services/ai.service';
import emojiService from '@/services/emoji.service';
import githubService from '@/services/github.service';
import scoreService from '@/services/score.service';
import usernameService from '@/services/username.service';
import { UsernameDTO } from '@/types/username.interface';
import { asyncFn, resFn } from '@/utils';
import { NextFunction, Request, Response } from 'express';

const createUsername = asyncFn(async (req: Request, res: Response, _next: NextFunction) => {
  const { username } = req.body;
  const reposData = await githubService.getGithubUserRepositories(username);
  const commits = await githubService.getGithubUserCommits(username, reposData);
  const pullRequests = await githubService.getGithubUserPullRequests(username);
  const userData = await githubService.getGithubUserInformation(username);
  const favLanguage = await githubService.getGithubUserFavLanguage(reposData);
  const score = await scoreService.calculateScore({
    reposData,
    commits,
    pullRequests,
  });
  const ai_description = await aiService.generateAiDescription(username);
  const ai_nickname = await aiService.generateAiNickname(username);

  const usernameData: UsernameDTO = {
    username,
    location: userData.location || 'Earth',
    fav_language: favLanguage,
    contributions: 0,
    avatar: userData.avatar_url,
    bio: userData.bio || '',
    email: userData.email || '',
    name: userData.name,
    ai_description,
    ai_nickname,
    followers: userData.followers || 0,
    following: userData.following || 0,
    github_url: userData.html_url,
    twitter_username: '',
    ai_description_updated_at: new Date(),
    score: score,
    extra_score: 0,
  };
  const savedUsername = await usernameService.createUsername(usernameData);

  resFn(res, {
    status: 200,
    message: 'Username created successfully',
    data: savedUsername,
    error: '',
    success: true,
  });
});

const getUsernames = asyncFn(async (req: Request, res: Response, _next: NextFunction) => {
  const usernames = await usernameService.getAllUsernames();
  const topUsers = await usernameService.getTopUsers(10);
  const usernamesWithEmoji = await Promise.all(
    usernames.map(async (username) => ({
      ...username,
      emoji: await emojiService.getEmoji(username.score, topUsers),
    })),
  );
  resFn(res, {
    status: 200,
    message: 'Usernames fetched successfully',
    data: usernamesWithEmoji,
    error: '',
    success: true,
  });
});

const getUsernameById = asyncFn(async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const username = await usernameService.get(Number(id));
  if (!username) {
    return resFn(res, {
      status: 404,
      message: 'Username not found',
      data: null,
      error: 'Username not found',
      success: false,
    });
  }
  const topUsers = await usernameService.getTopUsers(10);
  const usernameWithEmoji = {
    ...username,
    emoji: await emojiService.getEmoji(username.score, topUsers),
  };
  resFn(res, {
    status: 200,
    message: 'Username fetched successfully',
    data: usernameWithEmoji,
    error: '',
    success: true,
  });
});

const searchUsernames = asyncFn(async (req: Request, res: Response, _next: NextFunction) => {
  const { query } = req.query;
  const usernames = await usernameService.searchUsernames(query as string);
  const topUsers = await usernameService.getTopUsers(10);
  const usernamesWithEmoji = await Promise.all(
    usernames.map(async (username) => ({
      ...username,
      emoji: await emojiService.getEmoji(username.score, topUsers),
    })),
  );

  resFn(res, {
    status: 200,
    message: 'Usernames fetched successfully',
    data: usernamesWithEmoji,
    error: '',
    success: true,
  });
});

const searchUsernamesSortedByScore = asyncFn(async (req: Request, res: Response, _next: NextFunction) => {
  const { query } = req.query;
  const usernames = await usernameService.searchUsernamesSortedByScore(query as string);
  const topUsers = await usernameService.getTopUsers(10);
  const usernamesWithEmoji = await Promise.all(
    usernames.map(async (username) => ({
      ...username,
      emoji: await emojiService.getEmoji(username.score, topUsers),
    })),
  );
  resFn(res, {
    status: 200,
    message: 'Usernames fetched successfully',
    data: usernamesWithEmoji,
    error: '',
    success: true,
  });
});

const refreshUsername = asyncFn(async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const username = await usernameService.get(Number(id));
  if (!username) {
    return resFn(res, {
      status: 404,
      message: 'Username not found',
      data: null,
      error: 'Username not found',
      success: false,
    });
  }
  const reposData = await githubService.getGithubUserRepositories(username.username);
  const commits = await githubService.getGithubUserCommits(username.username, reposData);
  const pullRequests = await githubService.getGithubUserPullRequests(username.username);
  const userData = await githubService.getGithubUserInformation(username.username);
  const favLanguage = await githubService.getGithubUserFavLanguage(reposData);
  const score = await scoreService.calculateScore({
    reposData,
    commits,
    pullRequests,
  });
  const ai_description = await aiService.generateAiDescription(username);
  const ai_nickname = await aiService.generateAiNickname(username);
  const updatedUsername = await usernameService.updateUsername({
    username: username.username,
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
  resFn(res, {
    status: 200,
    message: 'Username updated successfully',
    data: updatedUsername,
    error: '',
    success: true,
  });
});

export default { createUsername, getUsernames, getUsernameById, searchUsernames, searchUsernamesSortedByScore, refreshUsername };
