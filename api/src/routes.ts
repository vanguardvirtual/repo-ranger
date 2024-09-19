import express from 'express';
import usernameController from '@/controllers/username.controller';
import messageController from '@/controllers/message.controller';
import twitterController from '@/controllers/twitter.controller';

export const router = express.Router();

router.post('/create', usernameController.createUsername);
router.get('/', usernameController.getUsernames);
router.get('/single/:id', usernameController.getUsernameById);
router.get('/search', usernameController.searchUsernamesSortedByScore);
router.get('/example-tweet', twitterController.sendExampleTweet);
router.get('/example-update-tweets-performance', twitterController.updateTweetsPerformance);

router.get('/chat/messages', messageController.getLatestChatMessages);
router.get('/chat/messages/:oldestMessageId', messageController.getOlderChatMessages);
