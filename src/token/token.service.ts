import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class TokenService {
	constructor(private jwtService: JwtService) {}

	generateTokens(email: string, id: string) {
		const payload = { email: email, sub: id }
		const accessToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_ACCESS_EXPIRATION })
		const refreshToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_REFRESH_EXPIRATION })
		return { access_token: accessToken, refresh_token: refreshToken }
	}
}
