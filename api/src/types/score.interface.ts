import { GithubPullRequest, GithubRepo, GithubUserCommits } from '@/types/github.interface';

export interface IScoreDataProps {
  reposData: GithubRepo[];
  commits: GithubUserCommits[];
  pullRequests: GithubPullRequest[];
}
