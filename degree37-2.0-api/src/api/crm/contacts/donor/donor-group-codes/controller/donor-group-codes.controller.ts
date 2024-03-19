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
import { DonorGroupCodesService } from '../services/donor-group-codes.service';
import { CreateDonorGroupCodeDto } from '../dto/create-donor-group.dto';
import { UserRequest } from 'src/common/interface/request';

@ApiTags('Donor Group Codes')
@Controller('/contacts/donors/group_codes')
export class DonorGroupCodesController {
  constructor(private readonly service: DonorGroupCodesService) {}

  @Post('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createDto: CreateDonorGroupCodeDto,
    @Request() req: UserRequest
  ) {
    return this.service.create(createDto, req);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  async findAllDonorGroupCodes(
    @Param('id') id: any,
    @Query('sortName') sortName: string,
    @Query('sortOrder') sortOrder: string
  ) {
    return this.service.findAllDonorGroupCodes(id, sortName, sortOrder);
  }

  @Patch('/:group_id')
  @ApiBearerAuth()
  @ApiParam({ name: 'group_id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async archive(@Param('group_id') id: any, @Request() req: UserRequest) {
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
