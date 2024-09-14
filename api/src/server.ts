import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import { router } from '@/routes';
import 'reflect-metadata';
import AppDataSource, { initializeDatabase } from './database';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupWebSockets } from '@/sockets';
import { logger } from '@/utils';
import { tweetUser } from '@/twitter';
import cron from 'node-cron';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const port = process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);

// create tweet cron job every 5 hours
cron.schedule('0 */5 * * *', async () => {
  await tweetUser();
});

async function startApp() {
  await initializeDatabase();

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  setupWebSockets(io, AppDataSource);

  app.use(cors());
  app.use(express.json());
  app.get('/', (_req, res) => res.send('🚀 Server is running!'));
  app.use(
    '/api',
    (req, res, next) => {
      if (req.path === '/example-tweet' && req.headers.origin && !req.headers.origin.startsWith('http://localhost:')) {
        return res.status(403).json({ error: 'Access denied' });
      }
      next();
    },
    router,
  );
  app.use(limiter);
  app.use(bodyParser.json());

  httpServer.listen(port, () => {
    logger('info', `App listening on port: ${port}`);
  });
}

startApp().catch((error) => logger('error', error));
