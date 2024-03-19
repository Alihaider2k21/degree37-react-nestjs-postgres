import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RolePermissionsService } from './services/role-permissions.service';
import { RolePermissionsController } from './controllers/role-permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modules } from './entities/module.entity';
import { Permissions } from './entities/permission.entity';
import { Roles } from './entities/role.entity';
import { RolePermission } from './entities/rolePermission.entity';
import { User } from '../../../tenants-administration/user-administration/user/entity/user.entity';
import { TenantRole } from './entities/tenantRole.entity';
import { Tenant } from '../../tenant-onboarding/tenant/entities/tenant.entity';
import { RolesHistory } from './entities/roleHistory';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Modules,
      Roles,
      User,
      Permissions,
      RolePermission,
      Tenant,
      TenantRole,
      RolesHistory,
    ]),
  ],
  controllers: [RolePermissionsController],
  providers: [RolePermissionsService, JwtService],
})
export class RolePermissionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/roles', method: RequestMethod.POST },
      { path: '/roles', method: RequestMethod.GET },
      { path: '/permissions', method: RequestMethod.GET },
      { path: '/roles/tenant/create', method: RequestMethod.POST },
      { path: '/roles/tenant/list', method: RequestMethod.GET },
      { path: '/roles/tenant/all', method: RequestMethod.GET },
      { path: '/roles/tenant/:id', method: RequestMethod.GET },
      { path: '/roles/tenant/assigned/:id', method: RequestMethod.GET },
      { path: '/roles/:id', method: RequestMethod.GET },
      { path: '/roles/:id', method: RequestMethod.PATCH },
      { path: '/roles/tenant/:id', method: RequestMethod.PATCH },
      { path: '/roles/archive/:id', method: RequestMethod.PATCH },
      {
        path: '/permissions/:roleId/:permissionId',
        method: RequestMethod.DELETE,
      },
      { path: '/roles/all', method: RequestMethod.GET }
    );
  }
}
