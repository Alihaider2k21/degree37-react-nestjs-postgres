import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserRequest } from '../../../../../common/interface/request';
import { CreateDuplicateDto } from 'src/api/common/dto/duplicates/create-duplicates.dto';
import { QueryDuplicatesDto } from 'src/api/common/dto/duplicates/query-duplicates.dto';
import { AccountsDuplicatesService } from '../service/account-duplicates.service';
import { AccountsDto } from '../../dto/accounts.dto';
import { ResolveDuplicateDto } from 'src/api/common/dto/duplicates/resolve-duplicates.dto';

@ApiTags('Account Duplicates')
@Controller('/accounts')
export class AccountsDuplicatesController {
  constructor(private readonly accountDupService: AccountsDuplicatesService) {}

  @Post('/:id/duplicates/create')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async create(
    @Res() res,
    @Param('id') id: any,
    @Body() createDto: CreateDuplicateDto
  ) {
    const data = await this.accountDupService.create(id, createDto);
    return res.status(data.status_code).json(data);
  }

  @Get('/:id/duplicates/list')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async get(
    @Res() res,
    @Param('id') id: bigint,
    @Query() query: QueryDuplicatesDto
  ) {
    const { page, limit, sortName, sortOrder, ...filters } = query;
    const data = await this.accountDupService.get(
      page,
      limit,
      { sortName, sortOrder },
      { ...filters, duplicatable_id: id }
    );
    return res.status(data.status_code).json(data);
  }

  @Patch('/:id/duplicates/resolve')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async resolve(
    @Res() res,
    @Param('id') id: bigint,
    @Body() resolveDto: ResolveDuplicateDto,
    @Request() req: UserRequest
  ) {
    const data = await this.accountDupService.resolve(id, resolveDto, req.user);
    return res.status(data.status_code).json(data);
  }

  @Post('/duplicates/identify')
  @UsePipes(new ValidationPipe())
  async createContacts(@Body() createAccountDto: AccountsDto) {
    return this.accountDupService.identifyDuplicates(createAccountDto);
  }
}
