import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/common/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailDto } from 'src/common/dto/verify-email.dto';
import { PrismaService } from 'src/prisma.service';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  private verificationCodes: Map<
    string,
    { code: string; user: CreateUserDto }
  > = new Map();

  constructor(
    private usersService: UsersService,
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

  async verifyEmailAndCreateUser(verifyEmailDto: VerifyEmailDto) {
    const record = this.verificationCodes.get(verifyEmailDto.email);
    if (record && record.code === verifyEmailDto.code) {
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.usersService.findOne(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return this.tokenService.generateTokens(user.email, user.id);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
