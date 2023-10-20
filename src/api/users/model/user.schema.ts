import * as mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { IUser } from 'src/interface/user.interface';

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

UserSchema.pre('save', async function (): Promise<void> {
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcryptjs.hash(this.password, 12);
});

UserSchema.methods.correctPassword = function (
  candidatePassword: string,
  userPasswrod: string,
): Promise<boolean> {
  return bcryptjs.compare(candidatePassword, userPasswrod);
};

UserSchema.methods.createEmailToken = function (): string {
  const resetToken: string = crypto.randomBytes(32).toString('hex');
  this.emailToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.emailTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
