import twitterService from '@/services/twitter.service';
import { logger } from '@/utils';

const tweetUser = async () => {
  logger('info', 'Running scheduled tweet job');
  await twitterService.tweetUser();
};

export default tweetUser;
