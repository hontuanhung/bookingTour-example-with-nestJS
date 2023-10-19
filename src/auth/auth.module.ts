import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database.module';
import { usersProviders } from 'src/users/users.providers';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import configEnv from 'configEnv';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: configEnv.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ...usersProviders],
})
export class AuthModule {}
