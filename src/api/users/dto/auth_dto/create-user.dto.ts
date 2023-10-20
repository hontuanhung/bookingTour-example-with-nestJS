import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Match } from 'src/ultils/decorator_custom/match.dto';

enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
  GUIDE = 'guide',
  LEAD_GUIDE = 'lead-guide',
}

// TODO tạo whitelist cho Dto
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 40, {
    message: "The 'name' must be between 5-50 characters long",
  })
  name: string | undefined;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string | undefined;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Your password must be at least 8 characters long',
  })
  password: string | undefined;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Your password must be at least 8 characters long',
  })
  @Match<CreateUserDto>('password')
  readonly passwordConfirm: string | undefined;

  @IsOptional()
  @IsString()
  photo: string | undefined;

  @IsOptional()
  @IsString()
  @IsEnum(USER_ROLE, { message: 'Please chose one of 4 default roles' })
  role: USER_ROLE | undefined;
}
