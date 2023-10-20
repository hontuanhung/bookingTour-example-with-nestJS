import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class ResetPasswordDto extends PickType(CreateUserDto, [
  'password',
  'passwordConfirm',
] as const) {}
