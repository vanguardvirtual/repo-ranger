import { Server, Socket } from 'socket.io';
import { Username, ChatMessage } from './model';
import { EntitySubscriberInterface, InsertEvent, UpdateEvent, EventSubscriber, DataSource } from 'typeorm';
import { logger } from '@/utils';

interface ChatMessageData {
  id: number;
  username: string;
  message: string;
  timestamp: string;
}

export function setupWebSockets(io: Server, dataSource: DataSource) {
  io.on('connection', async (socket: Socket) => {
    socket.on('set username', (username: string) => {
      socket.data.username = username;
    });

    socket.on('chat message', async (data: { username: string; message: string }) => {
      try {
        const newMessage = new ChatMessage();
        newMessage.username = data.username;
        newMessage.message = data.message;
        await newMessage.save();

        const chatMessageData: ChatMessageData = {
          id: newMessage.id,
          username: newMessage.username,
          message: newMessage.message,
          timestamp: newMessage.created_at.toISOString(),
        };

        io.emit('chat message', chatMessageData);
      } catch (error) {
        logger('error', `Error saving chat message: ${error}`);
      }
    });

    socket.on('load more messages', async (oldestMessageId: number) => {
      try {
        const olderMessages = await ChatMessage.find({
          where: { id: oldestMessageId },
          order: { created_at: 'DESC' },
          take: 5,
        });

        const chatMessageData: ChatMessageData[] = olderMessages.map((msg) => ({
          id: msg.id,
          username: msg.username,
          message: msg.message,
          timestamp: msg.created_at.toISOString(),
        }));

        socket.emit('chat history', chatMessageData.reverse());
      } catch (error) {
        logger('error', `Error fetching older messages: ${error}`);
      }
    });

    // Send the latest 50 messages to the newly connected client
    try {
      const latestMessages = await ChatMessage.find({
        order: { created_at: 'DESC' },
        take: 50,
      });

      const chatMessageData: ChatMessageData[] = latestMessages.map((msg) => ({
        id: msg.id,
        username: msg.username,
        message: msg.message,
        timestamp: msg.created_at.toISOString(),
      }));

      socket.emit('chat history', chatMessageData.reverse());
    } catch (error) {
      logger('error', `Error fetching latest messages: ${error}`);
    }

    const interval = setInterval(async () => {
      try {
        const randomUser = await Username.createQueryBuilder('username').orderBy('RAND()').getOne();

        if (randomUser) {
          sendUserNotification(socket, randomUser);
        }
      } catch (error) {
        logger('error', `Error fetching random user: ${error}`);
      }
    }, 15000);

    socket.on('disconnect', () => {
      logger('info', 'User disconnected');
      clearInterval(interval);
    });
  });

  // Check if dataSource is properly initialized and has subscribers
  if (dataSource && dataSource.subscribers) {
    dataSource.subscribers.push(new UsernameSubscriber(io));
  } else {
    logger('error', 'DataSource is not properly initialized or lacks subscribers property');
  }
}

const sendUserNotification = (socket: any, user: Username) => {
  const notification = {
    avatar: user.avatar,
    ai_description: user.ai_description,
    username: user.username,
    score: user.score,
  };

  socket.emit('user_notification', notification);
};

@EventSubscriber()
class UsernameSubscriber implements EntitySubscriberInterface<Username> {
  constructor(private io: Server) {}

  listenTo() {
    return Username;
  }

  afterInsert(event: InsertEvent<Username>) {
    this.sendNotification(event.entity);
  }

  afterUpdate(event: UpdateEvent<Username>) {
    const user = event.entity as Username;
    if (user) {
      this.sendNotification(user);
    }
  }

  private sendNotification(user: Username) {
    const notification = {
      avatar: user.avatar,
      ai_description: user.ai_description,
      username: user.username,
      score: user.score,
    };

    this.io.emit('user_notification', notification);
  }
}
