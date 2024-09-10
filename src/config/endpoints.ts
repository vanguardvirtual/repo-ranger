export const API_URL = import.meta.env.PROD ? 'https://api.reporanger.xyz' : 'http://localhost:3000';

export default {
  GET_ALL_USERS: `${API_URL}/api/`,
  GET_USER_BY_ID: `${API_URL}/api/single`,
  CREATE_USER: `${API_URL}/api/create`,
  REFRESH_SCORE: `${API_URL}/api/refresh`,
  SEARCH_USERS: `${API_URL}/api/search`,
  GITHUB_API_BASE: 'https://api.github.com',
};
