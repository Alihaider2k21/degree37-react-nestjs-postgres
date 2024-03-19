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

import { CreateAssertionCodeDto } from '../dto/create-assertion-codes.dto';
import { AssertionCodesService } from '../services/assertion-codes.service';
import { GetAllAssertionCodesInterface } from '../../interface/assertion.interface';

@ApiTags('Assertion Codes')
@Controller('/assertion_codes')
export class AssertionCodesController {
  constructor(private readonly service: AssertionCodesService) {}

  @Post('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createDto: CreateAssertionCodeDto,
    @Request() req: UserRequest
  ) {
    return this.service.create(createDto, req);
  }

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Request() req: UserRequest,
    @Query() GetAllAccountsInterface: GetAllAssertionCodesInterface
  ) {
    GetAllAccountsInterface.tenant_id = req.user.tenant.id;
    return this.service.findAll(GetAllAccountsInterface);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: any) {
    return this.service.findOne(id);
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
