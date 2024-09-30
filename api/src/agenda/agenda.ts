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
      await refreshUsernames(job);
    } catch (error) {
      logger('error', `Error in refresh usernames job: ${JSON.stringify(error)}`);
    }
  });

  // We have a 5000 rate limit from Github Per Hour do 6 requests for each user
  // But we also do additional 10 requests to fetch the events of the repos of the user
  // In total we do 16 requests per user
  // So we can update 312 users every hour, so the cron job will run every 10 seconds
  // Add a 2 second markup to avoid rate limit from extra requests
  await agendaS.every('12 seconds', 'refresh usernames');

  await agendaS.start();
  logger('info', 'Agenda started and tweet job scheduled');
};

export const stopAgenda = async () => {
  await agendaS.stop();
  logger('info', 'Agenda stopped');
};

export default agendaS;
