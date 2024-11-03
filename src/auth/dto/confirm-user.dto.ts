import { IsNotEmpty, IsString } from "class-validator"

export class ConfirmUserDto {
	@IsNotEmpty()
	@IsString()
	email: string

	@IsNotEmpty()
	@IsString()
	confirmationCode: string
}
