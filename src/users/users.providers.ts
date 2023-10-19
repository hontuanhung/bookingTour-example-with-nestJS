import { model } from 'mongoose';
import { IUser } from './model/user.interface';
import { UserSchema } from './model/user.schema';

export const usersProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: () => model<IUser>('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
