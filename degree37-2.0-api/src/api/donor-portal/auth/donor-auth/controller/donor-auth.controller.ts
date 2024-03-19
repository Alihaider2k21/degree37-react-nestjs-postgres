import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DonorLoginDto } from '../dto/donor-login.dto';
import { DonorAuthService } from '../service/donor-auth.service';

@ApiTags('Donor Auth')
@Controller('api/donor')
export class DonorAuthController {
  constructor(private readonly donorAuthService: DonorAuthService) {}

  // @UseGuards(AuthGuard("local"))
  @Post('/login')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() loginDto: DonorLoginDto) {
    return this.donorAuthService.login(loginDto);
  }
}
