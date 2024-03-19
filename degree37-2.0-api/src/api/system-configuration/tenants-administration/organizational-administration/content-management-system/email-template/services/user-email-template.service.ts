import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TemplateService } from '../../../../../../admin/templates/services/template.service';
import { EntityManager, ILike, Like, Repository } from 'typeorm';
import { EmailTemplate } from '../../../../../../admin/email-template/entities/email-template.entity';

import { EmailTemplateHistory } from '../../../../../../admin/email-template/entities/email-template-history.entity';
import { CreateEmailTemplateDto } from '../dto/create-email-template.dto';
import {
  GetEmailTemplateInterface,
  GetSingleEmailInterface,
} from '../../../../../../admin/email-template/interface/email-template.interface';
import { UpdateEmailTemplateDto } from '../dto/update-email-template.dto';
import { UserRequest } from '../../../../../../../common/interface/request';
import { resError } from '../../../../../helpers/response';
import { ErrorConstants } from '../../../../../constants/error.constants';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { CommonFunction } from '../../../../../../crm/contacts/common/common-functions';
import { HistoryService } from '../../../../../../common/services/history.service';
import { GetUserEmailTemplateInterface } from '../interface/user-email-template.interface';
import { DonorGroupCodesHistory } from '../../../../../../crm/contacts/donor/entities/donor-group-codes-history.entity';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';

@Injectable()
export class UserEmailTemplateService extends HistoryService<EmailTemplateHistory> {
  private message = 'Email Template';

  constructor(
    @InjectRepository(EmailTemplate)
    private readonly entityRepository: Repository<EmailTemplate>,
    @InjectRepository(EmailTemplateHistory)
    private readonly entityHistoryRepository: Repository<EmailTemplateHistory>,
    private readonly templateService: TemplateService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly commonFunction: CommonFunction
  ) {
    super(entityHistoryRepository);
  }

  async create(
    createEmailTemplateDto: CreateEmailTemplateDto,
    req: UserRequest
  ) {
    try {
      const { templateId } = createEmailTemplateDto;
      const template = await this.templateService.findTemplate(templateId);
      if (!template) {
        return new HttpException(
          `Template with ID ${templateId} not found`,
          HttpStatus.BAD_REQUEST
        );
      }

      const emailTemplate: any = {
        subject: createEmailTemplateDto.subject,
        content: createEmailTemplateDto.content,
        type: createEmailTemplateDto.type,
        status: createEmailTemplateDto.status,
        name: createEmailTemplateDto.name,
        variables: createEmailTemplateDto.variables,
        tenant_id: req.user.tenant.id,
        created_by: req.user.id,
        template: template,
      };
      await this.entityRepository.save(emailTemplate);

      return {
        status: HttpStatus.CREATED,
        message: 'Email Template Created Successfully',
      };
    } catch {
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(
    getEmailTemplateInterface: GetUserEmailTemplateInterface,
    req: UserRequest
  ) {
    try {
      const limit: number = getEmailTemplateInterface?.limit
        ? +getEmailTemplateInterface?.limit
        : +process.env.PAGE_SIZE;

      const page = getEmailTemplateInterface?.page
        ? +getEmailTemplateInterface?.page
        : 1;

      const where = {};
      Object.assign(where, {
        tenant_id: req.user?.tenant_id,
        is_archived: false,
      });

      if (getEmailTemplateInterface?.title) {
        Object.assign(where, {
          name: ILike(`%${getEmailTemplateInterface?.title}%`),
        });
      }

      if (getEmailTemplateInterface?.status) {
        Object.assign(where, {
          status: getEmailTemplateInterface?.status,
        });
      }

      if (getEmailTemplateInterface?.type) {
        Object.assign(where, {
          type: getEmailTemplateInterface?.type,
        });
      }

      const [response, count] = await this.entityRepository.findAndCount({
        where,
        relations: ['template'],
        take: limit,
        skip: (page - 1) * limit,
        order: { id: 'DESC' },
      });

      return {
        status: HttpStatus.OK,
        message: 'Email Templates Fetched Successfully',
        count: count,
        data: response,
      };
    } catch {
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(singleEmailTemplateInterface: GetSingleEmailInterface) {
    try {
      const response = await this.entityRepository.findOne({
        where: { id: singleEmailTemplateInterface.id },
        relations: ['template', 'created_by'],
      });
      if (!response) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Please enter a valid email template id',
          data: response,
        };
      }

      const modifiedData = await getModifiedDataDetails(
        this.entityHistoryRepository,
        Number(singleEmailTemplateInterface.id),
        this.userRepository
      );
      const modified_by = modifiedData['modified_by'];
      const modified_at = modifiedData['modified_at'];

      return {
        status: HttpStatus.OK,
        message: 'Email Template Fetched Successfully',
        data: {
          ...response,
          modified_by: modified_by,
          modified_at: modified_at,
        },
      };
    } catch {
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: bigint,
    updateEmailTemplateDto: UpdateEmailTemplateDto,
    req: UserRequest
  ) {
    try {
      let template = null;

      const emailTemplate = await this.entityRepository.findOne({
        where: {
          id: id,
        },
        relations: ['template', 'tenant'],
      });

      if (!emailTemplate) {
        return new HttpException(
          'Please enter a valid Email Template Id',
          HttpStatus.BAD_REQUEST
        );
      }

      let updatedData = {
        ...emailTemplate,
        ...updateEmailTemplateDto,
      };

      if (
        updateEmailTemplateDto.templateId &&
        emailTemplate?.template?.id != updateEmailTemplateDto.templateId
      ) {
        template = await this.templateService.findTemplate(
          updateEmailTemplateDto.templateId
        );
        if (!template) {
          return new HttpException(
            'Please enter a valid template id',
            HttpStatus.BAD_REQUEST
          );
        }

        updatedData = {
          ...emailTemplate,
          ...updateEmailTemplateDto,
          template: template,
        };
      }

      const updatedEmailTemplate = await this.entityRepository.update(
        {
          id: id,
        },
        {
          template: updatedData?.template,
          type: updatedData?.type,
          subject: updatedData?.subject,
          content: updatedData?.content,
          status: updatedData?.status,
          name: updatedData?.name,
          variables: updatedData?.variables,
        }
      );

      const saveHistory = new EmailTemplateHistory();
      Object.assign(saveHistory, emailTemplate);
      saveHistory.id = emailTemplate.id;
      saveHistory.created_by = req.user?.id;
      saveHistory.tenant_id = emailTemplate.tenant_id;
      saveHistory.history_reason = 'C';
      delete saveHistory?.created_at;
      await this.createHistory(saveHistory);

      return {
        status: HttpStatus.OK,
        message: 'Email Template Updated Successfully',
        data: {
          ...updatedEmailTemplate,
        },
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async archive(id: any, req: UserRequest) {
    try {
      const user = await this.commonFunction.entityExist(
        this.userRepository,
        { where: { id: req.user?.id } },
        'User'
      );
      const query = {
        relations: ['created_by', 'tenant'],
        where: {
          id,
          is_archived: false,
        },
      };
      const entity = await this.commonFunction.entityExist(
        this.entityRepository,
        query,
        this.message
      );

      const saveHistory = new EmailTemplateHistory();
      Object.assign(saveHistory, entity);
      saveHistory.id = entity.id;
      saveHistory.created_by = user.id;
      saveHistory.tenant_id = entity.tenant_id;
      saveHistory.history_reason = 'D';
      delete saveHistory?.created_at;
      await this.createHistory(saveHistory);
      entity['is_archived'] = !entity.is_archived;
      await this.entityRepository.save(entity);
      return {
        status: HttpStatus.NO_CONTENT,
        message: `${this.message} Archive Successfully`,
        data: entity,
      };
    } catch (error) {
      return resError(error, ErrorConstants.Error, error);
    }
  }
}
