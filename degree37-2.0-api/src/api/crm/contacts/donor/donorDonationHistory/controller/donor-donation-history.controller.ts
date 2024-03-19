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
import { DonorDonationService } from '../services/donor-donation.service';
import { QueryDonorDonationsDto } from '../dto/donor-donations.dto';
import { FilterDonorDonationsDto } from '../dto/filter-donor-donations.dto';

@ApiTags('Donor Donations')
@Controller('/donors/donations/history')
export class DonorDonationController {
  constructor(private readonly donorDonationService: DonorDonationService) {}

  @Post('/')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async get(
    @Res() res,
    @Query() query: QueryDonorDonationsDto,
    @Body() filter: FilterDonorDonationsDto
  ) {
    const { page, limit, sortName, sortOrder, keyword } = query;
    const data = await this.donorDonationService.get(
      page,
      limit,
      {
        sortName,
        sortOrder,
      },
      keyword,
      filter
    );
    return res.status(data.status_code).json(data);
  }
}
