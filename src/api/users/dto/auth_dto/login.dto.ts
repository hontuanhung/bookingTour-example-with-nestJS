import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string | undefined;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Your password must be at least 8 characters long',
  })
  password: string | undefined;
}
