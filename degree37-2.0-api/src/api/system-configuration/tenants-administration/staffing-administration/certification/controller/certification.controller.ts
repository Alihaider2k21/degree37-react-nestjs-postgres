import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCertificationDto } from '../dto/create-certification.dto';
import { UpdateCertificationDto } from '../dto/update-certification.dto';
import { QueryCertificationDto } from '../dto/query-certification.dto';
import { CertificationService } from '../service/certification.service';
import { FilterCertificationInterface } from '../interfaces/query-certification.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
import { UserRequest } from 'src/common/interface/request';

@ApiTags('Certification')
@Controller('/staffing-admin/certification')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Post('/create')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_WRITE
  )
  async create(
    @Res() res,
    @Body() createCertificationDto: CreateCertificationDto
  ) {
    const data = await this.certificationService.create(createCertificationDto);
    return res.status(data.status_code).json(data);
  }

  @Get('/list')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_WRITE,
    PermissionsEnum.STAFFING_MANAGEMENT_STAFF_LIST_READ
  )
  async get(@Res() res, @Query() query: QueryCertificationDto) {
    const {
      page,
      limit,
      keyword = '',
      sortName,
      sortOrder,
      ...filters
    } = query;
    const data = await this.certificationService.get(
      page,
      limit,
      keyword,
      { sortName, sortOrder },
      { ...filters }
    );
    return res.status(data.status_code).json(data);
  }

  @Get('')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_READ,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_WRITE
  // )
  async getCertifications(
    @Query() query: FilterCertificationInterface,
    @Request() req: UserRequest
  ) {
    return this.certificationService.getCertificationsByAssociationType(
      query.associationType,
      query.is_active,
      req?.user
    );
  }

  @Get('/:id/find')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_WRITE
  )
  async getOne(@Res() res, @Param('id') id: bigint) {
    const data = await this.certificationService.getById(id);
    return res.status(data.status_code).json(data);
  }

  @Patch('/:id/archive')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_ARCHIVE
  )
  async archive(@Res() res, @Param('id') id: bigint) {
    const data = await this.certificationService.archive(id);
    return res.status(data.status_code).json(data);
  }

  @Put('/:id/edit')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_STAFF_ADMINISTRATION_CERTIFICATIONS_WRITE
  )
  async edit(
    @Res() res,
    @Param('id') id: bigint,
    @Body() updateCertificationDto: UpdateCertificationDto
  ) {
    const data = await this.certificationService.edit(
      id,
      updateCertificationDto
    );
    return res.status(data.status_code).json(data);
  }
}
