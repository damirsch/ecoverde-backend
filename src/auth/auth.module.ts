import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EmailService } from 'src/email/email.service';
import { TokenService } from 'src/token/token.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_ACCESS_EXPIRATION}s` },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, EmailService, TokenService],
  exports: [AuthService],
})
export class AuthModule {}
