import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Get,
  Query,
  Param,
  Put,
  ParseIntPipe,
  Request,
  Patch,
} from '@nestjs/common';
import { UserEmailTemplateService } from '../services/user-email-template.service';
import { CreateEmailTemplateDto } from '../dto/create-email-template.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetSingleEmailInterface } from '../../../../../../admin/email-template/interface/email-template.interface';
import { UpdateEmailTemplateDto } from '../dto/update-email-template.dto';
import { UserRequest } from '../../../../../../../common/interface/request';
import { GetUserEmailTemplateInterface } from '../interface/user-email-template.interface';

@ApiTags('Email-Template')
@Controller('email-templates')
export class UserEmailTemplateController {
  constructor(
    private readonly emailTemplateService: UserEmailTemplateService
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createEmailTemplateDto: CreateEmailTemplateDto,
    @Request() req: UserRequest
  ) {
    return this.emailTemplateService.create(createEmailTemplateDto, req);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() getEmailTemplateInterface: GetUserEmailTemplateInterface,
    @Request() req: UserRequest
  ) {
    return this.emailTemplateService.findAll(getEmailTemplateInterface, req);
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
    @Body() updateEmailTemplateDto: UpdateEmailTemplateDto,
    @Request() req: UserRequest
  ) {
    return this.emailTemplateService.update(id, updateEmailTemplateDto, req);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  async archive(@Param('id') id: any, @Request() req: UserRequest) {
    return this.emailTemplateService.archive(id, req);
  }
}
