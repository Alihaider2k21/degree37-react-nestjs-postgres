import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Request,
  Get,
  Query,
  Param,
  Put,
  Patch,
} from '@nestjs/common';
import { DirectionsService } from '../services/direction.service';
import { CreateDirectionsDto } from '../dto/create-direction.dto';
import { UserRequest } from 'src/common/interface/request';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  GetAllDirectionsInterface,
  GetDirectionCollectionOperationInterface,
} from '../interface/directions.interface';
import { UpdateDirectionsDto } from '../dto/update-direction.dto';

@Controller('/location/direction')
@ApiTags('Directions')
export class DirectionsController {
  constructor(private readonly directionsService: DirectionsService) {}

  @Post('/')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createDirectionsDto: CreateDirectionsDto,
    @Request() req: UserRequest
  ) {
    return this.directionsService.create(createDirectionsDto, req);
  }

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  findAll(@Query() getAllDirectionsInterface: GetAllDirectionsInterface) {
    return this.directionsService.findAll(getAllDirectionsInterface);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  findOne(@Param('id') id: any, @Request() req: UserRequest) {
    return this.directionsService.findOne(+id, req);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Body() updateDirectionDto: UpdateDirectionsDto,
    @Request() req: UserRequest
  ) {
    return this.directionsService.update(id, updateDirectionDto, req);
  }

  @Patch('/archive/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  archive(@Param('id') id: any, @Request() req: UserRequest) {
    return this.directionsService.archive(id, req);
  }

  @Get('collection_operations/list')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async collectionOperations(
    @Request() req: UserRequest,
    @Query()
    geDirectionCollectionOperationInterface: GetDirectionCollectionOperationInterface
  ) {
    const tenant_id = parseInt(req?.user);
    return this.directionsService.collectionOperations(
      req?.user,
      geDirectionCollectionOperationInterface
    );
  }
}
