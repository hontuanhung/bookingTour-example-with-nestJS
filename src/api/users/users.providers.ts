import { model } from 'mongoose';

import { UserSchema } from './model/user.schema';
import { IUser } from 'src/interface/user.interface';

export const usersProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: () => model<IUser>('User', UserSchema),
    // inject: ['DATABASE_CONNECTION'],
  },
];