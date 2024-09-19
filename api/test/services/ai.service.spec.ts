import { Username } from '@/models/username.model';
import aiService from '@/services/ai.service';

jest.mock('@/models/username.model', () => {
  return {
    Username: jest.fn().mockImplementation(() => ({
      username: 'mockuser',
      score: 1000,
      location: 'New York',
      fav_language: 'JavaScript',
      contributions: 100,
      avatar: 'https://example.com/avatar.png',
      bio: 'I am a test user',
      name: 'Test User',
      followers: 1000,
      following: 500,
      github_url: 'https://github.com/testuser',
      twitter_username: 'testuser',
      ai_description: 'I am a test user',
      ai_nickname: 'testuser',
      ai_description_updated_at: new Date(),
      extra_score: 0,
      email: 'testuser@example.com',
    })),
  };
});
jest.mock('@/services/username.service');
jest.mock('@/services/ai.service');

describe('aiService', () => {
  describe('generateAiDescription', () => {
    it('should generate a description for a user', async () => {
      const user = new Username();

      const description = await aiService.generateAiDescription(user);
      expect(description).not.toBe('');
    });
  });

  describe('generateAiNickname', () => {
    it('should generate a nickname for a user', async () => {
      const user = new Username();

      const nickname = await aiService.generateAiNickname(user);
      expect(nickname).not.toBe('');
    });
  });
});
