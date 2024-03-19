import { Controller, Get, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SuffixesService } from '../service/suffixes.service';

@ApiTags('Suffixes')
@Controller('suffixes')
export class SuffixesController {
  constructor(private readonly suffixesService: SuffixesService) {}

  @Get('/')
  @UsePipes(new ValidationPipe())
  async get(@Res() res) {
    const data = await this.suffixesService.get();
    return res.status(200).json(data);
  }
}
