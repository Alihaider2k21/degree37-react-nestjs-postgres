import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { Sort } from 'src/common/interface/sort';
import { pagination } from 'src/common/utils/pagination';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { HistoryService } from 'src/api/common/services/history.service';
import { DonorDonationsHistory } from '../entities/donor-donations-history.entity';
import { DonorDonations } from '../entities/donor-donations.entity';
import { FilterDonorDonationsDto } from '../dto/filter-donor-donations.dto';

@Injectable()
export class DonorDonationService extends HistoryService<DonorDonationsHistory> {
  constructor(
    @InjectRepository(DonorDonations)
    private readonly donRepository: Repository<DonorDonations>,
    @InjectRepository(DonorDonationsHistory)
    readonly donHistoryRepository: Repository<DonorDonationsHistory>
  ) {
    super(donHistoryRepository);
  }

  async get(
    page: number,
    limit: number,
    sortBy: Sort,
    keyword: string,
    filter: FilterDonorDonationsDto
  ) {
    function removeDonPrefix(data) {
      const result = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const newKey = key.replace(/^don_/, '');
          result[newKey] = data[key];
        }
      }
      return result;
    }

    try {
      let donorDonQuery = this.donRepository
        .createQueryBuilder('don')
        .leftJoin('procedure_types', 'pt', 'don.donation_type = pt.id')
        .addSelect('pt.name AS procedure')
        .leftJoin('facility', 'fy', 'don.facility_id = fy.id')
        .addSelect('fy.name AS location')
        .leftJoin(
          'donors_donations_hospital',
          'ddh',
          'don.id = ddh.donors_donations_id'
        )
        .addSelect('ddh.hospital AS hospital')
        .addSelect('ddh.date_shipped AS dateShipped');

      const where = {};

      Object.assign(where, {
        donor_id: filter?.donor_id,
      });

      if (filter.status) {
        Object.assign(where, {
          donation_status: filter?.status,
        });
      }

      donorDonQuery.where(where);

      if (filter.procedure_type.length > 0) {
        const procedureNames = filter.procedure_type;

        donorDonQuery = donorDonQuery.andWhere(
          'pt.name IN (:...procedureNames)',
          {
            procedureNames,
          }
        );
      }

      if (filter.start_date && filter.end_date) {
        const startDate = filter.start_date;
        const endDate = filter.end_date;
        donorDonQuery = donorDonQuery.andWhere(
          'don.donation_date BETWEEN :startDate AND :endDate',
          { startDate, endDate }
        );
      }

      if (filter.hospital.length > 0) {
        const hospitalNames = filter.hospital;

        donorDonQuery = donorDonQuery.andWhere(
          'ddh.hospital IN (:...hospitalNames)',
          {
            hospitalNames,
          }
        );
      }

      if (keyword) {
        donorDonQuery = donorDonQuery.where('fy.name ILIKE :searchTerm', {
          searchTerm: `%${keyword}%`,
        });
      }

      if (sortBy.sortName && sortBy.sortOrder) {
        if (sortBy.sortName == 'location') {
          donorDonQuery = donorDonQuery.addOrderBy('fy.name', sortBy.sortOrder);
        } else if (sortBy.sortName == 'procedure') {
          donorDonQuery = donorDonQuery.addOrderBy('pt.name', sortBy.sortOrder);
        } else if (sortBy.sortName == 'dateshipped') {
          donorDonQuery = donorDonQuery.addOrderBy(
            'ddh.date_shipped',
            sortBy.sortOrder
          );
        } else if (sortBy.sortName == 'hospital') {
          donorDonQuery = donorDonQuery.addOrderBy(
            'ddh.hospital',
            sortBy.sortOrder
          );
        } else if (sortBy.sortName == 'credit') {
          donorDonQuery = donorDonQuery.addOrderBy('fy.name', 'ASC');
        } else {
          donorDonQuery = donorDonQuery.addOrderBy(
            sortBy.sortName,
            sortBy.sortOrder
          );
        }
      }

      const count = await donorDonQuery.getCount();

      if (page && limit) {
        const { skip, take } = pagination(page, limit);
        donorDonQuery = donorDonQuery.limit(take).offset(skip);
      }

      let records = await donorDonQuery.getRawMany();

      records = records.map((record) => {
        return removeDonPrefix(record);
      });

      return resSuccess(
        'Donor Donation records',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { count, records }
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
