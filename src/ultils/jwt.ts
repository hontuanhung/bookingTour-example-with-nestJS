import { configEnv } from 'src/configs/config_env/config-env';
import jwt from 'jsonwebtoken';

export function signToken(id: string): string {
  return jwt.sign({ id: id }, configEnv.JWT_SECRET, {
    expiresIn: configEnv.JWT_EXPIRES_IN,
  });
}
