import { useQuery } from 'react-query';
import { GitHubUser, GitHubUserData } from '../types';
import endpoints from '@config/endpoints';
import { apiCallWithToken } from '@api/apiCall';

const fetchGitHubUserData = async (username: string): Promise<GitHubUserData> => {
  const userResponse = await apiCallWithToken.get(`${endpoints.GITHUB_API_BASE}/users/${username}`);
  if (userResponse.status !== 200) {
    throw new Error('Failed to fetch GitHub user data');
  }
  const userData: GitHubUser = userResponse.data;

  const [followersResponse, followingResponse, reposResponse, gistsResponse, starredResponse] = await Promise.all([
    apiCallWithToken.get(userData.followers_url),
    apiCallWithToken.get(userData.following_url.replace('{/other_user}', '')),
    apiCallWithToken.get(userData.repos_url),
    apiCallWithToken.get(userData.gists_url.replace('{/gist_id}', '')),
    apiCallWithToken.get(userData.starred_url.replace('{/owner}{/repo}', '')),
  ]);

  if (
    followersResponse.status !== 200 ||
    followingResponse.status !== 200 ||
    reposResponse.status !== 200 ||
    gistsResponse.status !== 200 ||
    starredResponse.status !== 200
  ) {
    throw new Error('Failed to fetch additional GitHub data');
  }

  const [followers, following, repos, gists, starred] = await Promise.all([
    followersResponse.data,
    followingResponse.data,
    reposResponse.data,
    gistsResponse.data,
    starredResponse.data,
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
