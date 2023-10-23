import { configEnv } from 'src/configs/config_env/config-env';

export const jwtConstants = {
  secret: configEnv.JWT_SECRET,
};
