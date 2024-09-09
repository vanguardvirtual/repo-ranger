import { Username } from '@/model';
import { retrieveGithubInformation } from '@/service';
import { Request, Response } from 'express';
import { getEmoji } from '@/service';

export const createUsername = async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({
      message: 'Username is required',
    });
  }

  const { score, country, favoriteLanguage, contributions, status, name, bio, avatar } = await retrieveGithubInformation(username);

  if (status === 404) {
    return res.status(404).json({
      message: 'User not found',
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

  await newUsername.save();

  res.json({
    message: 'Username created',
    username: newUsername,
  });
};

export const getUsernames = async (req: Request, res: Response) => {
  const usernames = await Username.find();
  const usernamesWithEmoji = await Promise.all(
    usernames.map(async (username) => ({
      ...username,
      emoji: await getEmoji(username.score),
    })),
  );
  res.json({
    usernames: usernamesWithEmoji,
  });
};

export const getUsernameById = async (req: Request, res: Response) => {
  const username = await Username.findOne({ where: { id: Number(req.params.id) } });

  if (!username) {
    return res.status(404).json({
      message: 'Username not found',
    });
  }

  const emoji = await getEmoji(username.score);

  res.json({
    username: {
      ...username,
      emoji,
    },
  });
};

export const refreshScore = async (req: Request, res: Response) => {
  const username = await Username.findOne({ where: { id: Number(req.params.id) } });

  if (!username) {
    return res.status(404).json({
      message: 'Username not found',
    });
  }

  const { score, country, favoriteLanguage, contributions, name, bio, avatar } = await retrieveGithubInformation(username.username);

  username.score = score;
  username.location = country;
  username.fav_language = favoriteLanguage;
  username.contributions = contributions;
  username.name = name;
  username.bio = bio;
  username.avatar = avatar;

  await username.save();

  res.json({
    message: 'Score refreshed',
  });
};
