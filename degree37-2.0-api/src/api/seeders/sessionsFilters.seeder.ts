import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { FilterCriteria } from '../crm/Filters/entities/filter_criteria';
import './seed-sessions-filters.json';

@Injectable()
export class SessionsFiltersSeed implements Seeder {
  constructor(
    @InjectRepository(FilterCriteria)
    private readonly filterCriteriaRepository: Repository<FilterCriteria>
  ) {}

  async seed(): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const filePath = path.join(__dirname, './seed-sessions-filters.json');
    const fileData = JSON.parse(fs.readFileSync(filePath));
    try {
      for (const data of fileData) {
        if (
          !(await this.filterCriteriaRepository.exist({
            where: {
              name: data.name,
              display_order: data.display_order,
              application_code: data.application_code,
            },
          }))
        ) {
          await this.filterCriteriaRepository.save(data);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async drop(): Promise<any> {
    try {
    } catch (e) {
      console.error('error seeding db : ', e);
    }
  }
}
