import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, In, Between } from 'typeorm';
import { GetMonthlyCalenderInterface } from '../interface/oc-calender-monthly.interface';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { OrganizationalLevels } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/organizational-levels/entities/organizational-level.entity';
import { Procedure } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/procedures/entities/procedure.entity';
import { Products } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/products/entities/products.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Favorites } from '../../manage-favorites/entities/favorites.entity';
import { ProcedureTypes } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/procedure-types/entities/procedure-types.entity';
import { Drives } from '../../operations/drives/entities/drives.entity';
import { PolymorphicType } from 'src/api/common/enums/polymorphic-type.enum';
import { ContactTypeEnum } from 'src/api/crm/contacts/common/enums';
import { Sessions } from '../../operations/sessions/entities/sessions.entity';
import { NonCollectionEvents } from '../../operations/non-collection-events/entities/oc-non-collection-events.entity';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { Device } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/device/entities/device.entity';
import { StaffShiftSchedule } from 'src/api/crm/contacts/staff/staffShiftSchedule/entity/staff-shift-schedule.entity';
import { ShiftsDevices } from 'src/api/shifts/entities/shifts-devices.entity';
import { ShiftsVehicles } from 'src/api/shifts/entities/shifts-vehicles.entity';
import { ShiftsProjectionsStaff } from 'src/api/shifts/entities/shifts-projections-staff.entity';
import { Vehicle } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/vehicles/entities/vehicle.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { DailyGoalsCalenders } from 'src/api/system-configuration/tenants-administration/organizational-administration/goals/daily-goals-calender/entity/daily-goals-calender.entity';
import { ProcedureTypesProducts } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/procedure-types/entities/procedure-types-products.entity';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { DonorDonations } from 'src/api/crm/contacts/donor/donorDonationHistory/entities/donor-donations.entity';

@Injectable()
export class CalendersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Procedure)
    private readonly procedureRepository: Repository<Procedure>,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(OperationsStatus)
    private readonly operationsStatusRepository: Repository<OperationsStatus>,
    @InjectRepository(OrganizationalLevels)
    private readonly organizationalLevelsRepository: Repository<OrganizationalLevels>,
    @InjectRepository(ProcedureTypes)
    private readonly procedureTypesRepository: Repository<ProcedureTypes>,
    @InjectRepository(Favorites)
    private readonly favoritesRepository: Repository<Favorites>,
    @InjectRepository(Drives)
    private readonly drivesRepository: Repository<Drives>,
    @InjectRepository(Sessions)
    private readonly sessionsRepository: Repository<Sessions>,
    @InjectRepository(NonCollectionEvents)
    private readonly nonCollectionEventsRepository: Repository<NonCollectionEvents>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(StaffShiftSchedule)
    private readonly staffShiftScheduleRepository: Repository<StaffShiftSchedule>,
    @InjectRepository(ShiftsDevices)
    private readonly shiftsDevicesRepository: Repository<ShiftsDevices>,
    @InjectRepository(ShiftsVehicles)
    private readonly shiftsVehiclesRepository: Repository<ShiftsVehicles>,
    @InjectRepository(ShiftsProjectionsStaff)
    private readonly shiftsProjectionsStaffRepository: Repository<ShiftsProjectionsStaff>,
    @InjectRepository(BusinessUnits)
    private readonly businessUnitsRepository: Repository<BusinessUnits>,
    @InjectRepository(DailyGoalsCalenders)
    private readonly dailyGoalsCalendersRepository: Repository<DailyGoalsCalenders>,
    @InjectRepository(ProcedureTypesProducts)
    private readonly procedureTypesProductsRepository: Repository<ProcedureTypesProducts>,
    @InjectRepository(Shifts)
    private readonly shiftsRepository: Repository<Shifts>,
    @InjectRepository(DonorDonations)
    private readonly donorDonationsRepository: Repository<DonorDonations>
  ) {}
  async findAllMonthly(
    user: any,
    getMonthlyCalenderInterface: GetMonthlyCalenderInterface
  ) {
    try {
      let countData: any;
      const response: any = [];
      const { procedure_type_id, product_id, operation_status_id }: any =
        getMonthlyCalenderInterface;
      let { organization_level_id }: any = getMonthlyCalenderInterface;
      let { month, year }: any = getMonthlyCalenderInterface;

      if (!month || !year) {
        const currentDate = new Date();
        month = currentDate.getMonth() + 1;
        year = currentDate.getFullYear();
      }

      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);

      let createdBy: any = {};
      if (user.is_manager) {
        const managerUsersWhere: any = {
          assigned_manager: {
            id: user?.id,
          },
        };
        const managerUsers = await this.userRepository.find({
          where: managerUsersWhere,
          relations: ['assigned_manager'],
        });

        const managerUserIds = managerUsers.map((user) => {
          return user?.id;
        });
        createdBy = { ...createdBy, id: In(managerUserIds) };
      } else {
        createdBy = {
          ...createdBy,
          id: user?.id,
        };
      }

      let procedureType: any = {};
      let operationStatus: any = {};
      let collectionOperation: any = {};
      let productProcedureType: any = {};

      const userBusinessUnits = await this.businessUnitsRepository.find({
        where: { created_by: createdBy },
        relations: ['organizational_level_id'],
      });

      const organizationLevelIds = userBusinessUnits.map((userBusinessUnit) => {
        return userBusinessUnit.organizational_level_id?.id;
      });

      const collectionOperationOrganizationlevels =
        await this.organizationalLevelsRepository.find({
          where: {
            id: In(organizationLevelIds),
            is_collection_operation: true,
          },
        });

      const collectionOperationOrganizationlevelsIds =
        collectionOperationOrganizationlevels.map(
          (collectionOperationOrganizationlevel) => {
            return collectionOperationOrganizationlevel?.id;
          }
        );

      const collectionOperations = await this.businessUnitsRepository.find({
        where: {
          organizational_level_id: In(collectionOperationOrganizationlevelsIds),
          is_active: true,
        },
      });

      const collectionOperationIds = collectionOperations.map(
        (collectionOperation) => {
          return collectionOperation?.id;
        }
      );

      collectionOperation = {
        ...collectionOperation,
        collection_operation_id: In(collectionOperationIds),
      };

      if (organization_level_id) {
        organization_level_id = await JSON.parse(organization_level_id);
        const organizationCollectionOperationTypes: any =
          await this.organizationalLevelsRepository.find({
            where: {
              id: In(organization_level_id),
            },
          });

        if (
          !organizationCollectionOperationTypes ||
          organizationCollectionOperationTypes.some(
            (org: any) => org.is_collection_operation !== true
          )
        ) {
          throw new HttpException(
            `is_collection_opeartion is false for at least one element in the array`,
            HttpStatus.BAD_REQUEST
          );
        }

        const userCollectionOperations =
          await this.businessUnitsRepository.find({
            where: {
              organizational_level_id: { id: In(organization_level_id) },
            },
            relations: ['organizational_level_id'],
          });

        const collectionOperationIds = userCollectionOperations.map(
          (operation) => operation.id
        );

        collectionOperation = {
          ...collectionOperation,
          collection_operation_id: In(collectionOperationIds),
        };
      }

      const procedureTypes = await this.procedureTypesRepository.find({
        where: {
          created_by: createdBy,
        },
      });

      const procedureTypesIds = procedureTypes.map((item) => {
        return item?.id;
      });

      const uniqueProcedureTypeIds: any = new Set(procedureTypesIds);
      procedureType = {
        ...procedureType,
        procedure_type_id: In(uniqueProcedureTypeIds),
      };

      if (procedure_type_id) {
        procedureType = {
          ...procedureType,
          procedure_type_id: procedure_type_id,
        };
      }

      const product = await this.productsRepository.find({
        where: {
          created_by: createdBy,
        },
      });

      const productsIds = product.map((item) => {
        return item?.id;
      });

      const procedureTypeProducts =
        await this.procedureTypesProductsRepository.find({
          where: {
            product_id: In(productsIds),
          },
        });

      const productsProcedureTypeIds = procedureTypeProducts.map((item) => {
        return item.procedure_type_id;
      });

      const uniqueProcedureTypeProductIds: any = new Set(
        productsProcedureTypeIds
      );

      productProcedureType = {
        ...productProcedureType,
        procedure_type_id: In(uniqueProcedureTypeProductIds),
      };

      if (product_id) {
        productProcedureType = {
          ...productProcedureType,
          procedure_type_id: product_id,
        };
      }

      if (operation_status_id) {
        operationStatus = {
          ...operationStatus,
          operation_status_id: operation_status_id,
        };
      }

      for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
        const dayOfMonth = day.toISOString().split('T')[0];

        const goalProceduresQuery = await this.dailyGoalsCalendersRepository
          .createQueryBuilder('daily_goals_calender')
          .select('SUM(daily_goals_calender.goal_amount)', 'procedureTypeGaols')
          .where({
            ...procedureType,
            date: dayOfMonth,
            created_by: createdBy,
          })
          .getRawOne();
        const goal_procedures = goalProceduresQuery?.procedureTypeGaols;

        const goalProductsQuery = await this.dailyGoalsCalendersRepository
          .createQueryBuilder('daily_goals_calender')
          .select('SUM(daily_goals_calender.goal_amount)', 'productTypeGaols')
          .where({
            ...productProcedureType,
            date: dayOfMonth,
            created_by: createdBy,
          })
          .getRawOne();
        const goal_products = goalProductsQuery?.productTypeGaols;

        //  procedure type drives
        const procedureTypeShifts =
          await this.shiftsProjectionsStaffRepository.find({
            where: {
              ...procedureType,
            },
          });

        const procedureTypeShiftIds = procedureTypeShifts.map((item) => {
          return item?.shift_id;
        });

        const uniqueProcedureTypeShiftIds: any = new Set(procedureTypeShiftIds);
        const startDate = new Date(`${dayOfMonth} 00:00:00`);
        const endDate = new Date(`${dayOfMonth} 23:59:59`);
        const drivesFromShifts = await this.shiftsRepository.find({
          where: {
            shiftable_type: PolymorphicType.OC_OPERATIONS_DRIVES,
            id: In(uniqueProcedureTypeShiftIds),
            start_time: Between(startDate, endDate),
            end_time: Between(startDate, endDate),
          },
        });

        const procedureDrivesIds = drivesFromShifts.map((item) => {
          return item.shiftable_id;
        });

        const uniqueProcedureDrivesIds: any = new Set(procedureDrivesIds);

        const procedureDrivesQuery = this.drivesRepository
          .createQueryBuilder('drives')
          .where({
            id: In(uniqueProcedureDrivesIds),
            date: dayOfMonth,
          });

        const procedureDrivesCount = await procedureDrivesQuery.getCount();

        //  procedure-type sessions   *****************************************########

        const sessionsFromShifts = await this.shiftsRepository.find({
          where: {
            shiftable_type: PolymorphicType.OC_OPERATIONS_SESSIONS,
            id: In(uniqueProcedureTypeShiftIds),
            start_time: Between(startDate, endDate),
            end_time: Between(startDate, endDate),
          },
        });

        const procedureSessionsIds = sessionsFromShifts.map((item) => {
          return item.shiftable_id;
        });

        const uniqueProcedureSessionsIds: any = new Set(procedureSessionsIds);

        const procedureSessionsQuery = this.sessionsRepository
          .createQueryBuilder('sessions')
          .where({
            id: In(uniqueProcedureSessionsIds),
            date: dayOfMonth,
          });

        const procedureSessionsCount = await procedureSessionsQuery.getCount();

        const scheduled_procedures =
          procedureSessionsCount + procedureDrivesCount;

        // products type  drives      *********************
        const productsProcedureTypeShifts =
          await this.shiftsProjectionsStaffRepository.find({
            where: {
              ...productProcedureType,
            },
          });

        const productProcedureTypeShiftIds = procedureTypeShifts.map((item) => {
          return item?.shift_id;
        });

        const uniqueProductsProcedureTypeShiftIds: any = new Set(
          productProcedureTypeShiftIds
        );

        const prductsDrivesFromShifts = await this.shiftsRepository.find({
          where: {
            shiftable_type: 'drives',
            id: In(uniqueProductsProcedureTypeShiftIds),
            start_time: Between(startDate, endDate),
            end_time: Between(startDate, endDate),
          },
        });

        const productsDrivesIds = prductsDrivesFromShifts.map((item) => {
          return item.shiftable_id;
        });

        const uniqueProductProcedureDrivesIds: any = new Set(productsDrivesIds);

        const productProcedureDrivesQuery = this.drivesRepository
          .createQueryBuilder('drives')
          .where({
            id: In(uniqueProductProcedureDrivesIds),
            date: dayOfMonth,
          });

        const productsProcedureDrivesCount =
          await productProcedureDrivesQuery.getCount();

        // products type  sessions      *********************

        const productsSessionsFromShifts = await this.shiftsRepository.find({
          where: {
            shiftable_type: PolymorphicType.OC_OPERATIONS_SESSIONS,
            id: In(uniqueProductsProcedureTypeShiftIds),
            start_time: Between(startDate, endDate),
            end_time: Between(startDate, endDate),
          },
        });

        const productProcedureSessionsIds = productsSessionsFromShifts.map(
          (item) => {
            return item.shiftable_id;
          }
        );

        const uniqueProductsProcedureSessionsIds: any = new Set(
          productProcedureSessionsIds
        );

        const productProcedureSessionsQuery = this.sessionsRepository
          .createQueryBuilder('sessions')
          .where({
            id: In(uniqueProductsProcedureSessionsIds),
            date: dayOfMonth,
          });

        const productsProcedureSessionsCount =
          await productProcedureSessionsQuery.getCount();

        const scheduled_products =
          productsProcedureDrivesCount + productsProcedureSessionsCount;

        //  actual procedure   ********************************************************************

        const procedureTypeDonations = await this.donorDonationsRepository
          .createQueryBuilder('donations')
          .where({
            donation_type: {
              id: procedureType?.procedure_type_id,
            },
            donation_date: dayOfMonth,
          });

        const actual_procedures = await procedureTypeDonations.getCount();

        //  actual products    ********************************************************************

        const productsDonations = await this.donorDonationsRepository
          .createQueryBuilder('donations')
          .where({
            donation_type: {
              id: productProcedureType?.procedure_type_id,
            },
            donation_date: dayOfMonth,
          });

        const actual_products = await productsDonations.getCount();

        // for total drives and sessions
        const drivesQuery = this.drivesRepository
          .createQueryBuilder('drives')
          .leftJoinAndSelect('drives.created_by', 'created_by')
          .where({
            tenant: user.tenant,
            is_archived: false,
            date: dayOfMonth,
            created_by: createdBy,
            ...operationStatus,
          });

        const drivesCount = await drivesQuery.getCount();

        const sessionsCountQuery = this.sessionsRepository
          .createQueryBuilder('sessions')
          .leftJoinAndSelect('sessions.created_by', 'created_by')
          .where({
            tenant: user.tenant,
            is_archived: false,
            date: dayOfMonth,
            created_by: createdBy,
            ...operationStatus,
          });

        const sessionsCount = await sessionsCountQuery.getCount();

        let status_id: any = {};
        if (operationStatus && operationStatus.operation_status_id) {
          status_id = {
            ...status_id,
            status_id: operationStatus.operation_status_id,
          };
        }

        const nceCountQuery = this.nonCollectionEventsRepository
          .createQueryBuilder('non_collection_events')
          .leftJoinAndSelect('non_collection_events.created_by', 'created_by')
          .where({
            tenant_id: user.tenant,
            is_archived: false,
            date: dayOfMonth,
            created_by: createdBy,
            ...status_id,
            ...collectionOperation,
          });

        const nceCount = await nceCountQuery.getCount();

        const totalStaffCountQuery = this.staffRepository
          .createQueryBuilder('staff')
          .leftJoinAndSelect('staff.created_by', 'created_by')
          .leftJoinAndSelect('staff.tenant_id', 'tenant_id')
          .where({
            tenant_id: { id: user.tenant.id },
            is_archived: false,
            created_by: createdBy,
          });

        const totalStaffCount = await totalStaffCountQuery.getCount();

        let collectionOperationId = {};

        if (
          collectionOperation &&
          collectionOperation.collection_operation_id
        ) {
          collectionOperationId = {
            ...collectionOperationId,
            collection_operation: collectionOperation.collection_operation_id,
          };
        }

        const totalDeviceCountQuery = this.deviceRepository
          .createQueryBuilder('device')
          .leftJoinAndSelect('device.created_by', 'created_by')
          .where({
            tenant: user.tenant,
            is_archived: false,
            created_by: createdBy,
            ...collectionOperationId,
          });

        const totalDeviceCount = await totalDeviceCountQuery.getCount();

        const totalVehicleCountQuery = this.vehicleRepository
          .createQueryBuilder('vehicle')
          .leftJoinAndSelect('vehicle.created_by', 'created_by')
          .where({
            tenant: user.tenant,
            is_archived: false,
            created_by: createdBy,
            ...collectionOperation,
          });

        const totalVehicleCount = await totalVehicleCountQuery.getCount();

        const staffs = await this.staffRepository.find({
          where: {
            tenant_id: { id: user.tenant.id },
            is_archived: false,
            created_by: createdBy,
          },
          relations: ['created_by', 'tenant_id'],
        });

        const staff_ids = staffs.map((staff) => {
          return staff.id;
        });

        const availableDevices = await this.deviceRepository.find({
          where: {
            tenant: user.tenant,
            is_archived: false,
            created_by: createdBy,
          },
        });

        const devicesIds = availableDevices.map((device) => {
          return device.id;
        });

        const bookedDeviceCount = await this.shiftsDevicesRepository
          .createQueryBuilder('devices')
          .where({
            device: In(devicesIds),
            is_archived: false,
            created_by: createdBy,
          })
          .getCount();

        const vehicles = await this.vehicleRepository.find({
          where: {
            is_archived: false,
            tenant: user.tenant,
          },
        });

        const vehicleIds = vehicles.map((vehicle) => {
          return vehicle.id;
        });

        const bookedVehicleCount = await this.shiftsVehiclesRepository
          .createQueryBuilder('shift_vehicles')
          .where({
            vehicle_id: In(vehicleIds),
          })
          .getCount();

        // dummy data for frontend integation
        const net_total_shared_staff = 10;
        const net_total_shared_devices = 5;
        const net_total_shared_vehicles = 5;

        ///  final response count
        countData = {
          date: dayOfMonth,

          total_drives: drivesCount,
          total_sessions: sessionsCount,
          total_events: nceCount,
          goal_products: +goal_products,
          goal_procedures: +goal_procedures,
          scheduled_products,
          scheduled_procedures,
          actual_products,
          actual_procedures,
          net_total_shared_staff,
          net_total_shared_devices,
          net_total_shared_vehicles,
        };

        const driveQuery = this.drivesRepository
          .createQueryBuilder('drives')
          .select(
            `(  SELECT JSON_BUILD_OBJECT(
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
                'name',operations_status.name,
                'chip_color',operations_status.chip_color

              ) From operations_status WHERE operations_status.id = drives.operation_status_id ),
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
          .addSelect(
            `(SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'name', tasks.task_name
              )
            ) AS task_names
            FROM tasks
            WHERE tasks.taskable_id = drives.id AND tasks.taskable_type = '${PolymorphicType.OC_OPERATIONS_DRIVES}'
            )`
          )
          .addSelect(
            `(
          SELECT JSON_BUILD_OBJECT(
            'first_name', "user"."first_name",
            'last_name', "user"."last_name"
          )
          FROM "user"
          WHERE "user"."id" = drives.recruiter_id
      )`,
            'recruiter'
          )
          .addSelect(
            `(
          SELECT COUNT(*)
          FROM shifts
          WHERE shifts.shiftable_id = drives.id
          AND shifts.shiftable_type = '${PolymorphicType.OC_OPERATIONS_DRIVES}'
      )`,
            'shifts'
          )

          .addSelect(
            `(
              SELECT JSON_BUILD_OBJECT(
                  'earliest_shift_start_time', MIN(shifts.start_time),
                  'latest_shift_return_time', MAX(shifts.end_time),
                  'shifts', COUNT(*),
                  'total_oef_products', SUM(shifts.oef_products),
                  'total_oef_procedures', SUM(shifts.oef_procedures)
              )
              FROM shifts
              WHERE shifts.shiftable_id = drives.id
              AND shifts.shiftable_type = '${PolymorphicType.OC_OPERATIONS_DRIVES}'
          )`,
            'shifts_data'
          )
          .addSelect(
            `(
          SELECT JSON_AGG(JSON_BUILD_OBJECT(
            'short_name', vehicle.short_name
          ))
          FROM shifts
          LEFT JOIN shifts_vehicles ON shifts.id = shifts_vehicles.shift_id
          LEFT JOIN vehicle ON shifts_vehicles.vehicle_id = vehicle.id
          WHERE shifts.shiftable_id = drives.id
          AND shifts.shiftable_type = '${PolymorphicType.OC_OPERATIONS_DRIVES}'
        )`,
            'vehicles'
          )
          .addSelect(
            `(
        SELECT JSON_BUILD_OBJECT(
            'total_procedure_type_qty', COALESCE(SUM(shifts_projections_staff.procedure_type_qty), 0),
            'total_product_yield', COALESCE(SUM(shifts_projections_staff.product_yield), 0),
            'staff_count', COALESCE(SUM(staff_config.qty), 0),
            'vehicle_count', COALESCE(COUNT(shifts_vehicles.vehicle_id), 0),
            'device_count', COALESCE(COUNT(shifts_devices.device_id), 0)
        ) AS projections
        FROM shifts
        LEFT JOIN shifts_projections_staff ON shifts.id = shifts_projections_staff.shift_id
        LEFT JOIN staff_setup ON shifts_projections_staff.staff_setup_id = staff_setup.id
        LEFT JOIN staff_config ON staff_setup.id = staff_config.staff_setup_id
        LEFT JOIN shifts_vehicles ON shifts.id = shifts_vehicles.shift_id
        LEFT JOIN shifts_devices ON shifts.id = shifts_devices.shift_id
        WHERE shifts.shiftable_id = drives.id AND shifts.shiftable_type = '${PolymorphicType.OC_OPERATIONS_DRIVES}'
    ) AS projections`
          )

          .addSelect(
            `(
          SELECT JSON_AGG(total_quantity)
          FROM (
            SELECT SUM(shifts_roles.quantity) as total_quantity
            FROM shifts_roles
            LEFT JOIN shifts ON shifts.id = shifts_roles.shift_id
            WHERE shifts.shiftable_id = drives.id
            AND shifts.shiftable_type = '${PolymorphicType.OC_OPERATIONS_DRIVES}'
            GROUP BY shifts.id
          ) AS subquery
        )`,
            'staff_setups_count'
          )
          .leftJoin('drives.account', 'account')
          .leftJoin('drives.location', 'crm_locations')
          .where(
            `drives.is_archived = false AND drives.date = '${dayOfMonth}' ${
              operation_status_id
                ? `AND drives.operation_status_id = ${operationStatus.operation_status_id}`
                : ''
            }`
          )
          .orderBy('drives.id', 'DESC')
          .getQuery();

        const drives = await this.drivesRepository.query(driveQuery);

        // Calculate the sum of staff_count for all drives
        const totalDrivesStaffCount = drives.reduce((sum, drive) => {
          if (
            drive.projections &&
            drive.projections.staff_count !== undefined
          ) {
            return sum + drive.projections.staff_count;
          }
          return sum;
        }, 0);
        // Calculate the sum of staff_count for all drives
        const totalDrivesVehicleCount = drives.reduce((sum, drive) => {
          if (
            drive.projections &&
            drive.projections.vehicle_count !== undefined
          ) {
            return sum + drive.projections.vehicle_count;
          }
          return sum;
        }, 0);

        const totalDrivesDevicesCount = drives.reduce((sum, drive) => {
          if (
            drive.projections &&
            drive.projections.device_count !== undefined
          ) {
            return sum + drive.projections.device_count;
          }
          return sum;
        }, 0);

        const sessionsQuery = this.sessionsRepository
          .createQueryBuilder('sessions')
          .leftJoinAndSelect(
            'sessions.donor_center',
            'dc',
            'dc.is_archived = false'
          )
          .leftJoinAndSelect(
            'sessions.operation_status',
            'oc',
            'oc.is_archived = false'
          )
          .addSelect(
            `(SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'name', tasks.task_name
              )
            )
            FROM tasks
            WHERE tasks.taskable_id = sessions.id AND tasks.taskable_type = '${PolymorphicType.OC_OPERATIONS_SESSIONS}'
            )`,
            'task_names'
          )
          .addSelect(
            `(
            SELECT JSON_BUILD_OBJECT(
              'earliest_shift_start_time', MIN(shifts.start_time),
              'latest_shift_return_time', MAX(shifts.end_time),
              'shifts', COUNT(*),
              'total_oef_products', SUM(shifts.oef_products),
                  'total_oef_procedures', SUM(shifts.oef_procedures)
          )
          FROM shifts
          WHERE shifts.shiftable_id = sessions.id
          AND shifts.shiftable_type = '${PolymorphicType.OC_OPERATIONS_SESSIONS}'
        )`,
            'shifts_data'
          )

          .addSelect(
            `(
      SELECT JSON_BUILD_OBJECT(
          'total_procedure_type_qty', COALESCE(SUM(shifts_projections_staff.procedure_type_qty), 0),
          'total_product_yield', COALESCE(SUM(shifts_projections_staff.product_yield), 0),
          'staff_count', COALESCE(SUM(staff_config.qty), 0),
          'vehicle_count', COALESCE(COUNT(shifts_vehicles.vehicle_id), 0),
          'device_count', COALESCE(COUNT(shifts_devices.device_id), 0)
      ) AS projections
      FROM shifts
      LEFT JOIN shifts_projections_staff ON shifts.id = shifts_projections_staff.shift_id
      LEFT JOIN staff_setup ON shifts_projections_staff.staff_setup_id = staff_setup.id
      LEFT JOIN staff_config ON staff_setup.id = staff_config.staff_setup_id
      LEFT JOIN shifts_vehicles ON shifts.id = shifts_vehicles.shift_id
      LEFT JOIN shifts_devices ON shifts.id = shifts_devices.shift_id
      WHERE shifts.shiftable_id = sessions.id AND shifts.shiftable_type = '${PolymorphicType.OC_OPERATIONS_SESSIONS}'
  ) AS projections`
          )
          .addSelect(
            `(
          SELECT JSON_AGG(JSON_BUILD_OBJECT(
            'short_name', vehicle.short_name
          ))
          FROM shifts
          LEFT JOIN shifts_vehicles ON shifts.id = shifts_vehicles.shift_id
          LEFT JOIN vehicle ON shifts_vehicles.vehicle_id = vehicle.id
          WHERE shifts.shiftable_id = sessions.id
          AND shifts.shiftable_type = '${PolymorphicType.OC_OPERATIONS_SESSIONS}'
        )`,
            'vehicles'
          )
          .addSelect(
            `(
          SELECT JSON_AGG(total_quantity)
          FROM (
            SELECT SUM(shifts_roles.quantity) as total_quantity
            FROM shifts_roles
            LEFT JOIN shifts ON shifts.id = shifts_roles.shift_id
            WHERE shifts.shiftable_id = sessions.id
            AND shifts.shiftable_type = '${PolymorphicType.OC_OPERATIONS_SESSIONS}'
            GROUP BY shifts.id
          ) AS subquery
        )`,
            'staff_setups_count'
          )
          .groupBy('sessions.id, dc.id, oc.id')
          .where({
            tenant: user.tenant,
            is_archived: false,
            date: dayOfMonth,
            ...operationStatus,
            ...collectionOperation,
          });

        const sessions = await sessionsQuery.getRawMany();
        const totalSesionsStaffCount = sessions.reduce((sum, drive) => {
          if (
            drive.projections &&
            drive.projections.staff_count !== undefined
          ) {
            return sum + drive.projections.staff_count;
          }
          return sum;
        }, 0);
        // Calculate the sum of staff_count for all drives
        const totalSessionsVehicleCount = sessions.reduce((sum, drive) => {
          if (
            drive.projections &&
            drive.projections.vehicle_count !== undefined
          ) {
            return sum + drive.projections.vehicle_count;
          }
          return sum;
        }, 0);

        const totalSessionsDevicesCount = sessions.reduce((sum, drive) => {
          if (
            drive.projections &&
            drive.projections.device_count !== undefined
          ) {
            return sum + drive.projections.device_count;
          }
          return sum;
        }, 0);

        const collectionOperationIds =
          collectionOperation.collection_operation_id._value;
        const inClause =
          collectionOperationIds.length > 0
            ? `AND oc_non_collection_events.collection_operation_id IN (${collectionOperationIds.join(
                ', '
              )})`
            : '';

        const nceQuery = this.nonCollectionEventsRepository
          .createQueryBuilder('oc_non_collection_events')
          .select([
            'oc_non_collection_events.id AS id',
            'oc_non_collection_events.date AS date',
            'oc_non_collection_events.event_name AS name',
          ])
          .addSelect(
            `(SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'name', tasks.task_name
              )
            ) AS task_names
            FROM tasks
            WHERE tasks.taskable_id = oc_non_collection_events.id AND tasks.taskable_type = '${PolymorphicType.OC_OPERATIONS_NON_COLLECTION_EVENTS}'
            )`
          )
          .addSelect(
            `(
            SELECT JSON_BUILD_OBJECT(
              'earliest_shift_start_time', MIN(shifts.start_time),
              'latest_shift_return_time', MAX(shifts.end_time),
              'shifts', COUNT(*),
              'total_oef_products', SUM(shifts.oef_products),
                  'total_oef_procedures', SUM(shifts.oef_procedures)
          )
          FROM shifts
          WHERE shifts.shiftable_id = oc_non_collection_events.id
          AND shifts.shiftable_type = '${PolymorphicType.OC_OPERATIONS_NON_COLLECTION_EVENTS}'
        )`,
            'shifts_data'
          )

          .addSelect(
            `(
      SELECT JSON_BUILD_OBJECT(
          'total_procedure_type_qty', COALESCE(SUM(shifts_projections_staff.procedure_type_qty), 0),
          'total_product_yield', COALESCE(SUM(shifts_projections_staff.product_yield), 0),
          'staff_count', COALESCE(SUM(staff_config.qty), 0),
          'vehicle_count', COALESCE(COUNT(shifts_vehicles.vehicle_id), 0),
          'device_count', COALESCE(COUNT(shifts_devices.device_id), 0)
      ) AS projections
      FROM shifts
      LEFT JOIN shifts_projections_staff ON shifts.id = shifts_projections_staff.shift_id
      LEFT JOIN staff_setup ON shifts_projections_staff.staff_setup_id = staff_setup.id
      LEFT JOIN staff_config ON staff_setup.id = staff_config.staff_setup_id
      LEFT JOIN shifts_vehicles ON shifts.id = shifts_vehicles.shift_id
      LEFT JOIN shifts_devices ON shifts.id = shifts_devices.shift_id
      WHERE shifts.shiftable_id = oc_non_collection_events.id AND shifts.shiftable_type = '${PolymorphicType.OC_OPERATIONS_NON_COLLECTION_EVENTS}'
  ) AS projections`
          )
          .addSelect(
            `(
          SELECT JSON_AGG(JSON_BUILD_OBJECT(
            'short_name', vehicle.short_name
          ))
          FROM shifts
          LEFT JOIN shifts_vehicles ON shifts.id = shifts_vehicles.shift_id
          LEFT JOIN vehicle ON shifts_vehicles.vehicle_id = vehicle.id
          WHERE shifts.shiftable_id = oc_non_collection_events.id
          AND shifts.shiftable_type = '${PolymorphicType.OC_OPERATIONS_NON_COLLECTION_EVENTS}'
        )`,
            'vehicles'
          )
          .addSelect(
            `(
          SELECT JSON_AGG(total_quantity)
          FROM (
            SELECT SUM(shifts_roles.quantity) as total_quantity
            FROM shifts_roles
            LEFT JOIN shifts ON shifts.id = shifts_roles.shift_id
            WHERE shifts.shiftable_id = oc_non_collection_events.id
            AND shifts.shiftable_type = '${PolymorphicType.OC_OPERATIONS_NON_COLLECTION_EVENTS}'
            GROUP BY shifts.id
          ) AS subquery
        )`,
            'staff_setups_count'
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
          WHERE crm_locations.id = oc_non_collection_events.location_id
      )`,
            'crm_locations'
          )
          .addSelect(
            `(SELECT JSON_BUILD_OBJECT(
            'operation_status_id', (SELECT JSON_BUILD_OBJECT(
              'id', operations_status.id,
              'name', operations_status.name,
              'chip_color',operations_status.chip_color
            ) FROM operations_status WHERE operations_status.id = oc_non_collection_events.status_id)
          )) AS status`
          )
          .addSelect(
            `(SELECT JSON_BUILD_OBJECT(
            'non_collection_profile', (SELECT JSON_BUILD_OBJECT(
              'id', crm_non_collection_profiles.id,
              'name', crm_non_collection_profiles.profile_name
            ) FROM crm_non_collection_profiles WHERE crm_non_collection_profiles.id = oc_non_collection_events.non_collection_profile_id)
          )) AS ncp`
          )

          .where(
            `oc_non_collection_events.is_archived = false AND oc_non_collection_events.date = '${dayOfMonth}' ${inClause} ${
              operation_status_id
                ? `AND oc_non_collection_events.status_id = ${operationStatus.operation_status_id}`
                : ''
            }`
          )
          .orderBy('oc_non_collection_events.id', 'DESC')
          .getQuery();

        const nce = await this.nonCollectionEventsRepository.query(nceQuery);
        const totalNceStaffCount = nce.reduce((sum, drive) => {
          if (
            drive.projections &&
            drive.projections.staff_count !== undefined
          ) {
            return sum + drive.projections.staff_count;
          }
          return sum;
        }, 0);
        // Calculate the sum of staff_count for all drives
        const totalNceVehicleCount = nce.reduce((sum, drive) => {
          if (
            drive.projections &&
            drive.projections.vehicle_count !== undefined
          ) {
            return sum + drive.projections.vehicle_count;
          }
          return sum;
        }, 0);

        const totalNceDevicesCount = nce.reduce((sum, drive) => {
          if (
            drive.projections &&
            drive.projections.device_count !== undefined
          ) {
            return sum + drive.projections.device_count;
          }
          return sum;
        }, 0);
        const booked_staff =
          totalNceStaffCount + totalSesionsStaffCount + totalDrivesStaffCount;
        const devices_booked =
          totalNceDevicesCount +
          totalSessionsDevicesCount +
          totalDrivesDevicesCount;
        const vehicles_booked =
          totalNceVehicleCount +
          totalSessionsVehicleCount +
          totalDrivesVehicleCount;
        const staff_available = totalStaffCount - booked_staff;
        const vehicles_available = totalVehicleCount - vehicles_booked;
        const devices_available = totalDeviceCount - devices_booked;
        response.push({
          ...countData,
          staff_booked: booked_staff,
          devices_booked: devices_booked,
          vehicles_booked: vehicles_booked,
          staff_available: staff_available,
          vehicles_available: vehicles_available,
          devices_available: devices_available,
          nce,
          drives,
          sessions,
        });
      }

      return resSuccess(
        'Monthly Drives fetched successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        response
      );
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Operations-Center Calender Monthly View   >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(
        error.message,
        ErrorConstants.Error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findProcedureTypeProducts(procedureTypeId: any) {
    try {
      const products = await this.procedureTypesRepository
        .createQueryBuilder('procedureType')
        .leftJoinAndSelect('procedureType.products', 'product')
        .where('procedureType.id = :procedureTypeId', { procedureTypeId })
        .getRawMany();
      return resSuccess(
        'Procedure-type-products feteched successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        products
      );
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Operations-Center Calender Monthly View Procedure Type Products   >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(
        error.message,
        ErrorConstants.Error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
