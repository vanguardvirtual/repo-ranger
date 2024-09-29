export interface UsernameDTO {
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
  created_at?: Date;
  updated_at?: Date;
}
