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
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateProceduresDto,
  UpdateProceduresDto,
} from '../dto/create-procedures.dto';
import { GetAllProcedureInterface } from '../interface/procedure.interface';
import { ProcedureService } from '../services/procedures.service';
import { UserRequest } from '../../../../../../../common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Procedure')
@Controller('procedures')
export class ProcedureController {
  constructor(private readonly procedureService: ProcedureService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PROCEDURES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PROCEDURES_WRITE
  )
  create(
    @Body() createProcedureDto: CreateProceduresDto,
    @Request() req: UserRequest
  ) {
    const tenant_id = req?.user?.tenant?.id;
    return this.procedureService.create(createProcedureDto, tenant_id);
  }

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PROCEDURES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PROCEDURES_WRITE
  )
  findAll(
    @Query() getAllProceduresInterface: GetAllProcedureInterface,
    @Request() req: UserRequest
  ) {
    const tenant_id = req?.user?.tenant?.id;
    return this.procedureService.findAll(getAllProceduresInterface, tenant_id);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PROCEDURES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PROCEDURES_WRITE
  )
  @UsePipes(new ValidationPipe())
  findOne(@Param('id') id: any) {
    return this.procedureService.findOne(id);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PROCEDURES_WRITE
  )
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() updateProceduresDto: UpdateProceduresDto,
    @Request() req: UserRequest
  ) {
    updateProceduresDto.updated_by = req.user.id;
    return this.procedureService.update(id, updateProceduresDto);
  }

  @Patch('/:id')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PROCEDURES_ARCHIVE
  )
  async archive(@Param('id') id: any, @Request() req: UserRequest) {
    if (!id) {
      throw new BadRequestException('Procedure Id is required');
    }
    const updatedBy = req.user.id;
    return this.procedureService.archive(id, updatedBy);
  }
}
