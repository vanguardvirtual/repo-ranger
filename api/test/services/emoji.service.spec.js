import emojiService from '@/services/emoji.service';
import usernameService from '@/services/username.service';
jest.mock('@/models/username.model');
jest.mock('@/services/username.service', () => ({
  getTopUsers: jest.fn().mockResolvedValue([
    {
      score: 1700,
    },
    {
      score: 1600,
    },
    {
      score: 1500,
    },
    {
      score: 1400,
    },
    {
      score: 1300,
    },
    {
      score: 1200,
    },
    {
      score: 1130,
    },
    {
      score: 1120,
    },
    {
      score: 1110,
    },
    {
      score: 1105,
    },
    {
      score: 1100,
    },
    {
      score: 1050,
    },
    {
      score: 900,
    },
    {
      score: 800,
    },
    {
      score: 700,
    },
    {
      score: 600,
    },
    {
      score: 500,
    },
    {
      score: 400,
    },
    {
      score: 300,
    },
    {
      score: 200,
    },
    {
      score: 100,
    },
    {
      score: 50,
    },
  ]),
}));
describe('emojiService', () => {
  describe('getEmoji', () => {
    it('should return 😂 for the top user', async () => {
      const topUsers = await usernameService.getTopUsers(10);
      const emoji = emojiService.getEmoji(2000, topUsers);
      expect(emoji).toBe('😂');
    });
    it('should return 🌟 for the 2nd user to 10th user', async () => {
      const topUsers = await usernameService.getTopUsers(10);
      const emoji = emojiService.getEmoji(1200, topUsers);
      expect(emoji).toBe('🌟');
    });
    it('should return 👏 for scores above 1000', async () => {
      const topUsers = await usernameService.getTopUsers(10);
      const emoji = emojiService.getEmoji(1050, topUsers);
      expect(emoji).toBe('👏');
    });
    it('should return 💩 if the score is less than 1000', async () => {
      const topUsers = await usernameService.getTopUsers(10);
      const emoji = emojiService.getEmoji(500, topUsers);
      expect(emoji).toBe('💩');
    });
  });
});
