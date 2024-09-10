import { Server } from 'socket.io';
import { Username } from './model';
import { EntitySubscriberInterface, InsertEvent, UpdateEvent, EventSubscriber, DataSource } from 'typeorm';

export function setupWebSockets(io: Server, dataSource: DataSource) {
  io.on('connection', (socket) => {
    console.log('A user connected');

    const interval = setInterval(async () => {
      try {
        const randomUser = await Username.createQueryBuilder('username').orderBy('RAND()').getOne();

        if (randomUser) {
          sendUserNotification(socket, randomUser);
        }
      } catch (error) {
        console.error('Error fetching random user:', error);
      }
    }, 7000); // Fixed interval of 20 seconds

    socket.on('disconnect', () => {
      console.log('User disconnected');
      clearInterval(interval);
    });
  });

  // Check if dataSource is properly initialized and has subscribers
  if (dataSource && dataSource.subscribers) {
    dataSource.subscribers.push(new UsernameSubscriber(io));
  } else {
    console.error('DataSource is not properly initialized or lacks subscribers property');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
