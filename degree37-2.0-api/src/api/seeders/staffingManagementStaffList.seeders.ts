import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { FilterSavedCriteria } from '../crm/Filters/entities/filter_saved_criteria';
import { FilterCriteria } from '../crm/Filters/entities/filter_criteria';
import { FilterSaved } from '../crm/Filters/entities/filter_saved';
import seedStaff from './seed-staffing-management-staff-list.json';

@Injectable()
export class StaffingManagementStaffListSeed implements Seeder {
  constructor(
    @InjectRepository(FilterCriteria)
    private readonly filterCriteriaRepository: Repository<FilterCriteria>
  ) {}

  async seed(): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const staffLocationsFilePath = path.join(
      __dirname,
      './seed-staffing-management-staff-list.json'
    );
    const staffingManagementStaffListDataFile = fs.readFileSync(
      staffLocationsFilePath
    );
    const staffingManagementStaffListSeedData = JSON.parse(
      staffingManagementStaffListDataFile
    );
    try {
      for (const data of staffingManagementStaffListSeedData) {
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
      console.log('Staff List Seeder Completed');
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
        `ALTER SEQUENCE public.filter_criteria_id_seq RESTART WITH 1`
      );
    } catch (e) {
      console.error('error seeding db : ', e);
    }
  }
}
