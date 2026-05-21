import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IJwtUser {
  id: string;
  email: string;
  role: string;
  churchId: string;
}

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IJwtUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
