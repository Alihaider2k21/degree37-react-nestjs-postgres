import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserService } from './services/user.services';
import { UserController } from './controller/user.controller';
import { User } from './entity/user.entity';
import { UserBusinessUnits } from './entity/user-business-units.entity';
import { Roles } from '../../../platform-administration/roles-administration/role-permissions/entities/role.entity';
import { UserHistory } from './entity/userhistory.entity';
import { UserBusinessUnitsHistory } from './entity/user-business-units-history.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { TenantUserController } from './controller/tenant-user.controller';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { BusinessUnits } from '../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { OrganizationalLevels } from '../../organizational-administration/hierarchy/organizational-levels/entities/organizational-level.entity';
import { CommunicationService } from 'src/api/crm/contacts/volunteer/communication/services/communication.service';
import { Contacts } from 'src/api/crm/contacts/common/entities/contacts.entity';
import { Communications } from 'src/api/crm/contacts/volunteer/communication/entities/communication.entity';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Roles,
      UserHistory,
      Tenant,
      BusinessUnits,
      Contacts,
      Permissions,
      OrganizationalLevels,
      Communications,
      UserBusinessUnits,
      UserBusinessUnitsHistory,
    ]),
    HttpModule,
  ],
  providers: [UserService, JwtService, CommunicationService],
  controllers: [UserController, TenantUserController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/user', method: RequestMethod.POST },
      { path: '/user/all-users', method: RequestMethod.GET },
      { path: '/user/all-owners', method: RequestMethod.GET },
      {
        path: '/user/collection-operation/:id/all-owners',
        method: RequestMethod.GET,
      },
      { path: '/tenant-users', method: RequestMethod.POST },
      { path: '/user', method: RequestMethod.GET },
      { path: '/user/recruiters', method: RequestMethod.GET },
      { path: '/user', method: RequestMethod.PUT },
      { path: '/user/archive/:id', method: RequestMethod.PATCH },
      { path: '/user/:id/update_password', method: RequestMethod.PATCH },
      { path: '/user/current/detail', method: RequestMethod.GET },
      { path: '/tenant-users', method: RequestMethod.GET },
      { path: '/tenant-users', method: RequestMethod.PUT },
      {
        path: '/tenant-users/:id/update_password',
        method: RequestMethod.PATCH,
      },
      { path: '/tenant-users/recruiters', method: RequestMethod.GET },
      { path: '/tenant-users/managers', method: RequestMethod.GET },
      { path: '/tenant-users/manager', method: RequestMethod.PATCH },
      { path: '/tenant-users/email/:work_email', method: RequestMethod.GET },
      { path: '/user/admin_user/:tenantId', method: RequestMethod.GET }
    );
  }
}
