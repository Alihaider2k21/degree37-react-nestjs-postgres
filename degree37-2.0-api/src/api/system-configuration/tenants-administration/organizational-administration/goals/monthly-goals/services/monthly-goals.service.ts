import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, In, Raw, Not, Between } from 'typeorm';
import {
  CreateMonthlyGoalsDto,
  UpdateMonthlyGoalsDto,
} from '../dto/create-monthly-goals.dto';
import { ErrorConstants } from '../../../../../constants/error.constants';
import { resError } from '../../../../../helpers/response';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { ProcedureTypes } from '../../../products-procedures/procedure-types/entities/procedure-types.entity';
import {
  GetAllMonthlyGoalsInterface,
  getRecruitersAndDonorCenetrs,
} from '../interface/monthly-goals.interface';
import { MonthlyGoals } from '../entities/monthly-goals.entity';
import { MonthlyGoalsHistory } from '../entities/monthly-goals-history.entity';
import { OrderByConstants } from '../../../../../constants/order-by.constants';
import { BusinessUnits } from '../../../hierarchy/business-units/entities/business-units.entity';
import { Facility } from '../../../resources/facilities/entity/facility.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { HistoryService } from '../../../../../../common/services/history.service';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';
import { DailyGoalsAllocations } from '../../daily-goals-allocation/entities/daily-goals-allocation.entity';
import moment from 'moment';
import { DailyGoalsCalenders } from '../../daily-goals-calender/entity/daily-goals-calender.entity';
import { DailyGoalsCalendersHistory } from '../../daily-goals-calender/entity/daily-goals-calender-history.entity';
import { DailyGoalsCalenderService } from '../../daily-goals-calender/service/daily-goals-calender.service';
@Injectable()
export class MonthlyGoalsService extends HistoryService<MonthlyGoalsHistory> {
  constructor(
    @InjectRepository(ProcedureTypes)
    private readonly procedureTypesRepository: Repository<ProcedureTypes>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MonthlyGoals)
    private readonly monthlyGoalsRepository: Repository<MonthlyGoals>,
    @InjectRepository(DailyGoalsAllocations)
    private readonly dailyGoalsAllocationRepository: Repository<DailyGoalsAllocations>,
    @InjectRepository(DailyGoalsCalenders)
    private readonly dailyGoalsCalenderRepository: Repository<DailyGoalsCalenders>,
    @InjectRepository(MonthlyGoalsHistory)
    private readonly monthlyGoalsHistoryRepository: Repository<MonthlyGoalsHistory>,
    @InjectRepository(BusinessUnits)
    private readonly businessUnitsRepository: Repository<BusinessUnits>,
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly entityManager: EntityManager,
    private readonly dailyGoalsCalendarService: DailyGoalsCalenderService
  ) {
    super(monthlyGoalsHistoryRepository);
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

  /**
   * create new monthly goals
   * @param createMonthlyGoalsDto
   * @returns
   */
  async create(createMonthlyGoalsDto: CreateMonthlyGoalsDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const user = await this.entityExist(
        this.userRepository,
        { where: { id: createMonthlyGoalsDto?.created_by } },
        'User'
      );
      const recruiter = createMonthlyGoalsDto?.recruiter
        ? await this.entityExist(
            this.userRepository,
            { where: { id: createMonthlyGoalsDto?.recruiter } },
            'Recruiter'
          )
        : null;

      await this.entityExist(
        this.procedureTypesRepository,
        {
          where: {
            id: createMonthlyGoalsDto?.procedure_type,
            is_archive: false,
          },
        },
        'Procedure Types'
      );
      const businessUnits: any = await this.businessUnitsRepository.findBy({
        id: In(createMonthlyGoalsDto.collection_operation),
      });
      if (
        businessUnits &&
        businessUnits.length < createMonthlyGoalsDto.collection_operation.length
      ) {
        throw new HttpException(
          `Some Collection Operations not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      const createMonthlyGoals = new MonthlyGoals();
      const keys = Object.keys(createMonthlyGoalsDto);

      const tenant = await this.entityExist(
        this.tenantRepository,
        {
          where: {
            id: createMonthlyGoalsDto?.tenant_id,
          },
        },
        'Tenant'
      );
      for (const key of keys) {
        createMonthlyGoals[key] = createMonthlyGoalsDto?.[key];
      }
      createMonthlyGoals.created_by = user;
      createMonthlyGoals.collection_operation = businessUnits;
      createMonthlyGoals.tenant_id = tenant;
      createMonthlyGoals.recruiter = recruiter;
      // Save the Monthly Goals entity
      const savedMonthlyGoals = await queryRunner.manager.save(
        createMonthlyGoals
      );

      for (let i = 0; i < businessUnits.length; i++) {
        const item = businessUnits[i];

        const dailyAllocation = await this.dailyGoalsAllocationRepository.find({
          where: {
            year: createMonthlyGoals.year,
            collection_operation: item.collection_operation,
            procedure_type: createMonthlyGoals.procedure_type,
          },
        });
        for (let i = 0; i < dailyAllocation.length; i++) {
          const allocation = dailyAllocation[i];
          const nextAllocation = dailyAllocation[i + 1];
          const startOfAllocation = moment(allocation.effective_date).startOf(
            'month'
          );
          const endOfAllocation = nextAllocation
            ? moment(nextAllocation.effective_date).endOf('month')
            : moment(allocation.effective_date).endOf('year');

          const dailyGoalCalenderToDelete =
            await this.dailyGoalsCalenderRepository.find({
              relations: [
                'procedure_type',
                'collection_operation',
                'created_by',
                'tenant',
              ],
              where: {
                date: Between(
                  startOfAllocation.toDate(),
                  endOfAllocation.toDate()
                ),
                collection_operation: { id: item.id },
                procedure_type: { id: createMonthlyGoalsDto.procedure_type },
                is_archived: false,
              },
            });

          const ids = [];
          for (let i = 0; i < dailyGoalCalenderToDelete.length; i++) {
            const item = dailyGoalCalenderToDelete[i];
            ids.push(item.id);
            const calendarHistory = new DailyGoalsCalendersHistory();
            Object.assign(calendarHistory, item);
            calendarHistory.collection_operation =
              item?.collection_operation?.id;
            calendarHistory.procedure_type = item?.procedure_type?.id;
            calendarHistory.created_by = item?.created_by?.id;
            calendarHistory.tenant_id = item?.tenant?.id;
            calendarHistory.history_reason = 'D';
            await this.dailyGoalsCalendarService.createHistory(calendarHistory);
          }
          await this.dailyGoalsCalenderRepository.update(
            { id: In(ids) },
            { is_archived: true }
          );

          while (startOfAllocation.isSameOrBefore(endOfAllocation)) {
            const startOfMonth = moment(startOfAllocation).startOf('month');
            const endOfMonth = moment(startOfAllocation).endOf('month');
            const monthly_value =
              createMonthlyGoals?.[
                moment(startOfMonth).format('MMMM').toLowerCase()
              ];
            const dailyValues = {
              sunday:
                (monthly_value * (allocation.sunday / 100)) /
                this.getNumberOfDaysBetweenDates(
                  startOfMonth.toDate(),
                  endOfMonth.toDate(),
                  0
                ),
              monday:
                (monthly_value * (allocation.monday / 100)) /
                this.getNumberOfDaysBetweenDates(
                  startOfMonth.toDate(),
                  endOfMonth.toDate(),
                  1
                ),
              tuesday:
                (monthly_value * (allocation.tuesday / 100)) /
                this.getNumberOfDaysBetweenDates(
                  startOfMonth.toDate(),
                  endOfMonth.toDate(),
                  2
                ),
              wednesday:
                (monthly_value * (allocation.wednesday / 100)) /
                this.getNumberOfDaysBetweenDates(
                  startOfMonth.toDate(),
                  endOfMonth.toDate(),
                  3
                ),
              thursday:
                (monthly_value * (allocation.thursday / 100)) /
                this.getNumberOfDaysBetweenDates(
                  startOfMonth.toDate(),
                  endOfMonth.toDate(),
                  4
                ),
              friday:
                (monthly_value * (allocation.friday / 100)) /
                this.getNumberOfDaysBetweenDates(
                  startOfMonth.toDate(),
                  endOfMonth.toDate(),
                  5
                ),
              saturday:
                (monthly_value * (allocation.saturday / 100)) /
                this.getNumberOfDaysBetweenDates(
                  startOfMonth.toDate(),
                  endOfMonth.toDate(),
                  6
                ),
            };
            const weekday = startOfAllocation.format('dddd');
            const dailyGoalsCalender = new DailyGoalsCalenders();
            dailyGoalsCalender.procedure_type_id =
              createMonthlyGoalsDto.procedure_type;
            dailyGoalsCalender.date = startOfAllocation.toDate();
            dailyGoalsCalender.created_by = user;
            dailyGoalsCalender.goal_amount =
              dailyValues[weekday.toLocaleLowerCase()];
            dailyGoalsCalender.collection_operation = item;
            dailyGoalsCalender.tenant = tenant;
            await queryRunner.manager.save(dailyGoalsCalender);
            startOfAllocation.add(1, 'day');
          }
        }
      }
      await queryRunner.commitTransaction();

      return {
        status: HttpStatus.CREATED,
        message: 'Monthly Goals Created Successfully',
        data: savedMonthlyGoals,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * get all monthly goals records
   * @param getAllMonthlyGoalsInterface
   * @returns {monthlyGoals}
   */
  async findAll(getAllMonthlyGoalsInterface: GetAllMonthlyGoalsInterface) {
    try {
      const {
        limit = parseInt(process.env.PAGE_SIZE),
        page = 1,
        sortBy,
        childSortBy,
        sortOrder = OrderByConstants.DESC,
        year,
        procedureType,
        donorCenter,
        collectionOperation,
        tenant_id,
        name,
      } = getAllMonthlyGoalsInterface;
      const { skip, take } = this.pagination(limit, page);
      const order = {};

      switch (sortBy) {
        case 'procedure_type':
          Object.assign(order, {
            procedure_type: {
              [childSortBy]: sortOrder,
            },
          });
          break;
        case 'collection_operation':
          Object.assign(order, {
            collection_operation: {
              [childSortBy]: sortOrder,
            },
          });
          break;
        case 'year':
          Object.assign(order, {
            [sortBy]: sortOrder,
          });
          break;
        case 'owner':
          Object.assign(order, {
            donor_center: {
              [childSortBy]: sortOrder,
            },
          });
          Object.assign(order, {
            recruiter: {
              first_name: sortOrder,
              last_name: sortOrder,
            },
          });
          break;
        case 'total_goal':
          Object.assign(order, {
            total_goal: sortOrder,
          });
          break;
        default:
          Object.assign(order, {
            id: 'DESC',
          });
          break;
      }
      const where = {
        is_archived: false,
        ...(year && year > 0 && { year }),
      };

      if (procedureType) {
        Object.assign(where, {
          procedure_type: {
            id: procedureType,
          },
        });
      }

      if (name) {
        const searchString = `%${name}%`;
        Object.assign(where, {
          year: Raw((alias) => `CAST(${alias} AS TEXT) LIKE :searchString`, {
            searchString,
          }),
        });
      }

      Object.assign(where, {
        tenant_id: { id: tenant_id },
      });

      if (donorCenter) {
        Object.assign(where, {
          donor_center: {
            id: donorCenter,
          },
        });
      }

      const collectionOperationIds = collectionOperation
        ? Array.isArray(collectionOperation)
          ? collectionOperation
          : [collectionOperation]
        : [];

      if (collectionOperationIds && collectionOperationIds?.length > 0) {
        Object.assign(where, {
          collection_operation: {
            id: In(collectionOperationIds),
          },
        });
      }

      const [data, count] = await this.monthlyGoalsRepository.findAndCount({
        relations: [
          'donor_center',
          'collection_operation',
          'procedure_type',
          'recruiter',
          'created_by',
        ],
        where,
        skip,
        take,
        order,
      });

      return {
        status: HttpStatus.OK,
        message: 'Monthly Goals Fetched Successfully',
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

  /**
   *
   * @param id
   * @returns {monthlyGoals}
   */
  async findOne(id: any) {
    const message = 'Monthly Goals';
    const query = {
      relations: [
        'donor_center',
        'collection_operation',
        'procedure_type',
        'recruiter',
        'created_by',
      ],
      where: {
        id,
        is_archived: false,
      },
    };
    const monthlyGoals = await this.entityExist(
      this.monthlyGoalsRepository,
      query,
      message
    );

    const modifiedData: any = await getModifiedDataDetails(
      this.monthlyGoalsHistoryRepository,
      id,
      this.userRepository
    );

    return {
      status: HttpStatus.OK,
      message: `${message} Fetched Successfully`,
      data: { ...monthlyGoals, ...modifiedData },
    };
  }

  /**
   * update record
   * insert data in history table
   * @param id
   * @param updateMonthlyGoalsDto
   * @returns
   */
  async update(id: any, updateMonthlyGoalsDto: UpdateMonthlyGoalsDto) {
    try {
      const query = {
        relations: [
          'donor_center',
          'recruiter',
          'collection_operation',
          'procedure_type',
          'created_by',
          'tenant_id',
        ],
        where: {
          id,
          is_archived: false,
        },
      };
      const monthlyGoals = await this.entityExist(
        this.monthlyGoalsRepository,
        query,
        'Monthly Goals'
      );

      const tenant = await this.entityExist(
        this.tenantRepository,
        {
          where: {
            id: updateMonthlyGoalsDto?.tenant_id,
          },
        },
        'Tenant'
      );

      const recruiter = updateMonthlyGoalsDto?.recruiter
        ? await this.entityExist(
            this.userRepository,
            { where: { id: updateMonthlyGoalsDto?.recruiter } },
            'Recruiter'
          )
        : null;

      const user = await this.entityExist(
        this.userRepository,
        { where: { id: updateMonthlyGoalsDto?.created_by } },
        'User'
      );
      const procedure_type = await this.entityExist(
        this.procedureTypesRepository,
        {
          where: {
            id: updateMonthlyGoalsDto?.procedure_type,
            is_archive: false,
          },
        },
        'Procedure Types'
      );
      const businessUnits: any = await this.businessUnitsRepository.findBy({
        id: In(updateMonthlyGoalsDto.collection_operation),
      });
      if (
        businessUnits &&
        businessUnits.length < updateMonthlyGoalsDto.collection_operation.length
      ) {
        throw new HttpException(
          `Some Collection Operations not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      const monthlyGoalsHistory = new MonthlyGoalsHistory();
      Object.assign(monthlyGoalsHistory, monthlyGoals);
      monthlyGoalsHistory.history_reason = 'C';
      monthlyGoalsHistory.id = monthlyGoals.id;
      monthlyGoalsHistory.recruiter = monthlyGoals?.recruiter?.id ?? null;
      monthlyGoalsHistory.procedure_type = monthlyGoals?.procedure_type?.id;
      monthlyGoalsHistory.created_by = updateMonthlyGoalsDto?.created_by;
      monthlyGoalsHistory.donor_center = monthlyGoals?.donor_center?.id || null;
      monthlyGoalsHistory.tenant_id = monthlyGoals?.tenant_id?.id || null;
      delete monthlyGoalsHistory?.created_at;
      await this.createHistory(monthlyGoalsHistory);

      Object.assign(monthlyGoals, updateMonthlyGoalsDto);
      monthlyGoals.recruiter = recruiter || null;
      monthlyGoals.collection_operation = businessUnits;
      monthlyGoals.procedure_type = procedure_type;
      monthlyGoals.created_by = user;
      monthlyGoals.donor_center = monthlyGoals?.donor_center || null;
      await this.monthlyGoalsRepository.save(monthlyGoals);

      for (let i = 0; i < businessUnits.length; i++) {
        const item = businessUnits[i];

        const dailyAllocation = await this.dailyGoalsAllocationRepository.find({
          where: {
            year: updateMonthlyGoalsDto.year,
            collection_operation: item.collection_operation,
            procedure_type: { id: updateMonthlyGoalsDto.procedure_type },
          },
        });
        for (let i = 0; i < dailyAllocation.length; i++) {
          const allocation = dailyAllocation[i];
          const nextAllocation = dailyAllocation[i + 1];
          const startOfAllocation = moment(allocation.effective_date).startOf(
            'month'
          );
          const endOfAllocation = nextAllocation
            ? moment(nextAllocation.effective_date).endOf('month')
            : moment(allocation.effective_date).endOf('year');

          const dailyGoalCalenderToDelete =
            await this.dailyGoalsCalenderRepository.find({
              relations: [
                'procedure_type',
                'collection_operation',
                'created_by',
                'tenant',
              ],
              where: {
                date: Between(
                  startOfAllocation.toDate(),
                  endOfAllocation.toDate()
                ),
                collection_operation: { id: item.id },
                procedure_type: { id: updateMonthlyGoalsDto.procedure_type },
                is_archived: false,
              },
            });

          const ids = [];
          for (let i = 0; i < dailyGoalCalenderToDelete.length; i++) {
            const item = dailyGoalCalenderToDelete[i];
            ids.push(item.id);
            const calendarHistory = new DailyGoalsCalendersHistory();
            Object.assign(calendarHistory, item);
            calendarHistory.collection_operation =
              item?.collection_operation?.id;
            calendarHistory.procedure_type = item?.procedure_type?.id;
            calendarHistory.created_by = item?.created_by?.id;
            calendarHistory.tenant_id = item?.tenant?.id;
            calendarHistory.history_reason = 'D';
            await this.dailyGoalsCalendarService.createHistory(calendarHistory);
          }
          await this.dailyGoalsCalenderRepository.update(
            { id: In(ids) },
            { is_archived: true }
          );

          while (startOfAllocation.isSameOrBefore(endOfAllocation)) {
            const startOfMonth = moment(startOfAllocation).startOf('month');
            const endOfMonth = moment(startOfAllocation).endOf('month');
            const monthly_value =
              updateMonthlyGoalsDto?.[
                moment(startOfMonth).format('MMMM').toLowerCase()
              ];
            const dailyValues = {
              sunday:
                (monthly_value * (allocation.sunday / 100)) /
                this.getNumberOfDaysBetweenDates(
                  startOfMonth.toDate(),
                  endOfMonth.toDate(),
                  0
                ),
              monday:
                (monthly_value * (allocation.monday / 100)) /
                this.getNumberOfDaysBetweenDates(
                  startOfMonth.toDate(),
                  endOfMonth.toDate(),
                  1
                ),
              tuesday:
                (monthly_value * (allocation.tuesday / 100)) /
                this.getNumberOfDaysBetweenDates(
                  startOfMonth.toDate(),
                  endOfMonth.toDate(),
                  2
                ),
              wednesday:
                (monthly_value * (allocation.wednesday / 100)) /
                this.getNumberOfDaysBetweenDates(
                  startOfMonth.toDate(),
                  endOfMonth.toDate(),
                  3
                ),
              thursday:
                (monthly_value * (allocation.thursday / 100)) /
                this.getNumberOfDaysBetweenDates(
                  startOfMonth.toDate(),
                  endOfMonth.toDate(),
                  4
                ),
              friday:
                (monthly_value * (allocation.friday / 100)) /
                this.getNumberOfDaysBetweenDates(
                  startOfMonth.toDate(),
                  endOfMonth.toDate(),
                  5
                ),
              saturday:
                (monthly_value * (allocation.saturday / 100)) /
                this.getNumberOfDaysBetweenDates(
                  startOfMonth.toDate(),
                  endOfMonth.toDate(),
                  6
                ),
            };
            const weekday = startOfAllocation.format('dddd');
            const dailyGoalsCalender = new DailyGoalsCalenders();
            dailyGoalsCalender.procedure_type_id =
              updateMonthlyGoalsDto.procedure_type;
            dailyGoalsCalender.date = startOfAllocation.toDate();
            dailyGoalsCalender.created_by = user;
            dailyGoalsCalender.goal_amount =
              dailyValues[weekday.toLocaleLowerCase()];
            dailyGoalsCalender.collection_operation = item;
            dailyGoalsCalender.tenant = tenant;
            await this.entityManager.save(dailyGoalsCalender);
            startOfAllocation.add(1, 'day');
          }
        }
      }

      return {
        status: HttpStatus.NO_CONTENT,
        message: 'Monthly Goals Updated Successfully',
        data: monthlyGoals,
      };
    } catch (error) {
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  async archive(id: any, updatedBy: any) {
    try {
      const query = {
        relations: [
          'donor_center',
          'collection_operation',
          'procedure_type',
          'created_by',
          'recruiter',
          'tenant_id',
        ],
        where: {
          id,
          is_archived: false,
        },
      };
      const { is_archived, ...monthlyGoals } = await this.entityExist(
        this.monthlyGoalsRepository,
        query,
        'Monthly Goals'
      );
      monthlyGoals['is_archived'] = !is_archived;
      monthlyGoals['updated_at'] = new Date();
      const updatedMonthlyGoals = await this.monthlyGoalsRepository.save(
        monthlyGoals
      );

      const monthlyGoalsHistory = new MonthlyGoalsHistory();
      Object.assign(monthlyGoalsHistory, monthlyGoals);
      monthlyGoalsHistory.history_reason = 'D';
      monthlyGoalsHistory.id = monthlyGoals.id;
      monthlyGoalsHistory.recruiter = monthlyGoals?.recruiter?.id ?? null;
      monthlyGoalsHistory.procedure_type = monthlyGoals?.procedure_type?.id;
      monthlyGoalsHistory.created_by = updatedBy;
      monthlyGoalsHistory.donor_center = monthlyGoals?.donor_center?.id || null;
      monthlyGoalsHistory.tenant_id = monthlyGoals?.tenant_id?.id || null;
      await this.createHistory(monthlyGoalsHistory);

      return {
        status: HttpStatus.NO_CONTENT,
        message: 'Monthly Goals Archive Successfully',
        data: updatedMonthlyGoals,
      };
    } catch (error) {
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getRecruitersAndDonorCenetrs(
    collectionOperations: getRecruitersAndDonorCenetrs
  ) {
    try {
      const { collectionOperation, procedure_type, year, tenant_id } =
        collectionOperations;

      const existingGoals = await this.monthlyGoalsRepository.find({
        where: {
          collection_operation: {
            id: collectionOperation,
          },
          procedure_type: {
            id: procedure_type,
          },
          year: year,
          is_archived: false,
        },
        relations: ['recruiter', 'donor_center'],
      });

      const recruiterIds =
        existingGoals
          ?.map((item) => item?.recruiter?.id)
          .filter((item) => item !== undefined) || [];

      const donorCenterIds =
        existingGoals
          ?.map((item) => item?.donor_center?.id)
          .filter((item) => item !== undefined) || [];

      if (!collectionOperation) {
        throw new HttpException(
          `Collection operation id missing.`,
          HttpStatus.BAD_REQUEST
        );
      }

      const whereObj: any = {
        tenant: { id: tenant_id },
        role: { is_recruiter: true, is_active: true, is_archived: false },
        id: Not(In(recruiterIds)),
      };

      const collectionOperationIds = collectionOperation
        ? Array.isArray(collectionOperation)
          ? collectionOperation
          : [collectionOperation]
        : [];

      if (collectionOperationIds && collectionOperationIds?.length > 0) {
        Object.assign(whereObj, {
          business_units: {
            business_unit_id: {
              id: In(collectionOperationIds),
            },
          },
        });
      }

      const recruiters: any = await this.userRepository.find({
        where: whereObj,
        relations: [
          'tenant',
          'role',
          'business_units',
          'business_units.business_unit_id',
        ],
      });

      const donorCenter = await this.facilityRepository.find({
        where: {
          tenant: { id: tenant_id },
          status: true,
          donor_center: true,
          is_archived: false,
          id: Not(In(donorCenterIds)),
          collection_operation: { id: In(collectionOperationIds) },
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Recruiters and Donor Centers found Successfully',
        data: { recruiters: recruiters, donorCenter: donorCenter },
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  getNumberOfDaysBetweenDates = (currentDate, endDate, day) => {
    let numberOfDays = 0;
    while (currentDate <= endDate) {
      if (currentDate.getDay() === day) {
        numberOfDays += 1;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return numberOfDays;
  };
}
