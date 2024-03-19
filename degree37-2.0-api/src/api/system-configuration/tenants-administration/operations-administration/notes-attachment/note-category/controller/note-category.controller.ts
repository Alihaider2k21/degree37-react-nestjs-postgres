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
import { CreateNoteCategoryDto } from '../dto/create-note-category.dto';
import { UpdateNoteCategoryDto } from '../dto/update-note-category.dto';
import { NoteCategoryService } from '../services/note-category.service';
import { GetAllNotecategoryInterface } from '../interface/note-category.interface';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Notes Atatchment Note Category')
@Controller('note-attachment/note-category')
export class NoteCategoryController {
  constructor(private readonly noteCategoryService: NoteCategoryService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NOTES_AND_ATTACHMENTS_NOTES_CATEGORY_WRITE
  )
  create(@Body() createNoteCategoryDto: CreateNoteCategoryDto) {
    return this.noteCategoryService.create(createNoteCategoryDto);
  }

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NOTES_AND_ATTACHMENTS_NOTES_CATEGORY_WRITE,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NOTES_AND_ATTACHMENTS_NOTES_CATEGORY_READ
  // )
  async getAll(
    @Query() getAllNoteCategoryInterface: GetAllNotecategoryInterface
  ) {
    return this.noteCategoryService.getAll(getAllNoteCategoryInterface);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NOTES_AND_ATTACHMENTS_NOTES_CATEGORY_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NOTES_AND_ATTACHMENTS_NOTES_CATEGORY_READ
  )
  async get(@Param('id') id: any) {
    return this.noteCategoryService.getSingleNoteCategory(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NOTES_AND_ATTACHMENTS_NOTES_CATEGORY_WRITE
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
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NOTES_AND_ATTACHMENTS_NOTES_CATEGORY_ARCHIVE
  )
  async delete(@Param('id') id: number) {
    return this.noteCategoryService.deleteNoteCategory(id);
  }
}
