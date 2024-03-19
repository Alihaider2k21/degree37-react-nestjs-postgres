import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Query,
  Request,
} from '@nestjs/common';
import { AliasService } from '../services/alias.service';
import { CreateAliasDto } from '../dto/create-alias.dto';
import { GetAliasInterface } from '../interface/alias.interface';
import { UserRequest } from 'src/common/interface/request';

@Controller('crm-admin')
export class AliasController {
  constructor(private readonly aliasService: AliasService) {}

  @Post('/alias')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAliasDto: CreateAliasDto, @Request() req: UserRequest) {
    createAliasDto.created_by = req.user?.id;
    return this.aliasService.create(createAliasDto);
  }

  @Get('/alias')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getAlias(@Query() getAlias: GetAliasInterface) {
    return this.aliasService.getAlias(getAlias);
  }
}
