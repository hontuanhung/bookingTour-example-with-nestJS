import { User, UserSchema } from './model/user.schema';
import { Module } from '@nestjs/common';
import { UsersService } from './user_controller/users.service';
import { UsersController } from './user_controller/users.controller';

// import { usersProviders } from './users.providers';
import { AuthController } from './auth_controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../share/consants/jwt.constant';
import { configEnv } from 'src/configs/config_env/config-env';
import { AuthService } from './auth_controller/auth.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: configEnv.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService],
  // exports: [MongooseModule],
})
export class UsersModule {}
