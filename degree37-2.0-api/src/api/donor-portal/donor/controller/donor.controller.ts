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
import { CreateDonorDto } from '../dto/create-donor.dto';
import { DonorService } from '../services/donor.service';

@ApiTags('Donor Portal')
@Controller('api/donor')
export class DonorController {
  constructor(private readonly donorService: DonorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  signUp(@Body() createDonorData: CreateDonorDto) {
    return this.donorService.createDonor(createDonorData);
  }
}
