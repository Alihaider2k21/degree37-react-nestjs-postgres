import {
  Controller,
  Post,
  Body,
  Patch,
  Put,
  Request,
  UsePipes,
  ValidationPipe,
  Query,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRequest } from '../../../../common/interface/request';
import { NonCollectionProfileService } from '../services/non-collection-profile.service';
import { CreateNonCollectionProfileDto } from '../dto/non-collection-profile.dto';
import { UpdateNonCollectionProfileDto } from '../dto/update-non-collection-profile.dto';
import { NonCollectionProfileInterface } from '../interface/non-collection-profile.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
import { NonCollectionProfileEventHistoryInterface } from '../interface/non-collection-profile-history.interface';
@ApiTags('Non-Collection profiles')
@Controller('non-collection-profiles')
export class NonCollectionProfileController {
  constructor(
    private readonly nonCollectionProfileService: NonCollectionProfileService
  ) {}

  @Post('/')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_NON_COLLECTION_PROFILES_WRITE)
  create(
    @Request() req: UserRequest,
    @Body() createNonCollectionProfileDto: CreateNonCollectionProfileDto
  ) {
    return this.nonCollectionProfileService.create(
      createNonCollectionProfileDto,
      req.user
    );
  }
  @Get()
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.CRM_NON_COLLECTION_PROFILES_WRITE,
    PermissionsEnum.CRM_NON_COLLECTION_PROFILES_READ
  )
  findAll(
    @Query() nonCollectionProfileInterface: NonCollectionProfileInterface,
    @Request() req: UserRequest
  ) {
    nonCollectionProfileInterface.tenant_id = req.user.tenant.id;
    return this.nonCollectionProfileService.findAll(
      nonCollectionProfileInterface
    );
  }
  @Get('get-all')
  @ApiBearerAuth()
  getAll(@Request() req: UserRequest) {
    return this.nonCollectionProfileService.getAll(req.user);
  }
  @Get('/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.CRM_NON_COLLECTION_PROFILES_WRITE,
    PermissionsEnum.CRM_NON_COLLECTION_PROFILES_READ
  )
  findOne(@Param('id') id: any) {
    return this.nonCollectionProfileService.findOne(+id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_NON_COLLECTION_PROFILES_WRITE)
  update(
    @Param('id') id: any,
    @Body() updateNonCollectionProfileDto: UpdateNonCollectionProfileDto,
    @Request() req: UserRequest
  ) {
    return this.nonCollectionProfileService.update(
      id,
      updateNonCollectionProfileDto,
      req
    );
  }

  @Patch('/archive/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_NON_COLLECTION_PROFILES_ARCHIVE)
  archive(@Param('id') id: any, @Request() req: UserRequest) {
    return this.nonCollectionProfileService.archive(id, req);
  }

  @Get('/:id/events')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.CRM_NON_COLLECTION_PROFILES_WRITE,
    PermissionsEnum.CRM_NON_COLLECTION_PROFILES_READ
  )
  getEventHistory(
    @Query()
    getDrivesFilterInterface: NonCollectionProfileEventHistoryInterface,
    @Request() req: UserRequest,
    @Param('id') id: any
  ) {
    return this.nonCollectionProfileService.getEventHistory(
      id,
      getDrivesFilterInterface
    );
  }
}
