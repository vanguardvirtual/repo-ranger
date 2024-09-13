import { ChatMessage, Username } from '@/model';
import { generateAiDescription, retrieveGithubInformation } from '@/service';
import { Request, Response } from 'express';
import { getEmoji } from '@/service';
import { LessThan, Like } from 'typeorm';
import { asyncFn, resFn } from '@/utils';

export const createUsername = asyncFn(async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) {
    return resFn(res, {
      data: null,
      message: 'Username is required',
      status: 400,
      success: false,
      error: 'Username is required',
    });
  }

  const usernameExists = await Username.findOne({ where: { username } });

  if (usernameExists) {
    return resFn(res, {
      data: null,
      message: 'Username already exists',
      status: 400,
      success: false,
      error: 'Username already exists',
    });
  }

  const { score, country, favoriteLanguage, contributions, status, name, bio, avatar, followers, following } =
    await retrieveGithubInformation(username);

  if (status == 404) {
    return resFn(res, {
      data: null,
      message: 'User not found',
      status: 404,
      success: false,
      error: 'User not found',
    });
  }

  const newUsername = new Username();

  newUsername.username = username;
  newUsername.score = score;
  newUsername.location = country;
  newUsername.fav_language = favoriteLanguage;
  newUsername.contributions = contributions;
  newUsername.name = name;
  newUsername.bio = bio;
  newUsername.avatar = avatar;
  newUsername.followers = followers;
  newUsername.following = following;

  await newUsername.save();

  const aiDescription = await generateAiDescription(newUsername);
  newUsername.ai_description = aiDescription;
  newUsername.ai_description_updated_at = new Date();
  await newUsername.save();

  resFn(res, {
    data: newUsername,
    message: 'Username created',
    status: 200,
    success: true,
    error: '',
  });
});

export const getUsernames = asyncFn(async (req: Request, res: Response) => {
  const usernames = await Username.find();
  const usernamesWithEmoji = await Promise.all(
    usernames.map(async (username) => ({
      ...username,
      emoji: await getEmoji(username.score),
    })),
  );

  resFn(res, {
    data: usernamesWithEmoji,
    message: 'Usernames fetched',
    status: 200,
    success: true,
    error: '',
  });
});

export const getUsernameById = asyncFn(async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).json({
      message: 'Id is required',
    });
  }

  const username = await Username.findOne({ where: { id: Number(req.params.id) } });

  if (!username) {
    return resFn(res, {
      data: null,
      message: 'Username not found',
      status: 404,
      success: false,
      error: 'Username not found',
    });
  }

  const emoji = await getEmoji(username.score);

  resFn(res, {
    data: {
      ...username,
      emoji,
    },
    message: 'Username fetched',
    status: 200,
    success: true,
    error: '',
  });
});

export const searchUsernames = asyncFn(async (req: Request, res: Response) => {
  const { query } = req.query;

  const usernames = await Username.find({
    where: {
      username: Like(`%${query}%`),
    },
    order: {
      score: 'DESC',
    },
  });

  const usernamesWithEmoji = await Promise.all(
    usernames.map(async (username) => ({
      ...username,
      emoji: await getEmoji(username.score),
    })),
  );

  resFn(res, {
    data: usernamesWithEmoji,
    message: 'Usernames fetched',
    status: 200,
    success: true,
    error: '',
  });
});

export const refreshScore = asyncFn(async (req: Request, res: Response) => {
  const username = await Username.findOne({ where: { id: Number(req.params.id) } });

  if (!username) {
    return resFn(res, {
      data: null,
      message: 'Username not found',
      status: 404,
      success: false,
      error: 'Username not found',
    });
  }

  const { score, country, favoriteLanguage, contributions, name, bio, avatar, followers, following } = await retrieveGithubInformation(
    username.username,
  );

  username.score = score;
  username.location = country;
  username.fav_language = favoriteLanguage;
  username.contributions = contributions;
  username.name = name;
  username.bio = bio;
  username.avatar = avatar;
  username.followers = followers;
  username.following = following;

  await username.save();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  if (!username.ai_description_updated_at || username.ai_description_updated_at < oneWeekAgo) {
    username.ai_description = await generateAiDescription(username);
    username.ai_description_updated_at = new Date();
    await username.save();
  }

  resFn(res, {
    data: username,
    message: 'Username refreshed',
    status: 200,
    success: true,
    error: '',
  });
});

export const getLatestChatMessages = asyncFn(async (_req: Request, res: Response) => {
  const messages = await ChatMessage.find({
    order: { created_at: 'DESC' },
    take: 50,
  });
  resFn(res, {
    data: messages.reverse(),
    message: 'Messages fetched',
    status: 200,
    success: true,
    error: '',
  });
});

export const getOlderChatMessages = asyncFn(async (req: Request, res: Response) => {
  const { oldestMessageId } = req.params;
  const oldestMessage = await ChatMessage.findOne({ where: { id: Number(oldestMessageId) } });

  if (!oldestMessage) {
    return resFn(res, {
      data: null,
      message: 'Message not found',
      status: 404,
      success: false,
      error: 'Message not found',
    });
  }

  const olderMessages = await ChatMessage.find({
    where: { created_at: LessThan(oldestMessage.created_at) },
    order: { created_at: 'DESC' },
    take: 5,
  });

  resFn(res, {
    data: olderMessages.reverse(),
    message: 'Messages fetched',
    status: 200,
    success: true,
    error: '',
  });
});
