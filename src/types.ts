export interface IUser {
  id: number;
  username: string;
  location: string;
  fav_language: string;
  contributions: number;
  avatar: string;
  bio: string;
  email: string;
  name: string;
  ai_description?: string;
  ai_nickname?: string;
  followers: number;
  following: number;
  github_url?: string;
  twitter_username?: string;
  ai_description_updated_at?: Date;
  score: number;
  extra_score: number;
  repos: IRepo[];
}

export interface IRepo {
  id: number;
  username_id: number;
  name: string;
  description: string;
  github_url: string;
  github_id?: number;
  stars: number;
  forks: number;
  issues: number;
  pull_requests: number;
  commits: number;
  comments: number;
  created_at?: Date;
  username: IUser;
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

export interface ScorePopupProps {
  user: IUser;
  onClickHandler: () => void;
}

export interface ChatMessageLive {
  id: number;
  username: string;
  message: string;
  timestamp: string;
}
export interface ChatMessage {
  id: number;
  username: string;
  message: string;
  created_at: string; // Update this line
}

export interface IResponse<T = any> {
  status: number;
  success: boolean;
  error: string;
  data: T;
  message: string;
}
