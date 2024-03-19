import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
// import { CreateStaffLeaveDto } from "../dto/create-staff-leave.dto";
// import { UpdateStaffLeaveDto } from "../dto/update-staff-leave.dto";
// import { StaffLeaveService } from "../service/staff-leave.service";
// import { QueryStaffLeaveDto } from "../dto/query-staff-leave.dto";
import { FilterService } from '../services/filterServices';
import { UserRequest } from 'src/common/interface/request';
import { LocationsDto } from '../../locations/dto/locations.dto';
import { FilterDto } from '../dto/filter.dto';

@ApiTags('Filters')
@Controller('filters')
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  @Get('/:code')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'code', required: true })
  @HttpCode(HttpStatus.OK)
  async getFilterCode(@Param('code') code: string) {
    return this.filterService.findFilterStructure(code);
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req: UserRequest, @Body() filterDto: FilterDto) {
    return this.filterService.AddFilter(req.user, filterDto);
  }

  @Get('single/:code')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  // @HttpCode(HttpStatus.CREATED)
  async getFilters(@Param('code') code: string, @Request() req: UserRequest) {
    return this.filterService.getFilters(req.user, code);
  }

  @Get('single-filters/:id')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  // @HttpCode(HttpStatus.CREATED)
  async getFilterSubData(@Param('id') id: string, @Request() req: UserRequest) {
    return this.filterService.getFilterSubData(req.user, id);
  }

  @Post('delete/:id/:code')
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  // @HttpCode(HttpStatus.CREATED)
  async DeleteFilter(
    @Param('id') id: string,
    @Param('code') code: string,
    @Request() req: UserRequest
  ) {
    return this.filterService.DeleteFilter(req.user, id, code);
  }
  //   @Post("/create")
  //   @UsePipes(new ValidationPipe())
  //   async create(@Res() res, @Body() createDto: CreateStaffLeaveDto) {
  //     const data = await this.staffLeaveService.create(createDto);
  //     return res.status(data.status_code).json(data);
  //   }

  //   @Get("/list")
  //   @UsePipes(new ValidationPipe())
  //   async get(@Res() res, @Query() query: QueryStaffLeaveDto) {
  //     const {
  //       code
  //     } = query;
  //     const data = await this.staffLeaveService.get(
  //       page,
  //       limit,
  //       keyword,
  //       { sortName, sortOrder },
  //       { ...filters }
  //     );
  //     return res.status(data.status_code).json(data);
  //   }

  //   @Get("/:code")
  //   async getOne(@Res() res, @Param("id") id: bigint) {
  //     const data = await this.staffLeaveService.getById(id);
  //     // return res.status(data.status_code).json(data);
  //   }

  //   @Patch("/:id/archive")
  //   async archive(@Res() res, @Param("id") id: bigint) {
  //     const data = await this.staffLeaveService.archive(id);
  //     return res.status(data.status_code).json(data);
  //   }

  //   @Put("/:id/edit")
  //   async edit(
  //     @Res() res,
  //     @Param("id") id: bigint,
  //     @Body() updateDto: UpdateStaffLeaveDto
  //   ) {
  //     const data = await this.staffLeaveService.edit(id, updateDto);
  //     return res.status(data.status_code).json(data);
  //   }
}
