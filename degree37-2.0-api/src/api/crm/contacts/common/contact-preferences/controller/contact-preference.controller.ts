import {
  Controller,
  Get,
  Post,
  Param,
  UsePipes,
  HttpCode,
  ValidationPipe,
  HttpStatus,
  Put,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateContactPreferenceDto } from '../dto/create-contact-preference.dto';
import { ContactPreferenceService } from '../service/contact-preference.service';
import { GetContactPreferenceInterface } from '../interface/contact-preference.interface';

@ApiTags('Contact Preferences')
@Controller('/contact-preferences')
export class ContactPreferenceController {
  constructor(
    private readonly contactPreferenceService: ContactPreferenceService
  ) {}

  @Post('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createContactPreferenceDto: CreateContactPreferenceDto) {
    return this.contactPreferenceService.create(createContactPreferenceDto);
  }

  @Get('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() getContactPreferenceInterface: GetContactPreferenceInterface
  ) {
    return this.contactPreferenceService.get(getContactPreferenceInterface);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateContactPreferencDto: CreateContactPreferenceDto
  ) {
    return this.contactPreferenceService.update(id, updateContactPreferencDto);
  }
}
