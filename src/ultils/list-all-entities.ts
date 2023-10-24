// import { PartialType } from '@nestjs/mapped-types';
// import { CreateTourDto } from './create-tour.dto';

export class ListAllEntities {
  fields?: string | object | undefined;
  sort?: string | object | undefined;
  limit?: string | undefined;
  page?: string | object | undefined;
}
