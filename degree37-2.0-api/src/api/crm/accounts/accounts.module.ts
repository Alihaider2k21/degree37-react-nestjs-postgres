import { DrivesMarketingMaterialItems } from './../../operations-center/operations/drives/entities/drives-marketing-material-items.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AccountsService } from './services/accounts.service';
import { AccountsController } from './controller/accounts.controller';
import { Accounts } from './entities/accounts.entity';
import { User } from '../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { AuthMiddleware } from '../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { AccountsHistory } from './entities/accounts-history.entity';
import { AccountContacts } from './entities/accounts-contacts.entity';
import { AccountContactsHistory } from './entities/accounts-contacts-history.entity';
import { AccountContactsService } from './services/accounts-contacts.service';
import { AccountPreferences } from './entities/account-preferences.entity';
import { AccountPreferencesService } from './services/accounts-preferences.service';
import { AccountPreferencesHistory } from './entities/account-preferences-history.entity';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { AddressHistory } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/addressHistory.entity';
import { AccountAffiliations } from './entities/account-affiliations.entity';
import { AccountAffilitaionsHistory } from './entities/account-affiliations-history.entity';
import { AccountAffiliationsService } from './services/accounts-affiliations.service';
import { IndustryCategoriesModule } from 'src/api/system-configuration/tenants-administration/crm-administration/account/industry-categories/industry-categories.module';
import { StagesModule } from 'src/api/system-configuration/tenants-administration/crm-administration/account/stages/stages.module';
import { SourcesModule } from 'src/api/system-configuration/tenants-administration/crm-administration/account/sources/sources.module';
import { BusinessUnitModule } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/business-units.module';
import { UserModule } from 'src/api/system-configuration/tenants-administration/user-administration/user/user.module';
import { TerritoriesModule } from 'src/api/system-configuration/tenants-administration/geo-administration/territories/territories.module';
import { BBCSConnector } from 'src/connector/bbcsconnector';
import { ExportService } from '../contacts/common/exportData.service';
import { S3Service } from '../contacts/common/s3.service';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { AccountsBluePrintsService } from './services/accounts-blueprints.service';
import { DrivesModule } from 'src/api/operations-center/operations/drives/drives.module';
import { Drives } from 'src/api/operations-center/operations/drives/entities/drives.entity';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { CustomFields } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-field.entity';
import { Facility } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/facilities/entity/facility.entity';
import { ShiftService } from './shiftDetails/service/shift-details.service';
import { ShiftDetailsController } from './shiftDetails/controller/shift-details.controller';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { DrivesPromotionalItems } from 'src/api/operations-center/operations/drives/entities/drives_promotional_items.entity';
import { PromotionalItems } from 'src/api/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotional-items/entities/promotional-item.entity';
import { MarketingMaterials } from 'src/api/system-configuration/tenants-administration/operations-administration/marketing-equipment/marketing-material/entities/marketing-material.entity';
import { DrivesZipCodes } from 'src/api/operations-center/operations/drives/entities/drives-zipcodes.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { CRMVolunteer } from '../contacts/volunteer/entities/crm-volunteer.entity';
import { DrivesDonorCommunicationSupplementalAccounts } from 'src/api/operations-center/operations/drives/entities/drives-donor-comms-supp-accounts.entity';
import { TenantConfigurationDetail } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenantConfigurationDetail';

@Module({
  imports: [
    IndustryCategoriesModule,
    StagesModule,
    SourcesModule,
    BusinessUnitModule,
    UserModule,
    TerritoriesModule,
    DrivesModule,
    TypeOrmModule.forFeature([
      Accounts,
      User,
      CustomFields,
      AccountsHistory,
      AccountContacts,
      AccountContactsHistory,
      AccountPreferences,
      AccountPreferencesHistory,
      Address,
      AddressHistory,
      Shifts,
      Facility,
      Drives,
      AccountAffiliations,
      AccountAffilitaionsHistory,
      Permissions,
      BusinessUnits,
      DrivesMarketingMaterialItems,
      DrivesPromotionalItems,
      PromotionalItems,
      MarketingMaterials,
      DrivesZipCodes,
      ContactsRoles,
      CRMVolunteer,
      DrivesDonorCommunicationSupplementalAccounts,
      TenantConfigurationDetail,
    ]),
  ],
  providers: [
    AccountsService,
    AccountContactsService,
    AccountsBluePrintsService,
    JwtService,
    ShiftService,
    AccountPreferencesService,
    AccountAffiliationsService,
    BBCSConnector,
    ExportService,
    S3Service,
  ],
  controllers: [AccountsController, ShiftDetailsController],
  exports: [
    AccountsService,
    AccountContactsService,
    AccountPreferencesService,
    AccountAffiliationsService,
    AccountsBluePrintsService,
    ShiftService,
  ],
})
export class AccountsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/accounts', method: RequestMethod.GET },
      { path: '/accounts/recruiter', method: RequestMethod.GET },
      { path: '/accounts/recruiter/:id', method: RequestMethod.GET },
      { path: '/accounts/:id', method: RequestMethod.GET },
      { path: '/accounts', method: RequestMethod.POST },
      { path: '/accounts/:id', method: RequestMethod.PUT },
      { path: '/accounts/:id', method: RequestMethod.DELETE },
      {
        path: '/accounts/drives',
        method: RequestMethod.POST,
      },
      {
        path: '/accounts/:id/drives-history',
        method: RequestMethod.GET,
      },
      {
        path: '/accounts/:id/drives-history/kpi',
        method: RequestMethod.GET,
      },
      {
        path: '/accounts/:id/drives-history/details/:driveId',
        method: RequestMethod.GET,
      },
      { path: '/accounts/:id/account-contacts', method: RequestMethod.POST },
      { path: '/accounts/:id/account-contacts', method: RequestMethod.GET },
      { path: '/accounts/account-contacts/:id', method: RequestMethod.PUT },
      { path: '/accounts/:id/account-preferences', method: RequestMethod.POST },
      { path: '/accounts/:id/account-preferences', method: RequestMethod.GET },
      {
        path: '/accounts/:id/account-preferences/:preference_id',
        method: RequestMethod.PUT,
      },
      {
        path: '/accounts/:id/account-affiliations',
        method: RequestMethod.POST,
      },
      { path: '/accounts/:id/account-affiliations', method: RequestMethod.GET },
      {
        path: '/accounts/:id/account-affiliations/:affiliation_id',
        method: RequestMethod.PUT,
      },
      {
        path: '/accounts/upsert/seed-data',
        method: RequestMethod.GET,
      },
      {
        path: '/accounts/bluePrints/:id/get',
        method: RequestMethod.GET,
      },
      {
        path: '/accounts/bluePrintsDefault/:id/get',
        method: RequestMethod.GET,
      },
      {
        path: '/accounts/blueprint/default',
        method: RequestMethod.POST,
      },
      {
        path: '/shifts/:id',
        method: RequestMethod.GET,
      }
    );
  }
}
