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
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateNoteSubCategoryDto } from '../dto/create-nce-subcategory.dto';
import { UpdateNoteSubCategoryDto } from '../dto/update-nce-subcategory.dto';
import { NceSubCategoryService } from '../services/nce-subcategory.service';
import { GetAllNoteSubCategoryInterface } from '../interface/nce-subcategory.interface';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('NCE SubCategory')
@Controller('nce-subcategory')
export class NceSubCategoryController {
  constructor(private readonly noteSubCategoryService: NceSubCategoryService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_SUBCATEGORY_WRITE
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
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_SUBCATEGORY_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_SUBCATEGORY_WRITE
  )
  async getAll(
    @Query() getAllNoteCategoryInterface: GetAllNoteSubCategoryInterface
  ) {
    return this.noteSubCategoryService.getAll(getAllNoteCategoryInterface);
  }
  @Get('get-all')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_SUBCATEGORY_READ,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_SUBCATEGORY_WRITE
  // )
  @HttpCode(HttpStatus.CREATED)
  async allNceSubCategory(
    @Query('id') id: any,
    @Request() req: UserRequest,
    @Query('is_active') is_active?: boolean
  ) {
    return this.noteSubCategoryService.getAllNceSubCategory(
      id,
      req.user,
      is_active
    );
  }
  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_SUBCATEGORY_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_SUBCATEGORY_WRITE
  )
  async get(@Param('id') id: any) {
    return this.noteSubCategoryService.getSingleNoteCategory(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_SUBCATEGORY_WRITE
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
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_SUBCATEGORY_ARCHIVE
  )
  async delete(@Param('id') id: number) {
    return await this.noteSubCategoryService.deleteNoteCategory(id);
  }
}
