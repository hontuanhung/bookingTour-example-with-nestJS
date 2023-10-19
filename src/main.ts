import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'configEnv';
import { ValidationPipe } from '@nestjs/common';
import { connection } from 'mongoose';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Auto validate
  app.useGlobalPipes(new ValidationPipe());

  // Cookies
  app.use(cookieParser());

  // Listning server
  await app.listen(dotenv.PORT, () => {
    console.log(
      '\x1b[36m===\x1b[0mEnviroment:',
      `\x1b[31m${dotenv.NODE_ENV}\x1b[36m===\x1b[0m`,
    );
    console.log(`App is running on port \x1b[31m${dotenv.PORT}\x1b[0m`);
    if (connection.readyState === 1) {
      console.log('DB connection successful!');
    }
  });
}
bootstrap();
