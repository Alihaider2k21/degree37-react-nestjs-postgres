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
import { UserRequest } from '../../../../../../../common/interface/request';
import { DailyCapacity } from '../entities/daily-capacity.entity';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import {
  DailyCapacityDto,
  UpdateDailyCapacityDto,
} from '../dto/daily-capacity.dto';
import { DailyCapacityInterface } from '../interface/dailycapacity.interface';
import { BusinessUnits } from '../../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { DailyCapacityHistory } from '../entities/daily-capacity-history.entity';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';
import {
  resError,
  resSuccess,
} from '../../../../../../system-configuration/helpers/response';

@Injectable({ scope: Scope.REQUEST })
export class DailyCapacityService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(DailyCapacity)
    private readonly dailyCapacityRepository: Repository<DailyCapacity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BusinessUnits)
    private readonly businessUnitsRepository: Repository<BusinessUnits>,
    @InjectRepository(DailyCapacityHistory)
    private readonly dailyCapacityHistoryRepository: Repository<DailyCapacityHistory>,
    private readonly entityManager: EntityManager
  ) {}

  async create(dailyCapacityDto: DailyCapacityDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await this.userRepository.findOneBy({
        id: dailyCapacityDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      const { data, collection_operation } = dailyCapacityDto;
      const businessUnits: any = await this.businessUnitsRepository.findBy({
        id: In(collection_operation),
      });
      if (businessUnits && businessUnits.length < collection_operation.length) {
        throw new HttpException(
          `Some Collection Operations not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      const saveDailyCapacity = [];
      for (const businessUnit of businessUnits) {
        const dailyCapacity = new DailyCapacity();
        dailyCapacity.mon_max_drives = data.mon_max_drives;
        dailyCapacity.mon_max_staff = data.mon_max_staff;
        dailyCapacity.tue_max_drives = data.tue_max_drives;
        dailyCapacity.tue_max_staff = data.tue_max_staff;
        dailyCapacity.wed_max_drives = data.wed_max_drives;
        dailyCapacity.wed_max_staff = data.wed_max_staff;
        dailyCapacity.thur_max_drives = data.thur_max_drives;
        dailyCapacity.thur_max_staff = data.thur_max_staff;
        dailyCapacity.fri_max_drives = data.fri_max_drives;
        dailyCapacity.fri_max_staff = data.fri_max_staff;
        dailyCapacity.sat_max_drives = data.sat_max_drives;
        dailyCapacity.sat_max_staff = data.sat_max_staff;
        dailyCapacity.sun_max_drives = data.sun_max_drives;
        dailyCapacity.sun_max_staff = data.sun_max_staff;
        dailyCapacity.created_by = user;
        dailyCapacity.is_current = true;
        dailyCapacity.effective_date = new Date();
        dailyCapacity.tenant_id = this.request?.user?.tenant?.id;
        dailyCapacity.collection_operation = [businessUnit];
        const saveDailyCapacityData = await queryRunner.manager.save(
          dailyCapacity
        );
        saveDailyCapacity.push(saveDailyCapacityData);
      }
      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Daily Capacity Created Successfully',
        status_code: 201,
        data: saveDailyCapacity,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async getAllDailyCapacities(
    dailyCapacityInterface: DailyCapacityInterface
  ): Promise<any> {
    try {
      const sortBy = dailyCapacityInterface?.sortBy;
      const sortOrder = dailyCapacityInterface?.sortOrder;

      if ((sortBy && !sortOrder) || (sortOrder && !sortBy)) {
        return new HttpException(
          'When selecting sort SortBy & sortOrder is required.',
          HttpStatus.BAD_REQUEST
        );
      }
      const limit: number = dailyCapacityInterface?.limit
        ? +dailyCapacityInterface.limit
        : +process.env.PAGE_SIZE;
      const page = dailyCapacityInterface?.page
        ? +dailyCapacityInterface.page
        : 1;
      const order = this.constructOrder(sortBy, sortOrder);
      const queryBuilder =
        this.dailyCapacityRepository.createQueryBuilder('dailyCapacity');
      this.buildWhereClause(dailyCapacityInterface, queryBuilder);
      const [response, count] = await queryBuilder
        .take(limit)
        .skip((page - 1) * limit)
        .orderBy(order)
        .getManyAndCount();

      return {
        status: HttpStatus.OK,
        response: 'Daily Capacity Fetched Successfully',
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

  async findOne(id: any): Promise<any> {
    try {
      const dailyCapacity = await this.dailyCapacityRepository.findOne({
        where: { id: id, is_archived: false },
        relations: ['created_by', 'collection_operation', 'tenant'],
      });

      if (!dailyCapacity) {
        return new HttpException(
          'Daily Capacity not found',
          HttpStatus.BAD_REQUEST
        );
      }

      let currentDailyCapacity;
      if (dailyCapacity.effective_date) {
        const originalDate = new Date(dailyCapacity.effective_date);
        originalDate.setDate(originalDate.getDate() - 1);

        const formattedDate = originalDate.toISOString().split('T')[0];
        currentDailyCapacity = await this.dailyCapacityRepository.findOne({
          where: {
            end_date: new Date(formattedDate),
            collection_operation: {
              id: dailyCapacity.collection_operation[0].id,
            },
            is_archived: false,
          },
        });
      }
      const modifiedData: any = await getModifiedDataDetails(
        this.dailyCapacityHistoryRepository,
        id,
        this.userRepository
      );

      return {
        status: HttpStatus.OK,
        message: 'Daily Capacity Fetched Succesfuly',
        data: { ...dailyCapacity, ...modifiedData },
        currentData: currentDailyCapacity,
      };
    } catch {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private buildWhereClause(
    dailyCapacityInterface: DailyCapacityInterface,
    queryBuilder: any
  ) {
    const currentDate = new Date();
    queryBuilder
      .leftJoinAndSelect(
        'dailyCapacity.collection_operation',
        'collection_operation'
      )
      .leftJoinAndSelect('dailyCapacity.tenant', 'tenant')
      .where('dailyCapacity.tenant_id = :tenantId', {
        tenantId: this.request?.user?.tenant?.id,
      })
      .andWhere('dailyCapacity.is_archived = false');

    if (dailyCapacityInterface?.collectionOperation) {
      const collectionOperations = dailyCapacityInterface.collectionOperation
        .split(',')
        .map((op) => op.trim());
      queryBuilder.andWhere(
        'collection_operation.id IN (:...collectionOperations)',
        {
          collectionOperations,
        }
      );
    }
    if (dailyCapacityInterface?.keyword) {
      const collectionOperations = dailyCapacityInterface.keyword.trim();
      queryBuilder.andWhere(
        'collection_operation.name ILIKE :collectionOperation',
        {
          collectionOperation: `%${collectionOperations}%`,
        }
      );
    }

    if (dailyCapacityInterface?.display) {
      if (dailyCapacityInterface.display === 'Current') {
        queryBuilder.andWhere('dailyCapacity.effective_date <= :currentDate', {
          currentDate,
        });
        queryBuilder.andWhere(
          '(dailyCapacity.end_date > :currentDate OR dailyCapacity.end_date IS NULL)'
        );
      } else if (dailyCapacityInterface.display === 'Past') {
        queryBuilder.andWhere('dailyCapacity.end_date < :currentDate', {
          currentDate,
        });
      } else if (dailyCapacityInterface.display === 'Scheduled') {
        queryBuilder.andWhere('dailyCapacity.effective_date > :currentDate', {
          currentDate,
        });
      }
    }
  }
  async update(id: any, updateDailyCapacityDto: UpdateDailyCapacityDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const dailyCapacity = await this.dailyCapacityRepository.findOne({
        where: { id, is_archived: false },
        relations: ['created_by', 'collection_operation'],
      });

      if (!dailyCapacity) {
        throw new HttpException(
          `Daily Capacity not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      const shallowCopyDailyCapacity = { ...dailyCapacity };
      const user = await this.userRepository.findOneBy({
        id: updateDailyCapacityDto?.created_by,
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      const {
        data,
        effective_date,
        end_date,
        isScheduled = false,
      } = updateDailyCapacityDto;
      if (isScheduled && effective_date) {
        const overlappingRecord = await this.dailyCapacityRepository.findOne({
          relations: ['collection_operation'],
          where: {
            effective_date: MoreThanOrEqual(moment(effective_date).toDate()),
            end_date: IsNull(),
            is_archived: false,
            collection_operation: {
              id: dailyCapacity.collection_operation[0].id,
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
          updateDailyCapacityDto.copy_collection_operations &&
          updateDailyCapacityDto.copy_collection_operations.length
        ) {
          const businessUnitIds =
            updateDailyCapacityDto.copy_collection_operations;
          const allOverlapingRecords = await this.dailyCapacityRepository.find({
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
              )} Effective date  overlap with their current records.`,
              HttpStatus.BAD_REQUEST
            );
          }
        }
        const scheduleDailyCapacity = new DailyCapacity();
        scheduleDailyCapacity.mon_max_drives = data.mon_max_drives;
        scheduleDailyCapacity.mon_max_staff = data.mon_max_staff;
        scheduleDailyCapacity.tue_max_drives = data.tue_max_drives;
        scheduleDailyCapacity.tue_max_staff = data.tue_max_staff;
        scheduleDailyCapacity.wed_max_drives = data.wed_max_drives;
        scheduleDailyCapacity.wed_max_staff = data.wed_max_staff;
        scheduleDailyCapacity.thur_max_drives = data.thur_max_drives;
        scheduleDailyCapacity.thur_max_staff = data.thur_max_staff;
        scheduleDailyCapacity.fri_max_drives = data.fri_max_drives;
        scheduleDailyCapacity.fri_max_staff = data.fri_max_staff;
        scheduleDailyCapacity.sat_max_drives = data.sat_max_drives;
        scheduleDailyCapacity.sat_max_staff = data.sat_max_staff;
        scheduleDailyCapacity.sun_max_drives = data.sun_max_drives;
        scheduleDailyCapacity.sun_max_staff = data.sun_max_staff;
        scheduleDailyCapacity.effective_date = effective_date;
        scheduleDailyCapacity.tenant_id = this.request?.user?.tenant?.id;
        scheduleDailyCapacity.created_by = user;
        scheduleDailyCapacity.collection_operation =
          dailyCapacity.collection_operation;

        await this.dailyCapacityRepository.save(scheduleDailyCapacity);
        const formattedDate = moment(effective_date)
          .subtract(1, 'days')
          .toDate();
        dailyCapacity.end_date = new Date(formattedDate);
        if (dailyCapacity.is_current) {
          dailyCapacity.is_current = false;
        }
        await this.dailyCapacityRepository.save(dailyCapacity);
      }
      let updatedDailyCapacity;
      if (!isScheduled) {
        dailyCapacity.mon_max_drives = data.mon_max_drives;
        dailyCapacity.mon_max_staff = data.mon_max_staff;
        dailyCapacity.tue_max_drives = data.tue_max_drives;
        dailyCapacity.tue_max_staff = data.tue_max_staff;
        dailyCapacity.wed_max_drives = data.wed_max_drives;
        dailyCapacity.wed_max_staff = data.wed_max_staff;
        dailyCapacity.thur_max_drives = data.thur_max_drives;
        dailyCapacity.thur_max_staff = data.thur_max_staff;
        dailyCapacity.fri_max_drives = data.fri_max_drives;
        dailyCapacity.fri_max_staff = data.fri_max_staff;
        dailyCapacity.sat_max_drives = data.sat_max_drives;
        dailyCapacity.sat_max_staff = data.sat_max_staff;
        dailyCapacity.sun_max_drives = data.sun_max_drives;
        dailyCapacity.sun_max_staff = data.sun_max_staff;
        updatedDailyCapacity = await this.dailyCapacityRepository.save(
          dailyCapacity
        );
      }

      if (
        updateDailyCapacityDto.copy_collection_operations &&
        updateDailyCapacityDto.copy_collection_operations.length
      ) {
        const idsToUpdate = updateDailyCapacityDto.copy_collection_operations;
        const businessUnits: any = await this.businessUnitsRepository.findBy({
          id: In(idsToUpdate),
        });

        if (
          businessUnits &&
          businessUnits.length <
            updateDailyCapacityDto.copy_collection_operations.length
        ) {
          throw new HttpException(
            `Some Collection Operations not found.`,
            HttpStatus.NOT_FOUND
          );
        }

        for (const businessUnit of businessUnits) {
          const CopyDailyCapacity = await this.dailyCapacityRepository.findOne({
            where: {
              collection_operation: {
                id: businessUnit.id,
              },
              end_date: IsNull(),
              is_archived: false,
            },
            relations: ['collection_operation'],
          });
          if (CopyDailyCapacity) {
            if (isScheduled && CopyDailyCapacity.effective_date && !end_date) {
              const scheduleDailyCapacity = new DailyCapacity();
              scheduleDailyCapacity.mon_max_drives = data.mon_max_drives;
              scheduleDailyCapacity.mon_max_staff = data.mon_max_staff;
              scheduleDailyCapacity.tue_max_drives = data.tue_max_drives;
              scheduleDailyCapacity.tue_max_staff = data.tue_max_staff;
              scheduleDailyCapacity.wed_max_drives = data.wed_max_drives;
              scheduleDailyCapacity.wed_max_staff = data.wed_max_staff;
              scheduleDailyCapacity.thur_max_drives = data.thur_max_drives;
              scheduleDailyCapacity.thur_max_staff = data.thur_max_staff;
              scheduleDailyCapacity.fri_max_drives = data.fri_max_drives;
              scheduleDailyCapacity.fri_max_staff = data.fri_max_staff;
              scheduleDailyCapacity.sat_max_drives = data.sat_max_drives;
              scheduleDailyCapacity.sat_max_staff = data.sat_max_staff;
              scheduleDailyCapacity.sun_max_drives = data.sun_max_drives;
              scheduleDailyCapacity.sun_max_staff = data.sun_max_staff;
              scheduleDailyCapacity.effective_date = effective_date;
              scheduleDailyCapacity.tenant_id = this.request?.user?.tenant?.id;
              scheduleDailyCapacity.created_by = user;
              scheduleDailyCapacity.collection_operation =
                CopyDailyCapacity.collection_operation;

              await this.dailyCapacityRepository.save(scheduleDailyCapacity);
              const formattedDate = moment(effective_date)
                .subtract(1, 'days')
                .toDate();
              CopyDailyCapacity.end_date = new Date(formattedDate);
              if (CopyDailyCapacity.is_current) {
                CopyDailyCapacity.is_current = false;
              }
              await this.dailyCapacityRepository.save(CopyDailyCapacity);
            }
            CopyDailyCapacity.mon_max_drives = data.mon_max_drives;
            CopyDailyCapacity.mon_max_staff = data.mon_max_staff;
            CopyDailyCapacity.tue_max_drives = data.tue_max_drives;
            CopyDailyCapacity.tue_max_staff = data.tue_max_staff;
            CopyDailyCapacity.wed_max_drives = data.wed_max_drives;
            CopyDailyCapacity.wed_max_staff = data.wed_max_staff;
            CopyDailyCapacity.thur_max_drives = data.thur_max_drives;
            CopyDailyCapacity.thur_max_staff = data.thur_max_staff;
            CopyDailyCapacity.fri_max_drives = data.fri_max_drives;
            CopyDailyCapacity.fri_max_staff = data.fri_max_staff;
            CopyDailyCapacity.sat_max_drives = data.sat_max_drives;
            CopyDailyCapacity.sat_max_staff = data.sat_max_staff;
            CopyDailyCapacity.sun_max_drives = data.sun_max_drives;
            CopyDailyCapacity.sun_max_staff = data.sun_max_staff;
            await this.dailyCapacityRepository.save(CopyDailyCapacity);
          } else {
            const newDailyCapacity = new DailyCapacity();
            newDailyCapacity.effective_date = effective_date;
            newDailyCapacity.mon_max_drives = data.mon_max_drives;
            newDailyCapacity.mon_max_staff = data.mon_max_staff;
            newDailyCapacity.tue_max_drives = data.tue_max_drives;
            newDailyCapacity.tue_max_staff = data.tue_max_staff;
            newDailyCapacity.wed_max_drives = data.wed_max_drives;
            newDailyCapacity.wed_max_staff = data.wed_max_staff;
            newDailyCapacity.thur_max_drives = data.thur_max_drives;
            newDailyCapacity.thur_max_staff = data.thur_max_staff;
            newDailyCapacity.fri_max_drives = data.fri_max_drives;
            newDailyCapacity.fri_max_staff = data.fri_max_staff;
            newDailyCapacity.sat_max_drives = data.sat_max_drives;
            newDailyCapacity.sat_max_staff = data.sat_max_staff;
            newDailyCapacity.sun_max_drives = data.sun_max_drives;
            newDailyCapacity.sun_max_staff = data.sun_max_staff;
            newDailyCapacity.created_by = user;
            newDailyCapacity.tenant_id = this.request?.user?.tenant?.id;
            newDailyCapacity.collection_operation = [businessUnit];
            await this.dailyCapacityRepository.save(newDailyCapacity);
          }
        }
      }
      if (updatedDailyCapacity) {
        await this.updateDailyCapacityHistory({
          ...shallowCopyDailyCapacity,
          updatedBy: updateDailyCapacityDto.updated_by,
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
        [`dailyCapacity.${sortBy}`]: sortOrder.toUpperCase() as 'ASC' | 'DESC',
      };
    } else {
      return { 'dailyCapacity.id': 'DESC' };
    }
  }

  async updateDailyCapacityHistory(data: any) {
    const dailyCapacityHistoryC = new DailyCapacityHistory();
    dailyCapacityHistoryC.id = data?.id;
    dailyCapacityHistoryC.collection_operation = data?.collection_operation;
    dailyCapacityHistoryC.effective_start_date = data?.effective_date;
    dailyCapacityHistoryC.effective_end_date = data?.end_date;
    dailyCapacityHistoryC.created_at = new Date();
    dailyCapacityHistoryC.sun_max_drives = data?.sun_max_drives;
    dailyCapacityHistoryC.fri_max_drives = data?.fri_max_drives;
    dailyCapacityHistoryC.wed_max_staff = data?.wed_max_staff;
    dailyCapacityHistoryC.wed_max_drives = data?.wed_max_drives;
    dailyCapacityHistoryC.wed_max_staff = data?.wed_max_staff;
    dailyCapacityHistoryC.sun_max_staff = data?.sun_max_staff;
    dailyCapacityHistoryC.mon_max_drives = data?.mon_max_drives;
    dailyCapacityHistoryC.mon_max_staff = data?.mon_max_staff;
    dailyCapacityHistoryC.tue_max_drives = data?.tue_max_drives;
    dailyCapacityHistoryC.tue_max_staff = data?.tue_max_staff;
    dailyCapacityHistoryC.thur_max_drives = data?.thur_max_drives;
    dailyCapacityHistoryC.thur_max_staff = data?.thur_max_staff;
    dailyCapacityHistoryC.fri_max_staff = data?.fri_max_staff;
    dailyCapacityHistoryC.sat_max_drives = data?.sat_max_drives;
    dailyCapacityHistoryC.sat_max_staff = data?.sat_max_staff;
    dailyCapacityHistoryC.created_by = data?.updatedBy;
    dailyCapacityHistoryC.tenant_id = data?.tenant_id;
    dailyCapacityHistoryC.history_reason = 'C';
    await this.dailyCapacityHistoryRepository.save(dailyCapacityHistoryC);
  }

  async deleteDailyCapacity(id: any) {
    const dailyCapacity = await this.dailyCapacityRepository.findOne({
      where: {
        id,
      },
    });

    if (!dailyCapacity) {
      return resError('Daily Capacity not found', ErrorConstants.Error, 404);
    }

    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const updatedDailyCapacity = {
        is_archived: true,
      };
      await this.dailyCapacityRepository.update({ id }, updatedDailyCapacity);

      await queryRunner.commitTransaction();

      return resSuccess(
        'Daily Capacity Archived Successfully',
        'success',
        204,
        {}
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      resError('Internel Server Error', ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
}
