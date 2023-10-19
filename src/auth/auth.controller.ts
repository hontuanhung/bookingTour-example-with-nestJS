import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  Res,
  Req,
  UseGuards,
  Get,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from './auth.guard';
import { UpdateMeDto } from './dto/update-me.dto';

// @ApiSecurity('basic')
@Controller('/api/v1/users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Req() req: any) {
    return this.authService.getMe(req.payload);
  }

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
    console.log(req);
    return this.authService.forgotPassword(req, forgotPasswordDto);
  }

  @Patch('resetPassword/:token')
  @HttpCode(200)
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPassword: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, resetPassword);
  }

  @UseGuards(AuthGuard)
  @Patch('updatePassword')
  @HttpCode(200)
  async updatePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.payload, changePasswordDto);
  }

  @UseGuards(AuthGuard)
  @Patch('updateMe')
  @HttpCode(200)
  async updateMe(@Req() req: any, updateMeDto: UpdateMeDto) {
    return this.authService.updateMe(req.payload, updateMeDto);
  }

  @UseGuards(AuthGuard)
  @Delete('deleteMe')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMe(@Req() req: any) {
    return this.authService.deactivateUser(req.payload);
  }
}
