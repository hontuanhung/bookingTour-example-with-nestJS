import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.PORT, () => {
    console.log(
      '\x1b[36m===\x1b[0mEnviroment:',
      `\x1b[33m${config.NODE_ENV}\x1b[36m===\x1b[0m`,
    );
    console.log(`App is running on port \x1b[33m${config.PORT}\x1b[0m`);
  });
}
bootstrap();
