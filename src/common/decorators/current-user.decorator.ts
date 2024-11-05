import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserFromToken } from '../types';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): UserFromToken => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
