import reposService from '@services/repos.service';
import { Repo } from '@models/repos.model';
import { Username } from '@models/username.model';

jest.mock('@models/repos.model');
jest.mock('@models/username.model');

describe('Repos Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getReposByUsername', () => {
    it('should throw an error if username not found', async () => {
      (Username.findOne as jest.Mock).mockResolvedValue(null);
      await expect(reposService.getReposByUsername('test')).rejects.toThrow('Username not found');
    });

    it('should return repos for a valid username', async () => {
      const mockUsername = { id: 1, username: 'test' };
      const mockRepos = [
        { id: 1, name: 'repo1' },
        { id: 2, name: 'repo2' },
      ];
      (Username.findOne as jest.Mock).mockResolvedValue(mockUsername);
      (Repo.find as jest.Mock).mockResolvedValue(mockRepos);

      const result = await reposService.getReposByUsername('test');
      expect(result).toEqual(mockRepos);
      expect(Repo.find).toHaveBeenCalledWith({ where: { username_id: mockUsername.id } });
    });
  });

  describe('getAllRepos', () => {
    it('should return all repos', async () => {
      const mockRepos = [
        { id: 1, name: 'repo1' },
        { id: 2, name: 'repo2' },
      ];
      (Repo.find as jest.Mock).mockResolvedValue(mockRepos);

      const result = await reposService.getAllRepos();
      expect(result).toEqual(mockRepos);
      expect(Repo.find).toHaveBeenCalled();
    });
  });

  describe('createRepo', () => {
    it('should create a new repo', async () => {
      const mockRepo = { id: 1, name: 'newRepo' };
      (Repo.create as jest.Mock).mockResolvedValue(mockRepo);

      const result = await reposService.createRepo(mockRepo as Repo);
      expect(result).toEqual(mockRepo);
      expect(Repo.create).toHaveBeenCalledWith(mockRepo);
    });
  });

  describe('updateRepo', () => {
    it('should update an existing repo', async () => {
      const mockRepo = { id: 1, name: 'updatedRepo' };
      (Repo.update as jest.Mock).mockResolvedValue(mockRepo);

      const result = await reposService.updateRepo(mockRepo as Repo);
      expect(result).toEqual(mockRepo);
      expect(Repo.update).toHaveBeenCalledWith(mockRepo.id, mockRepo);
    });
  });

  describe('createMultipleRepos', () => {
    it('should create multiple repos', async () => {
      const mockRepos = [
        { id: 1, name: 'repo1' },
        { id: 2, name: 'repo2' },
      ];
      (Repo.create as jest.Mock).mockResolvedValue(mockRepos);
      const reposToSave = mockRepos.map((repo) => {
        const newRepo = new Repo();
        newRepo.id = repo.id;
        newRepo.name = repo.name;
        return newRepo;
      });
      const repos = await reposService.createMultipleRepos(reposToSave);
      expect(repos).toBeDefined();
    });
  });
});
