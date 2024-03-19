import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { BusinessUnits } from '../../../system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { User } from '../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import {
  resError,
  resSuccess,
} from '../../../system-configuration/helpers/response';
import { SuccessConstants } from '../../../system-configuration/constants/success.constants';
import { ErrorConstants } from '../../../system-configuration/constants/error.constants';
import { Tenant } from '../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { CreateNonCollectionProfileDto } from '../dto/non-collection-profile.dto';
import { Category } from 'src/api/system-configuration/tenants-administration/crm-administration/common/entity/category.entity';
import { CategoryHistory } from 'src/api/system-configuration/tenants-administration/crm-administration/common/entity/categoryhistory.entity';
import { CrmNonCollectionProfiles } from '../entities/crm-non-collection-profiles.entity';
import { UpdateNonCollectionProfileDto } from '../dto/update-non-collection-profile.dto';
import { CrmNonCollectionProfilesHistory } from '../entities/crm-non-collection-profile-history.entity';
import { HistoryService } from '../../../common/services/history.service';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { NonCollectionProfileInterface } from '../interface/non-collection-profile.interface';
import moment from 'moment';
import { NonCollectionProfileEventHistoryInterface } from '../interface/non-collection-profile-history.interface';
import { appliesToEnum } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/enums/operation-status.enum';

@Injectable()
export class NonCollectionProfileService extends HistoryService<CrmNonCollectionProfilesHistory> {
  constructor(
    @InjectRepository(BusinessUnits)
    private readonly businessUnitsRepository: Repository<BusinessUnits>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly nceCategoryRepository: Repository<Category>,
    @InjectRepository(CrmNonCollectionProfiles)
    private readonly nonCollectionProfilesRepository: Repository<CrmNonCollectionProfiles>,
    @InjectRepository(CrmNonCollectionProfilesHistory)
    private readonly nonCollectionProfilesHistoryRepository: Repository<CrmNonCollectionProfilesHistory>
  ) {
    super(nonCollectionProfilesHistoryRepository);
  }

  async create(
    createNonCollectionProfileDto: CreateNonCollectionProfileDto,
    user: any
  ) {
    try {
      const {
        profile_name,
        alternate_name,
        event_category_id,
        event_subcategory_id,
        collection_operation_id,
        owner_id,
        is_active,
      } = createNonCollectionProfileDto;
      const owner = await this.userRepository.findOneBy({
        id: owner_id,
      });
      if (!owner) {
        throw new HttpException(`Owner not found.`, HttpStatus.NOT_FOUND);
      }
      const businessUnits = await this.businessUnitsRepository.find({
        where: {
          id: In(collection_operation_id),
        },
      });
      if (!businessUnits) {
        throw new HttpException(
          `Collection operations not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      const nonCollectionProfile = new CrmNonCollectionProfiles();
      nonCollectionProfile.created_by = user;
      nonCollectionProfile.tenant_id = user.tenant;
      nonCollectionProfile.profile_name = profile_name;
      nonCollectionProfile.alternate_name = alternate_name;
      nonCollectionProfile.event_category_id = event_category_id;
      nonCollectionProfile.event_subcategory_id = event_subcategory_id || null;
      nonCollectionProfile.is_archived = false;
      nonCollectionProfile.is_active = is_active;
      nonCollectionProfile.collection_operation_id = businessUnits;
      nonCollectionProfile.owner_id = owner;

      const savedNonCollectionProfile =
        await this.nonCollectionProfilesRepository.save(nonCollectionProfile);

      delete savedNonCollectionProfile.created_by.password;
      delete savedNonCollectionProfile.owner_id.password;

      return resSuccess(
        'Non-Collection profile created successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedNonCollectionProfile
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findOne(id: any) {
    try {
      const nonCollectionProfile: any =
        await this.nonCollectionProfilesRepository.findOne({
          where: { id: id, is_archived: false },
          relations: [
            'created_by',
            'collection_operation_id',
            'owner_id',
            'tenant_id',
            'event_subcategory_id',
            'event_category_id',
          ],
        });

      if (!nonCollectionProfile) {
        throw new HttpException(
          `Non-Collection profile not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      const modifiedData = await getModifiedDataDetails(
        this.nonCollectionProfilesHistoryRepository,
        id,
        this.userRepository
      );
      const modified_by = modifiedData['modified_by'];
      const modified_at = modifiedData['modified_at'];

      return resSuccess(
        'Non-Collection profile fetched successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        {
          ...nonCollectionProfile,
          modified_by: modified_by,
          modified_at: modified_at,
        }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getEventHistory(id, params: NonCollectionProfileEventHistoryInterface) {
    try {
      const CrmNonCollectionProfilesData =
        await this.nonCollectionProfilesRepository.find({
          where: {
            id: id,
          },
        });
      if (!CrmNonCollectionProfilesData) {
        throw new HttpException(
          'Crm non collection profile not found',
          HttpStatus.GONE
        );
      }
      const applies_to = [appliesToEnum.drives];
      let { page, limit } = params;

      limit = limit ? +limit : +process.env.PAGE_SIZE;

      page = page ? +page : 1;

      const events = this.nonCollectionProfilesRepository
        .createQueryBuilder('crm_non_collection_profiles')
        .innerJoinAndSelect(
          'oc_non_collection_events',
          'oc_non_collection_events',
          `oc_non_collection_events.non_collection_profile_id = ${id}`
        )
        .innerJoinAndSelect(
          'crm_locations',
          'crm_locations',
          'crm_locations.id = oc_non_collection_events.location_id'
        )
        .innerJoinAndSelect(
          'operations_status',
          'operations_status',
          `operations_status.id = oc_non_collection_events.status_id`
        )
        .where({
          is_archived: false,
          id: id,
        })
        .select([
          'crm_non_collection_profiles.id as ID',
          'crm_non_collection_profiles.is_archived as is_archived',
          'oc_non_collection_events.event_name AS event_name',
          'oc_non_collection_events.date AS Date',
          'oc_non_collection_events.id AS eventid',
          'crm_locations.name AS location',
          'operations_status.name AS event_status',
        ])
        .limit(limit)
        .offset((page - 1) * limit);
      events.andWhere('operations_status.applies_to = :applies_to', {
        applies_to: applies_to,
      });
      if (params?.selected_date) {
        const selected_date = params.selected_date?.split(',');

        const startDate = moment(new Date(selected_date[0]))
          .startOf('day')
          .format('YYYY-MM-DD');
        const endDate = moment(new Date(selected_date[1]))
          .endOf('day')
          .add(1, 'days')
          .format('YYYY-MM-DD');

        events.andWhere(
          'oc_non_collection_events.date Between :startDate AND :endDate',
          { startDate, endDate }
        );
      }
      if (params?.status) {
        events.andWhere('operations_status.name = :name', {
          name: params?.status,
        });
      }
      if (params?.keyword) {
        events.andWhere(
          `oc_non_collection_events.event_name ILike :eventName`,
          {
            eventName: `%${params?.keyword}%`,
          }
        );
      }
      if (params.sortBy) {
        const orderDirection: any = params.sortOrder || 'DESC';
        if (params.sortBy == 'status') {
          events.addOrderBy('operations_status.name', orderDirection);
        } else if (params.sortBy == 'location') {
          events.addOrderBy('crm_locations.name', orderDirection);
        } else if (params.sortBy == 'event_name') {
          events.addOrderBy(
            'oc_non_collection_events.event_name',
            orderDirection
          );
        } else if (params.sortBy == 'date') {
          events.addOrderBy('oc_non_collection_events.date', orderDirection);
        } else {
          const orderBy = params.sortBy;
          events.addOrderBy(orderBy, orderDirection);
        }
      }
      const data = await events.getRawMany();
      const total_records = await events.getCount();
      return {
        status: SuccessConstants.SUCCESS,
        message: 'Non collection events fetched successfully',
        status_code: HttpStatus.CREATED,
        total_records: total_records,
        data: data,
      };
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Non Collection Profile History  findAll >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(
        error.message,
        ErrorConstants.Error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: any,
    updateNonCollectionProfileDto: UpdateNonCollectionProfileDto,
    req
  ) {
    try {
      const {
        profile_name,
        alternate_name,
        event_category_id,
        event_subcategory_id,
        collection_operation_id,
        owner_id,
        is_active,
      } = updateNonCollectionProfileDto;

      const nonCollectionProfile: any =
        await this.nonCollectionProfilesRepository.findOne({
          where: { id: id },
          relations: [
            'created_by',
            'collection_operation_id',
            'owner_id',
            'tenant_id',
            'event_subcategory_id',
            'event_category_id',
          ],
        });

      if (!nonCollectionProfile) {
        throw new HttpException(
          `Non-Collection profile not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      if (nonCollectionProfile?.is_archived) {
        throw new HttpException(
          `Non-Collection profile is archived.`,
          HttpStatus.NOT_FOUND
        );
      }

      if (event_category_id == BigInt(0)) {
        throw new HttpException(
          `Invalid event category Id`,
          HttpStatus.NOT_FOUND
        );
      }

      if (owner_id == BigInt(0)) {
        throw new HttpException(`Invalid owner Id`, HttpStatus.NOT_FOUND);
      }

      if (event_category_id) {
        const category = await this.nceCategoryRepository.findOneBy({
          id: event_category_id,
        });

        if (!category) {
          throw new HttpException(
            'Event category does not exist!',
            HttpStatus.NOT_FOUND
          );
        }
      }

      if (event_subcategory_id) {
        const subCategory = await this.nceCategoryRepository.findOne({
          where: { id: event_subcategory_id },
          relations: ['parent_id'],
        });

        if (!subCategory || (subCategory && !subCategory?.parent_id)) {
          throw new HttpException(
            'Event subcategory does not exist!',
            HttpStatus.CONFLICT
          );
        }
      }

      const businessUnits = await this.businessUnitsRepository.find({
        where: {
          id: In(collection_operation_id),
        },
      });
      if (!businessUnits) {
        throw new HttpException(
          `Collection operations not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      const ncpBeforeUpdate = { ...nonCollectionProfile };

      nonCollectionProfile.profile_name =
        profile_name ?? nonCollectionProfile.profile_name;
      nonCollectionProfile.alternate_name =
        alternate_name ?? nonCollectionProfile.alternate_name;
      nonCollectionProfile.event_category_id =
        event_category_id ?? nonCollectionProfile?.event_category_id?.id;
      nonCollectionProfile.event_subcategory_id = event_subcategory_id || null;
      nonCollectionProfile.collection_operation_id = businessUnits;
      nonCollectionProfile.owner_id =
        owner_id ?? nonCollectionProfile.owner_id?.id;
      nonCollectionProfile.is_active =
        is_active ?? nonCollectionProfile?.is_active;

      const updatedNCP = await this.nonCollectionProfilesRepository.save(
        nonCollectionProfile
      );
      const ncptHistory = new CrmNonCollectionProfilesHistory();
      Object.assign(ncptHistory, ncpBeforeUpdate);

      ncptHistory.alternate_name = ncpBeforeUpdate?.alternate_name;
      ncptHistory.profile_name = ncpBeforeUpdate?.profile_name;
      ncptHistory.collection_operation_id = null;
      ncptHistory.event_category_id = ncpBeforeUpdate?.event_category_id?.id;
      ncptHistory.event_subcategory_id =
        ncpBeforeUpdate?.event_subcategory_id?.id;
      ncptHistory.tenant_id = ncpBeforeUpdate?.tenant_id?.id;
      ncptHistory.owner_id = ncpBeforeUpdate?.owner_id?.id;
      ncptHistory.created_by = req?.user?.id;
      ncptHistory.is_archived = ncpBeforeUpdate?.is_archived;
      ncptHistory.history_reason = 'C';
      delete ncptHistory?.created_at;
      await this.createHistory(ncptHistory);

      const ncpData = await this.nonCollectionProfilesRepository.findOne({
        where: { id },
        relations: [
          'created_by',
          'collection_operation_id',
          'owner_id',
          'tenant_id',
          'event_subcategory_id',
          'event_category_id',
        ],
      });

      return resSuccess(
        'Non-Collection profile Updated successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        ncpData
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async archive(id: any, req: any) {
    try {
      const nonCollectionProfile: any =
        await this.nonCollectionProfilesRepository.findOne({
          where: { id: id },
          relations: [
            'created_by',
            'collection_operation_id',
            'owner_id',
            'tenant_id',
            'event_subcategory_id',
            'event_category_id',
          ],
        });

      if (!nonCollectionProfile) {
        throw new HttpException(
          `Non-Collection profile not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      if (nonCollectionProfile.is_archived === false) {
        nonCollectionProfile.is_archived = true;
        const archivedAttachment =
          await this.nonCollectionProfilesRepository.save(nonCollectionProfile);
        const ncptHistory = new CrmNonCollectionProfilesHistory();

        Object.assign(ncptHistory, archivedAttachment);

        ncptHistory.alternate_name = archivedAttachment?.name;
        ncptHistory.profile_name = archivedAttachment?.profile_name;
        ncptHistory.collection_operation_id =
          archivedAttachment?.collection_operation_id?.id;
        ncptHistory.event_category_id =
          archivedAttachment?.event_category_id?.id;
        ncptHistory.event_subcategory_id =
          archivedAttachment?.event_subcategory_id?.id;
        ncptHistory.tenant_id = archivedAttachment?.tenant_id?.id;
        ncptHistory.owner_id = archivedAttachment?.owner_id?.id;
        ncptHistory.created_by = req?.user?.id;
        ncptHistory.is_archived = archivedAttachment?.is_archived;
        ncptHistory.history_reason = 'C';
        delete ncptHistory?.created_at;
        await this.createHistory(ncptHistory);
        ncptHistory.history_reason = 'D';
        await this.createHistory(ncptHistory);
      } else {
        throw new HttpException(
          `Non-Collection profile is already archived.`,
          HttpStatus.NOT_FOUND
        );
      }
      return resSuccess(
        '`Non-Collection profile archived successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAll(nonCollectionProfileInterface: NonCollectionProfileInterface) {
    try {
      const {
        keyword,
        event_subcategory_id,
        event_category_id,
        organizational_levels,
        tenant_id,
        sortBy,
        sortOrder,
        is_active,
        collection_operation_id,
      } = nonCollectionProfileInterface;
      let { page, limit } = nonCollectionProfileInterface;

      limit = limit ? +limit : +process.env.PAGE_SIZE;

      page = page ? +page : 1;

      let where: any = { is_archived: false, tenant_id: { id: tenant_id } };

      if (keyword) {
        where = {
          ...where,
          profile_name: ILike(`%${keyword}%`),
        };
      }

      if (event_category_id) {
        where = {
          ...where,
          event_category_id: {
            id: event_category_id,
          },
        };
      }

      if (event_subcategory_id) {
        where = {
          ...where,
          event_subcategory_id: {
            id: event_subcategory_id,
          },
        };
      }

      if (collection_operation_id) {
        const collectionOperationValues = collection_operation_id
          .split(',')
          .map((item) => item.trim());
        if (collectionOperationValues.length > 0) {
          // Use the array directly with In operator
          const query = this.nonCollectionProfilesRepository
            .createQueryBuilder('CrmNonCollectionProfiles')
            .leftJoinAndSelect(
              'CrmNonCollectionProfiles.collection_operation_id',
              'collection_operation_id'
            )
            .where(
              'collection_operation_id.id IN (:...collectionOperationValues)',
              {
                collectionOperationValues,
              }
            );
          const result = await query.getRawMany();
          const Ids = result.map((row) => row.CrmNonCollectionProfiles_id);
          where = {
            ...where,
            id: In(Ids),
          };
        } /* else {
          // Use the single value without wrapping it in an array
          where = {
            ...where,
            collection_operation_id: collectionOperationValues,
          };
        } */
      }

      if (
        is_active !== undefined &&
        is_active !== '' &&
        is_active !== 'undefined'
      ) {
        where = {
          ...where,
          is_active: is_active,
        };
      }

      if (organizational_levels) {
        const collection_operations = JSON.parse(organizational_levels);
        const whereArr = Object.keys(collection_operations).map((co_id) => ({
          ...where,
          collection_operation_id: { id: co_id },
        }));
        where = whereArr;
      }

      let order: any = { id: 'DESC' };

      if (sortBy) {
        const orderDirection = sortOrder || 'DESC';
        if (sortBy == 'event_category_id') {
          order = { event_category_id: { name: orderDirection } };
        } else if (sortBy == 'event_subcategory_id') {
          order = { event_subcategory_id: { name: orderDirection } };
        } else if (sortBy == 'collection_operation_id') {
          order = { collection_operation_id: { name: orderDirection } };
        } else if (sortBy == 'owner_id') {
          order = { owner_id: { first_name: orderDirection } };
        } else {
          const orderBy = sortBy;
          order = { [orderBy]: orderDirection };
        }
      }

      const [response, count] =
        await this.nonCollectionProfilesRepository.findAndCount({
          where,
          relations: [
            'created_by',
            'collection_operation_id',
            'owner_id',
            'tenant_id',
            'event_subcategory_id',
            'event_category_id',
          ],
          take: limit,
          skip: (page - 1) * limit,
          order,
        });

      return {
        status: HttpStatus.OK,
        message: 'Non-Collection profile Fetched successfully',
        count: count,
        data: response,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getAll(user: any) {
    try {
      const response = await this.nonCollectionProfilesRepository.find({
        where: {
          is_archived: false,
          tenant_id: { id: user.tenant.id },
        },
        relations: [
          'created_by',
          'collection_operation_id',
          'owner_id',
          'tenant_id',
          'event_subcategory_id',
          'event_category_id',
        ],
      });

      return {
        status: HttpStatus.OK,
        message: 'Non-Collection profile Fetched successfully',
        data: response,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
