import {
  Controller,
  Get,
  Post,
  Param,
  UsePipes,
  HttpCode,
  ValidationPipe,
  HttpStatus,
  Body,
  Request,
  Query,
  Put,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { OrganizationalLevelDto } from '../dto/organizational-level.dto';
import { OrganizationalLevelService } from '../services/organizational-level.service';
import { GetAllOrganizationalLevelsInterface } from '../interface/organizational-level.interface';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Organizational Levels')
@Controller('organizational_levels')
export class OrganizationalLevelController {
  constructor(
    private readonly organizationalLevelService: OrganizationalLevelService
  ) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_HIERARCHY_ORGANIZATIONAL_LEVELS_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_HIERARCHY_ORGANIZATIONAL_LEVELS_READ
  )
  create(
    @Body() createOrganizationalLevelDto: OrganizationalLevelDto,
    @Request() req: UserRequest
  ) {
    createOrganizationalLevelDto.tenant_id = req.user.tenant?.id;
    return this.organizationalLevelService.create(createOrganizationalLevelDto);
  }

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  findAll(
    @Request() req: UserRequest,
    @Query()
    getAllOrganizationalLevelsInterface: GetAllOrganizationalLevelsInterface
  ) {
    getAllOrganizationalLevelsInterface.tenant_id = parseInt(
      req.user.tenant?.id
    );
    return this.organizationalLevelService.findAll(
      getAllOrganizationalLevelsInterface
    );
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_HIERARCHY_ORGANIZATIONAL_LEVELS_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_HIERARCHY_ORGANIZATIONAL_LEVELS_READ
  )
  findOne(@Param('id') id: any) {
    return this.organizationalLevelService.findOne(+id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_HIERARCHY_ORGANIZATIONAL_LEVELS_WRITE
  )
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() updateOrganizationalLevelDto: OrganizationalLevelDto,
    @Request() req: UserRequest
  ) {
    updateOrganizationalLevelDto.updated_by = req?.user?.id;
    return this.organizationalLevelService.update(
      +id,
      updateOrganizationalLevelDto
    );
  }

  @Patch('/archive/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_HIERARCHY_ORGANIZATIONAL_LEVELS_ARCHIVE
  )
  @ApiParam({ name: 'id', required: true })
  archive(@Param('id') id: any, @Request() req: UserRequest) {
    const updatedBy = req?.user?.id;
    return this.organizationalLevelService.archive(+id, updatedBy);
  }
}
