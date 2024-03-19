import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Request,
  Put,
  Param,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { UserRequest } from 'src/common/interface/request';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AttachmentsService } from '../services/attachment.service';
import { CreateAttachmentsDto } from '../dto/create-attachment.dto';
import {
  AttachmentsFiltersInterface,
  AttachmentsQuery,
} from '../interface/attachment.interface';
import { UpdateAttachmentsDto } from '../dto/update-attaachment.dto';

@Controller('/documents/attachments')
@ApiTags('Attachments')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentsService) {}

  @Post('/')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  create(
    @Query() attachmentsQuery: AttachmentsQuery,
    @Body() createAttachmentsDto: CreateAttachmentsDto,
    @Request() req: UserRequest
  ) {
    return this.attachmentService.create(
      attachmentsQuery,
      createAttachmentsDto,
      req
    );
  }

  @Get()
  @ApiBearerAuth()
  findAll(
    @Query() attachmentFiltersInterface: AttachmentsFiltersInterface,
    @Request() req: UserRequest
  ) {
    attachmentFiltersInterface.tenant_id = req.user.tenant.id;
    return this.attachmentService.findAll(attachmentFiltersInterface);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  findOne(@Param('id') id: any, @Request() req: UserRequest) {
    return this.attachmentService.findOne(+id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() updateAttachmentsDto: UpdateAttachmentsDto,
    @Request() req: UserRequest
  ) {
    return this.attachmentService.update(id, updateAttachmentsDto, req);
  }

  @Patch('/archive/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  archive(@Param('id') id: any, @Request() req: UserRequest) {
    return this.attachmentService.archive(id, req);
  }
}
