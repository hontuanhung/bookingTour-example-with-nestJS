import { Module } from '@nestjs/common';
import { UsersService } from './user_controller/users.service';
import { UsersController } from './user_controller/users.controller';

import { usersProviders } from './users.providers';
import { AuthController } from './auth_controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../share/common/guard/guard/constants';
import { configEnv } from 'src/configs/config_env/config-env';
import { AuthService } from './auth_controller/auth.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: configEnv.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService, ...usersProviders],
})
export class UsersModule {}
