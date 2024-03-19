import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Body,
  Req,
  Request,
  Ip,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserEventService } from '../services/user-event.service';
import UserEventDto from '../dto/user-event.dto';
import * as useragent from 'useragent';
@ApiTags('UserEvents')
@Controller('user-events')
export class UserEventController {
  constructor(private readonly userEventService: UserEventService) {}
  @Post('/')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() userEventDto: UserEventDto,
    @Req() request: Request,
    @Ip() ip
  ) {
    const userAgentString = request?.headers['user-agent'];
    const userAgent = useragent.parse(userAgentString);
    userEventDto.ip = userEventDto.ip ?? ip;
    userEventDto.browser = userAgent?.family;
    return this.userEventService.create(userEventDto);
  }
}
