import { ForgotPasswordDto } from '../dto/auth_dto/forgot-password.dto';
import { Response, Request } from 'express';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/auth_dto/create-user.dto';
import { Connection, Model } from 'mongoose';

import { LoginDto } from '../dto/auth_dto/login.dto';
import { configEnv } from 'src/configs/config_env/config-env';
import { Email } from 'src/ultils/email';
import crypto from 'crypto';
import { ResetPasswordDto } from '../dto/auth_dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/interface/user.interface';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from '../model/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectConnection()
    private connection: Connection,

    @InjectModel(User.name)
    private userModel: Model<IUser>,

    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const newUser: IUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async login(
    res: Response,
    loginDto: LoginDto,
  ): Promise<{ status: string; user: IUser }> {
    const { email, password } = loginDto;

    const user: IUser = await this.userModel
      .findOne({ email: email })
      .select('+password +userJWTs');
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new HttpException(
        'Incorrect email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token: string = this.jwtService.sign({
      id: user._id,
      role: user.role,
    });
    user.userJWTs?.push(token);
    await user.save();

    type CookieOptions = {
      expires: Date;
      httpOnly: boolean;
      secure?: boolean;
    };

    const cookieOptions: CookieOptions = {
      expires: new Date(
        Date.now() + configEnv.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    user.userJWTs = undefined!;
    user.password = undefined!;
    return { status: 'success', user };
  }

  async forgotPassword(
    req: Request,
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ status: string; message: string }> {
    // 1) Get user based on POSTed email
    const user: IUser | null = await this.userModel.findOne({
      email: forgotPasswordDto.email,
    });
    if (!user) {
      throw new HttpException(
        'There is no user with this email address.',
        HttpStatus.NOT_FOUND,
      );
    }

    // 2) Generate the random reset token
    const resetToken: string = user.createEmailToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL: string = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/resetPassword/${resetToken}`;

    try {
      await new Email(user, resetURL).sendPasswordReset();

      return {
        status: 'success',
        message: 'Token sent to email!',
      };
    } catch {
      user.emailToken = undefined;
      user.emailTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new BadRequestException(
        'There was an error sending the email. Try again later!',
      );
    }
  }

  async resetPassword(
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ status: string; user: IUser }> {
    const hashedToken: string = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const update: object = {
      password: resetPasswordDto.password,
      emailToken: undefined,
      emailTokenExpires: undefined,
      passwordChangedAt: new Date(),
    };

    const user: IUser | null = await this.userModel.findOneAndUpdate(
      {
        emailToken: hashedToken,
        emailTokenExpires: { $gt: Date.now() },
      },
      update,
    );

    // 2) If token has not expired, and there is an user, set the new password
    if (!user) {
      throw new HttpException(
        'Token is invalid or has expired',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { status: 'success', user };
  }
}
