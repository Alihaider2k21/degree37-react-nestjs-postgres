import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateStaffLeaveDto } from '../dto/create-staff-leave.dto';
import { UpdateStaffLeaveDto } from '../dto/update-staff-leave.dto';
import { StaffLeaveService } from '../service/staff-leave.service';
import { QueryStaffLeaveDto } from '../dto/query-staff-leave.dto';

@ApiTags('Staff Leaves')
@Controller('/staff-leave')
export class StaffLeaveController {
  constructor(private readonly staffLeaveService: StaffLeaveService) {}

  @Post('/create')
  @UsePipes(new ValidationPipe())
  async create(@Res() res, @Body() createDto: CreateStaffLeaveDto) {
    const data = await this.staffLeaveService.create(createDto);
    return res.status(data.status_code).json(data);
  }

  @Get('/list')
  @UsePipes(new ValidationPipe())
  async get(@Res() res, @Query() query: QueryStaffLeaveDto) {
    const {
      page,
      limit,
      keyword = '',
      sortName,
      sortOrder,
      ...filters
    } = query;
    const data = await this.staffLeaveService.get(
      page,
      limit,
      keyword,
      { sortName, sortOrder },
      { ...filters }
    );
    return res.status(data.status_code).json(data);
  }

  @Get('/:id/find')
  async getOne(@Res() res, @Param('id') id: bigint) {
    const data = await this.staffLeaveService.getById(id);
    return res.status(data.status_code).json(data);
  }

  @Patch('/:id/archive')
  async archive(@Res() res, @Param('id') id: bigint) {
    const data = await this.staffLeaveService.archive(id);
    return res.status(data.status_code).json(data);
  }

  @Put('/:id/edit')
  async edit(
    @Res() res,
    @Param('id') id: bigint,
    @Body() updateDto: UpdateStaffLeaveDto
  ) {
    const data = await this.staffLeaveService.edit(id, updateDto);
    return res.status(data.status_code).json(data);
  }
}
