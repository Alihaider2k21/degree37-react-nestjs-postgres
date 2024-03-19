import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  ILike,
  IsNull,
  FindOperator,
  In,
  EntityManager,
} from 'typeorm';
import { Facility } from '../entity/facility.entity';
import {
  GetDonorCenterStagingSitesInterface,
  GetFacilityInterface,
} from '../interface/facility.interface';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SuccessConstants } from '../../../../../constants/success.constants';
import { resError, resSuccess } from '../../../../../helpers/response';
import { ErrorConstants } from '../../../../../constants/error.constants';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { CreateFacilityDto } from '../dto/create-facility.dto';
import { GetAllFacilityDto } from '../dto/get-all-facility.dto';
import { ProcedureTypes } from '../../../products-procedures/procedure-types/entities/procedure-types.entity';
import { FacilityHistory } from '../entity/facilityHistory.entity';
import { BusinessUnits } from '../../../hierarchy/business-units/entities/business-units.entity';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';
import { OrganizationalLevels } from '../../../hierarchy/organizational-levels/entities/organizational-level.entity';
import { DonorCenterFilter } from '../entity/donor_center.entity';
import { GetAllDonorCenterFilterDto } from '../interface/get-donor-center-filter.dto';
import { IndustryCategories } from '../../../../crm-administration/account/industry-categories/entities/industry-categories.entity';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { CreateDonorCenterFilterDTO } from '../dto/create-donor-center-filter.dto';
import { OrderByConstants } from 'src/api/system-configuration/constants/order-by.constants';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { addressExtractionFilter } from 'src/api/common/services/addressExtraction.service';
import { saveCustomFields } from '../../../../../../common/services/saveCustomFields.service';
import { CustomFields } from '../../../custom-fields/entities/custom-field.entity';
import { Drives } from 'src/api/operations-center/operations/drives/entities/drives.entity';
import { Sessions } from 'src/api/operations-center/operations/sessions/entities/sessions.entity';
import { DonorDonations } from 'src/api/crm/contacts/donor/donorDonationHistory/entities/donor-donations.entity';
import { DonationStatusEnum } from 'src/api/crm/contacts/donor/enum/donors.enum';
import { PolymorphicType } from 'src/api/common/enums/polymorphic-type.enum';
import { Sort } from 'src/common/interface/sort';
import { FilterSessionHistory } from '../interface/filter-sessions-history.interface';
import { DonorCenterBluePrints } from '../donor-center-blueprints/entity/donor_center_blueprint';
import { pagination } from 'src/common/utils/pagination';
import moment from 'moment';
import { ShiftsService } from 'src/api/shifts/services/shifts.service';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { DailyCapacity } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/daily-capacity/entities/daily-capacity.entity';
import { shiftable_type_enum } from 'src/api/shifts/enum/shifts.enum';

dotenv.config();
@Injectable({ scope: Scope.REQUEST })
export class FacilityService {
  constructor(
    @InjectRepository(Shifts)
    private readonly shiftsRepo: Repository<Shifts>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
    @InjectRepository(FacilityHistory)
    private readonly facilityHistoryRepository: Repository<FacilityHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BusinessUnits)
    private readonly businessUnitsRepository: Repository<BusinessUnits>,
    @InjectRepository(OrganizationalLevels)
    private readonly organizationalLevelRepository: Repository<OrganizationalLevels>,
    @InjectRepository(DonorCenterFilter)
    private readonly donorCenterFilterRepository: Repository<DonorCenterFilter>,
    @InjectRepository(IndustryCategories)
    private readonly IndustryCategoryRepository: Repository<IndustryCategories>,
    @InjectRepository(CustomFields)
    private readonly customFieldsRepository: Repository<CustomFields>,
    private readonly entityManager: EntityManager,
    @InjectRepository(Drives)
    private readonly drivesRepository: Repository<Drives>,
    @InjectRepository(Sessions)
    private readonly sessionsRepository: Repository<Sessions>,
    @InjectRepository(DonorCenterBluePrints)
    private readonly donorCenterBluePrintsRepo: Repository<DonorCenterBluePrints>,
    @InjectRepository(DailyCapacity)
    private readonly dailyCapacityRepo: Repository<DailyCapacity>,
    private readonly shiftsService: ShiftsService
  ) {}

  async getFacilities(getAllFacilitiesInterface: GetAllFacilityDto) {
    try {
      const limit = Number(getAllFacilitiesInterface?.limit);
      const page = Number(getAllFacilitiesInterface?.page);

      const collection_operation =
        getAllFacilitiesInterface?.collection_operation;
      const is_archived =
        getAllFacilitiesInterface?.is_archived?.toLocaleLowerCase() == 'true';
      const search = getAllFacilitiesInterface?.search;
      const getTotalPage = (totalData: number, limit: number) => {
        return Math.ceil(totalData / limit);
      };
      if (page <= 0) {
        throw new HttpException(
          `page must of positive integer`,
          HttpStatus.BAD_REQUEST
        );
      }
      const where: any = {};
      if (getAllFacilitiesInterface.status != undefined) {
        const status =
          getAllFacilitiesInterface?.status?.toLocaleLowerCase() != 'false';
        where.status = status;
      }
      if (collection_operation) {
        const collectionOperationValues = collection_operation
          .split(',')
          .map((item) => item.trim());

        if (collectionOperationValues.length > 0) {
          // Use the array directly with In operator
          Object.assign(where, {
            collection_operation: In(collectionOperationValues),
          });
        } else {
          // Use the single value without wrapping it in an array
          Object.assign(where, {
            collection_operation: collection_operation,
          });
        }
      }
      // where.collection_operation = collection_operation;
      if (is_archived != undefined) where.is_archived = is_archived;

      if (search != undefined) {
        where.name = ILike(`%${search}%`);
      }

      Object.assign(where, {
        tenant: { id: this.request.user?.tenant?.id },
      });

      const facilityWithAddress = async (getCount: boolean) => {
        let pagination: any = {};
        if (!getCount) {
          pagination = {
            ...pagination,
            skip: (page - 1) * limit || 0,
            take: limit || 10,
          };
        }

        const result = await this.facilityRepository
          .createQueryBuilder('facility')
          .leftJoinAndSelect(
            'facility.collection_operation',
            'collection_operation'
          )
          .leftJoinAndSelect('facility.industry_category', 'industry_category')
          .leftJoinAndSelect(
            'facility.industry_sub_category',
            'industry_sub_category'
          )
          .innerJoinAndSelect(
            'address',
            'addresses',
            "addresses.addressable_id = facility.id AND (addresses.addressable_type = 'facility')"
          )
          .where(where)
          .orderBy('facility.id', 'DESC')
          .skip(pagination?.skip ?? '')
          .take(pagination?.take || 10)
          .getMany();

        if (!getCount) {
          const array: any = [];
          for (const res of result) {
            array.push(res.id);
          }
          const data = await addressExtractionFilter(
            'facility',
            array,
            result,
            this.request?.user?.id,
            null,
            null,
            null,
            this.addressRepository
          );

          return data;
        } else {
          return result;
        }
      };

      const data = await facilityWithAddress(false);
      const facilityCountData = await facilityWithAddress(true);

      return {
        total_records: facilityCountData?.length,
        page_number: page,
        totalPage: getTotalPage(facilityCountData?.length, limit),
        data: data,
      };
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async searchByDonorCenterFilter(
    getDonorCentersFilter: GetAllDonorCenterFilterDto,
    user: any
  ) {
    try {
      const limit: number = getDonorCentersFilter?.limit
        ? +getDonorCentersFilter?.limit
        : +process.env.PAGE_SIZE;
      const page = getDonorCentersFilter?.page
        ? +getDonorCentersFilter?.page
        : 1;
      const where: any = {
        donor_center: true,
      };
      const {
        keyword,
        city,
        state,
        organizational_levels,
        is_active,
        is_donor_center,
        staging_site,
        fetch_all,
        sortBy = 'id',
        sortOrder = OrderByConstants.DESC,
        collection_operation,
      } = getDonorCentersFilter;

      if (keyword) {
        if (!isNaN(+keyword)) {
          Object.assign(where, {
            code: ILike(`%${keyword}%`),
          });
        } else {
          Object.assign(where, {
            name: ILike(`%${keyword}%`),
          });
        }
      }

      if (collection_operation) {
        const collectionOperationValues = collection_operation
          .split(',')
          .map((item) => item.trim());
        if (collectionOperationValues.length > 0) {
          // Use the array directly with In operator
          Object.assign(where, {
            collection_operation: In(collectionOperationValues),
          });
        } else {
          // Use the single value without wrapping it in an array
          Object.assign(where, {
            collection_operation: collection_operation,
          });
        }
      }

      if (is_active != undefined && is_active != null)
        Object.assign(where, {
          status: is_active,
        });

      if (is_donor_center != undefined && is_donor_center != null)
        Object.assign(where, {
          donor_center: is_donor_center,
        });

      if (staging_site != null) {
        Object.assign(where, {
          staging_site: staging_site
            ? 'Yes'
            : staging_site == false
            ? 'No'
            : null,
        });
      }

      Object.assign(where, {
        is_archived: false,
      });

      Object.assign(where, {
        tenant: { id: user?.tenant?.id },
      });

      let facility: any = [];

      if (fetch_all) {
        facility = this.facilityRepository
          .createQueryBuilder('facility')
          .leftJoinAndSelect(
            'facility.collection_operation',
            'collection_operation'
          )
          .leftJoinAndSelect('facility.industry_category', 'industry_category')
          .leftJoinAndSelect(
            'facility.industry_sub_category',
            'industry_sub_category'
          )
          .orderBy({ 'facility.id': 'DESC' })
          .where(where);
      } else if (sortBy) {
        facility = this.facilityRepository
          .createQueryBuilder('facility')
          .leftJoinAndSelect(
            'facility.collection_operation',
            'collection_operation'
          )
          .leftJoinAndSelect('facility.industry_category', 'industry_category')
          .leftJoinAndSelect(
            'facility.industry_sub_category',
            'industry_sub_category'
          )
          .take(limit)
          .orderBy(
            sortBy === 'collection_operation'
              ? {
                  [`collection_operation.name`]:
                    sortOrder === 'asc' ? 'ASC' : 'DESC' || 'ASC',
                }
              : sortBy === 'city' || sortBy === 'state' || sortBy === 'county'
              ? {}
              : {
                  [`facility.${sortBy}`]:
                    sortOrder === 'asc' ? 'ASC' : 'DESC' || 'ASC',
                }
          )
          .skip((page - 1) * limit)
          .where({ ...where, is_archived: false });
      } else {
        facility = this.facilityRepository
          .createQueryBuilder('facility')
          .leftJoinAndSelect(
            'facility.collection_operation',
            'collection_operation'
          )
          .leftJoinAndSelect('facility.industry_category', 'industry_category')
          .leftJoinAndSelect(
            'facility.industry_sub_category',
            'industry_sub_category'
          )
          .take(limit)
          .skip((page - 1) * limit)
          .orderBy({ 'facility.id': 'DESC' })
          .where({ ...where, is_archived: false });
      }

      if (organizational_levels) {
        const collection_operations = JSON.parse(organizational_levels);
        let olWhere = '';
        const params = {};
        Object.entries(collection_operations).forEach(
          ([co_id, value], index) => {
            olWhere += olWhere ? ' OR ' : '';
            olWhere += `(collection_operation.id = :co_id${index}`;
            params[`co_id${index}`] = co_id;
            const { donor_centers } = <any>value;
            if (donor_centers?.length) {
              olWhere += ` AND facility.donor_center = true AND facility.id IN (:...donor_centers${index})`;
              params[`donor_centers${index}`] = donor_centers;
            }
            olWhere += ')';
          }
        );
        facility.andWhere(`(${olWhere})`, params);
      }

      const [data, count] = await facility.getManyAndCount();
      let donorCenterData = data;
      const array: any = [];
      for (const res of data) {
        array.push(res.id);
      }
      if (city || state) {
        donorCenterData = await addressExtractionFilter(
          'facility',
          array,
          donorCenterData,
          user?.id,
          city ?? null,
          state ?? null,
          null,
          this.addressRepository
        );
      } else {
        donorCenterData = await addressExtractionFilter(
          'facility',
          array,
          donorCenterData,
          user?.id,
          null,
          null,
          null,
          this.addressRepository
        );
      }
      return {
        total_records: count,
        page_number: page,
        totalPage: Math.ceil(count / limit),
        data: donorCenterData,
      };
    } catch (error) {
      console.log(error);

      return [];
    }
  }

  async getDonorCenterFilter() {
    try {
      const results = await this.donorCenterFilterRepository.find({
        where: { is_archived: false },
        relations: ['organizational_level_id', 'collection_operation_id'],
      });

      return {
        data: results,
      };
    } catch (error) {
      return [];
    }
  }

  async getFacility(getFacility: GetFacilityInterface) {
    try {
      const id = Number(getFacility?.id);
      if (!id) {
        throw new HttpException(`Invalid Id`, HttpStatus.NOT_FOUND);
      }
      const facility = await this.facilityRepository.findOne({
        where: {
          id: id as any,
        },
        relations: [
          'collection_operation',
          'created_by',
          'industry_category',
          'industry_sub_category',
        ],
      });
      const modifiedData: any = await getModifiedDataDetails(
        this.facilityHistoryRepository,
        id,
        this.userRepository
      );

      const array: any = [];
      array.push(facility.id);
      const response = [];
      response.push(facility);

      const data = await addressExtractionFilter(
        'facility',
        array,
        response,
        this.request.user.id,
        null,
        null,
        null,
        this.addressRepository
      );

      if (data) return { ...data, ...modifiedData };
      else return [];
    } catch (error) {
      return [];
    }
  }

  async getFacilityBasedonCollectionOperation(id: any) {
    try {
      if (id) {
        const findCollectionOperation =
          await this.businessUnitsRepository.findOne({
            where: {
              id: id,
            },
          });
        if (!findCollectionOperation) {
          console.log('no collection operarion');
          return 0;
        }

        const findFacilities: any = await this.facilityRepository.find({
          where: [
            {
              collection_operation: {
                id: findCollectionOperation?.id,
              },
              staging_site: true,
            },
            {
              collection_operation: {
                id: findCollectionOperation?.id,
              },
              donor_center: true,
            },
          ],
          relations: ['collection_operation'],
          order: { id: 'DESC' },
        });
        if (!findFacilities.length) {
          console.log('no findFacilities');
          return 0;
        }

        const array: any = [];
        for (const fac of findFacilities) {
          array.push(fac.id);
        }

        const data = await addressExtractionFilter(
          'facility',
          array,
          findFacilities,
          this.request.user?.id,
          null,
          null,
          null,
          this.addressRepository
        );

        return { ...data };
      } else {
        console.log('id is required');
      }
    } catch (e) {
      console.log({ e });
    }
  }

  async addFacility(createFacilityDto: CreateFacilityDto, user: any) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const user = await this.userRepository.findOneBy({
        id: createFacilityDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const collection_operation = await this.businessUnitsRepository.findOneBy(
        {
          id: createFacilityDto?.collection_operation,
        }
      );
      if (!collection_operation) {
        throw new HttpException(
          `Collection Operation not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      let industry_category;
      let industry_sub_category;
      if (createFacilityDto?.industry_category) {
        industry_category = await this.IndustryCategoryRepository.findOne({
          where: {
            id: createFacilityDto?.industry_category,
            is_archive: false,
            parent_id: IsNull(),
          },
        });
        if (!industry_category) {
          throw new HttpException(
            `Industry category not found.`,
            HttpStatus.NOT_FOUND
          );
        }
      }
      if (createFacilityDto?.industry_sub_category) {
        industry_sub_category = await this.IndustryCategoryRepository.find({
          where: {
            id: In(createFacilityDto.industry_sub_category),
            is_archive: false,
            parent_id: new FindOperator(
              'equal',
              createFacilityDto?.industry_category as bigint
            ),
          },
        });
        if (!industry_sub_category) {
          throw new HttpException(
            `Dependent industry subcategory not found.`,
            HttpStatus.NOT_FOUND
          );
        }
      }

      const facility = new Facility();
      facility.name = createFacilityDto?.name;
      facility.alternate_name = createFacilityDto?.alternate_name;
      // facility.city = createFacilityDto?.city;
      // facility.state = createFacilityDto?.state;
      // facility.country = createFacilityDto?.country;
      // facility.physical_address = createFacilityDto?.physical_address;
      // facility.postal_code = createFacilityDto?.postal_code;
      facility.phone = createFacilityDto?.phone;
      // facility.code = createFacilityDto?.code;
      facility.code = Date.now() as unknown as string;
      facility.donor_center = createFacilityDto?.donor_center;
      facility.staging_site = createFacilityDto?.staging_site;
      facility.collection_operation = collection_operation;
      facility.status = createFacilityDto?.status;
      facility.industry_category = industry_category || null;
      facility.industry_sub_category = industry_sub_category || null;
      facility.created_by = createFacilityDto?.created_by;
      facility.tenant = this.request.user?.tenant;
      facility.is_archived = false;

      const savedFacilityType = await queryRunner.manager.save(facility);
      const facilityCustomFieds = [];
      await saveCustomFields(
        this.customFieldsRepository,
        queryRunner,
        savedFacilityType,
        this.request.user?.id,
        this.request.user?.tenant?.id,
        createFacilityDto,
        facilityCustomFieds
      );

      const address = new Address();
      if (
        createFacilityDto?.address?.latitude &&
        createFacilityDto?.address?.longitude
      ) {
        if (
          createFacilityDto?.address?.latitude &&
          createFacilityDto?.address?.longitude
        ) {
          address.coordinates = `(${createFacilityDto?.address?.latitude}, ${createFacilityDto?.address?.longitude})`;
        } else {
          return resError('Invalid Address', ErrorConstants.Error, 400);
        }
      }
      address.address1 = createFacilityDto?.address?.address1;
      address.address2 = createFacilityDto?.address?.address2;
      address.addressable_id = savedFacilityType.id;
      address.addressable_type = 'facility';
      address.city = createFacilityDto?.address?.city;
      address.country = createFacilityDto?.address?.country;
      address.county = createFacilityDto?.address?.county;
      address.tenant_id = this.request?.user?.tenant;
      address.zip_code = createFacilityDto?.address?.zip_code;
      address.state = createFacilityDto?.address?.state;
      address.created_by = createFacilityDto.created_by;

      const saveAddress = await queryRunner.manager.save(address);
      await queryRunner.commitTransaction();
      return resSuccess(
        '', // messages
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { ...savedFacilityType, ...saveAddress }
      );
    } catch (error) {
      // return error
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async addDonorCenterFilter(
    createDonorCenterFilterDto: CreateDonorCenterFilterDTO
  ) {
    const { collection_operation_id, organizational_level_id } =
      createDonorCenterFilterDto;
    try {
      const collection_operation_exists =
        await this.businessUnitsRepository.findOneBy({
          id: collection_operation_id,
        });
      if (!collection_operation_exists) {
        throw new HttpException(
          `Collection Operation not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      const organizational_level_exists =
        await this.organizationalLevelRepository.findOneBy({
          id: organizational_level_id,
        });
      if (!organizational_level_exists) {
        throw new HttpException(
          `Organizational Level not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      const filter = new DonorCenterFilter();
      Object.assign(filter, createDonorCenterFilterDto);

      await this.donorCenterFilterRepository.save(filter);
      return resSuccess(
        'Donor Center Filter Created.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        {}
      );
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async UpdateFacility(
    getFacility: GetFacilityInterface,
    updateFacilityDto: CreateFacilityDto
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const id = getFacility?.id;
      // if (!id) {
      //   throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      // }

      const collection_operation = await this.businessUnitsRepository.findOneBy(
        {
          id: updateFacilityDto?.collection_operation,
        }
      );
      if (!collection_operation) {
        throw new HttpException(
          `Collection Operation not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      let industry_category;
      if (updateFacilityDto?.industry_category) {
        industry_category = await this.IndustryCategoryRepository.findOne({
          where: {
            id: updateFacilityDto?.industry_category,
            is_archive: false,
          },
        });
        if (!industry_category) {
          throw new HttpException(
            `Industry category not found.`,
            HttpStatus.NOT_FOUND
          );
        }
      }
      const industry_sub_category = await this.IndustryCategoryRepository.find({
        where: {
          id: In(updateFacilityDto.industry_sub_category),
          is_archive: false,
          // parent_id: updateFacilityDto?.industry_category,
        },
      });
      if (!industry_sub_category) {
        throw new HttpException(
          `Dependent industry subcategory not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      const facility = await this.facilityRepository.findOne({
        where: { id: id },
        relations: [
          'created_by',
          'tenant',
          'collection_operation',
          'industry_category',
          'industry_sub_category',
        ],
      });

      if (!facility) {
        throw new HttpException(`Facility not found.`, HttpStatus.NOT_FOUND);
      }

      const locationCustomFieds = [];
      await saveCustomFields(
        this.customFieldsRepository,
        queryRunner,
        facility,
        this.request.user?.id,
        this.request.user?.tenant?.id,
        updateFacilityDto,
        locationCustomFieds
      );

      facility.name = updateFacilityDto?.name;
      facility.created_by = updateFacilityDto?.created_by;
      facility.alternate_name = updateFacilityDto?.alternate_name;
      facility.phone = updateFacilityDto?.phone;
      facility.donor_center = updateFacilityDto?.donor_center;
      facility.is_archived = updateFacilityDto?.is_archived;
      facility.staging_site = updateFacilityDto?.staging_site;
      facility.collection_operation = collection_operation;
      facility.status = updateFacilityDto?.status;
      facility.industry_category = industry_category || null;
      facility.industry_sub_category = industry_sub_category || null;
      facility.tenant = facility?.tenant;

      await this.facilityRepository.save(facility);

      const Findfacility: any = await this.facilityRepository.findOne({
        where: {
          id: id as any,
        },
        relations: [
          'collection_operation',
          'created_by',
          'industry_category',
          'industry_sub_category',
        ],
      });

      const array: any = [];
      array.push(id);
      const response = [];
      response.push(Findfacility);

      const data: any = await addressExtractionFilter(
        'facility',
        array,
        response,
        this.request.user.id,
        null,
        null,
        null,
        this.addressRepository
      );
      const address = new Address();
      if (updateFacilityDto?.address?.coordinates) {
        if (
          updateFacilityDto?.address?.latitude &&
          updateFacilityDto?.address?.longitude
        ) {
          address.coordinates = `(${updateFacilityDto?.address?.latitude}, ${updateFacilityDto?.address?.longitude})`;
        } else {
          return resError('Invalid Address', ErrorConstants.Error, 400);
        }
      }
      address.address1 = updateFacilityDto?.address?.address1;
      address.address2 = updateFacilityDto?.address?.address2;
      address.addressable_id = id;
      address.addressable_type = 'facility';
      address.city = updateFacilityDto?.address?.city;
      address.country = updateFacilityDto?.address?.country;
      address.county = updateFacilityDto?.address?.county;
      address.tenant_id = this.request?.user?.tenant;
      address.zip_code = updateFacilityDto?.address?.zip_code;
      address.state = updateFacilityDto?.address?.state;
      address.created_by = updateFacilityDto.created_by;

      const saveAddress = await this.addressRepository.update(
        {
          id: data[0]?.address?.id as any,
        },
        { ...address }
      );

      // await this.updateFacilityHistory({ id, ...facility, collection_operation, created_by: updateFacilityDto?.updated_by }, 'C');

      if (updateFacilityDto?.is_archived) {
        await this.updateFacilityHistory(
          {
            id,
            ...facility,
            is_archived: updateFacilityDto?.is_archived,
            collection_operation,
            created_by: updateFacilityDto?.updated_by,
            tenant_id: facility?.tenant?.id,
          },
          'D'
        );
      } else {
        await this.updateFacilityHistory(
          {
            id,
            ...facility,
            collection_operation,
            created_by: updateFacilityDto?.updated_by,
            tenant_id: facility?.tenant?.id,
          },
          'C'
        );
      }
      await queryRunner.commitTransaction();
      return resSuccess(
        '', // message
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        {}
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async updateFacilityHistory(data: any, action: string) {
    // const facilityHistory: FacilityHistory = new FacilityHistory();
    // facilityHistory.id = data?.id;

    // facilityHistory.name = data?.name;
    // facilityHistory.alternate_name = data?.alternate_name;
    // facilityHistory.city = data?.city;
    // facilityHistory.state = data?.state;
    // facilityHistory.country = data?.country;
    // facilityHistory.physical_address = data?.physical_address;
    // facilityHistory.postal_code = data?.postal_code;
    // facilityHistory.phone = data?.phone;
    // facilityHistory.donor_center = data?.donor_center;
    // facilityHistory.staging_site = data?.staging_site;
    // facilityHistory.collection_operation = data?.collection_operation;
    // facilityHistory.status = data?.status;
    // facilityHistory.industry_category = data?.industry_category;
    // facilityHistory.industry_sub_category = data?.industry_sub_category;
    // facilityHistory.created_by = data?.created_by;
    // if (action === 'C') {
    //   facilityHistory.history_reason = 'C';
    // } else if (action === 'D') {
    //   facilityHistory.history_reason = 'D';
    // }
    // await this.facilityHistoryRepository.save(facilityHistory);

    const facilityHistory = new FacilityHistory();
    facilityHistory.id = data?.id;

    facilityHistory.name = data?.name;
    facilityHistory.alternate_name = data?.alternate_name;
    // facilityHistory.city = data?.city;
    // facilityHistory.state = data?.state;
    // facilityHistory.country = data?.country;
    // facilityHistory.physical_address = data?.physical_address;
    // facilityHistory.postal_code = data?.postal_code;
    facilityHistory.phone = data?.phone;
    facilityHistory.donor_center = data?.donor_center;
    facilityHistory.staging_site = data?.staging_site;
    facilityHistory.collection_operation = data?.collection_operation;
    facilityHistory.status = data?.status;
    facilityHistory.industry_category = data?.industry_category || 'null';
    facilityHistory.industry_sub_category =
      data?.industry_sub_category || 'null';
    facilityHistory.created_by = data?.created_by;
    facilityHistory.is_archived = data?.is_archived;
    facilityHistory.history_reason = 'C';
    facilityHistory.tenant_id = data?.tenant_id;
    await this.facilityHistoryRepository.save(facilityHistory);

    if (action === 'D') {
      const facilityHistory = new FacilityHistory();
      facilityHistory.id = data?.id;
      facilityHistory.name = data?.name;
      facilityHistory.alternate_name = data?.alternate_name;
      // facilityHistory.city = data?.city;
      // facilityHistory.state = data?.state;
      // facilityHistory.country = data?.country;
      // facilityHistory.physical_address = data?.physical_address;
      // facilityHistory.postal_code = data?.postal_code;
      facilityHistory.phone = data?.phone;
      facilityHistory.donor_center = data?.donor_center;
      facilityHistory.staging_site = data?.staging_site;
      facilityHistory.collection_operation = data?.collection_operation;
      facilityHistory.status = data?.status;
      facilityHistory.industry_category = data?.industry_category || 'null';
      facilityHistory.industry_sub_category =
        data?.industry_sub_category || 'null';
      facilityHistory.created_by = data?.created_by;
      facilityHistory.is_archived = data?.is_archived;
      facilityHistory.history_reason = 'D';
      facilityHistory.tenant_id = data?.tenant_id;
      await this.facilityHistoryRepository.save(facilityHistory);
    }
  }

  async deleteDonorCenterFilter(userId: bigint, filterId: bigint) {
    const filter = await this.donorCenterFilterRepository.findOneBy({
      id: filterId,
    });
    if (!filter) {
      throw new HttpException(`Filter not found.`, HttpStatus.NOT_FOUND);
    }

    filter.is_archived = true;

    await this.donorCenterFilterRepository.update(
      {
        id: filterId,
      },
      filter
    );
    return resSuccess(
      'Donor Center Filter Archived.', // message
      SuccessConstants.SUCCESS,
      HttpStatus.OK,
      {}
    );
  }

  async deleteDonorCenter(userId: bigint, filterId: bigint) {
    const donorCenter = await this.facilityRepository.findOneBy({
      id: filterId,
    });
    if (!donorCenter) {
      throw new HttpException(`Donor Center not found.`, HttpStatus.NOT_FOUND);
    }

    donorCenter.is_archived = true;

    await this.facilityRepository.update(
      {
        id: filterId,
      },
      donorCenter
    );
    return resSuccess(
      'Donor Center Archived Successfully.',
      SuccessConstants.SUCCESS,
      HttpStatus.OK,
      {}
    );
  }

  async donorCenterCityState(user) {
    try {
      const donorCenter: any = await this.facilityRepository.find({
        where: {
          tenant: {
            id: user.tenant.id,
          },
          donor_center: true,
          is_archived: false,
        },
        relations: ['tenant'],
      });
      let donorCenterIds = [];
      if (donorCenter?.length) {
        donorCenterIds = donorCenter.map((donor: any) => donor?.id);
      }
      const uniqueCities = [];
      const uniqueStates = [];
      let results = [];
      if (donorCenterIds?.length) {
        results = await this.addressRepository.find({
          where: {
            addressable_id: In(donorCenterIds),
            addressable_type: 'facility',
          },
        });
        if (results?.length) {
          const uniqueCitySet = new Set();
          const uniqueStateSet = new Set();

          results.forEach((item) => {
            if (!uniqueCitySet.has(item.city)) {
              uniqueCitySet.add(item.city);
              uniqueCities.push(item.city);
            }

            if (!uniqueStateSet.has(item.state)) {
              uniqueStateSet.add(item.state);
              uniqueStates.push(item.state);
            }
          });
        }
      }
      return resSuccess(
        'City and state fetched successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        {
          city: uniqueCities,
          state: uniqueStates,
        }
      );
    } catch (error) {
      return resError(
        error.message,
        ErrorConstants.Error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSessionHistoryKPI(facility_id: number, kind: string) {
    try {
      const projection =
        kind === 'true' ? 'product_yield' : 'procedure_type_qty';
      const oef = kind === 'true' ? 'oef_products' : 'oef_procedures';

      const query = this.sessionsRepository
        .createQueryBuilder('sessions')
        .innerJoinAndSelect(
          'sessions.operation_status',
          'os',
          `os.is_archived = false AND (os.name ILIKE '%complete%')`
        )
        .leftJoinAndSelect(
          'donors_donations',
          'dd',
          'dd.sessions_id = sessions.id AND (dd.is_archived = false)'
        )
        .leftJoinAndSelect(
          'donors_appointments',
          'da',
          `da.appointmentable_id = sessions.id AND (appointmentable_type = 'session' AND da.is_archived = false)`
        )
        .leftJoinAndSelect(
          'shifts',
          'shifts',
          `shifts.shiftable_type = '${PolymorphicType.OC_OPERATIONS_SESSIONS}' AND (shifts.shiftable_id = sessions.id AND shifts.is_archived = false)`
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
          `COUNT(DISTINCT dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Deferred_At_Phlebotomy_020}, ${DonationStatusEnum.Deferred_Post_Defer_030})) AS deferrals`,
          `COUNT(DISTINCT dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Technically_Unsuable_015})) AS qns`,
          `COUNT(DISTINCT dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Donor_Left_012})) AS walkouts`,
          `COUNT(DISTINCT dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Post_Draw_Deferral_025})) AS void`,
          `SUM(DISTINCT projections.${projection}) AS projection`,
          `COUNT(DISTINCT dd.id) AS registered`,
          `COUNT(DISTINCT dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Donated_010}, ${DonationStatusEnum.Technically_Unsuable_015}, ${DonationStatusEnum.Deferred_At_Phlebotomy_020}, ${DonationStatusEnum.Deferred_Post_Defer_030}, ${DonationStatusEnum.Post_Draw_Deferral_025})) AS performed`,
          `COUNT(DISTINCT dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Donated_010}, ${DonationStatusEnum.Technically_Unsuable_015}, ${DonationStatusEnum.Post_Draw_Deferral_025})) AS actual`,
          `COUNT(DISTINCT da.id) AS appointment`,
          `sessions.${oef} AS oef`,
          `COUNT(DISTINCT dd.id) FILTER (WHERE dd.donation_date IS NULL) AS ftd`,
          `COUNT(DISTINCT slots.id) AS noOfSlots`,
        ])
        .where('sessions.donor_center_id=$1 AND sessions.is_archived = false', {
          facility_id,
        })
        .groupBy('sessions.id')
        .orderBy({ 'sessions.created_at': 'DESC' })
        .take(4);

      const result = await this.entityManager.query(
        `SELECT
          AVG(deferrals) AS deferrals,
          AVG(qns) AS qns,
          AVG(walkouts) AS walkouts,
          AVG(void) AS void,
          AVG(projection) AS projection,
          AVG(registered) AS registered,
          AVG(performed) AS performed,
          AVG(actual) AS actual,
          AVG(appointment) AS appointment,
          (CASE 
            WHEN AVG(projection) = 0 THEN 0
            ELSE ((AVG(actual)/AVG(projection))*100)
          END) AS projection_accuracy,
          AVG(oef) AS oef,
          AVG(ftd) AS ftd,
          AVG(noOfSlots) AS slots
        FROM
          (${query.getQuery()}) AS KPI`,
        [facility_id]
      );

      return resSuccess(
        'Sessions History Key Performance Indicators.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        result[0]
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getSessionHistory(
    page: number,
    limit: number,
    sortBy: Sort,
    filters: FilterSessionHistory
  ) {
    const { facility_id, start_date, end_date, status, kind } = filters;
    const { sortName, sortOrder } = sortBy;

    const projection =
      kind === 'products' ? 'product_yield' : 'procedure_type_qty';
    const oef = kind === 'products' ? 'oef_products' : 'oef_procedures';

    let query = this.sessionsRepository
      .createQueryBuilder('sessions')
      .innerJoin('sessions.operation_status', 'os', 'os.is_archived = false')
      .leftJoinAndSelect(
        'donors_donations',
        'dd',
        'dd.sessions_id = sessions.id AND (dd.is_archived = false)'
      )
      .leftJoinAndSelect(
        'donors_appointments',
        'da',
        `da.appointmentable_id = sessions.id AND (appointmentable_type = 'session' AND da.is_archived = false)`
      )
      .leftJoinAndSelect(
        'shifts',
        'shifts',
        `shifts.shiftable_type = 'sessions' AND shifts.shiftable_id = sessions.id AND shifts.is_archived = false`
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
        `sessions.${oef} AS oef`,
        `COUNT(dd.id) FILTER (WHERE dd.donation_date IS NULL) AS ftd`,
        `COUNT(DISTINCT "shifts"."id") AS noOfshifts`,
        `os.name AS status`,
        `sessions.date AS date`,
        `sessions.id AS id`,
      ])
      .where(
        `sessions.donor_center_id = :facility_id AND sessions.is_archived = false`,
        { facility_id }
      )
      .groupBy('sessions.id, os.name');

    if (status) {
      query = query.andWhere(`sessions.operation_status_id = :status`, {
        status,
      });
    }
    if (start_date && end_date) {
      query = query.andWhere(
        `sessions.date BETWEEN '${moment(start_date).format(
          'MM-DD-YYYY'
        )}' AND '${moment(end_date).format('MM-DD-YYYY')}'`
      );
    }

    const count = await query.getCount();

    if (sortName && sortOrder) {
      query = query.orderBy({
        [sortName]: sortOrder,
      });
    }
    if (page && limit) {
      const { skip, take } = pagination(page, limit - 1);
      query = query.limit(take).offset(skip);
    }

    const result = await query.getRawMany();

    try {
      return resSuccess(
        'Sessions History records.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { count, result }
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getSessionHistoryDetail(facility_id: number, sessions_id: number) {
    const query = this.sessionsRepository
      .createQueryBuilder('sessions')
      .select([
        `(SELECT JSON_BUILD_OBJECT(
          'id', sessions.id,
          'date', sessions.date,
          'oef_products', sessions.oef_products,
          'oef_procedures', sessions.oef_procedures,
          'operation_status', (
            SELECT JSON_BUILD_OBJECT(
              'id', os.id,
              'name', os.name,
              'description', os.description,
              'chip_color', os.chip_color
            )
            FROM operations_status os
            WHERE os.id = sessions.operation_status_id
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
                            'sessions_id', dd.sessions_id,
                            'next_eligibility_date', dd.next_eligibility_date,
                            'donation_ytd', dd.donation_ytd,
                            'donation_ltd', dd.donation_ltd,
                            'donation_last_year', dd.donation_last_year,
                            'points', dd.points,
                            'is_archived', dd.is_archived
                          )
                        )
                        FROM donors_donations dd
                        WHERE dd.donation_type = projections.procedure_type_id AND dd.sessions_id = sessions.id
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
            WHERE shifts.shiftable_type = 'sessions' AND shifts.shiftable_id = sessions.id
          ),
          'donor_donations', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', dd.id,
                'donation_type', dd.donation_type,
                'donation_date', dd.donation_date,
                'donation_status', dd.donation_status,
                'sessions_id', dd.sessions_id,
                'next_eligibility_date', dd.next_eligibility_date,
                'donation_ytd', dd.donation_ytd,
                'donation_ltd', dd.donation_ltd,
                'donation_last_year', dd.donation_last_year,
                'points', dd.points,
                'is_archived', dd.is_archived
              )
            )
            FROM donors_donations dd
            WHERE dd.sessions_id = sessions.id
          ),
          'appointment_count', (
            SELECT COUNT(da.id)
            FROM donors_appointments da
            WHERE da.appointmentable_id = sessions.id
            AND da.appointmentable_type = 'session'
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
            WHERE da.appointmentable_id = sessions.id
            AND da.appointmentable_type = 'session'
          )
        )
        FROM sessions session WHERE session.id = sessions.id
        ) AS "sessions"`,
      ])
      .where(`sessions.is_archived = false AND (sessions.id = :sessions_id)`, {
        sessions_id,
      })
      .andWhere('sessions.donor_center_id = :facility_id', { facility_id });

    const result = await query.getRawOne();

    try {
      return resSuccess(
        'Sessions History records.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        result ? result?.sessions : null
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAllWithDonorSessionsFilters(user: any, facility_id, queryParams) {
    try {
      if (!user && !facility_id) {
        return resError(
          'user and account_id is required',
          ErrorConstants.Error,
          400
        );
      }
      const getData = await this.facilityRepository.findOne({
        where: {
          id: facility_id,
        },
        // relations: ['account'],
      });
      if (!getData) {
        return resError(
          'no account exist against this id',
          ErrorConstants.Error,
          400
        );
      }
      let sortOrder = queryParams?.sortOrder;
      let sortName = queryParams?.sortName;
      if (sortName) {
        if (sortName == 'blueprint_name') {
          sortName = `donor_center_blueprints.name`;
          sortOrder = sortOrder?.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'hours') {
          sortName = `(SELECT start_time FROM shifts WHERE shifts.shiftable_id = donor_center_blueprints.id  AND shifts.shiftable_type = 'crm_donor_center_blueprints' LIMIT 1)`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'procedures') {
          sortName = `(SELECT oef_procedures FROM shifts WHERE shifts.shiftable_id = donor_center_blueprints.id  AND shifts.shiftable_type = 'crm_donor_center_blueprints' LIMIT 1)`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'products') {
          sortName = `(SELECT oef_products FROM shifts WHERE shifts.shiftable_id = donor_center_blueprints.id  AND shifts.shiftable_type = 'crm_donor_center_blueprints' LIMIT 1)`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'staff_setup') {
          sortName = `(SELECT staff_config.qty  FROM staff_config
          INNER JOIN public.staff_setup ON staff_config.staff_setup_id = staff_setup.id
          INNER JOIN public.shifts_staff_setups ON shifts_staff_setups.staff_setup_id = staff_setup.id
          JOIN public.shifts ON shifts.id = shifts_staff_setups.shift_id
          WHERE shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
          AND donor_center_blueprints.donorcenter_id = ${getData.id} LIMIT 1)`;
          sortOrder = sortOrder?.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'status') {
          sortName = 'donor_center_blueprints.is_active';
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
      } else {
        sortName = `donor_center_blueprints.id`;
        sortOrder = 'DESC';
      }
      const query = await this.donorCenterBluePrintsRepo
        .createQueryBuilder('donor_center_blueprints')
        .select(
          `(JSON_BUILD_OBJECT(
                'name', donor_center_blueprints.name,
                'is_active',donor_center_blueprints.is_active,
                'id',donor_center_blueprints.id
            )
            )`,
          'donor_center_blueprints'
        )
        .addSelect(
          `(
                SELECT JSON_AGG( JSON_BUILD_OBJECT(
                    'start_time',shifts.start_time,
                    'end_time',shifts.end_time,
                    'oef_products',shifts.oef_products,
                    'oef_procedures',shifts.oef_procedures
                )) FROM shifts WHERE shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
            )`,
          'shifts'
        )
        .addSelect(
          `(SELECT JSON_AGG(JSON_BUILD_OBJECT('qty', staff_config.qty))
    FROM staff_config
    INNER JOIN public.staff_setup ON staff_config.staff_setup_id = staff_setup.id
    INNER JOIN public.shifts_staff_setups ON shifts_staff_setups.staff_setup_id = staff_setup.id
    JOIN public.shifts ON shifts.id = shifts_staff_setups.shift_id
    WHERE shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
    AND donor_center_blueprints.donorcenter_id = ${getData.id}
  )`,
          'staff_config'
        )

        // .addSelect(
        //   `(SELECT JSON_BUILD_OBJECT(
        //       'product_count', (
        //           SELECT COUNT( products.name)

        //       )
        //   )  FROM products
        //           JOIN procedures_products ON products.id = procedures_products.product_id
        //           JOIN shifts_projections_staff ON procedures_products.procedures_id = shifts_projections_staff.procedure_type_id
        //           JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
        //           WHERE shifts.shiftable_id = donor_center_blueprints.id AND
        //           shifts.shiftable_type = 'donor_center_blueprints'
        //   )`,
        //   'Products'
        // )
        // .addSelect(
        //   `(SELECT JSON_BUILD_OBJECT(
        //             'procedure_count', (
        //                 SELECT COUNT( procedure.name)

        //             )
        //         )
        //         FROM procedure
        //           JOIN procedures_products ON procedure.id = procedures_products.procedures_id
        //           JOIN shifts_projections_staff ON procedures_products.procedures_id = shifts_projections_staff.procedure_type_id
        //           JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
        //           WHERE shifts.shiftable_id = donor_center_blueprints.id AND
        //           shifts.shiftable_type = 'donor_center_blueprints'
        //       ) `,
        //   'Procedures'
        // )

        .leftJoin('donor_center_blueprints.donorcenter_id', 'facility')
        .where(
          `donor_center_blueprints.is_archived = false AND donor_center_blueprints.donorcenter_id = ${getData?.id}`
        )
        .andWhere(
          queryParams?.keyword !== undefined
            ? `donor_center_blueprints.name ILIKE  '%${queryParams.keyword}%'`
            : '1=1'
        )

        .andWhere(
          queryParams?.status
            ? `donor_center_blueprints.is_active = ${queryParams?.status}`
            : '1=1'
        )
        .orderBy(sortName, sortOrder)
        .limit(queryParams?.limit)
        .offset((queryParams?.page - 1) * queryParams?.limit)
        .getQuery();

      const sample = await this.drivesRepository.query(query);

      const queryCount = await this.donorCenterBluePrintsRepo
        .createQueryBuilder('donor_center_blueprints')
        .select(
          `(JSON_BUILD_OBJECT(
                'name', donor_center_blueprints.name,
                'is_active',donor_center_blueprints.is_active,
                'id',donor_center_blueprints.id
            )
            )`,
          'donor_center_blueprints'
        )
        .addSelect(
          `(
                SELECT JSON_AGG( JSON_BUILD_OBJECT(
                    'start_time',shifts.start_time,
                    'end_time',shifts.end_time,
                    'oef_products',shifts.oef_products,
                    'oef_procedures',shifts.oef_procedures
                )) FROM shifts WHERE shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
            )`,
          'shifts'
        )
        .addSelect(
          `(SELECT JSON_AGG(JSON_BUILD_OBJECT('qty', staff_config.qty))
          FROM staff_config
          INNER JOIN public.staff_setup ON staff_config.staff_setup_id = staff_setup.id
          INNER JOIN public.shifts_staff_setups ON shifts_staff_setups.staff_setup_id = staff_setup.id
          JOIN public.shifts ON shifts.id = shifts_staff_setups.shift_id
          WHERE shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
          AND donor_center_blueprints.donorcenter_id = ${getData.id}
        )`,
          'staff_config'
        )

        // .addSelect(
        //   `(SELECT JSON_BUILD_OBJECT(
        //       'product_count', (
        //           SELECT COUNT( products.name)

        //       )
        //   )  FROM products
        //           JOIN procedures_products ON products.id = procedures_products.product_id
        //           JOIN shifts_projections_staff ON procedures_products.procedures_id = shifts_projections_staff.procedure_type_id
        //           JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
        //           WHERE shifts.shiftable_id = donor_center_blueprints.id AND
        //           shifts.shiftable_type = 'donor_center_blueprints'
        //   )`,
        //   'Products'
        // )
        // .addSelect(
        //   `(SELECT JSON_BUILD_OBJECT(
        //             'procedure_count', (
        //                 SELECT COUNT( procedure.name)

        //             )
        //         )
        //         FROM procedure
        //           JOIN procedures_products ON procedure.id = procedures_products.procedures_id
        //           JOIN shifts_projections_staff ON procedures_products.procedures_id = shifts_projections_staff.procedure_type_id
        //           JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
        //           WHERE shifts.shiftable_id = donor_center_blueprints.id AND
        //           shifts.shiftable_type = 'donor_center_blueprints'
        //       ) `,
        //   'Procedures'
        // )

        .leftJoin('donor_center_blueprints.donorcenter_id', 'facility')
        .where(
          `donor_center_blueprints.is_archived = false AND donor_center_blueprints.donorcenter_id = ${getData?.id}`
        )
        .andWhere(
          queryParams?.keyword !== undefined
            ? `donor_center_blueprints.name ILIKE  '%${queryParams.keyword}%'`
            : '1=1'
        )

        .andWhere(
          queryParams?.status
            ? `donor_center_blueprints.is_active = ${queryParams?.status}`
            : '1=1'
        )
        .orderBy(sortName, sortOrder)
        // .limit(queryParams?.limit)
        // .offset((queryParams?.page - 1) * queryParams?.limit)
        .getQuery();

      const Samplecount = await this.drivesRepository.query(queryCount);
      const count = Samplecount?.length;

      if (!getData) {
        return resError('facilty id not found', ErrorConstants.Error, 400);
      }
      return resSuccess(
        'records found.',
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

  async getStagingSitesandDonorCenters(
    query: GetDonorCenterStagingSitesInterface
  ) {
    try {
      // const daily_capacities = await this.dailyCapacityRepo
      //   .createQueryBuilder('daily_capacity')
      //   .innerJoinAndSelect(
      //     'daily_capacity.collection_operation',
      //     'business_units'
      //   )
      //   .where('business_units.id = :businessUnitId', {
      //     businessUnitId: query.collection_operation,
      //   })
      //   .getOne();
      // const driveDate = moment(query.drive_date);
      // const dayName = driveDate.format('dddd');

      // const abbreviations = {
      //   Sunday: 'sun',
      //   Monday: 'mon',
      //   Tuesday: 'tue',
      //   Wednesday: 'wed',
      //   Thursday: 'thur',
      //   Friday: 'fri',
      //   Saturday: 'sat',
      // };
      // const driveDay = abbreviations[dayName];
      // const maxDrives = daily_capacities[`${driveDay}_max_drives`];
      // const maxStaff = daily_capacities[`${driveDay}_max_staff`];
      // console.log({ maxDrives, maxStaff });

      // const drivesOnDriveDate = await this.drivesRepository.find({
      //   select: ['id'],
      //   where: { date: new Date(moment(driveDate).format('YYYY-MM-DD')) },
      // });

      // const driveIds = drivesOnDriveDate?.map((item) => item.id);
      // console.log(driveIds);

      // const driveStaffSetupDetails: any = await this.shiftsRepo.find({
      //   where: {
      //     shiftable_id: In(driveIds),
      //     shiftable_type: shiftable_type_enum.DRIVES,
      //   },
      //   relations: [
      //     'staff_setups',
      //     'staff_setups.staff_setup_id',
      //     'staff_setups.staff_setup_id.staff_configuration',
      //     'staff_setups.staff_setup_id.staff_configuration.contact_role_id',
      //   ],
      // });

      // let utilizedStaff = 0;

      // for (const drive of driveStaffSetupDetails) {
      //   const driveStaffSetups = drive.staff_setups;
      //   for (const staffSetupItem of driveStaffSetups) {
      //     for (const staffConfig of staffSetupItem.staff_setup_id
      //       .staff_configuration) {
      //       const qty = staffConfig.qty;
      //       const oef = staffConfig.contact_role_id.oef_contribution;
      //       utilizedStaff += (parseInt(qty) * parseFloat(oef)) / 100;
      //     }
      //   }
      // }
      // console.log(utilizedStaff);
      const result = await this.facilityRepository
        .createQueryBuilder('facility')
        .leftJoinAndSelect(
          'facility.collection_operation',
          'collection_operation'
        )
        .where(`facility.tenant_id = ${this.request.user.tenant.id}`)
        .andWhere('facility.donor_center = true OR facility.staging_site =true')
        .getMany();
      const response = [];
      for (const facility of result) {
        if (
          response?.filter(
            (item) =>
              item.collection_operation.id == facility.collection_operation.id
          ).length
        ) {
          continue;
        }
        const responseItem = {
          collection_operation: {
            id: facility.collection_operation.id,
            name: facility.collection_operation.name,
          },
          availableStaff: 0,
          type:
            facility.staging_site == true
              ? 'Staging Site'
              : facility.donor_center
              ? 'Donor Center'
              : facility.donor_center && facility.staging_site
              ? 'Staging Site / Donor Center'
              : 'N/A',
        };

        const daily_capacities = await this.dailyCapacityRepo
          .createQueryBuilder('daily_capacity')
          .innerJoinAndSelect(
            'daily_capacity.collection_operation',
            'business_units'
          )
          .where('business_units.id = :businessUnitId', {
            businessUnitId: facility.collection_operation.id,
          })
          .getOne();
        if (daily_capacities) {
          const driveDate = moment(query.drive_date);
          const dayName = driveDate.format('dddd');

          const abbreviations = {
            Sunday: 'sun',
            Monday: 'mon',
            Tuesday: 'tue',
            Wednesday: 'wed',
            Thursday: 'thur',
            Friday: 'fri',
            Saturday: 'sat',
          };
          const driveDay = abbreviations[dayName];
          const maxDrives = daily_capacities[`${driveDay}_max_drives`];
          const maxStaff = daily_capacities[`${driveDay}_max_staff`];

          console.log({ driveDay, maxDrives, maxStaff });
          const drivesOnDriveDate = await this.drivesRepository.find({
            select: ['id'],
            relations: ['account'],
            where: {
              date: new Date(moment(driveDate).format('YYYY-MM-DD')),
              account: {
                collection_operation: {
                  id: facility.collection_operation.id,
                },
              },
            },
          });

          const driveIds = drivesOnDriveDate?.map((item) => item.id);
          console.log({ driveIds });
          const driveStaffSetupDetails: any = await this.shiftsRepo.find({
            where: {
              shiftable_id: In(driveIds),
              shiftable_type: shiftable_type_enum.DRIVES,
            },
            relations: [
              'staff_setups',
              'staff_setups.staff_setup_id',
              'staff_setups.staff_setup_id.staff_configuration',
              'staff_setups.staff_setup_id.staff_configuration.contact_role_id',
            ],
          });

          let utilizedStaff = 0;
          for (const drive of driveStaffSetupDetails) {
            const driveStaffSetups = drive.staff_setups;
            for (const staffSetupItem of driveStaffSetups) {
              for (const staffConfig of staffSetupItem.staff_setup_id
                .staff_configuration) {
                const qty = staffConfig.qty;
                const oef = staffConfig.contact_role_id.oef_contribution;
                utilizedStaff += (parseInt(qty) * parseFloat(oef)) / 100;
              }
            }
            console.log({ utilizedStaff });
          }
          if (utilizedStaff < maxStaff) {
            responseItem.availableStaff = maxStaff - utilizedStaff;
          }

          response.push(responseItem);
        }
      }
      return resSuccess(
        'Staging sites and Donor centers found.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        response
      );
    } catch (error) {
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
