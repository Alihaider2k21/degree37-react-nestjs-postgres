import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Query,
  Patch,
  Put,
  Request,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { RoomSizesService } from '../services/roomSizes.service';
import { CreateRoomSizeDto } from '../dto/create-room-sizes.dto';
import {
  GetAllRoomSizesInterface,
  GetUserId,
} from '../interface/roomSizes.interface';
import { UserRequest } from 'src/common/interface/request';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';

@ApiTags('locations')
@Controller('/room-size')
export class RoomSizeController {
  constructor(private readonly roomSizes: RoomSizesService) {}

  // create
  @Post('/create')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_LOCATIONS_ROOM_SIZES_WRITE
  )
  create(
    @Body() createRoomSizeDto: CreateRoomSizeDto,
    @Request() req: UserRequest
  ) {
    createRoomSizeDto.created_by = req.user?.id;
    return this.roomSizes.create(createRoomSizeDto);
  }
  // get all
  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getAllRoomSizes(
    @Query() getAllRoomSizesInterface: GetAllRoomSizesInterface,
    @Req() req
  ) {
    return this.roomSizes.getAllRoomSizes(getAllRoomSizesInterface, req.user);
  }
  // get by id
  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_LOCATIONS_ROOM_SIZES_WRITE,
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_LOCATIONS_ROOM_SIZES_READ
  )
  async getRoom(@Param('id') id: any) {
    return this.roomSizes.getRoom(id);
  }
  // archeive room
  @Patch('/archive/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_LOCATIONS_ROOM_SIZES_ARCHIVE
  )
  async archiveRoom(
    @Param('id') id: any,
    @Body() body: any,
    @Request() req: UserRequest
  ) {
    return this.roomSizes.archiveRoom(id, req?.user?.id, body?.created_by);
  }
  // update room
  @Put('/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.SYSTEM_CONFIGURATION_CRM_ADMINISTRATION_LOCATIONS_ROOM_SIZES_WRITE
  )
  async updateRoomInfop(
    @Param('id') id: any,
    @Body() createRoomSizeDto: CreateRoomSizeDto,
    @Request() req: UserRequest
  ) {
    createRoomSizeDto.updated_by = req.user?.id;
    return this.roomSizes.updateRoomInfo(id, createRoomSizeDto);
  }
}
