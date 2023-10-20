import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto extends PickType(CreateUserDto, [
  'password',
  'passwordConfirm',
] as const) {
  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Your password must be at least 8 characters long',
  })
  currentPassword: string | undefined;
}
