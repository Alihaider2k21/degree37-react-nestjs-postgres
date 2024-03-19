import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, ILike, In } from 'typeorm';
import { Banner } from '../entities/banner.entity';
import { BannerHistory } from '../entities/banner-history.entity';
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
import { BannerCollectionOperation } from '../entities/banner-collection-operations.entity';
import { BannerDto } from '../dto/banner.dto';
import { BannerInterface } from '../interface/banner.interface';
import { HistoryService } from 'src/api/common/services/history.service';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { UserRequest } from '../../../../../../../common/interface/request';
import { REQUEST } from '@nestjs/core';

dotenv.config();

@Injectable({ scope: Scope.REQUEST })
export class BannerService extends HistoryService<BannerHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
    @InjectRepository(BannerCollectionOperation)
    private readonly bannerCollectionOperationRepository: Repository<BannerCollectionOperation>,
    @InjectRepository(BannerHistory)
    private readonly bannersHistory: Repository<BannerHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager
  ) {
    super(bannersHistory);
  }

  async create(user: User, createBannerDto: BannerDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const banner = new Banner();
      banner.title = createBannerDto?.title;
      banner.description = createBannerDto?.description;
      banner.start_date = createBannerDto?.start_date;
      banner.end_date = createBannerDto?.end_date;
      banner.created_by = user;
      banner.tenant_id = this.request?.user?.tenant?.id;
      const savedBanner: Banner = await queryRunner.manager.save(banner);

      const promises = [];
      for (const collectionOperations of createBannerDto.collection_operations) {
        const bannerCollectionOperation = new BannerCollectionOperation();
        bannerCollectionOperation.banner_id = savedBanner.id;
        bannerCollectionOperation.collection_operation_id =
          collectionOperations;
        bannerCollectionOperation.created_by = user;
        promises.push(queryRunner.manager.save(bannerCollectionOperation));
      }
      await Promise.all(promises);

      await queryRunner.commitTransaction();
      return resSuccess(
        'Banner Created.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedBanner
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(params: BannerInterface) {
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

      if (params?.collection_operation) {
        const collectionOperations = params.collection_operation.split(',');
        let banner = [];
        const qb = this.bannerCollectionOperationRepository
          .createQueryBuilder('collectionOperation')
          .select('collectionOperation.banner_id', 'banner_id')
          .where(
            'collectionOperation.collection_operation_id IN (:...collectionOperations)',
            { collectionOperations }
          );

        const result = await qb.getRawMany();
        banner = result.map((row) => row.banner_id);

        Object.assign(where, {
          id: In(banner),
        });
      }

      let banners: any = [];
      if (params?.fetchAll) {
        banners = this.bannerRepository
          .createQueryBuilder('banners')
          .leftJoinAndSelect('banners.tenant', 'tenant')
          .orderBy({ 'banners.id': 'DESC' })
          .where({ ...where, is_archived: false });
      } else {
        banners = this.bannerRepository
          .createQueryBuilder('banners')
          .leftJoinAndSelect('banners.tenant', 'tenant')
          .take(limit)
          .skip((page - 1) * limit)
          .orderBy({ 'banners.id': 'DESC' })
          .where({ ...where, is_archived: false });
      }

      const [data, count] = await banners.getManyAndCount();
      const collectionOperations =
        await this.bannerCollectionOperationRepository.find({
          where: {
            banner_id: In(data.map((banner) => banner.id)),
          },
          relations: ['banner_id', 'collection_operation_id'],
        });

      return {
        status: HttpStatus.OK,
        message: 'Banners Fetched.',
        count: count,
        data: { banners: data, collectionOperations },
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
      const banner = await this.bannerRepository.findOne({
        where: {
          id: id,
          is_archived: false,
        },
        relations: ['created_by', 'tenant'],
      });
      if (!banner) {
        throw new HttpException(`Banner not found.`, HttpStatus.NOT_FOUND);
      }

      const collectionOperations =
        await this.bannerCollectionOperationRepository.find({
          where: {
            banner_id: In([banner.id]),
          },
          relations: ['collection_operation_id'],
        });

      const historyRecord: any = await getModifiedDataDetails(
        this.bannersHistory,
        id,
        this.userRepository
      );

      console.log('Banners History record', historyRecord);
      const isCheck = Object.values(historyRecord).every(
        (value) => value == null
      );
      if (!isCheck) {
        banner['modified_at'] = historyRecord.modified_at;
        banner['modified_by'] = historyRecord.modified_by;
      } else {
        banner['modified_at'] = banner.created_at;
        banner['modified_by'] = banner.created_by;
      }

      return resSuccess(
        'Banner fetched.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { banner, collectionOperations }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async update(user: User, id: any, updateBannerDto: BannerDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const bannerData: any = await this.bannerRepository.findOne({
        where: {
          id,
          is_archived: false,
        },
        relations: ['created_by'],
      });
      if (!bannerData) {
        throw new HttpException(`Banner not found.`, HttpStatus.NOT_FOUND);
      }

      const oldCollectionOperations: any =
        await this.bannerCollectionOperationRepository.find({
          where: {
            banner_id: In([bannerData.id]),
          },
          relations: ['collection_operation_id'],
        });

      console.log('Banners History - User', user);

      // Create a Banner history instance
      const bannerHistory = new BannerHistory();
      bannerHistory.history_reason = 'C';
      bannerHistory.id = bannerData.id;
      bannerHistory.title = bannerData.title;
      bannerHistory.description = bannerData.description;
      bannerHistory.start_date = bannerData.start_date;
      bannerHistory.end_date = bannerData.end_date;
      bannerHistory.collection_operations = oldCollectionOperations.map(
        (co) => co.collection_operation_id.id
      );
      bannerHistory.created_by = user.id;
      bannerHistory.tenant_id = this.request?.user?.tenant?.id;
      console.log('Banners History record', bannerHistory);
      await this.createHistory(bannerHistory);

      const bannerUpdateObject = {
        title: updateBannerDto?.title ?? bannerData?.title,
        description: updateBannerDto?.description ?? bannerData?.description,
        start_date: updateBannerDto?.start_date ?? bannerData?.start_date,
        end_date: updateBannerDto?.end_date ?? bannerData?.end_date,
      };

      let updatedBanner: any = await queryRunner.manager.update(
        Banner,
        { id: bannerData.id },
        { ...bannerUpdateObject }
      );
      if (!updatedBanner.affected) {
        throw new HttpException(
          `Banner update failed.`,
          HttpStatus.NOT_MODIFIED
        );
      }

      await this.bannerCollectionOperationRepository
        .createQueryBuilder('banner_collection_operations')
        .delete()
        .from(BannerCollectionOperation)
        .where('banner_id = :banner_id', { banner_id: bannerData.id })
        .execute();

      const promises = [];
      for (const collectionOperations of updateBannerDto.collection_operations) {
        const bannerCollectionOperation = new BannerCollectionOperation();
        bannerCollectionOperation.banner_id = bannerData.id;
        bannerCollectionOperation.collection_operation_id =
          collectionOperations;
        bannerCollectionOperation.created_by = user;
        promises.push(queryRunner.manager.save(bannerCollectionOperation));
      }
      await Promise.all(promises);
      await queryRunner.commitTransaction();

      updatedBanner = await this.bannerRepository.findOne({
        where: {
          id: bannerData.id,
        },
      });

      const collectionOperations =
        await this.bannerCollectionOperationRepository.find({
          where: {
            banner_id: In([updatedBanner.id]),
          },
          relations: ['collection_operation_id'],
        });

      return resSuccess(
        'Banner Updated.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { banner: updatedBanner, collectionOperations }
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

      const banner: any = await this.bannerRepository.findOne({
        where: { id, is_archived: false },
        relations: ['created_by'],
      });

      if (!banner) {
        throw new NotFoundException('Banner not found');
      }

      const collectionOperations: any =
        await this.bannerCollectionOperationRepository.find({
          where: {
            banner_id: In([banner.id]),
          },
          relations: ['collection_operation_id'],
        });
      // Create a Banner history instance
      const bannerHistory = new BannerHistory();
      bannerHistory.history_reason = 'D';
      bannerHistory.id = banner.id;
      bannerHistory.title = banner.title;
      bannerHistory.description = banner.description;
      bannerHistory.start_date = banner.start_date;
      bannerHistory.end_date = banner.end_date;
      bannerHistory.collection_operations = collectionOperations.map(
        (co) => co.collection_operation_id.id
      );
      bannerHistory.created_by = user.id;
      bannerHistory.tenant_id = this.request?.user?.tenant?.id;
      await this.createHistory(bannerHistory);

      banner.is_archived = true;
      banner.collectionOperations = collectionOperations;

      // Archive the Banner entity
      const archivedBanner = await queryRunner.manager.save(banner);
      await queryRunner.commitTransaction();

      return resSuccess(
        'Banner Archived.',
        SuccessConstants.SUCCESS,
        HttpStatus.GONE,
        archivedBanner
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
