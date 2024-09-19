import refreshUsernames from '@/jobs/refreshUsernames.job';
import tweetUser from '@/jobs/tweets.job';
import { logger } from '@/utils';
import Agenda, { Job } from 'agenda';

const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI as string },
});

const startAgenda = async () => {
  agenda.define('tweet user', async (_job: Job) => {
    await tweetUser();
  });
  await agenda.every('5 hours', 'tweet user');

  agenda.define('refresh usernames', async (job: Job) => {
    await refreshUsernames(job);
  });
  await agenda.every('10 seconds', 'refresh usernames');

  await agenda.start();
  logger('info', 'Agenda started and tweet job scheduled');
};

const stopAgenda = async () => {
  await agenda.stop();
  logger('info', 'Agenda stopped');
};

export { startAgenda, stopAgenda };
