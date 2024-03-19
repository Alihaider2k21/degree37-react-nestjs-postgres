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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateDuplicateDto } from 'src/api/common/dto/duplicates/create-duplicates.dto';
import { QueryDuplicatesDto } from 'src/api/common/dto/duplicates/query-duplicates.dto';
import { DonorDuplicatesService } from '../service/donor-duplicates.service';
import { IdentifyDonorDuplicateDto } from 'src/api/crm/contacts/donor/donorDuplicates/dto/identify-donor-duplicates.dto';
import { ResolveDuplicateDto } from 'src/api/common/dto/duplicates/resolve-duplicates.dto';

@ApiTags('Donor Duplicates')
@Controller('/contact-donors')
export class DonorDuplicatesController {
  constructor(private readonly donorDupService: DonorDuplicatesService) {}

  @Post('/:id/duplicates/create')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Res() res,
    @Param('id') id: number,
    @Body() createDto: CreateDuplicateDto
  ) {
    const data = await this.donorDupService.create(<any>id, createDto);
    return res.status(data.status_code).json(data);
  }

  @Get('/:id/duplicates/list')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async get(
    @Res() res,
    @Param('id') id: number,
    @Query() query: QueryDuplicatesDto
  ) {
    const { page, limit, sortName, sortOrder, ...filters } = query;
    const data = await this.donorDupService.get(
      page,
      limit,
      { sortName, sortOrder },
      { ...filters, duplicatable_id: <any>id }
    );
    return res.status(data.status_code).json(data);
  }

  @Patch('/:id/duplicates/resolve')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async resolve(
    @Res() res,
    @Param('id') id: bigint,
    @Body() resolveDto: ResolveDuplicateDto
  ) {
    const data = await this.donorDupService.resolve(id, resolveDto);
    return res.status(data.status_code).json(data);
  }

  @Post('/duplicates/identify')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async identify(@Res() res, @Body() identifyDto: IdentifyDonorDuplicateDto) {
    const data = await this.donorDupService.identify(identifyDto);
    return res.status(data.status_code).json(data);
  }
}
