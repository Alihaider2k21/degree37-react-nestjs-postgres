import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetTemplatesInterface } from '../interface/templates.interface';
import { TemplateService } from '../services/template.service';

@Controller('templates')
@ApiTags('Templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  getListOfTemplates(@Query() getAllTemplateInterface: GetTemplatesInterface) {
    return this.templateService.listOfTemplates(getAllTemplateInterface);
  }
}
