import axios from 'axios';
import { Username } from '@/model';

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
}> => {
  try {
    const baseUrl = 'https://api.github.com/users/';
    const userResponse = await axios.get(`${baseUrl}${username}`);
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
    const favoriteLanguage = Object.entries(languageCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

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
    };
  } catch (error) {
    console.error('Error retrieving GitHub information for user:', username);
    return {
      score: 0,
      country: 'Unknown',
      favoriteLanguage: 'Unknown',
      contributions: 0,
      status: 404,
      bio: '',
      avatar: '',
      name: '',
    };
  }
};

async function getTopScores(): Promise<number[]> {
  const users = await Username.find({
    select: ['score'],
    order: { score: 'DESC' },
    take: 10,
  });
  return users.map((user) => user.score);
}

export const getEmoji = async (score: number): Promise<string> => {
  const topScores = await getTopScores();
  if (topScores.includes(score)) return '🌟';
  if (score >= 1000) return '👏';
  return '💩';
};
