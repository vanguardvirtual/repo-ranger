import { asyncFn, resFn } from '@/utils';
import { NextFunction, Request, Response } from 'express';
import messageService from '@/services/message.service';

const getLatestChatMessages = asyncFn(async (_req: Request, res: Response, _next: NextFunction) => {
  const messages = await messageService.getLatestChatMessages();
  resFn(res, {
    data: messages.reverse(),
    message: 'Messages fetched',
    status: 200,
    success: true,
    error: '',
  });
});

const getOlderChatMessages = asyncFn(async (req: Request, res: Response, _next: NextFunction) => {
  const { oldestMessageId } = req.params;
  const messages = await messageService.getOlderChatMessages(Number(oldestMessageId));
  resFn(res, {
    data: messages.reverse(),
    message: 'Messages fetched',
    status: 200,
    success: true,
    error: '',
  });
});

export default {
  getLatestChatMessages,
  getOlderChatMessages,
};
