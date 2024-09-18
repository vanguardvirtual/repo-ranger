import twitterService from '@/services/twitter.service';

const sendExampleTweet = async () => {
  const tweet = await twitterService.sendExampleTweet();
  return tweet;
};

const updateTweetsPerformance = async () => {
  const tweet = await twitterService.updateTweetsPerformance();
  return tweet;
};

export default { sendExampleTweet, updateTweetsPerformance };
