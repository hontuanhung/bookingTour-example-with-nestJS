// eslint-disable-next-line @typescript-eslint/no-var-requires
import axios from 'axios';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import qs from 'querystring';

import { configEnv } from 'src/configs/config_env/config-env';
import { createInterface } from 'readline';

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const endpointURL: string = `https://api.twitter.com/1.1/statuses/update.json`;

const requestTokenURL: string =
  'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';
const authorizeURL: URL = new URL('https://api.twitter.com/oauth/authorize');
const accessTokenURL: string = 'https://api.twitter.com/oauth/access_token';
const oauth = new OAuth({
  consumer: {
    key: configEnv.TWITTER_CONSUMER_KEY,
    secret: configEnv.TWITTER_CONSUMER_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) =>
    crypto.createHmac('sha1', key).update(baseString).digest('base64'),
});

async function input(prompt: string): Promise<any> {
  return new Promise(async (resolve) => {
    readline.question(prompt, (out) => {
      readline.close();
      resolve(out);
    });
  });
}

async function requestToken() {
  const authHeader = oauth.toHeader(
    oauth.authorize({
      url: requestTokenURL,
      method: 'POST',
    }),
  );

  const req: any = await axios.post(requestTokenURL, undefined, {
    headers: { Authorization: authHeader['Authorization'] },
  });
  if (req.data) {
    return qs.parse(req.data);
  } else {
    throw new Error('Cannot get an OAuth request token');
  }
}

type OAuthToken = {
  oauth_token: string;
  oauth_token_secret: string;
};

async function accessToken({ oauth_token }: OAuthToken, verifier: string) {
  const authHeader = oauth.toHeader(
    oauth.authorize({
      url: accessTokenURL,
      method: 'POST',
    }),
  );
  const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`;
  const req: any = await axios.post(path, undefined, {
    headers: {
      Authorization: authHeader['Authorization'],
    },
  });
  if (req.data) {
    return qs.parse(req.data);
  } else {
    throw new Error('Cannot get an OAuth request token');
  }
}

async function getRequest(
  { oauth_token, oauth_token_secret }: OAuthToken,
  data: string,
) {
  const token = {
    key: oauth_token,
    secret: oauth_token_secret,
  };

  const authHeader = oauth.toHeader(
    oauth.authorize(
      {
        url: endpointURL,
        method: 'POST',
      },
      token,
    ),
  );

  const req: any = await axios.post(
    endpointURL,
    {
      status: data,
    },
    {
      responseType: 'json',
      headers: {
        Authorization: authHeader['Authorization'],
        'User-Agent': 'v2CreateTweetJS',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  );
  if (req.data) {
    return req.data;
  } else {
    throw new Error('Unsuccessful request');
  }
}

export const createTweet = async (data: string) => {
  try {
    // Get request token
    const oAuthRequestToken = (await requestToken()) as OAuthToken;
    // Get authorization
    authorizeURL.searchParams.append(
      'oauth_token',
      oAuthRequestToken.oauth_token as string,
    );
    console.log('Please go here and authorize:', authorizeURL.href);
    const pin = await input('Paste the PIN here: ');
    // Get the access token
    const oAuthAccessToken = (await accessToken(
      oAuthRequestToken,
      pin.trim(),
    )) as OAuthToken;
    // Make the request
    const response = await getRequest(oAuthAccessToken, data);
    console.dir(response, {
      depth: null,
    });
  } catch (e) {
    console.log(e);
  }
};
