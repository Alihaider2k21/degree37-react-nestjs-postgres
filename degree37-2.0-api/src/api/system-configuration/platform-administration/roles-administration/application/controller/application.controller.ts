import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApplicationService } from '../services/application.service';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserRequest } from 'src/common/interface/request';

@ApiTags('Applications')
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationService.create(createApplicationDto);
  }

  @Get('/')
  @UsePipes(new ValidationPipe())
  findAll() {
    return this.applicationService.findAll();
  }

  @Get('/tenant-permissions')
  @UsePipes(new ValidationPipe())
  findAllTenantPermissions(@Request() req: UserRequest) {
    const tenant_id = parseInt(req.user.tenant?.id);
    return this.applicationService.findAllTenantPermissions(tenant_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto
  ) {
    return this.applicationService.update(+id, updateApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationService.remove(+id);
  }
}
