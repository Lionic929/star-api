import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PrivateKeyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { body }: { body } = request;

    if (!body) {
      return false;
    }

    const { privateKey } = body;

    if (!privateKey) {
      return false;
    }

    const isKeyValid = privateKey === process.env.PRIVATE_KEY;

    if (!isKeyValid) {
      return false;
    } else {
      return true;
    }
  }
}
