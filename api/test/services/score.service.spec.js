import scoreService from '@/services/score.service';
import { Username } from '@/models/username.model';
jest.mock('@/models/username.model');
describe('Score Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('calculateScore', () => {
    it('should calculate score correctly', async () => {
      const mockRepo = {
        id: 1,
        node_id: 'node1',
        name: 'repo1',
        full_name: 'user/repo1',
        forks_count: 5,
        stargazers_count: 10,
        open_issues_count: 3,
        // Add other required properties as needed
      };
      const mockData = {
        reposData: [mockRepo, { ...mockRepo, id: 2, forks_count: 2, stargazers_count: 7, open_issues_count: 1 }],
        commits: [],
        pullRequests: [],
      };
      const expectedScore = 66;
      const result = await scoreService.calculateScore(mockData);
      expect(result).toBe(expectedScore);
    });
    it('should return 0 for empty data', async () => {
      const emptyData = {
        reposData: [],
        commits: [],
        pullRequests: [],
      };
      const result = await scoreService.calculateScore(emptyData);
      expect(result).toBe(0);
    });
  });
  describe('getTopScore', () => {
    it('should return the top score', async () => {
      const mockTopUser = { score: 100 };
      Username.findOne.mockResolvedValue(mockTopUser);
      const result = await scoreService.getTopScore();
      expect(result).toBe(100);
      expect(Username.findOne).toHaveBeenCalledWith({ order: { score: 'DESC' } });
    });
    it('should return 0 if no users found', async () => {
      Username.findOne.mockResolvedValue(null);
      const result = await scoreService.getTopScore();
      expect(result).toBe(0);
      expect(Username.findOne).toHaveBeenCalledWith({ order: { score: 'DESC' } });
    });
  });
});
