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
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRequest } from 'src/common/interface/request';
import { DonorCenterCodesService } from '../services/donor-center-codes.service';
import { CreateDonorCenterCodeDto } from '../dto/create-donor-center-code.dto';

@ApiTags('Donor Center Codes')
@Controller('/contacts/donors/center_codes')
export class DonorCenterCodesController {
  constructor(private readonly service: DonorCenterCodesService) {}

  @Post('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createDto: CreateDonorCenterCodeDto,
    @Request() req: UserRequest
  ) {
    return this.service.create(createDto, req);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  async findAllDonorGroupCodes(@Param('id') id: any) {
    return this.service.findAllDonorCenterCodes(id);
  }

  @Patch('/:center_code_id')
  @ApiBearerAuth()
  @ApiParam({ name: 'center_code_id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async archive(@Param('center_code_id') id: any, @Request() req: UserRequest) {
    const updatedBy = req?.user?.id;
    return this.service.archive(id, updatedBy);
  }

  @Get('/')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async findAll(@Request() req: UserRequest) {
    return this.service.findAll(req);
  }
}
