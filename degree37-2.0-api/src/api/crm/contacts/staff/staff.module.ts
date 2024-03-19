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
import { Staff } from './entities/staff.entity';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { AddressHistory } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/addressHistory.entity';
import { Contacts } from '../common/entities/contacts.entity';
import { ContactsHistory } from '../common/entities/contacts-history.entity';
import { AddressService } from '../common/address.service';
import { ContactsService } from '../common/contacts.service';
import { StaffHistory } from './entities/staff-history.entity';
import { StaffController } from './controller/staff.controller';
import { StaffService } from './services/staff.service';
import { StaffingClassification } from 'src/api/system-configuration/tenants-administration/staffing-administration/classifications/entity/classification.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { StaffRolesMapping } from './staffRolesMapping/entities/staff-roles-mapping.entity';
import { StaffRolesMappingHistory } from './staffRolesMapping/entities/staff-roles-mapping-history.entity';
import { StaffRolesMappingService } from './staffRolesMapping/services/staff-roles-mapping.service';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { StaffDonorCentersMapping } from './staffDonorCentersMapping/entities/staff-donor-centers-mapping.entity';
import { StaffDonorCentersMappingHistory } from './staffDonorCentersMapping/entities/staff-donor-centers-mapping-history.entity';
import { StaffDonorCentersMappingService } from './staffDonorCentersMapping/services/staff-donor-centers-mapping.service';
import { Facility } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/facilities/entity/facility.entity';
import { Team } from 'src/api/system-configuration/tenants-administration/staffing-administration/teams/entity/team.entity';
import { TeamStaff } from 'src/api/system-configuration/tenants-administration/staffing-administration/teams/entity/team-staff.entiity';
import { StaffDuplicatesModule } from './staffDuplicates/staff-duplicates.module';
import { Prefixes } from '../common/prefixes/entities/prefixes.entity';
import { Suffixes } from '../common/suffixes/entities/suffixes.entity';
import { S3Service } from '../common/s3.service';
import { ExportService } from '../common/exportData.service';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { CustomFields } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-field.entity';
import { StaffClassificationModule } from './staffClassification/staff-classification.module';
import { StaffShiftScheduleModule } from './staffShiftSchedule/staff-shift-schedule.module';
import { StaffCertification } from 'src/api/system-configuration/tenants-administration/staffing-administration/certification/entity/staff-certification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Staff,
      StaffHistory,
      Address,
      AddressHistory,
      Contacts,
      ContactsHistory,
      Tenant,
      BusinessUnits,
      StaffingClassification,
      StaffRolesMapping,
      StaffRolesMappingHistory,
      ContactsRoles,
      StaffDonorCentersMapping,
      StaffDonorCentersMappingHistory,
      Facility,
      Team,
      TeamStaff,
      Prefixes,
      Suffixes,
      Permissions,
      CustomFields,
      StaffCertification,
    ]),
    StaffDuplicatesModule,
    StaffClassificationModule,
    StaffShiftScheduleModule,
  ],
  controllers: [StaffController],
  providers: [
    StaffService,
    StaffRolesMappingService,
    StaffDonorCentersMappingService,
    CommonFunction,
    AddressService,
    ContactsService,
    BusinessUnits,
    StaffingClassification,
    JwtService,
    S3Service,
    ExportService,
  ],
  exports: [
    StaffService,
    StaffRolesMappingService,
    StaffDonorCentersMappingService,
    S3Service,
    ExportService,
  ],
})
export class StaffModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/contact-staff', method: RequestMethod.POST },
      { path: '/contact-staff', method: RequestMethod.GET },
      {
        path: '/contact-staff/all',
        method: RequestMethod.GET,
      },
      { path: '/contact-staff/:id', method: RequestMethod.GET },
      { path: '/contact-staff/:id', method: RequestMethod.PUT },
      { path: '/contact-staff/:id/roles', method: RequestMethod.POST },
      { path: '/contact-staff/:id/roles', method: RequestMethod.GET },
      {
        path: '/contact-staff/:id/roles/:role_id/primary-status',
        method: RequestMethod.PATCH,
      },
      {
        path: '/contact-staff/:id/roles/:role_id',
        method: RequestMethod.PATCH,
      },
      { path: '/contact-staff/:id/donor-centers', method: RequestMethod.POST },
      { path: '/contact-staff/:id/donor-centers', method: RequestMethod.GET },
      {
        path: '/contact-staff/:id/donor-centers/:donor_center_id/primary-status',
        method: RequestMethod.PATCH,
      },
      {
        path: '/contact-staff/:id/donor-centers/:donor_center_id',
        method: RequestMethod.PATCH,
      },
      { path: '/contact-staff/staffs/:id/teams', method: RequestMethod.GET },
      { path: '/contact-staff/staffs/:id/teams', method: RequestMethod.POST },
      {
        path: '/contact-staff/staffs/:id/teams/primary',
        method: RequestMethod.PATCH,
      },
      {
        path: '/contact-staff/staffs/:id/teams/remove',
        method: RequestMethod.PATCH,
      },
      {
        path: '/contact-staff/:id/donor-centers',
        method: RequestMethod.POST,
      },
      {
        path: '/contact-staff/:id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
