import { HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { CreateCertificationDto } from '../dto/create-certification.dto';
import { UpdateCertificationDto } from '../dto/update-certification.dto';
import { Certification } from '../entity/certification.entity';
import { FilterCertification } from '../interfaces/query-certification.interface';
import { resError, resSuccess } from '../../../../helpers/response';
import { SuccessConstants } from '../../../../constants/success.constants';
import { ErrorConstants } from '../../../../constants/error.constants';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from '../../../../../../common/interface/request';
import { pagination } from '../../../../../../common/utils/pagination';
import { HistoryReason } from '../../../../../../common/enums/history_reason.enum';
import { CertificationHistory } from '../entity/certification-history.entity';
import { Sort } from '../../../../../../common/interface/sort';
import { HistoryService } from 'src/api/common/services/history.service';
import { User } from '../../../user-administration/user/entity/user.entity';
import { AssociationType } from '../enums/association_type.enum';

@Injectable({ scope: Scope.REQUEST })
export class CertificationService extends HistoryService<CertificationHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Certification)
    private readonly certificationRepository: Repository<Certification>,
    @InjectRepository(CertificationHistory)
    private readonly certificationHistoryRepository: Repository<CertificationHistory>
  ) {
    super(certificationHistoryRepository);
  }

  async create(createCertificationDto: CreateCertificationDto) {
    try {
      const where = {
        tenant: { id: this.request.user?.tenant?.id },
        is_archived: false,
      };
      if (
        await this.certificationRepository.findOneBy([
          {
            name: ILike(createCertificationDto.name),
            ...where,
          },
          {
            short_name: ILike(createCertificationDto.short_name),
            ...where,
          },
        ])
      ) {
        return resError(
          'Certification already exists',
          ErrorConstants.Error,
          HttpStatus.CONFLICT
        );
      }

      if (
        createCertificationDto.expires &&
        !createCertificationDto.expiration_interval
      ) {
        return resError(
          'Expiration Interval is required if Expires is enable',
          ErrorConstants.Error,
          HttpStatus.BAD_REQUEST
        );
      }

      const instance = await this.certificationRepository.save(
        this.certificationRepository.create({
          name: createCertificationDto.name,
          short_name: createCertificationDto.short_name,
          description: createCertificationDto.description,
          association_type: createCertificationDto.association_type,
          expires: createCertificationDto.expires,
          expiration_interval: createCertificationDto.expiration_interval,
          is_active: createCertificationDto.is_active,
          tenant: this.request.user?.tenant,
          created_by: this.request.user,
        })
      );

      return resSuccess(
        'Certification Created.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        instance
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async get(
    page: number,
    limit: number,
    keyword?: string,
    sortBy?: Sort,
    filters?: FilterCertification
  ) {
    try {
      const { skip, take } =
        page && limit
          ? pagination(page, limit)
          : { skip: undefined, take: undefined };
      const where = {
        name: ILike(`%${keyword}%`),
        is_active: filters.is_active,
        association_type: filters.associationType,
        tenant: { id: this.request.user?.tenant?.id },
        is_archived: false,
      };

      const query = { relations: ['created_by'], where };
      if (sortBy.sortName && sortBy.sortOrder) {
        query['order'] = {
          [sortBy.sortName]: sortBy.sortOrder,
        };
      }

      const [records, count] = await Promise.all([
        this.certificationRepository.find({ ...query, skip, take }),
        this.certificationRepository.count(query),
      ]);
      return resSuccess(
        'Certification Records',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { count, records }
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getCertificationsByAssociationType(
    type: string,
    is_active: boolean,
    user: any
  ) {
    const response = await this.certificationRepository.find({
      where: {
        association_type: AssociationType[type],
        is_archived: false,
        is_active: is_active,
        tenant: { id: user?.tenant?.id },
      },
    });
    return resSuccess(
      'Certifications fetched.',
      'success',
      HttpStatus.OK,
      response
    );
  }
  async getById(id: bigint) {
    try {
      const instance = await this.certificationRepository.findOne({
        where: { id, is_archived: false },
        relations: ['created_by'],
      });

      if (!instance) {
        return resError(
          'Not Found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      const modifiedData = await this.getModifiedData(
        instance,
        this.userRepository
      );

      return resSuccess(
        'Certification Record',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { ...instance, ...modifiedData }
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async archive(id: bigint) {
    try {
      const instance = await this.certificationRepository.findOne({
        where: { id, is_archived: false },
      });

      if (!instance) {
        return resError(
          'Not Found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      const history = this.certificationHistoryRepository.create({
        ...instance,
        history_reason: HistoryReason.D,
        created_at: new Date(),
        created_by: this.request.user?.id,
      });

      // archive certification
      instance.is_archived = true;
      this.certificationRepository.save(instance);

      await this.createHistory(history);

      return resSuccess(
        'Certification is archived',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        instance
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async edit(id: bigint, updateAttachmentCategoryDto: UpdateCertificationDto) {
    try {
      const instance = await this.certificationRepository.findOne({
        where: { id, is_archived: false },
        relations: ['tenant'],
      });

      if (!instance) {
        return resError(
          'Not Found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      if (
        await this.certificationRepository.findOneBy([
          {
            name: ILike(updateAttachmentCategoryDto.name),
            id: Not(id),
            is_archived: false,
          },
          {
            short_name: ILike(updateAttachmentCategoryDto.short_name),
            id: Not(id),
            is_archived: false,
          },
        ])
      ) {
        return resError(
          'Certification already exists',
          ErrorConstants.Error,
          HttpStatus.CONFLICT
        );
      }

      if (
        updateAttachmentCategoryDto.expires &&
        !updateAttachmentCategoryDto.expiration_interval
      ) {
        return resError(
          'Expiration Interval is required if Expires is enable',
          ErrorConstants.Error,
          HttpStatus.BAD_REQUEST
        );
      }

      const history = this.certificationHistoryRepository.create({
        ...instance,
        history_reason: HistoryReason.C,
        created_at: new Date(),
        created_by: this.request.user?.id,
        tenant_id: instance?.tenant?.id,
      });

      // update certification
      instance.name = updateAttachmentCategoryDto.name;
      instance.short_name = updateAttachmentCategoryDto.short_name;
      instance.description = updateAttachmentCategoryDto.description;
      instance.association_type = updateAttachmentCategoryDto.association_type;
      instance.expires = updateAttachmentCategoryDto.expires;
      instance.expiration_interval =
        updateAttachmentCategoryDto.expiration_interval;
      instance.is_active = updateAttachmentCategoryDto.is_active;
      this.certificationRepository.save(instance);

      // create certification history
      await this.createHistory(history);

      return resSuccess(
        'Changes Saved.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        instance
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
