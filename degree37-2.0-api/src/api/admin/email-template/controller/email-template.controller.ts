import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Query,
  ParseIntPipe,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { EmailTemplateService } from '../services/email-template.service';
import { CreateEmailTemplateDto } from '../dto/create-email-template.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import {
  GetEmailTemplateInterface,
  GetSingleEmailInterface,
} from '../interface/email-template.interface';
import { UpdateEmailTemplateDto } from '../dto/update-email-template.dto';

@ApiTags('Email-Template')
@Controller('admin/email-template')
export class EmailTemplateController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEmailTemplateDto: CreateEmailTemplateDto) {
    return this.emailTemplateService.addEmailTemplate(createEmailTemplateDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAll(@Query() getEmailTemplateInterface: GetEmailTemplateInterface) {
    return this.emailTemplateService.getAllEmailTemplates(
      getEmailTemplateInterface
    );
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findOne(@Param() singleEmailTemplateInterface: GetSingleEmailInterface) {
    return this.emailTemplateService.findOne(singleEmailTemplateInterface);
  }

  @Put(':id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  update(
    @Param('id', ParseIntPipe) id: bigint,
    @Body() updateEmailTemplateDto: UpdateEmailTemplateDto
  ) {
    return this.emailTemplateService.update(id, updateEmailTemplateDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.GONE)
  deleteEmailTemplate(@Param('id') id: any) {
    return this.emailTemplateService.remove(id);
  }
}
