import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  Repository,
  ILike,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  LessThan,
} from 'typeorm';
import { CloseDate } from '../entities/close-date.entity';
import { CloseDateHistory } from '../entities/close-date-history.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  Scope,
  NotFoundException,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SuccessConstants } from '../../../../../constants/success.constants';
import { resError, resSuccess } from '../../../../../helpers/response';
import { ErrorConstants } from '../../../../../constants/error.constants';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { CloseDateCollectionOperation } from '../entities/close-date-collection-operations.entity';
import { CloseDateDto } from '../dto/close-date.dto';
import {
  CloseDateInterface,
  DateClosedInterface,
} from '../interface/close-date.interface';
import { HistoryService } from 'src/api/common/services/history.service';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { UserRequest } from '../../../../../../../common/interface/request';
import { REQUEST } from '@nestjs/core';

dotenv.config();

@Injectable({ scope: Scope.REQUEST })
export class CloseDateService extends HistoryService<CloseDateHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(CloseDate)
    private readonly closeDateRepository: Repository<CloseDate>,
    @InjectRepository(CloseDateCollectionOperation)
    private readonly closeDateCollectionOperationRepository: Repository<CloseDateCollectionOperation>,
    @InjectRepository(CloseDateHistory)
    private readonly closeDateHistory: Repository<CloseDateHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager
  ) {
    super(closeDateHistory);
  }

  async create(user: User, createCloseDateDto: CloseDateDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const closeDate = new CloseDate();
      closeDate.title = createCloseDateDto?.title;
      closeDate.description = createCloseDateDto?.description;
      closeDate.start_date = createCloseDateDto?.start_date;
      closeDate.end_date = createCloseDateDto?.end_date;
      closeDate.created_by = user;
      closeDate.tenant_id = this.request?.user?.tenant?.id;
      const savedCloseDate: CloseDate = await queryRunner.manager.save(
        closeDate
      );

      const promises = [];
      for (const collectionOperations of createCloseDateDto.collection_operations) {
        const closeDateCollectionOperation = new CloseDateCollectionOperation();
        closeDateCollectionOperation.close_date_id = savedCloseDate.id;
        closeDateCollectionOperation.collection_operation_id =
          collectionOperations;
        closeDateCollectionOperation.created_by = user;
        promises.push(queryRunner.manager.save(closeDateCollectionOperation));
      }
      await Promise.all(promises);

      await queryRunner.commitTransaction();
      return resSuccess(
        'Close Date Created.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedCloseDate
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(params: CloseDateInterface) {
    try {
      const limit: number = params?.limit
        ? +params?.limit
        : +process.env.PAGE_SIZE;

      let page = params?.page ? +params?.page : 1;

      if (page < 1) {
        page = 1;
      }

      const where = { tenant_id: this.request?.user?.tenant?.id };
      if (params?.title) {
        Object.assign(where, {
          title: ILike(`%${params?.title}%`),
        });
      }

      if (params?.closed_dates) {
        if (params.closed_dates === 'current') {
          Object.assign(where, {
            start_date: LessThanOrEqual(new Date().toLocaleDateString('en-US')),
            end_date: MoreThanOrEqual(new Date().toLocaleDateString('en-US')),
          });
        }

        if (params.closed_dates === 'past') {
          Object.assign(where, {
            end_date: LessThan(new Date().toLocaleDateString('en-US')),
          });
        }
      }

      if (params?.collection_operation) {
        const collectionOperations = params.collection_operation.split(',');
        let close_date = [];
        const qb = this.closeDateCollectionOperationRepository
          .createQueryBuilder('collectionOperation')
          .select('collectionOperation.close_date_id', 'close_date_id')
          .where(
            'collectionOperation.collection_operation_id IN (:...collectionOperations)',
            { collectionOperations }
          );

        const result = await qb.getRawMany();
        close_date = result.map((row) => row.close_date_id);

        Object.assign(where, {
          id: In(close_date),
        });
      }

      let closeDates: any = [];
      if (params?.fetchAll) {
        closeDates = this.closeDateRepository
          .createQueryBuilder('close_dates')
          .leftJoinAndSelect('close_dates.tenant', 'tenant')
          .orderBy({ 'close_dates.id': 'DESC' })
          .where({ ...where, is_archived: false });
      } else {
        closeDates = this.closeDateRepository
          .createQueryBuilder('close_dates')
          .leftJoinAndSelect('close_dates.tenant', 'tenant')
          .take(limit)
          .skip((page - 1) * limit)
          .orderBy({ 'close_dates.id': 'DESC' })
          .where({ ...where, is_archived: false });
      }

      const [data, count] = await closeDates.getManyAndCount();
      const closeDateIds = data?.map((closeDate) => closeDate.id);

      let collectionOperations: any = [];

      if (closeDateIds.length !== 0) {
        const query = this.closeDateCollectionOperationRepository
          .createQueryBuilder('closeDateCollectionOperation')
          .leftJoinAndSelect(
            'closeDateCollectionOperation.collection_operation_id',
            'collectionOperation'
          )
          .leftJoinAndSelect(
            'closeDateCollectionOperation.close_date_id',
            'closeDate'
          )
          .where(
            'closeDateCollectionOperation.close_date_id IN (:...closeDateIds)',
            {
              closeDateIds: [...closeDateIds],
            }
          )
          .andWhere('collectionOperation.is_archived = :isArchived', {
            isArchived: false,
          })
          .andWhere('collectionOperation.is_active = :isActive', {
            isActive: true,
          });

        collectionOperations = await query.getMany();
      }

      return {
        status: HttpStatus.OK,
        message: 'Close Dates Fetched.',
        count: count,
        data: { closeDates: data, collectionOperations },
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async isDateClosed(params: DateClosedInterface) {
    try {
      const { collection_operation_id, date }: any = params;

      if (
        collection_operation_id == 'undefined' ||
        date == 'undefined' ||
        !(collection_operation_id && date)
      ) {
        return new HttpException(
          'Date and Collection operation id required',
          400
        );
      }

      const closedDates = await this.closeDateRepository
        .createQueryBuilder('closed_dates')
        .leftJoinAndSelect(
          'closed_dates.close_date_collection_operations',
          'close_date_collection_operations'
        )
        .where(
          '(:checkDate BETWEEN closed_dates.start_date AND closed_dates.end_date) AND closed_dates.is_archived = false',
          {
            checkDate: new Date(date),
          }
        )
        .andWhere(
          'close_date_collection_operations.collection_operation_id = :collection_operation_id',
          {
            collection_operation_id: collection_operation_id,
          }
        )
        .getCount();
      return {
        status: HttpStatus.OK,
        message: 'Close Dates Fetched.',
        closed: closedDates > 0 ? true : false,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: any) {
    try {
      const closeDate = await this.closeDateRepository.findOne({
        where: {
          id: id,
          is_archived: false,
        },
        relations: ['created_by', 'tenant'],
      });
      if (!closeDate) {
        throw new HttpException(`Close Date not found.`, HttpStatus.NOT_FOUND);
      }

      const query = this.closeDateCollectionOperationRepository
        .createQueryBuilder('closeDateCollectionOperation')
        .leftJoinAndSelect(
          'closeDateCollectionOperation.collection_operation_id',
          'collectionOperation'
        )
        .where(
          'closeDateCollectionOperation.close_date_id IN (:...closeDateIds)',
          {
            closeDateIds: [closeDate.id],
          }
        )
        .andWhere('collectionOperation.is_archived = :isArchived', {
          isArchived: false,
        })
        .andWhere('collectionOperation.is_active = :isActive', {
          isActive: true,
        });

      const collectionOperations = await query.getMany();

      const historyRecord: any = await getModifiedDataDetails(
        this.closeDateHistory,
        id as any,
        this.userRepository
      );
      const isCheck = Object.values(historyRecord).every(
        (value) => value == null
      );
      if (!isCheck) {
        closeDate['modified_at'] = historyRecord.modified_at;
        closeDate['modified_by'] = historyRecord.modified_by;
      } else {
        closeDate['modified_at'] = closeDate.created_at;
        closeDate['modified_by'] = closeDate.created_by;
      }
      return resSuccess(
        'Close Date fetched.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { closeDate, collectionOperations }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async update(user: User, id: any, updateCloseDateDto: CloseDateDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const closeDateData: any = await this.closeDateRepository.findOne({
        where: {
          id,
          is_archived: false,
        },
        relations: ['created_by'],
      });
      if (!closeDateData) {
        throw new HttpException(`Close Date not found.`, HttpStatus.NOT_FOUND);
      }

      const oldCollectionOperations: any =
        await this.closeDateCollectionOperationRepository.find({
          where: {
            close_date_id: In([closeDateData.id]),
          },
          relations: ['collection_operation_id'],
        });

      // Create a Close Date history instance
      const closeDateHistory = new CloseDateHistory();
      closeDateHistory.history_reason = 'C';
      closeDateHistory.id = closeDateData.id;
      closeDateHistory.title = closeDateData.title;
      closeDateHistory.description = closeDateData.description;
      closeDateHistory.start_date = closeDateData.start_date;
      closeDateHistory.end_date = closeDateData.end_date;
      closeDateHistory.collection_operations = oldCollectionOperations.map(
        (co) => co.collection_operation_id.id
      );
      closeDateHistory.created_by = user.id;
      closeDateHistory.tenant_id = this.request?.user?.tenant?.id;
      this.createHistory(closeDateHistory);

      const closeDateUpdateObject = {
        title: updateCloseDateDto?.title ?? closeDateData?.title,
        description:
          updateCloseDateDto?.description ?? closeDateData?.description,
        start_date: updateCloseDateDto?.start_date ?? closeDateData?.start_date,
        end_date: updateCloseDateDto?.end_date ?? closeDateData?.end_date,
      };
      let updatedCloseDate: any = await queryRunner.manager.update(
        CloseDate,
        { id: closeDateData.id },
        { ...closeDateUpdateObject }
      );
      if (!updatedCloseDate.affected) {
        throw new HttpException(
          `Close Date update failed.`,
          HttpStatus.NOT_MODIFIED
        );
      }

      await this.closeDateCollectionOperationRepository
        .createQueryBuilder('close_date_collection_operations')
        .delete()
        .from(CloseDateCollectionOperation)
        .where('close_date_id = :close_date_id', {
          close_date_id: closeDateData.id,
        })
        .execute();

      const promises = [];
      for (const collectionOperations of updateCloseDateDto.collection_operations) {
        const closeDateCollectionOperation = new CloseDateCollectionOperation();
        closeDateCollectionOperation.close_date_id = closeDateData.id;
        closeDateCollectionOperation.collection_operation_id =
          collectionOperations;
        closeDateCollectionOperation.created_by = user;
        promises.push(queryRunner.manager.save(closeDateCollectionOperation));
      }
      await Promise.all(promises);
      await queryRunner.commitTransaction();

      updatedCloseDate = await this.closeDateRepository.findOne({
        where: {
          id: closeDateData.id,
        },
      });

      const collectionOperations =
        await this.closeDateCollectionOperationRepository.find({
          where: {
            close_date_id: In([updatedCloseDate.id]),
          },
          relations: ['collection_operation_id'],
        });

      return resSuccess(
        'Close Date Updated.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { closeDate: updatedCloseDate, collectionOperations }
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async archive(user: User, id: any) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const closeDate: any = await this.closeDateRepository.findOne({
        where: { id, is_archived: false },
        relations: ['created_by'],
      });

      if (!closeDate) {
        throw new NotFoundException('Close Date not found');
      }

      const collectionOperations: any =
        await this.closeDateCollectionOperationRepository.find({
          where: {
            close_date_id: In([closeDate.id]),
          },
          relations: ['collection_operation_id'],
        });

      // Create a Close Date history instance
      const closeDateHistory = new CloseDateHistory();
      closeDateHistory.history_reason = 'D';
      closeDateHistory.id = closeDate.id;
      closeDateHistory.title = closeDate.title;
      closeDateHistory.description = closeDate.description;
      closeDateHistory.start_date = closeDate.start_date;
      closeDateHistory.end_date = closeDate.end_date;
      closeDateHistory.collection_operations = collectionOperations.map(
        (co) => co.collection_operation_id.id
      );
      closeDateHistory.created_by = user.id;
      closeDateHistory.tenant_id = this.request?.user?.tenant?.id;
      this.createHistory(closeDateHistory);

      closeDate.is_archived = true;
      // Archive the Close Date entity
      const archivedCloseDate = await queryRunner.manager.save(closeDate);
      await queryRunner.commitTransaction();

      return resSuccess(
        'Close Date Archived.',
        SuccessConstants.SUCCESS,
        HttpStatus.GONE,
        archivedCloseDate
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
}
