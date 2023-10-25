declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: number;
      LOCAL_DATABASE: string;
      PASSWORD: string;

      JWT_SECRET: string;
      JWT_EXPIRES_IN: number;
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
  }
}

export {};
