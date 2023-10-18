import config from 'config';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<void | typeof mongoose> =>
      mongoose.connect(config.LOCAL_DATABASE).then(() => {
        console.log('DB connection successful!');
      }),
  },
];
