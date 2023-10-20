import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './api/users/users.module';
import { DatabaseModule } from './share/common/database/database.module';

@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} /* implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtecMiddleware).forRoutes({
      path: 'api/v1/users/forgotPassword',
      method: RequestMethod.POST,
    });
  }
} */
