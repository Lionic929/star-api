import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/auth/user.entity';
import { UserRole } from 'src/auth/enum/user-role.enum';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user = null }: { user: User } = request;

    if (user === null) {
      return false;
    }

    const { role = null }: { role: keyof UserRole } = user;

    if (role === null) {
      return false;
    }

    if (String(role) === String(UserRole.BLOCKED)) {
      return false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (roles) {
      const index = roles.indexOf(role);
      return index !== -1;
    }

    return true;
  }
}
