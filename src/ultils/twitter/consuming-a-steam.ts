import axios from 'axios';
import { AuthHeader } from './types';
import { configEnv } from 'src/configs/config_env/config-env';
import { Client, auth } from 'twitter-api-sdk';

const authClient = new auth.OAuth2User({
  client_id: configEnv.TWITTER_CLIENT_ID,
  client_secret: configEnv.TWITTER_CLIENT_SECRET,
  callback: 'http://127.0.0.1:8000/api/v1/tours',
  scopes: ['tweet.read', 'users.read', 'tweet.write'],
  token: {
    // token_type: 'bearer',
    access_token: configEnv.TWITTER_ACCESS_TOKEN,
    // refresh_token: configEnv.TWITTER_TOKEN_SECRET,
    scope: 'tweet.write users.read tweet.read offline.access',
    expires_at: Date.now() + 29999,
  },
});
const client = new Client(authClient);

export const login = async () => {
  try {
    const tweets = await client.tweets.findTweetById('2');
    return tweets;
  } catch (error) {
    console.log('tweets error', error);
  }
};
// "https://twitter.com/i/oauth2/authorize?code_challenge_method=s256&state=ok&client_id=VFU5Z09WclRYQWdPUm9OamtQWUk6MTpjaQ&scope=tweet.read%20users.read%20offline.access&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Fapi%2Fv1%2Ftours&code_challenge=7tyqMXh5ABnkPLWt42b7U47i3u7pJQypr0Me9TDJtzE"
export const postTweet = async (data: any) => {
  try {
    const authUrl = authClient.generateAuthURL({
      code_challenge_method: 's256',
      state: 'ok',
    });
    const codeVerify = authUrl.match(/code_challenge=([^&]*)/)![1];
    const redirectUrl = decodeURIComponent(
      authUrl.match(/redirect_uri=([^&]+)/)![1],
    );
    const clientID = authUrl.match(/client_id=([^&]+)/)![1];

    const req: any = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      {
        grant_type: 'authorization_code',
        redirect_uri: redirectUrl,
        code: 'code',
        code_verifier: codeVerify,
        client_id: clientID,
      },
      { headers: { 'Content-Type': 'application/json' } },
    );
    const postTweet = await client.tweets.createTweet({
      // The text of the Tweet
      text: data,

      // Options for a Tweet with a poll
      poll: {
        options: ['Yes', 'Maybe', 'No'],
        duration_minutes: 120,
      },
    });
    console.dir(postTweet, {
      depth: null,
    });
  } catch (error) {
    console.log(error);
    // throw error;
  }
};
