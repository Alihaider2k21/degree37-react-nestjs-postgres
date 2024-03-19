import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRequest } from 'src/common/interface/request';
import { DonorsAssertionCodesService } from '../services/donors-assertion-codes.service';
import { CreateDonorAssertionCodeDto } from '../dto/donors-create-assertion-codes.dto';

@ApiTags('Donors Assertion Codes')
@Controller('/contacts/donors/assertion_codes')
export class DonorsAssertionCodesController {
  constructor(private readonly service: DonorsAssertionCodesService) {}

  @Post('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createDto: CreateDonorAssertionCodeDto,
    @Request() req: UserRequest
  ) {
    return this.service.create(createDto, req);
  }

  @Get('/:donor_id')
  @ApiParam({ name: 'donor_id', required: true })
  @HttpCode(HttpStatus.OK)
  async findAllDonorAssertionCodes(
    @Param('donor_id') donorId: any,
    @Request() req: UserRequest,
    @Query('sortName') sortName: string,
    @Query('sortOrder') sortOrder: string
  ) {
    return this.service.findAllDonorAssertionCodes(
      donorId,
      req,
      sortName,
      sortOrder
    );
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async archive(@Param('id') id: any, @Request() req: UserRequest) {
    const updatedBy = req?.user?.id;
    return this.service.archive(id, updatedBy);
  }
}
