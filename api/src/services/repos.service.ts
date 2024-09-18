import { Repo } from '@/models/repos.model';
import { Username } from '@/models/username.model';
import { asyncFnData } from '@/utils';

const getReposByUsername = asyncFnData(async (username: string) => {
  const usernameId = await Username.findOne({ where: { username } });
  if (!usernameId) {
    return {
      success: false,
      data: null,
      error: 'Username not found',
    };
  }

  const repos = await Repo.find({ where: { username_id: usernameId.id } });
  return {
    success: true,
    data: repos,
    error: '',
  };
});

const getAllRepos = asyncFnData(async () => {
  const repos = await Repo.find();
  return {
    success: true,
    data: repos,
    error: '',
  };
});

const createRepo = asyncFnData(async (repo: Repo) => {
  const newRepo = await Repo.create(repo);
  return {
    success: true,
    data: newRepo,
    error: '',
  };
});

const updateRepo = asyncFnData(async (repo: Repo) => {
  const updatedRepo = await Repo.update(repo.id, repo);
  return {
    success: true,
    data: updatedRepo,
    error: '',
  };
});

export default { getReposByUsername, getAllRepos, createRepo, updateRepo };
