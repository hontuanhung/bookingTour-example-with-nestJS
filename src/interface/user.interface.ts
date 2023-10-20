import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  photo: string;
  role: string;
  userJWTs: string[];
  passwordChangedAt: Date;
  emailToken: string;
  emailTokenExpires: number;
  inactiveAccount: boolean;
  active: boolean;
  correctPassword(
    candidatePassword: string | undefined,
    userPasswrod: string,
  ): Promise<boolean>;
}
