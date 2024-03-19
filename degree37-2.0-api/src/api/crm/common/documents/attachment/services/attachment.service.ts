import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import {
  resError,
  resSuccess,
} from '../../../../../system-configuration/helpers/response';
import { ErrorConstants } from '../../../../../system-configuration/constants/error.constants';
import { Category } from '../../../../../system-configuration/tenants-administration/crm-administration/common/entity/category.entity';
import { User } from '../../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Tenant } from '../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { HistoryService } from '../../../../../common/services/history.service';
import { CrmAttachments } from '../entities/attachment.entity';
import { CrmAttachmentsHistory } from '../entities/attachment-history.entity';
import { CreateAttachmentsDto } from '../dto/create-attachment.dto';
import { AttachmentsFiltersInterface } from '../interface/attachment.interface';
import { UpdateAttachmentsDto } from '../dto/update-attaachment.dto';
import { AttachmentsFiles } from '../entities/attachment-files.entity';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';

dotenv.config();
@Injectable()
export class AttachmentsService extends HistoryService<CrmAttachmentsHistory> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(CrmAttachments)
    private readonly attachmentsRepository: Repository<CrmAttachments>,
    @InjectRepository(CrmAttachmentsHistory)
    private readonly attachmentHistoryRepository: Repository<CrmAttachmentsHistory>,
    @InjectRepository(AttachmentsFiles)
    private readonly attachmentsFilesRepository: Repository<AttachmentsFiles>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>
  ) {
    super(attachmentHistoryRepository);
  }

  async create(
    attachmentsQuery: any,
    createAttachmentDto: CreateAttachmentsDto,
    req: any
  ) {
    try {
      const {
        name,
        description,
        attachment_files,
        category_id,
        sub_category_id,
      } = createAttachmentDto;
      const { attachmentable_id, attachmentable_type } = attachmentsQuery;

      const existingAttachment = await this.attachmentsRepository.findOneBy({
        name: name,
        attachmentable_type: attachmentable_type,
        is_archived: false,
      });

      if (existingAttachment) {
        throw new HttpException(
          'Attachment already exist!',
          HttpStatus.CONFLICT
        );
      }
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

      if (!subCategory || (subCategory && !subCategory?.parent_id)) {
        throw new HttpException(
          'SubCategory Does not exist!',
          HttpStatus.CONFLICT
        );
      }

      const user = await this.userRepository.findOneBy({
        id: req?.user?.id,
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const tenant = await this.tenantRepository.findOneBy({
        id: req?.user?.tenant?.id,
      });
      if (!tenant) {
        throw new HttpException(`Tenant not found.`, HttpStatus.NOT_FOUND);
      }

      const createAttachment = new CrmAttachments();

      createAttachment.attachmentable_id = attachmentable_id;
      createAttachment.attachmentable_type = attachmentable_type;
      createAttachment.name = name;
      createAttachment.description = description;
      createAttachment.category_id = category;
      createAttachment.sub_category_id = subCategory;
      createAttachment.tenant_id = tenant;
      createAttachment.created_by = user;

      const savedAttachment = await this.attachmentsRepository.save(
        createAttachment
      );

      for (const filePath of attachment_files) {
        const attachmentFile = {
          attachment_id: savedAttachment,
          attachment_path: filePath,
          created_by: user,
        };

        await this.attachmentsFilesRepository.save(attachmentFile);
      }

      return resSuccess(
        'Attachment Created Successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedAttachment
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAll(attachmentFiltersInterface: AttachmentsFiltersInterface) {
    try {
      const {
        keyword,
        category_id,
        sub_category_id,
        attachmentable_id,
        attachmentable_type,
        tenant_id,
        sortBy,
        sortOrder,
      } = attachmentFiltersInterface;
      let { page, limit } = attachmentFiltersInterface;

      limit = limit ? +limit : +process.env.PAGE_SIZE;

      page = page ? +page : 1;

      const where = { is_archived: false };

      Object.assign(where, {
        tenant_id: { id: tenant_id },
      });

      if (keyword) {
        Object.assign(where, {
          name: ILike(`%${keyword}%`),
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

      if (attachmentable_id) {
        Object.assign(where, {
          attachmentable_id,
        });
      }

      if (attachmentable_type) {
        Object.assign(where, {
          attachmentable_type,
        });
      }

      let order: any = { id: 'DESC' };

      if (sortBy) {
        if (sortBy == 'category_id') {
          const orderDirection = sortOrder || 'DESC';
          order = { category_id: { name: orderDirection } };
        } else if (sortBy == 'sub_category_id') {
          const orderDirection = sortOrder || 'DESC';
          order = { sub_category_id: { name: orderDirection } };
        } else if (sortBy == 'created_by') {
          const orderDirection = sortOrder || 'DESC';
          order = { created_by: { first_name: orderDirection } };
        } else {
          const orderBy = sortBy;
          const orderDirection = sortOrder || 'DESC';
          order = { [orderBy]: orderDirection };
        }
      }

      const [response, count] = await this.attachmentsRepository.findAndCount({
        where,
        relations: [
          'created_by',
          'tenant_id',
          'category_id',
          'sub_category_id',
          'attachment_files',
        ],
        take: limit,
        skip: (page - 1) * limit,
        order,
      });

      return {
        status: HttpStatus.OK,
        message: 'Attachment Fetched Succesfully',
        count: count,
        data: response,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findOne(id: any) {
    try {
      const attachment = await this.attachmentsRepository.findOne({
        where: { id },
        relations: [
          'created_by',
          'tenant_id',
          'category_id',
          'sub_category_id',
          'attachment_files',
        ],
      });

      if (!attachment) {
        throw new HttpException(`Attachment not found.`, HttpStatus.NOT_FOUND);
      }

      if (attachment?.is_archived) {
        throw new HttpException(
          `Attachment is archived.`,
          HttpStatus.NOT_FOUND
        );
      }

      const modifiedData: any = await getModifiedDataDetails(
        this.attachmentHistoryRepository,
        id,
        this.userRepository
      );

      const updatedBy: any = {
        modified_by: modifiedData?.modified_by
          ? modifiedData?.modified_by
          : attachment?.created_by,
        modified_at: modifiedData?.modified_at
          ? modifiedData?.modified_at
          : attachment?.created_at,
      };

      return resSuccess(
        'Attachment fetched successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { ...attachment, ...updatedBy }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async update(id: any, updateAttachmentsDto: UpdateAttachmentsDto, req: any) {
    try {
      const {
        name,
        description,
        attachment_files,
        category_id,
        sub_category_id,
      } = updateAttachmentsDto;

      const existingAttachment = await this.attachmentsRepository.findOne({
        where: { id },
        relations: [
          'created_by',
          'tenant_id',
          'category_id',
          'sub_category_id',
          'attachment_files',
        ],
      });

      if (!existingAttachment) {
        throw new HttpException('Attachment not found!', HttpStatus.NOT_FOUND);
      }

      const attachmentBeforeUpdate = { ...existingAttachment };

      existingAttachment.name = name ?? existingAttachment.name;
      existingAttachment.description =
        description ?? existingAttachment.description;

      if (category_id) {
        const category = await this.categoryRepository.findOneBy({
          id: category_id,
        });

        if (!category) {
          throw new HttpException(
            'Category does not exist!',
            HttpStatus.CONFLICT
          );
        }

        existingAttachment.category_id = category;
      }

      if (sub_category_id) {
        const subCategory = await this.categoryRepository.findOne({
          where: {
            id: sub_category_id,
          },
          relations: ['parent_id'],
        });

        if (!subCategory || (subCategory && !subCategory.parent_id)) {
          throw new HttpException(
            'SubCategory does not exist!',
            HttpStatus.CONFLICT
          );
        }

        existingAttachment.sub_category_id = subCategory;
      }

      const updatedAttachment = await this.attachmentsRepository.save(
        existingAttachment
      );

      const attachmentHistory = new CrmAttachmentsHistory();
      Object.assign(attachmentHistory, attachmentBeforeUpdate);
      attachmentHistory.name = attachmentBeforeUpdate?.name;
      attachmentHistory.description = attachmentBeforeUpdate?.description;
      attachmentHistory.attachmentable_id =
        attachmentBeforeUpdate?.attachmentable_id;
      attachmentHistory.attachmentable_type =
        attachmentBeforeUpdate?.attachmentable_type;
      attachmentHistory.category_id = attachmentBeforeUpdate?.category_id.id;
      attachmentHistory.sub_category_id =
        attachmentBeforeUpdate?.sub_category_id.id;
      attachmentHistory.tenant_id = attachmentBeforeUpdate?.tenant_id.id;
      attachmentHistory.created_by = req?.user?.id;
      attachmentHistory.is_archived = attachmentBeforeUpdate?.is_archived;
      attachmentHistory.history_reason = 'C';

      delete attachmentHistory?.created_at;
      await this.createHistory(attachmentHistory);

      if (attachment_files.length) {
        await this.attachmentsFilesRepository.delete({ attachment_id: id });
        for (const filePath of attachment_files) {
          const attachmentFile = {
            attachment_id: updatedAttachment,
            attachment_path: filePath,
            created_by: req?.user,
          };

          await this.attachmentsFilesRepository.save(attachmentFile);
        }
      }

      const attachment = await this.attachmentsRepository.findOne({
        where: { id },
        relations: ['category_id', 'sub_category_id', 'attachment_files'],
      });

      return resSuccess(
        'Attachment Updated successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        attachment
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async archive(id: any, req: any) {
    try {
      const attachment = await this.attachmentsRepository.findOne({
        where: { id },
        relations: [
          'created_by',
          'tenant_id',
          'category_id',
          'sub_category_id',
        ],
      });

      if (!attachment) {
        throw new HttpException(`Attachment not found.`, HttpStatus.NOT_FOUND);
      }

      if (attachment.is_archived === false) {
        attachment.is_archived = true;
        const archivedAttachment = await this.attachmentsRepository.save(
          attachment
        );

        const attachmentHistory = new CrmAttachmentsHistory();
        Object.assign(attachmentHistory, archivedAttachment);
        attachmentHistory.attachmentable_id =
          archivedAttachment?.attachmentable_id;
        attachmentHistory.attachmentable_type =
          archivedAttachment?.attachmentable_type;
        attachmentHistory.name = archivedAttachment?.name;
        attachmentHistory.description = archivedAttachment?.description;
        attachmentHistory.category_id = archivedAttachment?.category_id?.id;
        attachmentHistory.sub_category_id =
          archivedAttachment?.sub_category_id?.id;
        attachmentHistory.created_by = req?.user?.id;
        attachmentHistory.tenant_id = archivedAttachment?.tenant_id?.id;
        attachmentHistory.history_reason = 'C';
        attachmentHistory.is_archived = archivedAttachment?.is_archived;
        delete attachmentHistory?.created_at;
        await this.createHistory(attachmentHistory);
        attachmentHistory.history_reason = 'D';
        await this.createHistory(attachmentHistory);
      } else {
        throw new HttpException(
          `Attachment is already archived.`,
          HttpStatus.NOT_FOUND
        );
      }

      return resSuccess(
        'Attachment Archived successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
