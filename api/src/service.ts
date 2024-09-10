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
    };
  } catch (error) {
    console.error('Error retrieving GitHub information for user:', username, error);
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

async function getTopScore(): Promise<number> {
  try {
    const topUser = await Username.findOne({
      order: { score: 'DESC' },
    });
    return topUser?.score ?? 0;
  } catch (error) {
    console.error('Error in getTopScore:', error);
    return 0;
  }
}

async function getTopUsers(limit: number): Promise<Username[]> {
  try {
    const topUsers = await Username.find({
      order: { score: 'DESC' },
      take: limit,
    });
    return topUsers;
  } catch (error) {
    console.error('Error in getTopUsers:', error);
    return [];
  }
}

export const getEmoji = async (score: number): Promise<string> => {
  const topUsers = await getTopUsers(10);

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

  return '💩';
};
