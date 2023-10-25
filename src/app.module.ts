import { Module } from '@nestjs/common';
import { UsersModule } from './api/users/users.module';
// import { DatabaseModule } from './share/common/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { configEnv } from './configs/config_env/config-env';
import { ToursModule } from './api/tours/tours.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/share/common/guard/auth.guard';
import { RolesGuard } from 'src/share/common/guard/roles.guard';
import { ReviewModule } from './api/review/review.module';
import { TwitterModule } from './api/twitter/twitter.module';

@Module({
  imports: [
    UsersModule,
    ToursModule,
    MongooseModule.forRoot(configEnv.LOCAL_DATABASE),
    ReviewModule,
    TwitterModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {} /* implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtecMiddleware).forRoutes({
      path: 'api/v1/users/forgotPassword',
      method: RequestMethod.POST,
    });
  }
} */
