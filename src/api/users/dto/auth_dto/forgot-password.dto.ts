import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class ForgotPasswordDto extends PickType(CreateUserDto, [
  'email',
] as const) {}
