import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { FilterSavedCriteria } from '../crm/Filters/entities/filter_saved_criteria';
import { FilterCriteria } from '../crm/Filters/entities/filter_criteria';
import { FilterSaved } from '../crm/Filters/entities/filter_saved';
import seedCrm from './seed-crm-account.json';

@Injectable()
export class CrmAccountsSeed implements Seeder {
  constructor(
    @InjectRepository(FilterCriteria)
    private readonly filterCriteriaRepository: Repository<FilterCriteria>
  ) {}

  async seed(): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const crmAccountsFilePath = path.join(__dirname, './seed-crm-account.json');
    const crmAccountsDataFile = fs.readFileSync(crmAccountsFilePath);
    const crmAccountsSeedData = JSON.parse(crmAccountsDataFile);
    try {
      // await this.filterCriteriaRepository.query(
      //   `DELETE FROM public.filter_criteria`
      // );

      // // Reset primary key sequence
      // await this.filterCriteriaRepository.query(
      //   `ALTER SEQUENCE public.filter_criteria_id_seq RESTART WITH 12`
      // );

      //   await this.filterCriteriaRepository.query(
      //     `DELETE FROM public.permissions`
      //   );

      //   // Reset primary key sequence
      //   await this.filterCriteriaRepository.query(
      //     `ALTER SEQUENCE public.permissions_id_seq RESTART WITH 1`
      //   );
      //   await this.filterCriteriaRepository.query(`DELETE FROM public.modules`);

      // Reset primary key sequence
      //   await this.filterCriteriaRepository.query(
      //     `ALTER SEQUENCE public.modules_id_seq RESTART WITH 1`
      //   );
      //   await this.filterCriteriaRepository.query(
      //     `DELETE FROM public.applications`
      //   );

      // Reset primary key sequence
      //   await this.filterCriteriaRepository.query(
      //     `ALTER SEQUENCE public.applications_id_seq RESTART WITH 1`
      //   );
      for (const data of crmAccountsSeedData) {
        const findFilterData = await this.filterCriteriaRepository.findOne({
          where: {
            display_order: data.display_order,
            application_code: data.application_code,
          },
        });
        if (!findFilterData) {
          await this.filterCriteriaRepository.save(data);
        }
      }
      console.log('Accounts Seeder Completed');
    } catch (err) {
      console.log(err);
    }
  }

  async drop(): Promise<any> {
    try {
      await this.filterCriteriaRepository.query(
        `DELETE FROM public.filter_criteria`
      );

      // Reset primary key sequence
      await this.filterCriteriaRepository.query(
        `ALTER SEQUENCE public.filter_criteria_id_seq RESTART WITH 12`
      );
      //   await this.applicationRepository.query(`DELETE FROM public.modules`);

      //   // Reset primary key sequence
      //   await this.applicationRepository.query(
      //     `ALTER SEQUENCE public.modules_id_seq RESTART WITH 1`
      //   );
      //   await this.applicationRepository.query(`DELETE FROM public.applications`);

      //   // Reset primary key sequence
      //   await this.applicationRepository.query(
      //     `ALTER SEQUENCE public.applications_id_seq RESTART WITH 1`
      //   );
    } catch (e) {
      console.error('error seeding db : ', e);
    }
  }
}
