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
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiSecurity } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

// @ApiSecurity('basic')
@Controller('/api/v1/users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    return this.authService.login(res, loginDto);
  }

  @Post('forgotPassword')
  @HttpCode(200)
  async forgotPassword(
    @Req() req: Request,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(req, forgotPasswordDto);
  }

  @Patch('resetPassword/:token')
  @HttpCode(200)
  resetPassword(
    @Param('token') token: string,
    @Body() resetPassword: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, resetPassword);
  }

  @Patch('updatePassword')
  @HttpCode(200)
  updatePassword(@Body() changePasswordDto: ChangePasswordDto) {
    console.log('something');
    return this.authService.changePassword(changePasswordDto);
  }
}
