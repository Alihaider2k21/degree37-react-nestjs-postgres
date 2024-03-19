import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, ILike, IsNull } from 'typeorm';
import { Category } from '../../../common/entity/category.entity';
import { CreateAttachmentCategoryDto } from '../dto/create-attachment-category.dto';
import { ErrorConstants } from '../../../../../../system-configuration/constants/error.constants';
import {
  resError,
  resSuccess,
} from '../../../../../../system-configuration/helpers/response';
import { CategoryHistory } from '../../../common/entity/categoryhistory.entity';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { GetAllAttachmentCategoryInterface } from '../interfaces/query-attachment-category.interface';
import { typeEnum } from '../../../common/enums/type.enum';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';

@Injectable()
export class AttachmentCategoryService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(Category)
    private readonly attachmentCategoryRepository: Repository<Category>,
    @InjectRepository(CategoryHistory)
    private readonly attachmentCategoryHistoryRepository: Repository<CategoryHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly entityManager: EntityManager
  ) {}

  categoryEnum = typeEnum?.CRM_LOCATION_ATTACHMENTS;

  async create(createAttachmentCategoryDto: CreateAttachmentCategoryDto) {
    try {
      // Create the Note Category
      const attachment_category = new Category();
      // Set Note Category properties
      attachment_category.name = createAttachmentCategoryDto?.name;
      attachment_category.description =
        createAttachmentCategoryDto?.description;
      attachment_category.type = this.categoryEnum;
      attachment_category.is_active = createAttachmentCategoryDto?.is_active;
      attachment_category.created_by = this.request.user;
      attachment_category.tenant = this.request.user?.tenant;

      // Save the Note Category entity
      const savedAttachmentCategory =
        await this.attachmentCategoryRepository.save(attachment_category);

      return resSuccess(
        'Attachment Category Created Successfully',
        'success',
        HttpStatus.CREATED,
        {
          savedAttachmentCategory: savedAttachmentCategory,
        }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getAll(params: GetAllAttachmentCategoryInterface, user: any) {
    try {
      const sortName = params?.sortName === '' ? undefined : params?.sortName; // Column name for sorting
      const sortBy = params?.sortOrder === 'DESC' ? 'DESC' : 'ASC'; // Sort order, defaulting to ASC
      const limit: number = params?.limit
        ? +params?.limit
        : +process.env.PAGE_SIZE;
      let page = params?.page ? +params?.page : 1;
      if (page < 1) {
        page = 1;
      }

      const where = {};
      if (params?.name) {
        Object.assign(where, {
          name: ILike(`%${params?.name}%`),
        });
      }

      if (params?.is_active) {
        Object.assign(where, {
          is_active: params?.is_active,
        });
      }

      Object.assign(where, {
        tenant: { id: user?.tenant?.id },
      });

      const queryBuilder = this.attachmentCategoryRepository
        .createQueryBuilder('attachment_category')
        .where({
          ...where,
          is_archived: false,
          type: this.categoryEnum,
          parent_id: IsNull(),
        });
      if (sortName) {
        queryBuilder.orderBy(`attachment_category.${sortName}`, sortBy);
      } else {
        queryBuilder.orderBy({ 'attachment_category.id': 'DESC' });
      }

      if (!params?.fetchAll) {
        queryBuilder.take(limit).skip((page - 1) * limit);
      }

      const [data, count] = await queryBuilder.getManyAndCount();

      return resSuccess(
        'Attachment Category Fetched Successfully',
        'success',
        HttpStatus.OK,
        {
          count: count,
          data: data,
        }
      );
    } catch (e) {
      return resError('Internal Server Error', ErrorConstants.Error, e.status);
    }
  }

  async getSingleAttachmentCategory(id: any) {
    try {
      const attachment_category =
        await this.attachmentCategoryRepository.findOne({
          where: {
            id,
            is_archived: false,
            type: this.categoryEnum,
            parent_id: IsNull(),
          },
          relations: ['created_by'],
        });
      if (!attachment_category) {
        return resError(
          'Attachment Category not found',
          ErrorConstants.Error,
          404
        );
      }
      const modifiedData = await getModifiedDataDetails(
        this.attachmentCategoryHistoryRepository,
        id,
        this.userRepository
      );
      const modified_by = modifiedData['modified_by'];
      const modified_at = modifiedData['modified_at'];
      return resSuccess(
        'Attachment Category Fetched Successfully',
        'success',
        HttpStatus.OK,
        {
          ...attachment_category,
          modified_by: modified_by,
          modified_at: modified_at,
        }
      );
    } catch (error) {
      return resError(
        'Internel Server Error',
        ErrorConstants.Error,
        error.status
      );
    }
  }

  async updateAttachmentCategory(id: any, updatedData: any) {
    const attachment_category = await this.attachmentCategoryRepository.findOne(
      {
        where: {
          id,
          is_archived: false,
          type: this.categoryEnum,
          parent_id: IsNull(),
        },
      }
    );

    if (!attachment_category) {
      return resError(
        'Attachment Category not found',
        ErrorConstants.Error,
        404
      );
    }

    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Create an updatedNoteCategory object with the changes
      const updatedAttachmentCategory = {
        name: updatedData?.name,
        description: updatedData?.description,
        is_active: updatedData?.is_active,
      };

      // Update the note category using the updatedNoteCategory object
      await this.attachmentCategoryRepository.update(
        { id },
        updatedAttachmentCategory
      );

      // Save the history of the changes
      await this.saveAttachmentCategoryHistory({
        ...attachment_category,
        history_reason: 'C',
        id: id,
      });

      await queryRunner.commitTransaction();

      return resSuccess(
        'Attachment Category Updated Successfully',
        'success',
        HttpStatus.OK,
        {}
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(
        'Internel Server Error',
        ErrorConstants.Error,
        error.status
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteAttachmentCategory(id: any) {
    const attachment_category = await this.attachmentCategoryRepository.findOne(
      {
        where: {
          id,
          is_archived: false,
          type: this.categoryEnum,
          parent_id: IsNull(),
        },
      }
    );
    const attachment_subcategory =
      await this.attachmentCategoryRepository.findOne({
        where: {
          is_archived: false,
          type: this.categoryEnum,
          parent_id: { id: id },
        },
        relations: ['parent_id'],
      });

    if (!attachment_category) {
      return resError(
        'Attachment Category not found',
        ErrorConstants.Error,
        404
      );
    }
    if (attachment_subcategory) {
      return resError(
        'Attachment categories depend on note subcategories.',
        ErrorConstants.Error,
        404
      );
    }

    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Create an updatedNoteCategory object with the changes
      const updatedAttachmentCategory = {
        is_archived: true,
      };

      // Update the note category using the updatedNoteCategory object
      await this.attachmentCategoryRepository.update(
        { id },
        updatedAttachmentCategory
      );
      // Save the history of the changes
      await this.saveAttachmentCategoryHistory({
        ...attachment_category,
        history_reason: 'D',
        id: id,
      });

      await queryRunner.commitTransaction();

      return resSuccess(
        'Note Category Deleted Successfully',
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

  async saveAttachmentCategoryHistory(attachment_category: any) {
    try {
      const attachmentCategoryHistory = new CategoryHistory();
      attachmentCategoryHistory.created_at = new Date();
      attachmentCategoryHistory.created_by = this.request.user.id;
      attachmentCategoryHistory.description = attachment_category?.description;
      attachmentCategoryHistory.type = attachment_category?.type;
      attachmentCategoryHistory.id = attachment_category?.id;
      attachmentCategoryHistory.history_reason =
        attachment_category?.history_reason;
      attachmentCategoryHistory.is_active = attachment_category?.is_active;
      attachmentCategoryHistory.is_archived = attachment_category?.is_archived;
      attachmentCategoryHistory.name = attachment_category?.name;
      attachmentCategoryHistory.tenant_id = attachment_category?.tenant_id;
      await this.attachmentCategoryHistoryRepository.save(
        attachmentCategoryHistory
      );
    } catch (error) {
      resError('Internel Server Error', ErrorConstants.Error, error.status);
    }
  }
}
