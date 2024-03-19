import { Injectable } from '@nestjs/common';
import ReportDto, { ReportType } from '../dto/report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import UserEvents from '../entities/user-event.entity';
import { Repository } from 'typeorm';
import { EventType } from '../dto/user-event.dto';
import { GetReportInterface } from '../interface/report.interface';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(UserEvents)
    private readonly userEventRepository: Repository<UserEvents>
  ) {}

  async generateReport(type: string, getReportInterface: GetReportInterface) {
    let records: UserEvents[] = [];
    let count = 0;
    let page = 0;

    const queryBuilder =
      this.userEventRepository.createQueryBuilder('user_events');

    switch (type) {
      case ReportType.LOGIN:
        queryBuilder.where('(user_events.type = :loginSuccess)', {
          loginSuccess: EventType.LOGIN_SUCCESS,
        });
        break;
      case ReportType.LOGIN_FAILURE:
        queryBuilder.where('user_events.type = :type', {
          type: EventType.LOGIN_FAILURE,
        });
        break;
      case ReportType.USER_ACTIVITY:
        queryBuilder.where('user_events.type = :type', {
          type: EventType.USER_ACTIVITY,
        });
        break;
    }

    if (getReportInterface.keyword) {
      queryBuilder.andWhere(
        '(user_events.name LIKE :keyword or user_events.email LIKE :keyword)',
        { keyword: `%${getReportInterface.keyword}%` }
      );
    }

    // Apply pagination options
    const limit: number = parseInt(
      getReportInterface.limit?.toString() ?? process.env.PAGE_SIZE ?? '10'
    );
    page = getReportInterface.page ? +getReportInterface.page : 1;

    queryBuilder.skip((page - 1) * limit || 0);
    queryBuilder.take(limit);
    queryBuilder.orderBy({ id: 'DESC' });

    [records, count] = await queryBuilder.getManyAndCount();

    const reports = records.map(
      (record) =>
        new ReportDto({
          activity: record.activity,
          browser: record.browser,
          date_time: record.created_at,
          email: record.email,
          location:
            (record.ip ?? '') +
            (record.city ? ' - ' + record.city : '') +
            (record.country ? ' - ' + record.country : ''),
          name: record.name,
          page_name: record.page_name,
          status: record.status,
        })
    );

    return { total_records: count, page_number: page, data: reports };
  }
}
