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
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRequest } from '../../../../../common/interface/request';
import { NCEService } from '../service/nce.service';
import { CreateNCEDto } from '../dto/create-nce.dto';
import { UpdateNCEDto } from '../dto/update-nce.dto';
import { NonCollectionEventInterface } from '../interface/non-collection-event-filter.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('Non-Collection Events')
@Controller('operations/non-collection-events')
export class NCEController {
  constructor(private readonly nceService: NCEService) {}

  @Post('')
  // @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_NON_COLLECTION_EVENTS_WRITE
  )
  create(@Request() req: UserRequest, @Body() createNCEDto: CreateNCEDto) {
    return this.nceService.create(createNCEDto, req.user);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_NON_COLLECTION_EVENTS_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() updateNCEDto: UpdateNCEDto,
    @Request() req: UserRequest
  ) {
    return this.nceService.update(id, updateNCEDto, req.user);
  }

  @Get('')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_NON_COLLECTION_EVENTS_READ,
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_NON_COLLECTION_EVENTS_WRITE,
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_NON_COLLECTION_EVENTS_ARCHIVE
  )
  findAll(
    @Query() ncepInterface: NonCollectionEventInterface,
    @Request() req: UserRequest
  ) {
    ncepInterface.tenant_id = req.user.tenant.id;
    return this.nceService.findAll(ncepInterface);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_NON_COLLECTION_EVENTS_READ,
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_NON_COLLECTION_EVENTS_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  findOne(@Param('id') id: any) {
    return this.nceService.findOne(+id);
  }

  @Get(':id/shift-details')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_NON_COLLECTION_EVENTS_READ,
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_NON_COLLECTION_EVENTS_WRITE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  findNCEShifts(@Param('id') id: any) {
    return this.nceService.findShifts(+id);
  }

  @Patch('/archive/:id')
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_NON_COLLECTION_EVENTS_ARCHIVE
  )
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  archive(@Param('id') id: any, @Request() req: UserRequest) {
    return this.nceService.archive(id, req.user);
  }

  @Get('/with-directions/:collectionOperationId')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_NON_COLLECTION_EVENTS_READ,
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_NON_COLLECTION_EVENTS_WRITE
  )
  @HttpCode(HttpStatus.OK)
  async findAllWithDirections(
    @Request() req: UserRequest,
    @Param('collectionOperationId') id: any,
    @Query('date') date: string
  ) {
    return this.nceService.findAllWithDirections(req.user, id, date);
  }

  @Get('/location-events/:locationId')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_NON_COLLECTION_EVENTS_READ,
    PermissionsEnum.OPERATIONS_CENTER_OPERATIONS_NON_COLLECTION_EVENTS_WRITE
  )
  @HttpCode(HttpStatus.OK)
  async findEventWithLocation(
    @Request() req: UserRequest,
    @Param('locationId') id: any
  ) {
    return this.nceService.findEventWithLocation(id);
  }
}
