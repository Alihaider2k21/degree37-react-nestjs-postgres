import { Injectable } from '@nestjs/common';
import UserEvents from '../entities/user-event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import UserEventDto, { EventStatus, EventType } from '../dto/user-event.dto';
import { IpApiService } from './ip-api.service';
import { format } from 'date-fns';
import { UserService } from '../../tenants-administration/user-administration/user/services/user.services';
import { keyCloakAdmin } from '../../../../config/keycloak.config';
@Injectable()
export class UserEventService {
  constructor(
    @InjectRepository(UserEvents)
    private readonly userEventRepository: Repository<UserEvents>,
    private readonly userService: UserService,
    private readonly ipApiService: IpApiService
  ) {}
  async create(userEventDto: UserEventDto) {
    if (userEventDto) {
      const userEvent: UserEvents = new UserEvents();
      userEvent.page_name = userEventDto.page_name;
      userEvent.activity = userEventDto.activity;
      userEvent.browser = userEventDto.browser;
      userEvent.ip = userEventDto.ip;
      userEvent.email = userEventDto.email;
      userEvent.status = userEventDto.status;
      userEvent.type = userEventDto.eventType;
      userEvent.date_time = userEventDto.dateTime ?? new Date();

      // Get City Country
      try {
        const { city, country } = await this.ipApiService.getIpDetails(
          userEvent.ip
        );
        userEvent.city = city;
        userEvent.country = country;
      } catch (e) {}

      if (userEvent.email) {
        const user = await this.userService.findByEmail(userEvent.email);

        if (user) {
          userEvent.created_by = user.id;
          userEvent.name = user.first_name + ' ' + user.last_name;
        }
      }

      return await this.userEventRepository.save(userEvent);
    }
  }
  @Cron(CronExpression.EVERY_10_MINUTES)
  async getLoginFailures() {
    const kcAdmin = await keyCloakAdmin();
    const realms: any = await kcAdmin.realms.find();
    const date: Date = new Date();
    const formattedDate: string = format(date, 'yyyy-MM-dd');
    // Use this date_time to filter out all events which already saved in DB
    const userEvent = await this.userEventRepository.findOne({
      where: { type: EventType.LOGIN_FAILURE },
      order: { created_at: 'DESC' },
    });

    for (const realm of realms) {
      const events: any = await kcAdmin.realms.findEvents({
        realm: realm.realm,
        client: realm.realm,
        type: 'LOGIN_ERROR',
        dateFrom: formattedDate,
        DateTo: formattedDate,
      });
      events
        .filter((event: any) =>
          userEvent ? new Date(event.time) > userEvent.date_time : true
        )
        .map((event: any) => {
          const userEventDto: UserEventDto = new UserEventDto();
          userEventDto.activity = 'Login';
          userEventDto.email = event.details.username;
          userEventDto.eventType = EventType.LOGIN_FAILURE;
          userEventDto.ip = event.ipAddress;
          userEventDto.page_name = 'login';
          userEventDto.status = EventStatus.Failure;
          userEventDto.dateTime = new Date(event.time);
          this.create(userEventDto);
        });
    }
  }
}
