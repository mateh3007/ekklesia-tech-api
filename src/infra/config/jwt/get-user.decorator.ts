import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from 'src/domain/enums/role.enum';

export interface IJwtUser {
  id: string;
  email: string;
  role: Role;
  churchId: string;
}

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IJwtUser => {
    const request = ctx.switchToHttp().getRequest<{ user: IJwtUser }>();
    return request.user;
  },
);
