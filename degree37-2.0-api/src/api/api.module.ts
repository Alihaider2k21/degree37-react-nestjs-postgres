import { QualificationModule } from './crm/locations/qualification/qualification.module';
import { Module } from '@nestjs/common';
import { EmailTemplateModule } from './admin/email-template/email-template.module';
import { TemplatesModule } from './admin/templates/templates.module';
import { AuthModule } from './common/auth/auth.module';
import { NotesAttachmentCategoryModule } from './system-configuration/tenants-administration/operations-administration/notes-attachment/attachment-category/attachment-category.module';
import { NotesAttachmentSubCategoryModule } from './system-configuration/tenants-administration/operations-administration/notes-attachment/attachment-subcategory/attachment-subcategory.module';
import { AccountsModule } from './crm/accounts/accounts.module';
import { AttachmentModule } from './crm/common/documents/attachment/attachment.module';
import { NotesModule } from './crm/common/documents/notes/note.module';
import { StaffModule } from './crm/contacts/staff/staff.module';
import { StaffLeaveModule } from './crm/contacts/staff/staffLeave/staff-leave.module';
import { PrefixesModule } from './crm/contacts/common/prefixes/prefixes.module';
import { SuffixesModule } from './crm/contacts/common/suffixes/suffixes.module';
import { CRMVolunteerModule } from './crm/contacts/volunteer/crm-volunteer.module';
import { NonCollectionProfileModule } from './crm/crm-non-collection-profiles/non-collection-profile.module';
import { DirectionsModule } from './crm/locations/directions/direction.module';
import { DonorAuthModule } from './donor-portal/auth/donor-auth/donor-auth.module';
import { MenuItemsModule } from './donor-portal/menu-items/menu-items.module';
import { LogsEventModule } from './system-configuration/logs-events/logs-event.module';
import { ApplicationModule } from './system-configuration/platform-administration/roles-administration/application/application.module';
import { RolePermissionsModule } from './system-configuration/platform-administration/roles-administration/role-permissions/role-permissions.module';
import { TenantModule } from './system-configuration/platform-administration/tenant-onboarding/tenant/tenant.module';
import { AffiliationModule } from './system-configuration/tenants-administration/crm-administration/account/affiliation/affiliation.module';
import { AccountsAttachmentCategoryModule } from './system-configuration/tenants-administration/crm-administration/account/attachment-category/attachment-category.module';
import { AccountsAttachmentSubCategoryModule } from './system-configuration/tenants-administration/crm-administration/account/attachment-subcategory/attachment-subcategory.module';
import { IndustryCategoriesModule } from './system-configuration/tenants-administration/crm-administration/account/industry-categories/industry-categories.module';
import { AccountNoteCategoryModule } from './system-configuration/tenants-administration/crm-administration/account/note-category/note-category.module';
import { AccountNoteSubCategoryModule } from './system-configuration/tenants-administration/crm-administration/account/note-subcategory/note-subcategory.module';
import { SourcesModule } from './system-configuration/tenants-administration/crm-administration/account/sources/sources.module';
import { StagesModule } from './system-configuration/tenants-administration/crm-administration/account/stages/stages.module';
import { AliasModule } from './system-configuration/tenants-administration/crm-administration/alias/alias.module';
import { AttachmentCategoryModule } from './system-configuration/tenants-administration/crm-administration/contacts/attachment-category/attachment-category.module';
import { AttachmentSubCategoryModule } from './system-configuration/tenants-administration/crm-administration/contacts/attachment-subcategory/attachment-subcategory.module';
import { ContactsNoteCategoryModule } from './system-configuration/tenants-administration/crm-administration/contacts/note-category/note_category.module';
import { ContactsNoteSubCategoryModule } from './system-configuration/tenants-administration/crm-administration/contacts/note-subcategory/note_subcategory.module';
import { ContactsRoleModule } from './system-configuration/tenants-administration/crm-administration/contacts/role/contacts-role.module';
import { LocationsAttachmentCategoryModule } from './system-configuration/tenants-administration/crm-administration/locations/attachment-category/attachment-category.module';
import { LocationsAttachmentSubCategoryModule } from './system-configuration/tenants-administration/crm-administration/locations/attachment-subcategory/attachment-subcategory.module';
import { LocationsNoteCategoryModule } from './system-configuration/tenants-administration/crm-administration/locations/note-category/note_category.module';
import { LocationNoteSubCategoryModule } from './system-configuration/tenants-administration/crm-administration/locations/note-subcategory/note_subcategory.module';
import { RoomSizesModule } from './system-configuration/tenants-administration/crm-administration/locations/room-sizes/roomsizes.module';
import { TerritoriesModule } from './system-configuration/tenants-administration/geo-administration/territories/territories.module';
import { AuditFieldsModule } from './system-configuration/tenants-administration/operations-administration/audit-fields/audit-fields.module';
import { BookingRulesModule } from './system-configuration/tenants-administration/operations-administration/booking-drives/booking-rules/booking-rules.module';
import { DailyCapacityModule } from './system-configuration/tenants-administration/operations-administration/booking-drives/daily-capacity/daily-capacity.module';
import { DailyHourModule } from './system-configuration/tenants-administration/operations-administration/booking-drives/daily-hour/daily-hour.module';
import { OperationStatusModule } from './system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/operation-status.module';
import { TaskManagementModule } from './system-configuration/tenants-administration/operations-administration/booking-drives/task-management/task-management.module';
import { BannerModule } from './system-configuration/tenants-administration/operations-administration/calendar/banners/banner.module';
import { CloseDateModule } from './system-configuration/tenants-administration/operations-administration/calendar/close-dates/close-date.module';
import { GoalVarianceModule } from './system-configuration/tenants-administration/operations-administration/calendar/goal-variance/goal-variance.module';
import { LockDateModule } from './system-configuration/tenants-administration/operations-administration/calendar/lock-dates/lock-date.module';
import { EquipmentModule } from './system-configuration/tenants-administration/operations-administration/manage-equipment/equipment/equipment.module';
import { ApprovalsModule } from './system-configuration/tenants-administration/operations-administration/marketing-equipment/approvals/approvals.module';
import { MarketingMaterialModule } from './system-configuration/tenants-administration/operations-administration/marketing-equipment/marketing-material/marketing-material.module';
import { PromotionalItemModule } from './system-configuration/tenants-administration/operations-administration/marketing-equipment/promotional-items/promotional-item.module';
import { PromotionsModule } from './system-configuration/tenants-administration/operations-administration/marketing-equipment/promotions/promotions.module';
import { NceCategoryModule } from './system-configuration/tenants-administration/operations-administration/non-collection-events/nce-category/nce-category.module';
import { NceSubCategoryModule } from './system-configuration/tenants-administration/operations-administration/non-collection-events/nce-subcategory/nce-subcategory.module';
import { NoteCategoryModule as NoteAttachmentNoteCategoryModule } from './system-configuration/tenants-administration/operations-administration/notes-attachment/note-category/note-category.module';
import { NoteSubCategoryModule as NoteAttachmentNoteSubCategoryModule } from './system-configuration/tenants-administration/operations-administration/notes-attachment/note-subcategory/note-subcategory.module';
import { AdsModule } from './system-configuration/tenants-administration/organizational-administration/content-management-system/ads/ads.module';
import { DailyGoalsAllocationModule } from './system-configuration/tenants-administration/organizational-administration/goals/daily-goals-allocation/daily-goals-allocation.module';
import { DailyGoalsCalenderModule } from './system-configuration/tenants-administration/organizational-administration/goals/daily-goals-calender/daily-goals-calender.module';
import { MonthlyGoalsModule } from './system-configuration/tenants-administration/organizational-administration/goals/monthly-goals/monthly-goals.module';
import { PerformanceRulesModule } from './system-configuration/tenants-administration/organizational-administration/goals/performance-rules/performance-rules.module';
import { BusinessUnitModule } from './system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/business-units.module';
import { OrganizationalLevelModule } from './system-configuration/tenants-administration/organizational-administration/hierarchy/organizational-levels/organizational-levels.module';
import { ProcedureTypesModule } from './system-configuration/tenants-administration/organizational-administration/products-procedures/procedure-types/procedure-types.module';
import { ProcedureModule } from './system-configuration/tenants-administration/organizational-administration/products-procedures/procedures/procedure.module';
import { ProductsModule } from './system-configuration/tenants-administration/organizational-administration/products-procedures/products/products.module';
import { DeviceTypeModule } from './system-configuration/tenants-administration/organizational-administration/resources/device-type/device-type.module';
import { DeviceModule } from './system-configuration/tenants-administration/organizational-administration/resources/device/device.module';
import { FacilityModule } from './system-configuration/tenants-administration/organizational-administration/resources/facilities/facility.module';
import { VehicleTypeModule } from './system-configuration/tenants-administration/organizational-administration/resources/vehicle-type/vehicle-type.module';
import { VehicleModule } from './system-configuration/tenants-administration/organizational-administration/resources/vehicles/vehicle.module';
import { CertificationModule } from './system-configuration/tenants-administration/staffing-administration/certification/certification.module';
import { ClassificationSettingModule } from './system-configuration/tenants-administration/staffing-administration/classification-settings/setting.module';
import { ClassificationModule } from './system-configuration/tenants-administration/staffing-administration/classifications/classification.module';
import { StaffSetupModule } from './system-configuration/tenants-administration/staffing-administration/staff-setups/staffSetup.module';
import { StaffingStaffModule } from './system-configuration/tenants-administration/staffing-administration/staff/staffing-staff.module';
import { TeamHistory } from './system-configuration/tenants-administration/staffing-administration/teams/entity/teamHistory';
import { TeamModule } from './system-configuration/tenants-administration/staffing-administration/teams/team.module';
import { UserModule } from './system-configuration/tenants-administration/user-administration/user/user.module';
import { TasksModule } from './tasks/tasks.module';
import { CrmLocationsModule } from './crm/locations/locations.module';
import { LeavesTypesModule } from './system-configuration/staffing-administration/leave-type/leaves-types.module';
import { DonorsModule } from './crm/contacts/donor/donors.module';
import { FilterModule } from './crm/Filters/crm-filter-modules';
import { DrivesModule } from './operations-center/operations/drives/drives.module';
import { SessionsModule } from './operations-center/operations/sessions/sessions.module';
import { CustomFieldsModule } from './system-configuration/tenants-administration/organizational-administration/custom-fields/custom-fields.module';
import { AccountsDuplicatesModule } from './crm/accounts/accountDuplicates/account-duplicates.module';
import { CrmLocationsDuplicatesModule } from './crm/locations/locationDuplicates/location-duplicates.module';
import { NCPBluePrintsModule } from './crm/crm-non-collection-profiles/blueprints/ncp-blueprints.module';
import { ContactPreferencesModule } from './crm/contacts/common/contact-preferences/contact-preferences.module';
import { ManageFavoritesModule } from './operations-center/manage-favorites/manage-favourites.module';
import { OcNonCollectionEventsModule } from './operations-center/operations/non-collection-events/oc-non-collection-events.module';
import { NCEModule } from './operations-center/operations/non-collection-events/nce.module';
import { SponsorModule } from './sponsor-group/sponsor.group.module';
import { DonorDonationsModule } from './crm/contacts/donor/donorDonationHistory/donor-donation.module';
import { DonorCenterCodesModule } from './crm/contacts/donor/donor-center-codes/donor-center-codes.module';
import { DonorGroupCodesModule } from './crm/contacts/donor/donor-group-codes/donor-group-codes.module';
import { DonorsAssertionCodesModule } from './crm/contacts/donor/donors-assertion-codes/donors-assetion-codes-module';
import { AssertionCodesModule } from './crm/contacts/donor/assertion-codes/assetion-codes-module';
import { StaffScheduleModule } from './crm/contacts/staff/staffSchedule/staff-schedule.module';
import { UserEmailTemplateModule } from './system-configuration/tenants-administration/organizational-administration/content-management-system/email-template/user-email-template.module';
import { OcNonCollectionEventsChangeAuditModule } from './operations-center/operations/non-collection-events/oc-non-collection-events-change-audit.module';
import { CalendersModule } from './operations-center/calender/calender.module';
import { DonorCenterBlueprintsModule } from './system-configuration/tenants-administration/organizational-administration/resources/facilities/donor-center-blueprints/donor-center-blueprints.module';
import { StaffingModule } from './operations-center/operations/drives/staffing/staffing.module';
import { ProspectsModule } from './operations-center/prospects/prospects.module';
import { SeedersModule } from './common/seeders/seeders.module';
import { ResourceSharingModule } from './operations-center/resource-sharing/resource-sharing.module';
import { BuildSchedulesModule } from './staffing-management/build-schedules/build-schedules.module';
import { BBCSDataSyncsModule } from './bbcs_data_syncs/bbcs_data_syncs.module';
import { ContactList } from './common/dailyService-webhooks/contact-type.module';
import { StaffingManagementModule } from './staffing-management/staffing-management.module';

@Module({
  imports: [
    QualificationModule,
    NotesAttachmentSubCategoryModule,
    NotesAttachmentCategoryModule,
    UserModule,
    AuthModule,
    EmailTemplateModule,
    TemplatesModule,
    DonorAuthModule,
    MenuItemsModule,
    TenantModule,
    ApplicationModule,
    ContactsNoteCategoryModule,
    DeviceTypeModule,
    ProcedureTypesModule,
    ProductsModule,
    ProcedureModule,
    VehicleTypeModule,
    VehicleModule,
    OrganizationalLevelModule,
    RolePermissionsModule,
    FacilityModule,
    DeviceModule,
    BusinessUnitModule,
    DailyGoalsAllocationModule,
    MonthlyGoalsModule,
    AccountNoteCategoryModule,
    ContactsNoteCategoryModule,
    RoomSizesModule,
    TerritoriesModule,
    AffiliationModule,
    LogsEventModule,
    PerformanceRulesModule,
    BookingRulesModule,
    EquipmentModule,
    AdsModule,
    ContactsRoleModule,
    AttachmentCategoryModule,
    AttachmentSubCategoryModule,
    LogsEventModule,
    IndustryCategoriesModule,
    DailyGoalsCalenderModule,
    LogsEventModule,
    BannerModule,
    AuditFieldsModule,
    TaskManagementModule,
    StagesModule,
    LeavesTypesModule,
    ClassificationModule,
    LocationNoteSubCategoryModule,
    ContactsNoteSubCategoryModule,
    AuditFieldsModule,
    OperationStatusModule,
    TeamModule,
    ContactsNoteSubCategoryModule,
    TeamHistory,
    LocationsNoteCategoryModule,
    LockDateModule,
    ClassificationModule,
    CertificationModule,
    AliasModule,
    AccountNoteSubCategoryModule,
    SourcesModule,
    ClassificationSettingModule,
    MarketingMaterialModule,
    NoteAttachmentNoteCategoryModule,
    NoteAttachmentNoteSubCategoryModule,
    GoalVarianceModule,
    PromotionsModule,
    NceCategoryModule,
    NceSubCategoryModule,
    CloseDateModule,
    AccountsAttachmentCategoryModule,
    PromotionalItemModule,
    StaffSetupModule,
    AccountsAttachmentSubCategoryModule,
    StaffLeaveModule,
    DailyCapacityModule,
    DirectionsModule,
    AccountsModule,
    LocationsAttachmentCategoryModule,
    LocationsAttachmentSubCategoryModule,
    ApprovalsModule,
    DailyHourModule,
    CRMVolunteerModule,
    TasksModule,
    NotesModule,
    PrefixesModule,
    SuffixesModule,
    DonorsModule,
    AttachmentModule,
    NonCollectionProfileModule,
    FilterModule,
    CrmLocationsModule,
    DrivesModule,
    SessionsModule,
    LeavesTypesModule,
    StaffModule,
    StaffingStaffModule,
    CustomFieldsModule,
    AccountsDuplicatesModule,
    AccountsDuplicatesModule,
    CrmLocationsDuplicatesModule,
    NCPBluePrintsModule,
    ContactPreferencesModule,
    DonorGroupCodesModule,
    DonorCenterCodesModule,
    ManageFavoritesModule,
    OcNonCollectionEventsModule,
    NCEModule,
    SponsorModule,
    DonorDonationsModule,
    DonorsAssertionCodesModule,
    AssertionCodesModule,
    StaffScheduleModule,
    UserEmailTemplateModule,
    OcNonCollectionEventsChangeAuditModule,
    CalendersModule,
    DonorCenterBlueprintsModule,
    StaffingModule,
    ProspectsModule,
    SeedersModule,
    ResourceSharingModule,
    BuildSchedulesModule,
    StaffingManagementModule,
    BBCSDataSyncsModule,
    ContactList,
  ],
})
export class ApiModule {}
