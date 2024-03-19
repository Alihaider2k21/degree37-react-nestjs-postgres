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
  BadRequestException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateProcedureTypesDto,
  UpdateProcedureTypesDto,
} from '../dto/create-procedure-types.dto';
import { ProcedureTypesService } from '../services/procedure-types.service';
import { GetProcedureTypesInterface } from '../interface/procedure-types.interface';
import { UserRequest } from '../../../../../../../common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Procedure Types')
@Controller('procedure_types')
export class ProcedureTypesController {
  constructor(private readonly procedureTypesService: ProcedureTypesService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PROCEDURE_TYPES_WRITE
  )
  create(
    @Body() createProcedureTypesDto: CreateProcedureTypesDto,
    @Request() req: UserRequest
  ) {
    const tenant_id = req?.user?.tenant?.id;
    return this.procedureTypesService.create(
      createProcedureTypesDto,
      tenant_id
    );
  }

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PROCEDURE_TYPES_WRITE,
  //   PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PROCEDURE_TYPES_READ
  // )
  findAll(
    @Query() getProcedureTypesInterface: GetProcedureTypesInterface,
    @Request() req: UserRequest
  ) {
    return this.procedureTypesService.getAllProcedureTypes(
      getProcedureTypesInterface,
      req.user
    );
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PROCEDURE_TYPES_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PROCEDURE_TYPES_READ
  )
  @UsePipes(new ValidationPipe())
  findOne(@Param('id') id: any) {
    return this.procedureTypesService.findOne(id);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PROCEDURE_TYPES_WRITE
  )
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() updateProcedureTypesDto: UpdateProcedureTypesDto
  ) {
    return this.procedureTypesService.update(id, updateProcedureTypesDto);
  }

  @Patch('/:id')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_ORGANIZATIONAL_ADMINISTRATION_PRODUCTS_AND_PROCEDURES_PROCEDURE_TYPES_ARCHIVE
  )
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  async archive(@Param('id') id: any) {
    if (!id) {
      throw new BadRequestException('Procedure Id is required');
    }

    return this.procedureTypesService.archive(id);
  }
}
