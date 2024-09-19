import refreshUsernames from '@jobs/refreshUsernames.job';
import tweetUser from '@jobs/tweets.job';
import { logger } from '@utils/utils';
import Agenda, { Job } from 'agenda';

const agendaS = new Agenda({
  db: { address: process.env.MONGODB_URI as string },
});

export const startAgenda = async () => {
  agendaS.define('tweet user', async (_job: Job) => {
    await tweetUser();
  });
  await agendaS.every('5 hours', 'tweet user');

  agendaS.define('refresh usernames', async (job: Job) => {
    await refreshUsernames(job);
  });
  await agendaS.every('10 seconds', 'refresh usernames');

  await agendaS.start();
  logger('info', 'Agenda started and tweet job scheduled');
};

export const stopAgenda = async () => {
  await agendaS.stop();
  logger('info', 'Agenda stopped');
};

export default agendaS;
