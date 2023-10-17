import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.PORT, () => {
    console.log(`App is running on port ${config.PORT}`);
  });
}
bootstrap();
