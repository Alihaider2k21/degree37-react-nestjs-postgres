import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TenantService } from './services/tenant.service';
import { TenantController } from './controller/tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { Address } from './entities/address.entity';
import { TenantConfigurationDetail } from './entities/tenantConfigurationDetail';
import { TenantConfigurationDetailHistory } from './entities/tenantConfigurationDetailHistory';
import { TenantHistory } from './entities/tenantHistory.entity';
import { AddressHistory } from './entities/addressHistory.entity';
import { User } from '../../../tenants-administration/user-administration/user/entity/user.entity';
import { Applications } from '../../roles-administration/application/entities/application.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { Permissions } from '../../roles-administration/role-permissions/entities/permission.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '../../roles-administration/role-permissions/entities/role.entity';
import { RolePermission } from '../../roles-administration/role-permissions/entities/rolePermission.entity';
import { CommunicationService } from 'src/api/crm/contacts/volunteer/communication/services/communication.service';
import { Contacts } from 'src/api/crm/contacts/common/entities/contacts.entity';
import { Communications } from 'src/api/crm/contacts/volunteer/communication/entities/communication.entity';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Tenant,
      Address,
      TenantHistory,
      AddressHistory,
      TenantConfigurationDetail,
      TenantConfigurationDetailHistory,
      Applications,
      ContactsRoles,
      Permissions,
      Roles,
      RolePermission,
      Contacts,
      Communications,
    ]),
    HttpModule,
  ],
  controllers: [TenantController],
  providers: [TenantService, JwtService, CommunicationService],
  exports: [TenantService],
})
export class TenantModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/tenants', method: RequestMethod.POST },
      { path: '/tenants', method: RequestMethod.GET },
      { path: '/tenants/:id', method: RequestMethod.GET },
      { path: '/tenants/:id/edit', method: RequestMethod.PUT },
      { path: '/tenants/:id/configurations', method: RequestMethod.POST },
      { path: '/tenants/:id/configurations', method: RequestMethod.PUT },
      { path: '/tenants/:id/configurations', method: RequestMethod.GET },
      {
        path: '/tenants/user/impersonate/:tenantId',
        method: RequestMethod.POST,
      },
      { path: '/tenants/:id/create-ds-campaign', method: RequestMethod.GET }
    );
  }
}
