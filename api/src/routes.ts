import express from 'express';
import {
  createUsername,
  getUsernames,
  refreshScore,
  getUsernameById,
  searchUsernames,
  getLatestChatMessages,
  getOlderChatMessages,
  sendExampleTweet,
  examlpeUpdateTweetsPerformance,
} from '@/controller';

export const router = express.Router();

router.post('/create', createUsername);
router.get('/', getUsernames);
router.get('/refresh/:id', refreshScore);
router.get('/single/:id', getUsernameById);
router.get('/search', searchUsernames);
router.get('/example-tweet', sendExampleTweet);
router.get('/example-update-tweets-performance', examlpeUpdateTweetsPerformance);

router.get('/chat/messages', getLatestChatMessages);
router.get('/chat/messages/:oldestMessageId', getOlderChatMessages);
