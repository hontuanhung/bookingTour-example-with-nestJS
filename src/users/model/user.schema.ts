import * as mongoose from 'mongoose';
import { IUser } from './user.interface';
// import { IUser } from './user.interface';

export const UserSchema = new mongoose.Schema<IUser>({
  name: String,
  email: String,
  password: { type: String, select: false },
  passwordConfirm: String,
  photo: String,
  role: {
    type: String,
    default: 'user',
  },
  userJWTs: { type: [String], select: false },
  passwordChangedAt: Date,
  emailToken: String,
  emailTokenExpires: Date,
  active: {
    type: Boolean,
    default: false,
    select: false,
  },
});
