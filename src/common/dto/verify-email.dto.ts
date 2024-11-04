import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from 'src/constants';

export class VerifyEmailDto {
  @IsEmail()
  @IsNotEmpty()
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

  @IsString()
  @IsNotEmpty()
  code: string;
}
