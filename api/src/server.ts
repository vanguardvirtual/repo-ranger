import cors from 'cors';
import express, { Request } from 'express';
import 'dotenv/config';
import { router } from '@/routes';
import 'reflect-metadata';
import { initializeDatabase } from './database';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (_req, res) => res.send('🚀 Server is running!'));
app.use('/api', router);
app.use(limiter);
app.use(bodyParser.json());

async function startApp() {
  await initializeDatabase();
  app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
  });
}

startApp().catch((error) => console.error(error));
