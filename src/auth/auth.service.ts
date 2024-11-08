import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/common/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailDto } from 'src/common/dto/verify-email.dto';
import { PrismaService } from 'src/prisma.service';
import { TokenService } from 'src/token/token.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  private verificationCodes: Map<
    string,
    { code: string; user: CreateUserDto }
  > = new Map();

  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private prismaService: PrismaService,
    private tokenService: TokenService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.findOne(createUserDto.email);
    if (user) {
      if (user.is_verified) {
        throw new ConflictException('User already registered and verified');
      } else {
        throw new ConflictException('User already registered but not verified');
      }
    }
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    this.verificationCodes.set(createUserDto.email, {
      code,
      user: createUserDto,
    });
    await this.emailService.sendVerificationEmail(createUserDto.email, code);
    return { message: 'Verification code sent to email' };
  }

  async verifyEmailAndCreateUser(
    verifyEmailDto: VerifyEmailDto,
    res: Response,
  ) {
    const record = this.verificationCodes.get(verifyEmailDto.email);
    if (record && record.code === verifyEmailDto.code) {
      const existingVerification = await this.emailService.findOne(
        record.user.email,
      );
      if (existingVerification && existingVerification.is_verified) {
        throw new ConflictException('Email already verified');
      }
      const password = record.user.password;
      if (verifyEmailDto.password !== password) {
        throw new ForbiddenException('Passwords don`t match');
      }
      const hashedPassword = await hash(password, 6);
      await this.prismaService.email.upsert({
        where: { email: verifyEmailDto.email },
        update: { is_verified: true },
        create: { email: verifyEmailDto.email, is_verified: true },
      });

      const user = await this.usersService.create({
        ...record.user,
        is_verified: true,
        password: hashedPassword,
      });
      const tokens = this.tokenService.generateTokens(user);
      await this.usersService.update(user.email, {
        refresh_token: tokens.refresh_token,
      });
      this.verificationCodes.delete(verifyEmailDto.email);
      res.cookie('refreshToken', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      return { accessToken: tokens.access_token, authenticated: true };
    } else {
      throw new UnauthorizedException('Invalid Code');
    }
  }

  async login(loginUserDto: LoginUserDto, res: Response) {
    const user = await this.usersService.findOne(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.is_verified) {
      throw new UnauthorizedException('Please verify your email first');
    }
    const isPasswordValid = await compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const tokens = this.tokenService.generateTokens(user);
    await this.usersService.update(user.email, {
      refresh_token: tokens.refresh_token,
    });
    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return { accessToken: tokens.access_token, authenticated: true };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = await this.usersService.findOne(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return {
        access_token: this.tokenService.generateTokens(user).access_token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
