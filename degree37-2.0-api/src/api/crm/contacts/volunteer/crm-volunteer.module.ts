import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { CommonFunction } from '../common/common-functions';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { Contacts } from '../common/entities/contacts.entity';
import { VolunteerController } from './controller/crm-volunteer.controller';
import { AddressService } from '../common/address.service';
import { ContactsService } from '../common/contacts.service';
import { AddressHistory } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/addressHistory.entity';
import { ContactsHistory } from '../common/entities/contacts-history.entity';
import { CRMVolunteer } from './entities/crm-volunteer.entity';
import { CRMVolunteerHistory } from './entities/crm-volunteer-history.entity';
import { CRMVolunteerService } from './services/crm-volunteer.service';
import { Prefixes } from '../common/prefixes/entities/prefixes.entity';
import { Suffixes } from '../common/suffixes/entities/suffixes.entity';
import { VolunteerDuplicatesModule } from './volunteerDuplicates/volunteer-duplicates.module';
import { S3Service } from '../common/s3.service';
import { ExportService } from '../common/exportData.service';
import { CommunicationModule } from './communication/communication.module';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { CustomFields } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-field.entity';
import { CRMVolunteerActivityLog } from './entities/crm-volunteer-activity-log.entity';
import { AccountContacts } from '../../accounts/entities/accounts-contacts.entity';
import { CrmLocations } from '../../locations/entities/crm-locations.entity';
import { CrmLocationsHistory } from '../../locations/entities/crm-locations-history';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      CRMVolunteer,
      CRMVolunteerHistory,
      Address,
      AddressHistory,
      Contacts,
      ContactsHistory,
      Tenant,
      Prefixes,
      Suffixes,
      Permissions,
      CustomFields,
      CRMVolunteerActivityLog,
      AccountContacts,
      CrmLocations,
      CrmLocationsHistory,
    ]),
    VolunteerDuplicatesModule,
    CommunicationModule,
  ],
  controllers: [VolunteerController],
  providers: [
    CRMVolunteerService,
    CommonFunction,
    S3Service,
    AddressService,
    ContactsService,
    JwtService,
    ExportService,
  ],
  exports: [
    CRMVolunteerService,
    CommonFunction,
    AddressService,
    ContactsService,
    S3Service,
    ExportService,
  ],
})
export class CRMVolunteerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/contact-volunteer', method: RequestMethod.POST },
        { path: '/contact-volunteer', method: RequestMethod.GET },
        { path: '/contact-volunteer/:id', method: RequestMethod.GET },
        { path: '/contact-volunteer/:id', method: RequestMethod.PUT },
        { path: '/contact-volunteer/:id', method: RequestMethod.PATCH }
      );
  }
}
