import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

@Schema({ id: false })
export class User extends Document {
  @Prop()
  name!: string;

  @Prop()
  email!: string;

  @Prop({ select: false })
  password!: string;

  @Prop()
  photo!: string;

  @Prop({ default: 'user' })
  role!: string;

  @Prop({ select: false })
  userJWTs!: string[];

  @Prop()
  emailToken!: string;

  @Prop()
  emailTokenExpires!: Date;

  @Prop({
    default: false,
    select: false,
  })
  isVerify!: boolean;

  @Prop({ default: true, select: false })
  active!: boolean;

  _previousIsVerify!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (): Promise<void> {
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcryptjs.hash(this.password, 12);
});

UserSchema.path('isVerify').set(function (this: any) {
  const originalVal = this.isVerify;
  if (originalVal) {
    this._previousIsVerify = true;
  }
});

UserSchema.pre(/^find/, async function (this: Model<User> & User) {
  console.log();
  this.find({ active: { $ne: false } });
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
