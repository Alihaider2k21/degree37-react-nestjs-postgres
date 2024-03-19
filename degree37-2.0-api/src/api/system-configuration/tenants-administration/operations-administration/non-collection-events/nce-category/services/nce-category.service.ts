import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, ILike, IsNull } from 'typeorm';
import { Category } from '../../../../crm-administration/common/entity/category.entity';
import { CreateNoteCategoryDto } from '../dto/create-nce-category.dto';
import { ErrorConstants } from '../../../../../../system-configuration/constants/error.constants';
import {
  resError,
  resSuccess,
} from '../../../../../../system-configuration/helpers/response';
import { CategoryHistory } from '../../../../crm-administration/common/entity/categoryhistory.entity';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { GetAllNotecategoryInterface } from '../interface/nce-category.interface';
import { typeEnum } from '../../../../crm-administration/common/enums/type.enum';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';

@Injectable()
export class NceCategoryService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(Category)
    private readonly noteCategoryRepository: Repository<Category>,
    @InjectRepository(CategoryHistory)
    private readonly noteCategoryHistoryRepository: Repository<CategoryHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly entityManager: EntityManager
  ) {}

  categoryEnum = typeEnum?.OPERATION_NEC_NEC;

  async create(createNoteCategoryDto: CreateNoteCategoryDto) {
    try {
      // Create the Note Category
      const note_category = new Category();
      // Set Note Category properties
      note_category.name = createNoteCategoryDto?.name;
      note_category.description = createNoteCategoryDto?.description;
      note_category.type = this.categoryEnum;
      note_category.is_active = createNoteCategoryDto?.is_active;
      note_category.created_by = this.request.user;
      note_category.tenant = this.request.user?.tenant;

      // Save the Note Category entity
      const savedNoteCategory = await this.noteCategoryRepository.save(
        note_category
      );

      return resSuccess(
        'Note Category Created Successfully',
        'success',
        HttpStatus.CREATED,
        {
          savedNoteCategory,
        }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getAll(params: GetAllNotecategoryInterface) {
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
        tenant: this.request.user?.tenant,
      });

      const queryBuilder = this.noteCategoryRepository
        .createQueryBuilder('note_category')
        .where({
          ...where,
          is_archived: false,
          type: this.categoryEnum,
          parent_id: IsNull(),
        });
      if (sortName) {
        queryBuilder.orderBy(`note_category.${sortName}`, sortBy);
      } else {
        queryBuilder.orderBy({ 'note_category.id': 'DESC' });
      }

      if (!params?.fetchAll) {
        queryBuilder.take(limit).skip((page - 1) * limit);
      }

      const [data, count] = await queryBuilder.getManyAndCount();

      return resSuccess(
        'Note Category Fetched Successfully',
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

  async getSingleNoteCategory(id: any) {
    try {
      const note_category = await this.noteCategoryRepository.findOne({
        where: {
          id,
          is_archived: false,
          type: this.categoryEnum,
          parent_id: IsNull(),
        },
        relations: ['created_by'],
      });
      if (!note_category) {
        return resError('Note Category not found', ErrorConstants.Error, 404);
      }
      const modifiedData = await getModifiedDataDetails(
        this.noteCategoryHistoryRepository,
        id,
        this.userRepository
      );
      const modified_by = modifiedData['modified_by'];
      const modified_at = modifiedData['modified_at'];
      return resSuccess(
        'Note Category Fetched Successfully',
        'success',
        HttpStatus.OK,
        {
          ...note_category,
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

  async updateNoteCategory(id: any, updatedData: any) {
    const note_category = await this.noteCategoryRepository.findOne({
      where: {
        id,
        is_archived: false,
        type: this.categoryEnum,
        parent_id: IsNull(),
      },
    });

    if (!note_category) {
      return resError('Note Category not found', ErrorConstants.Error, 404);
    }

    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Create an updatedNoteCategory object with the changes
      const updatedNoteCategory = {
        name: updatedData?.name,
        description: updatedData?.description,
        is_active: updatedData?.is_active,
      };

      // Update the note category using the updatedNoteCategory object
      await this.noteCategoryRepository.update({ id }, updatedNoteCategory);

      // Save the history of the changes
      await this.saveNoteCategoryHistory({
        ...note_category,
        history_reason: 'C',
        id: id,
      });

      await queryRunner.commitTransaction();

      return resSuccess(
        'Note Category Updated Successfully',
        'success',
        HttpStatus.OK,
        { ...updatedNoteCategory }
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

  async deleteNoteCategory(id: any) {
    const note_category = await this.noteCategoryRepository.findOne({
      where: {
        id,
        is_archived: false,
        type: this.categoryEnum,
        parent_id: IsNull(),
      },
    });
    const note_subcategory = await this.noteCategoryRepository.findOne({
      where: {
        is_archived: false,
        type: this.categoryEnum,
        parent_id: { id: id },
      },
      relations: ['parent_id'],
    });

    if (!note_category) {
      return resError('Note Category not found', ErrorConstants.Error, 404);
    }
    if (note_subcategory) {
      return resError(
        'Note categories depend on note subcategories.',
        ErrorConstants.Error,
        404
      );
    }

    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Create an updatedNoteCategory object with the changes
      const updatedNoteCategory = {
        is_archived: true,
      };

      // Update the note category using the updatedNoteCategory object
      await this.noteCategoryRepository.update({ id }, updatedNoteCategory);
      // Save the history of the changes
      await this.saveNoteCategoryHistory({
        ...note_category,
        history_reason: 'D',
        id: id,
      });

      await queryRunner.commitTransaction();

      return resSuccess('Note Category Deleted Successfully', 'success', 204, {
        ...updatedNoteCategory,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      resError('Internel Server Error', ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async saveNoteCategoryHistory(note_category: any) {
    try {
      const noteCategoryHistory = new CategoryHistory();
      noteCategoryHistory.created_at = new Date();
      noteCategoryHistory.created_by = this.request.user.id;
      noteCategoryHistory.description = note_category?.description;
      noteCategoryHistory.type = note_category?.type;
      noteCategoryHistory.id = note_category?.id;
      noteCategoryHistory.history_reason = note_category?.history_reason;
      noteCategoryHistory.is_active = note_category?.is_active;
      noteCategoryHistory.is_archived = note_category?.is_archived;
      noteCategoryHistory.name = note_category?.name;
      noteCategoryHistory.tenant_id = note_category?.tenant_id;
      await this.noteCategoryHistoryRepository.save(noteCategoryHistory);
    } catch (error) {
      resError('Internel Server Error', ErrorConstants.Error, error.status);
    }
  }
  async getAllNceCategory(user: any, is_active?: boolean) {
    try {
      const whereConditions: any = {
        is_archived: false,
        type: this.categoryEnum,
        tenant_id: user.tenant.id,
        parent_id: IsNull(),
      };

      if (is_active !== undefined) {
        whereConditions.is_active = is_active;
      }

      const data = await this.noteCategoryRepository.find({
        where: whereConditions,
      });

      return resSuccess(
        'Note Category Fetched Successfully',
        'success',
        HttpStatus.OK,
        data
      );
    } catch (e) {
      return resError('Internal Server Error', ErrorConstants.Error, e.status);
    }
  }
}
