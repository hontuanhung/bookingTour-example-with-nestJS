import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  review!: string;

  @IsOptional()
  @IsNumber()
  rating!: number;
}
