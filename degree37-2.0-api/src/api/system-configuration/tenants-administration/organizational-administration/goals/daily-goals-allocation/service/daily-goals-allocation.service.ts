import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDailyGoalsAllocationDto } from '../dto/create-daily-goals-allocation.dto';
import { UpdateDailyGoalsAllocationDto } from '../dto/update-daily-goals-allocation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import moment from 'moment';
import { DailyGoalsAllocations } from '../entities/daily-goals-allocation.entity';
import { SuccessConstants } from '../../../../../constants/success.constants';
import { resError, resSuccess } from '../../../../../helpers/response';
import { ErrorConstants } from '../../../../../constants/error.constants';
import { ProcedureTypes } from '../../../products-procedures/procedure-types/entities/procedure-types.entity';
import { DailyGoalAllocationsFiltersInterface } from '../interface/daily-goals.interface';
import { DailyGoalsAllocationHistory } from '../entities/daily-goals-allocation-history.entity';
import { DailyGoalsCalenders } from '../../daily-goals-calender/entity/daily-goals-calender.entity';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { BusinessUnits } from '../../../hierarchy/business-units/entities/business-units.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { HistoryService } from '../../../../../../common/services/history.service';
import { MonthlyGoals } from '../../monthly-goals/entities/monthly-goals.entity';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';
import { isEmpty } from 'lodash';
import { DailyGoalsCalendersHistory } from '../../daily-goals-calender/entity/daily-goals-calender-history.entity';
import { DailyGoalsCalenderService } from '../../daily-goals-calender/service/daily-goals-calender.service';

@Injectable()
export class DailyGoalsAllocationService extends HistoryService<DailyGoalsAllocationHistory> {
  constructor(
    @InjectRepository(BusinessUnits)
    private readonly businessUnitsRepository: Repository<BusinessUnits>,
    @InjectRepository(DailyGoalsAllocations)
    private readonly dailyGoalAllocationsRepository: Repository<DailyGoalsAllocations>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProcedureTypes)
    private readonly procedureTypesRepository: Repository<ProcedureTypes>,
    @InjectRepository(DailyGoalsAllocationHistory)
    private readonly dailyGoalAllocationsHistoryRepository: Repository<DailyGoalsAllocationHistory>,
    @InjectRepository(DailyGoalsCalenders)
    private readonly dailyGoalsCalenderRepository: Repository<DailyGoalsCalenders>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(MonthlyGoals)
    private readonly monthlyGoalsRepository: Repository<MonthlyGoals>,
    private readonly dailyGoalsCalendarService: DailyGoalsCalenderService
  ) {
    super(dailyGoalAllocationsHistoryRepository);
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

  async create(createDailyGoalsAllocationDto: CreateDailyGoalsAllocationDto) {
    try {
      const {
        procedure_type_id,
        collection_operation,
        month,
        year,
        created_by,
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        tenant_id,
      } = createDailyGoalsAllocationDto;

      const totalPercentage =
        +sunday +
        +monday +
        +tuesday +
        +wednesday +
        +thursday +
        +friday +
        +saturday;

      if (totalPercentage > 100) {
        throw new HttpException(
          `Sum of daily goals exceed the limit `,
          HttpStatus.NOT_FOUND
        );
      }

      const user = await this.userRepository.findOneBy({
        id: created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const procedureType = await this.procedureTypesRepository.findOneBy({
        id: procedure_type_id,
      });
      if (!procedureType) {
        throw new HttpException(
          `Procedure Type not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      const tenant = await this.tenantRepository.findOneBy({
        id: tenant_id,
      });
      if (!tenant) {
        throw new HttpException(`Tenant not found.`, HttpStatus.NOT_FOUND);
      }

      const businessUnits: any = await this.businessUnitsRepository.findBy({
        id: In(collection_operation),
      });
      if (businessUnits && businessUnits.length < collection_operation.length) {
        throw new HttpException(
          `Some Collection Operations not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      const effectiveDate = moment(new Date(year, month, 1));
      const daily_goal_allocation = await this.dailyGoalAllocationsRepository
        .createQueryBuilder('dailyGoalsAllocation')
        .leftJoinAndSelect(
          'dailyGoalsAllocation.collection_operation',
          'collectionOperation'
        )
        .where('collectionOperation.id IN (:...collectionOperationIds)', {
          collectionOperationIds: collection_operation,
        })
        .andWhere('dailyGoalsAllocation.effective_date = :effectiveDate', {
          effectiveDate: effectiveDate.toDate(),
        })
        .andWhere('dailyGoalsAllocation.is_archived = :isArchived', {
          isArchived: false,
        })
        .getMany();

      if (daily_goal_allocation.length > 0) {
        throw new HttpException(
          `Daily Allocation with Effective Date and Collection Operation Already exists.`,
          HttpStatus.NOT_FOUND
        );
      }

      const query = `
      SELECT 
        mg.id,
        mg.year,
        SUM(mg.january) AS january_sum,
        SUM(mg.february) AS february_sum,
        SUM(mg.march) AS march_sum,
        SUM(mg.april) AS april_sum,
        SUM(mg.may) AS may_sum,
        SUM(mg.june) AS june_sum,
        SUM(mg.july) AS july_sum,
        SUM(mg.august) AS august_sum,
        SUM(mg.september) AS september_sum,
        SUM(mg.october) AS october_sum,
        SUM(mg.november) AS november_sum,
        SUM(mg.december) AS december_sum,
        SUM(mg.total_goal) AS total_goal_sum
      FROM 
        monthly_goals mg
      LEFT JOIN 
        monthly_goals_collection_operations mgc ON mgc.monthly_goals_id = mg.id
      WHERE
        mg.year = ${parseInt(effectiveDate.format('yyyy'))} AND
        mg.is_archived = ${false} AND
        mg.procedure_type = ${procedure_type_id} AND
        mgc.business_unit_id IN (${collection_operation})
      GROUP BY
        mg.id, mg.year
    `;

      const monthly_goal = await this.monthlyGoalsRepository.query(query);

      const findDate = moment(effectiveDate);
      findDate.set('h', 0);
      findDate.set('m', 0);
      findDate.set('s', 0);
      const dailyAllocationsList = await this.dailyGoalAllocationsRepository
        .createQueryBuilder('dailyGoalsAllocation')
        .leftJoinAndSelect(
          'dailyGoalsAllocation.collection_operation',
          'collectionOperation'
        )
        .where('collectionOperation.id IN (:...collectionOperationIds)', {
          collectionOperationIds: collection_operation,
        })
        .andWhere('dailyGoalsAllocation.effective_date > :effectiveDate', {
          effectiveDate: findDate.toDate(),
        })
        .andWhere('dailyGoalsAllocation.is_archived = :isArchived', {
          isArchived: false,
        })
        .limit(1)
        .getMany();

      let endDate = moment(effectiveDate).endOf('year');
      // console.log({ endDate }, 'Yearly End');
      if (dailyAllocationsList.length) {
        endDate = moment(dailyAllocationsList?.[0]?.effective_date);
        endDate.set('h', 0);
        endDate.set('m', 0);
        endDate.set('s', 0);
        // console.log({ endDate }, 'Next Effective Start');
      }

      const dailyGoalAllocations = new DailyGoalsAllocations();

      dailyGoalAllocations.procedure_type = procedureType;
      dailyGoalAllocations.effective_date = effectiveDate.toDate();
      dailyGoalAllocations.created_by = user;
      dailyGoalAllocations.month = month;
      dailyGoalAllocations.year = year;
      dailyGoalAllocations.sunday = sunday ?? 0;
      dailyGoalAllocations.monday = monday ?? 0;
      dailyGoalAllocations.tuesday = tuesday ?? 0;
      dailyGoalAllocations.wednesday = wednesday ?? 0;
      dailyGoalAllocations.thursday = thursday ?? 0;
      dailyGoalAllocations.friday = friday ?? 0;
      dailyGoalAllocations.saturday = saturday ?? 0;
      dailyGoalAllocations.collection_operation = businessUnits;
      dailyGoalAllocations.tenant_id = tenant;

      const savedDailyGoal = await this.dailyGoalAllocationsRepository.save(
        dailyGoalAllocations
      );

      for (let i = 0; i < businessUnits.length; i++) {
        const coEffectiveDate = moment(effectiveDate);
        const item = businessUnits[i];
        const dailyGoalCalenderToDelete =
          await this.dailyGoalsCalenderRepository.find({
            relations: [
              'procedure_type',
              'collection_operation',
              'created_by',
              'tenant',
            ],
            where: {
              date: Between(effectiveDate.toDate(), endDate.toDate()),
              collection_operation: { id: item.id },
              procedure_type: { id: procedureType.id },
              is_archived: false,
            },
          });

        for (let i = 0; i < dailyGoalCalenderToDelete.length; i++) {
          const item = dailyGoalCalenderToDelete[i];
          const calendarHistory = new DailyGoalsCalendersHistory();
          Object.assign(calendarHistory, item);
          calendarHistory.collection_operation = item?.collection_operation?.id;
          calendarHistory.procedure_type = item?.procedure_type?.id;
          calendarHistory.created_by = item?.created_by?.id;
          calendarHistory.tenant_id = item?.tenant?.id;
          calendarHistory.history_reason = 'D';
          await this.dailyGoalsCalendarService.createHistory(calendarHistory);
        }
        const ids = dailyGoalCalenderToDelete.map((item) => item.id);
        await this.dailyGoalsCalenderRepository.update(
          { id: In(ids) },
          { is_archived: true }
        );

        while (coEffectiveDate.isSameOrBefore(endDate)) {
          const monthly_value = monthly_goal?.reduce(
            (partialSum, item) =>
              partialSum +
              parseInt(
                item[
                  `${coEffectiveDate.format('MMMM').toLocaleLowerCase()}_sum`
                ] || 0
              ),
            0
          );
          // console.log(
          //   coEffectiveDate.format('MMMM').toLocaleLowerCase(),
          //   monthly_value
          // );
          const startOfMonth = moment(coEffectiveDate).startOf('month');
          const endOfMonth = moment(coEffectiveDate).endOf('month');
          const dailyValues = {
            sunday:
              (monthly_value * (createDailyGoalsAllocationDto.sunday / 100)) /
              this.getNumberOfDaysBetweenDates(
                startOfMonth.toDate(),
                endOfMonth.toDate(),
                0
              ),
            monday:
              (monthly_value * (createDailyGoalsAllocationDto.monday / 100)) /
              this.getNumberOfDaysBetweenDates(
                startOfMonth.toDate(),
                endOfMonth.toDate(),
                1
              ),
            tuesday:
              (monthly_value * (createDailyGoalsAllocationDto.tuesday / 100)) /
              this.getNumberOfDaysBetweenDates(
                startOfMonth.toDate(),
                endOfMonth.toDate(),
                2
              ),
            wednesday:
              (monthly_value *
                (createDailyGoalsAllocationDto.wednesday / 100)) /
              this.getNumberOfDaysBetweenDates(
                startOfMonth.toDate(),
                endOfMonth.toDate(),
                3
              ),
            thursday:
              (monthly_value * (createDailyGoalsAllocationDto.thursday / 100)) /
              this.getNumberOfDaysBetweenDates(
                startOfMonth.toDate(),
                endOfMonth.toDate(),
                4
              ),
            friday:
              (monthly_value * (createDailyGoalsAllocationDto.friday / 100)) /
              this.getNumberOfDaysBetweenDates(
                startOfMonth.toDate(),
                endOfMonth.toDate(),
                5
              ),
            saturday:
              (monthly_value * (createDailyGoalsAllocationDto.saturday / 100)) /
              this.getNumberOfDaysBetweenDates(
                startOfMonth.toDate(),
                endOfMonth.toDate(),
                6
              ),
          };
          // console.log({ dailyValues });
          const weekday = coEffectiveDate.format('dddd');
          const dailyGoalsCalender = new DailyGoalsCalenders();
          dailyGoalsCalender.procedure_type = procedureType;
          dailyGoalsCalender.date = coEffectiveDate.toDate();
          dailyGoalsCalender.created_by = user;
          dailyGoalsCalender.goal_amount =
            dailyValues[weekday.toLocaleLowerCase()];
          dailyGoalsCalender.collection_operation = item;
          dailyGoalsCalender.tenant = tenant;
          await this.dailyGoalsCalenderRepository.save(dailyGoalsCalender);
          coEffectiveDate.add(1, 'day');
        }
      }

      delete savedDailyGoal.procedure_type;
      delete savedDailyGoal.created_by;

      return resSuccess(
        'Daily Goal Allocation Created Successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedDailyGoal
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAll(
    dailyGoalAllocationsFiltersInterface: DailyGoalAllocationsFiltersInterface
  ) {
    try {
      const {
        collection_operation,
        procedure_type,
        selected_date,
        tenant_id,
        sortBy,
        sortOrder,
        childSortBy,
      } = dailyGoalAllocationsFiltersInterface;
      let { page, limit } = dailyGoalAllocationsFiltersInterface;

      limit = limit ? +limit : +process.env.PAGE_SIZE;

      page = page ? +page : 1;
      const order = {};
      if (!isEmpty(sortBy))
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
          default:
            Object.assign(order, {
              [sortBy]: sortOrder,
            });
            break;
        }

      const where = { is_archived: false };
      if (selected_date) {
        const startDate = moment(new Date(selected_date)).startOf('day');
        const endDate = moment(new Date(selected_date)).endOf('day');

        // console.log({ startDate, endDate });

        Object.assign(where, {
          effective_date: Between(startDate, endDate),
        });
      }

      const collectionOperationIds = collection_operation
        ? Array.isArray(collection_operation)
          ? collection_operation
          : [collection_operation]
        : [];

      if (collectionOperationIds && collectionOperationIds?.length > 0) {
        Object.assign(where, {
          collection_operation: {
            id: In(collectionOperationIds),
          },
        });
      }

      Object.assign(where, {
        tenant_id: { id: tenant_id },
      });

      if (procedure_type) {
        Object.assign(where, {
          procedure_type: {
            id: procedure_type,
          },
        });
      }

      const [response, count] =
        await this.dailyGoalAllocationsRepository.findAndCount({
          where,
          relations: ['procedure_type', 'created_by', 'collection_operation'],
          take: limit,
          skip: (page - 1) * limit,
          order: order,
        });

      return {
        status: HttpStatus.OK,
        message: 'Daily Goals Fetched Succesfuly',
        count: count,
        data: response,
      };
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findOne(id: any) {
    try {
      const dailyGoalsAllocation =
        await this.dailyGoalAllocationsRepository.findOne({
          where: { id: id },
          relations: ['procedure_type', 'created_by', 'collection_operation'],
        });

      if (!dailyGoalsAllocation) {
        throw new HttpException(
          `Daily goal allocation not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      if (dailyGoalsAllocation?.is_archived) {
        throw new HttpException(
          `Daily goal allocation is archived.`,
          HttpStatus.NOT_FOUND
        );
      }

      const modifiedData: any = await getModifiedDataDetails(
        this.dailyGoalAllocationsHistoryRepository,
        id,
        this.userRepository
      );

      const dailyGoalData = {
        ...dailyGoalsAllocation,
        created_by: dailyGoalsAllocation?.created_by,
        ...modifiedData,
      };
      return resSuccess(
        'Daily goal allocation fetched successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        dailyGoalData
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async update(
    id: any,
    updateDailyGoalsAllocationDto: UpdateDailyGoalsAllocationDto
  ) {
    try {
      const dailyGoalsAllocation =
        await this.dailyGoalAllocationsRepository.findOne({
          relations: ['created_by', 'procedure_type', 'tenant_id'],
          where: { id: id },
        });

      const dailGoalAllocationBeforeUpdate = { ...dailyGoalsAllocation };
      if (!dailyGoalsAllocation) {
        throw new HttpException(
          `Daily Goal Allocation not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      if (dailyGoalsAllocation?.is_archived) {
        throw new HttpException(
          `Daily goal allocation is archived.`,
          HttpStatus.NOT_FOUND
        );
      }

      const {
        procedure_type_id,
        collection_operation,
        month,
        year,
        created_by,
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        updated_by,
        tenant_id,
      } = updateDailyGoalsAllocationDto;

      const totalPercentageNew =
        sunday ||
        0 + monday ||
        0 + tuesday ||
        0 + wednesday ||
        0 + thursday ||
        0 + friday ||
        0 + saturday;

      if (totalPercentageNew > 100) {
        throw new HttpException(
          `Sum of daily goals exceed the limit `,
          HttpStatus.NOT_FOUND
        );
      }

      let user;
      if (created_by) {
        user = await this.userRepository.findOneBy({
          id: created_by,
        });
        if (!user) {
          throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
        }
        dailyGoalsAllocation.created_by = user;
      }

      let procedureType;
      if (procedure_type_id) {
        procedureType = await this.procedureTypesRepository.findOneBy({
          id: procedure_type_id,
        });

        if (!procedureType) {
          throw new HttpException(
            `Procedure Type not found.`,
            HttpStatus.NOT_FOUND
          );
        }

        dailyGoalsAllocation.procedure_type = procedureType;
      }

      const tenant = await this.tenantRepository.findOneBy({
        id: tenant_id,
      });
      if (!tenant) {
        throw new HttpException(`Tenant not found.`, HttpStatus.NOT_FOUND);
      }

      if (year && month) {
        dailyGoalsAllocation.effective_date = moment(
          new Date(year, month, 1)
        ).toDate();
      }

      const effectiveDate = moment(new Date(year, month, 1));

      const query = `
      SELECT 
        mg.id,
        mg.year,
        SUM(mg.january) AS january_sum,
        SUM(mg.february) AS february_sum,
        SUM(mg.march) AS march_sum,
        SUM(mg.april) AS april_sum,
        SUM(mg.may) AS may_sum,
        SUM(mg.june) AS june_sum,
        SUM(mg.july) AS july_sum,
        SUM(mg.august) AS august_sum,
        SUM(mg.september) AS september_sum,
        SUM(mg.october) AS october_sum,
        SUM(mg.november) AS november_sum,
        SUM(mg.december) AS december_sum,
        SUM(mg.total_goal) AS total_goal_sum
      FROM 
        monthly_goals mg
      LEFT JOIN 
        monthly_goals_collection_operations mgc ON mgc.monthly_goals_id = mg.id
      WHERE
        mg.year = ${parseInt(effectiveDate.format('yyyy'))} AND
        mg.is_archived = ${false} AND
        mg.procedure_type = ${procedure_type_id} AND
        mgc.business_unit_id IN (${collection_operation})
      GROUP BY
        mg.id, mg.year
    `;

      const monthly_goal = await this.monthlyGoalsRepository.query(query);
      dailyGoalsAllocation.sunday = sunday ?? dailyGoalsAllocation.sunday;
      dailyGoalsAllocation.monday = monday ?? dailyGoalsAllocation.monday;
      dailyGoalsAllocation.tuesday = tuesday ?? dailyGoalsAllocation.tuesday;
      dailyGoalsAllocation.wednesday =
        wednesday ?? dailyGoalsAllocation.wednesday;
      dailyGoalsAllocation.thursday = thursday ?? dailyGoalsAllocation.thursday;
      dailyGoalsAllocation.friday = friday ?? dailyGoalsAllocation.friday;
      dailyGoalsAllocation.saturday = saturday ?? dailyGoalsAllocation.saturday;

      const findDate = moment(effectiveDate);
      findDate.set('h', 0);
      findDate.set('m', 0);
      findDate.set('s', 0);
      const dailyAllocationsList = await this.dailyGoalAllocationsRepository
        .createQueryBuilder('dailyGoalsAllocation')
        .leftJoinAndSelect(
          'dailyGoalsAllocation.collection_operation',
          'collectionOperation'
        )
        .where('collectionOperation.id IN (:...collectionOperationIds)', {
          collectionOperationIds: collection_operation,
        })
        .andWhere('dailyGoalsAllocation.effective_date > :effectiveDate', {
          effectiveDate: findDate.toDate(),
        })
        .andWhere('dailyGoalsAllocation.is_archived = :isArchived', {
          isArchived: false,
        })
        .limit(1)
        .getMany();

      let endDate = moment(effectiveDate).endOf('year');
      // console.log({ endDate }, 'Yearly End');
      if (dailyAllocationsList.length) {
        endDate = moment(dailyAllocationsList?.[0]?.effective_date);
        endDate.set('h', 0);
        endDate.set('m', 0);
        endDate.set('s', 0);
        // console.log({ endDate }, 'Next Effective Start');
      }
      let businessUnits = [];
      if (collection_operation) {
        businessUnits = await this.businessUnitsRepository.findBy({
          id: In(collection_operation),
        });

        if (
          businessUnits &&
          businessUnits.length < collection_operation.length
        ) {
          throw new HttpException(
            `Some Collection Operations not found.`,
            HttpStatus.NOT_FOUND
          );
        }

        dailyGoalsAllocation.collection_operation = businessUnits;
      }

      const savedDailyGoal = await this.dailyGoalAllocationsRepository.save(
        dailyGoalsAllocation
      );

      for (let i = 0; i < businessUnits.length; i++) {
        const item = businessUnits[i];
        // console.log({ effectiveDate, endDate });
        const dailyGoalCalenderToDelete =
          await this.dailyGoalsCalenderRepository.find({
            relations: [
              'procedure_type',
              'collection_operation',
              'created_by',
              'tenant',
            ],
            where: {
              date: Between(effectiveDate.toDate(), endDate.toDate()),
              collection_operation: { id: item.id },
              procedure_type: { id: procedureType.id },
              is_archived: false,
            },
          });
        // console.log(dailyGoalCalenderToDelete.length);
        for (let i = 0; i < dailyGoalCalenderToDelete.length; i++) {
          const item = dailyGoalCalenderToDelete[i];
          const calendarHistory = new DailyGoalsCalendersHistory();
          Object.assign(calendarHistory, item);
          calendarHistory.collection_operation = item?.collection_operation?.id;
          calendarHistory.procedure_type = item?.procedure_type?.id;
          calendarHistory.created_by = item?.created_by?.id;
          calendarHistory.tenant_id = item?.tenant?.id;
          calendarHistory.history_reason = 'D';
          await this.dailyGoalsCalendarService.createHistory(calendarHistory);
        }
        const ids = dailyGoalCalenderToDelete.map((item) => item.id);
        await this.dailyGoalsCalenderRepository.update(
          { id: In(ids) },
          { is_archived: true }
        );

        while (effectiveDate.isSameOrBefore(endDate)) {
          const monthly_value = monthly_goal?.reduce(
            (partialSum, item) =>
              partialSum +
              parseInt(
                item[`${effectiveDate.format('MMMM').toLocaleLowerCase()}_sum`]
              ),
            0
          );
          const startOfMonth = moment(effectiveDate).startOf('month');
          const endOfMonth = moment(effectiveDate).endOf('month');
          const dailyValues = {
            sunday:
              (monthly_value * (updateDailyGoalsAllocationDto.sunday / 100)) /
              this.getNumberOfDaysBetweenDates(
                startOfMonth.toDate(),
                endOfMonth.toDate(),
                0
              ),
            monday:
              (monthly_value * (updateDailyGoalsAllocationDto.monday / 100)) /
              this.getNumberOfDaysBetweenDates(
                startOfMonth.toDate(),
                endOfMonth.toDate(),
                1
              ),
            tuesday:
              (monthly_value * (updateDailyGoalsAllocationDto.tuesday / 100)) /
              this.getNumberOfDaysBetweenDates(
                startOfMonth.toDate(),
                endOfMonth.toDate(),
                2
              ),
            wednesday:
              (monthly_value *
                (updateDailyGoalsAllocationDto.wednesday / 100)) /
              this.getNumberOfDaysBetweenDates(
                startOfMonth.toDate(),
                endOfMonth.toDate(),
                3
              ),
            thursday:
              (monthly_value * (updateDailyGoalsAllocationDto.thursday / 100)) /
              this.getNumberOfDaysBetweenDates(
                startOfMonth.toDate(),
                endOfMonth.toDate(),
                4
              ),
            friday:
              (monthly_value * (updateDailyGoalsAllocationDto.friday / 100)) /
              this.getNumberOfDaysBetweenDates(
                startOfMonth.toDate(),
                endOfMonth.toDate(),
                5
              ),
            saturday:
              (monthly_value * (updateDailyGoalsAllocationDto.saturday / 100)) /
              this.getNumberOfDaysBetweenDates(
                startOfMonth.toDate(),
                endOfMonth.toDate(),
                6
              ),
          };
          const weekday = effectiveDate.format('dddd');
          const dailyGoalsCalender = new DailyGoalsCalenders();
          dailyGoalsCalender.procedure_type_id = procedureType;
          dailyGoalsCalender.date = effectiveDate.toDate();
          dailyGoalsCalender.created_by = user;
          dailyGoalsCalender.goal_amount =
            dailyValues[weekday.toLocaleLowerCase()];
          dailyGoalsCalender.collection_operation = item;
          dailyGoalsCalender.tenant = tenant;
          await this.dailyGoalsCalenderRepository.save(dailyGoalsCalender);
          effectiveDate.add(1, 'day');
        }
      }
      const dailyGoalAllocationsHistory = new DailyGoalsAllocationHistory();
      Object.assign(
        dailyGoalAllocationsHistory,
        dailGoalAllocationBeforeUpdate
      );
      dailyGoalAllocationsHistory.procedure_type_id =
        dailGoalAllocationBeforeUpdate?.procedure_type?.id;
      dailyGoalAllocationsHistory.created_by = updated_by;
      dailyGoalAllocationsHistory.tenant_id =
        dailGoalAllocationBeforeUpdate?.tenant_id?.id;
      dailyGoalAllocationsHistory.history_reason = 'C';
      delete dailyGoalAllocationsHistory.created_at;
      await this.createHistory(dailyGoalAllocationsHistory);

      delete savedDailyGoal?.procedure_type;
      delete savedDailyGoal?.created_by;

      return resSuccess(
        'Daily Goal Allocation Updated Successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        savedDailyGoal
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async archiveDailyGoal(id: any, updatedBy: any) {
    try {
      const dailyGoalToUpdate =
        await this.dailyGoalAllocationsRepository.findOne({
          where: { id: id },
        });

      if (!dailyGoalToUpdate) {
        throw new HttpException(
          `Daily goals allocation not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      if (dailyGoalToUpdate.is_archived === false) {
        dailyGoalToUpdate.is_archived = true;
        await this.dailyGoalAllocationsRepository.save(dailyGoalToUpdate);

        const roleArchived = await this.dailyGoalAllocationsRepository.findOne({
          relations: ['created_by', 'procedure_type', 'tenant_id'],
          where: { id: id },
        });

        const dailyGoalAllocationsHistory = new DailyGoalsAllocationHistory();
        Object.assign(dailyGoalAllocationsHistory, roleArchived);
        dailyGoalAllocationsHistory.procedure_type_id =
          roleArchived?.procedure_type?.id;
        dailyGoalAllocationsHistory.created_by = updatedBy;
        dailyGoalAllocationsHistory.tenant_id = roleArchived?.tenant_id?.id;
        dailyGoalAllocationsHistory.history_reason = 'D';
        delete dailyGoalAllocationsHistory.created_at;
        await this.createHistory(dailyGoalAllocationsHistory);
        // await this.createDailyGoalHistory(roleArchived, 'D');
      } else {
        throw new HttpException(
          `Daily goals allocation is already archived.`,
          HttpStatus.NOT_FOUND
        );
      }

      return resSuccess(
        'Daily goals allocation Archived successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} dailyGoalsAllocation`;
  }
}
