import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  Inject,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, ILike, In } from 'typeorm';
import * as dotenv from 'dotenv';
/* StaffSetup */
import {
  CreateStaffSetupDto,
  UpdateStaffSetupDto,
} from '../dto/create-staffSetup.dto';
import {
  CreateStaffConfigDto,
  UpdateStaffConfigDto,
} from '../dto/create-staffConfig.dto';
import { StaffSetup } from '../entity/staffSetup.entity';
import { StaffSetupHistory } from '../entity/staffSetupHistory.entity';
import { StaffConfig } from '../entity/StaffConfig.entity';
import { StaffConfigHistory } from '../entity/StaffConfigHistory.entity';
import {
  GetStaffSetupsBluePrintParamsInterface,
  GetStaffSetupsByIdsInterface,
  GetStaffSetupsDriveParamsInterface,
  GetStaffSetupsParamsInterface,
} from '../interface/StaffSetupsParams';
/* others */
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { User } from '../../../user-administration/user/entity/user.entity';
import { ProcedureTypes } from '../../../organizational-administration/products-procedures/procedure-types/entities/procedure-types.entity';
import { HistoryService } from 'src/api/common/services/history.service';
import { getModifiedDataDetails } from '../../../../../../common/utils/modified_by_detail';
import { UserRequest } from 'src/common/interface/request';
import { REQUEST } from '@nestjs/core';
import { ContactsRoles } from '../../../crm-administration/contacts/role/entities/contacts-role.entity';
import { DailyCapacity } from '../../../operations-administration/booking-drives/daily-capacity/entities/daily-capacity.entity';
import moment from 'moment';
import { shiftable_type_enum } from 'src/api/shifts/enum/shifts.enum';
import { Drives } from 'src/api/operations-center/operations/drives/entities/drives.entity';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';

dotenv.config();
@Injectable({ scope: Scope.REQUEST })
export class StaffSetupService extends HistoryService<StaffSetupHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    /* staff-setup */
    @InjectRepository(StaffSetup)
    private readonly staffSetupRepository: Repository<StaffSetup>,
    @InjectRepository(StaffSetupHistory)
    private readonly staffSetupHistoryRepository: Repository<StaffSetupHistory>,
    @InjectRepository(StaffConfig)
    private readonly staffConfigRepository: Repository<StaffConfig>,
    @InjectRepository(StaffConfigHistory)
    private readonly staffConfigHistoryRepository: Repository<StaffConfigHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ContactsRoles)
    private readonly contactRoleRepository: Repository<ContactsRoles>,
    @InjectRepository(ProcedureTypes)
    private readonly procedureRepository: Repository<ProcedureTypes>,
    @InjectRepository(DailyCapacity)
    private readonly dailyCapacityRepo: Repository<DailyCapacity>,
    @InjectRepository(Drives)
    private readonly drivesRepository: Repository<Drives>,
    @InjectRepository(Shifts)
    private readonly shiftsRepo: Repository<Shifts>,
    private readonly entityManager: EntityManager
  ) {
    super(staffSetupHistoryRepository);
  }
  /* create-staff-config */
  async createStaffConfig(
    createStaffConfigDto: CreateStaffConfigDto[],
    id: any
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const staffConfig = [];
      for (const config in createStaffConfigDto) {
        const temp_config = new StaffConfig();
        const configData = createStaffConfigDto[config] as CreateStaffConfigDto;
        temp_config.qty = configData?.qty;
        temp_config.lead_time = configData?.lead_time;
        temp_config.setup_time = configData?.setup_time;
        temp_config.breakdown_time = configData?.breakdown_time;
        temp_config.wrapup_time = configData?.wrapup_time;
        temp_config.contact_role_id = configData?.role_id;
        temp_config.staff_setup_id = id;
        temp_config.tenant = this.request.user?.tenant;
        staffConfig.push(temp_config);
      }
      if (staffConfig?.length > 0) {
        const response = await this.staffConfigRepository.save(staffConfig);
        return { response };
      } else {
        await queryRunner.rollbackTransaction();
        return resError(
          'Could not add staff configuration',
          ErrorConstants.Error,
          400
        );
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
  /* create staff-setup */
  async create(createStaffSetupDto: CreateStaffSetupDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      /* user */
      const user = await this.userRepository.findOneBy({
        id: createStaffSetupDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      /* procedure */
      const procedure = await this.procedureRepository.findOneBy({
        id: createStaffSetupDto?.staff?.procedure_type_id,
      });
      if (!procedure) {
        throw new HttpException(
          `Procedure Type not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      /* roles */
      const roleIds = createStaffSetupDto?.staff_configuration?.map(
        (item) => item?.role_id
      );
      const role = await this.contactRoleRepository.findBy({
        id: In(roleIds),
      });
      if (role?.length < 1) {
        throw new HttpException(
          `Some Contact Roles not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      /* create staff setup */
      const staffSetup: any = new StaffSetup();
      staffSetup.is_active = createStaffSetupDto?.is_active;
      staffSetup.created_by = createStaffSetupDto?.created_by;
      staffSetup.name = createStaffSetupDto?.staff?.name;
      staffSetup.short_name = createStaffSetupDto?.staff?.short_name;
      staffSetup.beds = createStaffSetupDto?.staff?.beds;
      staffSetup.concurrent_beds = createStaffSetupDto?.staff?.concurrent_beds;
      staffSetup.stagger_slots = createStaffSetupDto?.staff?.stagger_slots;
      staffSetup.procedure_type_id =
        createStaffSetupDto?.staff?.procedure_type_id;
      staffSetup.opeartion_type_id =
        createStaffSetupDto?.staff?.opeartion_type_id;
      staffSetup.location_type_id =
        createStaffSetupDto?.staff?.location_type_id;
      staffSetup.tenant = this.request.user?.tenant;

      const response = await this.staffSetupRepository.save(staffSetup);
      const resp = await this.createStaffConfig(
        createStaffSetupDto?.staff_configuration,
        response?.id
      );
      const modifyResp = {
        id: response?.id,
        staff: {
          name: response?.name,
          short_name: response?.short_name,
          beds: response?.beds,
          concurrent_beds: response?.concurrent_beds,
          stagger_slots: response?.stagger_slots,
          procedure_type_id: response?.procedure_type_id,
          opeartion_type_id: response?.opeartion_type_id,
          location_type_id: response?.location_type_id,
        },
        staff_configuration: resp?.response,
        status: response?.is_active,
        is_archived: response?.is_archived,
        created_by: response?.created_by,
        created_at: response?.created_at,
      };

      return resSuccess(
        'Staff Setup Created Successfully', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        modifyResp
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      return { error };
    } finally {
      await queryRunner.release();
    }
  }
  /* get all staff setups */
  async getAllStaffetups(queryParams: GetStaffSetupsParamsInterface) {
    try {
      const limit = Number(queryParams?.limit);
      const page = Number(queryParams?.page);
      const name = queryParams?.name;
      const getTotalPage = (totalData: number, limit: number) => {
        return Math.ceil(totalData / limit);
      };
      if (page <= 0) {
        throw new HttpException(
          `page must of positive integer`,
          HttpStatus.BAD_REQUEST
        );
      }
      const where: any = {};

      Object.assign(where, {
        tenant: { id: this.request.user?.tenant?.id },
      });

      where.is_archived = false;
      if (name !== undefined) {
        where.name = ILike(`%${name}%`);
      }
      if (queryParams?.status !== undefined) {
        where.is_active = queryParams?.status.toLocaleLowerCase();
      }
      if (queryParams?.operation_type !== undefined) {
        where.opeartion_type_id = queryParams?.operation_type;
      }
      if (queryParams?.location_type !== undefined) {
        where.location_type_id = queryParams?.location_type;
      }
      const sorting: { [key: string]: 'ASC' | 'DESC' } = {};
      if (queryParams?.sortName && queryParams?.sortOrder) {
        if (queryParams?.sortName !== 'procedure_type_id')
          sorting[queryParams?.sortName] =
            queryParams?.sortOrder.toUpperCase() as 'ASC' | 'DESC';
      } else {
        sorting['id'] = 'DESC';
      }
      const [records, count] = await this.staffSetupRepository.findAndCount({
        where,
        take: limit,
        skip: (page - 1) * limit,
        relations: ['procedure_type_id', 'created_by'],
        order: sorting,
      });
      if (queryParams?.sortName === 'procedure_type_id') {
        records.sort((a, b) => {
          const nameA = a.procedure_type_id.name.toUpperCase();
          const nameB = b.procedure_type_id.name.toUpperCase();

          let comparison = 0;

          if (nameA < nameB) {
            comparison = -1;
          } else if (nameA > nameB) {
            comparison = 1;
          }

          return queryParams?.sortOrder === 'ASC' ? comparison : -comparison; // Reverse the comparison for DESC
        });
      }
      return {
        total_records: count,
        page_number: page,
        totalPage: getTotalPage(count, limit),
        data: records,
      };
    } catch (error) {
      return [];
    }
  }

  /* get all staff setups */
  async getAllStaffSetupForDrive(
    queryParams: GetStaffSetupsDriveParamsInterface
  ) {
    try {
      if (
        queryParams?.operation_type &&
        queryParams?.location_type &&
        queryParams?.procedure_type_id &&
        queryParams?.collectionOperation &&
        queryParams?.drive_date
      ) {
        const daily_capacities = await this.dailyCapacityRepo
          .createQueryBuilder('daily_capacity')
          .innerJoinAndSelect(
            'daily_capacity.collection_operation',
            'business_units'
          )
          .where('business_units.id = :businessUnitId', {
            businessUnitId: queryParams.collectionOperation,
          })
          .getOne();

        if (daily_capacities) {
          const driveDate = moment(queryParams.drive_date);
          const dayName = driveDate.format('dddd');

          const abbreviations = {
            Sunday: 'sun',
            Monday: 'mon',
            Tuesday: 'tue',
            Wednesday: 'wed',
            Thursday: 'thur',
            Friday: 'fri',
            Saturday: 'sat',
          };
          const driveDay = abbreviations[dayName];
          const maxDrives = daily_capacities[`${driveDay}_max_drives`];
          const maxStaff = daily_capacities[`${driveDay}_max_staff`];

          console.log({ driveDay, maxDrives, maxStaff });
          const drivesOnDriveDate = await this.drivesRepository.find({
            select: ['id'],
            relations: ['account'],
            where: {
              date: new Date(moment(driveDate).format('YYYY-MM-DD')),
              account: {
                collection_operation: {
                  id: queryParams.collectionOperation,
                },
              },
            },
          });

          const driveIds = drivesOnDriveDate?.map((item) => item.id);
          console.log({ driveIds });
          const driveStaffSetupDetails: any = await this.shiftsRepo.find({
            where: {
              shiftable_id: In(driveIds),
              shiftable_type: shiftable_type_enum.DRIVES,
            },
            relations: [
              'staff_setups',
              'staff_setups.staff_setup_id',
              'staff_setups.staff_setup_id.staff_configuration',
              'staff_setups.staff_setup_id.staff_configuration.contact_role_id',
            ],
          });

          let utilizedStaff = 0;
          for (const drive of driveStaffSetupDetails) {
            const driveStaffSetups = drive.staff_setups;
            for (const staffSetupItem of driveStaffSetups) {
              for (const staffConfig of staffSetupItem.staff_setup_id
                .staff_configuration) {
                const qty = staffConfig.qty;
                const oef = staffConfig.contact_role_id.oef_contribution;
                utilizedStaff += (parseInt(qty) * parseFloat(oef)) / 100;
              }
            }
          }
          let availableStaff = 0;
          console.log('====', { utilizedStaff, maxStaff });
          if (utilizedStaff < maxStaff) {
            availableStaff = maxStaff - utilizedStaff;
          }
          if (availableStaff >= queryParams?.minStaff) {
            const query = `
            SELECT
              staff_setup.*,
              SUM((contacts_roles.oef_contribution * staff_config.qty) / 100) AS sumStaffQty
            FROM
              staff_setup
            LEFT JOIN
              staff_config ON staff_setup.id = staff_config.staff_setup_id
            LEFT JOIN
              contacts_roles ON staff_config.contact_role_id = contacts_roles.id
            WHERE staff_setup.opeartion_type_id = '${
              queryParams?.operation_type
            }' 
            AND staff_setup.procedure_type_id = ${
              queryParams?.procedure_type_id
            }
            AND staff_setup.location_type_id = '${queryParams?.location_type?.toUpperCase()}'
            AND staff_setup.tenant_id = ${this.request.user?.tenant?.id}
            AND staff_setup.is_active = ${true}
            AND staff_setup.is_archived = ${false}
            GROUP BY
              staff_setup.id
            HAVING
              SUM((contacts_roles.oef_contribution * staff_config.qty) / 100) > 0 AND
              SUM((contacts_roles.oef_contribution * staff_config.qty) / 100) BETWEEN ${
                queryParams.minStaff
              } AND ${queryParams.maxStaff}
          `;

            const result = await this.entityManager.query(query);
            const allowedIds = result?.map((item) => item.id);

            let queryAdditionalStaffSetups;
            if (allowedIds.length) {
              queryAdditionalStaffSetups = `
            SELECT
              staff_setup.*,
              SUM(contacts_roles.oef_contribution * staff_config.qty / 100) AS sumStaffQty
            FROM
              staff_setup
            LEFT JOIN
              staff_config ON staff_setup.id = staff_config.staff_setup_id
            LEFT JOIN
              contacts_roles ON staff_config.contact_role_id = contacts_roles.id
            WHERE staff_setup.opeartion_type_id = '${
              queryParams?.operation_type
            }' 
            AND staff_setup.location_type_id = '${queryParams?.location_type?.toUpperCase()}'
            AND staff_setup.procedure_type_id = ${
              queryParams?.procedure_type_id
            }
            AND staff_setup.tenant_id = ${this.request.user?.tenant?.id}
            AND staff_setup.is_active = ${true}
            AND staff_setup.is_archived = ${false}
            AND staff_setup.id Not In (${allowedIds.join(',')})
            GROUP BY
            staff_setup.id
          `;
            } else {
              queryAdditionalStaffSetups = `
              SELECT
                staff_setup.*,
                SUM(contacts_roles.oef_contribution * staff_config.qty / 100) AS sumStaffQty
              FROM
                staff_setup
              LEFT JOIN
                staff_config ON staff_setup.id = staff_config.staff_setup_id
              LEFT JOIN
                contacts_roles ON staff_config.contact_role_id = contacts_roles.id
              WHERE staff_setup.opeartion_type_id = '${
                queryParams?.operation_type
              }' 
              AND staff_setup.location_type_id = '${queryParams?.location_type?.toUpperCase()}'
              AND staff_setup.procedure_type_id = ${
                queryParams?.procedure_type_id
              }
              AND staff_setup.tenant_id = ${this.request.user?.tenant?.id}
              AND staff_setup.is_active = ${true}
              AND staff_setup.is_archived = ${false}
              GROUP BY
              staff_setup.id
            `;
            }

            let additionalStaffSetups = [];
            if (this?.request?.user?.override) {
              additionalStaffSetups = await this.entityManager.query(
                queryAdditionalStaffSetups
              );
            }
            return {
              data: result,
              additionalStaffSetups,
            };
          } else {
            console.log('hello');
            return {
              data: [],
              additionalStaffSetups: [],
            };
          }
        }
      } else {
        return {
          data: [],
          additionalStaffSetups: [],
        };
      }
    } catch (error) {
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  /* get all staff setups for blue print donor center */
  async getAllStaffSetupForDonorCenterBluePrint(
    queryParams: GetStaffSetupsBluePrintParamsInterface
  ) {
    try {
      if (queryParams?.operation_type && queryParams?.procedure_type_id) {
        const query = `
        SELECT
          staff_setup.*,
          SUM((contacts_roles.oef_contribution * staff_config.qty) / 100) AS sumStaffQty
        FROM
          staff_setup
        LEFT JOIN
          staff_config ON staff_setup.id = staff_config.staff_setup_id
        LEFT JOIN
          contacts_roles ON staff_config.contact_role_id = contacts_roles.id
        WHERE staff_setup.opeartion_type_id = '${queryParams?.operation_type}' 
        AND staff_setup.procedure_type_id = ${queryParams?.procedure_type_id}
        AND staff_setup.tenant_id = ${this.request.user?.tenant?.id}
        AND staff_setup.is_active = ${true}
        AND staff_setup.is_archived = ${false}
        GROUP BY
          staff_setup.id
        HAVING
          SUM((contacts_roles.oef_contribution * staff_config.qty) / 100) > 0 AND
          SUM((contacts_roles.oef_contribution * staff_config.qty) / 100) BETWEEN ${
            queryParams.minStaff
          } AND ${queryParams.maxStaff}
      `;

        const result = await this.entityManager.query(query);
        return {
          data: result,
        };
      } else {
        return {
          data: [],
          additionalStaffSetups: [],
        };
      }
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
      console.log({ error });
    }
  }
  /* get by id */
  async getStaffSetup(id: any) {
    const StaffSetup = await this.staffSetupRepository.findOne({
      where: { id, is_archived: false },
      relations: {
        created_by: true,
        procedure_type_id: true,
        staff_configuration: {
          contact_role_id: true,
        },
      },
    });

    if (!StaffSetup) {
      throw new NotFoundException('StaffSetup not found');
    }

    const modifiedData: any = await getModifiedDataDetails(
      this.staffSetupHistoryRepository,
      id,
      this.userRepository
    );

    return {
      id: StaffSetup?.id,
      staff: {
        name: StaffSetup?.name,
        short_name: StaffSetup?.short_name,
        beds: StaffSetup?.beds,
        concurrent_beds: StaffSetup?.concurrent_beds,
        stagger_slots: StaffSetup?.stagger_slots,
        opeartion_type_id: StaffSetup?.opeartion_type_id,
        location_type_id: StaffSetup?.location_type_id,
        procedure_type_id: StaffSetup?.procedure_type_id,
      },
      staff_configuration: StaffSetup?.staff_configuration,
      status: StaffSetup?.is_active,
      is_archived: StaffSetup?.is_archived,
      created_at: StaffSetup?.created_at,
      created_by: StaffSetup?.created_by,
      ...modifiedData,
    };
  }

  // get many by ids
  async getStaffSetupsById(params: GetStaffSetupsByIdsInterface) {
    const ids = Array.from(params.ids.split(','));
    const parsedIds = ids?.map((item) => parseInt(item));
    const StaffSetup = await this.staffSetupRepository.find({
      where: {
        id: In(parsedIds),
        is_archived: false,
      },
      relations: {
        staff_configuration: {
          contact_role_id: true,
        },
      },
    });

    if (StaffSetup.length !== parsedIds.length) {
      throw new HttpException(
        'Some StaffSetups not found',
        HttpStatus.BAD_REQUEST
      );
    }

    return resSuccess(
      'Staff setups found successfulyy',
      'success',
      200,
      StaffSetup
    );
  }
  /* update staff config history */
  async updateStaffConfigHistory(createStaffConfigDto: UpdateStaffConfigDto[]) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const staffConfig = [];
      for (const config in createStaffConfigDto) {
        const temp_config = new StaffConfigHistory();
        const configData = createStaffConfigDto[config] as UpdateStaffConfigDto;
        temp_config.qty = configData?.qty;
        temp_config.lead_time = configData?.lead_time;
        temp_config.setup_time = configData?.setup_time;
        temp_config.breakdown_time = configData?.breakdown_time;
        temp_config.wrapup_time = configData?.wrapup_time;
        temp_config.contact_role_id = configData?.role_id;
        temp_config.staff_config_id = configData?.id;
        temp_config.tenant_id = this.request.user?.tenant?.id;
        staffConfig.push(temp_config);
      }

      if (staffConfig?.length > 0) {
        await this.staffConfigHistoryRepository.save(staffConfig);
      } else {
        await queryRunner.rollbackTransaction();
        throw new Error('History storation failed!');
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('History storation failed!');
    } finally {
      await queryRunner.release();
    }
  }
  /* archive staff :id */
  async arhiveStaffSetup(id: any, updated_by: any, created_by: any) {
    const staffSetup = await this.staffSetupRepository.findOne({
      where: { id, is_archived: false },
      relations: ['created_by', 'tenant'],
    });

    if (!staffSetup) {
      throw new NotFoundException('Staff Setup not found');
    }
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.staffSetupRepository.save({
        ...staffSetup,
        is_archived: true,
      });

      const staffSetupHistory = new StaffSetupHistory();
      Object.assign(staffSetupHistory, staffSetup);
      staffSetupHistory.history_reason = 'C';
      staffSetupHistory.created_by = updated_by;
      staffSetupHistory.tenant_id = staffSetup?.tenant?.id;
      delete staffSetupHistory?.created_at;
      await this.createHistory(staffSetupHistory);
      staffSetupHistory.history_reason = 'D';
      await this.createHistory(staffSetupHistory);

      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'StaffSetup Archived.',
        status_code: 204,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      await queryRunner.release();
    }
  }
  /* update staff config */
  async updateStaffConfig(
    createStaffConfigDto: UpdateStaffConfigDto[],
    staff_id: any
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      const old_data = await this.staffConfigRepository.delete({
        staff_setup_id: staff_id,
      });
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const staffConfig = [];
      let historyConfig = createStaffConfigDto.map((obj) => ({ ...obj }));
      historyConfig = historyConfig.filter((item) => item.id != null);
      await this.updateStaffConfigHistory(historyConfig);
      for (const config in createStaffConfigDto) {
        const temp_config = new StaffConfig();
        const configData = createStaffConfigDto[config] as UpdateStaffConfigDto;
        temp_config.qty = configData?.qty;
        temp_config.lead_time = configData?.lead_time;
        temp_config.setup_time = configData?.setup_time;
        temp_config.breakdown_time = configData?.breakdown_time;
        temp_config.wrapup_time = configData?.wrapup_time;
        temp_config.contact_role_id = configData?.role_id;
        temp_config.tenant = this.request.user?.tenant;
        temp_config.staff_setup_id = staff_id;
        temp_config.tenant = this.request.user?.tenant;
        if (configData?.id) {
          temp_config.id = configData?.id;
        }
        staffConfig.push(temp_config);
      }
      if (staffConfig?.length > 0) {
        const response = await this.staffConfigRepository.save(staffConfig);
        return { response };
      } else {
        await queryRunner.rollbackTransaction();
        return resError(
          'Could not add staff configuration',
          ErrorConstants.Error,
          400
        );
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
  /* update staff :id */
  async updateStaffFetup(id: any, body: UpdateStaffSetupDto) {
    const staffSetup = await this.staffSetupRepository.findOne({
      where: { id, is_archived: false },
      relations: ['staff_configuration', 'tenant'],
    });

    if (!staffSetup) {
      throw new NotFoundException('Staff Setup not found');
    }
    /* user */
    const user = await this.userRepository.findOneBy({
      id: body?.created_by,
    });
    if (!user) {
      throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
    }
    /* procedure */
    const procedure = await this.procedureRepository.findOneBy({
      id: body?.staff?.procedure_type_id,
    });
    if (!procedure) {
      throw new HttpException(
        `Procedure Type not found.`,
        HttpStatus.NOT_FOUND
      );
    }
    /* roles */
    const roleIds = body?.staff_configuration?.map((item) => item?.role_id);
    const role = await this.contactRoleRepository.findBy({
      id: In(roleIds),
    });
    if (role?.length < 1) {
      throw new HttpException(
        `Some Contact Roles not found.`,
        HttpStatus.NOT_FOUND
      );
    }
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      /* update staff setup */
      const dataToUpdate = {
        is_active: body?.is_active,
        name: body?.staff?.name,
        short_name: body?.staff?.short_name,
        beds: body?.staff?.beds,
        concurrent_beds: body?.staff?.concurrent_beds,
        stagger_slots: body?.staff?.stagger_slots,
        procedure_type_id: body?.staff?.procedure_type_id,
        opeartion_type_id: body?.staff?.opeartion_type_id,
        location_type_id: body?.staff?.location_type_id,
      };
      await this.staffSetupRepository.update({ id: id }, dataToUpdate as any);

      const staffSetupHistory = new StaffSetupHistory();
      Object.assign(staffSetupHistory, staffSetup);
      staffSetupHistory.history_reason = 'C';
      staffSetupHistory.created_by = body?.updated_by;
      staffSetupHistory.tenant_id = staffSetup.tenant?.id;
      delete staffSetupHistory?.created_at;
      await this.createHistory(staffSetupHistory);

      await this.updateStaffConfig(body.staff_configuration, id);
      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'StaffSetup Updated.',
        status_code: 204,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      await queryRunner.release();
    }
  }
}
