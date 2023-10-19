import configEnv from 'configEnv';
import jwt from 'jsonwebtoken';

export function signToken(id: string): string {
  return jwt.sign({ id: id }, configEnv.JWT_SECRET, {
    expiresIn: configEnv.JWT_EXPIRES_IN,
  });
}
