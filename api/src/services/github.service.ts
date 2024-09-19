import { GithubGetAllDataResponse, GithubRepo, GithubUser, GithubUserCommits } from '@Itypes/github.interface';
import { logger } from '@utils/utils';
import axios from 'axios';

const getGithubUserInformation = async (username: string): Promise<GithubUser> => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return response.data;
  } catch (error) {
    logger('error', JSON.stringify(error));
    throw new Error('Failed to get user data');
  }
};

const getGithubUserRepositories = async (username: string): Promise<GithubRepo[]> => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return response.data;
  } catch (error) {
    logger('error', JSON.stringify(error));
    throw new Error('Failed to get user data');
  }
};

const getGithubUserFollowers = async (username: string): Promise<GithubUser[]> => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}/followers`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return response.data;
  } catch (error) {
    logger('error', JSON.stringify(error));
    throw new Error('Failed to get user data');
  }
};

const getGithubUserFollowing = async (username: string): Promise<GithubUser[]> => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}/following`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return response.data;
  } catch (error) {
    logger('error', JSON.stringify(error));
    throw new Error('Failed to get user data');
  }
};

const getGithubUserCommits = async (username: string, repos: GithubRepo[]): Promise<GithubUserCommits[]> => {
  try {
    const commits = [];
    for (let i = 0; i < Math.min(repos.length, 10); i++) {
      const repo = repos[i];
      if (!repo) {
        continue;
      }
      const response = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&per_page=100`, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      for (const commit of response.data) {
        commits.push(commit);
      }
    }
    return commits;
  } catch (error) {
    logger('error', JSON.stringify(error));
    throw new Error('Failed to get user data');
  }
};

const getGithubUserPullRequests = async (username: string) => {
  try {
    const response = await axios.get(`https://api.github.com/search/issues?q=author:${username}+is:pr`);
    return response.data.items;
  } catch (error) {
    logger('error', JSON.stringify(error));
    throw new Error('Failed to get user data');
  }
};

const getGithubUserFavLanguage = async (reposData: GithubRepo[]) => {
  const languageCounts: Record<string, number> = {};
  for (const repo of reposData) {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  }
  const favoriteLanguage =
    Object.entries(languageCounts).length > 0 ? Object.entries(languageCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0] : 'Unknown';

  return favoriteLanguage;
};

const getGithubUserAllData = async (username: string): Promise<GithubGetAllDataResponse> => {
  const reposData = await getGithubUserRepositories(username);
  const followersData = await getGithubUserFollowers(username);
  const followingData = await getGithubUserFollowing(username);
  const commitsData = await getGithubUserCommits(username, reposData);
  const pullRequestsData = await getGithubUserPullRequests(username);

  return {
    followers: followersData.length,
    following: followingData.length,
    contributions: commitsData.length,
    commits: commitsData.length,
    pullRequests: pullRequestsData.data,
  };
};

export default {
  getGithubUserInformation,
  getGithubUserRepositories,
  getGithubUserFollowers,
  getGithubUserFollowing,
  getGithubUserPullRequests,
  getGithubUserAllData,
  getGithubUserCommits,
  getGithubUserFavLanguage,
};
