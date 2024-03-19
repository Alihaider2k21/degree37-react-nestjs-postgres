import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateStageDto, UpdateStageDto } from '../dto/stages.dto';
import { GetAllStagesInterface } from '../interface/stages.interface';
import { StagesService } from '../service/stages.service';
import { UserRequest } from '../../../../../../../common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Stages')
@Controller('stages')
export class StagesController {
  constructor(private readonly StagesService: StagesService) {}

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_STAGES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_STAGES_WRITE
  )
  getStages(@Query() getAllStagesInterface: GetAllStagesInterface) {
    return this.StagesService.findAll(getAllStagesInterface);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_STAGES_READ,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_STAGES_WRITE
  )
  getStage(@Param('id') id: any) {
    return this.StagesService.findOne(id);
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_STAGES_WRITE
  )
  createStage(@Body() createStageDto: CreateStageDto) {
    return this.StagesService.create(createStageDto);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_STAGES_WRITE
  )
  async updateStage(
    @Param('id') id: any,
    @Body() updateStageDto: UpdateStageDto,
    @Request() req: UserRequest
  ) {
    return this.StagesService.update(id, updateStageDto, req); // Use the category service
  }

  @Put('/archive/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_ACCOUNTS_STAGES_ARCHIVE
  )
  async archiveStage(@Param('id') id: any, @Request() req: UserRequest) {
    return this.StagesService.archive(id, req); // Use the category service
  }
}
