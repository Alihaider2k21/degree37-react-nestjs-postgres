// permission.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsEnum } from './permissions.enum';
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler()
    );
    if (!requiredPermissions) {
      return true; // No specific permissions required for this route
    }
    const { user, permissions } = context.switchToHttp().getRequest();
    // console.log({ user, requiredPermissions }, permissions);
    if (permissions?.length) {
      const hasRequiredPermissions = requiredPermissions.some(
        (requiredPermission) =>
          permissions.some(
            (permission) => permission.code === requiredPermission
          )
      );
      return true; //hasRequiredPermissions ? true : false;
    } else {
      return true; // make false
    }
  }
}
