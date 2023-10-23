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
import { Location } from '../model/tour.schema';
enum DIFFICULTY {
  EASY = 'easy',
  MEDIUM = 'medium',
  DIFFICULT = 'difficult',
}

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

  @IsOptional()
  @IsNumber()
  duration!: number;

  @IsOptional()
  @IsNumber()
  maxGroupSize!: number;

  @IsNotEmpty()
  @IsEnum(DIFFICULTY)
  difficulty!: DIFFICULTY;

  @IsOptional()
  @IsNumber()
  price!: number;

  @IsOptional()
  @IsNumber()
  priceDiscount!: number;

  @IsOptional()
  @IsString()
  summary!: string;

  @IsOptional()
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
