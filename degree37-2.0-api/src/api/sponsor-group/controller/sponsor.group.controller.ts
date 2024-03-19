import {
  Controller,
  Get,
  Query,
  NotFoundException,
  InternalServerErrorException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { BBCSConnector } from 'src/connector/bbcsconnector';

@Controller('/sponsors')
export class SponsorController {
  constructor(private bbcsConnectorService: BBCSConnector) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async findSponsorGroup(
    @Query('sponsorGroupName') sponsorGroupName: string,
    @Query('addressLineOne') addressLineOne: string,
    @Query('addressLineTwo') addressLineTwo: string,
    @Query('city') city: string,
    @Query('state') state: string,
    @Query('zipCode') zipCode: string,
    @Query('phone') phone: string
  ): Promise<any> {
    try {
      const result = await this.bbcsConnectorService.findSponsorGroup({
        sponsorGroupName,
        addressLineOne,
        addressLineTwo,
        city,
        state,
        zipCode,
        phone,
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
