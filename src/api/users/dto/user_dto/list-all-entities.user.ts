import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../auth_dto/create-user.dto';

export class ListAllUserEntities extends PartialType(
  OmitType(CreateUserDto, ['password', 'passwordConfirm']),
) {
  filer: string | object | undefined;
  sort: string | object | undefined;
  limit: string | undefined;
  page: string | object | undefined;
}
