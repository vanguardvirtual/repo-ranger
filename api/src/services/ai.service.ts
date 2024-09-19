import usernameService from '@services/username.service';
import { Username } from '@models/username.model';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const generateAiDescription = async (user: Username): Promise<string> => {
  const isTop10 = await usernameService.isUserTop10ByScore(user.score);
  const isTop1 = await usernameService.isUserTop1ByScore(user.score);
  const location = user.location === 'Unknown' ? 'an unknown place' : user.location;
  const favLanguage =
    user.fav_language === 'Unknown' ? 'they dont have a favorite language' : `their favorite language is ${user.fav_language}`;
  const bio = user.bio === 'Unknown' ? '' : `and their bio is "${user.bio}"`;

  let top10Sentence = 'they are not in the top 10';
  if (isTop1) {
    top10Sentence = 'they are the top user';
  }
  if (isTop10) {
    top10Sentence = 'they are in the top 10';
  }

  const msg: Anthropic.Messages.Message = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1000,
    temperature: 0,
    system:
      'I have created a website called Repo-Ranger, users put their Github username and we calculate a score based on some attributes of their Github Profile. We have a scoreboard on the frontend and the users are ordered by their score. The user also get an emoji based on their score. They get 💩 if they have bellow 1000 score, they get 👏 if the get above 1000 and 🌟 if they are in the top 10. If the user is first they get 😂. Keep the answers short and concise (max 1 line) and add emojis where applicable, try to be funny and sarcastic. I want you to generate a sentence that describes the user.',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Generate a sentence that discribes the user "${user.username}", they have a score of ${user.score} and ${top10Sentence}. The user is from ${location} and ${favLanguage}. They have ${user.followers} followers ${bio}"`,
          },
        ],
      },
    ],
  });

  return msg?.content[0] && 'text' in msg.content[0]
    ? msg.content[0].text
    : "That user has such a bad profile that we couldn't generate a description for them. 💩";
};

const generateAiNickname = async (user: Username): Promise<string> => {
  if (user.ai_nickname) {
    return user.ai_nickname;
  }

  const ai_description = user.ai_description;
  const username = user.name;
  const handle = user.username;

  const msg = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 100,
    temperature: 0.2,
    system: 'I want you to response with just the nickname nothing else. Be sarcastic and funny, you can use an emoji as well.',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Generate a nickname for ${username} his handle is ${handle} and a small description about him is ${ai_description}`,
          },
        ],
      },
    ],
  });

  const nickname = msg?.content[0] && 'text' in msg.content[0] ? msg.content[0].text : '';

  user.ai_nickname = nickname;
  user.save();

  return nickname;
};

export default { generateAiDescription, generateAiNickname };
