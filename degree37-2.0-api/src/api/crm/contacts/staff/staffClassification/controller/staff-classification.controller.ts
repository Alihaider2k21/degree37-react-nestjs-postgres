import {
  Body,
  Controller,
  Param,
  Patch,
  Get,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';
import { StaffClassificationService } from '../service/staff-classification.service';
import { UserRequest } from 'src/common/interface/request';
import { StaffClassificationDto } from '../dto/staff-classification.dto';

@ApiTags('Staff Classification')
@Controller('staffs/classification')
export class StaffClassificationController {
  constructor(
    private readonly staffClassificationService: StaffClassificationService
  ) {}

  @Patch('/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  update(
    @Param('id') id: any,
    @Request() req: UserRequest,
    @Body() staffClassificationDto: StaffClassificationDto
  ) {
    return this.staffClassificationService.update(
      id,
      req.user,
      staffClassificationDto
    );
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  get(@Param('id') id: any, @Request() req: UserRequest) {
    return this.staffClassificationService.get(id, req.user);
  }
}
