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
import { CommonFunction } from '../../crm/contacts/common/common-functions';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { Contacts } from '../../crm/contacts/common/entities/contacts.entity';
import { AddressService } from '../../crm/contacts/common/address.service';
import { ContactsService } from '../../crm/contacts/common/contacts.service';
import { AddressHistory } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/addressHistory.entity';
import { ContactsHistory } from '../../crm/contacts/common/entities/contacts-history.entity';
import { CRMVolunteer } from '../../crm/contacts/volunteer/entities/crm-volunteer.entity';
import { CRMVolunteerHistory } from '../../crm/contacts/volunteer/entities/crm-volunteer-history.entity';
import { CRMVolunteerService } from '../../crm/contacts/volunteer/services/crm-volunteer.service';
import { Prefixes } from '../../crm/contacts/common/prefixes/entities/prefixes.entity';
import { Suffixes } from '../../crm/contacts/common/suffixes/entities/suffixes.entity';
import { VolunteerDuplicatesModule } from '../../crm/contacts/volunteer/volunteerDuplicates/volunteer-duplicates.module';
import { S3Service } from '../../crm/contacts/common/s3.service';
import { ExportService } from '../../crm/contacts/common/exportData.service';
import { CommunicationModule } from '../../crm/contacts/volunteer/communication/communication.module';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { CustomFields } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-field.entity';
import { CRMVolunteerActivityLog } from '../../crm/contacts/volunteer/entities/crm-volunteer-activity-log.entity';
import { AccountContacts } from '../../crm/accounts/entities/accounts-contacts.entity';
import { CrmLocations } from '../../crm/locations/entities/crm-locations.entity';
import { CrmLocationsHistory } from '../../crm/locations/entities/crm-locations-history';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { StaffHistory } from 'src/api/crm/contacts/staff/entities/staff-history.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { StaffingClassification } from 'src/api/system-configuration/tenants-administration/staffing-administration/classifications/entity/classification.entity';
import { StaffRolesMapping } from 'src/api/crm/contacts/staff/staffRolesMapping/entities/staff-roles-mapping.entity';
import { StaffRolesMappingHistory } from 'src/api/crm/contacts/staff/staffRolesMapping/entities/staff-roles-mapping-history.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { StaffDonorCentersMapping } from 'src/api/crm/contacts/staff/staffDonorCentersMapping/entities/staff-donor-centers-mapping.entity';
import { StaffDonorCentersMappingHistory } from 'src/api/crm/contacts/staff/staffDonorCentersMapping/entities/staff-donor-centers-mapping-history.entity';
import { Facility } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/facilities/entity/facility.entity';
import { Team } from 'src/api/system-configuration/tenants-administration/staffing-administration/teams/entity/team.entity';
import { TeamStaff } from 'src/api/system-configuration/tenants-administration/staffing-administration/teams/entity/team-staff.entiity';
import { StaffDuplicatesModule } from 'src/api/crm/contacts/staff/staffDuplicates/staff-duplicates.module';
import { StaffClassificationModule } from 'src/api/crm/contacts/staff/staffClassification/staff-classification.module';
import { StaffShiftScheduleModule } from 'src/api/crm/contacts/staff/staffShiftSchedule/staff-shift-schedule.module';
import { StaffService } from 'src/api/crm/contacts/staff/services/staff.service';
import { StaffRolesMappingService } from 'src/api/crm/contacts/staff/staffRolesMapping/services/staff-roles-mapping.service';
import { StaffDonorCentersMappingService } from 'src/api/crm/contacts/staff/staffDonorCentersMapping/services/staff-donor-centers-mapping.service';
import { StaffController } from 'src/api/crm/contacts/staff/controller/staff.controller';
import { Donors } from 'src/api/crm/contacts/donor/entities/donors.entity';
import { DonorsHistory } from 'src/api/crm/contacts/donor/entities/donors-history.entity';
import { DonorsAppointments } from 'src/api/crm/contacts/donor/entities/donors-appointments.entity';
import { TenantConfigurationDetail } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenantConfigurationDetail';
import { DonorDuplicatesModule } from 'src/api/crm/contacts/donor/donorDuplicates/donor-duplicates.module';
import { DonorRecentActivity } from 'src/api/crm/contacts/donor/recent-activity/recent-activity.module';
import { DonorsController } from 'src/api/crm/contacts/donor/controller/donors.controller';
import { DonorsService } from 'src/api/crm/contacts/donor/services/donors.service';
import { BBCSConnector } from 'src/connector/bbcsconnector';
import { StaffCertification } from 'src/api/system-configuration/tenants-administration/staffing-administration/certification/entity/staff-certification.entity';
import { CertificationModule } from 'src/api/system-configuration/tenants-administration/staffing-administration/certification/certification.module';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { ShiftsSlots } from 'src/api/shifts/entities/shifts-slots.entity';
import { Drives } from 'src/api/operations-center/operations/drives/entities/drives.entity';
import { Sessions } from 'src/api/operations-center/operations/sessions/entities/sessions.entity';
import { DonorsAppointmentsHistory } from 'src/api/crm/contacts/donor/entities/donors-appointments-history.entity';
import { VolunteerController } from './controller/Contact-type.controller';

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
      Staff,
      StaffHistory,
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
      Donors,
      DonorsHistory,
      DonorsAppointments,
      TenantConfigurationDetail,
      StaffCertification,
      Shifts,
      ShiftsSlots,
      Drives,
      Sessions,
      DonorsAppointments,
      DonorsAppointmentsHistory,
    ]),
    VolunteerDuplicatesModule,
    CommunicationModule,
    StaffDuplicatesModule,
    StaffClassificationModule,
    StaffShiftScheduleModule,
    DonorDuplicatesModule,
    DonorRecentActivity,
    CertificationModule,
  ],
  controllers: [VolunteerController, StaffController, DonorsController],
  providers: [
    CRMVolunteerService,
    CommonFunction,
    S3Service,
    AddressService,
    ContactsService,
    JwtService,
    ExportService,
    StaffService,
    StaffRolesMappingService,
    StaffDonorCentersMappingService,

    BusinessUnits,
    StaffingClassification,

    DonorsService,
    BBCSConnector,
  ],
  exports: [
    CRMVolunteerService,
    StaffService,
    StaffRolesMappingService,
    StaffDonorCentersMappingService,
    DonorsService,
    CommonFunction,
    AddressService,
    ContactsService,
    S3Service,
    ExportService,
  ],
})
export class ContactList implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/contact/:type/list', method: RequestMethod.GET },
        { path: '/contact/:type/single/:id', method: RequestMethod.GET }
      );
  }
}
