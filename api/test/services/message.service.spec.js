import messageService from '@/services/message.service';
jest.mock('@/models/message.model');
describe('messageService', () => {
  describe('getLatestChatMessages', () => {
    it('should return the latest chat messages', async () => {
      const messages = await messageService.getLatestChatMessages();
      expect(messages).toBeDefined();
    });
  });
  describe('getOlderChatMessages', () => {
    it('should return the older chat messages', async () => {
      const messages = await messageService.getOlderChatMessages(1);
      expect(messages).toBeDefined();
    });
    it('should return an empty array if the oldest message id is not found', async () => {
      const messages = await messageService.getOlderChatMessages(999999);
      expect(messages).toEqual([]);
    });
  });
  describe('saveChatMessage', () => {
    it('should save the chat message', async () => {
      const message = await messageService.saveChatMessage('Hello, world!', 'AkisKourouklis');
      expect(message).toBeDefined();
    });
  });
  describe('getChatMessages', () => {
    it('should return the chat messages', async () => {
      const messages = await messageService.getChatMessages();
      expect(messages).toBeDefined();
    });
  });
});
