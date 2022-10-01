import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector = new Reflector()) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    return this.validateRequest(context);
  }

  private validateRequest(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles.length) {
      return true;
    }

    const abilities = roles.filter((value) => user.abilities.includes(value));

    if (roles.length === abilities.length) {
      return true;
    }

    return false;
  }
}
