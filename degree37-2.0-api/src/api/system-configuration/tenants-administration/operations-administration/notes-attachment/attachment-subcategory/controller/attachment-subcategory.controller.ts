import {
  Controller,
  Get,
  Post,
  Param,
  UsePipes,
  HttpCode,
  ValidationPipe,
  HttpStatus,
  Put,
  Body,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateAttachmentSubCategoryDto } from '../dto/create-attachment-subcategory.dto';
import { UpdateAttachmentSubCategoryDto } from '../dto/update-attachment-subcategory.dto';
import { AttachmentSubCategoryService } from '../service/attachment-subcategory.service';
import { GetAllAttachmentSubCategoryInterface } from '../interfaces/query-attachment-subcategory.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Notes Attachment Attachment SubCategory')
@Controller('notes-attachments/attachment-subcategories')
export class AttachmentSubCategoryController {
  constructor(
    private readonly noteSubCategoryService: AttachmentSubCategoryService
  ) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NOTES_AND_ATTACHMENTS_ATTACHMENTS_SUBCATEGORY_WRITE
  )
  create(@Body() createNoteSubCategoryDto: CreateAttachmentSubCategoryDto) {
    return this.noteSubCategoryService.create(createNoteSubCategoryDto);
  }

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NOTES_AND_ATTACHMENTS_ATTACHMENTS_SUBCATEGORY_WRITE,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NOTES_AND_ATTACHMENTS_ATTACHMENTS_SUBCATEGORY_READ
  // )
  async getAll(
    @Query() getAllNoteCategoryInterface: GetAllAttachmentSubCategoryInterface
  ) {
    return this.noteSubCategoryService.getAll(getAllNoteCategoryInterface);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NOTES_AND_ATTACHMENTS_ATTACHMENTS_SUBCATEGORY_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NOTES_AND_ATTACHMENTS_ATTACHMENTS_SUBCATEGORY_READ
  )
  async get(@Param('id') id: any) {
    return this.noteSubCategoryService.getSingleAttachmentCategory(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NOTES_AND_ATTACHMENTS_ATTACHMENTS_SUBCATEGORY_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NOTES_AND_ATTACHMENTS_ATTACHMENTS_SUBCATEGORY_READ
  )
  async update(
    @Param('id') id: number,
    @Body() updateNoteSubCategoryDto: UpdateAttachmentSubCategoryDto
  ) {
    return this.noteSubCategoryService.updateAttachmentCategory(
      id,
      updateNoteSubCategoryDto
    );
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NOTES_AND_ATTACHMENTS_ATTACHMENTS_SUBCATEGORY_ARCHIVE
  )
  async delete(@Param('id') id: number) {
    return await this.noteSubCategoryService.deleteAttachmentCategory(id);
  }
}
