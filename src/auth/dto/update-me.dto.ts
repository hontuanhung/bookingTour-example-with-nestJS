import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateMeDto extends PartialType(
  PickType(CreateUserDto, ['name', 'photo'] as const),
) {}
