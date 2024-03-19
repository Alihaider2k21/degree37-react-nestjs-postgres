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
  Get,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRequest } from '../../../../../common/interface/request';
import { NCPBluePrintsService } from '../services/ncp-blueprints.service';
import { CreateNCPBluePrintsDto } from '../dto/create-ncp-blueprints.dto';
import { UpdateNCPBluePrintsDto } from '../dto/update-ncp-blueprints.dto';
import { NCPBluePrintsInterface } from '../interface/ncp-blueprints.interface';
import { NCPBluePrintsInfoInterface } from '../../interface/ncp-blueprints-collection-operation-info';

@ApiTags('NCP Blueprints')
@Controller('non-collection-profiles')
export class NCPBluePrintsController {
  constructor(private readonly ncpBluePrintsService: NCPBluePrintsService) {}

  @Post('/:id/blueprints')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  create(
    @Param('id') ncpId: any,
    @Request() req: UserRequest,
    @Body() createNCPBluePrintsDto: CreateNCPBluePrintsDto
  ) {
    return this.ncpBluePrintsService.create(
      ncpId,
      createNCPBluePrintsDto,
      req.user
    );
  }

  @Get('/:id/blueprints')
  @ApiBearerAuth()
  findAll(
    @Param('id') ncpId: any,
    @Query() ncpBluePrintsInterface: NCPBluePrintsInterface,
    @Request() req: UserRequest
  ) {
    ncpBluePrintsInterface.tenant_id = req.user.tenant.id;
    return this.ncpBluePrintsService.findAll(ncpId, ncpBluePrintsInterface);
  }

  @Get('/blueprints/:id/about')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  findNCPAbout(@Param('id') id: any) {
    return this.ncpBluePrintsService.findOne(+id);
  }

  @Get('/collection-operation/:id')
  @ApiBearerAuth()
  findAllCOvehicle(
    @Param('id') collection_opration_id: any,
    @Request() req: UserRequest,
    @Query() ncpBpCollectionOperationInfo: NCPBluePrintsInfoInterface
  ) {
    return this.ncpBluePrintsService.getColectionOperationInfo(
      collection_opration_id,
      ncpBpCollectionOperationInfo,
      req
    );
  }

  @Get('/blueprints/:id/shift-details')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  findNCPShifts(@Param('id') id: any) {
    return this.ncpBluePrintsService.findShifts(+id);
  }

  @Put('/blueprints/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() updateNCPBluePrintsDto: UpdateNCPBluePrintsDto,
    @Request() req: UserRequest
  ) {
    return this.ncpBluePrintsService.update(
      id,
      updateNCPBluePrintsDto,
      req.user
    );
  }

  @Patch('/blueprints/archive/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  archive(@Param('id') id: any, @Request() req: UserRequest) {
    return this.ncpBluePrintsService.archive(id, req);
  }

  @Patch('/blueprints/default/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  makeDefault(@Param('id') id: any, @Request() req: UserRequest) {
    return this.ncpBluePrintsService.makeDefault(id, req);
  }
}
