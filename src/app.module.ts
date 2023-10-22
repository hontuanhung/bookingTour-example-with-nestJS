import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './api/users/users.module';
// import { DatabaseModule } from './share/common/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { configEnv } from './configs/config_env/config-env';
import { ToursModule } from './api/tours/tours.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(configEnv.LOCAL_DATABASE),
    ToursModule,
  ],
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
