import { configEnv } from 'src/configs/config_env/config-env';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<void | typeof mongoose> =>
      mongoose.connect(configEnv.LOCAL_DATABASE),
  },
];
