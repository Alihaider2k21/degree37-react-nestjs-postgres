import {
  Controller,
  Post,
  Body,
  Request,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
  HttpStatus,
  HttpCode,
  Param,
} from '@nestjs/common';
import { UserRequest } from 'src/common/interface/request';
import { OcNonCollectionEventsService } from '../service/oc-non-collection-events.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetAllNonCollectionEventsInterface } from '../interface/get-non-collection-events.interface';

@ApiTags('Non Collection Events')
@Controller('oc_non_collection_events')
export class OcNonCollectionEventsController {
  constructor(
    private readonly ocNonCollectionEventsService: OcNonCollectionEventsService
  ) {}

  @Get(':id/get_all')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  getAll(
    @Query() getDrivesFilterInterface: GetAllNonCollectionEventsInterface,
    @Request() req: UserRequest,
    @Param('id') id: any
  ) {
    return this.ocNonCollectionEventsService.findAll(
      id,
      req.user,
      getDrivesFilterInterface
    );
  }

  @Get('/status')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  status(@Request() req: UserRequest) {
    return this.ocNonCollectionEventsService.status(req.user);
  }
}
