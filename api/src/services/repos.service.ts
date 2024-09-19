import { Repo } from '@/models/repos.model';
import { Username } from '@/models/username.model';

const getReposByUsername = async (username: string) => {
  const usernameId = await Username.findOne({ where: { username } });
  if (!usernameId) {
    throw new Error('Username not found');
  }

  const repos = await Repo.find({ where: { username_id: usernameId.id } });
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

const updateRepo = async (repo: Repo) => {
  const updatedRepo = await Repo.update(repo.id, repo);
  return updatedRepo;
};

export default { getReposByUsername, getAllRepos, createRepo, updateRepo };
