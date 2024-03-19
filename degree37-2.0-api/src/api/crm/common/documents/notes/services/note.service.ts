import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { CreateNotesDto } from '../dto/create-note.dto';
import {
  resError,
  resSuccess,
} from '../../../../../system-configuration/helpers/response';
import { ErrorConstants } from '../../../../../system-configuration/constants/error.constants';
import { Category } from '../../../../../system-configuration/tenants-administration/crm-administration/common/entity/category.entity';
import { User } from '../../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Tenant } from '../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Notes } from '../entities/note.entity';
import { UpdateNotesDto } from '../dto/update-note.dto';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { NotesFiltersInterface } from '../interface/note.interface';
import { HistoryService } from '../../../../../common/services/history.service';
import { NotesHistory } from '../entities/note-history.entity';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';

dotenv.config();
@Injectable()
export class NotesService extends HistoryService<NotesHistory> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Notes)
    private readonly notesRepository: Repository<Notes>,
    @InjectRepository(NotesHistory)
    private readonly notesHistoryRepository: Repository<NotesHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>
  ) {
    super(notesHistoryRepository);
  }

  async create(createNoteDto: CreateNotesDto, req: any) {
    try {
      const {
        noteable_id,
        noteable_type,
        note_name,
        details,
        category_id,
        sub_category_id,
        is_active,
      } = createNoteDto;

      const category = await this.categoryRepository.findOneBy({
        id: category_id,
      });

      if (!category) {
        throw new HttpException(
          'Category Does not exist!',
          HttpStatus.CONFLICT
        );
      }

      const subCategory = await this.categoryRepository.findOne({
        where: {
          id: sub_category_id,
        },
        relations: ['parent_id'],
      });

      if (!subCategory || (subCategory && !subCategory.parent_id)) {
        throw new HttpException(
          'SubCategory Does not exist!',
          HttpStatus.CONFLICT
        );
      }

      const existingNote = await this.notesRepository.findOneBy({
        note_name: note_name,
        noteable_type: noteable_type,
        is_archived: false,
      });

      if (existingNote) {
        throw new HttpException('Note already exist!', HttpStatus.CONFLICT);
      }

      const user = await this.userRepository.findOneBy({
        id: req?.user?.id,
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const tenant = await this.tenantRepository.findOneBy({
        id: req?.user.tenant?.id,
      });
      if (!tenant) {
        throw new HttpException(`Tenant not found.`, HttpStatus.NOT_FOUND);
      }

      const createNote = new Notes();

      createNote.noteable_id = noteable_id;
      createNote.noteable_type = noteable_type;
      createNote.note_name = note_name;
      createNote.details = details;
      createNote.is_active = is_active;
      createNote.category_id = category;
      createNote.sub_category_id = subCategory;
      createNote.tenant_id = tenant;
      createNote.created_by = user;

      const savedNote = await this.notesRepository.save(createNote);

      return resSuccess(
        'Note Created Successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedNote
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAll(notesFiltersInterface: NotesFiltersInterface) {
    try {
      const {
        keyword,
        category_id,
        sub_category_id,
        is_active,
        noteable_id,
        noteable_type,
        tenant_id,
      } = notesFiltersInterface;
      let { page, limit } = notesFiltersInterface;

      limit = limit ? +limit : +process.env.PAGE_SIZE;

      page = page ? +page : 1;

      const where = { is_archived: false };

      Object.assign(where, {
        tenant_id: { id: tenant_id },
      });

      if (keyword) {
        Object.assign(where, {
          note_name: ILike(`%${keyword}%`),
        });
      }

      if (category_id) {
        Object.assign(where, {
          category_id: {
            id: category_id,
          },
        });
      }

      if (sub_category_id) {
        Object.assign(where, {
          sub_category_id: {
            id: sub_category_id,
          },
        });
      }

      if (noteable_id) {
        Object.assign(where, {
          noteable_id,
        });
      }

      if (noteable_type) {
        Object.assign(where, {
          noteable_type,
        });
      }

      if (is_active) {
        Object.assign(where, {
          is_active,
        });
      }

      let order: any = { id: 'DESC' };

      if (notesFiltersInterface?.sortBy) {
        if (notesFiltersInterface?.sortBy == 'category_id') {
          const orderDirection = notesFiltersInterface.sortOrder || 'DESC';
          order = { category_id: { name: orderDirection } };
        } else if (notesFiltersInterface?.sortBy == 'sub_category_id') {
          const orderDirection = notesFiltersInterface.sortOrder || 'DESC';
          order = { sub_category_id: { name: orderDirection } };
        } else if (notesFiltersInterface?.sortBy == 'created_by') {
          const orderDirection = notesFiltersInterface.sortOrder || 'DESC';
          order = { created_by: { first_name: orderDirection } };
        } else {
          const orderBy = notesFiltersInterface.sortBy;
          const orderDirection = notesFiltersInterface.sortOrder || 'DESC';
          order = { [orderBy]: orderDirection };
        }
      }

      const [response, count] = await this.notesRepository.findAndCount({
        where,
        relations: [
          'created_by',
          'tenant_id',
          'category_id',
          'sub_category_id',
        ],
        take: limit,
        skip: (page - 1) * limit,
        order,
      });

      return {
        status: HttpStatus.OK,
        message: 'Note Fetched Succesfuly',
        count: count,
        data: response,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findOne(id: any) {
    try {
      const note = await this.notesRepository.findOne({
        where: { id },
        relations: [
          'created_by',
          'tenant_id',
          'category_id',
          'sub_category_id',
        ],
      });

      if (!note) {
        throw new HttpException(`Note not found.`, HttpStatus.NOT_FOUND);
      }

      if (note?.is_archived) {
        throw new HttpException(`Note is archived.`, HttpStatus.NOT_FOUND);
      }

      const modifiedData: any = await getModifiedDataDetails(
        this.notesHistoryRepository,
        id,
        this.userRepository
      );

      const updatedBy: any = {
        modified_by: modifiedData?.modified_by
          ? modifiedData?.modified_by
          : note?.created_by,
        modified_at: modifiedData?.modified_at
          ? modifiedData?.modified_at
          : note?.created_at,
      };

      return resSuccess(
        'Note fetched successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { ...note, ...updatedBy }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async update(id: any, updateNoteDto: UpdateNotesDto, req: any) {
    try {
      const {
        noteable_id,
        noteable_type,
        note_name,
        details,
        is_active,
        category_id,
        sub_category_id,
      } = updateNoteDto;

      const note = await this.notesRepository.findOne({
        where: { id },
        relations: [
          'created_by',
          'tenant_id',
          'category_id',
          'sub_category_id',
        ],
      });

      const noteBeforeUpdate = { ...note };

      if (!note) {
        throw new HttpException('Note does not exist!', HttpStatus.CONFLICT);
      }

      if (note.is_archived) {
        throw new HttpException(
          'Note is archived and cannot be updated!',
          HttpStatus.CONFLICT
        );
      }

      if (category_id) {
        const category = await this.categoryRepository.findOneBy({
          id: category_id,
        });

        if (!category) {
          throw new HttpException(
            'Category Does not exist!',
            HttpStatus.CONFLICT
          );
        }

        note.category_id = category;
      }

      if (sub_category_id) {
        const subCategory = await this.categoryRepository.findOne({
          where: {
            id: sub_category_id,
          },
          relations: ['parent_id'],
        });

        if (!subCategory || (subCategory && !subCategory?.parent_id)) {
          throw new HttpException(
            'SubCategory Does not exist!',
            HttpStatus.CONFLICT
          );
        }

        note.sub_category_id = subCategory;
      }

      const user = await this.userRepository.findOneBy({
        id: req?.user?.id,
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      note.noteable_id = noteable_id ?? note.noteable_id;
      note.noteable_type = noteable_type ?? note.noteable_type;
      note.note_name = note_name ?? note.note_name;
      note.is_active = is_active ?? note.is_active;
      note.details = details ?? note.details;

      const updatedNote = await this.notesRepository.save(note);

      const notesHistory = new NotesHistory();
      Object.assign(notesHistory, noteBeforeUpdate);
      notesHistory.noteable_id = noteBeforeUpdate?.noteable_id;
      notesHistory.noteable_type = noteBeforeUpdate?.noteable_type;
      notesHistory.note_name = noteBeforeUpdate?.note_name;
      notesHistory.details = noteBeforeUpdate?.details;
      notesHistory.category_id = noteBeforeUpdate?.category_id?.id;
      notesHistory.sub_category_id = noteBeforeUpdate?.sub_category_id?.id;
      notesHistory.is_active = noteBeforeUpdate?.is_active;
      notesHistory.created_by = req?.user?.id;
      notesHistory.tenant_id = noteBeforeUpdate?.tenant_id?.id;
      notesHistory.history_reason = 'C';
      notesHistory.is_archived = noteBeforeUpdate?.is_archived;
      delete notesHistory?.created_at;
      await this.createHistory(notesHistory);

      return resSuccess(
        'Note Updated Successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        updatedNote
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async archive(id: any, req: any) {
    try {
      const note = await this.notesRepository.findOne({
        where: { id },
        relations: [
          'created_by',
          'tenant_id',
          'category_id',
          'sub_category_id',
        ],
      });

      if (!note) {
        throw new HttpException(`Note not found.`, HttpStatus.NOT_FOUND);
      }

      if (note.is_archived === false) {
        note.is_archived = true;
        const archivedNote = await this.notesRepository.save(note);

        const notesHistory = new NotesHistory();
        Object.assign(notesHistory, archivedNote);
        notesHistory.noteable_id = archivedNote?.noteable_id;
        notesHistory.noteable_type = archivedNote?.noteable_type;
        notesHistory.note_name = archivedNote?.note_name;
        notesHistory.details = archivedNote?.details;
        notesHistory.category_id = archivedNote?.category_id?.id;
        notesHistory.sub_category_id = archivedNote?.sub_category_id?.id;
        notesHistory.is_active = archivedNote?.is_active;
        notesHistory.created_by = req?.user?.id;
        notesHistory.tenant_id = archivedNote?.tenant_id?.id;
        notesHistory.history_reason = 'C';
        notesHistory.is_archived = archivedNote?.is_archived;
        delete notesHistory?.created_at;
        await this.createHistory(notesHistory);
        notesHistory.history_reason = 'D';
        await this.createHistory(notesHistory);
      } else {
        throw new HttpException(
          `Note is already archived.`,
          HttpStatus.NOT_FOUND
        );
      }

      return resSuccess(
        'Note Archived successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
