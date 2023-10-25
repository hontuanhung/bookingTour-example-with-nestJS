import dotenv from 'dotenv';

// Parsing the evn file
dotenv.config({ path: './src/configs/config_env/.env' });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  NODE_ENV: string | undefined;
  PORT: number | undefined;
  LOCAL_DATABASE: string | undefined;

  JWT_SECRET: string | undefined;
  JWT_EXPIRES_IN: string | number | undefined;
  JWT_COOKIE_EXPIRES_IN: number | undefined;

  TWITTER_BEARER_TOKEN: string | undefined;
  TWITTER_CONSUMER_KEY: string | undefined;
  TWITTER_CONSUMER_SECRET: string | undefined;
  TWITTER_ACCESS_TOKEN: string | undefined;
  TWITTER_TOKEN_SECRET: string | undefined;
  TWITTER_CLIENT_ID: string | undefined;
  TWITTER_CLIENT_SECRET: string | undefined;

  EMAIL_USERNAME: string | undefined;
  EMAIL_PASSWORD: string | undefined;
  EMAIL_HOST: string | undefined;
  EMAIL_PORT: number | undefined;

  GMAIL_USERNAME: string | undefined;
  GMAIL_PASSWORD: string | undefined;
}

interface Config {
  NODE_ENV: string;
  PORT: number;
  LOCAL_DATABASE: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string | number;
  JWT_COOKIE_EXPIRES_IN: number;

  TWITTER_BEARER_TOKEN: string;
  TWITTER_CONSUMER_KEY: string;
  TWITTER_CONSUMER_SECRET: string;
  TWITTER_ACCESS_TOKEN: string;
  TWITTER_TOKEN_SECRET: string;
  TWITTER_CLIENT_ID: string;
  TWITTER_CLIENT_SECRET: string;

  EMAIL_USERNAME: string;
  EMAIL_PASSWORD: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;

  GMAIL_USERNAME: string;
  GMAIL_PASSWORD: string;
}

// Loading process.env as ENV interjace
const getConfig: ENV = {
  NODE_ENV: process.env.NODE_ENV,
  LOCAL_DATABASE: process.env.LOCAL_DATABASE,
  PORT: process.env.PORT ? Number(process.env.PORT) : undefined,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN)
    ? Number(process.env.JWT_EXPIRES_IN)
    : process.env.JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_EXPIRES_IN
    ? Number(process.env.JWT_COOKIE_EXPIRES_IN)
    : undefined,

  TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
  TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
  TWITTER_TOKEN_SECRET: process.env.TWITTER_TOKEN_SECRET,
  TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,

  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT
    ? Number(process.env.EMAIL_PORT)
    : undefined,

  GMAIL_USERNAME: process.env.GMAIL_USERNAME,
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

export const configEnv = getSanitzedConfig(getConfig);
