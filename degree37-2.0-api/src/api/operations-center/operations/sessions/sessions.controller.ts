import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-sessions.dto';
import { QuerySessionsDto } from './dto/query-sessions.dto';

@ApiTags('Sessions')
@Controller('/operations/sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('/create')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Res() res, @Body() createDto: CreateSessionDto) {
    const data = await this.sessionsService.create(createDto);
    return res.status(data.status_code).json(data);
  }

  @Get('/list')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async get(@Res() res, @Query() query: QuerySessionsDto) {
    const { page, limit, sortName, sortOrder, ...filters } = query;
    const data = await this.sessionsService.get(
      page,
      limit,
      { sortName, sortOrder },
      filters
    );
    return res.status(data.status_code).json(data);
  }

  @Delete('/:id/delete')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async archive(@Res() res, @Param('id') id: string) {
    const data = await this.sessionsService.archive(id);
    return res.status(data.status_code).json(data);
  }

  @Get('/shift/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: Number })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getShiftDetails(@Param('id') id: bigint) {
    return this.sessionsService.getShiftInfo(id);
  }
}
