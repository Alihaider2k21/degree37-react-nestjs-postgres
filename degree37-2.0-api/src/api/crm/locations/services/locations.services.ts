import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  ILike,
  Repository,
  In,
  QueryRunner,
  Not,
  Like,
  Equal,
  MoreThan,
} from 'typeorm';
import * as dotenv from 'dotenv';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { CrmLocations } from '../entities/crm-locations.entity';
import { CrmLocationsHistory } from '../entities/crm-locations-history';
import {
  GetAllLocationInterface,
  GetDrivesHistoryQuery,
} from '../interface/locations.interface';
import { LocationsDto } from '../dto/locations.dto';
import { ErrorConstants } from '../../../system-configuration/constants/error.constants';
import { CRMVolunteer } from '../../contacts/volunteer/entities/crm-volunteer.entity';
import {
  resError,
  resSuccess,
} from '../../../system-configuration/helpers/response';
import { Address } from '../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { AddressHistory } from '../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/addressHistory.entity';
import { CrmLocationsSpecsHistory } from '../entities/crm-locations-specs-history.entity';
import { CrmLocationsSpecs } from '../entities/crm-locations-specs.entity';
import { CrmLocationsSpecsOptions } from '../entities/crm-locations-specs-options.entity';
import { CrmLocationsSpecsOptionsHistory } from '../entities/crm-locations-specs-options-history.entity';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { RoomSize } from '../../../system-configuration/tenants-administration/crm-administration/locations/room-sizes/entity/roomsizes.entity';
import { Directions } from '../directions/entities/direction.entity';
import { addressExtractionFilter } from 'src/api/common/services/addressExtraction.service';
import { ExportService } from '../../contacts/common/exportData.service';
import moment from 'moment';
import { saveCustomFields } from 'src/api/common/services/saveCustomFields.service';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { CustomFields } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-field.entity';
import { DonationStatusEnum } from '../../contacts/donor/enum/donors.enum';
import { PolymorphicType } from 'src/api/common/enums/polymorphic-type.enum';
import { pagination } from 'src/common/utils/pagination';

dotenv.config();

@Injectable()
export class LocationsService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(CrmLocationsSpecs)
    private readonly crmLocationsSpecs: Repository<CrmLocationsSpecs>,
    @InjectRepository(CRMVolunteer)
    private readonly crmVolunteerRepository: Repository<CRMVolunteer>,
    @InjectRepository(RoomSize)
    private readonly roomSizeRepository: Repository<RoomSize>,
    @InjectRepository(CrmLocationsSpecsOptions)
    private readonly crmLocationsSpecsoptions: Repository<CrmLocationsSpecsOptions>,
    @InjectRepository(CrmLocationsSpecsHistory)
    private readonly crmLocationsSpecsHistory: Repository<CrmLocationsSpecsHistory>,
    @InjectRepository(CrmLocationsSpecsOptionsHistory)
    private readonly crmLocationsSpecsOptionsHistory: Repository<CrmLocationsSpecsOptionsHistory>,
    @InjectRepository(AddressHistory)
    private readonly addressHistoryRepository: Repository<AddressHistory>,
    @InjectRepository(CrmLocationsHistory)
    private readonly locationsHistoryRepository: Repository<CrmLocationsHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(CrmLocations)
    private readonly locationRepository: Repository<CrmLocations>,
    @InjectRepository(Directions)
    private readonly directionsRepository: Repository<Directions>,
    @InjectRepository(CustomFields)
    private readonly customFieldsRepository: Repository<CustomFields>,
    private readonly entityManager: EntityManager,
    private readonly exportService: ExportService
  ) {}

  async findAll(user: any, params: GetAllLocationInterface) {
    try {
      const {
        fetchAll,
        sortName,
        sortOrder,
        page,
        limit,
        keyword,
        status,
        site_type,
        qualification_status,
        city,
        state,
        country,
        organizational_levels,
        downloadType,
        exportType,
      } = params;

      const sortBy = {
        site_contact_id: 'volunteer.first_name',
        status: 'location.is_active',
        address: 'address.city',
      };

      const query = this.locationRepository
        .createQueryBuilder('location')
        .leftJoin(
          'crm_volunteer',
          'volunteer',
          'volunteer.id = location.site_contact_id AND volunteer.is_archived = false'
        )
        .leftJoin(
          'address',
          'address',
          `location.id = address.addressable_id AND address.addressable_type = '${PolymorphicType.CRM_LOCATIONS}'`
        )
        .where({
          is_archived: false,
          tenant_id: { id: user?.tenant?.id },
        })
        .select([
          'location.*',
          "JSON_BUILD_OBJECT('addressable_type', address.addressable_type, 'address1', address.address1, 'address2', address.address2, 'zip_code', address.zip_code, 'city', address.city, 'state', address.state, 'country', address.country, 'county', address.county, 'coordinates', address.coordinates) AS address",
          "JSON_BUILD_OBJECT('first_name', volunteer.first_name, 'last_name', volunteer.last_name) AS site_contact_id",
        ])
        .orderBy(
          sortBy[sortName] ? sortBy[sortName] : sortName,
          sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'
        );

      let exportData = [];
      if (exportType && exportType?.trim() === 'all') {
        exportData = await query.getRawMany();
      }
      if (keyword) {
        query.andWhere('location.name = :keyword', { keyword });
      }
      if (status) {
        query.andWhere('location.is_active = :status', { status });
      }
      if (site_type === 'inside/outside') {
        query.andWhere("location.site_type = 'Inside / Outside'");
      } else if (site_type) {
        query.andWhere('location.site_type ILIKE :site_type', {
          site_type: site_type,
        });
      }
      if (qualification_status) {
        query.andWhere(
          'location.qualification_status ILIKE :qualification_status',
          { qualification_status }
        );
      }
      if (city) {
        query.andWhere('address.city ILIKE :city', {
          city: `%${city}%`,
        });
      }
      if (state) {
        query.andWhere('address.state ILIKE :state', {
          state: `%${state}%`,
        });
      }
      if (country) {
        query.andWhere('address.country ILIKE :country', {
          country: `%${country}%`,
        });
      }
      if (organizational_levels) {
        const collection_operations = JSON.parse(organizational_levels);
        query
          .leftJoin(
            'drives',
            'drive',
            'drive.location_id = location.id AND drive.is_archived = false'
          )
          .leftJoin(
            'accounts',
            'acc',
            'acc.id = drive.account_id AND acc.is_archived = false'
          );
        let olWhere = '';
        const params = {};
        Object.entries(collection_operations).forEach(
          ([co_id, value], index) => {
            olWhere += olWhere ? ' OR ' : '';
            olWhere += `(acc.collection_operation = :co_id${index}`;
            params[`co_id${index}`] = co_id;
            const { recruiters } = <any>value;
            if (recruiters?.length) {
              olWhere += ` AND drive.recruiter_id IN (:...recruiters${index})`;
              params[`recruiters${index}`] = recruiters;
            }
            olWhere += ')';
          }
        );
        query.andWhere(`(${olWhere})`, params);
      }
      if (exportType && exportType?.trim() !== 'all') {
        exportData = await query.getRawMany();
      }

      const count = await query.getCount();

      if (page && limit && fetchAll?.toString() !== 'true') {
        const { skip, take } = pagination(page, limit);
        query.limit(take).offset(skip);
      }

      const result = await query.getRawMany();

      let url: string;
      if (exportType && downloadType) {
        const newArray = exportData.map((item) => {
          const address = item.address;
          const addressString = `${address.address1} ${address.address2}, ${address.city}, ${address.state}, ${address.country}`;
          const siteContact = item.site_contact_id;
          const siteContactName = `${siteContact.first_name} ${siteContact.last_name}`;
          let tenantInfo;
          if (typeof item.tenant_id === 'string') {
            tenantInfo = item.tenant_id ?? null;
          } else {
            tenantInfo = item.tenant_id?.id ?? null;
          }
          return {
            id: item.id,
            created_at: moment(item.created_at).format('MM/DD/YYYY hh:mm A'),
            is_archived: item.is_archived,
            name: item.name,
            cross_street: item.cross_street,
            floor: item.floor,
            room: item.room,
            room_phone: item.room_phone,
            becs_code: item.becs_code,
            site_type: item.site_type,
            qualification_status: item.qualification_status,
            is_active: item.is_active,
            site_contact: siteContactName,
            tenant_id: tenantInfo,
            address: addressString,
          };
        });
        const prefixName = params?.selectedOptions
          ? params?.selectedOptions.trim()
          : 'Locations';
        url = await this.exportService.exportDataToS3(
          newArray,
          params,
          prefixName,
          'Locations'
        );
      }

      return {
        status: HttpStatus.OK,
        response: 'CrmLocations Fetched',
        count: count,
        data: result,
        url,
      };
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  /**
   * @deprecated
   */
  async findAllFilters(user: any, params: GetAllLocationInterface) {
    try {
      const userId = user?.tenant?.id;
      const fetchAll =
        params?.fetchAll === true || params?.fetchAll?.toString() === 'true';
      const sortName = params?.sortName;
      const sortBy = params?.sortOrder;
      const keyword = params?.keyword;
      const downloadAll = params?.downloadType;
      if ((sortName && !sortBy) || (sortBy && !sortName)) {
        return new HttpException(
          'When selecting sort SortBy & SortName is required.',
          HttpStatus.BAD_REQUEST
        );
      }
      const where = {};

      if (params?.status) {
        Object.assign(where, {
          is_active: params?.status,
        });
      }

      if (params?.site_type) {
        Object.assign(where, {
          site_type: ILike(`%${params?.site_type}%`),
        });
      }

      if (params?.site_type && params?.site_type == 'inside/outside') {
        Object.assign(where, {
          site_type: 'Inside / Outside',
        });
      }

      if (params?.qualification_status) {
        Object.assign(where, {
          qualification_status: ILike(`${params?.qualification_status.trim()}`),
        });
      }

      if (params?.keyword) {
        Object.assign(where, {
          name: ILike(`%${params?.keyword}%`),
        });
      }
      if (params?.keyword) {
        Object.assign(where, {
          room: ILike(`%${params?.keyword}%`),
        });
      }

      const sorting = {};
      if (sortName && sortBy) {
        if (sortName === 'recruiter') {
          sorting[sortName] = {
            first_name: sortBy.toUpperCase() as 'ASC' | 'DESC',
          };
        } else if (
          sortName === 'collection_operation' ||
          sortName === 'industry_category' ||
          sortName === 'industry_subcategory'
        ) {
          sorting[sortName] = {
            name: sortBy.toUpperCase() as 'ASC' | 'DESC',
          };
        } else {
          sorting[sortName] = sortBy.toUpperCase() as 'ASC' | 'DESC';
        }
      } else {
        sorting['id'] = 'DESC';
      }
      let response: any = [];
      let count: any = 0;
      let exportData: any = [];
      const limit: number = params?.limit
        ? +params.limit
        : +process.env.PAGE_SIZE;
      const page = params?.page ? +params.page : 1;
      let sample: any = 0;

      if (fetchAll) {
        const query = `
            SELECT crm_locations.*, address.*
                FROM crm_locations
                INNER JOIN address ON crm_locations.id = address.addressable_id AND address.addressable_type = 'crm_locations'
                LEFT JOIN crm_volunteer AS volunteer ON crm_locations.site_contact_id = volunteer.id
                WHERE crm_locations.is_archived = false
                AND address.addressable_type = 'crm_locations'
                AND crm_locations.tenant_id = ${userId}
            `;
        response = await this.locationRepository.query(query);

        sample = await this.locationRepository.findAndCount({
          where: {
            is_archived: false,
          },
        });
        count = sample?.length;
      } else {
        if (sortName && sortBy && keyword) {
          const pagination = `LIMIT ${limit} 
        OFFSET ${(page - 1) * limit}`;
          let sortSite = '';
          if (sortName === 'site_contact_id') {
            sortSite = `crm_locations.site_contact_id.first_name ${sortBy}`;
          } else {
            if (sortName == 'status') {
              sortSite = `is_active ${sortBy}`;
            } else if (sortName == 'address') {
              sortSite = `address.city ${sortBy}`;
            } else {
              sortSite = `${sortName} ${sortBy}`;
            }
          }
          const query = `
            SELECT crm_locations.*, (
              SELECT JSON_BUILD_OBJECT(
                  'addressable_type', address.addressable_type,
                  'address1', address.address1,
                  'address2', address.address2,
                  'zip_code', address.zip_code,
                  'city', address.city,
                  'state', address.state,
                  'country', address.country,
                  'county', address.county,
                  'coordinates', address.coordinates
              )
              FROM address
              WHERE crm_locations.id = address.addressable_id
              AND address.addressable_type = 'crm_locations'
              LIMIT 1
          ) AS address,
          (
            SELECT JSON_BUILD_OBJECT(
                'first_name', crm_volunteer.first_name,
                'last_name', crm_volunteer.last_name
            )
            FROM crm_volunteer
            WHERE crm_volunteer.id = crm_locations.site_contact_id
            LIMIT 1
        ) AS site_contact_id
        FROM crm_locations
        INNER JOIN address ON crm_locations.id = address.addressable_id AND address.addressable_type = 'crm_locations'
        WHERE crm_locations.is_archived = false
        AND crm_locations.name ILIKE '%${keyword}%'
        OR crm_locations.room ILIKE '%${keyword}%'
            AND crm_locations.tenant_id = ${userId}`;
          const whereConditions = [];
          if (params?.status) {
            whereConditions.push(`crm_locations.is_active = ${params.status}`);
          }

          if (params?.site_type) {
            whereConditions.push(
              `crm_locations.site_type ILIKE '%${params.site_type}%'`
            );
          }

          if (params?.site_type === 'inside/outside') {
            whereConditions.push(
              `crm_locations.site_type = 'Inside / Outside'`
            );
          }

          if (params?.qualification_status) {
            whereConditions.push(
              `crm_locations.qualification_status ILIKE '${params.qualification_status}'`
            );
          }

          const whereClause =
            whereConditions.length > 0
              ? `AND ${whereConditions.join(' AND ')}`
              : '';

          const completeQuery = `
            ${query}
            ${whereClause}
            ORDER BY ${sortSite}
            ${pagination};
          `;
          const countQuery = `
          SELECT crm_locations.*, (
            SELECT JSON_BUILD_OBJECT(
                'addressable_type', address.addressable_type,
                'address1', address.address1,
                'address2', address.address2,
                'zip_code', address.zip_code,
                'city', address.city,
                'state', address.state,
                'country', address.country,
                'county', address.county,
                'coordinates', address.coordinates
            )
            FROM address
            WHERE crm_locations.id = address.addressable_id
            AND address.addressable_type = 'crm_locations'
            LIMIT 1
        ) AS address,
        (
          SELECT JSON_BUILD_OBJECT(
              'first_name', crm_volunteer.first_name,
              'last_name', crm_volunteer.last_name
          )
          FROM crm_volunteer
          WHERE crm_volunteer.id = crm_locations.site_contact_id
          LIMIT 1
      ) AS site_contact_id
      FROM crm_locations
      INNER JOIN address ON crm_locations.id = address.addressable_id AND address.addressable_type = 'crm_locations'
      WHERE crm_locations.is_archived = false
      AND crm_locations.tenant_id = ${userId}
      AND crm_locations.name ILIKE '%${keyword}%'
      OR crm_locations.room ILIKE '%${keyword}%'
          AND crm_locations.tenant_id = ${userId}
          ORDER BY ${sortSite};
          `;
          if (downloadAll) {
            const completeQueryExport = `
            ${query}
            ${params?.exportType === 'all' ? '' : whereClause}
            ORDER BY ${sortSite};`;
            exportData = await this.locationRepository.query(
              completeQueryExport
            );
          }

          response = await this.locationRepository.query(completeQuery);

          const countQueryRecord = await this.locationRepository.query(
            countQuery
          );
          count = countQueryRecord?.length || 0;
        } else if (!sortName && !sortBy && keyword) {
          const pagination = `LIMIT ${limit} 
        OFFSET ${(page - 1) * limit}`;

          const query = `
          SELECT crm_locations.*,
          (
              SELECT JSON_BUILD_OBJECT(
                  'addressable_type', address.addressable_type,
                  'address1', address.address1,
                  'address2', address.address2,
                  'zip_code', address.zip_code,
                  'city', address.city,
                  'state', address.state,
                  'country', address.country,
                  'county', address.county,
                  'coordinates', address.coordinates
              )
              FROM address
              WHERE crm_locations.id = address.addressable_id
              AND address.addressable_type = 'crm_locations'
              LIMIT 1
          ) AS address,
          (
            SELECT JSON_BUILD_OBJECT(
                'first_name', crm_volunteer.first_name,
                'last_name', crm_volunteer.last_name
            )
            FROM crm_volunteer
            WHERE crm_volunteer.id = crm_locations.site_contact_id
            LIMIT 1
        ) AS site_contact_id
        FROM crm_locations
        WHERE crm_locations.is_archived = false
        AND crm_locations.tenant_id = ${userId}
        AND crm_locations.name ILIKE '%${keyword}%'
        OR crm_locations.room ILIKE '%${keyword}%'
        `;
          const whereConditions = [];
          if (params?.status) {
            whereConditions.push(`crm_locations.is_active = ${params.status}`);
          }

          if (params?.site_type) {
            whereConditions.push(
              `crm_locations.site_type ILIKE '%${params.site_type}%'`
            );
          }

          if (params?.site_type === 'inside/outside') {
            whereConditions.push(
              `crm_locations.site_type = 'Inside / Outside'`
            );
          }

          if (params?.qualification_status) {
            whereConditions.push(
              `crm_locations.qualification_status ILIKE '${params.qualification_status}'`
            );
          }
          const whereClause =
            whereConditions.length > 0
              ? `AND ${whereConditions.join(' AND ')}`
              : '';

          const completeQuery = `
          ${query}
          ${whereClause}
          ${pagination};
        `;
          const countQuery = `
          SELECT crm_locations.*,
          (
              SELECT JSON_BUILD_OBJECT(
                  'addressable_type', address.addressable_type,
                  'address1', address.address1,
                  'address2', address.address2,
                  'zip_code', address.zip_code,
                  'city', address.city,
                  'state', address.state,
                  'country', address.country,
                  'county', address.county,
                  'coordinates', address.coordinates
              )
              FROM address
              WHERE crm_locations.id = address.addressable_id
              AND address.addressable_type = 'crm_locations'
              LIMIT 1
          ) AS address,
          (
            SELECT JSON_BUILD_OBJECT(
                'first_name', crm_volunteer.first_name,
                'last_name', crm_volunteer.last_name
            )
            FROM crm_volunteer
            WHERE crm_volunteer.id = crm_locations.site_contact_id
            LIMIT 1
        ) AS site_contact_id
        FROM crm_locations
        WHERE crm_locations.is_archived = false
        AND crm_locations.tenant_id = ${userId}
        AND crm_locations.name ILIKE '%${keyword}%'
        OR crm_locations.room ILIKE '%${keyword}%';`;
          response = await this.locationRepository.query(completeQuery);
          const countQueryRecord = await this.locationRepository.query(
            countQuery
          );
          if (downloadAll) {
            const completeQueryExport = `
          ${query}
          ${params?.exportType === 'all' ? '' : whereClause};`;
            exportData = await this.locationRepository.query(
              completeQueryExport
            );
          }
          count = countQueryRecord?.length || 0;
        } else if (sortName && sortBy && !keyword) {
          const pagination = `LIMIT ${limit} 
          OFFSET ${(page - 1) * limit}`;
          let sortSite = '';
          if (sortName === 'site_contact_id') {
            sortSite = `(
        SELECT JSON_BUILD_OBJECT(
            'first_name', crm_volunteer.first_name,
            'last_name', crm_volunteer.last_name
        )
        FROM crm_volunteer
        WHERE crm_volunteer.id = crm_locations.site_contact_id
        LIMIT 1
    ) ->> 'first_name' ${sortBy}`;
          } else {
            if (sortName == 'status') {
              sortSite = `is_active ${sortBy}`;
            } else if (sortName == 'address') {
              sortSite = `address.city ${sortBy}`;
            } else {
              sortSite = `${sortName} ${sortBy}`;
            }
          }
          const query = `
          SELECT crm_locations.*,
          (
              SELECT JSON_BUILD_OBJECT(
                  'addressable_type', address.addressable_type,
                  'address1', address.address1,
                  'address2', address.address2,
                  'zip_code', address.zip_code,
                  'city', address.city,
                  'state', address.state,
                  'country', address.country,
                  'county', address.county,
                  'coordinates', address.coordinates
              )
              FROM address
              WHERE crm_locations.id = address.addressable_id
              AND address.addressable_type = 'crm_locations'
              LIMIT 1
          ) AS address,
            (
            SELECT JSON_BUILD_OBJECT(
                'first_name', crm_volunteer.first_name,
                'last_name', crm_volunteer.last_name
            ) 
            FROM crm_volunteer
            WHERE crm_volunteer.id = crm_locations.site_contact_id
            LIMIT 1
        ) AS site_contact_id
        FROM crm_locations
        INNER JOIN address ON crm_locations.id = address.addressable_id AND address.addressable_type = 'crm_locations'
        WHERE crm_locations.is_archived = false
        AND crm_locations.tenant_id = ${userId}`;
          const whereConditions = [];
          if (params?.status) {
            whereConditions.push(`crm_locations.is_active = ${params.status}`);
          }

          if (params?.site_type) {
            whereConditions.push(
              `crm_locations.site_type ILIKE '%${params.site_type}%'`
            );
          }

          if (params?.site_type === 'inside/outside') {
            whereConditions.push(
              `crm_locations.site_type = 'Inside / Outside'`
            );
          }

          if (params?.qualification_status) {
            whereConditions.push(
              `crm_locations.qualification_status ILIKE '${params.qualification_status}'`
            );
          }
          const whereClause =
            whereConditions.length > 0
              ? `AND ${whereConditions.join(' AND ')}`
              : '';

          const completeQuery = `
            ${query}
            ${whereClause}
            ORDER BY ${sortSite}
            ${pagination};
          `;
          const countQuery = `
          SELECT crm_locations.*,
          (
              SELECT JSON_BUILD_OBJECT(
                  'addressable_type', address.addressable_type,
                  'address1', address.address1,
                  'address2', address.address2,
                  'zip_code', address.zip_code,
                  'city', address.city,
                  'state', address.state,
                  'country', address.country,
                  'county', address.county,
                  'coordinates', address.coordinates
              )
              FROM address
              WHERE crm_locations.id = address.addressable_id
              AND address.addressable_type = 'crm_locations'
              LIMIT 1
          ) AS address,
            (
            SELECT JSON_BUILD_OBJECT(
                'first_name', crm_volunteer.first_name,
                'last_name', crm_volunteer.last_name
            ) 
            FROM crm_volunteer
            WHERE crm_volunteer.id = crm_locations.site_contact_id
            LIMIT 1
        ) AS site_contact_id
        FROM crm_locations
        INNER JOIN address ON crm_locations.id = address.addressable_id AND address.addressable_type = 'crm_locations'
        WHERE crm_locations.is_archived = false
        AND crm_locations.tenant_id = ${userId}
        ORDER BY ${sortSite};`;
          if (downloadAll) {
            const completeQueryExport = `
        ${query}
        ${params?.exportType === 'all' ? '' : whereClause}
        ORDER BY ${sortSite};`;
            exportData = await this.locationRepository.query(
              completeQueryExport
            );
          }
          response = await this.locationRepository.query(completeQuery);

          const countQueryRecord = await this.locationRepository.query(
            countQuery
          );
          count = countQueryRecord?.length || 0;
        } else {
          const pagination: any = {
            take: limit,
            skip: (page - 1) * limit,
          };
          let countQueryRecord = await this.locationRepository.find({
            where: {
              tenant_id: {
                id: userId,
              },
              is_archived: false,
              ...where,
            },
            relations: ['created_by', 'site_contact_id', 'tenant_id'],
            order: { id: 'DESC' },
          });
          if (downloadAll) {
            exportData = await this.locationRepository.find({
              where: {
                tenant_id: {
                  id: userId,
                },
                is_archived: false,
                ...(params?.exportType === 'all' ? {} : where),
              },
              relations: ['created_by', 'site_contact_id', 'tenant_id'],
              order: { id: 'DESC' },
            });
            ({ newData: exportData, newCountData: countQueryRecord } =
              await this.processDataWithCount(
                exportData,
                countQueryRecord,
                userId,
                params,
                this.addressRepository
              ));
          }
          response = await this.locationRepository.find({
            where: {
              tenant_id: {
                id: userId,
              },
              is_archived: false,
              ...where,
            },
            relations: ['created_by', 'site_contact_id', 'tenant_id'],
            order: { id: 'DESC' },
            ...pagination,
          });

          ({ newData: response, newCountData: countQueryRecord } =
            await this.processDataWithCount(
              response,
              countQueryRecord,
              userId,
              params,
              this.addressRepository
            ));

          count = countQueryRecord?.length || 0;
          // [count] = await this.locationRepository.findAndCount({
          //   where: {
          //     is_archived: false,
          //   },
          // });
          // const query = `SELECT COUNT(*) AS count
          //       FROM (
          //          SELECT crm_locations.*,
          //                               (
          //                     SELECT JSON_BUILD_OBJECT(
          //                                       'addressable_type', address.addressable_type,
          //                       'address1', address.address1,
          //                       'address2', address.address2,
          //                       'zip_code', address.zip_code,
          //                       'city', address.city,
          //                       'state', address.state,
          //                       'country', address.country,
          //                       'county', address.county,
          //                       'coordinates', address.coordinates
          //                                   )
          //                                   FROM address
          //                                   WHERE crm_locations.id = address.addressable_id
          //                                   AND address.addressable_type = 'crm_locations'
          //                                   AND crm_locations.is_archived = false
          //                                   LIMIT 1
          //                               ) AS address,
          //                               (
          //                                   SELECT JSON_BUILD_OBJECT(
          //                                       'first_name', crm_volunteer.first_name,
          //                                       'last_name', crm_volunteer.last_name
          //                                   )
          //                                   FROM crm_volunteer
          //                                   WHERE crm_volunteer.id = crm_locations.site_contact_id
          //                                   AND crm_locations.is_archived = false
          //                                   LIMIT 1
          //                               ) AS site_contact_id
          //                           FROM crm_locations
          //                           INNER JOIN address ON crm_locations.id = address.addressable_id
          //                           WHERE crm_locations.is_archived = false
          //                           AND crm_locations.created_by = ${userId}
          //                       ) AS subquery;`;
          // const number = await this.locationRepository.query(query);
          // count = number[0].count;
        }
      }
      let url;
      if (params?.exportType && params.downloadType) {
        const newArray = exportData.map((item) => {
          const address = item.address;
          const addressString = `${address.address1} ${address.address2}, ${address.city}, ${address.state}, ${address.country}`;
          const siteContact = item.site_contact_id;
          const siteContactName = `${siteContact.first_name} ${siteContact.last_name}`;
          return {
            name: item.name,
            cross_street: item.cross_street,
            floor: item.floor,
            room: item.room,
            room_phone: item.room_phone,
            becs_code: item.becs_code,
            site_type: item.site_type,
            qualification_status: item.qualification_status,
            status: item.is_active,
            site_contact: siteContactName,
            address: addressString,
          };
        });
        const columnsToFilter = new Set(params?.tableHeaders.split(','));
        const filteredData = newArray?.map((obj) => {
          const newObj = {};
          for (const [key, val] of Object.entries(obj)) {
            const keys =
              key === 'site_contact'
                ? 'site_contact_id'
                : key === 'status'
                ? 'is_active'
                : key;
            const value =
              keys === 'is_active' ? (val ? 'Active' : 'Inactive') : val;
            if (columnsToFilter.has(keys)) {
              newObj[key] = value;
            }
          }
          return newObj;
        });
        const prefixName = params?.selectedOptions
          ? params?.selectedOptions.trim()
          : 'Locations';
        url = await this.exportService.exportDataToS3(
          filteredData,
          params,
          prefixName,
          'Locations'
        );
      }
      return {
        status: HttpStatus.OK,
        response: 'CrmLocations Fetched',
        count: count,
        data: response,
        url,
      };
    } catch (error) {
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAllWithDirections(user: any) {
    try {
      const response = await this.locationRepository.find({
        relations: ['directions'],
        where: {
          tenant_id: { id: user?.tenant?.id },
          is_archived: false,
          is_active: true,
          directions: {
            miles: MoreThan(0),
            minutes: MoreThan(0),
            is_archived: false,
            is_active: true,
          },
        },
      });
      return {
        status: HttpStatus.OK,
        response: 'CrmLocations Fetched',
        data: response,
      };
    } catch (error) {
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async create(user: any, createLocationDto: LocationsDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const existing = await this.locationRepository.findOne({
        where: {
          name: createLocationDto?.name,
        },
        relations: ['created_by'],
      });
      if (existing)
        return resError(
          'Location already available!',
          ErrorConstants.Error,
          404
        );
      const userId = user?.id;

      const userData = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });
      const findVolunteer = await this.crmVolunteerRepository.findOne({
        where: {
          id: createLocationDto?.site_contact_id,
        },
      });
      const location = new CrmLocations();
      location.name = createLocationDto?.name;
      location.floor = createLocationDto?.floor;
      location.room = createLocationDto?.room;
      location.room_phone = createLocationDto?.room_phone;
      location.site_contact_id = createLocationDto?.site_contact_id
        ? findVolunteer
        : null;
      location.becs_code = createLocationDto?.becs_code;
      location.site_type = createLocationDto?.site_type;
      location.is_active = createLocationDto?.is_active;
      location.is_archived = createLocationDto?.is_archived;
      location.qualification_status = createLocationDto?.qualification_status;
      location.cross_street = createLocationDto?.cross_street;
      location.created_by = userData ?? userData;
      location.tenant_id = user?.tenant;
      location.is_active = createLocationDto?.is_active ?? true;
      const savedLocation: CrmLocations = await queryRunner.manager.save(
        location
      );
      const locationsCustomFieds = [];
      await saveCustomFields(
        this.customFieldsRepository,
        queryRunner,
        savedLocation,
        this.request.user?.id,
        this.request.user?.tenant?.id,
        createLocationDto,
        locationsCustomFieds
      );
      const findRoom = await this.roomSizeRepository.findOne({
        where: {
          id: createLocationDto?.room_size_id,
        },
      });
      const locationsSpecs = new CrmLocationsSpecs();
      locationsSpecs.location_id = savedLocation;
      locationsSpecs.room_size_id = findRoom;
      locationsSpecs.elevator = createLocationDto?.elevator;
      locationsSpecs.outside_stairs = createLocationDto?.outside_stairs ?? null;
      locationsSpecs.inside_stairs = createLocationDto?.inside_stairs ?? null;
      locationsSpecs.electrical_note =
        createLocationDto?.electrical_note ?? null;
      locationsSpecs.special_instructions =
        createLocationDto?.special_instructions ?? null;
      locationsSpecs.created_by = userId;
      locationsSpecs.tenant_id = user?.tenant;
      const savedLocationsSpecs = await queryRunner.manager.save(
        locationsSpecs
      );
      let savedcrmLocationSpecOptions;

      if (
        createLocationDto?.specsData &&
        createLocationDto?.specsData?.length
      ) {
        const locationoptionsArray: any = [];
        const locationsData: any = createLocationDto?.specsData.map(
          (item, index) => {
            const LocationOptions = new CrmLocationsSpecsOptions();
            LocationOptions.location_specs_id = savedLocationsSpecs;
            for (const key in item) {
              if (item.hasOwnProperty(key)) {
                const value = item[key];
                LocationOptions.specs_key = key;
                LocationOptions.specs_value = value;
              }
            }
            LocationOptions.created_by = userId;
            LocationOptions.tenant_id = user?.tenant;
            locationoptionsArray.push(LocationOptions);

            return LocationOptions;
          }
        );
        savedcrmLocationSpecOptions = await queryRunner.manager.save(
          CrmLocationsSpecsOptions,
          locationsData
        );
      } else {
        return resError(
          'data not saved invalid specsData',
          ErrorConstants.Error,
          400
        );
      }
      const address = new Address();
      if (createLocationDto?.address?.coordinates) {
        if (
          createLocationDto?.address?.coordinates?.latitude &&
          createLocationDto?.address?.coordinates?.longitude
        ) {
          address.coordinates = `(${createLocationDto?.address?.coordinates?.latitude}, ${createLocationDto?.address?.coordinates?.longitude})`;
        } else {
          return resError('Invalid Address', ErrorConstants.Error, 400);
        }
      }
      address.city = createLocationDto?.address?.city;
      address.state = createLocationDto?.address?.state;
      address.zip_code = createLocationDto?.address?.zip_code;
      address.country = createLocationDto?.address?.country;
      address.address1 = createLocationDto?.address?.address1;
      address.address2 = createLocationDto?.address?.address2;
      address.county = createLocationDto?.address?.county;
      address.addressable_type = 'crm_locations';
      address.addressable_id = savedLocation.id;
      address.created_by = userData.id;
      address.tenant_id = user?.tenant?.id;

      const savedAddress: Address = await queryRunner.manager.save(address);
      if (
        savedAddress &&
        savedLocation &&
        savedLocationsSpecs &&
        savedcrmLocationSpecOptions
      ) {
        await queryRunner.commitTransaction();

        return resSuccess(
          'Account Created.',
          SuccessConstants.SUCCESS,
          HttpStatus.CREATED,
          {
            savedLocation,
            savedAddress,
            savedLocationsSpecs,
            savedcrmLocationSpecOptions,
            customFields: locationsCustomFieds,
          }
        );
      } else {
        return resError('data not saved', ErrorConstants.Error, 400);
      }
    } catch (error) {
      console.log({ error });
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async update(id: any, user: any, createLocationDto: LocationsDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const existing = await this.locationRepository.findOne({
        where: {
          id,
        },
      });

      if (!existing) {
        return resError('no data against this id', ErrorConstants.Error, 400);
      }

      const userId = user?.id;

      const nameAlreadyExist: CrmLocations =
        await this.locationRepository.findOne({
          where: {
            name: createLocationDto?.name,
          },
        });

      if (nameAlreadyExist?.id && nameAlreadyExist?.id !== id) {
        return resError('name already exist', ErrorConstants.Error, 400);
      }

      const existingCrmLocation: CrmLocations =
        await this.locationRepository.findOne({
          where: {
            id,
          },
          relations: ['site_contact_id'],
        });

      const locationCustomFieds = [];
      await saveCustomFields(
        this.customFieldsRepository,
        queryRunner,
        existingCrmLocation,
        user,
        user.tenant,
        createLocationDto,
        locationCustomFieds
      );
      await queryRunner.commitTransaction();
      const locationBeforeUpdate = { ...existingCrmLocation };
      const findVolunteer = await this.crmVolunteerRepository.findOneBy({
        id: createLocationDto?.site_contact_id,
      });
      existingCrmLocation.name =
        createLocationDto?.name ?? existingCrmLocation.name;
      existingCrmLocation.floor =
        createLocationDto?.floor ?? existingCrmLocation.floor;
      existingCrmLocation.room =
        createLocationDto?.room ?? existingCrmLocation.room;
      existingCrmLocation.room_phone =
        createLocationDto?.room_phone ?? existingCrmLocation.room_phone;
      existingCrmLocation.site_contact_id = createLocationDto?.site_contact_id
        ? findVolunteer
        : null;
      existingCrmLocation.becs_code =
        createLocationDto?.becs_code ?? existingCrmLocation.becs_code;
      existingCrmLocation.site_type =
        createLocationDto?.site_type ?? existingCrmLocation.site_type;
      existingCrmLocation.cross_street =
        createLocationDto?.cross_street ?? existingCrmLocation.cross_street;
      existingCrmLocation.is_active =
        createLocationDto?.is_active ?? existingCrmLocation.is_active;
      existingCrmLocation.is_archived =
        createLocationDto?.is_archived ?? existingCrmLocation.is_archived;
      existingCrmLocation.qualification_status =
        createLocationDto?.qualification_status ??
        existingCrmLocation.qualification_status;
      existingCrmLocation.tenant_id =
        user?.tenant?.id ?? existingCrmLocation.tenant_id;
      existingCrmLocation.is_active = createLocationDto.hasOwnProperty(
        'is_active'
      )
        ? createLocationDto?.is_active
        : existingCrmLocation?.is_active;

      const savedLocation = await this.locationRepository.update(
        { id },
        {
          ...existingCrmLocation,
        }
      );
      const history: any = new CrmLocationsHistory();
      history.name = locationBeforeUpdate?.name;
      history.id = locationBeforeUpdate?.id;
      history.floor = locationBeforeUpdate?.floor;
      history.room = locationBeforeUpdate?.room;
      history.history_reason = 'C';
      history.room_phone = locationBeforeUpdate?.room_phone;
      history.site_contact_id = locationBeforeUpdate?.site_contact_id?.id;
      history.becs_code = locationBeforeUpdate?.becs_code;
      history.site_type = locationBeforeUpdate?.site_type;
      history.cross_street = locationBeforeUpdate?.cross_street;
      history.is_active = locationBeforeUpdate?.is_active;
      history.is_archived = locationBeforeUpdate?.is_archived;
      history.tenant_id = user?.tenant?.id;
      history.created_by = userId;
      history.is_active = locationBeforeUpdate?.is_active;

      const savedHistoryLocation = await this.locationsHistoryRepository.save(
        history
      );

      const existingSpecLocation: CrmLocationsSpecs =
        await this.crmLocationsSpecs.findOne({
          relations: ['location_id', 'created_by', 'room_size_id'],
          where: {
            location_id: {
              id,
            },
          },
        });

      if (!existingSpecLocation) {
        return resError(
          'Error in find Existing SpecLocation',
          ErrorConstants.Error,
          400
        );
      }

      const specLocationBeforeUpdate = { ...existingSpecLocation };
      const findRoom = await this.roomSizeRepository.findOne({
        where: {
          id: createLocationDto?.room_size_id,
        },
      });
      existingSpecLocation.room_size_id = findRoom;
      existingSpecLocation.elevator =
        createLocationDto?.elevator ?? existingSpecLocation.elevator;
      existingSpecLocation.outside_stairs =
        createLocationDto?.outside_stairs !== undefined
          ? createLocationDto.outside_stairs
          : existingSpecLocation.outside_stairs;

      existingSpecLocation.inside_stairs =
        createLocationDto?.inside_stairs !== undefined
          ? createLocationDto.inside_stairs
          : existingSpecLocation.inside_stairs;

      existingSpecLocation.electrical_note =
        createLocationDto?.electrical_note !== undefined
          ? createLocationDto.electrical_note
          : existingSpecLocation.electrical_note;

      existingSpecLocation.special_instructions =
        createLocationDto?.special_instructions !== undefined
          ? createLocationDto.special_instructions
          : existingSpecLocation.special_instructions;
      existingSpecLocation.tenant_id =
        user?.tenant ?? existingSpecLocation.tenant_id;

      const savedSpecLocation = await this.crmLocationsSpecs.update(
        { location_id: id },
        {
          ...existingSpecLocation,
        }
      );

      const updateSpecLocationHistory: any = new CrmLocationsSpecsHistory();
      updateSpecLocationHistory.id = specLocationBeforeUpdate.id;
      updateSpecLocationHistory.location_id = id;
      updateSpecLocationHistory.room_size_id =
        specLocationBeforeUpdate?.room_size_id?.id;
      updateSpecLocationHistory.elevator = specLocationBeforeUpdate?.elevator;
      updateSpecLocationHistory.history_reason = 'C';
      updateSpecLocationHistory.outside_stairs =
        specLocationBeforeUpdate?.outside_stairs;
      updateSpecLocationHistory.inside_stairs =
        specLocationBeforeUpdate?.inside_stairs;
      updateSpecLocationHistory.electrical_note =
        specLocationBeforeUpdate?.electrical_note;
      updateSpecLocationHistory.special_instructions =
        specLocationBeforeUpdate?.special_instructions;
      updateSpecLocationHistory.created_by = userId;
      updateSpecLocationHistory.tenant_id = user?.tenant?.id;

      const savedSpecLocationHistory = await this.crmLocationsSpecsHistory.save(
        updateSpecLocationHistory
      );
      const findExistingSpecOptionLocation: any =
        await this.crmLocationsSpecsoptions.find({
          relations: ['location_specs_id', 'created_by', 'tenant_id'],
          where: {
            location_specs_id: {
              id: existingSpecLocation.id,
            },
          },
        });

      if (!createLocationDto?.specsData?.length) {
        return resError(
          'Spec options cannot be empty',
          ErrorConstants.Error,
          400
        );
      }

      const specOptionIds = findExistingSpecOptionLocation.map(
        (item: any) => item.id
      );
      // const specsOptionsCreated_by = findExistingSpecOptionLocation.map(
      //   (item: any) => item.created_by
      // );
      // const specsOptionsTenant_id = findExistingSpecOptionLocation.map(
      //   (item: any) => item.tenanat_id
      // );
      const removeOldSpecOptions = await this.crmLocationsSpecsoptions.delete({
        id: In(specOptionIds),
      });
      const arrModified: any = createLocationDto?.specsData.map((obj) => {
        const key = Object.keys(obj)[0];
        const value = obj[key];

        return {
          specs_key: key,
          specs_value: value,
          created_by: findExistingSpecOptionLocation[0]?.created_by,
          location_specs_id: existingSpecLocation.id,
          created_at: findExistingSpecOptionLocation[0]?.created_at,
          tenant_id:
            findExistingSpecOptionLocation[0]?.tenant_id?.id ??
            user?.tenant?.id,
        };
      });
      let savedcrmLocationSpecOptions: any;
      for (const obj of arrModified) {
        savedcrmLocationSpecOptions = await this.crmLocationsSpecsoptions.save({
          ...obj,
        });
      }
      const arrModifiedHistory: any = findExistingSpecOptionLocation.map(
        (obj) => {
          const key = obj.specs_key;
          const value = obj.specs_value;

          return {
            id: obj.id,
            specs_key: key,
            specs_value: value,
            created_by: user.id,
            location_specs_id: existingSpecLocation.id,
            history_reason: 'C',
            tenant_id: user?.tenant?.id,
          };
        }
      );

      let savedcrmLocationSpecOptionshistory: any;
      for (const obj of arrModifiedHistory) {
        savedcrmLocationSpecOptionshistory =
          await this.crmLocationsSpecsOptionsHistory.save({
            ...obj,
          });
      }

      const existingAddress: any = await this.addressRepository.findOne({
        where: {
          addressable_type: 'crm_locations',
          addressable_id: existing.id,
        },
      });

      if (!existingAddress) {
        return resError(
          'no address against this id',
          ErrorConstants.Error,
          400
        );
      }

      const addressBeforeUpdate = { ...existingAddress };

      if (createLocationDto?.address?.coordinates) {
        existingAddress.coordinates = `(${createLocationDto?.address?.coordinates?.latitude}, ${createLocationDto?.address?.coordinates?.longitude})`;
      }
      existingAddress.city =
        createLocationDto?.address?.city ?? existingAddress.city;
      existingAddress.state =
        createLocationDto?.address?.state ?? existingAddress.state;
      existingAddress.zip_code =
        createLocationDto?.address?.zip_code ?? existingAddress.zip_code;
      existingAddress.country =
        createLocationDto?.address?.country ?? existingAddress.country;
      existingAddress.address1 =
        createLocationDto?.address?.address1 ?? existingAddress.address1;
      existingAddress.address2 =
        createLocationDto?.address?.address2 ?? existingAddress.address2;
      existingAddress.county =
        createLocationDto?.address?.county ?? existingAddress.county;
      existingAddress.addressable_type = 'crm_locations';
      existingAddress.tenant_id =
        user?.tenant?.id ?? existingAddress?.tenant_id;

      const saveAddress = await this.addressRepository.save(existingAddress);

      if (
        savedLocation &&
        savedHistoryLocation &&
        savedSpecLocation &&
        savedSpecLocationHistory &&
        saveAddress &&
        savedcrmLocationSpecOptionshistory &&
        savedcrmLocationSpecOptions
      ) {
        return resSuccess(
          'record updated.',
          SuccessConstants.SUCCESS,
          HttpStatus.CREATED,
          {
            savedLocation,
            savedHistoryLocation,
            savedSpecLocation,
            savedSpecLocationHistory,
            saveAddress,
            savedcrmLocationSpecOptionshistory,
            savedcrmLocationSpecOptions,
          }
        );
      }

      return resError('Something went wrong', ErrorConstants.Error, 400);
    } catch (error) {
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getItemByid(id: any, user: any) {
    try {
      const location: CrmLocations = await this.locationRepository.findOne({
        where: {
          id: id,
          is_archived: false,
        },
        relations: ['created_by', 'site_contact_id', 'tenant_id'],
      });

      if (location) {
        const address: Address = await this.addressRepository.findOne({
          where: {
            addressable_id: location?.id,
            addressable_type: 'crm_locations',
          },
        });
        const specLocation = await this.crmLocationsSpecs.findOne({
          relations: ['location_id', 'room_size_id', 'tenant_id'],
          where: {
            location_id: {
              id: location?.id,
            },
          },
        });
        const modifiedData = await getModifiedDataDetails(
          this.locationsHistoryRepository,
          id,
          this.userRepository
        );
        const optionSpecLocation: any =
          await this.crmLocationsSpecsoptions.find({
            relations: ['location_specs_id', 'tenant_id'],
            where: {
              location_specs_id: {
                id: specLocation?.id,
              },
            },
          });
        if (address && specLocation && optionSpecLocation) {
          delete specLocation.id;
          const locations = { ...location, ...specLocation, ...modifiedData };
          return resSuccess(
            'Fetched Successfully',
            SuccessConstants.SUCCESS,
            HttpStatus.CREATED,
            { ...locations, address, optionSpecLocation }
          );
        } else {
          return resError(
            'No record belongs to this id',
            ErrorConstants.Error,
            400
          );
        }
      } else {
        return resError(
          'No record belongs to this id',
          ErrorConstants.Error,
          400
        );
      }
    } catch (error) {
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async Archive(id: any, user: any) {
    try {
      const existing = await this.locationRepository.findOne({
        where: {
          id,
        },
      });

      if (!existing) {
        return resError('no data against this id', ErrorConstants.Error, 400);
      }

      const userId = user?.id;

      const existingCrmLocation: any = await this.locationRepository.findOne({
        where: {
          id,
        },
        relations: ['site_contact_id', 'tenant_id'],
      });

      const locationBeforeUpdate = { ...existingCrmLocation };

      existingCrmLocation.name = existingCrmLocation.name;
      existingCrmLocation.floor = existingCrmLocation.floor;
      existingCrmLocation.room = existingCrmLocation.room;
      existingCrmLocation.room_phone = existingCrmLocation.room_phone;
      existingCrmLocation.site_contact_id = existingCrmLocation.site_contact_id;
      existingCrmLocation.becs_code = existingCrmLocation.becs_code;
      existingCrmLocation.site_type = existingCrmLocation.site_type;
      existingCrmLocation.cross_street = existingCrmLocation.cross_street;
      existingCrmLocation.is_active = existingCrmLocation.is_active;
      existingCrmLocation.is_archived = true;
      existingCrmLocation.qualification_status =
        existingCrmLocation.qualification_status;
      existingCrmLocation.tenant_id = existingCrmLocation.tenant_id.id;

      const savedLocation = await this.locationRepository.update(
        { id },
        {
          ...existingCrmLocation,
        }
      );

      const historyC: any = new CrmLocationsHistory();
      historyC.name = locationBeforeUpdate?.name;
      historyC.id = locationBeforeUpdate?.id;
      historyC.floor = locationBeforeUpdate?.floor;
      historyC.room = locationBeforeUpdate?.room;
      historyC.history_reason = 'C';
      historyC.room_phone = locationBeforeUpdate?.room_phone;
      historyC.site_contact_id = locationBeforeUpdate?.site_contact_id?.id;
      historyC.becs_code = locationBeforeUpdate?.becs_code;
      historyC.site_type = locationBeforeUpdate?.site_type;
      historyC.cross_street = locationBeforeUpdate?.cross_street;
      historyC.is_active = locationBeforeUpdate?.is_active;
      historyC.is_archived = true;
      historyC.created_by = userId;
      historyC.tenant_id = locationBeforeUpdate.tenant_id.id;

      const savedHistoryLocationC = await this.locationsHistoryRepository.save(
        historyC
      );
      const historyD: any = new CrmLocationsHistory();
      historyD.name = locationBeforeUpdate?.name;
      historyD.id = locationBeforeUpdate?.id;
      historyD.floor = locationBeforeUpdate?.floor;
      historyD.room = locationBeforeUpdate?.room;
      historyD.history_reason = 'C';
      historyD.room_phone = locationBeforeUpdate?.room_phone;
      historyD.site_contact_id = locationBeforeUpdate?.site_contact_id?.id;
      historyD.becs_code = locationBeforeUpdate?.becs_code;
      historyD.site_type = locationBeforeUpdate?.site_type;
      historyD.cross_street = locationBeforeUpdate?.cross_street;
      historyD.is_active = locationBeforeUpdate?.is_active;
      historyD.is_archived = true;
      historyD.created_by = userId;
      historyD.tenant_id = locationBeforeUpdate.tenant_id.id;

      const savedHistoryLocationD = await this.locationsHistoryRepository.save(
        historyD
      );

      const existingSpecLocation: any = await this.crmLocationsSpecs.findOne({
        relations: ['location_id', 'created_by', 'room_size_id', 'tenant_id'],
        where: {
          location_id: {
            id,
          },
        },
      });

      if (!existingSpecLocation) {
        return resError(
          'Error in find Existing SpecLocation',
          ErrorConstants.Error,
          400
        );
      }

      const specLocationBeforeUpdate = { ...existingSpecLocation };

      existingSpecLocation.room_size_id = existingSpecLocation.room_size_id;
      existingSpecLocation.elevator = existingSpecLocation.elevator;
      existingSpecLocation.outside_stairs = existingSpecLocation.outside_stairs;
      existingSpecLocation.inside_stairs = existingSpecLocation.inside_stairs;
      existingSpecLocation.electrical_note =
        existingSpecLocation.electrical_note;
      existingSpecLocation.special_instructions =
        existingSpecLocation.special_instructions;
      existingSpecLocation.is_archived = true;
      existingSpecLocation.tenant_id = existingSpecLocation.tenant_id.id;

      const savedSpecLocation = await this.crmLocationsSpecs.update(
        { location_id: id },
        {
          ...existingSpecLocation,
        }
      );

      const updateSpecLocationHistoryC: any = new CrmLocationsSpecsHistory();
      updateSpecLocationHistoryC.id = specLocationBeforeUpdate.id;
      updateSpecLocationHistoryC.location_id = id;
      updateSpecLocationHistoryC.room_size_id =
        specLocationBeforeUpdate?.room_size_id?.id;
      updateSpecLocationHistoryC.elevator = specLocationBeforeUpdate?.elevator;
      updateSpecLocationHistoryC.history_reason = 'C';
      updateSpecLocationHistoryC.outside_stairs =
        specLocationBeforeUpdate?.outside_stairs;
      updateSpecLocationHistoryC.inside_stairs =
        specLocationBeforeUpdate?.inside_stairs;
      updateSpecLocationHistoryC.electrical_note =
        specLocationBeforeUpdate?.electrical_note;
      updateSpecLocationHistoryC.special_instructions =
        specLocationBeforeUpdate?.special_instructions;
      updateSpecLocationHistoryC.created_by = userId;
      updateSpecLocationHistoryC.is_archived = true;
      updateSpecLocationHistoryC.tenant_id =
        specLocationBeforeUpdate?.tenant_id?.id;

      const savedSpecLocationHistoryC =
        await this.crmLocationsSpecsHistory.save(updateSpecLocationHistoryC);

      const updateSpecLocationHistoryD: any = new CrmLocationsSpecsHistory();
      updateSpecLocationHistoryD.id = specLocationBeforeUpdate.id;
      updateSpecLocationHistoryD.location_id = id;
      updateSpecLocationHistoryD.room_size_id =
        specLocationBeforeUpdate?.room_size_id?.id;
      updateSpecLocationHistoryD.elevator = specLocationBeforeUpdate?.elevator;
      updateSpecLocationHistoryD.history_reason = 'C';
      updateSpecLocationHistoryD.outside_stairs =
        specLocationBeforeUpdate?.outside_stairs;
      updateSpecLocationHistoryD.inside_stairs =
        specLocationBeforeUpdate?.inside_stairs;
      updateSpecLocationHistoryD.electrical_note =
        specLocationBeforeUpdate?.electrical_note;
      updateSpecLocationHistoryD.special_instructions =
        specLocationBeforeUpdate?.special_instructions;
      updateSpecLocationHistoryD.created_by = userId;
      updateSpecLocationHistoryD.is_archived = true;
      updateSpecLocationHistoryD.tenant_id =
        specLocationBeforeUpdate?.tenant_id?.id;

      const savedSpecLocationHistoryD =
        await this.crmLocationsSpecsHistory.save(updateSpecLocationHistoryD);

      const findExistingSpecOptionLocation: any =
        await this.crmLocationsSpecsoptions.find({
          relations: ['location_specs_id', 'created_by', 'tenant_id'],
          where: {
            location_specs_id: {
              id: existingSpecLocation.id,
            },
          },
        });
      const specOptionIds = findExistingSpecOptionLocation.map(
        (item: any) => item.id
      );

      const removeOldSpecOptions = await this.crmLocationsSpecsoptions.delete({
        id: In(specOptionIds),
      });

      const arrModified: any = findExistingSpecOptionLocation.map((obj) => {
        const key = obj.specs_key;
        const value = obj.specs_value;

        return {
          id: obj.id,
          specs_key: key,
          specs_value: value,
          created_by: user.id,
          location_specs_id: existingSpecLocation.id,
          is_archived: true,
          tenant_id: existingSpecLocation?.tenant_id,
        };
      });
      let savedcrmLocationSpecOptions: any;
      for (const obj of arrModified) {
        savedcrmLocationSpecOptions = await this.crmLocationsSpecsoptions.save({
          ...obj,
        });
      }

      const arrModifiedHistoryC: any = findExistingSpecOptionLocation.map(
        (obj) => {
          const key = obj.specs_key;
          const value = obj.specs_value;

          return {
            id: obj.id,
            specs_key: key,
            specs_value: value,
            created_by: user.id,
            location_specs_id: existingSpecLocation.id,
            history_reason: 'C',
            is_archived: true,
            tenant_id: existingSpecLocation?.tenant_id,
          };
        }
      );

      let savedcrmLocationSpecOptionshistoryC: any;
      for (const obj of arrModifiedHistoryC) {
        savedcrmLocationSpecOptionshistoryC =
          await this.crmLocationsSpecsOptionsHistory.save({
            ...obj,
          });
      }

      const arrModifiedHistoryD: any = findExistingSpecOptionLocation.map(
        (obj) => {
          const key = obj.specs_key;
          const value = obj.specs_value;

          return {
            id: obj.id,
            specs_key: key,
            specs_value: value,
            created_by: user.id,
            location_specs_id: existingSpecLocation.id,
            history_reason: 'D',
            is_archived: true,
            tenant_id: existingSpecLocation?.tenant_id,
          };
        }
      );

      let savedcrmLocationSpecOptionshistoryD: any;
      for (const obj of arrModifiedHistoryD) {
        savedcrmLocationSpecOptionshistoryD =
          await this.crmLocationsSpecsOptionsHistory.save({
            ...obj,
          });
      }

      const existingAddress: any = await this.addressRepository.findOne({
        where: {
          addressable_type: 'crm_locations',
          addressable_id: existing.id,
        },
      });

      if (!existingAddress) {
        return resError(
          'no address against this id',
          ErrorConstants.Error,
          400
        );
      }

      if (
        savedLocation &&
        savedHistoryLocationC &&
        savedHistoryLocationD &&
        savedSpecLocation &&
        savedSpecLocationHistoryC &&
        savedSpecLocationHistoryD &&
        savedcrmLocationSpecOptionshistoryC &&
        savedcrmLocationSpecOptionshistoryD &&
        savedcrmLocationSpecOptions
      ) {
        return resSuccess(
          'record updated.',
          SuccessConstants.SUCCESS,
          HttpStatus.CREATED,
          {
            savedLocation,
            savedHistoryLocationC,
            savedHistoryLocationD,
            savedSpecLocation,
            savedSpecLocationHistoryC,
            savedSpecLocationHistoryD,
            savedcrmLocationSpecOptionshistoryC,
            savedcrmLocationSpecOptionshistoryD,
            savedcrmLocationSpecOptions,
          }
        );
      }

      return resError('Something went wrong', ErrorConstants.Error, 400);
    } catch (error) {
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async processDataWithCount(
    data,
    countData,
    userId,
    params,
    addressRepository
  ) {
    const array = data.map((res) => res.id);
    const countArray = countData.map((countData) => countData.id);

    let newData = data;
    let newCountData = countData;

    if (params.city || params.state || params.country || params.county) {
      newData = await addressExtractionFilter(
        'crm_locations',
        array,
        newData,
        userId,
        params.city ?? null,
        params.state ?? null,
        params.country ?? null,
        addressRepository,
        params.county ?? null
      );
      newCountData = await addressExtractionFilter(
        'crm_locations',
        countArray,
        newCountData,
        userId,
        params.city ?? null,
        params.state ?? null,
        params.country ?? null,
        addressRepository,
        params.county ?? null
      );
    } else {
      newData = await addressExtractionFilter(
        'crm_locations',
        array,
        newData,
        userId,
        null,
        null,
        null,
        addressRepository,
        null
      );
      newCountData = await addressExtractionFilter(
        'crm_locations',
        countArray,
        newCountData,
        userId,
        null,
        null,
        null,
        addressRepository,
        null
      );
    }

    return { newData, newCountData };
  }

  async driveHistory(id, params: GetDrivesHistoryQuery, user) {
    try {
      const { limit = parseInt(process.env.PAGE_SIZE), page = 1 } = params;

      const query = this.locationRepository
        .createQueryBuilder('locations')
        .select([
          'locations.id', // Select the account id
          `(SELECT JSON_BUILD_OBJECT(
          'id', drives.id,
          'date', drives.date,
          'oef_products', drives.oef_products,
          'oef_procedures', drives.oef_procedures,
          'operation_status', (
            SELECT JSON_BUILD_OBJECT(
              'id', os.id,
              'name', os.name,
              'description', os.description,
              'chip_color', os.chip_color
            )
            FROM operations_status os
            WHERE os.id = drives.operation_status_id
          ),
          'shifts', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'shiftable_type', shifts.shiftable_type,
                'start_time', shifts.start_time,
                'end_time', shifts.end_time,
                'shift_slots', (SELECT JSON_AGG(JSON_BUILD_OBJECT(
                  'shift_id', slot.shift_id,
                  'procedure_type_id', slot.procedure_type_id,
                  'start_time', slot.start_time,
                  'end_time', slot.end_time
                ))
                FROM shifts_slots slot
                WHERE slot.shift_id = shifts.id),
                'projections', (
                  SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                      'procedure_type_id', projections.procedure_type_id,
                      'staff_setup_id', projections.staff_setup_id,
                      'product_yield', projections.product_yield,
                      'procedure_type_qty', projections.procedure_type_qty,
                      'donor_donations', (
                        SELECT JSON_AGG(
                          JSON_BUILD_OBJECT(
                            'id', dd.id,
                            'donation_type', dd.donation_type,
                            'donation_date', dd.donation_date,
                            'donation_status', dd.donation_status,
                            'drive_id', dd.drive_id,
                            'next_eligibility_date', dd.next_eligibility_date,
                            'donation_ytd', dd.donation_ytd,
                            'donation_ltd', dd.donation_ltd,
                            'donation_last_year', dd.donation_last_year,
                            'points', dd.points,
                            'is_archived', dd.is_archived
                          )
                        )
                        FROM donors_donations dd
                        WHERE dd.donation_type = projections.procedure_type_id AND dd.drive_id = drives.id
                      ),
                      'procedure_type', (
                        SELECT JSON_BUILD_OBJECT(
                          'id', pt.id,
                          'name', pt.name,
                          'short_description', pt.short_description,
                          'description', pt.description,
                          'is_goal_type', pt.is_goal_type,
                          'is_archive', pt.is_archive,
                          'products', (
                            SELECT JSON_AGG(
                              JSON_BUILD_OBJECT(
                                'id', prod.id,
                                'name', prod.name,
                                'description', prod.description
                              )
                            )
                            FROM procedure_types_products ptp
                            JOIN products prod ON ptp.product_id = prod.id
                            WHERE ptp.procedure_type_id = projections.procedure_type_id
                          ),
                          'procedure_duration', pt.procedure_duration,
                          'is_generate_online_appointments', pt.is_generate_online_appointments,
                          'is_active', pt.is_active
                        )
                        FROM procedure_types pt
                        WHERE pt.id = projections.procedure_type_id
                      )
                    )
                  )
                  FROM shifts_projections_staff projections
                  WHERE projections.shift_id = shifts.id
                )
              )
            )
            FROM shifts
            WHERE shifts.shiftable_type = 'drives' AND shifts.shiftable_id = drives.id
          ),
          'donor_donations', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', dd.id,
                'donation_type', dd.donation_type,
                'donation_date', dd.donation_date,
                'donation_status', dd.donation_status,
                'drive_id', dd.drive_id,
                'next_eligibility_date', dd.next_eligibility_date,
                'donation_ytd', dd.donation_ytd,
                'donation_ltd', dd.donation_ltd,
                'donation_last_year', dd.donation_last_year,
                'points', dd.points,
                'is_archived', dd.is_archived
              )
            )
            FROM donors_donations dd
            WHERE dd.drive_id = drives.id
          ),
          'appointment_count', (
            SELECT COUNT(da.id)
            FROM donors_appointments da
            WHERE da.appointmentable_id = drives.id
            AND da.appointmentable_type = 'drives'
          ),
          'donor_appointments', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', da.id,
                'appointmentable_id', da.appointmentable_id,
                'appointmentable_type', da.appointmentable_type,
                'donor_id', da.donor_id,
                'slot_id', da.slot_id,
                'procedure_type_id', da.procedure_type_id,
                'status', da.status,
                'slot', (
                  SELECT JSON_BUILD_OBJECT(
                    'shift_id', slot.shift_id,
                    'procedure_type_id', slot.procedure_type_id,
                    'start_time', slot.start_time,
                    'end_time', slot.end_time
                  )
                  FROM shifts_slots slot
                  WHERE slot.id = da.slot_id
                )
              )
            )
            FROM donors_appointments da
            WHERE da.appointmentable_id = drives.id
            AND da.appointmentable_type = 'drives'
          )
        )
        FROM drives drive WHERE drive.id = drives.id
        ) AS "drives"`, // Subquery for Drives with Shifts
        ])
        .leftJoin('locations.drives', 'drives')
        .where(`drives.is_archived = false`)
        .andWhere(`locations.id = ${id}`);

      if (params.status != '') {
        query.andWhere(`drives.operation_status.id = ${params.status}`);
      }

      if (params.start_date != '' && params.end_date != '') {
        query.andWhere(
          `drives.date BETWEEN '${moment(params.start_date).format(
            'MM-DD-YYYY'
          )}' AND '${moment(params.end_date).format('MM-DD-YYYY')}'`
        );
      }

      const queryCount = query.getQuery();
      query.offset((page - 1) * limit).limit(limit);

      const dataCount = await this.locationRepository.query(queryCount);

      const projection =
        params?.view_as === 'products' ? 'product_yield' : 'procedure_type_qty';
      const oef =
        params?.view_as === 'products' ? 'oef_products' : 'oef_procedures';
      const quertAg = this.locationRepository
        .createQueryBuilder('locations')
        .leftJoin('locations.drives', 'drives')
        .innerJoin('drives.operation_status', 'os', `os.is_archived = false`)
        .leftJoinAndSelect(
          'donors_donations',
          'dd',
          'dd.drive_id = drives.id AND (dd.is_archived = false)'
        )
        .leftJoinAndSelect(
          'donors_appointments',
          'da',
          `da.appointmentable_id = drives.id AND (appointmentable_type = 'drives' AND da.is_archived = false)`
        )
        .leftJoinAndSelect(
          'shifts',
          'shifts',
          `shifts.shiftable_type = 'drives' AND shifts.shiftable_id = drives.id AND shifts.is_archived = false`
        )
        .leftJoinAndSelect(
          'shifts_projections_staff',
          'projections',
          `projections.shift_id = shifts.id AND (projections.is_archived = false)`
        )
        .leftJoinAndSelect(
          'shifts_slots',
          'slots',
          'slots.shift_id = shifts.id AND (slots.is_archived = false)'
        )
        .select([
          `COUNT(dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Deferred_At_Phlebotomy_020}, ${DonationStatusEnum.Deferred_Post_Defer_030})) AS deferrals`,
          `COUNT(dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Technically_Unsuable_015})) AS qns`,
          `COUNT(dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Donor_Left_012})) AS walkouts`,
          `COUNT(dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Post_Draw_Deferral_025})) AS void`,
          `SUM(DISTINCT projections.${projection}) AS projection`,
          `COUNT(DISTINCT dd.id) AS registered`,
          `COUNT(DISTINCT dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Donated_010}, ${DonationStatusEnum.Technically_Unsuable_015}, ${DonationStatusEnum.Deferred_At_Phlebotomy_020}, ${DonationStatusEnum.Deferred_Post_Defer_030}, ${DonationStatusEnum.Post_Draw_Deferral_025})) AS performed`,
          `COUNT(DISTINCT dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Donated_010}, ${DonationStatusEnum.Technically_Unsuable_015}, ${DonationStatusEnum.Post_Draw_Deferral_025})) AS actual`,
          `ROUND(((COUNT(DISTINCT dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Donated_010}, ${DonationStatusEnum.Technically_Unsuable_015}, ${DonationStatusEnum.Post_Draw_Deferral_025}))::numeric) / (SUM(DISTINCT projections.${projection}))::numeric) * 100, 2) as pa`,
          `COUNT(DISTINCT da.id) AS appointment`,
          `drives.${oef} AS oef`,
          `COUNT(dd.id) FILTER (WHERE dd.donation_date IS NULL) AS ftd`,
          `COUNT(DISTINCT "shifts"."id") AS noOfshifts`,
          `os.name AS status`,
        ])
        .addSelect([`drives.date AS date`])
        .addSelect([`drives.id AS driveid`])
        .where(`drives.location_id =${id} AND drives.is_archived = false`)
        .groupBy('drives.id')
        .addGroupBy('os.name')
        .orderBy({ 'drives.created_at': 'DESC' });

      let sortBy = 'drives.id';
      let sortingOrder = params?.sortOrder.toUpperCase() as 'ASC' | 'DESC';
      if (params?.sortName) {
        if (params?.sortName == 'date') {
          sortBy = 'drives.date';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'appointment') {
          sortBy = 'appointment';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'projection') {
          sortBy = 'projection';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'registered') {
          sortBy = 'registered';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'performed') {
          sortBy = 'performed';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'actual') {
          sortBy = 'actual';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (params?.sortName == 'deferrals') {
          sortBy = 'deferrals';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (params?.sortName == 'qns') {
          sortBy = 'qns';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (params?.sortName == 'ftd') {
          sortBy = 'ftd';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (params?.sortName == 'walkouts') {
          sortBy = 'walkouts';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'void') {
          sortBy = 'void';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'noofshifts') {
          sortBy = 'noofshifts';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'status') {
          sortBy = 'status';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (params?.sortName == 'pa') {
          sortBy = 'pa';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }
      } else {
        sortBy = 'drives.id';
        sortingOrder = 'DESC';
      }

      if (params.status != '') {
        quertAg.andWhere(`drives.operation_status.id = ${params.status}`);
      }

      if (params.start_date != '' && params.end_date != '') {
        quertAg.andWhere(
          `drives.date BETWEEN '${moment(params.start_date).format(
            'MM-DD-YYYY'
          )}' AND '${moment(params.end_date).format('MM-DD-YYYY')}'`
        );
      }
      quertAg.offset((page - 1) * limit).limit(limit);

      quertAg.orderBy(sortBy, sortingOrder);

      const result = await this.entityManager.query(quertAg.getQuery());
      return {
        status: HttpStatus.OK,
        response: 'Drive history fetched.',
        count: dataCount?.length ? dataCount?.length : 0,
        result,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async driveHistoryDetail(id, params: GetDrivesHistoryQuery, user, driveId) {
    try {
      const { limit = parseInt(process.env.PAGE_SIZE), page = 1 } = params;
      const query = this.locationRepository
        .createQueryBuilder('locations')
        .select([
          'locations.id', // Select the account id
          `(SELECT JSON_BUILD_OBJECT(
          'id', drives.id,
          'date', drives.date,
          'oef_products', drives.oef_products,
          'oef_procedures', drives.oef_procedures,
          'operation_status', (
            SELECT JSON_BUILD_OBJECT(
              'id', os.id,
              'name', os.name,
              'description', os.description,
              'chip_color', os.chip_color
            )
            FROM operations_status os
            WHERE os.id = drives.operation_status_id
          ),
          'shifts', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'shiftable_type', shifts.shiftable_type,
                'start_time', shifts.start_time,
                'end_time', shifts.end_time,
                'shift_slots', (SELECT JSON_AGG(JSON_BUILD_OBJECT(
                  'shift_id', slot.shift_id,
                  'procedure_type_id', slot.procedure_type_id,
                  'start_time', slot.start_time,
                  'end_time', slot.end_time
                ))
                FROM shifts_slots slot
                WHERE slot.shift_id = shifts.id),
                'projections', (
                  SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                      'procedure_type_id', projections.procedure_type_id,
                      'staff_setup_id', projections.staff_setup_id,
                      'product_yield', projections.product_yield,
                      'procedure_type_qty', projections.procedure_type_qty,
                      'donor_donations', (
                        SELECT JSON_AGG(
                          JSON_BUILD_OBJECT(
                            'id', dd.id,
                            'donation_type', dd.donation_type,
                            'donation_date', dd.donation_date,
                            'donation_status', dd.donation_status,
                            'drive_id', dd.drive_id,
                            'next_eligibility_date', dd.next_eligibility_date,
                            'donation_ytd', dd.donation_ytd,
                            'donation_ltd', dd.donation_ltd,
                            'donation_last_year', dd.donation_last_year,
                            'points', dd.points,
                            'is_archived', dd.is_archived
                          )
                        )
                        FROM donors_donations dd
                        WHERE dd.donation_type = projections.procedure_type_id AND dd.drive_id = drives.id
                      ),
                      'procedure_type', (
                        SELECT JSON_BUILD_OBJECT(
                          'id', pt.id,
                          'name', pt.name,
                          'short_description', pt.short_description,
                          'description', pt.description,
                          'is_goal_type', pt.is_goal_type,
                          'is_archive', pt.is_archive,
                          'products', (
                            SELECT JSON_AGG(
                              JSON_BUILD_OBJECT(
                                'id', prod.id,
                                'name', prod.name,
                                'description', prod.description
                              )
                            )
                            FROM procedure_types_products ptp
                            JOIN products prod ON ptp.product_id = prod.id
                            WHERE ptp.procedure_type_id = projections.procedure_type_id
                          ),
                          'procedure_duration', pt.procedure_duration,
                          'is_generate_online_appointments', pt.is_generate_online_appointments,
                          'is_active', pt.is_active
                        )
                        FROM procedure_types pt
                        WHERE pt.id = projections.procedure_type_id
                      )
                    )
                  )
                  FROM shifts_projections_staff projections
                  WHERE projections.shift_id = shifts.id
                )
              )
            )
            FROM shifts
            WHERE shifts.shiftable_type = 'drives' AND shifts.shiftable_id = drives.id
          ),
          'donor_donations', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', dd.id,
                'donation_type', dd.donation_type,
                'donation_date', dd.donation_date,
                'donation_status', dd.donation_status,
                'drive_id', dd.drive_id,
                'next_eligibility_date', dd.next_eligibility_date,
                'donation_ytd', dd.donation_ytd,
                'donation_ltd', dd.donation_ltd,
                'donation_last_year', dd.donation_last_year,
                'points', dd.points,
                'is_archived', dd.is_archived
              )
            )
            FROM donors_donations dd
            WHERE dd.drive_id = drives.id
          ),
          'appointment_count', (
            SELECT COUNT(da.id)
            FROM donors_appointments da
            WHERE da.appointmentable_id = drives.id
            AND da.appointmentable_type = 'drives'
          ),
          'donor_appointments', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', da.id,
                'appointmentable_id', da.appointmentable_id,
                'appointmentable_type', da.appointmentable_type,
                'donor_id', da.donor_id,
                'slot_id', da.slot_id,
                'procedure_type_id', da.procedure_type_id,
                'status', da.status,
                'slot', (
                  SELECT JSON_BUILD_OBJECT(
                    'shift_id', slot.shift_id,
                    'procedure_type_id', slot.procedure_type_id,
                    'start_time', slot.start_time,
                    'end_time', slot.end_time
                  )
                  FROM shifts_slots slot
                  WHERE slot.id = da.slot_id
                )
              )
            )
            FROM donors_appointments da
            WHERE da.appointmentable_id = drives.id
            AND da.appointmentable_type = 'drives'
          )
        )
        FROM drives drive WHERE drive.id = drives.id
        ) AS "drives"`, // Subquery for Drives with Shifts
        ])
        .leftJoin('locations.drives', 'drives')
        .where(`drives.is_archived = false AND drives.id = ${driveId}`)
        .andWhere(`locations.id = ${id}`);

      query.offset((page - 1) * limit).limit(limit);

      const queryList = query.getQuery();

      const data = await this.locationRepository.query(queryList);

      return {
        status: HttpStatus.OK,
        response: 'Drive history fetched.',
        data,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async driveHistoryKPI(id) {
    try {
      const query = this.locationRepository
        .createQueryBuilder('locations')
        .select([
          'locations.id', // Select the account id
          `(SELECT JSON_BUILD_OBJECT(
          'id', drives.id,
          'date', drives.date,
          'oef_products', drives.oef_products,
          'oef_procedures', drives.oef_procedures,
          'operation_status', (
            SELECT JSON_BUILD_OBJECT(
              'id', os.id,
              'name', os.name,
              'description', os.description,
              'chip_color', os.chip_color
            )
            FROM operations_status os
            WHERE os.id = drives.operation_status_id
          ),
          'shifts', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'shiftable_type', shifts.shiftable_type,
                'start_time', shifts.start_time,
                'end_time', shifts.end_time,
                'shift_slots', (SELECT JSON_AGG(JSON_BUILD_OBJECT(
                  'shift_id', slot.shift_id,
                  'procedure_type_id', slot.procedure_type_id,
                  'start_time', slot.start_time,
                  'end_time', slot.end_time
                ))
                FROM shifts_slots slot
                WHERE slot.shift_id = shifts.id),
                'projections', (
                  SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                      'procedure_type_id', projections.procedure_type_id,
                      'staff_setup_id', projections.staff_setup_id,
                      'product_yield', projections.product_yield,
                      'procedure_type_qty', projections.procedure_type_qty,
                      'donor_donations', (
                        SELECT JSON_AGG(
                          JSON_BUILD_OBJECT(
                            'id', dd.id,
                            'donation_type', dd.donation_type,
                            'donation_date', dd.donation_date,
                            'donation_status', dd.donation_status,
                            'drive_id', dd.drive_id,
                            'next_eligibility_date', dd.next_eligibility_date,
                            'donation_ytd', dd.donation_ytd,
                            'donation_ltd', dd.donation_ltd,
                            'donation_last_year', dd.donation_last_year,
                            'points', dd.points,
                            'is_archived', dd.is_archived
                          )
                        )
                        FROM donors_donations dd
                        WHERE dd.donation_type = projections.procedure_type_id AND dd.drive_id = drives.id
                      ),
                      'procedure_type', (
                        SELECT JSON_BUILD_OBJECT(
                          'id', pt.id,
                          'name', pt.name,
                          'short_description', pt.short_description,
                          'description', pt.description,
                          'is_goal_type', pt.is_goal_type,
                          'is_archive', pt.is_archive,
                          'products', (
                            SELECT JSON_AGG(
                              JSON_BUILD_OBJECT(
                                'id', prod.id,
                                'name', prod.name,
                                'description', prod.description
                              )
                            )
                            FROM procedure_types_products ptp
                            JOIN products prod ON ptp.product_id = prod.id
                            WHERE ptp.procedure_type_id = projections.procedure_type_id
                          ),
                          'procedure_duration', pt.procedure_duration,
                          'is_generate_online_appointments', pt.is_generate_online_appointments,
                          'is_active', pt.is_active
                        )
                        FROM procedure_types pt
                        WHERE pt.id = projections.procedure_type_id
                      )
                    )
                  )
                  FROM shifts_projections_staff projections
                  WHERE projections.shift_id = shifts.id
                )
              )
            )
            FROM shifts
            WHERE shifts.shiftable_type = 'drives' AND shifts.shiftable_id = drives.id
          ),
          'donor_donations', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', dd.id,
                'donation_type', dd.donation_type,
                'donation_date', dd.donation_date,
                'donation_status', dd.donation_status,
                'drive_id', dd.drive_id,
                'next_eligibility_date', dd.next_eligibility_date,
                'donation_ytd', dd.donation_ytd,
                'donation_ltd', dd.donation_ltd,
                'donation_last_year', dd.donation_last_year,
                'points', dd.points,
                'is_archived', dd.is_archived
              )
            )
            FROM donors_donations dd
            WHERE dd.drive_id = drives.id
          ),
          'appointment_count', (
            SELECT COUNT(da.id)
            FROM donors_appointments da
            WHERE da.appointmentable_id = drives.id
            AND da.appointmentable_type = 'drives'
          ),
          'donor_appointments', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', da.id,
                'appointmentable_id', da.appointmentable_id,
                'appointmentable_type', da.appointmentable_type,
                'donor_id', da.donor_id,
                'slot_id', da.slot_id,
                'procedure_type_id', da.procedure_type_id,
                'status', da.status,
                'slot', (
                  SELECT JSON_BUILD_OBJECT(
                    'shift_id', slot.shift_id,
                    'procedure_type_id', slot.procedure_type_id,
                    'start_time', slot.start_time,
                    'end_time', slot.end_time
                  )
                  FROM shifts_slots slot
                  WHERE slot.id = da.slot_id
                )
              )
            )
            FROM donors_appointments da
            WHERE da.appointmentable_id = drives.id
            AND da.appointmentable_type = 'drives'
          )
        )
        FROM drives drive WHERE drive.id = drives.id
        ) AS "drives"`, // Subquery for Drives with Shifts
        ])
        .leftJoin('locations.drives', 'drives')
        .where(`drives.is_archived = false`)
        .andWhere(`locations.id = ${id}`)
        .limit(4)
        .getQuery();
      const dataKPI = await this.locationRepository.query(query);

      return {
        status: HttpStatus.OK,
        response: 'Drive history fetched.',
        dataKPI,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
