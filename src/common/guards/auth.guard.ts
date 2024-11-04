// src/common/guards/auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1];
    try {
      const user = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      request.user = user;
      const requiredRoles = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );
      if (requiredRoles && !requiredRoles.includes(user.role)) {
        throw new ForbiddenException('Insufficient permissions');
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
