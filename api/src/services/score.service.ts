import { Username } from '@models/username.model';
import { IScoreDataProps } from '@Itypes/score.interface';

const calculateScore = async (data: IScoreDataProps) => {
  const { reposData, commits: commitsData, pullRequests: pullRequestsData } = data;

  let forks = 0;
  let stars = 0;
  let issues = 0;
  let pullRequests = 0;
  let commits = 0;
  let repos = 0;

  for (const repo of reposData) {
    forks += repo.forks_count;
    stars += repo.stargazers_count;
    issues += repo.open_issues_count;
    pullRequests += pullRequestsData.length;
    commits += commitsData.length;
    repos += 1;
  }

  const score = forks * 1 + stars * 3 + issues * 1 + pullRequests * 2 + commits * 1 + repos * 2;

  return score;
};

const getTopScore = async () => {
  const topUser = await Username.findOne({
    order: { score: 'DESC' },
  });
  return topUser?.score ?? 0;
};

export default { calculateScore, getTopScore };
