import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../auth_dto/create-user.dto';

export class ListAllEntities extends PartialType(
  OmitType(CreateUserDto, ['password', 'passwordConfirm']),
) {
  filer: string | object | undefined;
  sort: string | object | undefined;
  limitFfields: string | undefined;
  paginate: string | object | undefined;
}
