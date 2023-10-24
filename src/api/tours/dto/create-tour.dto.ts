import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DIFFICULTY, Location } from 'src/interface/tour.interface';

export class CreateTourDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10, {
    message: 'A tour name must have more or equal then 10 characters',
  })
  @MaxLength(40, {
    message: 'A tour name must have less or equal then 40 characters',
  })
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  duration!: string;

  @IsNotEmpty()
  @IsNumber()
  maxGroupSize!: number;

  @IsNotEmpty()
  @IsEnum(DIFFICULTY)
  difficulty!: DIFFICULTY;

  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsOptional()
  @IsNumber()
  priceDiscount!: number;

  @IsOptional()
  @IsString()
  summary!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  imageCover!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images!: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  startDates!: Date[];

  @IsOptional()
  @IsObject()
  startLocation!: Location;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  locations!: Location[];
}
