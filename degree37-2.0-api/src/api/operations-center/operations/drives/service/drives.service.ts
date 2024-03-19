import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Not, Repository } from 'typeorm';
import { DrivesHistory } from '../entities/drives-history.entity';
import { HistoryService } from 'src/api/common/services/history.service';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import {
  CreateDriveDto,
  DriveContact,
  DriveEquipment,
  DriveMarketingInputDto,
  SupplementalRecruitmentDto,
  UpdateDriveDto,
} from '../dto/create-drive.dto';
import { Accounts } from 'src/api/crm/accounts/entities/accounts.entity';
import { PromotionEntity } from 'src/api/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotions/entity/promotions.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { Drives } from '../entities/drives.entity';
import { CrmLocations } from 'src/api/crm/locations/entities/crm-locations.entity';
import { AccountContacts } from 'src/api/crm/accounts/entities/accounts-contacts.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { DrivesContacts } from '../entities/drive-contacts.entity';
import { QueryRunner } from 'typeorm/browser';
import { ShiftSlotsDto, ShiftsDto } from 'src/api/shifts/dto/shifts.dto';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { shiftable_type_enum } from 'src/api/shifts/enum/shifts.enum';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { ShiftsService } from 'src/api/shifts/services/shifts.service';
import { DrivesEquipments } from '../entities/drives-equipment.entity';
import { DrivesCertifications } from '../entities/drives-certifications.entity';
import { DrivesMarketingMaterialItems } from '../entities/drives-marketing-material-items.entity';
import { DrivesPromotionalItems } from '../entities/drives_promotional_items.entity';
import { GetAllDrivesFilterInterface } from '../interface/get-drives-filter.interface';
import { OrderByConstants } from 'src/api/system-configuration/constants/order-by.constants';
import { PolymorphicType } from 'src/api/common/enums/polymorphic-type.enum';
import { ContactTypeEnum } from 'src/api/crm/contacts/common/enums';
import { CustomFields } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-field.entity';
import { CustomFieldsData } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-filed-data.entity';
import { DrivesZipCodes } from '../entities/drives-zipcodes.entity';
import { DrivesDonorCommunicationSupplementalAccounts } from '../entities/drives-donor-comms-supp-accounts.entity';
import { Vehicle } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/vehicles/entities/vehicle.entity';
import { VehicleType } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/vehicle-type/entities/vehicle-type.entity';
import { ShiftsSlots } from 'src/api/shifts/entities/shifts-slots.entity';
import {
  AddShiftSlotDTO,
  UpdateShiftsProjectionStaff,
} from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/facilities/donor-center-blueprints/dto/create-blueprint.dto';
import { DriveContactsService } from './drive-contacts.service';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { ShiftsProjectionsStaff } from 'src/api/shifts/entities/shifts-projections-staff.entity';
import { BookingRules } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/booking-rules/entities/booking-rules.entity';
import { ListChangeAuditDto } from '../dto/change-audit.dto';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { ShiftsVehicles } from 'src/api/shifts/entities/shifts-vehicles.entity';
import { ShiftsStaffSetups } from 'src/api/shifts/entities/shifts-staffsetups.entity';
import { updateCustomFieldDataDto } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/dto/update-custom-field.dto';
import { CustomFieldsDataHistory } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-filed-data-history';
import { CreateCustomFieldDataDto } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/dto/create-custom-field.dto';
import { HistoryReason } from 'src/common/enums/history_reason.enum';
import { DonorsAppointments } from 'src/api/crm/contacts/donor/entities/donors-appointments.entity';
import { DrivesContactsHistory } from '../entities/drive-contacts-history.entity';
import { DrivesEquipmentHistory } from '../entities/drives-equipment-history.entity';
import { DrivesCertificationsHistory } from '../entities/drives-certifications-history.entity';
import { DrivesMarketingMaterialItemsHistory } from '../entities/drives-marketing-material-items-history.entity';
import { DrivesDonorCommunicationSupplementalAccountsHistory } from '../entities/drives-donor-comms-supp-accounts-history.entity';
import { DrivesZipCodesHistory } from '../entities/drives-zipcodes-history.entity';
import { Modified } from 'src/common/interface/modified';
import { DriveEquipmentsService } from './drive-equipments.service';
import { DriveCertificationsService } from './drive-certifications.service';
import { PickupService } from './pickups.service';

@Injectable()
export class DrivesService extends HistoryService<DrivesHistory> {
  constructor(
    @Inject(REQUEST)
    private readonly request: UserRequest,

    @InjectRepository(DrivesDonorCommunicationSupplementalAccounts)
    private readonly drivesDonorCommunicationSupplementalAccountsRepo: Repository<DrivesDonorCommunicationSupplementalAccounts>,
    @InjectRepository(DrivesZipCodes)
    private readonly drivesZipCodesRepo: Repository<DrivesZipCodes>,
    @InjectRepository(DrivesZipCodesHistory)
    private readonly drivesZipCodesHistoryRepo: Repository<DrivesZipCodesHistory>,
    @InjectRepository(DrivesPromotionalItems)
    private readonly drivesPromotionalItemsRepo: Repository<DrivesPromotionalItems>,
    @InjectRepository(DrivesMarketingMaterialItems)
    private readonly drivesMarketingMaterialItemsRepo: Repository<DrivesMarketingMaterialItems>,
    @InjectRepository(DrivesCertifications)
    private readonly drivesCertificationsRepo: Repository<DrivesCertifications>,
    @InjectRepository(DrivesEquipments)
    private readonly drivesEquipmentsRepo: Repository<DrivesEquipments>,
    @InjectRepository(CustomFieldsDataHistory)
    private readonly customFieldsDataHistoryRepo: Repository<CustomFieldsDataHistory>,
    @InjectRepository(ShiftsStaffSetups)
    private readonly shiftsStaffSetupsRepo: Repository<ShiftsStaffSetups>,
    @InjectRepository(ShiftsProjectionsStaff)
    private readonly shiftsProjectionsStaffRepo: Repository<ShiftsProjectionsStaff>,
    @InjectRepository(ShiftsVehicles)
    private readonly shiftsVehiclesRepo: Repository<ShiftsVehicles>,
    @InjectRepository(VehicleType)
    private readonly VehicleTypeRepo: Repository<VehicleType>,
    @InjectRepository(Vehicle)
    private readonly VehicleRepo: Repository<Vehicle>,
    @InjectRepository(DriveContact)
    private readonly DriveContactRepo: Repository<DriveContact>,
    @InjectRepository(CustomFieldsData)
    private readonly customFieldsDataRepo: Repository<CustomFieldsData>,
    @InjectRepository(CustomFields)
    private readonly customFieldsRepository: Repository<CustomFields>,
    @InjectRepository(Drives)
    private readonly drivesRepository: Repository<Drives>,
    @InjectRepository(DrivesHistory)
    private readonly drivesHistoryRepository: Repository<DrivesHistory>,
    @InjectRepository(Accounts)
    private readonly accountsRespository: Repository<Accounts>,
    @InjectRepository(CrmLocations)
    private readonly crmLocationsRespository: Repository<CrmLocations>,
    @InjectRepository(PromotionEntity)
    private readonly promotionsRespository: Repository<PromotionEntity>,
    @InjectRepository(User)
    private readonly usersRespository: Repository<User>,
    @InjectRepository(OperationsStatus)
    private readonly operationStatusRespository: Repository<OperationsStatus>,
    @InjectRepository(AccountContacts)
    private readonly accountContactsRespository: Repository<AccountContacts>,
    @InjectRepository(ContactsRoles)
    private readonly contactRolesRespository: Repository<ContactsRoles>,
    @InjectRepository(BookingRules)
    private readonly bookingRulesRepository: Repository<BookingRules>,
    @InjectRepository(Tenant)
    private readonly tenantRespository: Repository<Tenant>,
    @InjectRepository(ShiftsSlots)
    private readonly shiftsSlotRepo: Repository<ShiftsSlots>,
    @InjectRepository(Shifts)
    private readonly shiftsRepo: Repository<Shifts>,
    @InjectRepository(ShiftsProjectionsStaff)
    private readonly shiftsprojectionStaffRepo: Repository<ShiftsProjectionsStaff>,
    @InjectRepository(DonorsAppointments)
    private readonly entityDonorsAppointmentsRepository: Repository<DonorsAppointments>,
    private readonly shiftsService: ShiftsService,
    private readonly entityManager: EntityManager,
    private readonly drivesContactService: DriveContactsService,
    private readonly driveCertificationsService: DriveCertificationsService,
    private readonly driveEquipmentsService: DriveEquipmentsService,
    private readonly drivePickupService: PickupService
  ) {
    super(drivesHistoryRepository);
  }

  /**
   * check entity exist in database
   * @param repository
   * @param query
   * @param entityName
   * @returns {object}
   */
  async entityExist<T>(
    repository: Repository<T>,
    query,
    entityName
  ): Promise<T> {
    const entityObj = await repository.findOne(query);
    if (!entityObj) {
      throw new HttpException(`${entityName} not found.`, HttpStatus.NOT_FOUND);
    }

    return entityObj;
  }

  /**
   * Calculate limit and skip
   * @param limit
   * @param page
   * @returns {skip, take}
   */
  pagination(limit: number, page: number) {
    page = page <= 0 ? 1 : page;
    const take: any = limit;
    const skip: any = (page - 1) * limit;

    return { skip, take };
  }

  async saveBasicDriveInfo(
    queryRunner: QueryRunner,
    createDriveDto: CreateDriveDto,
    is_blueprint = false
  ) {
    const account = await this.entityExist(
      this.accountsRespository,
      { where: { id: createDriveDto.account_id } },
      'Account'
    );

    const existingDrive = await this.drivesRepository.find({
      where: {
        account_id: createDriveDto.account_id,
        date: createDriveDto.date,
      },
    });

    if (existingDrive.length) {
      throw new HttpException(
        `Drive already exist for ${account.name} on ${createDriveDto.date}.`,
        HttpStatus.BAD_REQUEST
      );
    }

    const location = await this.entityExist(
      this.crmLocationsRespository,
      { where: { id: createDriveDto.location_id } },
      'CRM Location'
    );
    const promotion = await this.entityExist(
      this.promotionsRespository,
      { where: { id: createDriveDto.promotion_id } },
      'Promotion'
    );
    const recruiter = await this.entityExist(
      this.usersRespository,
      { where: { id: createDriveDto.recruiter_id } },
      'Promotion'
    );
    const operation_status = await this.entityExist(
      this.operationStatusRespository,
      { where: { id: createDriveDto.operations_status_id } },
      'Operation Status'
    );

    const drive = new Drives();
    drive.account = account;
    drive.location = location;
    drive.promotion = promotion;
    drive.recuriter = recruiter;
    drive.operation_status = operation_status;
    drive.is_multi_day_drive = createDriveDto.is_multi_day_drive;
    drive.date = createDriveDto.date;
    drive.created_by = createDriveDto.created_by;
    drive.tenant_id = createDriveDto.tenant_id;
    drive.is_linkable = createDriveDto.is_linkable;
    drive.is_linked = createDriveDto.is_linked;
    drive.open_to_public = createDriveDto.open_to_public;
    //  Marketing Data Start

    drive.order_due_date = createDriveDto.marketing.order_due_date;
    drive.marketing_start_date = createDriveDto.marketing.marketing_start_date;
    drive.marketing_end_date = createDriveDto.marketing.marketing_end_date;
    drive.marketing_start_time = createDriveDto.marketing.marketing_start_time;
    drive.marketing_end_time = createDriveDto.marketing.marketing_end_time;
    drive.online_scheduling_allowed = createDriveDto.online_scheduling_allowed;
    drive.donor_information = createDriveDto.marketing.donor_info;
    drive.instructional_information =
      createDriveDto.marketing.instructional_info;
    drive.is_blueprint = is_blueprint;

    // Marketing Data End

    // ==== Donor Communication Start ====
    drive.tele_recruitment = createDriveDto.tele_recruitment_enabled;
    drive.email = createDriveDto.email_enabled;
    drive.sms = createDriveDto.sms_enabled;
    drive.tele_recruitment_status = createDriveDto.tele_recruitment_status;
    drive.email_status = createDriveDto.email_status;
    drive.sms_status = createDriveDto.sms_status;
    // ==== Donor Communication End ====

    return await queryRunner.manager.save(drive);
  }

  async updateBasicDriveInfo(
    queryRunner: QueryRunner,
    createDriveDto: CreateDriveDto,
    is_blueprint = false,
    getDrive: Drives
  ) {
    const account = await this.entityExist(
      this.accountsRespository,
      { where: { id: createDriveDto.account_id } },
      'Account'
    );

    const existingDrive = await this.drivesRepository.find({
      where: {
        id: getDrive.id,
        account_id: createDriveDto.account_id,
        date: createDriveDto.date,
      },
    });

    if (!existingDrive) {
      const checkValid = await this.drivesRepository.find({
        where: {
          account_id: createDriveDto.account_id,
          date: createDriveDto.date,
        },
      });
      if (!checkValid) {
        throw new HttpException(
          `Drive already exist for ${account.name} on ${createDriveDto.date}.`,
          HttpStatus.BAD_REQUEST
        );
      }
    }

    const location = await this.entityExist(
      this.crmLocationsRespository,
      { where: { id: createDriveDto.location_id } },
      'CRM Location'
    );
    const promotion = await this.entityExist(
      this.promotionsRespository,
      { where: { id: createDriveDto.promotion_id } },
      'Promotion'
    );
    const recruiter = await this.entityExist(
      this.usersRespository,
      { where: { id: createDriveDto.recruiter_id } },
      'Promotion'
    );
    const operation_status = await this.entityExist(
      this.operationStatusRespository,
      { where: { id: createDriveDto.operations_status_id } },
      'Operation Status'
    );

    const drive = new Drives();
    // drive.id = getDrive.id;
    drive.account = account;
    drive.location = location;
    drive.promotion = promotion;
    drive.recuriter = recruiter;
    drive.operation_status = operation_status;
    drive.is_multi_day_drive = createDriveDto.is_multi_day_drive;
    drive.date = createDriveDto.date;
    drive.created_by = createDriveDto.created_by;
    drive.tenant_id = createDriveDto.tenant_id;
    drive.is_linkable = createDriveDto.is_linkable;
    drive.is_linked = createDriveDto.is_linked;
    drive.open_to_public = createDriveDto.open_to_public;
    //  Marketing Data Start

    drive.order_due_date = createDriveDto.marketing.order_due_date;
    drive.marketing_start_date = createDriveDto.marketing.marketing_start_date;
    drive.marketing_end_date = createDriveDto.marketing.marketing_end_date;
    drive.marketing_start_time = createDriveDto.marketing.marketing_start_time;
    drive.marketing_end_time = createDriveDto.marketing.marketing_end_time;
    drive.online_scheduling_allowed = createDriveDto.online_scheduling_allowed;
    drive.donor_information = createDriveDto.marketing.donor_info;
    drive.instructional_information =
      createDriveDto.marketing.instructional_info;
    drive.is_blueprint = is_blueprint;

    // Marketing Data End

    // ==== Donor Communication Start ====
    drive.tele_recruitment = createDriveDto.tele_recruitment_enabled;
    drive.email = createDriveDto.email_enabled;
    drive.sms = createDriveDto.sms_enabled;
    drive.tele_recruitment_status = createDriveDto.tele_recruitment_status;
    drive.email_status = createDriveDto.email_status;
    drive.sms_status = createDriveDto.sms_status;
    // ==== Donor Communication End ====

    return await queryRunner.manager.update(Drives, { id: getDrive.id }, drive);
  }

  async saveCustomFields(
    queryRunner: QueryRunner,
    data: Drives,
    created_by: User,
    tenant_id: Tenant,
    createCustomFieldDrivesDataDto: CreateDriveDto
  ) {
    const { fields_data, custom_field_datable_type } =
      createCustomFieldDrivesDataDto.custom_fields;

    if (!custom_field_datable_type) {
      throw new HttpException(
        `custom_field_datable_type is required.`,
        HttpStatus.BAD_REQUEST
      );
    }

    if (fields_data?.length) {
      for (const item of fields_data) {
        const customField = await this.customFieldsRepository.findOne({
          where: { id: item?.field_id, is_archived: false },
        });
        if (!customField) {
          throw new HttpException(
            `Field not found for ID ${item?.field_id}.`,
            HttpStatus.BAD_REQUEST
          );
        }

        if (customField?.is_required && !item?.field_data) {
          throw new HttpException(
            `Field data must be required for field id ${customField?.id}.`,
            HttpStatus.BAD_REQUEST
          );
        }
        const customFieldData = new CustomFieldsData();
        customFieldData.custom_field_datable_id = data.id;
        customFieldData.custom_field_datable_type = custom_field_datable_type;
        customFieldData.field_id = customField;
        customFieldData.tenant_id = tenant_id;
        customFieldData.created_by = created_by;
        customFieldData.field_data = item?.field_data;
        await queryRunner.manager.save(customFieldData);
      }
    }
  }

  // async EditCustomFields(
  //   queryRunner: QueryRunner,
  //   data: Drives,
  //   created_by: User,
  //   tenant_id: Tenant,
  //   createCustomFieldDrivesDataDto: CreateDriveDto,
  //   getDrive: Drives
  // ) {
  //   try {
  //     const { fields_data, custom_field_datable_type } =
  //       createCustomFieldDrivesDataDto.custom_fields;

  //     if (!custom_field_datable_type) {
  //       throw new HttpException(
  //         `custom_field_datable_type is required.`,
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }

  //     const responseData = [];

  //     if (fields_data?.length) {
  //       for (const item of fields_data) {
  //         const customField = await this.customFieldsRepository.findOne({
  //           where: { id: item?.field_id, is_archived: false },
  //         });
  //         if (!customField) {
  //           throw new HttpException(
  //             `Field not found for ID ${item?.field_id}.`,
  //             HttpStatus.BAD_REQUEST
  //           );
  //         }

  //         if (customField?.is_required && !item?.field_data) {
  //           throw new HttpException(
  //             `Field data must be required for field id ${customField?.id}.`,
  //             HttpStatus.BAD_REQUEST
  //           );
  //         }
  //         const customFieldData = new CustomFieldsData();
  //         customFieldData.custom_field_datable_id = data.id;
  //         customFieldData.custom_field_datable_type = custom_field_datable_type;
  //         customFieldData.field_id = customField;
  //         customFieldData.tenant_id = tenant_id;
  //         customFieldData.created_by = created_by;
  //         customFieldData.created_by = created_by;
  //         // customFieldData.tenant_id = created_by?.user?.tenant;
  //         customFieldData.field_data = item?.field_data;
  //         responseData.push(await queryRunner.manager.save(customFieldData));
  //       }
  //     }
  //   } catch (error) {
  //     return resError(error.message, ErrorConstants.Error, error.status);
  //   }
  // }

  async updateCustomFieldData(CreateCustomFieldDataDto: any, getDrive: Drives) {
    try {
      const { fields_data, custom_field_datable_type } =
        CreateCustomFieldDataDto;
      let { custom_field_datable_id } = CreateCustomFieldDataDto;
      custom_field_datable_id = getDrive.id;
      if (!custom_field_datable_id) {
        throw new HttpException(
          `custom_field_datable_id is required.`,
          HttpStatus.BAD_REQUEST
        );
      }
      if (!custom_field_datable_type) {
        throw new HttpException(
          `custom_field_datable_id is required.`,
          HttpStatus.BAD_REQUEST
        );
      }
      const responseData = [];
      if (fields_data?.length) {
        for (const item of fields_data) {
          const customField = await this.customFieldsRepository.findOne({
            where: { id: item?.field_id, is_archived: false },
          });
          if (!customField) {
            throw new HttpException(`Field not found.`, HttpStatus.BAD_REQUEST);
          }
          // If 'id' is absent, it's a new option; if 'id' is present, update the existing one
          if (!item.id) {
            const customFieldData = new CustomFieldsData();
            customFieldData.custom_field_datable_id = custom_field_datable_id;
            customFieldData.custom_field_datable_type =
              custom_field_datable_type;
            customFieldData.field_id = customField;
            customFieldData.tenant_id = this.request.user?.tenant;
            customFieldData.created_by = this.request?.user;
            customFieldData.tenant_id = this.request?.user?.tenant;
            customFieldData.field_data = item?.field_data;
            responseData.push(
              await this.customFieldsDataRepo.save(customFieldData)
            );
          } else {
            const existingcustomFieldData =
              await this.customFieldsDataRepo.findOne({
                where: { id: item?.id },
                relations: ['field_id', 'tenant_id'],
              });
            console.log({ existingcustomFieldData });
            if (!existingcustomFieldData) {
              throw new HttpException(
                `Custom field data not found for id ${item?.id}.`,
                HttpStatus.BAD_REQUEST
              );
            }
            if (customField?.is_required && !item?.field_data) {
              throw new HttpException(
                `Field data must be required for id ${customField?.id}.`,
                HttpStatus.BAD_REQUEST
              );
            }
            const customFieldDataHistory = new CustomFieldsDataHistory();
            customFieldDataHistory.history_reason = 'C';
            customFieldDataHistory.id = existingcustomFieldData?.id;
            customFieldDataHistory.custom_field_datable_id =
              existingcustomFieldData?.custom_field_datable_id;
            customFieldDataHistory.custom_field_datable_type =
              existingcustomFieldData?.custom_field_datable_type;
            customFieldDataHistory.field_id =
              existingcustomFieldData?.field_id?.id;
            customFieldDataHistory.tenant_id =
              existingcustomFieldData?.tenant_id?.id;
            customFieldDataHistory.created_by = this.request.user?.id;
            customFieldDataHistory.is_archived =
              existingcustomFieldData.is_archived;
            customFieldDataHistory.field_data =
              existingcustomFieldData.field_data;
            customFieldDataHistory.tenant_id =
              existingcustomFieldData.tenant_id?.id;
            await this.customFieldsDataHistoryRepo.save(customFieldDataHistory);
            existingcustomFieldData.created_by = this.request?.user;
            existingcustomFieldData.field_data = item?.field_data;
            responseData.push(
              await this.customFieldsDataRepo.save(existingcustomFieldData)
            );
          }
        }
      }
      // Identify deleted options and set them to inactive
      const existingOptions = await this.customFieldsDataRepo.find({
        where: {
          custom_field_datable_id: custom_field_datable_id,
          custom_field_datable_type: custom_field_datable_type,
        },
      });
      const updatedIds = fields_data.map((item) => BigInt(item.id));
      const deletedOptions = existingOptions.filter((data) => {
        return !updatedIds.includes(BigInt(data.id));
      });
      for (const item of deletedOptions) {
        const optionToUpdate = { ...item };
        optionToUpdate.is_active = false;
        await this.customFieldsDataRepo.save(optionToUpdate);
      }
      return resSuccess(
        'Custom Field Data updated.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.NO_CONTENT,
        null
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async saveDriveContacts(
    queryRunner: QueryRunner,
    contacts: Array<DriveContact>,
    account_id: bigint,
    drive: Drives,
    created_by: User
  ) {
    const accountContactIds = contacts?.map(
      (item) => item.accounts_contacts_id
    );

    const accountContacts = await this.accountContactsRespository.find({
      where: {
        id: In(accountContactIds),
      },
    });

    for (let i = 0; i < contacts.length; i++) {
      const inputContactItem = contacts[i];
      const contactItem = accountContacts[i];
      const driveContact = new DrivesContacts();
      driveContact.drive = drive;
      driveContact.accounts_contacts_id = inputContactItem.accounts_contacts_id;
      driveContact.created_by = created_by;
      driveContact.role_id = inputContactItem.role_id;
      await queryRunner.manager.save(driveContact);
    }
  }

  async updateDriveContacts(
    queryRunner: QueryRunner,
    contacts: Array<DriveContact>,
    account_id: bigint,
    drive: Drives,
    created_by: User
  ) {
    const accountContactIds = contacts?.map(
      (item) => item.accounts_contacts_id
    );

    const accountContacts = await this.accountContactsRespository.find({
      where: {
        id: In(accountContactIds),
      },
    });
    // console.log({ drive });
    for (let i = 0; i < contacts.length; i++) {
      const inputContactItem = contacts[i];
      const contactItem = accountContacts[i];
      const driveContact = new DrivesContacts();
      driveContact.drive_id = drive.id;
      driveContact.accounts_contacts = contactItem;
      driveContact.created_by = created_by;
      driveContact.role_id = inputContactItem.role_id;
      // await queryRunner.manager.save(driveContact);
      await queryRunner.manager.update(
        DrivesContacts,
        { drive_id: drive.id },
        driveContact
      );
    }
  }

  async create(createDriveDto: CreateDriveDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      // console.log('Start Creating the Drive');
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const drive = await this.saveBasicDriveInfo(queryRunner, createDriveDto);
      // console.log('Saved the basic info drive ID is ', drive.id);
      await this.saveDriveContacts(
        queryRunner,
        createDriveDto.contacts,
        createDriveDto.account_id,
        drive,
        createDriveDto.created_by
      );
      // console.log('Saved the drive contacts');
      await this.saveCustomFields(
        queryRunner,
        drive,
        createDriveDto.created_by,
        createDriveDto.tenant_id,
        createDriveDto
      );
      // console.log('Saved the drive Custom fields');

      await this.shiftsService.createShiftByShiftAble(
        createDriveDto,
        queryRunner,
        createDriveDto.shifts,
        drive,
        createDriveDto.created_by,
        createDriveDto.tenant_id,
        shiftable_type_enum.DRIVES,
        true,
        true
      );
      // console.log('Saved the drive shifts');

      await this.saveEquipments(
        queryRunner,
        createDriveDto.equipment,
        drive,
        createDriveDto.created_by
      );
      // console.log('Saved the drive equipments');

      await this.saveCertifications(
        queryRunner,
        createDriveDto.certifications,
        drive,
        createDriveDto.created_by
      );
      // console.log('Saved the drive cerificationst');

      await this.saveMarketingInfo(
        queryRunner,
        createDriveDto.marketing,
        drive,
        createDriveDto.created_by
      );
      // console.log('Saved the drive marketing info');

      await this.saveDonorCommunicationData(
        queryRunner,
        createDriveDto.donor_communication,
        createDriveDto.zip_codes,
        drive,
        createDriveDto.created_by
      );
      // console.log('Saved the drive donor communication info');

      await this.createBlueprint(queryRunner, createDriveDto);
      await queryRunner.commitTransaction();
      return resSuccess('Drive Created.', 'success', HttpStatus.CREATED, drive);
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async update(createDriveDto: UpdateDriveDto, id) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      const getdrive = await this.drivesRepository.findOne({
        where: { id: id },
      });
      if (!getdrive) {
        console.log('no drive found');
      }
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const drive = await this.updateBasicDriveInfo(
        queryRunner,
        createDriveDto,
        false,
        getdrive
      );
      await this.updateCustomFieldData(CreateCustomFieldDataDto, getdrive);

      await this.updateDriveContacts(
        queryRunner,
        createDriveDto.contacts,
        createDriveDto.account_id,
        getdrive,
        createDriveDto.created_by
      );

      await this.shiftsService.editShift(
        queryRunner,
        createDriveDto.shifts,
        createDriveDto.slots,
        getdrive.id,
        shiftable_type_enum.DRIVES,
        HistoryReason.C,
        createDriveDto.created_by,
        createDriveDto.tenant_id
      );

      await this.UpdateEquipments(
        queryRunner,
        createDriveDto.equipment,
        getdrive,
        createDriveDto.created_by
      );

      await this.updateCertifications(
        queryRunner,
        createDriveDto.certifications,
        getdrive,
        createDriveDto.created_by
      );
      await this.updateMarketingInfo(
        queryRunner,
        createDriveDto.marketing,
        getdrive,
        createDriveDto.created_by
      );

      await this.UpdateDonorCommunicationData(
        queryRunner,
        createDriveDto.donor_communication,
        createDriveDto.zip_codes,
        getdrive,
        createDriveDto.created_by
      );

      await this.createHistory({
        ...getdrive,
        history_reason: HistoryReason.C,
        created_by: createDriveDto.created_by,
        created_at: new Date(),
      });

      await queryRunner.commitTransaction();
      return resSuccess('Drive Created.', 'success', HttpStatus.CREATED, drive);
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async createBlueprint(
    queryRunner: QueryRunner,
    createDriveDto: CreateDriveDto
  ) {
    const blueprint = await this.drivesRepository.findOne({
      where: {
        account_id: createDriveDto.account_id,
        location_id: createDriveDto.location_id,
        is_blueprint: true,
        is_active: true,
        is_archived: false,
      },
    });

    if (!blueprint) {
      const blueprint = await this.saveBasicDriveInfo(
        queryRunner,
        createDriveDto,
        true
      );
      await this.saveDriveContacts(
        queryRunner,
        createDriveDto.contacts,
        createDriveDto.account_id,
        blueprint,
        createDriveDto.created_by
      );
      await this.saveCustomFields(
        queryRunner,
        blueprint,
        createDriveDto.created_by,
        createDriveDto.tenant_id,
        createDriveDto
      );

      await this.shiftsService.createShiftByShiftAble(
        createDriveDto,
        queryRunner,
        createDriveDto.shifts,
        blueprint,
        createDriveDto.created_by,
        createDriveDto.tenant_id,
        shiftable_type_enum.DRIVES,
        true,
        true
      );

      await this.saveEquipments(
        queryRunner,
        createDriveDto.equipment,
        blueprint,
        createDriveDto.created_by
      );

      await this.saveCertifications(
        queryRunner,
        createDriveDto.certifications,
        blueprint,
        createDriveDto.created_by
      );

      await this.saveMarketingInfo(
        queryRunner,
        createDriveDto.marketing,
        blueprint,
        createDriveDto.created_by
      );

      await this.saveDonorCommunicationData(
        queryRunner,
        createDriveDto.donor_communication,
        createDriveDto.zip_codes,
        blueprint,
        createDriveDto.created_by
      );
    }
  }

  async getAll(getDrivesFilterInterface: GetAllDrivesFilterInterface) {
    try {
      const {
        limit = parseInt(process.env.PAGE_SIZE),
        page = 1,
        sortBy,
        childSortBy,
        sortOrder = OrderByConstants.DESC,
        keyword,
        fetch_all,
        is_linkable,
        is_linked,
      } = getDrivesFilterInterface;
      const order = {};
      switch (sortBy) {
        case 'date':
          Object.assign(order, {
            date: sortOrder,
          });
          break;
        case 'crm_locations':
          Object.assign(order, {
            location: sortOrder,
          });

        // case "procedure_type":
        //   Object.assign(order, {
        //     procedure_type: {
        //       [childSortBy]: sortOrder,
        //     },
        //   });
        //   break;
        default:
          Object.assign(order, {
            id: 'DESC',
          });
          break;
      }
      // const where = 'is_archived: false';
      const where = {
        is_archived: false,
      };

      // if (procedureType) {
      //   Object.assign(where, {
      //     procedure_type: {
      //       id: procedureType,
      //     },
      //   });
      // }

      let sortName = '';
      let sortingOrder = sortOrder.toUpperCase() as 'ASC' | 'DESC';
      if (sortBy) {
        if (sortBy == 'account') {
          sortName = 'account.name';
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortBy == 'crm_locations') {
          sortName = 'crm_locations.name';
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortBy == 'date') {
          sortName = 'drives.date';
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortBy == 'hours') {
          sortName = `(SELECT start_time FROM shifts WHERE shifts.shiftable_id = drives.id  AND shifts.shiftable_type = 'drives' LIMIT 1)`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortBy == 'projection') {
          sortName = `(SELECT oef_procedures FROM drives LIMIT 1)`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
      } else {
        sortName = 'drives.id';
        sortingOrder = 'DESC';
      }

      let count: any = 0;
      const skip = page && limit ? (page - 1) * limit : 0;
      const take = page && limit ? limit : undefined;
      const query = this.drivesRepository
        .createQueryBuilder('drives')
        .select(
          `(  SELECT JSON_BUILD_OBJECT(
              'oef_procedures', drives.oef_procedures,
              'oef_products', drives.oef_products,
              'id', drives.id,
              'created_at', drives.created_at,
              'is_archived', drives.is_archived,
              'name', drives.name,
              'oef_products' , drives.oef_products,
              'oef_procedures' , drives.oef_procedures,
              'account_id', drives.account_id,
              'location_id', drives.location_id,
              'is_linkable', drives.is_linkable,
              'is_linked', drives.is_linked,
              'date', drives.date,
              'is_multi_day_drive', drives.is_multi_day_drive,
              'tenant_id', drives.tenant_id,
              'promotion_id', drives.promotion_id,
              'operation_status_id',(SELECT JSON_BUILD_OBJECT(
                'id',operations_status.id,
                'name',operations_status.name,
                'chip_color',operations_status.chip_color
              ) From operations_status WHERE operations_status.id = drives.operation_status_id ), 
              'recruiter_id', drives.recruiter_id,
              'shifts',(
                SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id', shifts.id,
                    'start_time', shifts.start_time,
                    'end_time', shifts.end_time,
                    'vehicles', (
                      SELECT JSON_AGG(
                        JSON_BUILD_OBJECT(
                          'shift_id', shifts_vehicles.shift_id,
                          'vehicle_id', (
                            SELECT JSON_BUILD_OBJECT(
                              'id', vehicle.id,
                              'name', vehicle.name
                            )
                            FROM "vehicle" AS vehicle
                            WHERE vehicle.id = shifts_vehicles.vehicle_id AND vehicle.is_archived = FALSE
                          )
                        )
                      )
                      FROM "shifts_vehicles" AS shifts_vehicles
                      WHERE shifts_vehicles.shift_id = shifts.id AND shifts_vehicles.is_archived = FALSE
                    )
                    )
                )
                FROM "shifts" AS shifts
                WHERE shifts.shiftable_id = drives.id AND shifts.is_archived = FALSE AND shifts.shiftable_type = 'drives'
              ),
              'drive_contacts', (
                SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id', drives_contacts.id,
                    'accounts_contacts_id', drives_contacts.accounts_contacts_id,
                    'drive_id', drives_contacts.drive_id,
                    'role_id', drives_contacts.role_id,
                    'role', (
                      SELECT JSON_BUILD_OBJECT(
                        'id', contacts_roles.id,
                        'name', contacts_roles.name
                      )
                      FROM contacts_roles
                      WHERE contacts_roles.id = drives_contacts.role_id
                      AND contacts_roles.name = 'Primary Chairperson'
                    ),
                    'account_contacts', (
                      SELECT JSON_AGG(
                        JSON_BUILD_OBJECT(
                          'contactable_id', account_contacts.id,
                          'contactable_type', account_contacts.contactable_type,
                          'contactable_data', (
                            SELECT JSON_AGG(
                              JSON_BUILD_OBJECT(
                                'data', contact.data,
                                'is_primary', contact.is_primary,
                                'contact_type', contact.contact_type
                              )
                            )
                            FROM contacts contact
                            WHERE contact.contactable_id = account_contacts.record_id
                            AND contact.contactable_type = 'crm_volunteer'
                            AND (
                              (contact.is_primary = true AND contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND contact.contact_type >= '${ContactTypeEnum.WORK_PHONE}' AND contact.contact_type <= '${ContactTypeEnum.OTHER_PHONE}')
                              OR
                              (contact.is_primary = true AND contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND contact.contact_type >= '${ContactTypeEnum.WORK_EMAIL}' AND contact.contact_type <= '${ContactTypeEnum.OTHER_EMAIL}')
                            )
                          )
                        )
                      )
                      FROM account_contacts AS account_contacts
                      WHERE account_contacts.id = drives_contacts.accounts_contacts_id
                    )
                  )
                )
                FROM drives_contacts
                WHERE drives_contacts.drive_id = drives.id AND drives_contacts.is_archived = FALSE
              )
            )
          FROM drives drive WHERE drive.id = drives.id
          )`,
          'drive'
        )
        .addSelect(
          `(
              SELECT JSON_AGG( JSON_BUILD_OBJECT(
                  'start_time',shifts.start_time,
                  'end_time',shifts.end_time
                )) FROM shifts WHERE shifts.shiftable_id = drives.id AND shifts.shiftable_type = 'drives'
          )`,
          'shifts_hours'
        )
        // .addSelect(
        //   `(
        //         SELECT JSON_AGG( JSON_BUILD_OBJECT(
        //             'oef_procedures', SUM(shifts.oef_procedures),
        //             'oef_products', SUM(shifts.oef_product)
        //           )) FROM shifts WHERE shifts.shiftable_id = drives.id AND shifts.shiftable_type = 'drives'
        //     )`,
        //   'shifts_oef'
        // )
        // .addSelect(
        //   `(
        //         SELECT JSON_AGG( JSON_BUILD_OBJECT(
        //           'id',procedure_types.id,
        //             'name',procedure_types.name
        //         )) FROM procedure_types,shifts WHERE shifts. = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
        //     )`,
        //   'shifts_hours'
        // )
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT(
            'id', account.id,
            'name', account.name,
            'alternate_name', account.alternate_name,
            'phone', account.phone,
            'website', account.website,
            'facebook', account.facebook,
            'industry_category', account.industry_category,
            'industry_subcategory', account.industry_subcategory,
            'stage', account.stage,
            'source', account.source,
            'collection_operation', account.collection_operation,
            'recruiter', account.recruiter,
            'territory', account.territory,
            'population', account.population,
            'is_active', account.is_active,
            'RSMO', account."RSMO",
            'account_contacts', (
              SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', account_contacts_id.id,
                  'contactable_id', account_contacts_id.contactable_id,
                  'contactable_type', account_contacts_id.contactable_type,
                  'is_archived', account_contacts_id.is_archived,
                  'role_id', (SELECT JSON_BUILD_OBJECT(
                    'name',role.name,
                    'id',role.id
                  ) From contacts_roles AS role WHERE role.id = account_contacts_id.role_id ),
                  'record_id', (
                    SELECT JSON_BUILD_OBJECT(
                      'id', record_id.id,
                      'first_name', record_id.first_name,
                      'last_name', record_id.last_name,
                      'contactable_data', (
                        SELECT JSON_AGG(
                          JSON_BUILD_OBJECT(
                            'data', contact.data,
                            'is_primary', contact.is_primary,
                            'contact_type', contact.contact_type
                          )
                        )
                        FROM contacts contact
                        WHERE contact.contactable_id = record_id.id
                        AND contact.contactable_type = 'crm_volunteer'
                        AND (
                          (contact.is_primary = true AND contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND contact.contact_type >= '${ContactTypeEnum.WORK_PHONE}' AND contact.contact_type <= '${ContactTypeEnum.OTHER_PHONE}')
                          OR
                          (contact.is_primary = true AND contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND contact.contact_type >= '${ContactTypeEnum.WORK_EMAIL}' AND contact.contact_type <= '${ContactTypeEnum.OTHER_EMAIL}')
                        )
                      )
                    )
                    FROM crm_volunteer AS record_id
                    WHERE record_id.id = account_contacts_id.record_id
                  )
                )
              )
              FROM account_contacts AS account_contacts_id
              WHERE account_contacts_id.contactable_id = drives.account_id AND account_contacts_id.contactable_type = 'accounts' AND account_contacts_id.is_archived = FALSE
            )
          ) FROM accounts WHERE accounts.id = drives.account_id)`,
          'account'
        )
        .addSelect(
          `(
            SELECT JSON_BUILD_OBJECT(
                'id', crm_locations.id,
                'created_at', crm_locations.created_at,
                'is_archived', crm_locations.is_archived,
                'name', crm_locations.name,
                'cross_street', crm_locations.cross_street,
                'floor', crm_locations.floor,
                'room', crm_locations.room,
                'room_phone', crm_locations.room_phone,
                'becs_code', crm_locations.becs_code,
                'site_type', crm_locations.site_type,
                'qualification_status', crm_locations.qualification_status,
                'is_active', crm_locations.is_active
            )
            FROM crm_locations
            WHERE crm_locations.id = drives.location_id
        )`,
          'crm_locations'
        )
        .leftJoin('drives.account', 'account')
        .leftJoin('drives.location', 'crm_locations')
        .where(`drives.is_archived = false AND drives.is_blueprint = false`)
        // .orderBy('drives.id', 'DESC')
        .orderBy(sortName, sortingOrder)
        .offset(skip)
        .limit(take)
        .getQuery();

      const sample = await this.drivesRepository.query(query);

      if (!fetch_all) {
        const queryforCount = this.drivesRepository
          .createQueryBuilder('drives')
          .select(
            `(  SELECT JSON_BUILD_OBJECT(
                'id', drives.id,
                'created_at', drives.created_at,
                'is_archived', drives.is_archived,
                'name', drives.name,
                'account_id', drives.account_id,
                'location_id', drives.location_id,
                'is_linkable', drives.is_linkable,
                'is_linked', drives.is_linked,
                'date', drives.date,
                'is_multi_day_drive', drives.is_multi_day_drive,
                'tenant_id', drives.tenant_id,
                'promotion_id', drives.promotion_id,
                'operation_status_id', drives.operation_status_id,
                'recruiter_id', drives.recruiter_id,
                'drive_contacts', (
                  SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                      'id', drives_contacts.id,
                      'accounts_contacts_id', drives_contacts.accounts_contacts_id,
                      'drive_id', drives_contacts.drive_id,
                      'role_id', drives_contacts.role_id,
                      'role', (
                        SELECT JSON_BUILD_OBJECT(
                          'id', contacts_roles.id,
                          'name', contacts_roles.name
                        )
                        FROM contacts_roles
                        WHERE contacts_roles.id = drives_contacts.role_id
                        AND contacts_roles.name = 'Primary Chairperson'
                      ),
                      'record_id', (
                        SELECT JSON_BUILD_OBJECT(
                          'id', record_id.id,
                          'prefix_id', record_id.prefix_id,
                          'suffix_id', record_id.suffix_id,
                          'title', record_id.title,
                          'employee', record_id.employee,
                          'nick_name', record_id.nick_name,
                          'first_name', record_id.first_name,
                          'last_name', record_id.last_name,
                          'birth_date', record_id.birth_date,
                          'is_active', record_id.is_active
                        )
                        FROM crm_volunteer AS record_id
                        WHERE record_id.id = drives_contacts.accounts_contacts_id
                      ),
                      'account_contacts', (
                        SELECT JSON_AGG(
                          JSON_BUILD_OBJECT(
                            'contactable_id', account_contacts.id,
                            'contactable_type', account_contacts.contactable_type,
                            'contactable_data', (
                              SELECT JSON_AGG(
                                JSON_BUILD_OBJECT(
                                  'data', contact.data,
                                  'is_primary', contact.is_primary,
                                  'contact_type', contact.contact_type
                                )
                              )
                              FROM contacts contact
                              WHERE contact.contactable_id = account_contacts.id
                              AND contact.contactable_type = 'crm_volunteer'
                              AND (
                                (contact.is_primary = true AND contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND contact.contact_type >= '${ContactTypeEnum.WORK_PHONE}' AND contact.contact_type <= '${ContactTypeEnum.OTHER_PHONE}')
                                OR
                                (contact.is_primary = true AND contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND contact.contact_type >= '${ContactTypeEnum.WORK_EMAIL}' AND contact.contact_type <= '${ContactTypeEnum.OTHER_EMAIL}')
                              )
                            )
                          )
                        )
                        FROM account_contacts AS account_contacts
                        WHERE account_contacts.id = drives_contacts.accounts_contacts_id
                      )
                    )
                  )
                  FROM drives_contacts
                  WHERE drives_contacts.drive_id = drives.id 
                )
              )
            FROM drives drive WHERE drive.id = drives.id
            )`,
            'drive'
          )
          .addSelect(
            `(SELECT JSON_BUILD_OBJECT(
            'id', account.id,
            'name', account.name,
            'alternate_name', account.alternate_name,
            'phone', account.phone,
            'website', account.website,
            'facebook', account.facebook,
            'industry_category', account.industry_category,
            'industry_subcategory', account.industry_subcategory,
            'stage', account.stage,
            'source', account.source,
            'collection_operation', account.collection_operation,
            'recruiter', account.recruiter,
            'territory', account.territory,
            'population', account.population,
            'is_active', account.is_active,
            'RSMO', account."RSMO"
          ) FROM accounts WHERE accounts.id = drives.account_id)`,
            'account'
          )
          .addSelect(
            `(
            SELECT JSON_BUILD_OBJECT(
                'id', crm_locations.id,
                'created_at', crm_locations.created_at,
                'is_archived', crm_locations.is_archived,
                'name', crm_locations.name,
                'cross_street', crm_locations.cross_street,
                'floor', crm_locations.floor,
                'room', crm_locations.room,
                'room_phone', crm_locations.room_phone,
                'becs_code', crm_locations.becs_code,
                'site_type', crm_locations.site_type,
                'qualification_status', crm_locations.qualification_status,
                'is_active', crm_locations.is_active
            )
            FROM crm_locations
            WHERE crm_locations.id = drives.location_id
        )`,
            'crm_locations'
          )
          .leftJoin('drives.account', 'account')
          .leftJoin('drives.location', 'crm_locations')
          .where(`drives.is_archived = false AND drives.is_blueprint = false`)
          // .orderBy('drives.id', 'DESC')
          .orderBy(sortName, sortingOrder)
          .getQuery();

        const samplecount = await this.drivesRepository.query(queryforCount);
        count = samplecount?.length ? samplecount?.length : 0;
      }

      return {
        status: HttpStatus.OK,
        message: 'Drives Fetched Successfully',
        data: sample,
        count: count,
      };
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateShiftProjectionStaff(
    updateShiftsProjectionStaff: UpdateShiftsProjectionStaff
  ) {
    try {
      const shiftIds = updateShiftsProjectionStaff?.shift_ids
        ? Array.isArray(updateShiftsProjectionStaff?.shift_ids)
          ? updateShiftsProjectionStaff?.shift_ids
          : [updateShiftsProjectionStaff?.shift_ids]
        : [];

      if (!updateShiftsProjectionStaff.procedure_type_id) {
        throw new HttpException(
          `Procedure type id is required.`,
          HttpStatus.BAD_REQUEST
        );
      }
      const shiftsData = await this.shiftsRepo.find({
        where: {
          id: In(shiftIds),
        },
      });

      if (!shiftsData.length || shiftsData.length === 0) {
        throw new HttpException(`Shift not found.`, HttpStatus.BAD_REQUEST);
      }

      const shiftsProjectionStaffData = await Promise.all(
        shiftsData?.map(async (shift) => {
          const projectionstaff = await this.shiftsprojectionStaffRepo.findOne({
            where: {
              shift_id: shift.id,
              procedure_type_id: updateShiftsProjectionStaff.procedure_type_id,
            },
          });
          projectionstaff.is_donor_portal_enabled =
            updateShiftsProjectionStaff.is_donor_portal_enabled;
          await this.shiftsprojectionStaffRepo.save(projectionstaff);
        })
      );
      return resSuccess(
        'Staff Projection staff Updated.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        {}
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async addShiftSlot(addShiftSlotDto: AddShiftSlotDTO, user: any) {
    try {
      if (!addShiftSlotDto.slots || addShiftSlotDto.slots.length === 0) {
        throw new HttpException(
          `Need data to create shift slot.`,
          HttpStatus.BAD_REQUEST
        );
      }
      const slotData: any = [];
      for (const shiftItem of addShiftSlotDto.slots) {
        if (!shiftItem?.procedure_type_id) {
          throw new HttpException(
            `Procedure Type id is required.`,
            HttpStatus.BAD_REQUEST
          );
        }

        if (!shiftItem?.shift_id) {
          throw new HttpException(
            `Shift id is required.`,
            HttpStatus.BAD_REQUEST
          );
        }
        const saveSlots = new ShiftsSlots();
        saveSlots.shift_id = shiftItem.shift_id;
        saveSlots.procedure_type_id = shiftItem.procedure_type_id;
        saveSlots.created_by = user;
        saveSlots.start_time = shiftItem.start_time;
        saveSlots.end_time = shiftItem.end_time;
        slotData.push(await this.shiftsSlotRepo.save(saveSlots));
      }

      return resSuccess(
        'Shift Slots created.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        slotData
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getProcedureTypeSlots(getShiftIds: any) {
    try {
      const shiftIds = getShiftIds?.shift_ids
        ? Array.isArray(getShiftIds?.shift_ids)
          ? getShiftIds?.shift_ids
          : [getShiftIds?.shift_ids]
        : [];

      const shiftSlots = await this.shiftsSlotRepo.find({
        relations: ['procedure_type', 'donors', 'appointments.donor'],
        where: {
          shift: { id: In(shiftIds) },
          procedure_type_id: getShiftIds?.procedure_type_id,
          is_archived: false,
        },
        order: {
          start_time: 'ASC',
        },
      });

      if (!shiftSlots.length || shiftSlots.length === 0) {
        throw new HttpException(
          `Shift slot not found.`,
          HttpStatus.BAD_REQUEST
        );
      }

      const totalSlots = shiftSlots.length;
      const filledSlots = shiftSlots.filter(
        (slots) => slots?.donors?.length > 0
      ).length;

      const data = [
        ...shiftSlots,
        {
          filled_slots: filledSlots,
          total_slots: totalSlots,
        },
      ];
      return resSuccess(
        'Shift slots found.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        data
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getDriveShiftDonorSchdules(user: any, id: any) {
    try {
      const findShifts = await this.shiftsRepo.find({
        where: {
          shiftable_id: id,
          shiftable_type: 'drives',
        },
      });

      if (!findShifts || findShifts.length === 0) {
        throw new HttpException(`Shifts not found.`, HttpStatus.NOT_FOUND);
      }

      const shiftsDrawHours = await this.shiftsRepo
        .createQueryBuilder('shift')
        .select([
          'MIN(shift.start_time) AS start_time',
          'MAX(shift.end_time) AS end_time',
        ])
        .where({
          shiftable_id: id,
          shiftable_type: shiftable_type_enum.DRIVES,
          is_archived: false,
        })
        .groupBy('shift.shiftable_id')
        .getRawOne();

      const shiftsWithSlots = await Promise.all(
        findShifts.map(async (shift) => {
          const shiftSlots = await this.shiftsSlotRepo
            .createQueryBuilder('shiftSlot')
            .leftJoinAndSelect('shiftSlot.procedure_type', 'procedureType')
            .leftJoinAndSelect(
              'shiftSlot.appointments',
              'da',
              'shiftSlot.id = da.slot_id AND shiftSlot.procedure_type_id = da.procedure_type_id'
            )
            .leftJoinAndSelect('da.donor', 'donor')
            .leftJoinAndSelect('shiftSlot.donors', 'd', 'd.id = da.donor_id')
            .where(
              `shiftSlot.shift_id = :shiftId AND shiftSlot.is_archived = false`,
              {
                shiftId: shift.id,
              }
            )
            .orderBy('shiftSlot.start_time')
            .getMany();

          return shiftSlots;
        })
      );

      const flattenedShiftSlots = shiftsWithSlots.flat();
      const totalSlots = flattenedShiftSlots?.length;

      const filledSlots = flattenedShiftSlots.filter(
        (slots) => slots?.donors?.length > 0
      ).length;

      const data = await this.drivesRepository
        .createQueryBuilder('drives')
        .leftJoin(
          'shifts',
          'shifts',
          'shifts.shiftable_id = drives.id AND shifts.shiftable_type = :type',
          {
            type: 'drives',
          }
        )
        .leftJoin(
          'shifts_projections_staff',
          'shifts_projections_staff',
          'shifts_projections_staff.shift_id = shifts.id'
        )
        .select([
          'shifts_projections_staff.id AS id',
          'shifts_projections_staff.is_donor_portal_enabled AS is_donor_portal_enabled',
          'shifts_projections_staff.procedure_type_qty AS procedure_type_qty',
        ])
        .where(
          'drives.id = :id AND drives.is_archived = false AND shifts_projections_staff.id IS NOT NULL',
          { id: id }
        )

        .getRawMany();
      const totalProcedureQty = data.reduce(
        (total, shift) => total + shift.procedure_type_qty,
        0
      );

      return resSuccess(
        'Shifts and Shift Slots retrieved successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        {
          shifts: findShifts,
          shift_slots: flattenedShiftSlots,
          total_slots: totalSlots,
          draw_hours: shiftsDrawHours,
          filled_slots: filledSlots,
          total_procedures: totalProcedureQty,
        }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getLastDrive(tenant_id, account_id) {
    try {
      const [data, count] = await this.drivesRepository.find({
        where: {
          tenant_id: tenant_id,
          account_id: account_id,
          is_archived: false,
        },
        take: 1,
        order: { id: 'DESC' },
      });
      return {
        status: HttpStatus.OK,
        message: 'Last drive fetched successfully',
        data: data,
        count: count,
      };
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getDrivesModifiedData(drive: Drives): Promise<Modified> {
    const modifiedObjs = await Promise.all([
      this.getModifiedData(drive, this.usersRespository),
      this.drivesContactService.getModifiedData(drive, this.usersRespository, {
        drive_id: drive.id,
      }),
      this.driveCertificationsService.getModifiedData(drive),
      this.driveEquipmentsService.getModifiedData(drive),
    ]);

    modifiedObjs.sort(
      (obj1, obj2) => obj2.modified_at.getTime() - obj1.modified_at.getTime()
    );

    return modifiedObjs.length ? modifiedObjs[0] : null;
  }

  async findOne(id: bigint) {
    try {
      const query = this.drivesRepository
        .createQueryBuilder('drives')
        .select(
          `(  SELECT JSON_BUILD_OBJECT(
                'oef_procedures', drives.oef_procedures,
                'oef_products', drives.oef_products,
                'id', drives.id,
                'created_at', drives.created_at,
                'is_archived', drives.is_archived,
                'name', drives.name,
                'account_id', drives.account_id,
                'location_id', drives.location_id,
                'date', drives.date,
                'is_multi_day_drive', drives.is_multi_day_drive,
                'tenant_id', drives.tenant_id,
                'promotion_id', drives.promotion_id,
                'operation_status_id',(SELECT JSON_BUILD_OBJECT(
                  'id',operations_status.id,
                  'name',operations_status.name
                ) From operations_status WHERE operations_status.id = drives.operation_status_id ), 
                'recruiter_id', drives.recruiter_id,
                'created_by', (SELECT JSON_BUILD_OBJECT(
                  'id',"user"."id",
                  'first_name',"user"."first_name",
                  'last_name',"user"."last_name"
                ) From "user" WHERE "user"."id" = "drives"."created_by" ),
                'linked_drive',(
                  SELECT JSON_BUILD_OBJECT(
                    'id',linked_drives.id,
                    'prospective_drive_id',linked_drives.prospective_drive_id
                  ) From "linked_drives" AS linked_drives WHERE linked_drives.current_drive_id = drives.id AND linked_drives.is_archived = FALSE
                ),
                'drive_contacts', (
                  SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                      'id', drives_contacts.id,
                      'accounts_contacts_id', drives_contacts.accounts_contacts_id,
                      'drive_id', drives_contacts.drive_id,
                      'role_id', drives_contacts.role_id,
                      'role', (
                        SELECT JSON_BUILD_OBJECT(
                          'id', contacts_roles.id,
                          'name', contacts_roles.name
                        )
                        FROM contacts_roles
                        WHERE contacts_roles.id = drives_contacts.role_id
                      ),
                      'account_contacts', (
                        SELECT JSON_AGG(
                          JSON_BUILD_OBJECT(
                            'contactable_id', account_contacts.id,
                            'contactable_type', account_contacts.contactable_type,
                            'contactable_data', (
                              SELECT JSON_AGG(
                                JSON_BUILD_OBJECT(
                                  'data', contact.data,
                                  'is_primary', contact.is_primary,
                                  'contact_type', contact.contact_type
                                )
                              )
                              FROM contacts contact
                              WHERE contact.contactable_id = account_contacts.record_id
                              AND contact.contactable_type = 'crm_volunteer'
                              AND (
                                (contact.is_primary = true AND contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND contact.contact_type >= '${ContactTypeEnum.WORK_PHONE}' AND contact.contact_type <= '${ContactTypeEnum.OTHER_PHONE}')
                                OR
                                (contact.is_primary = true AND contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND contact.contact_type >= '${ContactTypeEnum.WORK_EMAIL}' AND contact.contact_type <= '${ContactTypeEnum.OTHER_EMAIL}')
                              )
                            )
                          )
                        )
                        FROM account_contacts AS account_contacts
                        WHERE account_contacts.id = drives_contacts.accounts_contacts_id
                      )
                    )
                  )
                  FROM drives_contacts
                  WHERE drives_contacts.drive_id = drives.id AND drives_contacts.is_archived = FALSE
                )
              )
            FROM drives drive WHERE drive.id = drives.id
            )`,
          'drive'
        )
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT(
            'id', account.id,
            'name', account.name,
            'alternate_name', account.alternate_name,
            'phone', account.phone,
            'website', account.website,
            'facebook', account.facebook,
            'industry_category', (SELECT JSON_BUILD_OBJECT(
              'id',industry_categories.id,
              'name',industry_categories.name
            ) From industry_categories WHERE industry_categories.id = accounts.industry_category ),
            'industry_subcategory', (SELECT JSON_BUILD_OBJECT(
              'id',industry_categories.id,
              'name',industry_categories.name
            ) From industry_categories WHERE industry_categories.id = accounts.industry_subcategory ),
            'stage', (SELECT JSON_BUILD_OBJECT(
              'id',stages.id,
              'name',stages.name
            ) From stages WHERE stages.id = accounts.stage ),
            'source', (SELECT JSON_BUILD_OBJECT(
              'id',sources.id,
              'name',sources.name
            ) From sources WHERE sources.id = accounts.source ),
            'collection_operation',  (SELECT JSON_BUILD_OBJECT(
              'id',business_units.id,
              'name',business_units.name
            ) From business_units WHERE business_units.id = accounts.collection_operation ),
            'territory', (SELECT JSON_BUILD_OBJECT(
              'id',territory.id,
              'territory_name',territory.territory_name
            ) From territory WHERE territory.id = accounts.territory ),
            'recruiter', (SELECT JSON_BUILD_OBJECT(
              'id',"user"."id",
              'first_name',"user"."first_name",
              'last_name',"user"."last_name"
            ) From "user" WHERE "user"."id" = "accounts"."recruiter" ),
            'population', account.population,
            'is_active', account.is_active,
            'RSMO', account."RSMO",
            'affiliations',(
              SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', account_affiliations.id,
                  'affiliation_data',(
                    SELECT JSON_BUILD_OBJECT(
                      'name',affiliation.name
                    )
                    FROM affiliation AS affiliation
                    WHERE affiliation.id = account_affiliations.affiliation_id
                  )
                )
              )
              FROM account_affiliations AS account_affiliations
              WHERE account_affiliations.account_id = drives.account_id AND account_affiliations.is_archived = FALSE AND account_affiliations.closeout_date IS NULL  
            ),
            'account_contacts', (
              SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', account_contacts_id.id,
                  'contactable_id', account_contacts_id.contactable_id,
                  'contactable_type', account_contacts_id.contactable_type,
                  'is_archived', account_contacts_id.is_archived,
                  'role_id', (SELECT JSON_BUILD_OBJECT(
                    'name',role.name,
                    'id',role.id
                  ) From contacts_roles AS role WHERE role.id = account_contacts_id.role_id ),
                  'record_id', (
                    SELECT JSON_BUILD_OBJECT(
                      'id', record_id.id,
                      'first_name', record_id.first_name,
                      'last_name', record_id.last_name,
                      'contactable_data', (
                        SELECT JSON_AGG(
                          JSON_BUILD_OBJECT(
                            'data', contact.data,
                            'is_primary', contact.is_primary,
                            'contact_type', contact.contact_type
                          )
                        )
                        FROM contacts contact
                        WHERE contact.contactable_id = record_id.id
                        AND contact.contactable_type = 'crm_volunteer'
                        AND (
                          (contact.is_primary = true AND contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND contact.contact_type >= '${ContactTypeEnum.WORK_PHONE}' AND contact.contact_type <= '${ContactTypeEnum.OTHER_PHONE}')
                          OR
                          (contact.is_primary = true AND contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND contact.contact_type >= '${ContactTypeEnum.WORK_EMAIL}' AND contact.contact_type <= '${ContactTypeEnum.OTHER_EMAIL}')
                        )
                      )
                    )
                    FROM crm_volunteer AS record_id
                    WHERE record_id.id = account_contacts_id.record_id
                  )
                )
              )
              FROM account_contacts AS account_contacts_id
              WHERE account_contacts_id.contactable_id = drives.account_id AND account_contacts_id.contactable_type = 'accounts' AND account_contacts_id.is_archived = FALSE
            )
          ) FROM accounts WHERE accounts.id = drives.account_id)`,
          'account'
        )
        .addSelect(
          `(
            SELECT JSON_BUILD_OBJECT(
                'id', crm_locations.id,
                'created_at', crm_locations.created_at,
                'is_archived', crm_locations.is_archived,
                'name', crm_locations.name,
                'cross_street', crm_locations.cross_street,
                'floor', crm_locations.floor,
                'room', crm_locations.room,
                'room_phone', crm_locations.room_phone,
                'becs_code', crm_locations.becs_code,
                'site_type', crm_locations.site_type,
                'qualification_status', crm_locations.qualification_status,
                'is_active', crm_locations.is_active
            )
            FROM crm_locations
            WHERE crm_locations.id = drives.location_id
        )`,
          'crm_locations'
        )

        .addSelect(
          `(SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', drives_certifications.drive_id, 
              'certificate_id', (SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id', certification.id,
                    'name', certification.name
                  ))
               FROM "certification" AS certification WHERE certification.id = "drives_certifications"."certification_id" AND certification.is_archived = FALSE
              )
            )
          )
          FROM drives_certifications
          WHERE drives_certifications.drive_id = drives.id AND drives_certifications.is_archived = FALSE
        )`,
          'drives_certifications'
        )

        .addSelect(
          `(SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'drive_equipment_id', drives_equipments.id,
              'quantity',drives_equipments.quantity,
              'equipment_id', (
                SELECT JSON_BUILD_OBJECT(
                  'name', equipment.name,
                  'id', equipment.id,
                  'type', equipment.type
                )
              
              FROM "equipments" AS equipment WHERE equipment.id = "drives_equipments"."equipment_id" AND equipment.is_archived = FALSE
              )
            )
          )
          FROM drives_equipments
          WHERE drives_equipments.drive_id = drives.id AND drives_equipments.is_archived = FALSE
          )`,
          'drives_equipments'
        )

        .addSelect(
          `(
                SELECT JSON_AGG( JSON_BUILD_OBJECT(
                    'id',shifts.id,
                    'start_time',shifts.start_time,
                    'end_time',shifts.end_time,
                    'oef_products',shifts.oef_products,
                    'oef_procedures',shifts.oef_procedures,
                    'break_start_time', shifts.break_start_time,
                    'break_end_time', shifts.break_end_time,
                    'reduce_slots', shifts.reduce_slots,
                    'reduction_percentage', shifts.reduction_percentage,
                    'shifts_projections_staff', (
                      SELECT JSON_AGG(
                          JSON_BUILD_OBJECT(
                            'id', shifts_projections_staff.id,
                            'procedure_id', shifts_projections_staff.procedure_type_id,
                            'procedure_type_qty', shifts_projections_staff.procedure_type_qty,
                            'product_yield', shifts_projections_staff.product_yield,
                            'procedure_type', (
                              SELECT JSON_BUILD_OBJECT(
                                  'id', pt.id,
                                  'name', pt.name,
                                  'short_description', pt.short_description,
                                  'procedure_duration', pt.procedure_duration,
                                  'procedure_type_products', (
                                    SELECT JSON_AGG(
                                        JSON_BUILD_OBJECT(
                                            'product_id', ptp.product_id,
                                            'quantity', ptp.quantity,
                                            'name', p.name
                                        )
                                    )
                                    FROM procedure_types_products ptp
                                    JOIN products p ON p.id = ptp.product_id
                                    WHERE ptp.procedure_type_id = pt.id
                                )
                              )
                              FROM procedure_types pt
                              WHERE pt.id = shifts_projections_staff.procedure_type_id
                            ),
                            'staff_setup', (
                              SELECT JSON_AGG(
                                JSON_BUILD_OBJECT(
                                  'id', staff_setup.id,
                                  'name', staff_setup.name,
                                  'short_name', staff_setup.short_name,
                                  'beds', staff_setup.beds,
                                  'concurrent_beds', staff_setup.concurrent_beds,
                                  'stagger_slots', staff_setup.stagger_slots,
                                  'shift_id',  shifts_projections_staff.shift_id,
                                  'qty', COALESCE(sub.qty, 0)
                                )
                              ) AS staff_setup
                              FROM shifts_projections_staff sps
                              LEFT JOIN staff_setup ON sps.staff_setup_id = staff_setup.id
                              LEFT JOIN (
                                SELECT
                                  staff_setup_id,
                                  COALESCE(SUM(DISTINCT ((cr.oef_contribution * sc.qty) / 100)), 0) AS qty
                                FROM staff_config sc
                                LEFT JOIN contacts_roles cr ON sc.contact_role_id = cr.id
                                GROUP BY staff_setup_id
                              ) sub ON sub.staff_setup_id = staff_setup.id
                              WHERE staff_setup.id = shifts_projections_staff.staff_setup_id
                              AND sps.id = shifts_projections_staff.id
                              GROUP BY staff_setup.id
                              )
                            )
                      )
                      FROM shifts_projections_staff
                      WHERE shifts_projections_staff.shift_id = shifts.id
                  ),
                  'shifts_devices', (
                    SELECT JSON_AGG( JSON_BUILD_OBJECT(
                        'name',device.name,
                        'id', device.id
                    )) FROM device,shifts_devices,shifts WHERE shifts_devices.shift_id = shifts.id AND shifts_devices.device_id = device.id
                    AND shifts.shiftable_id = ${id} AND shifts.shiftable_type = 'drives'
                ),
                'shifts_vehicles', (
                  SELECT JSON_AGG( JSON_BUILD_OBJECT(
                      'name',vehicle.name,
                      'id', vehicle.id
                  )) FROM vehicle,shifts_vehicles,shifts WHERE shifts_vehicles.shift_id = shifts.id AND shifts_vehicles.vehicle_id = vehicle.id
                  AND shifts.shiftable_id = ${id} AND shifts.shiftable_type = 'drives'
              )
                )) FROM shifts WHERE shifts.shiftable_id = ${id} AND shifts.shiftable_type = 'drives'
            )`,
          'shifts'
        )
        .addSelect(
          `(SELECT COUNT( JSON_BUILD_OBJECT(
               'id', shifts_slots.id)) FROM
            shifts_slots,shifts WHERE shifts_slots.shift_id = shifts.id
            AND shifts.shiftable_id = ${id}
            AND shifts.shiftable_type = 'drives')`,
          'slots'
        )
        .leftJoin('drives.account', 'account')
        .leftJoin('drives.location', 'crm_locations')
        .leftJoin(
          'drives_certifications',
          'drives_certifications',
          'drives_certifications.drive_id = drives.id AND drives_certifications.is_archived = FALSE'
        )
        .leftJoin(
          'drives_equipments',
          'drives_equipments',
          'drives_equipments.drive_id = drives.id '
        )
        .where(`drives.is_archived = false AND drives.id = ${id} `)
        .getQuery();

      const drive = await this.drivesRepository.query(query);
      const customFieldsData: any = await this.customFieldsDataRepo.find({
        where: {
          custom_field_datable_type: 'drives',
          custom_field_datable_id: id,
        },
        relations: ['field_id', 'field_id.pick_list'],
      });

      const modifiedData = await this.getDrivesModifiedData({
        ...drive?.[0]?.drive,
        created_by: drive?.[0]?.drive?.created_by,
      });

      return {
        status: HttpStatus.OK,
        message: 'Drive Fetched Successfully',
        data: drive,
        customFieldsData,
        modifiedData,
      };
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getShiftInfo(id: any) {
    try {
      const queryCount = await this.drivesRepository
        .createQueryBuilder('drives')
        .select(
          `(JSON_BUILD_OBJECT(
                        
                        'id',drives.id
                    )
                    )`,
          'drives'
        )

        .addSelect(
          `(
                      SELECT JSON_AGG(JSON_BUILD_OBJECT(
                          'start_time', shifts.start_time,
                          'end_time', shifts.end_time,
                          'oef_products', shifts.oef_products,
                          'oef_procedures', shifts.oef_procedures,
                          'reduce_slots', shifts.reduce_slots,
                          'reduction_percentage', shifts.reduction_percentage,
                          'break_start_time', shifts.break_start_time,
                          'break_end_time', shifts.break_end_time,
                          'vehicle', (
                              SELECT JSON_AGG(JSON_BUILD_OBJECT(
                                  'id', vehicle.id,
                                  'name', vehicle.name
                              ))
                              FROM shifts_vehicles
                              JOIN vehicle ON shifts_vehicles.vehicle_id = vehicle.id
                              WHERE shifts_vehicles.shift_id = shifts.id
                          ),
                          'device', (
                              SELECT JSON_AGG(JSON_BUILD_OBJECT(
                                  'id', device.id,
                                  'name', device.name
                              ))
                              FROM shifts_devices
                              JOIN device ON shifts_devices.device_id = device.id
                              WHERE shifts_devices.shift_id = shifts.id
                          ),
                          'staff_setup', (
                              SELECT JSON_AGG(JSON_BUILD_OBJECT(
                                  'id', staff_setup.id,
                                  'name', staff_setup.name
                              ))
                              FROM shifts_staff_setups
                              JOIN staff_setup ON shifts_staff_setups.staff_setup_id = staff_setup.id
                              WHERE shifts_staff_setups.shift_id = shifts.id
                          ),
                          'products', (SELECT JSON_AGG(JSON_BUILD_OBJECT(
                            'id', products.id,
                              'name', products.name, 
                              'product_qty',shifts_projections_staff.product_yield
                          ) ) FROM products
                                  JOIN procedure_types_products ON products.id = procedure_types_products.product_id
                                  JOIN shifts_projections_staff ON procedure_types_products.procedure_type_id = shifts_projections_staff.procedure_type_id
                                  JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
                                  WHERE shifts.shiftable_id = ${id} AND
                                  shifts.shiftable_type = 'drives'
                        ),
                        'procedure_types', (SELECT JSON_AGG(JSON_BUILD_OBJECT(
                          'id', procedure_types.id,
                            'name', procedure_types.name, 
                            'procedure_type_qty',shifts_projections_staff.procedure_type_qty
                        ) ) FROM procedure_types
                                JOIN shifts_projections_staff ON procedure_types.id = shifts_projections_staff.procedure_type_id
                                JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
                                WHERE shifts.shiftable_id = ${id} AND
                                shifts.shiftable_type = 'drives'
                      ),
                          'shifts_projections_staff', (SELECT JSON_AGG( JSON_BUILD_OBJECT(
                            'id', shifts_projections_staff.id,
                            'procedure_type_qty',  shifts_projections_staff.procedure_type_qty,
                            'product_qty', shifts_projections_staff.product_yield
        
                            )
                        )
                        FROM shifts_projections_staff, shifts
                          WHERE shifts.id = shifts_projections_staff.shift_id 
                          AND shifts.shiftable_id = ${id} AND
                          shifts.shiftable_type = 'drives'
        
                          )
                      ))
                      FROM shifts
                      WHERE shifts.shiftable_id = drives.id
                      AND shifts.shiftable_type = 'drives'
                  )`,
          'shifts'
        )
        .where(`drives.is_archived = false AND drives.id = ${id}`)
        .getQuery();

      const SampleCount = await this.drivesRepository.query(queryCount);
      return resSuccess(
        'Shift details fetched successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { ...SampleCount }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
  async saveEquipments(
    queryRunner: QueryRunner,
    equipments: Array<DriveEquipment>,
    drive: Drives,
    created_by: User
  ) {
    for (const equipmentItem of equipments) {
      const equipment = new DrivesEquipments();
      equipment.equipment_id = equipmentItem.equipment_id;
      equipment.drive = drive;
      equipment.quantity = equipmentItem.quantity;
      equipment.created_by = created_by;
      await queryRunner.manager.save(equipment);
    }
  }

  async UpdateEquipments(
    queryRunner: QueryRunner,
    equipments: Array<DriveEquipment>,
    getdrive: Drives,
    created_by: User
  ) {
    const findQuipment = await this.drivesEquipmentsRepo.delete({
      drive_id: getdrive.id,
    });
    if (!findQuipment) {
      throw new HttpException(`No Equipment found`, HttpStatus.BAD_REQUEST);
    }
    for (const equipmentItem of equipments) {
      const equipment = new DrivesEquipments();
      equipment.equipment_id = equipmentItem.equipment_id;
      equipment.drive_id = getdrive.id;
      equipment.quantity = equipmentItem.quantity;
      equipment.created_by = created_by;
      await queryRunner.manager.save(equipment);
    }
  }

  async saveCertifications(
    queryRunner: QueryRunner,
    certifications: Array<bigint>,
    drive: Drives,
    created_by: User
  ) {
    for (const certificationItem of certifications) {
      const certification = new DrivesCertifications();
      certification.certification_id = certificationItem;
      certification.drive = drive;
      certification.created_by = created_by;
      await queryRunner.manager.save(certification);
    }
  }

  async updateCertifications(
    queryRunner: QueryRunner,
    certifications: Array<bigint>,
    getdrive: Drives,
    created_by: User
  ) {
    const findCertifcations = await this.drivesCertificationsRepo.delete({
      drive_id: getdrive.id,
    });
    if (!findCertifcations) {
      throw new HttpException(`No Certifcations found`, HttpStatus.BAD_REQUEST);
    }
    for (const certificationItem of certifications) {
      const certification = new DrivesCertifications();
      certification.certification_id = certificationItem;
      certification.drive_id = getdrive.id;
      certification.created_by = created_by;
      await queryRunner.manager.save(certification);
    }
  }

  async saveMarketingInfo(
    queryRunner: QueryRunner,
    marketing: DriveMarketingInputDto,
    drive: Drives,
    created_by: User
  ) {
    for (const marketingMaterialItem of marketing.marketing_materials) {
      const marketingMaterial = new DrivesMarketingMaterialItems();
      marketingMaterial.marketing_material_id =
        marketingMaterialItem.marketing_material_id;
      marketingMaterial.drive = drive;
      marketingMaterial.created_by = created_by;
      marketingMaterial.quantity = marketingMaterialItem.quantity;
      await queryRunner.manager.save(marketingMaterial);
    }

    for (const promotionalItemObj of marketing.promotional_items) {
      const promotionalItem = new DrivesPromotionalItems();
      promotionalItem.promotional_item_id =
        promotionalItemObj.promotional_item_id;
      promotionalItem.drive = drive;
      promotionalItem.created_by = created_by;
      promotionalItem.quantity = promotionalItemObj.quantity;
      await queryRunner.manager.save(promotionalItem);
    }
  }
  async updateMarketingInfo(
    queryRunner: QueryRunner,
    marketing: DriveMarketingInputDto,
    getdrive: Drives,
    created_by: User
  ) {
    // const findMarketingMaterial =
    //   await this.drivesMarketingMaterialItemsRepo.find({
    //     where: {
    //       drive_id: getdrive.id,
    //     },
    //   });

    await this.drivesMarketingMaterialItemsRepo.delete({
      drive_id: getdrive.id,
    });
    for (const marketingMaterialItem of marketing.marketing_materials) {
      const marketingMaterial = new DrivesMarketingMaterialItems();
      marketingMaterial.marketing_material_id =
        marketingMaterialItem.marketing_material_id;
      marketingMaterial.drive_id = getdrive.id;
      marketingMaterial.created_by = created_by;
      marketingMaterial.quantity = marketingMaterialItem.quantity;
      await queryRunner.manager.save(marketingMaterial);
    }
    // const findPromotionalItem = await this.drivesPromotionalItemsRepo.findOne({
    //   where: {
    //     drive_id: getdrive.id,
    //   },
    // });
    await this.drivesPromotionalItemsRepo.delete({
      drive_id: getdrive.id,
    });
    for (const promotionalItemObj of marketing.promotional_items) {
      const promotionalItem = new DrivesPromotionalItems();
      promotionalItem.promotional_item_id =
        promotionalItemObj.promotional_item_id;
      promotionalItem.drive_id = getdrive.id;
      promotionalItem.created_by = created_by;
      promotionalItem.quantity = promotionalItemObj.quantity;
      await queryRunner.manager.save(promotionalItem);
    }
  }
  async saveDonorCommunicationData(
    queryRunner: QueryRunner,
    donor_communication: SupplementalRecruitmentDto,
    zip_codes: Array<string>,
    drive: Drives,
    created_by: User
  ) {
    for (const item of zip_codes) {
      const zipCode = new DrivesZipCodes();
      zipCode.zip_code = item;
      zipCode.drive = drive;
      zipCode.created_by = created_by;
      await queryRunner.manager.save(zipCode);
    }

    for (const item of donor_communication.account_ids) {
      const driveSupplementalAccount =
        new DrivesDonorCommunicationSupplementalAccounts();
      driveSupplementalAccount.account_id = item;
      driveSupplementalAccount.drive = drive;
      driveSupplementalAccount.created_by = created_by;
      await queryRunner.manager.save(driveSupplementalAccount);
    }
  }

  async UpdateDonorCommunicationData(
    queryRunner: QueryRunner,
    donor_communication: SupplementalRecruitmentDto,
    zip_codes: Array<string>,
    getdrive: Drives,
    created_by: User
  ) {
    await this.drivesZipCodesRepo.delete({
      drive_id: getdrive.id,
    });
    for (const item of zip_codes) {
      const zipCode = new DrivesZipCodes();
      zipCode.zip_code = item;
      zipCode.drive_id = getdrive.id;
      zipCode.created_by = created_by;
      await queryRunner.manager.save(zipCode);
    }
    await this.drivesDonorCommunicationSupplementalAccountsRepo.delete({
      drive_id: getdrive.id,
    });
    for (const item of donor_communication.account_ids) {
      const driveSupplementalAccount =
        new DrivesDonorCommunicationSupplementalAccounts();
      driveSupplementalAccount.account_id = item;
      driveSupplementalAccount.drive_id = getdrive.id;
      driveSupplementalAccount.created_by = created_by;
      await queryRunner.manager.save(driveSupplementalAccount);
    }
  }

  async getVehicles(
    CollectionOperations: bigint,
    location_type: string,
    Tenant_id: User
  ) {
    if (CollectionOperations && location_type) {
      let siteType = null;

      if (location_type === 'inside') {
        siteType = 1;
      }
      if (location_type === 'outside') {
        siteType = 2;
      } else {
        siteType = 3;
      }

      const getVehicles: any = await this.VehicleRepo.find({
        where: {
          collection_operation_id: CollectionOperations,
          vehicle_type_id: {
            location_type_id: siteType,
          },
          tenant: Tenant_id,
        },
      });

      console.log({ getVehicles });
    } else {
      console.log(
        'CollectionOperations and location is required to get vehicles'
      );
    }
  }

  async getChangeAudit(
    { id }: { id: bigint },
    listChangeAuditDto: ListChangeAuditDto,
    tenant_id: number
  ) {
    try {
      const { sortOrder, sortName, limit, page } = listChangeAuditDto;
      const getRailFields = await this.bookingRulesRepository.findOne({
        where: { tenant_id: tenant_id },
        relations: ['booking_rules_add_field.bookingRules'],
        order: { id: 'DESC' },
      });
      const where = {};
      if (!getRailFields.third_rail_fields_date)
        Object.assign(where, {
          changes_field: Not('Date'),
        });
      if (!getRailFields.third_rail_fields_projection)
        Object.assign(where, {
          changes_field: Not('Projection'),
        });
      if (!getRailFields.third_rail_fields_location)
        Object.assign(where, {
          changes_field: Not('Location'),
        });

      const [changeAudit, count] =
        await this.drivesHistoryRepository.findAndCount({
          where: { ...where, id: id },
          order:
            sortName && sortOrder
              ? { [sortName]: sortOrder as 'ASC' | 'DESC' }
              : { rowkey: 'DESC' },
          take: limit || 10,
          skip: (page - 1) * limit || 0,
          select: [
            'changes_from',
            'changes_to',
            'changes_field',
            'changed_when',
          ],
        });

      return {
        status: HttpStatus.OK,
        message: 'Change Audit Fetched Successfully',
        count: count,
        data: changeAudit,
      };
    } catch (error) {
      console.log(
        '=============================== CHANGE AUDIT ==============================='
      );
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async LinkDriveVehicle(Tenant_id: User, id, shift_id) {
    try {
      const findShift = await this.shiftsVehiclesRepo.findOne({
        where: { vehicle: { id: id }, shift: { id: shift_id } },
        relations: ['shift'],
      });
      if (!findShift) {
        return resError(
          'no shift found against this id',
          ErrorConstants.Error,
          400
        );
      }

      const findStaffProjection = await this.shiftsProjectionsStaffRepo.find({
        where: {
          shift_id: shift_id,
        },
      });
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async GetAllDrivesWithVehicles(Tenant_id: User) {
    try {
      const queryLinkDrive = this.drivesRepository
        .createQueryBuilder('drives')
        .select(
          `(
                SELECT JSON_AGG( JSON_BUILD_OBJECT(
                    'date', drives.date,
                    'id', drives.id,
                    'account', (
                        SELECT JSON_BUILD_OBJECT(
                            'name', accounts.name
                        )
                        FROM accounts
                        WHERE drives.account_id = accounts.id
                    ),
                    'location', (
                        SELECT JSON_BUILD_OBJECT(
                            'name', crm_locations.name
                        )
                        FROM crm_locations
                        WHERE drives.location_id = crm_locations.id
                    ),
                    'shifts',(
                SELECT JSON_AGG( JSON_BUILD_OBJECT(
                    'id',shifts.id,
                    'start_time',shifts.start_time,
                    'end_time',shifts.end_time,
                    'oef_products',shifts.oef_products,
                    'oef_procedures',shifts.oef_procedures,
                    'shiftable_id',shifts.shiftable_id
                )) FROM shifts WHERE shifts.shiftable_id = drives.id AND shifts.shiftable_type = 'drives'
                HAVING COUNT(*) = 1
                ),
                'staff_config',(SELECT JSON_AGG(JSON_BUILD_OBJECT('qty', staff_config.qty))
                FROM staff_config
                INNER JOIN public.staff_setup ON staff_config.staff_setup_id = staff_setup.id
                INNER JOIN public.shifts_staff_setups ON shifts_staff_setups.staff_setup_id = staff_setup.id
                JOIN public.shifts ON shifts.id = shifts_staff_setups.shift_id
                WHERE shifts.shiftable_id = drives.id AND shifts.shiftable_type = 'drives'
              ),
                        'vehicles', (
                            SELECT JSON_AGG(JSON_BUILD_OBJECT(
                                'name', vehicle.name
                            )) 
                            FROM vehicle, shifts_vehicles, shifts
                            WHERE shifts_vehicles.vehicle_id = vehicle.id  
                            AND shifts_vehicles.shift_id = shifts.id 
                            AND shifts.shiftable_type = 'drives'
                            AND shifts.shiftable_id = drives.id
                        )
                ))
                FROM drives
                WHERE drives.tenant_id = ${Tenant_id}
            ) `,
          'drives'
        )
        // .addSelect(
        //   `(SELECT JSON_AGG(JSON_BUILD_OBJECT('qty', staff_config.qty))
        //     FROM staff_config
        //     INNER JOIN public.staff_setup ON staff_config.staff_setup_id = staff_setup.id
        //     INNER JOIN public.shifts_staff_setups ON shifts_staff_setups.staff_setup_id = staff_setup.id
        //     JOIN public.shifts ON shifts.id = shifts_staff_setups.shift_id
        //     WHERE shifts.shiftable_id = drives.id AND shifts.shiftable_type = 'drives'
        //   )`,
        //   'staff_config'
        // )

        // .addSelect(
        //   `(
        //         SELECT JSON_AGG( JSON_BUILD_OBJECT(
        //             'start_time',shifts.start_time,
        //             'end_time',shifts.end_time,
        //             'oef_products',shifts.oef_products,
        //             'oef_procedures',shifts.oef_procedures,
        //             'shiftable_id',shifts.shiftable_id
        //         )) FROM shifts WHERE shifts.shiftable_id = drives.id AND shifts.shiftable_type = 'drives'
        //     )`,
        //   'shifts'
        // )
        .addSelect(
          `(SELECT JSON_AGG(JSON_BUILD_OBJECT('qty', staff_config.qty))
            FROM staff_config
            INNER JOIN public.staff_setup ON staff_config.staff_setup_id = staff_setup.id
            INNER JOIN public.shifts_staff_setups ON shifts_staff_setups.staff_setup_id = staff_setup.id
            JOIN public.shifts ON shifts.id = shifts_staff_setups.shift_id
            WHERE shifts.shiftable_id = drives.id AND shifts.shiftable_type = 'drives'
          )`,
          'staff_config'
        )

        // .leftJoin('vehicle', 'shift_vehicles')
        .where(`drives.is_archived = false`)
        // .orderBy(sortName, sortOrder)
        .getQuery();

      const data = await this.drivesRepository.query(queryLinkDrive);

      return resSuccess('Vehicles Found.', 'success', HttpStatus.CREATED, data);
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getShiftDetails(id) {
    return this.shiftsService.GetLinkDataOnShift(id);
  }

  async getAccountBlueprints(id: bigint) {
    try {
      const data = await this.drivesRepository.find({
        where: {
          account_id: id,
          is_blueprint: true,
          is_archived: false,
          tenant_id: this.request.user.tenant.id,
        },
        relations: ['account', 'location'],
      });
      return {
        status: HttpStatus.OK,
        message: 'Account Blueprints Drive Fetched Successfully',
        data,
      };
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAccountDrives(id: bigint) {
    try {
      const data = await this.drivesRepository.find({
        where: {
          account_id: id,
          is_blueprint: false,
          is_archived: false,
          tenant_id: this.request.user.tenant.id,
        },
      });
      return {
        status: HttpStatus.OK,
        message: 'Account Blueprints Drive Fetched Successfully',
        data,
      };
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSingleDrive(id: bigint) {
    try {
      console.log({ id });
      const query = this.drivesRepository
        .createQueryBuilder('drives')
        .select(
          `(  SELECT JSON_BUILD_OBJECT(
                'id', drives.id,
                'created_at', drives.created_at,
                'is_archived', drives.is_archived,
                'name', drives.name,
                'account', drives.account_id,
                'location_id', drives.location_id,
                'date', drives.date,
                'is_multi_day_drive', drives.is_multi_day_drive,
                'tenant_id', drives.tenant_id,
                'promotion_id', drives.promotion_id,
                'operation_status_id', drives.operation_status_id,
                'recruiter_id', drives.recruiter_id,
                'open_to_public', drives.open_to_public,
                'marketing_start_date', drives.marketing_start_date,
                'marketing_end_date', drives.marketing_end_date,
                'marketing_start_time', drives.marketing_start_time,
                'marketing_end_time', drives.marketing_end_time,
                'instructional_information', drives.instructional_information,
                'donor_information', drives.donor_information,
                'order_due_date', drives.order_due_date,
                'tele_recruitment', drives.tele_recruitment,
                'email', drives.email,
                'sms', drives.sms,
                'promotion', ( SELECT JSON_BUILD_OBJECT(
                   'id',promotion_entity.id,
                   'name',promotion_entity.name)
                    from promotion_entity , drives WHERE drives.promotion_id = promotion_entity.id AND drives.id = ${id}
                   ),
                   'status',(SELECT JSON_BUILD_OBJECT(
                   'id',operations_status.id,
                   'name',operations_status.name)
                    from operations_status , drives WHERE operations_status.id = drives.operation_status_id AND drives.id = ${id}
                   )
                )
              FROM drives WHERE drives.id = ${id}
            )`,
          'drive'
        )
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT(
            'id', account.id,
            'name', account.name,
            'alternate_name', account.alternate_name,
            'phone', account.phone,
            'website', account.website,
            'facebook', account.facebook,
            'industry_category', (SELECT JSON_BUILD_OBJECT(
              'id',industry_categories.id,
              'name',industry_categories.name
            ) From industry_categories WHERE industry_categories.id = accounts.industry_category ),
            'industry_subcategory', (SELECT JSON_BUILD_OBJECT(
              'id',industry_categories.id,
              'name',industry_categories.name
            ) From industry_categories WHERE industry_categories.id = accounts.industry_subcategory ),
            'stage', (SELECT JSON_BUILD_OBJECT(
              'id',stages.id,
              'name',stages.name
            ) From stages WHERE stages.id = accounts.stage ),
            'source', (SELECT JSON_BUILD_OBJECT(
              'id',sources.id,
              'name',sources.name
            ) From sources WHERE sources.id = accounts.source ),
            'collection_operation',  (SELECT JSON_BUILD_OBJECT(
              'id',business_units.id,
              'name',business_units.name
            ) From business_units WHERE business_units.id = accounts.collection_operation ),
            'territory', (SELECT JSON_BUILD_OBJECT(
              'id',territory.id,
              'territory_name',territory.territory_name
            ) From territory WHERE territory.id = accounts.territory ),
            'recruiter', (SELECT JSON_BUILD_OBJECT(
              'id',"user"."id",
              'first_name',"user"."first_name",
              'last_name',"user"."last_name"
            ) From "user" WHERE "user"."id" = "accounts"."recruiter" ),
            'population', account.population,
            'is_active', account.is_active,
            'RSMO', account."RSMO"
          ) FROM accounts WHERE accounts.id = drives.account_id)`,
          'account'
        )
        .addSelect(
          `(
            SELECT JSON_BUILD_OBJECT(
                'id', crm_locations.id,
                'created_at', crm_locations.created_at,
                'is_archived', crm_locations.is_archived,
                'name', crm_locations.name,
                'cross_street', crm_locations.cross_street,
                'floor', crm_locations.floor,
                'room', crm_locations.room,
                'room_phone', crm_locations.room_phone,
                'becs_code', crm_locations.becs_code,
                'site_type', crm_locations.site_type,
                'qualification_status', crm_locations.qualification_status,
                'is_active', crm_locations.is_active
            )
            FROM crm_locations
            WHERE crm_locations.id = drives.location_id
        )`,
          'crm_locations'
        )
        .addSelect(
          `(SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', drives_certifications.drive_id,
              'certificate_id', (SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id', "certification"."id",
                    'name',"certification"."name"
                  ))
               FROM "certification" WHERE "drives_certifications"."certification_id" = "certification"."id"
              )
            )
          )
          FROM drives_certifications
          WHERE drives_certifications.drive_id = drives.id
        )`,
          'drives_certifications'
        )
        .addSelect(
          `(SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', drives_donor_comms_supp_accounts.account_id
            )
          )
          FROM drives_donor_comms_supp_accounts
          WHERE drives_donor_comms_supp_accounts.drive_id = drives.id
          )`,
          'drives_supp_accounts'
        )
        .addSelect(
          `(SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'zip_code', drives_zipcodes.zip_code
            )
          )
          FROM drives_zipcodes
          WHERE drives_zipcodes.drive_id = drives.id
          )`,
          'zip_codes'
        )
        .addSelect(
          `(SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', drives_equipments.equipment_id,
                'quantity',drives_equipments.quantity,
                'equipment_id', (SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'name', "equipments"."name"
                  )
                )
                FROM "equipments" WHERE "drives_equipments"."equipment_id" = "equipments"."id"
              )
            )
          )
          FROM drives_equipments
          WHERE drives_equipments.drive_id = drives.id
          )`,
          'drives_equipments'
        )
        .addSelect(
          `(SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', drives_marketing_material_items.marketing_material_id,
                'quantity',drives_marketing_material_items.quantity,
                'marketing_materials', (SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'name', "marketing_materials"."name"
                  )
                )
                FROM "marketing_materials" WHERE "drives_marketing_material_items"."marketing_material_id" = "marketing_materials"."id"
              )
            )
          )
          FROM drives_marketing_material_items
          WHERE drives_marketing_material_items.drive_id = drives.id
          )`,
          'drives_marketing_materials'
        )
        .addSelect(
          `(SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', drives_promotional_items.promotional_item_id,
                'quantity',drives_promotional_items.quantity,
                'promotional_items', (SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'name', "promotional_items"."name"
                  )
                )
                FROM "promotional_items" WHERE "drives_promotional_items"."promotional_item_id" = "promotional_items"."id"
              )
            )
          )
          FROM drives_promotional_items
          WHERE drives_promotional_items.drive_id = drives.id
          )`,
          'drives_promotional_items'
        )
        .addSelect(
          `(
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', drives_contacts.id,
                'accounts_contacts_id', drives_contacts.accounts_contacts_id,
                'drive_id', drives_contacts.drive_id,
                'role_id', drives_contacts.role_id,
                'role', (
                  SELECT JSON_BUILD_OBJECT(
                    'id', contacts_roles.id,
                    'name', contacts_roles.name
                  )
                  FROM contacts_roles
                  WHERE contacts_roles.id = drives_contacts.role_id
                ),
                'record_id', (
                  SELECT JSON_BUILD_OBJECT(
                    'id', record_id.id,
                    'prefix_id', record_id.prefix_id,
                    'suffix_id', record_id.suffix_id,
                    'title', record_id.title,
                    'employee', record_id.employee,
                    'nick_name', record_id.nick_name,
                    'first_name', record_id.first_name,
                    'last_name', record_id.last_name,
                    'birth_date', record_id.birth_date,
                    'is_active', record_id.is_active
                  )
                  FROM crm_volunteer AS record_id
                  WHERE record_id.id = drives_contacts.accounts_contacts_id
                ),
                'account_contacts', (
                  SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                      'contactable_id', account_contacts.id,
                      'contactable_type', account_contacts.contactable_type,
                      'contactable_data', (
                        SELECT JSON_AGG(
                          JSON_BUILD_OBJECT(
                            'data', contact.data,
                            'is_primary', contact.is_primary,
                            'contact_type', contact.contact_type
                          )
                        )
                        FROM contacts contact
                        WHERE contact.contactable_id = account_contacts.id
                        AND contact.contactable_type = 'crm_volunteer'
                        AND (
                          (contact.is_primary = true AND contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND contact.contact_type >= '${ContactTypeEnum.WORK_PHONE}' AND contact.contact_type <= '${ContactTypeEnum.OTHER_PHONE}')
                          OR
                          (contact.is_primary = true AND contact.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND contact.contact_type >= '${ContactTypeEnum.WORK_EMAIL}' AND contact.contact_type <= '${ContactTypeEnum.OTHER_EMAIL}')
                        )
                      )
                    )
                  )
                  FROM account_contacts AS account_contacts
                  WHERE account_contacts.id = drives_contacts.accounts_contacts_id
                )
              )
            )
            FROM drives_contacts
            WHERE drives_contacts.drive_id = drives.id
          )
        `,
          'drive_contacts'
        )
        .addSelect(
          `(
                SELECT JSON_AGG( JSON_BUILD_OBJECT(
                    'id',shifts.id,
                    'start_time',shifts.start_time,
                    'end_time',shifts.end_time,
                    'oef_products',shifts.oef_products,
                    'oef_procedures',shifts.oef_procedures,
                    'break_start_time', shifts.break_start_time,
                    'break_end_time', shifts.break_end_time,
                    'reduce_slots', shifts.reduce_slots,
                    'reduction_percentage', shifts.reduction_percentage,
                    'shifts_projections_staff', (
                      SELECT JSON_AGG(
                          JSON_BUILD_OBJECT(
                            'id', shifts_projections_staff.id,
                            'procedure_id', shifts_projections_staff.procedure_type_id,
                            'procedure_type_qty', shifts_projections_staff.procedure_type_qty,
                            'product_yield', shifts_projections_staff.product_yield,
                            'procedure_type', (
                              SELECT JSON_BUILD_OBJECT(
                                  'id', pt.id,
                                  'name', pt.name,
                                  'short_description', pt.short_description,
                                  'procedure_duration', pt.procedure_duration,
                                  'procedure_type_products', (
                                    SELECT JSON_AGG(
                                        JSON_BUILD_OBJECT(
                                            'product_id', ptp.product_id,
                                            'quantity', ptp.quantity,
                                            'name', p.name
                                        )
                                    )
                                    FROM procedure_types_products ptp
                                    JOIN products p ON p.id = ptp.product_id
                                    WHERE ptp.procedure_type_id = pt.id
                                )
                              )
                              FROM procedure_types pt
                              WHERE pt.id = shifts_projections_staff.procedure_type_id
                            ),
                            'staff_setup', (
                              SELECT JSON_AGG(
                                JSON_BUILD_OBJECT(
                                  'id', staff_setup.id,
                                  'name', staff_setup.name,
                                  'short_name', staff_setup.short_name,
                                  'beds', staff_setup.beds,
                                  'concurrent_beds', staff_setup.concurrent_beds,
                                  'stagger_slots', staff_setup.stagger_slots,
                                  'shift_id',  shifts_projections_staff.shift_id,
                                  'qty', COALESCE(sub.qty, 0)
                                )
                              ) AS staff_setup
                              FROM shifts_projections_staff sps
                              LEFT JOIN staff_setup ON sps.staff_setup_id = staff_setup.id
                              LEFT JOIN (
                                SELECT
                                  staff_setup_id,
                                  COALESCE(SUM(DISTINCT ((cr.oef_contribution * sc.qty) / 100)), 0) AS qty
                                FROM staff_config sc
                                LEFT JOIN contacts_roles cr ON sc.contact_role_id = cr.id
                                GROUP BY staff_setup_id
                              ) sub ON sub.staff_setup_id = staff_setup.id
                              WHERE staff_setup.id = shifts_projections_staff.staff_setup_id
                              AND sps.id = shifts_projections_staff.id
                              GROUP BY staff_setup.id
                              )
                            )
                      )
                      FROM shifts_projections_staff
                      WHERE shifts_projections_staff.shift_id = shifts.id
                  ),
                  'shifts_devices', (
                    SELECT JSON_AGG(JSON_BUILD_OBJECT(
                        'name', device.name,
                        'id', device.id
                    ))
                    FROM shifts_devices
                    JOIN device ON shifts_devices.device_id = device.id
                    WHERE shifts_devices.shift_id = shifts.id
                      AND shifts.shiftable_id = ${id}
                      AND shifts.shiftable_type = 'drives'
                ),
                'shifts_vehicles', (
                  SELECT JSON_AGG(JSON_BUILD_OBJECT(
                      'name', vehicle.name,
                      'id', vehicle.id
                  ))
                  FROM shifts_vehicles
                  JOIN vehicle ON shifts_vehicles.vehicle_id = vehicle.id
                  WHERE shifts_vehicles.shift_id = shifts.id
                    AND shifts.shiftable_id = ${id}
                    AND shifts.shiftable_type = 'drives'
              )
                )) FROM shifts WHERE shifts.shiftable_id = ${id} AND shifts.shiftable_type = 'drives'
            )`,
          'shifts'
        )
        .leftJoin('drives.account', 'account')
        .leftJoin('drives.location', 'location')
        .where(`drives.id = ${id}`)
        .getQuery();

      const data = await this.entityManager.query(query);

      const customFieldsData: any = await this.customFieldsDataRepo.find({
        where: {
          custom_field_datable_type: 'drives',
          custom_field_datable_id: id,
        },
        relations: ['field_id', 'field_id.pick_list'],
      });
      return {
        status: HttpStatus.OK,
        message: 'Blueprint Fetched Successfully',
        data,
        customFieldsData,
      };
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addDonorAppointments(createDonorAppointmentDtos: any) {
    const savedAppointments = [];

    try {
      for (const createDonorAppointmentDto of createDonorAppointmentDtos.donor_appointment) {
        const user = await this.usersRespository.findOneBy({
          id: createDonorAppointmentDto?.created_by,
        });

        if (!user) {
          throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
        }

        const appointment = new DonorsAppointments();
        appointment.appointmentable_id =
          createDonorAppointmentDto?.appointmentable_id;
        appointment.appointmentable_type =
          createDonorAppointmentDto?.appointmentable_type;
        appointment.slot_id = createDonorAppointmentDto.slot_id;
        appointment.created_by = createDonorAppointmentDto.created_by;
        appointment.status = createDonorAppointmentDto?.status;
        appointment.donor_id = createDonorAppointmentDto?.donor_id;
        appointment.procedure_type_id =
          createDonorAppointmentDto?.procedure_type_id;

        const savedAppointment =
          await this.entityDonorsAppointmentsRepository.save(appointment);
        savedAppointments.push(savedAppointment);
      }

      return resSuccess(
        'Donor Appointments Created.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedAppointments
      );
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async archive(id: bigint) {
    try {
      const drive = await this.drivesRepository.findOne({
        where: {
          id,
        },
        relations: [
          'created_by',
          'drive_contacts',
          'drive_contacts.created_by',
          'equipments',
          'equipments.created_by',
          'certifications',
          'certifications.created_by',
          'marketing_items',
          'marketing_items.created_by',
          'drives_donor_comms_supp_accounts',
          'drives_donor_comms_supp_accounts.created_by',
          'zip_codes',
          'zip_codes.created_by',
        ],
      });
      const driveHistory = new DrivesHistory();
      Object.assign(driveHistory, drive);
      driveHistory.history_reason = 'D';
      driveHistory.created_by = drive.created_by.id;
      driveHistory.tenant_id = drive.tenant_id;
      driveHistory.location_id = drive.location_id;
      driveHistory.promotion_id = drive.promotion_id;
      driveHistory.recruiter_id = drive.recruiter_id;
      driveHistory.operation_status_id = drive.operation_status_id;
      driveHistory.account_id = drive.account_id;
      await this.createHistory(driveHistory);
      await this.shiftsService.createShiftHistory(
        id,
        shiftable_type_enum.DRIVES,
        HistoryReason.D
      );
      // TODO Custom fields History

      for (const driveCotact of drive.drive_contacts) {
        const contactHistory = new DrivesContactsHistory();
        Object.assign(contactHistory, driveCotact);
        contactHistory.history_reason = 'D';
        contactHistory.created_by = driveCotact.created_by.id;
        await this.entityManager.save(contactHistory);
        driveCotact.is_archived = true;
        await this.entityManager.save(driveCotact);
      }

      for (const equipment of drive.equipments) {
        const equipmentHistory = new DrivesEquipmentHistory();
        Object.assign(equipmentHistory, equipment);
        equipmentHistory.history_reason = 'D';
        equipmentHistory.created_by = equipment.created_by.id;
        await this.entityManager.save(equipmentHistory);
        equipment.is_archived = true;
        await this.entityManager.save(equipment);
      }

      for (const certification of drive.certifications) {
        const certificationHistory = new DrivesCertificationsHistory();
        Object.assign(certificationHistory, certification);
        certificationHistory.history_reason = 'D';
        certificationHistory.created_by = certification.created_by.id;
        await this.entityManager.save(certificationHistory);
        certification.is_archived = true;
        await this.entityManager.save(certification);
      }

      for (const marketing of drive.marketing_items) {
        const marketingHistory = new DrivesMarketingMaterialItemsHistory();
        Object.assign(marketingHistory, marketing);
        marketingHistory.history_reason = 'D';
        marketingHistory.created_by = marketing.created_by.id;
        await this.entityManager.save(marketingHistory);
        marketing.is_archived = true;
        await this.entityManager.save(marketing);
      }

      for (const item of drive.drives_donor_comms_supp_accounts) {
        const itemHistory =
          new DrivesDonorCommunicationSupplementalAccountsHistory();
        Object.assign(itemHistory, item);
        itemHistory.history_reason = 'D';
        itemHistory.created_by = item.created_by.id;
        await this.entityManager.save(itemHistory);
        item.is_archived = true;
        await this.entityManager.save(item);
      }

      for (const item of drive.zip_codes) {
        const itemHistory = new DrivesZipCodesHistory();
        Object.assign(itemHistory, item);
        itemHistory.history_reason = 'D';
        itemHistory.created_by = item.created_by.id;
        await this.entityManager.save(itemHistory);
        item.is_archived = true;
        await this.entityManager.save(item);
      }

      const customFields = await this.customFieldsDataRepo.find({
        where: {
          custom_field_datable_type: 'drives',
          custom_field_datable_id: id,
        },
        relations: [
          'field_id',
          'field_id.pick_list',
          'created_by',
          'tenant_id',
        ],
      });

      for (const item of customFields) {
        const itemHistory = new CustomFieldsDataHistory();
        itemHistory.history_reason = 'D';
        itemHistory.id = item?.id;
        itemHistory.custom_field_datable_id = item?.custom_field_datable_id;
        itemHistory.custom_field_datable_type = item?.custom_field_datable_type;
        itemHistory.field_id = item?.field_id?.id;
        itemHistory.tenant_id = item?.tenant_id?.id;
        itemHistory.created_by = this.request.user?.id;
        itemHistory.is_archived = item.is_archived;
        itemHistory.field_data = item.field_data;
        await this.entityManager.save(itemHistory);
        item.is_archived = true;
        await this.entityManager.save(item);
      }
      drive.is_archived = true;
      await this.entityManager.save(drive);
      return resSuccess(
        'Drive archived.',
        SuccessConstants.SUCCESS,
        HttpStatus.NO_CONTENT,
        {}
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
