import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Response, Request } from 'express';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { IUser } from '../users/model/user.interface';
import { LoginDto } from './dto/login.dto';
import { signToken } from 'src/ultils/jwt';
import configEnv from 'configEnv';
import Email from 'src/ultils/email';
import crypto from 'crypto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<IUser>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async login(res: Response, loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user: any = await this.userModel
      .findOne({ email: email })
      .select('+password +userJWTs');
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new HttpException(
        'Incorrect email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token: string = signToken(user._id);
    user.userJWTs.push(token);
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

    return { status: 'success' };
  }

  async forgotPassword(req: Request, forgotPasswordDto: ForgotPasswordDto) {
    // 1) Get user based on POSTed email
    const user: any = await this.userModel.findOne({
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
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.log(err);
      throw new HttpException(
        'There was an error sending the email. Try again later!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    const hashedToken: string = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    const user: any = await this.userModel.findOne({
      emailToken: hashedToken,
      emailTokenExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is an user, set the new password
    if (!user) {
      throw new HttpException(
        'Token is invalid or has expired',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.password = resetPasswordDto.password;
    user.passwordConfirm = resetPasswordDto.passwordConfirm;
    user.emailToken = undefined;
    user.emailTokenExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    return { status: 'success' };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    // 1) Check if POSTed current password is correct
    const user: any = await this.userModel
      .findById('userid')
      .select('+password');
    if (
      !(await user.correctPassword(
        changePasswordDto.currentPassword,
        user.password,
      ))
    ) {
      throw new HttpException(
        'Your password is incorrect!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 2) If so, update password
    user.password = changePasswordDto.password;
    user.passwordConfirm = changePasswordDto.passwordConfirm;
    user.passwordChangedAt = Date.now();

    await user.save();

    return {
      status: 'success',
    };
  }
}
