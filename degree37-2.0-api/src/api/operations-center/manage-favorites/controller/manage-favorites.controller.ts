import {
  Controller,
  Post,
  Body,
  Request,
  UsePipes,
  ValidationPipe,
  HttpCode,
  Query,
  Get,
  HttpStatus,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserRequest } from 'src/common/interface/request';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateManageFavoritesDto,
  ListManageFavoritesDto,
  MakeDefaultDto,
} from '../dto/manage-favorites.dto';
import { ManageFavoritesService } from '../services/manage-favorites.service';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Manage Favorites')
@Controller('/operations-center/manage-favorites')
export class ManageFavoritesController {
  constructor(
    private readonly manageFavoritesService: ManageFavoritesService
  ) {}

  @Post('/')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_MANAGE_FAVORITE_WRITE
  )
  @UsePipes(new ValidationPipe())
  create(
    @Body() createManageFavoritesDto: CreateManageFavoritesDto,
    @Request() req: UserRequest
  ) {
    createManageFavoritesDto.created_by = req?.user?.id;
    createManageFavoritesDto.tenant_id = req?.user?.tenant?.id;
    return this.manageFavoritesService.create(createManageFavoritesDto);
  }
  @Get('/')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_MANAGE_FAVORITE_READ,
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_MANAGE_FAVORITE_WRITE
  )
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async listFavorites(
    @Query() listManageFavoritesDto: ListManageFavoritesDto,
    @Request() req: UserRequest
  ) {
    return this.manageFavoritesService.listFavorites(
      listManageFavoritesDto,
      req?.user?.tenant?.id
    );
  }

  @Get('/products/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_MANAGE_FAVORITE_READ,
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_MANAGE_FAVORITE_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  getProductsProcedures(@Param('id') id: any) {
    return this.manageFavoritesService.getProductsProcedures(id);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_MANAGE_FAVORITE_READ,
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_MANAGE_FAVORITE_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  findOne(@Param('id') id: any) {
    return this.manageFavoritesService.getSingleFavorite(+id);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_MANAGE_FAVORITE_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() createManageFavoritesDto: CreateManageFavoritesDto,
    @Request() req: UserRequest
  ) {
    return this.manageFavoritesService.update(
      id,
      createManageFavoritesDto,
      req.user
    );
  }

  @Put('/archive/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_MANAGE_FAVORITE_ARCHIVE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  archive(@Param('id') id: any, @Request() req: UserRequest) {
    return this.manageFavoritesService.archive(id, req.user);
  }

  @Patch('/set-default/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_MANAGE_FAVORITE_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  setDefaultFavorite(
    @Param('id') id: any,
    @Body() makeDefaultDto: MakeDefaultDto,
    @Request() req: UserRequest
  ) {
    return this.manageFavoritesService.setDefaultFavorite(
      id,
      req?.user?.tenant?.id,
      req?.user?.id,
      makeDefaultDto
    );
  }
}
