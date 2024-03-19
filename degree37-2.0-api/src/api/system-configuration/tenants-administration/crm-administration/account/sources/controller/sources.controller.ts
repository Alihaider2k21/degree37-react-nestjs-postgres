import {
  Controller,
  Get,
  Post,
  UsePipes,
  HttpCode,
  ValidationPipe,
  HttpStatus,
  Put,
  Query,
  Request,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { SourcesService } from '../services/sources.service';
import { GetSourcesInterface } from '../interface/sources.interface';
import { CreateSourcesDto } from '../dto/create-source.dto';
import { UpdateSourcesDto } from '../dto/update-source.dto';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Accounts Sources')
@Controller('accounts/sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}
  @Post('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_SOURCES_WRITE
  )
  async create(
    @Body() createSourcesDto: CreateSourcesDto,
    @Request() req: UserRequest
  ) {
    createSourcesDto.created_by = req.user.id;
    return this.sourcesService.create(createSourcesDto);
  }
  @Post('/search')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_SOURCES_WRITE
  )
  async findByFilter(@Body() getSourcesInterface: GetSourcesInterface) {
    return this.sourcesService.getAllSources(getSourcesInterface);
  }

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_SOURCES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_SOURCES_WRITE
  )
  async findAll(@Query() getSourcesInterface: GetSourcesInterface) {
    return this.sourcesService.getAllSources(getSourcesInterface);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_SOURCES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_SOURCES_WRITE
  )
  async findOne(@Param('id') id: bigint) {
    return this.sourcesService.getById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  //  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_SOURCES_WRITE
  )
  update(
    @Param('id') id: bigint,
    @Body() updateSourcesDto: UpdateSourcesDto,
    @Request() req: UserRequest
  ) {
    updateSourcesDto.created_by = req.user.id;
    return this.sourcesService.update(id, updateSourcesDto);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_SOURCES_ARCHIVE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  archive(@Param('id') id: bigint, @Request() req: UserRequest) {
    return this.sourcesService.archive(id, req.user.id);
  }
}
