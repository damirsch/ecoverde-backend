import {
  IsString,
  MaxLength,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from 'src/constants';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email is empty' })
  @IsString({ message: 'Email must be a string' })
  @MaxLength(MAX_EMAIL_LENGTH, {
    message: `Max email length: ${MAX_EMAIL_LENGTH}`,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is empty' })
  @IsString({ message: 'Password must be a string' })
  @MaxLength(MAX_PASSWORD_LENGTH, {
    message: `Max password length: ${MAX_PASSWORD_LENGTH}`,
  })
  @MinLength(MIN_PASSWORD_LENGTH, {
    message: `Min password length: ${MIN_PASSWORD_LENGTH}`,
  })
  password: string;

  is_verified?: boolean;
  refresh_token?: string;
}
