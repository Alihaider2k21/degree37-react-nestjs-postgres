import {
  Controller,
  Request,
  UsePipes,
  ValidationPipe,
  HttpCode,
  Query,
  Get,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { UserRequest } from 'src/common/interface/request';

import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateProspectDto, ListProspectsDto } from '../dto/prospects.dto';
import { ProspectsService } from '../services/prospects.service';

@ApiTags('Prospects')
@Controller('/operations-center/prospects')
export class ProspectsController {
  constructor(private readonly prospectsService: ProspectsService) {}
  @Get('/build-segments')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async listProspects(
    @Query() listProspectsDto: ListProspectsDto,
    @Request() req: UserRequest
  ) {
    return this.prospectsService.listProspects(
      listProspectsDto,
      req?.user?.tenant?.id
    );
  }
  @Post('/')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  async create(@Body() createProspectDto: CreateProspectDto) {
    return await this.prospectsService.create(createProspectDto);
  }
}
