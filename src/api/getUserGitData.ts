import { useQuery } from 'react-query';
import { GitHubUser, GitHubUserData } from '../types';
import endpoints from '@config/endpoints';

const fetchGitHubUserData = async (username: string): Promise<GitHubUserData> => {
  const userResponse = await fetch(`${endpoints.GITHUB_API_BASE}/users/${username}`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_GITHUB_ACCESS_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  if (!userResponse.ok) {
    throw new Error('Failed to fetch GitHub user data');
  }
  const userData: GitHubUser = await userResponse.json();

  const [followersResponse, followingResponse, reposResponse, gistsResponse, starredResponse] = await Promise.all([
    fetch(userData.followers_url),
    fetch(userData.following_url.replace('{/other_user}', '')),
    fetch(userData.repos_url),
    fetch(userData.gists_url.replace('{/gist_id}', '')),
    fetch(userData.starred_url.replace('{/owner}{/repo}', '')),
  ]);

  if (!followersResponse.ok || !followingResponse.ok || !reposResponse.ok || !gistsResponse.ok || !starredResponse.ok) {
    throw new Error('Failed to fetch additional GitHub data');
  }

  const [followers, following, repos, gists, starred] = await Promise.all([
    followersResponse.json(),
    followingResponse.json(),
    reposResponse.json(),
    gistsResponse.json(),
    starredResponse.json(),
  ]);

  return {
    user: userData,
    followers,
    following,
    repos,
    gists,
    starred,
  };
};

const useGetGitHubUserData = (username: string) => useQuery(['github-user-data', username], () => fetchGitHubUserData(username));

export default useGetGitHubUserData;
