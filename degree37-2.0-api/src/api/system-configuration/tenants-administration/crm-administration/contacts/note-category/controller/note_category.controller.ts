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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateNoteCategoryDto } from '../dto/create-note-category.dto';
import { UpdateNoteCategoryDto } from '../dto/update-note-category.dto';
import { NoteCategoryService } from '../services/note_category.services';
import { GetAllNotecategoryInterface } from '../interface/note-category.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Contacts Note Category')
@Controller('contacts/note-category')
export class NoteCategoryController {
  constructor(private readonly noteCategoryService: NoteCategoryService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_NOTES_CATEGORY_WRITE
  )
  create(@Body() createNoteCategoryDto: CreateNoteCategoryDto) {
    return this.noteCategoryService.create(createNoteCategoryDto);
  }

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_NOTES_CATEGORY_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_NOTES_CATEGORY_READ
  )
  async getAll(
    @Req() req,
    @Query() getAllNoteCategoryInterface: GetAllNotecategoryInterface
  ) {
    return this.noteCategoryService.getAll(
      getAllNoteCategoryInterface,
      req.user
    );
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_NOTES_CATEGORY_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_NOTES_CATEGORY_READ
  )
  async get(@Param('id') id: any) {
    return this.noteCategoryService.getSingleNoteCategory(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_NOTES_CATEGORY_WRITE
  )
  async update(
    @Param('id') id: number,
    @Body() updateNoteCategoryDto: UpdateNoteCategoryDto
  ) {
    return this.noteCategoryService.updateNoteCategory(
      id,
      updateNoteCategoryDto
    );
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_NOTES_CATEGORY_ARCHIVE
  )
  async delete(@Param('id') id: number) {
    return this.noteCategoryService.deleteNoteCategory(id);
  }
}
