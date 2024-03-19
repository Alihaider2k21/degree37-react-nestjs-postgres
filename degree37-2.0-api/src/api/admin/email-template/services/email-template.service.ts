import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TemplateService } from '../../templates/services/template.service';
import { Like, Repository } from 'typeorm';
import { EmailTemplate } from '../entities/email-template.entity';
import {
  EmailTemplateInterface,
  GetEmailTemplateInterface,
  GetSingleEmailInterface,
} from '../interface/email-template.interface';
import { UpdateEmailTemplateDto } from '../dto/update-email-template.dto';
import { EmailTemplateHistory } from '../entities/email-template-history.entity';

@Injectable()
export class EmailTemplateService {
  constructor(
    @InjectRepository(EmailTemplate)
    private readonly emailTemplateRepository: Repository<EmailTemplate>,
    @InjectRepository(EmailTemplateHistory)
    private readonly entityHistoryRepository: Repository<EmailTemplateHistory>,
    private readonly templateService: TemplateService
  ) {}

  async addEmailTemplate(emailTemplateInterface: EmailTemplateInterface) {
    try {
      const { templateId } = emailTemplateInterface;
      const template = await this.templateService.findTemplate(templateId);
      if (!template) {
        return new HttpException(
          `Template with ID ${templateId} not found`,
          HttpStatus.BAD_REQUEST
        );
      }

      const emailTemplate: any = {
        subject: emailTemplateInterface.subject,
        content: emailTemplateInterface.content,
        type: emailTemplateInterface.templateType,
        status: emailTemplateInterface.isActive,
        template: template,
      };
      await this.emailTemplateRepository.save(emailTemplate);

      return {
        status: HttpStatus.CREATED,
        message: 'Email Template Created Successfully',
      };
    } catch {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllEmailTemplates(
    getEmailTemplateInterface: GetEmailTemplateInterface
  ): Promise<any> {
    try {
      const limit: number = getEmailTemplateInterface?.limit
        ? +getEmailTemplateInterface?.limit
        : +process.env.PAGE_SIZE;

      const page = getEmailTemplateInterface?.page
        ? +getEmailTemplateInterface?.page
        : 1;

      const where = {};
      if (getEmailTemplateInterface?.title) {
        Object.assign(where, {
          subject: Like(`%${getEmailTemplateInterface?.title}%`),
        });
      }

      const [response, count] = await this.emailTemplateRepository.findAndCount(
        {
          where,
          relations: ['template'],
          take: limit,
          skip: (page - 1) * limit,
          order: { id: 'DESC' },
        }
      );

      return {
        status: HttpStatus.OK,
        message: 'Email Templates Fetched Succesfuly',
        count: count,
        data: response,
      };
    } catch {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(
    singleEmailTemplateInterface: GetSingleEmailInterface
  ): Promise<any> {
    try {
      const response = await this.emailTemplateRepository.findOne({
        where: { id: singleEmailTemplateInterface.id },
        relations: ['template'],
      });
      if (!response) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Please enter a valid email template id',
          data: response,
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'Email Template Fetched Succesfuly',
        data: response,
      };
    } catch {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: bigint,
    updateEmailTemplateDto: UpdateEmailTemplateDto
  ): Promise<any> {
    let template = null;

    const emailTemplate = await this.emailTemplateRepository.findOne({
      where: {
        id: id,
      },
      relations: ['template'],
    });

    if (!emailTemplate) {
      return new HttpException(
        'Please enter a valid email template id',
        HttpStatus.BAD_REQUEST
      );
    }
    const UpdatedisActive =
      'isActive' in updateEmailTemplateDto
        ? updateEmailTemplateDto.isActive
        : emailTemplate.status;
    const UpdatedtemplateType =
      'templateType' in updateEmailTemplateDto
        ? updateEmailTemplateDto.templateType
        : emailTemplate.type;
    let updatedData = {
      ...emailTemplate,
      ...updateEmailTemplateDto,
      status: UpdatedisActive,
      type: UpdatedtemplateType,
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
        status: UpdatedisActive,
        type: UpdatedtemplateType,
        template: template,
      };
    }

    const updatedEmailTemplate = await this.emailTemplateRepository.update(
      {
        id: id,
      },
      {
        template: updatedData?.template,
        type: updatedData?.type,
        subject: updatedData?.subject,
        content: updatedData?.content,
        status: updatedData?.status,
      }
    );

    if (updatedEmailTemplate.affected) {
      return {
        status: HttpStatus.OK,
        message: 'Email Template Updated Successfully',
      };
    } else {
      throw new NotFoundException(
        'Email Template with provided id did not update'
      );
    }
  }

  async remove(id: any): Promise<any> {
    const emailTemplate = await this.emailTemplateRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!emailTemplate) {
      return new HttpException(
        'Please enter a valid email template id',
        HttpStatus.BAD_REQUEST
      );
    }

    const deletedEmailTemplate = await this.emailTemplateRepository.delete(id);
    if (deletedEmailTemplate.affected) {
      return {
        status: HttpStatus.OK,
        message: 'Email Template Deleted Succesfuly',
      };
    } else {
      throw new NotFoundException(
        'Email Template with provided id did not delete'
      );
    }
  }
}
