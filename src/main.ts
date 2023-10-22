import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configEnv } from 'src/configs/config_env/config-env';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Auto validate
  app.useGlobalPipes(new ValidationPipe());

  // Cookies
  app.use(cookieParser());

  // Send info every time req-res success
  app.use(morgan('dev'));

  // Listning server
  await app.listen(configEnv.PORT, () => {
    console.log(
      '\x1b[36m===\x1b[0mEnviroment:',
      `\x1b[31m${configEnv.NODE_ENV}\x1b[36m===\x1b[0m`,
    );
    console.log(`App is running on port \x1b[31m${configEnv.PORT}\x1b[0m`);
    // if (connection.readyState === 1) {
    //   console.log('DB connection successful!');
    // } else if (connection.readyState === 0) {
    //   console.log('failed to connect to DB');
    // }
  });
}
bootstrap();
