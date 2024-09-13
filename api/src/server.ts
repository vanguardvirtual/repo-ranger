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

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const port = process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);

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
  app.use('/api', router);
  app.use(limiter);
  app.use(bodyParser.json());

  httpServer.listen(port, () => {
    logger('info', `App listening on port: ${port}`);
  });
}

startApp().catch((error) => logger('error', error));
