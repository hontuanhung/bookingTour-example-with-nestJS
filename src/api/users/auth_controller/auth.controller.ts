import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/auth_dto/create-user.dto';
import { LoginDto } from '../dto/auth_dto/login.dto';
import { Request, Response } from 'express';
import { ForgotPasswordDto } from '../dto/auth_dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/auth_dto/reset-password.dto';
import { IUser } from 'src/interface/user.interface';

// @ApiSecurity('basic')
@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ): Promise<{
    status: string;
    user: IUser;
  }> {
    return this.authService.login(res, loginDto);
  }

  @Post('forgotPassword')
  @HttpCode(200)
  async forgotPassword(
    @Req() req: Request,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ status: string; message: string }> {
    return this.authService.forgotPassword(req, forgotPasswordDto);
  }

  @Patch('resetPassword/:token')
  @HttpCode(200)
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPassword: ResetPasswordDto,
  ): Promise<{ status: string; user: IUser }> {
    return this.authService.resetPassword(token, resetPassword);
  }
}
