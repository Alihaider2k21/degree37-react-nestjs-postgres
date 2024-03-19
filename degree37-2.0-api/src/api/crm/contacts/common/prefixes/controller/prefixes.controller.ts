import { Controller, Get, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixesService } from '../service/prefixes.service';

@ApiTags('Prefixes')
@Controller('prefixes')
export class PrefixesController {
  constructor(private readonly prefixesService: PrefixesService) {}

  @Get('/')
  @UsePipes(new ValidationPipe())
  async get(@Res() res) {
    const data = await this.prefixesService.get();
    return res.status(200).json(data);
  }
}
