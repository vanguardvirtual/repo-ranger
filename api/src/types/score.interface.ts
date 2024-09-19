import { GithubPullRequest, GithubRepo, GithubUserCommits } from '@Itypes/github.interface';

export interface IScoreDataProps {
  reposData: GithubRepo[];
  commits: GithubUserCommits[];
  pullRequests: GithubPullRequest[];
}
