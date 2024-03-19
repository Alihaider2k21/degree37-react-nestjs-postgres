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
import { CreateNoteSubCategoryDto } from '../dto/create-subnote_category.dto';
import { UpdateNoteSubCategoryDto } from '../dto/update-note-subcategory.dto';
import { NoteSubCategoryService } from '../services/note_subcategory.services';
import { GetAllNoteSubCategoryInterface } from '../interface/note_subcategory.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Contact Note SubCategory')
@Controller('contacts/note-subcategory')
export class NoteSubCategoryController {
  constructor(
    private readonly noteSubCategoryService: NoteSubCategoryService
  ) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_NOTES_SUBCATEGORY_WRITE
  )
  create(@Body() createNoteSubCategoryDto: CreateNoteSubCategoryDto) {
    return this.noteSubCategoryService.create(createNoteSubCategoryDto);
  }

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_NOTES_SUBCATEGORY_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_NOTES_SUBCATEGORY_READ
  )
  async getAll(
    @Query() getAllNoteCategoryInterface: GetAllNoteSubCategoryInterface
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
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_NOTES_SUBCATEGORY_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_NOTES_SUBCATEGORY_READ
  )
  async get(@Param('id') id: any) {
    return this.noteSubCategoryService.getSingleNoteCategory(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_NOTES_SUBCATEGORY_WRITE
  )
  async update(
    @Param('id') id: number,
    @Body() updateNoteSubCategoryDto: UpdateNoteSubCategoryDto
  ) {
    return this.noteSubCategoryService.updateNoteCategory(
      id,
      updateNoteSubCategoryDto
    );
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_CONTACTS_NOTES_SUBCATEGORY_ARCHIVE
  )
  async delete(@Param('id') id: number) {
    return await this.noteSubCategoryService.deleteNoteCategory(id);
  }
}
