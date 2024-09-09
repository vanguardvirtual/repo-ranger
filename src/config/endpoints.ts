export const API_URL = import.meta.env.PROD ? 'https://reporanger.xyz/api' : 'http://localhost:3000/api';

export default {
  GET_ALL_USERS: `${API_URL}/`,
  GET_USER_BY_ID: `${API_URL}/:id`,
  CREATE_USER: `${API_URL}/create`,
  REFRESH_SCORE: `${API_URL}/refresh/:id`,
  GITHUB_API_BASE: 'https://api.github.com',
};
