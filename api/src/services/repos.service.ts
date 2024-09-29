import { Repo } from '@models/repos.model';
import { Username } from '@models/username.model';
import { In } from 'typeorm';

const getReposByUsername = async (username: string) => {
  const usernameId = await Username.findOne({ where: { username } });
  if (!usernameId) {
    throw new Error('Username not found');
  }

  const repos = await Repo.find({ where: { username_id: usernameId.id } });
  return repos;
};

const getReposByUsernameId = async (usernameId: number) => {
  const repos = await Repo.find({ where: { username_id: usernameId } });
  return repos;
};

const getAllRepos = async () => {
  const repos = await Repo.find();
  return repos;
};

const createRepo = async (repo: Repo) => {
  const newRepo = await Repo.create(repo);
  return newRepo;
};

const createMultipleRepos = async (repos: Repo[]) => {
  const githubIds = repos.map((repo) => repo.github_id);
  const existingRepos = await Repo.find({ where: { github_id: In(githubIds) } });
  const existingGithubIds = new Set(existingRepos.map((repo) => repo.github_id));

  const newRepos = repos
    .filter((repo) => !existingGithubIds.has(repo.github_id))
    .map((repo) => {
      const newRepo = new Repo();
      newRepo.username_id = repo.username_id;
      newRepo.name = repo.name;
      newRepo.description = repo.description;
      newRepo.github_url = repo.github_url;
      newRepo.github_id = repo.github_id;
      newRepo.stars = repo.stars;
      newRepo.forks = repo.forks;
      newRepo.issues = repo.issues;
      newRepo.pull_requests = repo.pull_requests;
      newRepo.commits = repo.commits;
      newRepo.comments = repo.comments;
      newRepo.created_at = new Date();
      return newRepo;
    });

  await Repo.save(newRepos);
  return newRepos;
};

const updateRepo = async (repo: Repo) => {
  const updatedRepo = await Repo.update(repo.id, repo);
  return updatedRepo;
};

export default { getReposByUsername, getAllRepos, createRepo, updateRepo, createMultipleRepos, getReposByUsernameId };
