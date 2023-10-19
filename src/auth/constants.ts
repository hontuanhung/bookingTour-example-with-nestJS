import configEnv from 'configEnv';

export const jwtConstants = {
  secret: configEnv.JWT_SECRET,
};
