import { Controller, Post, Body, Res, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/common/dto/create-user.dto';
import { VerifyEmailDto } from 'src/common/dto/verify-email.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { REFRESH_TOKEN } from 'src/common/constants/tokens';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('verify-email')
  verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.verifyEmailAndCreateUser(verifyEmailDto, response);
  }

  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(loginUserDto, response);
  }

  @Get('refresh')
  refresh(@Req() req: Request) {
    const refreshToken = req.cookies[REFRESH_TOKEN];
    return this.authService.refresh(refreshToken);
  }
}
