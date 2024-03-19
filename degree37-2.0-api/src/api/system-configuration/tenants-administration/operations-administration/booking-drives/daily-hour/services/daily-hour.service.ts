import {
  Inject,
  Injectable,
  Scope,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  EntityManager,
  In,
  IsNull,
  MoreThanOrEqual,
} from 'typeorm';
import moment from 'moment';
import { DailyHour } from '../entities/daily-hour.entity';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { DailyHourDto, UpdateDailyHourDto } from '../dto/daily-hour.dto';
import {
  DailyHourInterface,
  GetByCollectionOperationInterface,
} from '../interface/dailyhour.interface';
import { BusinessUnits } from '../../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { DailyHourHistory } from '../entities/daily-hour-history.entity';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';
import { UserRequest } from '../../../../../../../common/interface/request';

@Injectable({ scope: Scope.REQUEST })
export class DailyHourService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(DailyHour)
    private readonly dailyHourRepository: Repository<DailyHour>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BusinessUnits)
    private readonly businessUnitsRepository: Repository<BusinessUnits>,
    @InjectRepository(DailyHourHistory)
    private readonly dailyHourHistoryRepository: Repository<DailyHourHistory>,
    private readonly entityManager: EntityManager
  ) {}

  async create(dailyHourDto: DailyHourDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await this.userRepository.findOneBy({
        id: dailyHourDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      const { data, collection_operation } = dailyHourDto;
      const businessUnits: any = await this.businessUnitsRepository.findBy({
        id: In(collection_operation),
      });
      if (businessUnits && businessUnits.length < collection_operation.length) {
        throw new HttpException(
          `Some Collection Operations not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      const saveDailyHour = [];
      for (const businessUnit of businessUnits) {
        const dailyHour = new DailyHour();
        dailyHour.mon_earliest_depart_time = data.mon_earliest_depart_time;
        dailyHour.mon_latest_return_time = data.mon_latest_return_time;
        dailyHour.tue_earliest_depart_time = data.tue_earliest_depart_time;
        dailyHour.tue_latest_return_time = data.tue_latest_return_time;
        dailyHour.wed_earliest_depart_time = data.wed_earliest_depart_time;
        dailyHour.wed_latest_return_time = data.wed_latest_return_time;
        dailyHour.thu_earliest_depart_time = data.thu_earliest_depart_time;
        dailyHour.thu_latest_return_time = data.thu_latest_return_time;
        dailyHour.fri_earliest_depart_time = data.fri_earliest_depart_time;
        dailyHour.fri_latest_return_time = data.fri_latest_return_time;
        dailyHour.sat_earliest_depart_time = data.sat_earliest_depart_time;
        dailyHour.sat_latest_return_time = data.sat_latest_return_time;
        dailyHour.sun_earliest_depart_time = data.sun_earliest_depart_time;
        dailyHour.sun_latest_return_time = data.sun_latest_return_time;
        dailyHour.is_current = true;
        dailyHour.effective_date = new Date();
        dailyHour.created_by = user;
        dailyHour.tenant_id = this.request?.user?.tenant?.id;
        dailyHour.collection_operation = [businessUnit];
        const res = await queryRunner.manager.save(dailyHour);
        saveDailyHour.push(res);
      }

      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Daily Hour Created Successfully',
        status_code: 201,
        data: saveDailyHour,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async getAll(dailyHourInterface: DailyHourInterface): Promise<any> {
    try {
      const sortBy = dailyHourInterface?.sortBy;
      const sortOrder = dailyHourInterface?.sortOrder;

      if ((sortBy && !sortOrder) || (sortOrder && !sortBy)) {
        return new HttpException(
          'When selecting sort SortBy & sortOrder is required.',
          HttpStatus.BAD_REQUEST
        );
      }
      const limit: number = dailyHourInterface?.limit
        ? +dailyHourInterface.limit
        : +process.env.PAGE_SIZE;
      const page = dailyHourInterface?.page ? +dailyHourInterface.page : 1;
      const order = this.constructOrder(sortBy, sortOrder);
      const queryBuilder =
        this.dailyHourRepository.createQueryBuilder('dailyHour');
      this.buildWhereClause(dailyHourInterface, queryBuilder);
      const [response, count] = await queryBuilder
        .take(limit)
        .skip((page - 1) * limit)
        .orderBy(order)
        .getManyAndCount();
      return {
        status: HttpStatus.OK,
        response: 'Daily Hour Fetched Successfully',
        count: count,
        data: response,
      };
    } catch (error) {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getByCollectionOperationId(
    dailyHourInterface: GetByCollectionOperationInterface
  ): Promise<any> {
    try {
      console.log(new Date('10-21-2023'));
      const response = await this.dailyHourRepository
        .createQueryBuilder('daily_hours')
        .leftJoinAndSelect(
          'daily_hours.collection_operation',
          'collection_operation'
        )
        .leftJoinAndSelect('daily_hours.tenant', 'tenant')
        .where('collection_operation.id = :collection_operation_id', {
          collection_operation_id: dailyHourInterface.collectionOperation,
        })
        .andWhere(
          '(:checkDate BETWEEN daily_hours.effective_date AND daily_hours.end_date OR (daily_hours.effective_date < :driveDate AND daily_hours.end_date is null))',
          {
            checkDate: moment(dailyHourInterface.driveDate).format(
              'YYYY-MM-DD'
            ),
            driveDate: moment(dailyHourInterface.driveDate).format(
              'YYYY-MM-DD'
            ),
          }
        )
        .getMany();
      return {
        status: HttpStatus.OK,
        response: 'Daily Hour Fetched Successfully',
        data: response,
      };
    } catch (error) {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: any): Promise<any> {
    try {
      const dailyHour = await this.dailyHourRepository.findOne({
        where: { id: id, is_archived: false },
        relations: ['created_by', 'collection_operation', 'tenant'],
      });
      if (!dailyHour) {
        return new HttpException(
          'Daily Hour not found',
          HttpStatus.BAD_REQUEST
        );
      }
      let currentDailyHour;
      if (dailyHour.effective_date) {
        const originalDate = new Date(dailyHour.effective_date);
        originalDate.setDate(originalDate.getDate() - 1);

        const formattedDate = originalDate.toISOString().split('T')[0];
        currentDailyHour = await this.dailyHourRepository.findOne({
          where: {
            end_date: new Date(formattedDate),
            collection_operation: {
              id: dailyHour.collection_operation[0].id,
            },
            is_archived: false,
          },
        });
      }
      const modifiedData: any = await getModifiedDataDetails(
        this.dailyHourHistoryRepository,
        id,
        this.userRepository
      );

      return {
        status: HttpStatus.OK,
        message: 'Daily Hour Fetched Succesfuly',
        data: { ...dailyHour, ...modifiedData },
        currentData: currentDailyHour,
      };
    } catch {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private buildWhereClause(
    dailyHourInterface: DailyHourInterface,
    queryBuilder: any
  ) {
    const currentDate = new Date();
    queryBuilder
      .leftJoinAndSelect(
        'dailyHour.collection_operation',
        'collection_operation'
      )
      .leftJoinAndSelect('dailyHour.tenant', 'tenant')
      .where('dailyHour.tenant_id = :tenantId', {
        tenantId: this.request?.user?.tenant?.id,
      })
      .andWhere('dailyHour.is_archived = false');

    if (dailyHourInterface?.collectionOperation) {
      const collectionOperations = dailyHourInterface.collectionOperation
        .split(',')
        .map((op) => op.trim());
      queryBuilder.andWhere(
        'collection_operation.id IN (:...collectionOperations)',
        {
          collectionOperations,
        }
      );
    }
    if (dailyHourInterface?.keyword) {
      const collectionOperations = dailyHourInterface.keyword.trim();
      queryBuilder.andWhere(
        'collection_operation.name ILIKE :collectionOperation',
        {
          collectionOperation: `%${collectionOperations}%`,
        }
      );
    }

    if (dailyHourInterface?.display) {
      if (dailyHourInterface.display === 'Current') {
        queryBuilder.andWhere('dailyHour.effective_date <= :currentDate', {
          currentDate,
        });
        queryBuilder.andWhere(
          '(dailyHour.end_date > :currentDate OR dailyHour.end_date IS NULL)'
        );
      } else if (dailyHourInterface.display === 'Past') {
        queryBuilder.andWhere('dailyHour.end_date < :currentDate', {
          currentDate,
        });
      } else if (dailyHourInterface.display === 'Scheduled') {
        queryBuilder.andWhere('dailyHour.effective_date > :currentDate', {
          currentDate,
        });
      }
    }
  }

  async update(id: any, updateDailyHourDto: UpdateDailyHourDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const dailyHour = await this.dailyHourRepository.findOne({
        where: { id, is_archived: false },
        relations: ['created_by', 'collection_operation'],
      });
      const shallowCopyDailyHour = { ...dailyHour };
      if (!dailyHour) {
        throw new HttpException(`Daily Hour not found.`, HttpStatus.NOT_FOUND);
      }

      const user = await this.userRepository.findOneBy({
        id: updateDailyHourDto?.created_by,
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      const {
        data,
        effective_date,
        end_date,
        isScheduled = false,
      } = updateDailyHourDto;
      if (isScheduled && effective_date) {
        const overlappingRecord = await this.dailyHourRepository.findOne({
          relations: ['collection_operation'],
          where: {
            effective_date: MoreThanOrEqual(moment(effective_date).toDate()),
            end_date: IsNull(),
            is_archived: false,
            collection_operation: {
              id: dailyHour.collection_operation[0].id,
            },
          },
        });
        if (overlappingRecord) {
          throw new HttpException(
            `${overlappingRecord?.collection_operation.map(
              (e) => e.name
            )} Effective date  overlap with existing record.`,
            HttpStatus.BAD_REQUEST
          );
        }
        if (
          updateDailyHourDto.copy_collection_operations &&
          updateDailyHourDto.copy_collection_operations.length
        ) {
          const businessUnitIds = updateDailyHourDto.copy_collection_operations;

          const allOverlapingRecords = await this.dailyHourRepository.find({
            relations: ['collection_operation'],
            where: {
              collection_operation: {
                id: In(businessUnitIds),
              },
              end_date: IsNull(),
              is_archived: false,
              effective_date: MoreThanOrEqual(moment(effective_date).toDate()),
            },
          });
          const collectionNames = allOverlapingRecords
            ?.map((d) => d.collection_operation)
            .flat()
            .map((d) => d.name);
          if (allOverlapingRecords?.length > 0 && collectionNames?.length > 0) {
            throw new HttpException(
              `${collectionNames.map(
                (name) => name
              )} Effective date overlap with their current records.`,
              HttpStatus.BAD_REQUEST
            );
          }
        }
        const scheduleDailyHour = new DailyHour();
        scheduleDailyHour.mon_earliest_depart_time =
          data.mon_earliest_depart_time;
        scheduleDailyHour.mon_latest_return_time = data.mon_latest_return_time;
        scheduleDailyHour.tue_earliest_depart_time =
          data.tue_earliest_depart_time;
        scheduleDailyHour.tue_latest_return_time = data.tue_latest_return_time;
        scheduleDailyHour.wed_earliest_depart_time =
          data.wed_earliest_depart_time;
        scheduleDailyHour.wed_latest_return_time = data.wed_latest_return_time;
        scheduleDailyHour.thu_earliest_depart_time =
          data.thu_earliest_depart_time;
        scheduleDailyHour.thu_latest_return_time = data.thu_latest_return_time;
        scheduleDailyHour.fri_earliest_depart_time =
          data.fri_earliest_depart_time;
        scheduleDailyHour.fri_latest_return_time = data.fri_latest_return_time;
        scheduleDailyHour.sat_earliest_depart_time =
          data.sat_earliest_depart_time;
        scheduleDailyHour.sat_latest_return_time = data.sat_latest_return_time;
        scheduleDailyHour.sun_earliest_depart_time =
          data.sun_earliest_depart_time;
        scheduleDailyHour.sun_latest_return_time = data.sun_latest_return_time;
        scheduleDailyHour.effective_date = effective_date;
        scheduleDailyHour.created_by = user;
        scheduleDailyHour.collection_operation = dailyHour.collection_operation;
        scheduleDailyHour.tenant_id = this.request?.user?.tenant?.id;
        await this.dailyHourRepository.save(scheduleDailyHour);
        const formattedDate = moment(effective_date)
          .subtract(1, 'days')
          .toDate();
        dailyHour.end_date = new Date(formattedDate);
        if (dailyHour.is_current) {
          dailyHour.is_current = false;
        }
        await this.dailyHourRepository.save(dailyHour);
      }
      let updatedDailyHour;
      if (!isScheduled) {
        dailyHour.mon_earliest_depart_time = data.mon_earliest_depart_time;
        dailyHour.mon_latest_return_time = data.mon_latest_return_time;
        dailyHour.tue_earliest_depart_time = data.tue_earliest_depart_time;
        dailyHour.tue_latest_return_time = data.tue_latest_return_time;
        dailyHour.wed_earliest_depart_time = data.wed_earliest_depart_time;
        dailyHour.wed_latest_return_time = data.wed_latest_return_time;
        dailyHour.thu_earliest_depart_time = data.thu_earliest_depart_time;
        dailyHour.thu_latest_return_time = data.thu_latest_return_time;
        dailyHour.fri_earliest_depart_time = data.fri_earliest_depart_time;
        dailyHour.fri_latest_return_time = data.fri_latest_return_time;
        dailyHour.sat_earliest_depart_time = data.sat_earliest_depart_time;
        dailyHour.sat_latest_return_time = data.sat_latest_return_time;
        dailyHour.sun_earliest_depart_time = data.sun_earliest_depart_time;
        dailyHour.sun_latest_return_time = data.sun_latest_return_time;
        updatedDailyHour = await this.dailyHourRepository.save(dailyHour);
      }

      if (
        updateDailyHourDto.copy_collection_operations &&
        updateDailyHourDto.copy_collection_operations.length
      ) {
        const idsToUpdate = updateDailyHourDto.copy_collection_operations;
        const businessUnits: any = await this.businessUnitsRepository.findBy({
          id: In(idsToUpdate),
        });

        if (
          businessUnits &&
          businessUnits.length <
            updateDailyHourDto.copy_collection_operations.length
        ) {
          throw new HttpException(
            `Some Collection Operations not found.`,
            HttpStatus.NOT_FOUND
          );
        }

        for (const businessUnit of businessUnits) {
          const dailyHour = await this.dailyHourRepository.findOne({
            where: {
              collection_operation: {
                id: businessUnit.id,
              },
              end_date: IsNull(),
              is_archived: false,
            },
            relations: ['collection_operation'],
          });
          if (dailyHour) {
            if (isScheduled && dailyHour.effective_date && !end_date) {
              const scheduleDailyHour = new DailyHour();
              scheduleDailyHour.mon_earliest_depart_time =
                data.mon_earliest_depart_time;
              scheduleDailyHour.mon_latest_return_time =
                data.mon_latest_return_time;
              scheduleDailyHour.tue_earliest_depart_time =
                data.tue_earliest_depart_time;
              scheduleDailyHour.tue_latest_return_time =
                data.tue_latest_return_time;
              scheduleDailyHour.wed_earliest_depart_time =
                data.wed_earliest_depart_time;
              scheduleDailyHour.wed_latest_return_time =
                data.wed_latest_return_time;
              scheduleDailyHour.thu_earliest_depart_time =
                data.thu_earliest_depart_time;
              scheduleDailyHour.thu_latest_return_time =
                data.thu_latest_return_time;
              scheduleDailyHour.fri_earliest_depart_time =
                data.fri_earliest_depart_time;
              scheduleDailyHour.fri_latest_return_time =
                data.fri_latest_return_time;
              scheduleDailyHour.sat_earliest_depart_time =
                data.sat_earliest_depart_time;
              scheduleDailyHour.sat_latest_return_time =
                data.sat_latest_return_time;
              scheduleDailyHour.sun_earliest_depart_time =
                data.sun_earliest_depart_time;
              scheduleDailyHour.sun_latest_return_time =
                data.sun_latest_return_time;
              scheduleDailyHour.effective_date = effective_date;
              scheduleDailyHour.created_by = user;
              scheduleDailyHour.collection_operation =
                dailyHour.collection_operation;
              scheduleDailyHour.tenant_id = this.request?.user?.tenant?.id;
              await this.dailyHourRepository.save(scheduleDailyHour);
              const formattedDate = moment(effective_date)
                .subtract(1, 'days')
                .toDate();
              dailyHour.end_date = new Date(formattedDate);
              if (dailyHour.is_current) {
                dailyHour.is_current = false;
              }
              await this.dailyHourRepository.save(dailyHour);
            }
            dailyHour.mon_earliest_depart_time = data.mon_earliest_depart_time;
            dailyHour.mon_latest_return_time = data.mon_latest_return_time;
            dailyHour.tue_earliest_depart_time = data.tue_earliest_depart_time;
            dailyHour.tue_latest_return_time = data.tue_latest_return_time;
            dailyHour.wed_earliest_depart_time = data.wed_earliest_depart_time;
            dailyHour.wed_latest_return_time = data.wed_latest_return_time;
            dailyHour.thu_earliest_depart_time = data.thu_earliest_depart_time;
            dailyHour.thu_latest_return_time = data.thu_latest_return_time;
            dailyHour.fri_earliest_depart_time = data.fri_earliest_depart_time;
            dailyHour.fri_latest_return_time = data.fri_latest_return_time;
            dailyHour.sat_earliest_depart_time = data.sat_earliest_depart_time;
            dailyHour.sat_latest_return_time = data.sat_latest_return_time;
            dailyHour.sun_earliest_depart_time = data.sun_earliest_depart_time;
            dailyHour.sun_latest_return_time = data.sun_latest_return_time;
            await this.dailyHourRepository.save(dailyHour);
          } else {
            const newDailyHour = new DailyHour();
            newDailyHour.effective_date = effective_date;
            newDailyHour.mon_earliest_depart_time =
              data.mon_earliest_depart_time;
            newDailyHour.mon_latest_return_time = data.mon_latest_return_time;
            newDailyHour.tue_earliest_depart_time =
              data.tue_earliest_depart_time;
            newDailyHour.tue_latest_return_time = data.tue_latest_return_time;
            newDailyHour.wed_earliest_depart_time =
              data.wed_earliest_depart_time;
            newDailyHour.wed_latest_return_time = data.wed_latest_return_time;
            newDailyHour.thu_earliest_depart_time =
              data.thu_earliest_depart_time;
            newDailyHour.thu_latest_return_time = data.thu_latest_return_time;
            newDailyHour.fri_earliest_depart_time =
              data.fri_earliest_depart_time;
            newDailyHour.fri_latest_return_time = data.fri_latest_return_time;
            newDailyHour.sat_earliest_depart_time =
              data.sat_earliest_depart_time;
            newDailyHour.sat_latest_return_time = data.sat_latest_return_time;
            newDailyHour.sun_earliest_depart_time =
              data.sun_earliest_depart_time;
            newDailyHour.sun_latest_return_time = data.sun_latest_return_time;
            newDailyHour.created_by = user;
            newDailyHour.tenant_id = this.request?.user?.tenant?.id;
            newDailyHour.collection_operation = [businessUnit];
            await this.dailyHourRepository.save(newDailyHour);
          }
        }
      }
      if (updatedDailyHour) {
        await this.updateDailyHourHistory({
          ...shallowCopyDailyHour,
          updatedBy: updateDailyHourDto.updated_by,
        });
      }
      await queryRunner.commitTransaction();
      return {
        status: 'Success',
        response: 'Resource updated',
        status_code: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  private constructOrder(
    sortBy: string,
    sortOrder: string | undefined
  ): Record<string, 'ASC' | 'DESC'> {
    if (sortBy === 'name' && sortOrder) {
      return {
        'collection_operation.name': sortOrder.toUpperCase() as 'ASC' | 'DESC',
      };
    } else if (sortOrder) {
      return {
        [`dailyHour.${sortBy}`]: sortOrder.toUpperCase() as 'ASC' | 'DESC',
      };
    } else {
      return { 'dailyHour.id': 'DESC' };
    }
  }
  async updateDailyHourHistory(data: any) {
    const dailyHourHistoryC = new DailyHourHistory();
    dailyHourHistoryC.id = data?.id;
    dailyHourHistoryC.collection_operation = data?.collection_operation;
    dailyHourHistoryC.effective_start_date = data?.effective_date;
    dailyHourHistoryC.effective_end_date = data?.end_date;
    dailyHourHistoryC.created_at = new Date();
    dailyHourHistoryC.sun_earliest_depart_time = data?.sun_earliest_depart_time;
    dailyHourHistoryC.fri_earliest_depart_time = data?.fri_earliest_depart_time;
    dailyHourHistoryC.wed_latest_return_time = data?.wed_latest_return_time;
    dailyHourHistoryC.wed_earliest_depart_time = data?.wed_earliest_depart_time;
    dailyHourHistoryC.wed_latest_return_time = data?.wed_latest_return_time;
    dailyHourHistoryC.sun_latest_return_time = data?.sun_latest_return_time;
    dailyHourHistoryC.mon_earliest_depart_time = data?.mon_earliest_depart_time;
    dailyHourHistoryC.mon_latest_return_time = data?.mon_latest_return_time;
    dailyHourHistoryC.tue_earliest_depart_time = data?.tue_earliest_depart_time;
    dailyHourHistoryC.tue_latest_return_time = data?.tue_latest_return_time;
    dailyHourHistoryC.thu_earliest_depart_time = data?.thu_earliest_depart_time;
    dailyHourHistoryC.thu_latest_return_time = data?.thu_latest_return_time;
    dailyHourHistoryC.fri_latest_return_time = data?.fri_latest_return_time;
    dailyHourHistoryC.sat_earliest_depart_time = data?.sat_earliest_depart_time;
    dailyHourHistoryC.sat_latest_return_time = data?.sat_latest_return_time;
    dailyHourHistoryC.created_by = data?.updatedBy;
    dailyHourHistoryC.tenant_id = data?.tenant_id;
    dailyHourHistoryC.history_reason = 'C';
    await this.dailyHourHistoryRepository.save(dailyHourHistoryC);
  }

  async deleteDailyHour(id: any) {
    const dailyHour = await this.dailyHourRepository.findOne({
      where: {
        id,
      },
    });

    if (!dailyHour) {
      return resError('Daily Hour not found', ErrorConstants.Error, 404);
    }

    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const updatedDailyCapacity = {
        is_archived: true,
      };
      await this.dailyHourRepository.update({ id }, updatedDailyCapacity);

      await queryRunner.commitTransaction();

      return resSuccess('Daily Hour Archived Successfully', 'success', 204, {});
    } catch (error) {
      await queryRunner.rollbackTransaction();
      resError('Internel Server Error', ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
}
