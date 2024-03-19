import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeedersService } from '../services/seeders.service';
import { RoleDto, SeedDto } from '../dto/seed.dto';

@ApiTags('Seeders')
@Controller('/seeders')
export class SeedersController {
  constructor(private readonly service: SeedersService) {}

  @Post('/seed')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  seed(@Body() dto: SeedDto) {
    return this.service.seed(dto);
  }

  @Post('/roles')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  role(@Body() dto: RoleDto) {
    return this.service.role(dto);
  }

  @Post('/drop')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  drop(@Body() dto: SeedDto) {
    return this.service.drop(dto);
  }
}
