import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Get,
  Query,
  Patch,
  Param,
  Delete,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateAffiliationDto } from '../dto/create-affiliation.dto';
import { AffiliationService } from '../services/affiliation.services';
import {
  GetAllAffiliationsInterface,
  UpdateAffiliationsInterface,
} from '../interface/affiliation.interface';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';

@ApiTags('Affiliations')
@Controller('affiliations')
export class AffiliationController {
  constructor(private readonly affiliationService: AffiliationService) {}

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_AFFILIATION_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_AFFILIATION_WRITE
  )
  async getAffiliations(
    @Query() getAllAffiliationsInterface: GetAllAffiliationsInterface
  ) {
    return this.affiliationService.getAffiliations(getAllAffiliationsInterface);
  }

  @Get('/bycollectionoperation')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getAffiliationsByCollectionOperation(
    @Query() getAllAffiliationsInterface: GetAllAffiliationsInterface
  ) {
    return this.affiliationService.getAffiliationsByCollectionOperation(
      getAllAffiliationsInterface
    );
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_AFFILIATION_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_AFFILIATION_WRITE
  )
  async getUser(@Param('id') id: any) {
    return this.affiliationService.getSingleAffiliation(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_AFFILIATION_WRITE
  )
  async addAffiliation(
    @Body() createAffiliationDto: CreateAffiliationDto,
    @Request() req: UserRequest
  ) {
    createAffiliationDto.created_by = req.user?.id;
    return this.affiliationService.addAffiliation(createAffiliationDto);
  }

  @Put('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_AFFILIATION_WRITE
  )
  async update(
    @Body() updateAffiliationInterface: UpdateAffiliationsInterface,
    @Request() req: UserRequest
  ) {
    updateAffiliationInterface.updated_by = req.user?.id;
    return this.affiliationService.update(updateAffiliationInterface);
  }

  @Delete('/archive/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_AFFILIATION_ARCHIVE
  )
  async deleteTeam(
    @Param('id') id: any,
    @Body() deleteData: any,
    @Request() req: UserRequest
  ) {
    const updated_by = req.user?.id;
    return this.affiliationService.deleteAffilations(
      id,
      updated_by,
      deleteData
    );
  }
}
