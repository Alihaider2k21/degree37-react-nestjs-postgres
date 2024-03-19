import { SetMetadata } from '@nestjs/common';
import { PermissionsEnum } from './permissions.enum';
export const Permissions = (...permissions: PermissionsEnum[]) =>
  SetMetadata('permissions', permissions);
