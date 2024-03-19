import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { DrivesController } from './controller/drives.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrivesService } from './service/drives.service';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { Accounts } from 'src/api/crm/accounts/entities/accounts.entity';
import { DrivesHistory } from './entities/drives-history.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { PromotionEntity } from 'src/api/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotions/entity/promotions.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { Drives } from './entities/drives.entity';
import { CrmLocations } from 'src/api/crm/locations/entities/crm-locations.entity';
import { AccountContacts } from 'src/api/crm/accounts/entities/accounts-contacts.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { ShiftsModule } from 'src/api/shifts/shifts.module';
import { CustomFields } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-field.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { DriveContact } from './dto/create-drive.dto';
import { Vehicle } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/vehicles/entities/vehicle.entity';
import { VehicleType } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/vehicle-type/entities/vehicle-type.entity';
import { ShiftsSlots } from 'src/api/shifts/entities/shifts-slots.entity';
import { DriveContactsService } from './service/drive-contacts.service';
import { DrivesContactsHistory } from './entities/drive-contacts-history.entity';
import { DrivesContacts } from './entities/drive-contacts.entity';
import { DriveCertificationsService } from './service/drive-certifications.service';
import { DrivesCertifications } from './entities/drives-certifications.entity';
import { DrivesCertificationsHistory } from './entities/drives-certifications-history.entity';
import { BookingRules } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/booking-rules/entities/booking-rules.entity';
import { ShiftsProjectionsStaff } from 'src/api/shifts/entities/shifts-projections-staff.entity';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { ShiftsStaffSetups } from 'src/api/shifts/entities/shifts-staffsetups.entity';
import { ShiftsVehicles } from 'src/api/shifts/entities/shifts-vehicles.entity';
import { DonorCenterBlueprintsModule } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/facilities/donor-center-blueprints/donor-center-blueprints.module';
import { DonorsModule } from 'src/api/crm/contacts/donor/donors.module';
import { PickupsHistory } from './entities/pickups-history.entity';
import { Pickups } from './entities/pickups.entity';
import { PickupService } from './service/pickups.service';
import { DriveEquipmentsService } from './service/drive-equipments.service';
import { DrivesEquipmentHistory } from './entities/drives-equipment-history.entity';
import { DrivesEquipments } from './entities/drives-equipment.entity';
import { CustomFieldsData } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-filed-data.entity';
import { CustomFieldsDataHistory } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-filed-data-history';
import { DrivesZipCodes } from './entities/drives-zipcodes.entity';
import { DrivesDonorCommunicationSupplementalAccounts } from './entities/drives-donor-comms-supp-accounts.entity';
import { DrivesPromotionalItems } from './entities/drives_promotional_items.entity';
import { DrivesMarketingMaterialItems } from './entities/drives-marketing-material-items.entity';
import { LinkedDrives } from './entities/linked-drives.entity';
import { LinkedDrivesHistory } from './entities/linked-drives-history.entity';
import { LinkedDriveService } from './service/linked-drive.service';
import { DonorsAppointments } from 'src/api/crm/contacts/donor/entities/donors-appointments.entity';
import { DrivesZipCodesHistory } from './entities/drives-zipcodes-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Drives,
      DrivesHistory,
      DriveContact,
      DrivesContacts,
      DrivesContactsHistory,
      DrivesCertifications,
      DrivesCertificationsHistory,
      DrivesEquipments,
      DrivesEquipmentHistory,
      LinkedDrives,
      LinkedDrivesHistory,
      Pickups,
      PickupsHistory,
      Vehicle,
      VehicleType,
      DrivesDonorCommunicationSupplementalAccounts,
      Accounts,
      User,
      CustomFieldsData,
      CustomFieldsDataHistory,
      CrmLocations,
      PromotionEntity,
      OperationsStatus,
      AccountContacts,
      ContactsRoles,
      Tenant,
      BookingRules,
      CustomFields,
      Permissions,
      Shifts,
      ShiftsSlots,
      ShiftsProjectionsStaff,
      ShiftsStaffSetups,
      ShiftsProjectionsStaff,
      ShiftsVehicles,
      DrivesZipCodes,
      DrivesZipCodesHistory,
      DrivesPromotionalItems,
      DrivesMarketingMaterialItems,
      DonorsAppointments,
    ]),
    ShiftsModule,
    DonorCenterBlueprintsModule,
    DonorsModule,
  ],
  providers: [
    DrivesService,
    JwtService,
    DriveContactsService,
    DriveCertificationsService,
    PickupService,
    DriveEquipmentsService,
    LinkedDriveService,
  ],
  controllers: [DrivesController],
  exports: [
    DriveContactsService,
    DriveCertificationsService,
    PickupService,
    DriveEquipmentsService,
    LinkedDriveService,
  ],
})
export class DrivesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/drives', method: RequestMethod.POST },
      { path: '/drives/:id', method: RequestMethod.PUT },

      { path: '/drives/last/:id', method: RequestMethod.GET },
      { path: '/drives/:id', method: RequestMethod.GET },
      { path: '/drives/:id', method: RequestMethod.DELETE },
      {
        path: '/drives/shifts/:shiftId/projection/:procedureTypeId/slots',
        method: RequestMethod.POST,
      },
      {
        path: '/drives/shifts/projection/staff',
        method: RequestMethod.PATCH,
      },
      {
        path: '/drives/shifts/donors-schedules/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/drives/shifts/procedure-type/slots',
        method: RequestMethod.POST,
      },
      { path: '/drives/:drive_id/contacts', method: RequestMethod.POST },
      {
        path: '/drives/:drive_id/contacts/:contact_id',
        method: RequestMethod.PUT,
      },
      { path: '/drives/:drive_id/certifications', method: RequestMethod.POST },
      { path: '/drives/blueprints/account/:id', method: RequestMethod.GET },
      { path: '/drives/single/:id', method: RequestMethod.GET },
      { path: '/drives/:drive_id/pickups', method: RequestMethod.POST },
      { path: '/drives/:drive_id/pickups', method: RequestMethod.GET },
      { path: '/drives/:id/change-audit', method: RequestMethod.GET },
      { path: '/drives/:drive_id/equipment', method: RequestMethod.POST },
      {
        path: '/drives/:drive_id/equipment/:equipment_id',
        method: RequestMethod.PUT,
      },
      { path: '/drives/:drive_id/link_drive', method: RequestMethod.POST },
      { path: '/drives/list/account/:id', method: RequestMethod.GET },
      { path: '/drives/linkvehicles', method: RequestMethod.GET },
      {
        path: '/drives/donors/:donorId/appointments/:appointmentId',
        method: RequestMethod.PUT,
      },
      { path: '/drives/donors/appointments', method: RequestMethod.POST }
    );
  }
}
