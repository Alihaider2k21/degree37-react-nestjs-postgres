import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';

import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CommunicationService } from '../services/communication.service';
import { CreateCommunicationDto } from '../dto/create-communication.dto';
import {
  GetAllCommunicationInterface,
  GetCampaignId,
  SendEmailDto,
} from '../interface/communication.interface';

@Controller('contacts/volunteers/communications')
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @Post()
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  create(@Body() createCustomFieldDto: CreateCommunicationDto) {
    return this.communicationService.create(createCustomFieldDto);
  }

  @Get()
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  findAll(@Query() getAllCommunicationInterface: GetAllCommunicationInterface) {
    return this.communicationService.findAll(getAllCommunicationInterface);
  }

  @Get('/campaigns')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  getCampaigns() {
    return this.communicationService.getCampaigns();
  }

  @Get('/email-templates')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  getEmailTemplates(@Query() getCampaignId: GetCampaignId) {
    return this.communicationService.getEmailTemplates(getCampaignId);
  }

  // @Post('/send-email')
  // @ApiBearerAuth()
  // @UsePipes(new ValidationPipe())
  // sendEmail(@Body() sendEmailDto: SendEmailDto) {
  //   return this.communicationService.sendEmail(sendEmailDto);
  // }

  @Get(':id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  findOne(@Param('id') id: any) {
    return this.communicationService.findOne(id);
  }
}
