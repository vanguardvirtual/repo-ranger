export interface IUser {
  id: number;
  username: string;
  score: number;
  location: string;
  fav_language: string;
  contributions: number;
  avatar: string;
  bio: string;
  name: string;
  emoji: string;
}

export interface GitHubUser {
  login: string;
  url: string;
  html_url: string;
  name: string;
  avatar_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  repos_url: string;
  bio: string;
  location: string;
  blog: string;
  twitter_username: string;
}

export interface GitHubFollower {
  login: string;
  avatar_url: string;
}

export interface GitHubRepo {
  name: string;
  html_url: string;
  description: string;
}

export interface GitHubGist {
  id: string;
  html_url: string;
  description: string;
}

export interface GitHubStarred {
  name: string;
  html_url: string;
  description: string;
}

export interface GitHubUserData {
  user: GitHubUser;
  followers: GitHubFollower[];
  following: GitHubFollower[];
  repos: GitHubRepo[];
  gists: GitHubGist[];
  starred: GitHubStarred[];
}

export interface IRefreshUserResponse {
  username: IUser;
}

export interface ICreateUserResponse {
  message: string;
  username: IUser;
}

export interface ICreateUser {
  username: string;
}
