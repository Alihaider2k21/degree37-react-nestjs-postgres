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
import { CreateNoteCategoryDto } from '../dto/create-nce-category.dto';
import { UpdateNoteCategoryDto } from '../dto/update-nce-category.dto';
import { NceCategoryService } from '../services/nce-category.service';
import { GetAllNotecategoryInterface } from '../interface/nce-category.interface';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('NCE Category')
@Controller('nce-category')
export class NceCategoryController {
  constructor(private readonly noteCategoryService: NceCategoryService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_CATEGORY_WRITE
  )
  create(@Body() createNoteCategoryDto: CreateNoteCategoryDto) {
    return this.noteCategoryService.create(createNoteCategoryDto);
  }
  @Get('get-all')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  allNceCategory(
    @Request() req: UserRequest,
    @Query('is_active') is_active?: boolean
  ) {
    return this.noteCategoryService.getAllNceCategory(req.user, is_active);
  }
  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_CATEGORY_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_CATEGORY_WRITE
  )
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
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_CATEGORY_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_CATEGORY_WRITE
  )
  async get(@Param('id') id: any) {
    return this.noteCategoryService.getSingleNoteCategory(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_CATEGORY_WRITE
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
    PermissionsEnum.SYSTEM_CONFIGURATION_OPERATIONS_ADMINISTRATION_NON_COLLECTION_EVENTS_NCE_CATEGORY_ARCHIVE
  )
  async delete(@Param('id') id: number) {
    return this.noteCategoryService.deleteNoteCategory(id);
  }
}
