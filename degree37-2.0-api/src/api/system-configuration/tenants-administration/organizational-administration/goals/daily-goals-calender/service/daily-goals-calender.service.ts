import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, EntityManager, Equal, Repository } from 'typeorm';
import { resError, resSuccess } from '../../../../../helpers/response';
import { ErrorConstants } from '../../../../../constants/error.constants';
import moment from 'moment';
import { DailyGoalsCalenders } from '../../daily-goals-calender/entity/daily-goals-calender.entity';
import { DailyGoalsCalenderFiltersInterface } from '../interface/daily-goals-calender.interface';
import { MonthlyGoals } from '../../monthly-goals/entities/monthly-goals.entity';
import { DailyGoalsAllocations } from '../../daily-goals-allocation/entities/daily-goals-allocation.entity';
import { UpdateDailyGoalsCalendarDto } from '../dto/update-daily-goals-calendar.dto';
import { HistoryService } from 'src/api/common/services/history.service';
import { DailyGoalsCalendersHistory } from '../entity/daily-goals-calender-history.entity';

@Injectable()
export class DailyGoalsCalenderService extends HistoryService<DailyGoalsCalendersHistory> {
  constructor(
    @InjectRepository(DailyGoalsCalenders)
    private readonly dailyGoalsCalenderRepository: Repository<DailyGoalsCalenders>,
    @InjectRepository(DailyGoalsCalendersHistory)
    private readonly dailyGoalsCalenderHistoryRepository: Repository<DailyGoalsCalendersHistory>,
    @InjectRepository(MonthlyGoals)
    private readonly monthlyGoalsRepository: Repository<MonthlyGoals>,
    @InjectRepository(DailyGoalsAllocations)
    private readonly dailyGoalsAllocationRepository: Repository<DailyGoalsAllocations>,
    private readonly entityManager: EntityManager
  ) {
    super(dailyGoalsCalenderHistoryRepository);
  }

  async allocationPercentagesForMonthByDates(daily_goal_allocation) {
    const allocationsList = [];
    for (let i = 0; i < daily_goal_allocation.length; i++) {
      const item = daily_goal_allocation[i];
      const nextItem =
        daily_goal_allocation[i + 1] ??
        moment(item.effective_date).endOf('month');
      allocationsList.push({
        start: moment(item.effective_date).startOf('day'),
        end: nextItem?.effective_date
          ? moment(nextItem.effective_date).startOf('day')
          : moment(item.effective_date).startOf('day').endOf('month'),
        sunday: item.sunday,
        monday: item.monday,
        tuesday: item.tuesday,
        wednesday: item.wednesday,
        thursday: item.thursday,
        friday: item.friday,
        saturday: item.saturday,
      });
    }
    return allocationsList;
  }

  async allocationPercentagesForMonthByDate(daily_goal_allocation) {
    const allocationsList = [];
    for (let i = 0; i < daily_goal_allocation.length; i++) {
      const item = daily_goal_allocation[i];
      const nextItem =
        daily_goal_allocation[i + 1] ??
        moment(item.effective_date).endOf('month');
      allocationsList.push({
        start: moment(item.effective_date).startOf('day'),
        end: nextItem?.effective_date
          ? moment(nextItem.effective_date).startOf('day')
          : moment(item.effective_date).startOf('day').endOf('year'),
        sunday: item.sunday,
        monday: item.monday,
        tuesday: item.tuesday,
        wednesday: item.wednesday,
        thursday: item.thursday,
        friday: item.friday,
        saturday: item.saturday,
      });
    }
    return allocationsList;
  }

  async findAll(
    dailyGoalsCalenderFiltersInterface: DailyGoalsCalenderFiltersInterface
  ) {
    try {
      const { collection_operation, procedure_type, year, tenant_id } =
        dailyGoalsCalenderFiltersInterface;
      let { month } = dailyGoalsCalenderFiltersInterface;

      month++;

      const where = { is_archived: false, tenant: { id: tenant_id } };

      if (month && year) {
        const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD').startOf(
          'day'
        );
        const endDate = moment(startDate).endOf('month');

        Object.assign(where, {
          date: Between(startDate.toDate(), endDate.toDate()),
        });
      }

      const query = `SELECT * FROM monthly_goals mg
      JOIN monthly_goals_collection_operations mgc ON mgc.monthly_goals_id = mg.id
      where
      year=${year} AND
      is_archived=${false} AND
      procedure_type=${procedure_type} AND
      business_unit_id =(${collection_operation}) AND
      tenant_id =(${tenant_id})
      `;

      const monthly_goal = await this.monthlyGoalsRepository.query(query);

      if (monthly_goal.length === 0) {
        throw new HttpException(
          `Calendar does not exists.`,
          HttpStatus.NOT_FOUND
        );
      }

      const monthly_value = monthly_goal?.reduce(
        (partialSum, item) =>
          partialSum +
          item[
            moment(`${year}-${month}-01`, 'YYYY-MM-DD')
              .format('MMMM')
              .toLocaleLowerCase()
          ],
        0
      );
      if (collection_operation) {
        Object.assign(where, {
          collection_operation: {
            id: collection_operation,
          },
        });
      }

      if (procedure_type) {
        Object.assign(where, {
          procedure_type: {
            id: procedure_type,
          },
        });
      }

      const [response, count] =
        await this.dailyGoalsCalenderRepository.findAndCount({
          where,
          relations: ['collection_operation', 'procedure_type'],
          order: { date: 'ASC' },
        });

      const daily_goal_allocation =
        await this.dailyGoalsAllocationRepository.find({
          where: {
            procedure_type: {
              id: procedure_type,
            },
            collection_operation: {
              id: collection_operation,
            },
            year,
            tenant_id: { id: tenant_id },
          },
          order: { effective_date: 'ASC' },
        });

      const dailyPercentagesWithInRange =
        await this.allocationPercentagesForMonthByDate(daily_goal_allocation);
      return {
        status: HttpStatus.OK,
        message: 'Daily Goals Calender Fetched Succesfuly',
        count: count,
        data: response,
        monthly_value,
        daily_percentages: dailyPercentagesWithInRange,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getValuesInWeek(daysValues, start, end) {
    let valuesForWeek = {};
    while (start.toDate() <= end.toDate()) {
      const day = parseInt(moment(start).format('DD'));
      if (daysValues[day])
        valuesForWeek = { ...valuesForWeek, [day]: daysValues[day] };
      start.add(1, 'day');
    }
    return valuesForWeek;
  }

  getPercentageByDate(dailyValues, day, date) {
    // console.log('=====', { day, date, dailyValues });
    for (let i = 0; i < dailyValues.length; i++) {
      const item = dailyValues[i];
      const startDate = parseInt(item.start.format('DD'));
      // const startDay = item.start.format("dddd").toLocaleLowerCase();
      const endDate = parseInt(item.end.format('DD'));
      // console.log({ startDate, endDate });
      // console.log({ item });
      if (date >= startDate && date <= endDate) {
        return item[day];
      }
    }
  }

  getNumberOfDaysBetweenDates = (currentDate, endDate) => {
    let numberOfDays = 0;
    while (currentDate <= endDate) {
      numberOfDays += 1;
      currentDate.add(1, 'day');
    }
    return numberOfDays;
  };

  getPerDayValue = async (
    weeks,
    daysValues,
    collectionOperation,
    procedureType,
    startOfMonth,
    endOfMonth,
    queryRunner,
    tenant_id
  ) => {
    const updatedItems = [];
    const otherItems = [];
    let diffrenceToAllocateToOthers = 0;
    for (let i = 0; i < weeks.length; i++) {
      const currentWeek = weeks[i];
      const weekItems = await this.getValuesInWeek(
        daysValues,
        moment(currentWeek.start),
        moment(currentWeek.end)
      );
      const dailyGoalCalendarItems =
        await this.dailyGoalsCalenderRepository.find({
          select: ['id', 'date', 'goal_amount'],
          where: {
            collection_operation: {
              id: collectionOperation,
            },
            procedure_type: { id: procedureType },
            date: Between(
              currentWeek.start.format('yyyy-MM-DD'),
              currentWeek.end.format('yyyy-MM-DD')
            ),
            is_archived: false,
            tenant: { id: tenant_id },
          },
        });
      for (let i = 0; i < dailyGoalCalendarItems.length; i++) {
        const item = dailyGoalCalendarItems[i];
        const itemDate = parseInt(moment(item.date).format('DD'));
        if (
          weekItems[itemDate.toString()] &&
          item.goal_amount !== weekItems[itemDate.toString()]
        ) {
          diffrenceToAllocateToOthers =
            item.goal_amount - weekItems[itemDate.toString()];
          item.goal_amount = weekItems[itemDate.toString()];
          await queryRunner.manager.save(item);
          updatedItems.push(item);
        } else {
          otherItems.push(item);
        }
      }
    }

    const perDayValue =
      diffrenceToAllocateToOthers /
      (this.getNumberOfDaysBetweenDates(startOfMonth, endOfMonth) -
        updatedItems.length);
    return perDayValue;
  };

  async update(updateCalendarDTO: UpdateDailyGoalsCalendarDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      //   const startOfMonth = moment(
      //     new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
      //   ).startOf('month');
      //   const query = `SELECT * FROM monthly_goals mg
      // JOIN monthly_goals_collection_operations mgc ON mgc.monthly_goals_id = mg.id
      // where
      // year=${updateCalendarDTO.year} AND
      // is_archived=${false} AND
      // procedure_type=${updateCalendarDTO.procedureType} AND
      // business_unit_id = (${updateCalendarDTO.collectionOperation})
      // `;
      //   const monthly_goal = await this.monthlyGoalsRepository.query(query);
      //   if (monthly_goal.length === 0) {
      //     throw new HttpException(
      //       `Month goal for year does not exists.`,
      //       HttpStatus.NOT_FOUND
      //     );
      //   }
      //   const endOfMonth = moment(
      //     new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
      //   ).endOf('month');
      //   // console.log({
      //   //   procedure_type: {
      //   //     id: updateCalendarDTO.procedureType,
      //   //   },
      //   //   collection_operation: {
      //   //     id: updateCalendarDTO.collectionOperation,
      //   //   },
      //   //   effective_date: Between(
      //   //     new Date(startOfMonth.toDate()),
      //   //     new Date(endOfMonth.toDate())
      //   //   ),
      //   //   tenant_id: { id: updateCalendarDTO.tenant_id },
      //   // });

      //   const startOfYear = moment(startOfMonth).startOf('year');
      //   const daily_goal_allocation =
      //     await this.dailyGoalsAllocationRepository.find({
      //       where: {
      //         procedure_type: {
      //           id: updateCalendarDTO.procedureType,
      //         },
      //         collection_operation: {
      //           id: updateCalendarDTO.collectionOperation,
      //         },
      //         effective_date: Between(
      //           new Date(startOfYear.toDate()),
      //           new Date(endOfMonth.toDate())
      //         ),
      //         tenant_id: { id: updateCalendarDTO.tenant_id },
      //       },
      //       order: { effective_date: 'DESC' },
      //       take: 2,
      //     });

      //   // console.log({ daily_goal_allocation });
      //   const dailyValueForEachDay =
      //     await this.allocationPercentagesForMonthByDates(
      //       daily_goal_allocation
      //     );

      //   // console.log({ dailyValueForEachDay });
      //   if (
      //     updateCalendarDTO.allocatedDiffrenceOver === 'week' &&
      //     (updateCalendarDTO.diffrence > 1 || updateCalendarDTO.diffrence < -1)
      //   ) {
      //     // console.log('Allocation Over week');
      //     const weeks = [];
      //     let startOfWeek = moment(
      //       new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
      //     ).startOf('month');
      //     while (startOfWeek.toDate() < endOfMonth.toDate()) {
      //       const endOfWeek = moment(startOfWeek).endOf('week');
      //       weeks.push({ start: moment(startOfWeek), end: moment(endOfWeek) });
      //       startOfWeek = endOfWeek;
      //       startOfWeek.add(1, 'day');
      //     }

      //     for (let i = 0; i < weeks.length; i++) {
      //       const currentWeek = weeks[i];
      //       // console.log({ currentWeek });

      //       const weekItems = await this.getValuesInWeek(
      //         updateCalendarDTO.daysValues,
      //         moment(currentWeek.start),
      //         moment(currentWeek.end)
      //       );

      //       // console.log({ weekItems });

      //       const dailyGoalCalendarItems =
      //         await this.dailyGoalsCalenderRepository.find({
      //           select: ['id', 'date', 'goal_amount'],
      //           where: {
      //             collection_operation: {
      //               id: updateCalendarDTO.collectionOperation,
      //             },
      //             procedure_type_id: { id: updateCalendarDTO.procedureType },
      //             date: Between(
      //               currentWeek.start.format('yyyy-MM-DD'),
      //               currentWeek.end.format('yyyy-MM-DD')
      //             ),
      //             is_archived: false,
      //             tenant: { id: updateCalendarDTO.tenant_id },
      //           },
      //         });

      //       const updatedItems = [];
      //       const otherItems = [];
      //       let allocatedPercentage = 0;
      //       let diffrenceToAllocateToOthers = 0;
      //       for (let i = 0; i < dailyGoalCalendarItems.length; i++) {
      //         const item = dailyGoalCalendarItems[i];
      //         const itemDate = parseInt(moment(item.date).format('DD'));
      //         if (
      //           weekItems[itemDate.toString()] &&
      //           item.goal_amount !== Math.round(weekItems[itemDate.toString()])
      //         ) {
      //           diffrenceToAllocateToOthers =
      //             item.goal_amount - Math.round(weekItems[itemDate.toString()]);

      //           updatedItems.push(item);
      //           item.goal_amount = Math.round(weekItems[itemDate.toString()]);
      //           await queryRunner.manager.save(item);
      //         } else {
      //           otherItems.push(item);
      //           const itemDate = parseInt(moment(item.date).format('DD'));
      //           const itemDay = moment(item.date)
      //             .format('dddd')
      //             .toLocaleLowerCase();
      //           allocatedPercentage += this.getPercentageByDate(
      //             dailyValueForEachDay,
      //             itemDay,
      //             itemDate
      //           );
      //         }
      //       }
      //       const remainingPercentage = 100 - allocatedPercentage;

      //       // console.log({ updatedItems });
      //       // console.log({
      //       //   otherItems,
      //       //   allocatedPercentage,
      //       //   remainingPercentage,
      //       //   diffrenceToAllocateToOthers,
      //       // });

      //       for (const item of otherItems) {
      //         // console.log("item", item);

      //         const itemDate = parseInt(moment(item.date).format('DD'));
      //         const itemDay = moment(item.date)
      //           .format('dddd')
      //           .toLocaleLowerCase();
      //         const allocatedPercentageForDay = this.getPercentageByDate(
      //           dailyValueForEachDay,
      //           itemDay,
      //           itemDate
      //         );
      //         // console.log({
      //         //   dailyValueForEachDay,
      //         //   itemDate,
      //         //   itemDay,
      //         //   allocatedPercentageForDay,
      //         // });

      //         // console.log({ allocatedPercentageForDay });
      //         // console.log({
      //         //   allocatedPercentageForDay,
      //         //   allocatedPercentage,
      //         //   remainingPercentage,
      //         // });
      //         const proportionateAllocation =
      //           (allocatedPercentageForDay / allocatedPercentage) *
      //           (remainingPercentage / 100);
      //         // console.log({ proportionateAllocation });
      //         // console.log(proportionateAllocation + allocatedPercentageForDay);
      //         // console.log(
      //         //   proportionateAllocation + allocatedPercentageForDay / 100
      //         // );
      //         // console.log(
      //         //   (proportionateAllocation + allocatedPercentageForDay / 100) *
      //         //     diffrenceToAllocateToOthers
      //         // );
      //         // console.log({ proportionateAllocation });
      //         const toAddAmount =
      //           (proportionateAllocation + allocatedPercentageForDay / 100) *
      //           diffrenceToAllocateToOthers;
      //         // console.log('----- Goal', item.goal_amount, 'To Add', toAddAmount);
      //         if (item.goal_amount + toAddAmount >= 0) {
      //           item.goal_amount = Math.round(item.goal_amount + toAddAmount);

      //           await queryRunner.manager.save(item);
      //         } else {
      //           throw new HttpException(
      //             'Can not allocate diffrence over week',
      //             HttpStatus.CONFLICT
      //           );
      //         }
      //       }
      //     }
      //   }
      //   if (
      //     updateCalendarDTO.allocatedDiffrenceOver === 'month' &&
      //     (updateCalendarDTO.diffrence > 1 || updateCalendarDTO.diffrence < -1)
      //   ) {
      //     let correctStartDateForAllocation, correctEndDateForAllocation;
      //     const startOfMonth = moment(
      //       new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
      //     ).startOf('month');

      //     const endOfMonth = moment(
      //       new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
      //     ).endOf('month');

      //     const i = moment(
      //       new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
      //     ).endOf('month');

      //     const weeks = [];
      //     let startOfWeek = moment(
      //       new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
      //     ).startOf('month');
      //     while (startOfWeek.toDate() < endOfMonth.toDate()) {
      //       const endOfWeek = moment(startOfWeek).endOf('week');
      //       weeks.push({ start: moment(startOfWeek), end: moment(endOfWeek) });
      //       startOfWeek = endOfWeek;
      //       startOfWeek.add(1, 'day');
      //     }
      //     const updatedItems = [];

      //     for (let i = 0; i < weeks.length; i++) {
      //       const currentWeek = weeks[i];
      //       const weekItems = await this.getValuesInWeek(
      //         updateCalendarDTO.daysValues,
      //         moment(currentWeek.start),
      //         moment(currentWeek.end)
      //       );
      //       const dailyGoalCalendarItems =
      //         await this.dailyGoalsCalenderRepository.find({
      //           where: {
      //             collection_operation: {
      //               id: updateCalendarDTO.collectionOperation,
      //             },
      //             procedure_type_id: { id: updateCalendarDTO.procedureType },
      //             date: Between(
      //               currentWeek.start.format('yyyy-MM-DD'),
      //               currentWeek.end.format('yyyy-MM-DD')
      //             ),
      //             is_archived: false,
      //             tenant: { id: updateCalendarDTO.tenant_id },
      //           },
      //         });

      //       for (let i = 0; i < dailyGoalCalendarItems.length; i++) {
      //         const item = dailyGoalCalendarItems[i];
      //         const itemDate = parseInt(moment(item.date).format('DD'));
      //         if (
      //           weekItems[itemDate.toString()] &&
      //           item.goal_amount !== Math.round(weekItems[itemDate.toString()])
      //         ) {
      //           updatedItems.push(item);
      //           item.goal_amount = Math.round(weekItems[itemDate.toString()]);
      //           await queryRunner.manager.save(item);
      //         }
      //       }
      //     }

      //     // console.log({updatedItems});
      //     const updatedItemDates = updatedItems.map((item) =>
      //       moment(item.date)
      //     );
      //     // console.log({ updatedItemDates });
      //     let breakParent = false;
      //     // console.log({ dailyValueForEachDay });
      //     let sumOfAllocationDaysPercentage = 0;
      //     for (; i >= startOfMonth && !breakParent; i.subtract(1, 'day')) {
      //       let diffrenceForIteration = updateCalendarDTO.diffrence;
      //       // console.log('=====>', { i });
      //       sumOfAllocationDaysPercentage = 0;
      //       for (let j = moment(startOfMonth); j <= i; j.add(1, 'day')) {
      //         // console.log(
      //         //   'Filtered',
      //         //   updatedItemDates.filter((item) => {
      //         //     console.log(
      //         //       item.toString(),
      //         //       j.toString(),
      //         //       item.toString() === j.toString()
      //         //     );
      //         //   })
      //         // );
      //         if (
      //           updatedItemDates.filter(
      //             (item) => item.toString() === j.toString()
      //           ).length === 0
      //         ) {
      //           const itemDate = parseInt(moment(j).format('DD'));
      //           const itemDay = moment(j).format('dddd').toLocaleLowerCase();

      //           const dailyPercentageForDay = this.getPercentageByDate(
      //             dailyValueForEachDay,
      //             itemDay,
      //             itemDate
      //           );
      //           sumOfAllocationDaysPercentage += dailyPercentageForDay;
      //         }
      //       }

      //       // console.log({ sumOfAllocationDaysPercentage });
      //       for (let j = moment(startOfMonth); j <= i; j.add(1, 'day')) {
      //         if (
      //           updatedItemDates.filter(
      //             (item) => item.toString() === j.toString()
      //           ).length === 0
      //         ) {
      //           const itemDate = parseInt(moment(j).format('DD'));
      //           const itemDay = moment(j).format('dddd').toLocaleLowerCase();

      //           const dailyPercentageForDay = this.getPercentageByDate(
      //             dailyValueForEachDay,
      //             itemDay,
      //             itemDate
      //           );
      //           const percentageForAllocation =
      //             (dailyPercentageForDay / sumOfAllocationDaysPercentage) * 100;
      //           const goalDiffrenceToAdd = Math.round(
      //             (percentageForAllocation / 100) * updateCalendarDTO.diffrence
      //           );
      //           if (goalDiffrenceToAdd > 0)
      //             diffrenceForIteration -= goalDiffrenceToAdd;

      //           // console.log({
      //           //   percentageForAllocation,
      //           //   goalDiffrenceToAdd,
      //           //   diffrenceForIteration,
      //           // });
      //           if (diffrenceForIteration === 1) {
      //             correctEndDateForAllocation = moment(j);
      //             correctStartDateForAllocation = moment(startOfMonth);
      //             // console.log(
      //             //   'Result',
      //             //   sumOfAllocationDaysPercentage,
      //             //   correctStartDateForAllocation,
      //             //   correctEndDateForAllocation
      //             // );
      //             breakParent = true;
      //             break;
      //           }
      //         }
      //       }
      //     }

      //     for (
      //       let i = correctStartDateForAllocation;
      //       i <= correctEndDateForAllocation;
      //       i.add(1, 'day')
      //     ) {
      //       let diffrenceForIteration = updateCalendarDTO.diffrence;

      //       if (
      //         updatedItemDates.filter(
      //           (item) => item.toString() === i.toString()
      //         ).length === 0
      //       ) {
      //         const itemDate = parseInt(moment(i).format('DD'));
      //         const itemDay = moment(i).format('dddd').toLocaleLowerCase();

      //         const dailyPercentageForDay = this.getPercentageByDate(
      //           dailyValueForEachDay,
      //           itemDay,
      //           itemDate
      //         );
      //         const percentageForAllocation =
      //           (dailyPercentageForDay / sumOfAllocationDaysPercentage) * 100;
      //         const goalDiffrenceToAdd = Math.round(
      //           (percentageForAllocation / 100) * updateCalendarDTO.diffrence
      //         );
      //         if (goalDiffrenceToAdd > 0) {
      //           diffrenceForIteration -= goalDiffrenceToAdd;
      //           const dailyItemToUpdate =
      //             await this.dailyGoalsCalenderRepository.findOne({
      //               where: {
      //                 collection_operation: {
      //                   id: updateCalendarDTO.collectionOperation,
      //                 },
      //                 procedure_type_id: {
      //                   id: updateCalendarDTO.procedureType,
      //                 },
      //                 date: Equal(i.toDate()),
      //                 is_archived: false,
      //                 tenant: { id: updateCalendarDTO.tenant_id },
      //               },
      //             });
      //           // console.log(dailyItemToUpdate);
      //           dailyItemToUpdate.goal_amount =
      //             dailyItemToUpdate.goal_amount + goalDiffrenceToAdd;
      //           await queryRunner.manager.save(dailyItemToUpdate);
      //         }
      //       }
      //     }
      //   }
      //   await queryRunner.commitTransaction();

      //   await this.dailyGoalsCalenderRepository.update(
      //     {
      //       collection_operation: {
      //         id: updateCalendarDTO.collectionOperation,
      //       },
      //       procedure_type_id: { id: updateCalendarDTO.procedureType },
      //       date: Between(
      //         new Date(
      //           moment(
      //             new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
      //           )
      //             .startOf('month')
      //             .format('yyyy-MM-DD')
      //         ),
      //         new Date(
      //           moment(
      //             new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
      //           )
      //             .endOf('month')
      //             .format('yyyy-MM-DD')
      //         )
      //       ),
      //       is_archived: false,
      //       tenant: { id: updateCalendarDTO.tenant_id },
      //     },
      //     {
      //       is_locked: updateCalendarDTO.isLocked,
      //     }
      //   );
      // } else {
      const start = moment(
        new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
      ).startOf('month');
      const end = moment(
        new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
      ).endOf('month');
      const dailyGoalCalendarItems =
        await this.dailyGoalsCalenderRepository.find({
          where: {
            collection_operation: {
              id: updateCalendarDTO.collectionOperation,
            },
            procedure_type: { id: updateCalendarDTO.procedureType },
            date: Between(start.toDate(), end.toDate()),
            is_archived: false,
            tenant: { id: updateCalendarDTO.tenant_id },
          },
          relations: ['collection_operation', 'procedure_type', 'created_by'],
        });
      for (let i = 0; i < dailyGoalCalendarItems.length; i++) {
        const item = dailyGoalCalendarItems[i];
        const itemDate = parseInt(moment(item.date).format('DD'));
        if (item.goal_amount !== updateCalendarDTO.daysValues[itemDate]) {
          const history = new DailyGoalsCalendersHistory();
          Object.assign(history, item);
          history.id = item.id;
          history.history_reason = 'C';
          history.date = item.date;
          history.tenant_id = item.tenant_id;
          history.created_by = item.created_by.id;
          history.collection_operation = item.collection_operation.id;
          history.procedure_type = item.procedure_type.id;
          history.is_archived = item.is_archived;
          history.is_locked = item.is_locked;
          history.goal_amount = item.goal_amount;
          await this.createHistory(history);
          item.goal_amount = updateCalendarDTO.daysValues[itemDate];
          item.is_locked = updateCalendarDTO.isLocked;
          await queryRunner.manager.save(item);
        } else {
          item.is_locked = updateCalendarDTO.isLocked;
          await queryRunner.manager.save(item);
        }
      }
      await queryRunner.commitTransaction();
      return resSuccess('Daily goals calendar updated.', 'success', 200, {});
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async getRedistributedValues(updateCalendarDTO: UpdateDailyGoalsCalendarDto) {
    const redistrubutesValues = updateCalendarDTO.daysValues;
    try {
      const startOfMonth = moment(
        new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
      ).startOf('month');

      const query = `SELECT * FROM monthly_goals mg
      JOIN monthly_goals_collection_operations mgc ON mgc.monthly_goals_id = mg.id
      where
      year=${updateCalendarDTO.year} AND
      is_archived=${false} AND
      procedure_type=${updateCalendarDTO.procedureType} AND
      business_unit_id = (${updateCalendarDTO.collectionOperation})
      `;

      const monthly_goal = await this.monthlyGoalsRepository.query(query);
      const monthly_value =
        monthly_goal?.[0]?.[moment(startOfMonth).format('MMMM').toLowerCase()];
      const endOfMonth = moment(
        new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
      ).endOf('month');
      console.log(
        `From ${startOfMonth.format('MM-DD-yyyy')} to ${endOfMonth.format(
          'MM-DD-yyyy'
        )} with Monthly Goal of ${monthly_value} and diffrence ${
          updateCalendarDTO.diffrence
        }`
      );
      const startOfYear = moment(startOfMonth).startOf('year');
      const daily_goal_allocation =
        await this.dailyGoalsAllocationRepository.find({
          where: {
            procedure_type: {
              id: updateCalendarDTO.procedureType,
            },
            collection_operation: {
              id: updateCalendarDTO.collectionOperation,
            },
            effective_date: Between(
              new Date(startOfYear.toDate()),
              new Date(endOfMonth.toDate())
            ),
            tenant_id: { id: updateCalendarDTO.tenant_id },
          },
          order: { effective_date: 'DESC' },
          take: 2,
        });

      const dailyValueForEachDay =
        await this.allocationPercentagesForMonthByDates(daily_goal_allocation);

      if (updateCalendarDTO.allocatedDiffrenceOver === 'week') {
        console.log('Allocation Over week');
        const weeks = [];
        let startOfWeek = moment(
          new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
        ).startOf('month');
        while (startOfWeek.toDate() < endOfMonth.toDate()) {
          const endOfWeek = moment(startOfWeek).endOf('week');
          if (endOfWeek.isSameOrBefore(endOfMonth)) {
            weeks.push({ start: moment(startOfWeek), end: moment(endOfWeek) });
          } else {
            weeks.push({ start: moment(startOfWeek), end: moment(endOfMonth) });
          }
          startOfWeek = endOfWeek;
          startOfWeek.add(1, 'day');
        }
        for (let i = 0; i < weeks.length; i++) {
          const currentWeek = weeks[i];
          console.log(
            `Iterating for week of ${currentWeek.start.format(
              'MM-DD-yyyy'
            )} to ${currentWeek.end.format('MM-DD-yyyy')}`
          );
          const weekItems = await this.getValuesInWeek(
            updateCalendarDTO.daysValues,
            moment(currentWeek.start),
            moment(currentWeek.end)
          );

          const dailyGoalCalendarItems =
            await this.dailyGoalsCalenderRepository.find({
              select: ['id', 'date', 'goal_amount'],
              where: {
                collection_operation: {
                  id: updateCalendarDTO.collectionOperation,
                },
                procedure_type: { id: updateCalendarDTO.procedureType },
                date: Between(
                  currentWeek.start.format('yyyy-MM-DD'),
                  currentWeek.end.format('yyyy-MM-DD')
                ),
                is_archived: false,
                tenant: { id: updateCalendarDTO.tenant_id },
              },
            });

          const otherItems = [];
          let allocatedPercentage = 0;
          let diffrenceToAllocateToOthers = 0;
          for (let i = 0; i < dailyGoalCalendarItems.length; i++) {
            const item = dailyGoalCalendarItems[i];
            const itemDate = parseInt(moment(item.date).format('DD'));
            if (
              weekItems[itemDate.toString()] &&
              item.goal_amount !== Math.round(weekItems[itemDate.toString()])
            ) {
              console.log(
                `User updated the item on date ${itemDate} from ${
                  item.goal_amount
                } to ${weekItems[itemDate.toString()]}`
              );
              diffrenceToAllocateToOthers =
                item.goal_amount - Math.round(weekItems[itemDate.toString()]);
              redistrubutesValues[itemDate.toString()] = Math.round(
                weekItems[itemDate.toString()]
              );
            } else {
              otherItems.push(item);
              const itemDate = parseInt(moment(item.date).format('DD'));
              const itemDay = moment(item.date)
                .format('dddd')
                .toLocaleLowerCase();
              allocatedPercentage += this.getPercentageByDate(
                dailyValueForEachDay,
                itemDay,
                itemDate
              );
            }
          }
          const remainingPercentage = 100 - allocatedPercentage;

          console.log(
            `Remaining allocation percentage over week ${allocatedPercentage} to be distributed based on daily alloaction percentage`
          );
          console.log(otherItems);
          for (const item of otherItems) {
            const itemDate = parseInt(moment(item.date).format('DD'));
            const itemDay = moment(item.date)
              .format('dddd')
              .toLocaleLowerCase();
            const allocatedPercentageForDay = this.getPercentageByDate(
              dailyValueForEachDay,
              itemDay,
              itemDate
            );
            console.log(
              `Allocated Percentage for ${itemDate} ${itemDay} is ${allocatedPercentageForDay}`
            );
            const proportionateAllocation =
              (allocatedPercentageForDay / allocatedPercentage) *
              (remainingPercentage / 100);
            const toAddAmount =
              (proportionateAllocation + allocatedPercentageForDay / 100) *
              diffrenceToAllocateToOthers;
            console.log(
              `Adding ${toAddAmount} to ${
                item.goal_amount
              } now becomes ${Math.round(
                item.goal_amount + toAddAmount
              )} on date  ${itemDate} ${itemDay}`
            );
            redistrubutesValues[itemDate.toString()] = Math.round(
              item.goal_amount + toAddAmount
            );
          }
        }
      }
      if (updateCalendarDTO.allocatedDiffrenceOver === 'month') {
        let correctStartDateForAllocation, correctEndDateForAllocation;
        const startOfMonth = moment(
          new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
        ).startOf('month');

        console.log(
          `Allocation Over month for dates ${startOfMonth.format(
            'MM-DD-YYYY'
          )} to ${endOfMonth.format('MM-DD-YYYY')}`
        );

        const i = moment(
          new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
        ).endOf('month');

        const weeks = [];
        let startOfWeek = moment(
          new Date(updateCalendarDTO.year, updateCalendarDTO.month, 1)
        ).startOf('month');

        while (startOfWeek.toDate() < endOfMonth.toDate()) {
          const endOfWeek = moment(startOfWeek).endOf('week');
          if (endOfWeek.isSameOrBefore(endOfMonth)) {
            weeks.push({ start: moment(startOfWeek), end: moment(endOfWeek) });
          } else {
            weeks.push({ start: moment(startOfWeek), end: moment(endOfMonth) });
          }
          startOfWeek = endOfWeek;
          startOfWeek.add(1, 'day');
        }
        const updatedItems = [];

        for (let i = 0; i < weeks.length; i++) {
          const currentWeek = weeks[i];
          // console.log(
          //   `Iterating for week of ${currentWeek.start.format(
          //     'MM-DD-yyyy'
          //   )} to ${currentWeek.end.format('MM-DD-yyyy')}`
          // );
          const weekItems = await this.getValuesInWeek(
            updateCalendarDTO.daysValues,
            moment(currentWeek.start),
            moment(currentWeek.end)
          );
          const dailyGoalCalendarItems =
            await this.dailyGoalsCalenderRepository.find({
              where: {
                collection_operation: {
                  id: updateCalendarDTO.collectionOperation,
                },
                procedure_type: { id: updateCalendarDTO.procedureType },
                date: Between(
                  currentWeek.start.format('yyyy-MM-DD'),
                  currentWeek.end.format('yyyy-MM-DD')
                ),
                is_archived: false,
                tenant: { id: updateCalendarDTO.tenant_id },
              },
            });

          for (let i = 0; i < dailyGoalCalendarItems.length; i++) {
            const item = dailyGoalCalendarItems[i];
            const itemDate = parseInt(moment(item.date).format('DD'));
            if (
              weekItems[itemDate.toString()] &&
              item.goal_amount !== Math.round(weekItems[itemDate.toString()])
            ) {
              console.log(
                `User updated the item on date ${itemDate} from ${
                  item.goal_amount
                } to ${weekItems[itemDate.toString()]}`
              );
              updatedItems.push(item);
              redistrubutesValues[itemDate.toString()] = Math.round(
                weekItems[itemDate.toString()]
              );
            }
          }
        }
        const updatedItemDates = updatedItems.map((item) => moment(item.date));
        let breakParent = false;
        let sumOfAllocationDaysPercentage = 0;
        for (
          const i = moment(endOfMonth);
          i >= startOfMonth && !breakParent;
          i.subtract(1, 'day')
        ) {
          let diffrenceForIteration = updateCalendarDTO.diffrence;
          // console.log(
          //   `Try to allocate the diffrenece ${
          //     updateCalendarDTO.diffrence
          //   } from ${i.format('MM-DD-YYYY')} to ${startOfMonth.format(
          //     'MM-DD-YYYY'
          //   )}`
          // );
          sumOfAllocationDaysPercentage = 0;
          for (let j = moment(startOfMonth); j <= i; j.add(1, 'day')) {
            if (
              updatedItemDates.filter(
                (item) => item.toString() === j.toString()
              ).length === 0
            ) {
              const itemDate = parseInt(moment(j).format('DD'));
              const itemDay = moment(j).format('dddd').toLocaleLowerCase();

              const dailyPercentageForDay = this.getPercentageByDate(
                dailyValueForEachDay,
                itemDay,
                itemDate
              );
              sumOfAllocationDaysPercentage += dailyPercentageForDay;
            }
          }
          // console.log(
          //   `Sum of Allocation percentages from ${startOfMonth.format(
          //     'MM-DD-YYYY'
          //   )} to ${i.format('MM-DD-YYYY')}is ${sumOfAllocationDaysPercentage}`
          // );
          for (let j = moment(startOfMonth); j <= i; j.add(1, 'day')) {
            if (
              updatedItemDates.filter(
                (item) => item.toString() === j.toString()
              ).length === 0
            ) {
              const itemDate = parseInt(moment(j).format('DD'));
              const itemDay = moment(j).format('dddd').toLocaleLowerCase();

              const dailyPercentageForDay = this.getPercentageByDate(
                dailyValueForEachDay,
                itemDay,
                itemDate
              );
              const percentageForAllocation =
                (dailyPercentageForDay / sumOfAllocationDaysPercentage) * 100;
              const goalDiffrenceToAdd = Math.round(
                (percentageForAllocation / 100) * updateCalendarDTO.diffrence
              );
              // console.log(`Goal diffrence to Add ${goalDiffrenceToAdd}`);
              // if (goalDiffrenceToAdd < 0)
              //   diffrenceForIteration -= goalDiffrenceToAdd;
              // else if (goalDiffrenceToAdd > 0)
              diffrenceForIteration -= goalDiffrenceToAdd;
              // console.log(
              //   `Diffrence for Iteration is ${diffrenceForIteration}`
              // );
              if (
                diffrenceForIteration === 1 ||
                diffrenceForIteration === -1 ||
                diffrenceForIteration === 0
              ) {
                correctEndDateForAllocation = moment(j);
                correctStartDateForAllocation = moment(startOfMonth);
                // console.log(
                //   'Result',
                //   sumOfAllocationDaysPercentage,
                //   correctStartDateForAllocation,
                //   correctEndDateForAllocation
                // );
                breakParent = true;
                break;
              }
            }
          }
        }

        // if (correctStartDateForAllocation && correctEndDateForAllocation)
        //   console.log(
        //     `Allocation dates are from ${correctStartDateForAllocation.format(
        //       'MM-DD-YYYY'
        //     )} to ${correctEndDateForAllocation.format('MM-DD-YYYY')}`
        //   );
        for (
          let i = correctStartDateForAllocation;
          i <= correctEndDateForAllocation;
          i.add(1, 'day')
        ) {
          let diffrenceForIteration = updateCalendarDTO.diffrence;

          if (
            updatedItemDates.filter((item) => item.toString() === i.toString())
              .length === 0
          ) {
            const itemDate = parseInt(moment(i).format('DD'));
            const itemDay = moment(i).format('dddd').toLocaleLowerCase();

            const dailyPercentageForDay = this.getPercentageByDate(
              dailyValueForEachDay,
              itemDay,
              itemDate
            );
            const percentageForAllocation =
              (dailyPercentageForDay / sumOfAllocationDaysPercentage) * 100;
            const goalDiffrenceToAdd = Math.round(
              (percentageForAllocation / 100) * updateCalendarDTO.diffrence
            );
            // console.log(`Adding ${goalDiffrenceToAdd} to ${itemDate}`);
            diffrenceForIteration -= goalDiffrenceToAdd;
            const dailyItemToUpdate =
              await this.dailyGoalsCalenderRepository.findOne({
                where: {
                  collection_operation: {
                    id: updateCalendarDTO.collectionOperation,
                  },
                  procedure_type: {
                    id: updateCalendarDTO.procedureType,
                  },
                  date: Equal(i.toDate()),
                  is_archived: false,
                  tenant: { id: updateCalendarDTO.tenant_id },
                },
              });
            // console.log(dailyItemToUpdate);
            redistrubutesValues[itemDate.toString()] =
              dailyItemToUpdate.goal_amount + goalDiffrenceToAdd;
            // dailyItemToUpdate.goal_amount =
            //   dailyItemToUpdate.goal_amount + goalDiffrenceToAdd;
            // await queryRunner.manager.save(dailyItemToUpdate);
          }
        }
      }

      return resSuccess(
        'Daily goals calendar updated distributon.',
        'success',
        200,
        redistrubutesValues
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
    }
  }
}
