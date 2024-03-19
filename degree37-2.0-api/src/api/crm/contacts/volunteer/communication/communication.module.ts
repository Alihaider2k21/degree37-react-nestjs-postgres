import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CommunicationController } from './controller/communication.controller';
import { CommunicationService } from './services/communication.service';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Communications } from './entities/communication.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { Contacts } from '../../common/entities/contacts.entity';
import { CRMVolunteer } from '../entities/crm-volunteer.entity';
import { HttpService, HttpModule } from '@nestjs/axios';
import { TenantService } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/services/tenant.service';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { TenantHistory } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenantHistory.entity';
import { TenantConfigurationDetail } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenantConfigurationDetail';
import { TenantConfigurationDetailHistory } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenantConfigurationDetailHistory';
import { AddressHistory } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/addressHistory.entity';
import { Applications } from 'src/api/system-configuration/platform-administration/roles-administration/application/entities/application.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { RolePermission } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/rolePermission.entity';
import { Roles } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Communications,
      Permissions,
      Contacts,
      CRMVolunteer,
      Tenant,
      Address,
      TenantHistory,
      TenantConfigurationDetail,
      TenantConfigurationDetailHistory,
      AddressHistory,
      Applications,
      ContactsRoles,
      RolePermission,
      Roles,
    ]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [CommunicationController],
  providers: [CommunicationService, JwtService, HttpModule, TenantService], // HttpService should only be in providers
  exports: [CommunicationService],
})
export class CommunicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/contacts/volunteers/communications',
      method: RequestMethod.POST,
    });
  }
}
