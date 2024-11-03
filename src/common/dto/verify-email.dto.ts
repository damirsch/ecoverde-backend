import { IsString, IsEmail, IsNotEmpty } from "class-validator"

export class VerifyEmailDto {
	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	code: string
}
