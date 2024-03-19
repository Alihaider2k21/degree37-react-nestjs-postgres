import {
  Controller,
  Request,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { UserRequest } from 'src/common/interface/request';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetAllNonCollectionEventsInterface } from '../interface/get-non-collection-events.interface';
import { OcNonCollectionEventsChangeAuditService } from '../service/oc-non-collection-events-change-audit.service';

@ApiTags('Non Collection Events Change Audit')
@Controller('/oc-non-collection-events')
export class OcNonCollectionEventsChangeAuditController {
  constructor(
    private readonly ocNonCollectionEventsChangeAuditService: OcNonCollectionEventsChangeAuditService
  ) {}

  @Get('/:id/change-audit')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true })
  @UsePipes(new ValidationPipe())
  getAudit(
    @Query() getDrivesFilterInterface: GetAllNonCollectionEventsInterface,
    @Request() req: UserRequest,
    @Param('id') id: any
  ) {
    return this.ocNonCollectionEventsChangeAuditService.getChangeAudit(
      id,
      getDrivesFilterInterface
    );
  }
}
