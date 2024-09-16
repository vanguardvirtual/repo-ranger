import { TwitterPost, Username } from '@/model';
import { generateAiNickname, getEmoji, getRandomUser } from '@/service';
import { logger } from '@/utils';
import { IsNull } from 'typeorm';
import express from 'express';
import { TweetV2PostTweetResult, TwitterApi } from 'twitter-api-v2';
import { IResponse } from '@/types';

export const router = express.Router();
export const TWITTER_STATE = 'my-state';

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY as string,
  appSecret: process.env.TWITTER_API_SECRET as string,
  accessToken: process.env.TWITTER_ACCESS_TOKEN as string,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
});

const bearer = new TwitterApi(process.env.TWITTER_BEARER_TOKEN as string);

export const twitterClient = client.readWrite;
export const twitterBearer = bearer.readOnly;

export const tweetUser = async (selectedUser?: Username): Promise<IResponse<TweetV2PostTweetResult>> => {
  const user = selectedUser || (await getRandomUser());

  if (!user) {
    logger('error', `User not found`);
    return {
      status: 404,
      message: 'User not found',
      data: null,
      error: 'User not found',
      success: false,
    };
  }

  // make sure in the last 50 tweets, there is no tweet from this user, check from TwitterPost table
  const tweets = await TwitterPost.find({
    where: {
      username_id: user.id,
    },
    order: {
      created_at: 'DESC',
    },
    take: 50,
  });
  if (tweets.length > 0) {
    logger('error', `User ${user.username} has already tweeted in the last 50 tweets`);
    return {
      status: 400,
      message: 'User has already tweeted in the last 50 tweets',
      data: null,
      error: 'User has already tweeted in the last 50 tweets',
      success: false,
    };
  }

  if (!user.github_url) {
    user.github_url = `https://github.com/${user.username}`;
    await user.save();
  }

  const tweetContentData = {
    emoji: await getEmoji(user.score),
    name: user.name,
    username: user.username,
    location: user.location === 'Unknown' ? 'an Unknown location' : user.location,
    ai_nickname: await generateAiNickname(user),
    score: user.score,
    fav_language: user.fav_language,
    followers: user.followers,
    ai_description: (user.ai_description || '').replace(/[\\/"']/g, ''),
    github_url: user.github_url,
    x_url: `https://x.com/${user.twitter_username}`,
    twitter_username: user.twitter_username,
  };

  const tweetContent = `${tweetContentData.username} from ${tweetContentData.location}, the ${tweetContentData.ai_nickname}
\nScore: ${tweetContentData.score}
Followers: ${tweetContentData.followers}
Fav language: ${tweetContentData.fav_language}
Emoji: ${tweetContentData.emoji}\n
${tweetContentData.twitter_username ? `Check out their X: ${tweetContentData.x_url} (@${tweetContentData.twitter_username})` : ''}
${tweetContentData.github_url ? `Check out their Github: ${tweetContentData.github_url}` : ''}
    `;

  try {
    const tweet = await twitterClient.v2.tweet({
      text: tweetContent,
    });
    const newTweet = new TwitterPost();
    newTweet.username_id = user.id;
    newTweet.content = tweet.data?.text || '';
    newTweet.post_type = 'user_post_type';
    newTweet.twitter_id = tweet.data?.id || '';
    newTweet.created_at = new Date();
    await newTweet.save();

    return {
      status: 200,
      message: 'Tweet created',
      data: tweet,
      error: '',
      success: true,
    };
  } catch (tweetError) {
    logger('error', `Error creating tweet: ${JSON.stringify(tweetError)}`);
    return {
      status: 400,
      message: 'Error creating tweet',
      data: null,
      error: 'Error creating tweet',
      success: false,
    };
  }
};

export const updateTweetsPerformance = async (): Promise<IResponse<Username[]>> => {
  const tweets = await TwitterPost.find({
    where: {
      cron_check: IsNull(),
    },
  });
  const updatedUsers: Username[] = [];

  for (const tweet of tweets) {
    try {
      const check = await twitterClient.v2.singleTweet(tweet.twitter_id, {
        'tweet.fields': ['public_metrics'],
      });
      const publicMetrics = check.data?.public_metrics;
      if (publicMetrics) {
        const likeCount = publicMetrics.like_count * 1;
        const retweetCount = publicMetrics.retweet_count * 3;
        const replyCount = publicMetrics.reply_count * 2;
        const quoteCount = publicMetrics.quote_count || 0 * 3;
        const extraScore = likeCount + retweetCount + replyCount + quoteCount;
        const userId = tweet.username_id;

        tweet.cron_check = new Date();
        await tweet.save();

        const user = await Username.findOne({
          where: {
            id: userId,
          },
        });
        if (user) {
          user.extra_score += extraScore;
          await user.save();
          updatedUsers.push(user);
        }
      }
    } catch (error) {
      logger('error', `Error updating tweets performance: ${JSON.stringify(error)}`);
      return {
        status: 400,
        message: 'Error updating tweets performance',
        data: null,
        error: error as any,
        success: false,
      };
    }
  }

  return {
    status: 200,
    message: 'Tweets updated',
    data: updatedUsers,
    error: '',
    success: true,
  };
};
