import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common/decorators';
import { DrivesService } from 'src/api/operations-center/operations/drives/service/drives.service';
import { Drives } from 'src/api/operations-center/operations/drives/entities/drives.entity';
import { Accounts } from '../entities/accounts.entity';
import { AccountContacts } from '../entities/accounts-contacts.entity';
import { AccountContactsHistory } from '../entities/accounts-contacts-history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { HttpStatus } from '@nestjs/common';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { Facility } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/facilities/entity/facility.entity';
import { DrivesMarketingMaterialItems } from 'src/api/operations-center/operations/drives/entities/drives-marketing-material-items.entity';
import { DrivesPromotionalItems } from 'src/api/operations-center/operations/drives/entities/drives_promotional_items.entity';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { PolymorphicType } from 'src/api/common/enums/polymorphic-type.enum';
import { MarketingMaterials } from 'src/api/system-configuration/tenants-administration/operations-administration/marketing-equipment/marketing-material/entities/marketing-material.entity';
import { PromotionalItems } from 'src/api/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotional-items/entities/promotional-item.entity';
import * as _ from 'lodash';
import { addressExtractionFilter } from 'src/api/common/services/addressExtraction.service';
import { DrivesZipCodes } from 'src/api/operations-center/operations/drives/entities/drives-zipcodes.entity';
import { CreateDriveAccountsDto } from '../dto/accounts-contact.dto';
import { DrivesDonorCommunicationSupplementalAccounts } from 'src/api/operations-center/operations/drives/entities/drives-donor-comms-supp-accounts.entity';
dotenv.config();

@Injectable()
export class AccountsBluePrintsService {
  constructor(
    @InjectRepository(Accounts)
    private readonly accountRepository: Repository<Accounts>,
    @InjectRepository(AccountContacts)
    private readonly accountContactsRepository: Repository<AccountContacts>,
    @InjectRepository(AccountContactsHistory)
    private readonly accountsContactHistoryRepository: Repository<AccountContactsHistory>,
    @InjectRepository(Drives)
    private readonly drivesRepository: Repository<Drives>,
    @InjectRepository(DrivesDonorCommunicationSupplementalAccounts)
    private readonly drivesDonorCommunicationSupplementalAccounts: Repository<DrivesDonorCommunicationSupplementalAccounts>,
    @InjectRepository(Shifts)
    private readonly shiftsRepository: Repository<Shifts>,
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
    @InjectRepository(DrivesMarketingMaterialItems)
    private readonly driveMarketingMaterialItemsRepository: Repository<DrivesMarketingMaterialItems>,
    @InjectRepository(DrivesPromotionalItems)
    private readonly drivePromotionalItemsRepository: Repository<DrivesPromotionalItems>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(MarketingMaterials)
    private readonly marketingMaterialRepository: Repository<MarketingMaterials>,
    @InjectRepository(PromotionalItems)
    private readonly promotionalRepository: Repository<PromotionalItems>,
    @InjectRepository(DrivesZipCodes)
    private readonly driveZipCodesRepository: Repository<DrivesZipCodes>
  ) {}
  async findAllWithFilters(user: any, account_id, queryParams) {
    try {
      console.log({ queryParams });
      if (!user && !account_id) {
        return resError(
          'user and account_id is required',
          ErrorConstants.Error,
          400
        );
      }
      console.log({ account_id });
      const getData = await this.drivesRepository.findOne({
        where: {
          account: {
            id: account_id,
          },
        },
        relations: ['account'],
      });
      console.log({ getData });
      if (!getData) {
        return resError(
          'no account exist against this id',
          ErrorConstants.Error,
          400
        );
      }
      //      queryParams: {
      //   page: '1',
      //   limit: '10',
      //   sortOrder: 'ASC',
      //   sortName: 'blueprint_name'
      // }
      let sortOrder = queryParams?.sortOrder;
      let sortName = queryParams?.sortName;
      if (sortName) {
        if (sortName == 'blueprint_name') {
          sortName = `(SELECT CONCAT(account.name, ' ', crm_locations.name) from accounts WHERE accounts.id = drives.account_id AND accounts.id = ${account_id})`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'location') {
          sortName = `(SELECT address.address2 
            FROM address
            JOIN crm_locations ON crm_locations.id = drives.location_id
            WHERE address.addressable_id = crm_locations.id 
              AND address.addressable_type = 'crm_locations' 
              AND crm_locations.id = drives.location_id 
              AND drives.account_id = ${account_id})`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'hours') {
          sortName = `(SELECT MIN(start_time) FROM shifts WHERE shifts.shiftable_id = drives.id AND shifts.shiftable_type = 'drives' AND drives.account_id = ${account_id})`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'procedures') {
          sortName = `(SELECT COUNT(procedure.name) FROM procedure JOIN procedures_products ON procedure.id = procedures_products.procedures_id JOIN shifts_projections_staff ON procedures_products.procedures_id = shifts_projections_staff.procedure_type_id JOIN shifts ON shifts_projections_staff.shift_id = shifts.id WHERE shifts.shiftable_id = drives.id AND shifts.shiftable_type = 'drives' AND drives.account_id = ${account_id})`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'products') {
          sortName = `(SELECT COUNT(products.name) FROM products JOIN procedures_products ON products.id = procedures_products.product_id JOIN shifts_projections_staff ON procedures_products.procedures_id = shifts_projections_staff.procedure_type_id JOIN shifts ON shifts_projections_staff.shift_id = shifts.id WHERE shifts.shiftable_id = drives.id AND shifts.shiftable_type = 'drives' AND drives.account_id = ${account_id})`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'status') {
          sortName = 'drives.is_active';
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
      } else {
        sortName = 'drives.id';
        sortOrder = 'DESC';
      }
      console.log('queryParams?.status', queryParams?.status);
      const query = await this.drivesRepository
        .createQueryBuilder('drives')

        .addSelect(
          `(
                SELECT JSON_AGG( JSON_BUILD_OBJECT(
                    'start_time',shifts.start_time,
                    'end_time',shifts.end_time,
                    'id',shifts.id,
                    'qty', (
                      SELECT JSON_AGG(JSON_BUILD_OBJECT(
                        'product_yield', shifts_projections_staff.product_yield,
                        'procedure_type_qty', shifts_projections_staff.procedure_type_qty
                      ))
                      FROM shifts_projections_staff
                      WHERE shifts_projections_staff.shift_id = shifts.id
                      AND  shifts.shiftable_id = drives.id
                      AND shifts.shiftable_type = 'drives'
                      AND drives.account_id = ${account_id}
                    )
                )) FROM shifts where shifts.shiftable_id = drives.id
                AND shifts.shiftable_type = 'drives'  
                AND drives.account_id = ${account_id}
                )`,
          'shifts'
        )
        // .addSelect(
        //   `(
        //         SELECT JSON_AGG( JSON_BUILD_OBJECT(

        //             'procedure_type_qty',shifts_projections_staff.procedure_type_qty
        //         )) FROM shifts_projections_staff , shifts , drives where shifts_projections_staff.shift_id = shifts.id AND shifts.shiftable_id = drives.id
        //         AND shifts.shiftable_type = 'drives'
        //         AND drives.account_id = ${account_id}
        //         )`,
        //   'shifts_projections_staff'
        // )
        .addSelect(
          `(
          SELECT JSON_BUILD_OBJECT(
            'id', crm_locations.id,
            'created_at', crm_locations.created_at,
            'is_archived', crm_locations.is_archived,
            'name', crm_locations.name,
            'cross_street', crm_locations.cross_street,
            'floor', crm_locations.floor,
            'room', crm_locations.room,
            'room_phone', crm_locations.room_phone,
            'becs_code', crm_locations.becs_code,
            'site_type', crm_locations.site_type,
            'qualification_status', crm_locations.qualification_status,
            'is_active', crm_locations.is_active,
            'address', (SELECT JSON_BUILD_OBJECT(
              'address1', address.address1,
              'address2', address.address2
            ) FROM address WHERE address.addressable_type = 'crm_locations' AND address.addressable_id = crm_locations.id)
          )
          FROM crm_locations
          JOIN accounts ON accounts.id = drives.account_id
          WHERE crm_locations.id = drives.location_id
          AND accounts.id = ${account_id}
        )`,
          'crm_locations'
        )
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT(
              'id', account.id,
              'name', account.name,
              'alternate_name', account.alternate_name,
              'phone', account.phone,
              'website', account.website,
              'facebook', account.facebook,
              'industry_category', account.industry_category,
              'industry_subcategory', account.industry_subcategory,
              'stage', account.stage,
              'source', account.source,
              'collection_operation', account.collection_operation,
              'recruiter', account.recruiter,
              'territory', account.territory,
              'population', account.population,
              'is_active', account.is_active,
              'RSMO', account."RSMO"
            ) FROM accounts WHERE accounts.id = drives.account_id)`,
          'account'
        )

        .addSelect(`drives.is_active`, 'is_active')
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT(
              'product_count', (
                  SELECT COUNT( products.name)

              )
          )  FROM products
                  JOIN procedures_products ON products.id = procedures_products.product_id
                  JOIN shifts_projections_staff ON procedures_products.procedures_id = shifts_projections_staff.procedure_type_id
                  JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
                  WHERE shifts.shiftable_id = drives.id
                   AND drives.account_id = ${account_id}
                  AND shifts.shiftable_type = 'drives'
          )`,
          'Products'
        )
        .addSelect(
          `(SELECT JSON_AGG(JSON_BUILD_OBJECT(
            'name',procedure_types.name
                    )
                )
                FROM procedure_types
                  JOIN procedure_types_products ON procedure_types.id = procedure_types_products.procedure_type_id
                  JOIN shifts_projections_staff ON procedure_types_products.procedure_type_id = shifts_projections_staff.procedure_type_id
                  JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
                  WHERE shifts.shiftable_id = drives.id
                  AND drives.account_id = ${account_id}
                  AND shifts.shiftable_type = 'drives'
              ) `,
          'Procedures'
        )

        .leftJoin('drives.account', 'account', `account.id = ${account_id}`)
        .leftJoin('drives.location', 'crm_locations')
        .where(
          `drives.is_archived = false AND drives.is_blueprint = true AND is_default_blueprint = false AND drives.account_id = ${account_id}`
        )
        .andWhere(
          queryParams?.keyword !== undefined
            ? `CONCAT(account.name, ' ', crm_locations.name) ILIKE '%${queryParams.keyword}%'`
            : '1=1'
        )
        .andWhere(
          queryParams?.status
            ? `drives.is_active = ${queryParams?.status}`
            : '1=1'
        )
        .orderBy(sortName, sortOrder)
        .limit(queryParams?.limit)
        .offset((queryParams?.page - 1) * queryParams?.limit)
        .getQuery();

      const sample = await this.drivesRepository.query(query);

      const Countquery = await this.drivesRepository
        .createQueryBuilder('drives')

        .addSelect(
          `(
                SELECT JSON_AGG( JSON_BUILD_OBJECT(
                    'start_time',shifts.start_time,
                    'end_time',shifts.end_time
                )) FROM shifts where shifts.shiftable_id = drives.id
                AND shifts.shiftable_type = 'drives'  
                AND drives.account_id = ${account_id}
                )`,
          'shifts'
        )

        .addSelect(
          `(
          SELECT JSON_BUILD_OBJECT(
            'id', crm_locations.id,
            'created_at', crm_locations.created_at,
            'is_archived', crm_locations.is_archived,
            'name', crm_locations.name,
            'cross_street', crm_locations.cross_street,
            'floor', crm_locations.floor,
            'room', crm_locations.room,
            'room_phone', crm_locations.room_phone,
            'becs_code', crm_locations.becs_code,
            'site_type', crm_locations.site_type,
            'qualification_status', crm_locations.qualification_status,
            'is_active', crm_locations.is_active,
            'address', (SELECT JSON_BUILD_OBJECT(
              'address1', address.address1,
              'address2', address.address2
            ) FROM address WHERE address.addressable_type = 'crm_locations' AND address.addressable_id = crm_locations.id)
          )
          FROM crm_locations
          JOIN accounts ON accounts.id = drives.account_id
          WHERE crm_locations.id = drives.location_id
          AND accounts.id = ${account_id}
        )`,
          'crm_locations'
        )
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT(
              'id', account.id,
              'name', account.name,
              'alternate_name', account.alternate_name,
              'phone', account.phone,
              'website', account.website,
              'facebook', account.facebook,
              'industry_category', account.industry_category,
              'industry_subcategory', account.industry_subcategory,
              'stage', account.stage,
              'source', account.source,
              'collection_operation', account.collection_operation,
              'recruiter', account.recruiter,
              'territory', account.territory,
              'population', account.population,
              'is_active', account.is_active,
              'RSMO', account."RSMO"
            ) FROM accounts WHERE accounts.id = drives.account_id)`,
          'account'
        )

        .addSelect(`drives.is_active`, 'is_active')
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT(
              'product_count', (
                  SELECT COUNT( products.name)

              )
          )  FROM products
                  JOIN procedures_products ON products.id = procedures_products.product_id
                  JOIN shifts_projections_staff ON procedures_products.procedures_id = shifts_projections_staff.procedure_type_id
                  JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
                  WHERE shifts.shiftable_id = drives.id
                   AND drives.account_id = ${account_id}
                  AND shifts.shiftable_type = 'drives'
          )`,
          'Products'
        )
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT(
                    'procedure_count', (
                        SELECT COUNT( procedure.name)

                    )
                )
                FROM procedure
                  JOIN procedures_products ON procedure.id = procedures_products.procedures_id
                  JOIN shifts_projections_staff ON procedures_products.procedures_id = shifts_projections_staff.procedure_type_id
                  JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
                  WHERE shifts.shiftable_id = drives.id
                  AND drives.account_id = ${account_id}
                  AND shifts.shiftable_type = 'drives'
              ) `,
          'Procedures'
        )

        .leftJoin('drives.account', 'account', `account.id = ${account_id}`)
        .leftJoin('drives.location', 'crm_locations')
        .where(
          `drives.is_archived = false AND drives.is_blueprint AND drives.account_id = ${account_id}`
        )
        .andWhere(
          queryParams?.keyword !== undefined
            ? `CONCAT(account.name, ' ', crm_locations.name) ILIKE '%${queryParams.keyword}%'`
            : '1=1'
        )
        .andWhere(
          queryParams?.status
            ? `drives.is_active = ${queryParams?.status}`
            : '1=1'
        )
        .orderBy(sortName, sortOrder)
        .getQuery();

      const sampleCount = await this.drivesRepository.query(Countquery);
      const count = sampleCount.length;
      if (!getData) {
        return resError('account id not found', ErrorConstants.Error, 400);
      }
      return resSuccess(
        'record updated.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        {
          data: sample,
          count: count,
        }
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findDefault(user: any, account_id) {
    try {
      if (!user && !account_id) {
        return resError(
          'user and account_id is required',
          ErrorConstants.Error,
          400
        );
      }
      console.log({ account_id });
      const getData = await this.drivesRepository.findOne({
        where: {
          account: {
            id: account_id,
          },
        },
        relations: ['account'],
      });
      console.log({ getData });
      if (!getData) {
        return resError(
          'no account exist against this id',
          ErrorConstants.Error,
          400
        );
      }
      //      queryParams: {
      //   page: '1',
      //   limit: '10',
      //   sortOrder: 'ASC',
      //   sortName: 'blueprint_name'
      // }

      const query = await this.drivesRepository
        .createQueryBuilder('drives')

        .addSelect(
          `(
                SELECT JSON_AGG( JSON_BUILD_OBJECT(
                    'start_time',shifts.start_time,
                    'end_time',shifts.end_time,
                    'id',shifts.id,
                    'qty', (
                      SELECT JSON_AGG(JSON_BUILD_OBJECT(
                        'product_yield', shifts_projections_staff.product_yield,
                        'procedure_type_qty', shifts_projections_staff.procedure_type_qty
                      ))
                      FROM shifts_projections_staff
                      WHERE shifts_projections_staff.shift_id = shifts.id
                      AND  shifts.shiftable_id = drives.id
                      AND shifts.shiftable_type = 'drives'
                      AND drives.account_id = ${account_id}
                    )
                )) FROM shifts where shifts.shiftable_id = drives.id
                AND shifts.shiftable_type = 'drives'  
                AND drives.account_id = ${account_id}
                )`,
          'shifts'
        )
        // .addSelect(
        //   `(
        //         SELECT JSON_AGG( JSON_BUILD_OBJECT(

        //             'procedure_type_qty',shifts_projections_staff.procedure_type_qty
        //         )) FROM shifts_projections_staff , shifts , drives where shifts_projections_staff.shift_id = shifts.id AND shifts.shiftable_id = drives.id
        //         AND shifts.shiftable_type = 'drives'
        //         AND drives.account_id = ${account_id}
        //         )`,
        //   'shifts_projections_staff'
        // )
        .addSelect(
          `(
          SELECT JSON_BUILD_OBJECT(
            'id', crm_locations.id,
            'created_at', crm_locations.created_at,
            'is_archived', crm_locations.is_archived,
            'name', crm_locations.name,
            'cross_street', crm_locations.cross_street,
            'floor', crm_locations.floor,
            'room', crm_locations.room,
            'room_phone', crm_locations.room_phone,
            'becs_code', crm_locations.becs_code,
            'site_type', crm_locations.site_type,
            'qualification_status', crm_locations.qualification_status,
            'is_active', crm_locations.is_active,
            'address', (SELECT JSON_BUILD_OBJECT(
              'address1', address.address1,
              'address2', address.address2
            ) FROM address WHERE address.addressable_type = 'crm_locations' AND address.addressable_id = crm_locations.id)
          )
          FROM crm_locations
          JOIN accounts ON accounts.id = drives.account_id
          WHERE crm_locations.id = drives.location_id
          AND accounts.id = ${account_id}
        )`,
          'crm_locations'
        )
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT(
              'id', account.id,
              'name', account.name,
              'alternate_name', account.alternate_name,
              'phone', account.phone,
              'website', account.website,
              'facebook', account.facebook,
              'industry_category', account.industry_category,
              'industry_subcategory', account.industry_subcategory,
              'stage', account.stage,
              'source', account.source,
              'collection_operation', account.collection_operation,
              'recruiter', account.recruiter,
              'territory', account.territory,
              'population', account.population,
              'is_active', account.is_active,
              'RSMO', account."RSMO"
            ) FROM accounts WHERE accounts.id = drives.account_id)`,
          'account'
        )

        .addSelect(`drives.is_active`, 'is_active')
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT(
              'product_count', (
                  SELECT COUNT( products.name)

              )
          )  FROM products
                  JOIN procedures_products ON products.id = procedures_products.product_id
                  JOIN shifts_projections_staff ON procedures_products.procedures_id = shifts_projections_staff.procedure_type_id
                  JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
                  WHERE shifts.shiftable_id = drives.id
                   AND drives.account_id = ${account_id}
                  AND shifts.shiftable_type = 'drives'
          )`,
          'Products'
        )
        .addSelect(
          `(SELECT JSON_AGG(JSON_BUILD_OBJECT(
            'name',procedure_types.name
                    )
                )
                FROM procedure_types
                  JOIN procedure_types_products ON procedure_types.id = procedure_types_products.procedure_type_id
                  JOIN shifts_projections_staff ON procedure_types_products.procedure_type_id = shifts_projections_staff.procedure_type_id
                  JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
                  WHERE shifts.shiftable_id = drives.id
                  AND drives.account_id = ${account_id}
                  AND shifts.shiftable_type = 'drives'
              ) `,
          'Procedures'
        )

        .leftJoin('drives.account', 'account', `account.id = ${account_id}`)
        .leftJoin('drives.location', 'crm_locations')
        .where(
          `drives.is_archived = false AND drives.is_blueprint = true AND is_default_blueprint = true AND drives.account_id = ${account_id}`
        )
        .getQuery();

      const sample = await this.drivesRepository.query(query);

      const Countquery = await this.drivesRepository
        .createQueryBuilder('drives')

        .addSelect(
          `(
                SELECT JSON_AGG( JSON_BUILD_OBJECT(
                    'start_time',shifts.start_time,
                    'end_time',shifts.end_time
                )) FROM shifts where shifts.shiftable_id = drives.id
                AND shifts.shiftable_type = 'drives'  
                AND drives.account_id = ${account_id}
                )`,
          'shifts'
        )

        .addSelect(
          `(
          SELECT JSON_BUILD_OBJECT(
            'id', crm_locations.id,
            'created_at', crm_locations.created_at,
            'is_archived', crm_locations.is_archived,
            'name', crm_locations.name,
            'cross_street', crm_locations.cross_street,
            'floor', crm_locations.floor,
            'room', crm_locations.room,
            'room_phone', crm_locations.room_phone,
            'becs_code', crm_locations.becs_code,
            'site_type', crm_locations.site_type,
            'qualification_status', crm_locations.qualification_status,
            'is_active', crm_locations.is_active,
            'address', (SELECT JSON_BUILD_OBJECT(
              'address1', address.address1,
              'address2', address.address2
            ) FROM address WHERE address.addressable_type = 'crm_locations' AND address.addressable_id = crm_locations.id)
          )
          FROM crm_locations
          JOIN accounts ON accounts.id = drives.account_id
          WHERE crm_locations.id = drives.location_id
          AND accounts.id = ${account_id}
        )`,
          'crm_locations'
        )
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT(
              'id', account.id,
              'name', account.name,
              'alternate_name', account.alternate_name,
              'phone', account.phone,
              'website', account.website,
              'facebook', account.facebook,
              'industry_category', account.industry_category,
              'industry_subcategory', account.industry_subcategory,
              'stage', account.stage,
              'source', account.source,
              'collection_operation', account.collection_operation,
              'recruiter', account.recruiter,
              'territory', account.territory,
              'population', account.population,
              'is_active', account.is_active,
              'RSMO', account."RSMO"
            ) FROM accounts WHERE accounts.id = drives.account_id)`,
          'account'
        )

        .addSelect(`drives.is_active`, 'is_active')
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT(
              'product_count', (
                  SELECT COUNT( products.name)

              )
          )  FROM products
                  JOIN procedures_products ON products.id = procedures_products.product_id
                  JOIN shifts_projections_staff ON procedures_products.procedures_id = shifts_projections_staff.procedure_type_id
                  JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
                  WHERE shifts.shiftable_id = drives.id
                   AND drives.account_id = ${account_id}
                  AND shifts.shiftable_type = 'drives'
          )`,
          'Products'
        )
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT(
                    'procedure_count', (
                        SELECT COUNT( procedure.name)

                    )
                )
                FROM procedure
                  JOIN procedures_products ON procedure.id = procedures_products.procedures_id
                  JOIN shifts_projections_staff ON procedures_products.procedures_id = shifts_projections_staff.procedure_type_id
                  JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
                  WHERE shifts.shiftable_id = drives.id
                  AND drives.account_id = ${account_id}
                  AND shifts.shiftable_type = 'drives'
              ) `,
          'Procedures'
        )

        .leftJoin('drives.account', 'account', `account.id = ${account_id}`)
        .leftJoin('drives.location', 'crm_locations')
        .where(
          `drives.is_archived = false AND drives.is_blueprint AND drives.account_id = ${account_id}`
        )
        .getQuery();

      const sampleCount = await this.drivesRepository.query(Countquery);
      const count = sampleCount.length;
      if (!getData) {
        return resError('account id not found', ErrorConstants.Error, 400);
      }
      return resSuccess(
        'record updated.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        {
          data: sample,
          count: count,
        }
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async accountsBluePrintsMarkitingDetails(user: any, queryParams) {
    try {
      const bluePrint_id = queryParams?.bluePrint_id
        ? queryParams.bluePrint_id
        : queryParams?.driveId;
      let getData;
      if (queryParams?.account_id && queryParams?.bluePrint_id) {
        getData = await this.drivesRepository.findOne({
          where: {
            account: {
              id: queryParams?.account_id,
            },
            is_blueprint: true,
            id: queryParams?.bluePrint_id,
          },
          relations: ['account'],
        });
      } else if (queryParams?.driveId) {
        getData = await this.drivesRepository.findOne({
          where: {
            id: queryParams?.driveId,
          },
          relations: ['account'],
        });
      }

      if (!getData) {
        return resError(
          'no account exist against this id',
          ErrorConstants.Error,
          400
        );
      }
      const marketing_details = {
        start_date: getData?.marketing_start_date,
        end_date: getData?.marketing_end_date,
        start_time: getData?.marketing_start_time,
        end_time: getData?.marketing_end_time,
        instructional_info: getData?.instructional_information,
        donor_info: getData?.donor_information,
        online_scheduling_allowed: getData?.online_scheduling_allowed,
      };

      const drive_material_items =
        await this.driveMarketingMaterialItemsRepository.find({
          where: {
            drive_id: bluePrint_id,
          },
        });

      const marketing_items = await Promise.all(
        drive_material_items.map(async (item) => {
          const getMarketingMaterialData = async () => {
            const marketingMaterialData =
              await this.marketingMaterialRepository.findOne({
                where: {
                  id: item?.marketing_material_id,
                },
              });
            return marketingMaterialData.name;
          };

          const marketingMaterialName = await getMarketingMaterialData();

          return {
            items: marketingMaterialName,
            quantity: item?.quantity,
          };
        })
      );

      const marketing_materials = {
        order_due_date: getData?.order_due_date,
        drive_material_items: marketing_items,
        totalQuantity: marketing_items.reduce(
          (acc, item) => acc + item.quantity,
          0
        ),
      };

      const drive_promotional_items =
        await this.drivePromotionalItemsRepository.find({
          where: {
            drive_id: bluePrint_id,
          },
        });

      const promotional_items = await Promise.all(
        drive_promotional_items.map(async (item) => {
          const getPromotionalData = async () => {
            const promotionalItemData =
              await this.promotionalRepository.findOne({
                where: {
                  id: item?.promotional_item_id,
                },
              });
            return promotionalItemData.name;
          };

          const promotionalItemName = await getPromotionalData();

          return {
            items: promotionalItemName,
            quantity: item?.quantity,
          };
        })
      );

      const promotional_materials = {
        drive_promotional_items: promotional_items,
        totalQuantity: promotional_items.reduce(
          (acc, item) => acc + item.quantity,
          0
        ),
      };
      const getAccountData =
        await this.drivesDonorCommunicationSupplementalAccounts.find({
          where: {
            drive_id: bluePrint_id,
            is_archived: false,
          },
          // relations: ['collection_operation'],
        });

      const ids = getAccountData.map((item) => item?.account_id);
      const getAccounts = await this.accountRepository.find({
        where: {
          id: In(ids),
        },
        relations: ['collection_operation'],
      });
      const data = await addressExtractionFilter(
        'accounts',
        ids,
        getAccounts,
        user?.id,
        null,
        null,
        null,
        this.addressRepository
      );

      const zipCodes = await this.driveZipCodesRepository.find({
        where: {
          drive_id: bluePrint_id,
        },
      });

      const mapZipCodes = zipCodes?.map((item) => item.zip_code);

      const accounts = data?.map((item) => {
        return {
          name: item?.name,
          collection_operation: item?.collection_operation?.name,
          city: item?.address?.city,
          state: item?.address?.state,
          account_id: item?.id,
          becs_code: item?.BECS_code,
        };
      });
      const donor_communication = {
        telerecruitment_enabled: getData.tele_recruitment,
        email_enabled: getData.email,
        sms_enabled: getData.sms,
        telerecruitment_status: getData.tele_recruitment_status,
        email_status: getData.email_status,
        sms_status: getData.sms_status,
      };

      return {
        status: 'success',
        code: 200,
        data: {
          marketing_details,
          marketing_materials,
          promotional_materials,
          supplemental_recruitment: {
            accounts,
            zipCodes: mapZipCodes,
          },
          donor_communication,
          // mapZipCodes,
        },
      };
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async addNewAccountsIntoDrive(user: any, body: CreateDriveAccountsDto[]) {
    try {
      await Promise.all(
        body?.map(async (item) => {
          const existingAccount =
            await this.drivesDonorCommunicationSupplementalAccounts.findOne({
              where: {
                drive_id: item.drive_id,
                account_id: item.account_id,
              },
            });

          if (!existingAccount) {
            await this.drivesDonorCommunicationSupplementalAccounts.save({
              drive_id: item.drive_id,
              account_id: item.account_id,
              created_by: user.id,
            });
          } else {
            existingAccount.is_archived = false;
            await this.drivesDonorCommunicationSupplementalAccounts.save(
              existingAccount
            );
          }
        })
      );
      return {
        status: 'success',
        code: 200,
        message: 'Accounts has been created',
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async archiveAccountInDrive(account_id: any, drive_id, user: any) {
    try {
      const archiveAccount =
        await this.drivesDonorCommunicationSupplementalAccounts.findOne({
          where: {
            drive_id: drive_id,
            account_id: account_id,
          },
        });
      archiveAccount.is_archived = true;
      await this.drivesDonorCommunicationSupplementalAccounts.save(
        archiveAccount
      );
      return {
        status: 'success',
        code: 200,
        messgae: 'Account has been Archived',
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
