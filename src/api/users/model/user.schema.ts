import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ id: false })
export class User {
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

  @Prop({ default: true, select: false })
  active!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

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
