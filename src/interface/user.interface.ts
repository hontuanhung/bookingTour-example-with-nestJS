import { Document } from 'mongoose';

export type Role = 'admin' | 'user' | 'guide' | 'lead-guide';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  photo: string;
  role: Role;
  userJWTs: string[];
  passwordChangedAt: Date;
  emailToken: string | undefined;
  emailTokenExpires: number | undefined;
  inactiveAccount: boolean | undefined;
  active: boolean;
  correctPassword(
    candidatePassword: string | undefined,
    userPasswrod: string,
  ): Promise<boolean>;
  createEmailToken(): string;
}
