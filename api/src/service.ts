import axios from 'axios';
import { Username } from '@/model';
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const retrieveGithubInformation = async (
  username: string,
): Promise<{
  score: number;
  country: string;
  favoriteLanguage: string;
  contributions: number;
  status: number;
  bio: string;
  avatar: string;
  name: string;
  followers: number;
  following: number;
  github_url: string;
  twitter_username: string;
}> => {
  const baseUrl = 'https://api.github.com/users/';
  const userResponse = await axios.get(`${baseUrl}${username}`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  const userData = userResponse.data;

  if (userResponse.status === 404) {
    return {
      score: 0,
      country: 'Unknown',
      favoriteLanguage: 'Unknown',
      contributions: 0,
      status: 404,
      bio: '',
      avatar: '',
      name: '',
      followers: 0,
      following: 0,
      github_url: '',
      twitter_username: '',
    };
  }

  const reposResponse = await axios.get(userData.repos_url);
  const reposData = reposResponse.data;

  let score = 0;
  let contributions = 0;
  const languageCounts: { [key: string]: number } = {};

  // Followers: +3 points each
  score += userData.followers * 3;

  // Following: -1 point each
  score -= userData.following;

  // Repositories: +2 points each
  score += reposData.length * 2;

  // Stars, Forks, and other metrics
  for (const repo of reposData) {
    score += repo.stargazers_count * 2; // Stars: +2 points each
    score += repo.forks_count; // Forks: +1 point each
  }

  // Calculate favorite language
  for (const repo of reposData) {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  }
  const favoriteLanguage =
    Object.entries(languageCounts).length > 0 ? Object.entries(languageCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0] : 'Unknown';

  // Count contributions
  const eventsResponse = await axios.get(`${baseUrl}${username}/events`);
  const eventsData = eventsResponse.data;

  for (const event of eventsData) {
    if (event.type === 'PushEvent') {
      contributions++;
      score++;
    }
    if (event.type === 'PullRequestEvent') score += 2; // Pull Requests: +2 points each
    if (event.type === 'IssuesEvent') score++; // Issues: +1 point each
    if (event.type === 'IssueCommentEvent') score++; // Comments: +1 point each
  }

  return {
    score,
    country: userData.location || 'Unknown',
    favoriteLanguage,
    contributions,
    status: userResponse.status,
    bio: userData.bio || '',
    avatar: userData.avatar_url || '',
    name: userData.name || '',
    followers: userData.followers || 0,
    following: userData.following || 0,
    github_url: userData.html_url || '',
    twitter_username: userData.twitter_username || '',
  };
};

export const getTopScore = async (): Promise<number> => {
  const topUser = await Username.findOne({
    order: { score: 'DESC' },
  });
  return topUser?.score ?? 0;
};

export const getTopUsers = async (limit: number): Promise<Username[]> => {
  const topUsers = await Username.find({
    order: { score: 'DESC' },
    take: limit,
  });
  return topUsers;
};

export const getEmoji = async (score: number): Promise<string> => {
  const topUsers = await getTopUsers(10);

  if (topUsers) {
    if (topUsers.length === 0) {
      return '💩'; // Default emoji if no users exist
    }

    const userRank = topUsers.findIndex((user) => user.score === score) + 1;

    if (userRank === 1) {
      return '😂'; // Top 1 user gets laugh face
    }

    if (userRank >= 2 && userRank <= 10) {
      return '🌟'; // Top 2-10 users get star
    }

    if (score >= 1000) {
      return '👏';
    }
  }
  return '💩';
};

export const generateAiDescription = async (user: Username): Promise<string> => {
  const isTop10 = (await getEmoji(user.score)) !== '💩';
  const isTop1 = (await getEmoji(user.score)) === '😂';
  const location = user.location === 'Unknown' ? 'an unknown place' : user.location;
  const favLanguage =
    user.fav_language === 'Unknown' ? 'they dont have a favorite language' : `their favorite language is ${user.fav_language}`;
  const bio = user.bio === 'Unknown' ? '' : `and their bio is "${user.bio}"`;

  let top10Sentence = 'they are not in the top 10';
  if (isTop1) {
    top10Sentence = 'they are the top user';
  }
  if (isTop10) {
    top10Sentence = 'they are in the top 10';
  }

  const msg: Anthropic.Messages.Message = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1000,
    temperature: 0,
    system:
      'I have created a website called Repo-Ranger, users put their Github username and we calculate a score based on some attributes of their Github Profile. We have a scoreboard on the frontend and the users are ordered by their score. The user also get an emoji based on their score. They get 💩 if they have bellow 1000 score, they get 👏 if the get above 1000 and 🌟 if they are in the top 10. If the user is first they get 😂. Keep the answers short and concise (max 1 line) and add emojis where applicable, try to be funny and sarcastic. I want you to generate a sentence that describes the user.',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Generate a sentence that discribes the user "${user.username}", they have a score of ${user.score} and ${top10Sentence}. The user is from ${location} and ${favLanguage}. They have ${user.followers} followers ${bio}"`,
          },
        ],
      },
    ],
  });

  return msg?.content[0] && 'text' in msg.content[0]
    ? msg.content[0].text
    : "That user has such a bad profile that we couldn't generate a description for them. 💩";
};

export const generateAiNickname = async (user: Username): Promise<string> => {
  if (user.ai_nickname) {
    return user.ai_nickname;
  }

  const ai_description = user.ai_description;
  const username = user.name;
  const handle = user.username;

  const msg = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 100,
    temperature: 0.2,
    system: 'I want you to response with just the nickname nothing else. Be sarcastic and funny, you can use an emoji as well.',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Generate a nickname for ${username} his handle is ${handle} and a small description about him is ${ai_description}`,
          },
        ],
      },
    ],
  });

  const nickname = msg?.content[0] && 'text' in msg.content[0] ? msg.content[0].text : '';

  user.ai_nickname = nickname;
  user.save();

  return nickname;
};

export const getUserByUsername = async (username: string): Promise<Username | null> => {
  const user = await Username.findOne({
    where: { username },
  });
  return user;
};

export const getRandomUser = async (): Promise<Username | null> => {
  const user = await Username.createQueryBuilder('user').select().orderBy('RAND()').getOne();
  return user;
};
