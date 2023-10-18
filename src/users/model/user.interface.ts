import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly passwordConfirm: string;
  readonly photo: string;
  readonly role: string;
  readonly userJWTs: string[];
  readonly passwordChangedAt: Date;
  readonly emailToken: string;
  readonly emailTokenExpires: number;
  readonly inactiveAccount: boolean;
  readonly active: boolean;
}
