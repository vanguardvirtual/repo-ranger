import refreshUsernames from '@jobs/refreshUsernames.job';
import tweetUser from '@jobs/tweets.job';
import { logger } from '@utils/utils';
import Agenda, { Job } from 'agenda';

const agendaS = new Agenda({
  db: { address: process.env.MONGODB_URI as string, collection: 'agendaJobs' },
  defaultLockLifetime: 1000 * 60 * 10, // 10 minutes
  defaultLockLimit: 10,
});

export const startAgenda = async () => {
  agendaS.define('tweet user', async (_job: Job) => {
    try {
      await tweetUser();
    } catch (error) {
      logger('error', `Error in tweet user job: ${JSON.stringify(error)}`);
    }
  });
  await agendaS.every('5 hours', 'tweet user');

  agendaS.define('refresh usernames', async (job: Job) => {
    try {
      logger('info', 'Refresh usernames job triggered');
      await refreshUsernames(job);
      logger('info', 'Refresh usernames job completed successfully');
    } catch (error) {
      logger('error', `Error in refresh usernames job: ${JSON.stringify(error)}`);
    }
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
