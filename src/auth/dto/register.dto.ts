import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password is too short' })
  password: string;
}
