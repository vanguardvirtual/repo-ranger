import { ChatMessage } from '@/models/message.model';
import { LessThan } from 'typeorm';

const getLatestChatMessages = async () => {
  const messages =
    (await ChatMessage.find({
      order: { created_at: 'DESC' },
      take: 50,
    })) || []; // Ensure messages is an array
  return messages.reverse();
};

const getOlderChatMessages = async (oldestMessageId: number) => {
  const oldestMessage = await ChatMessage.findOne({ where: { id: Number(oldestMessageId) } });
  if (!oldestMessage) {
    return [];
  }
  const messages = await ChatMessage.find({
    where: { created_at: LessThan(oldestMessage.created_at) },
  });
  return messages.reverse();
};

const saveChatMessage = async (message: string, username: string) => {
  const newMessage = new ChatMessage();
  newMessage.message = message;
  newMessage.username = username;
  await newMessage.save();
  return newMessage;
};

const getChatMessages = async () => {
  const messages = (await ChatMessage.find()) || []; // Ensure messages is an array
  return messages;
};

export default {
  getLatestChatMessages,
  getOlderChatMessages,
  saveChatMessage,
  getChatMessages,
};
