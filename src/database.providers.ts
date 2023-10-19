import configEnv from 'configEnv';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<void | typeof mongoose> =>
      mongoose.connect(configEnv.LOCAL_DATABASE),
  },
];
