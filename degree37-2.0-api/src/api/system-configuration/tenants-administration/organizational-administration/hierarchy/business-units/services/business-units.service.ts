import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, Equal, In } from 'typeorm';
import { User } from '../../../../../tenants-administration/user-administration/user/entity/user.entity';
import {
  resError,
  resSuccess,
} from '../../../../../../system-configuration/helpers/response';
import { ErrorConstants } from '../../../../../../system-configuration/constants/error.constants';
import { SuccessConstants } from '../../../../../../system-configuration/constants/success.constants';
import {
  BusinessUnitDto,
  GetAllBusinessUnitDto,
} from '../dto/business-units.dto';
import { BusinessUnits } from '../entities/business-units.entity';
import { OrganizationalLevels } from '../../organizational-levels/entities/organizational-level.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { HistoryService } from '../../../../../../common/services/history.service';
import { BusinessUnitsHistory } from '../entities/business-units-history.entity';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';
import { QueryBusinessUnitDto } from '../dto/query-business-units.dto';
@Injectable()
export class BusinessUnitsService extends HistoryService<BusinessUnitsHistory> {
  constructor(
    @InjectRepository(BusinessUnits)
    private readonly businessUnitsRepository: Repository<BusinessUnits>,
    @InjectRepository(OrganizationalLevels)
    private readonly organizationalLevelRepository: Repository<OrganizationalLevels>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(BusinessUnitsHistory)
    private readonly businessUnitsHistoryRepository: Repository<BusinessUnitsHistory>
  ) {
    super(businessUnitsHistoryRepository);
  }

  async create(businessUnitsDto: BusinessUnitDto) {
    try {
      const user = await this.userRepository.findOneBy({
        id: businessUnitsDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const tenant = await this.tenantRepository.findOne({
        where: { id: businessUnitsDto?.tenant_id },
      });

      if (!tenant) {
        throw new HttpException(`Tenant not found.`, HttpStatus.NOT_FOUND);
      }

      const businessUnitsWithSameName =
        await this.businessUnitsRepository.findOne({
          where: {
            name: ILike(businessUnitsDto.name),
            tenant_id: { id: tenant.id },
            is_archived: false,
          },
        });

      if (businessUnitsWithSameName) {
        throw new HttpException(
          `Business already exists.`,
          HttpStatus.NOT_FOUND
        );
      }

      let parentLevel = null;
      if (businessUnitsDto?.parent_level_id) {
        parentLevel = await this.businessUnitsRepository.findOne({
          where: { id: businessUnitsDto?.parent_level_id },
        });

        if (!parentLevel) {
          throw new HttpException(
            `Parent Business Unit not found.`,
            HttpStatus.NOT_FOUND
          );
        }
      }

      const organizationalLevel =
        await this.organizationalLevelRepository.findOne({
          where: { id: businessUnitsDto?.organizational_level_id },
        });

      if (!organizationalLevel) {
        throw new HttpException(
          `Organizational Level not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      const businessUnits: any = new BusinessUnits();

      businessUnits.name = businessUnitsDto.name;
      businessUnits.is_active = businessUnitsDto.is_active;
      businessUnits.created_by = businessUnitsDto.created_by;
      businessUnits.parent_level = parentLevel;
      businessUnits.organizational_level_id = organizationalLevel;
      businessUnits.tenant_id = tenant;
      businessUnits.is_archived = false;

      const savedBusinessUnits = await this.businessUnitsRepository.save(
        businessUnits
      );

      return resSuccess(
        'Business Unit Created Successfully', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedBusinessUnits
      );
    } catch (error) {
      // return error
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Business units create >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async listAll(tenant_id: any, query: QueryBusinessUnitDto) {
    const buQuery = this.businessUnitsRepository
      .createQueryBuilder('bu')
      .leftJoinAndSelect(
        'bu.organizational_level_id',
        'ol',
        'ol.is_archived = false'
      )
      .leftJoinAndSelect(
        'bu.parent_level',
        'parent',
        'parent.is_archived = false'
      )
      .where({ is_archived: false, tenant_id: { id: tenant_id } })
      .groupBy('bu.id, parent.id, ol.id')
      .orderBy('parent.id', 'DESC');

    if (query?.status) {
      buQuery.andWhere({
        is_active: query.status === 'true',
      });
    }
    if (query?.organizational_level_id) {
      buQuery.andWhere('ol.id = :ol_id', {
        ol_id: query.organizational_level_id,
      });
    }
    if (query?.parent_level_id === 'null') {
      buQuery.andWhere('parent IS NULL');
    } else if (query?.parent_level_id) {
      buQuery.andWhere('parent.id = :parent_id', {
        parent_id: query.parent_level_id,
      });
    }
    if (query?.donor_centers && query?.donor_centers === 'true') {
      buQuery
        .leftJoin(
          'facility',
          'facility',
          'bu.id = facility.collection_operation AND facility.is_archived = false AND facility.donor_center = true'
        )
        .addSelect(
          `COALESCE(JSON_AGG(facility) FILTER (WHERE facility.id IS NOT NULL), '[]'::json)`,
          'donor_centers'
        );
    }
    if (query?.recruiters && query?.recruiters === 'true') {
      const userQuery = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect(
          'user.role',
          'role',
          'role.is_archived = false AND role.is_recruiter = true'
        )
        .leftJoin(
          'user_business_units',
          'user_bu',
          'user.id = user_bu.user_id AND user_bu.is_archived = false'
        )
        .addSelect('user_bu.business_unit_id', 'business_unit_id')
        .where('user.is_archived = false AND role.id IS NOT NULL');
      buQuery
        .leftJoin(
          `(${userQuery.getQuery()})`,
          'users',
          'bu.id = users.business_unit_id'
        )
        .addSelect(
          `COALESCE(JSON_AGG(users) FILTER (WHERE users.user_id IS NOT NULL), '[]'::json)`,
          'recruiters'
        );
    }

    const [result, count] = await Promise.all([
      buQuery.getRawMany(),
      buQuery.getCount(),
    ]);

    return resSuccess(
      'Business Unit fetched Successfully',
      SuccessConstants.SUCCESS,
      HttpStatus.OK,
      { result, count }
    );
  }

  async getAlltBusinessUnits(getAllFacilitiesInterface: GetAllBusinessUnitDto) {
    try {
      const { keyword } = getAllFacilitiesInterface;
      const limit = Number(getAllFacilitiesInterface?.limit);
      let page = Number(getAllFacilitiesInterface?.page);

      const parent_level_id = Number(
        getAllFacilitiesInterface?.parent_level_id
      );
      const organizational_level_id = Number(
        getAllFacilitiesInterface?.organizational_level_id
      );
      const getTotalPage = (totalData: number, limit: number) => {
        return Math.ceil(totalData / limit);
      };
      if (page <= 0) {
        throw new HttpException(
          `page must of positive integer`,
          HttpStatus.BAD_REQUEST
        );
      }
      const where: any = {
        is_archived: false,
        tenant_id: { id: getAllFacilitiesInterface.tenant_id },
      };
      if (
        getAllFacilitiesInterface.status != undefined &&
        getAllFacilitiesInterface.status != ''
      ) {
        const status =
          getAllFacilitiesInterface?.status?.toLocaleLowerCase() != 'false';
        where.is_active = status;
      }

      if (parent_level_id !== undefined && !Number.isNaN(parent_level_id)) {
        where.parent_level = Equal(parent_level_id);
      }

      if (
        organizational_level_id !== undefined &&
        !Number.isNaN(organizational_level_id)
      ) {
        where.organizational_level_id = Equal(organizational_level_id);
      }

      if (keyword != undefined) {
        page = 1;
        where.name = ILike(`%${keyword}%`);
      }

      let order: any = { id: 'DESC' }; // Default order

      if (getAllFacilitiesInterface?.sortBy) {
        // Allow sorting by different columns

        if (getAllFacilitiesInterface?.sortBy == 'parent_level_id') {
          const orderBy = getAllFacilitiesInterface.sortBy;
          const orderDirection = getAllFacilitiesInterface.sortOrder || 'DESC';
          order = { parent_level: { name: orderDirection } };
        } else if (
          getAllFacilitiesInterface?.sortBy == 'organizational_level_id'
        ) {
          const orderBy = getAllFacilitiesInterface.sortBy;
          const orderDirection = getAllFacilitiesInterface.sortOrder || 'DESC';
          order = { organizational_level_id: { name: orderDirection } };
        } else if (getAllFacilitiesInterface?.sortBy == 'is_active') {
          const orderBy = getAllFacilitiesInterface.sortBy;
          const orderDirection = getAllFacilitiesInterface.sortOrder || 'DESC';
          order = { [orderBy]: orderDirection };
        } else {
          const orderBy = getAllFacilitiesInterface.sortBy;
          const orderDirection = getAllFacilitiesInterface.sortOrder || 'DESC';
          order = { [orderBy]: orderDirection };
        }
      }
      const skip = page && limit ? (page - 1) * limit : 0;
      const take = page && limit ? limit : undefined;
      const [records, count] = await this.businessUnitsRepository.findAndCount({
        where,
        skip,
        take,
        relations: ['organizational_level_id', 'parent_level'],
        order,
      });

      return {
        total_records: count,
        page_number: page,
        totalPage: getTotalPage(count, limit),
        data: records,
      };
    } catch (error) {
      return [];
    }
  }

  async getUserCollectionOperations(user: any, id = null, isFilter = null) {
    try {
      const recruiterId = id && id !== 'undefined' ? id : user?.id;
      const userData: any = await this.userRepository.findOne({
        where: {
          id: recruiterId,
        },
        relations: [
          'role',
          'tenant',
          'assigned_manager',
          'business_units',
          'business_units.business_unit_id',
          'hierarchy_level',
        ],
      });

      const where: any = { is_archived: false };

      if (!isFilter) {
        where['is_active'] = true;
      }

      let businessUnits: any = [];
      const userBusinessUnitIds = userData?.business_units?.map(
        (bu) => bu.business_unit_id.id
      );

      if (
        userBusinessUnitIds.length ||
        userData?.all_hierarchy_access ||
        userData?.role?.is_auto_created
      ) {
        let parentBusinessUnits = userBusinessUnitIds;

        if (userData?.role?.is_auto_created) {
          const businessUnitData = await this.businessUnitsRepository.find({
            where: {
              ...where,
              tenant_id: { id: userData?.tenant?.id },
              parent_level: null,
            },
          });
          parentBusinessUnits = businessUnitData.map(
            (businessUnit) => businessUnit.id
          );
        }

        while (!businessUnits.length) {
          const businessUnitData = await this.businessUnitsRepository.find({
            where: {
              ...where,
              tenant_id: { id: userData?.tenant?.id },
              parent_level: In(parentBusinessUnits),
            },
            relations: ['parent_level', 'tenant_id', 'organizational_level_id'],
          });

          if (businessUnitData.length) {
            const collectionOperations = businessUnitData.map(
              (businessUnit) =>
                businessUnit.organizational_level_id.is_collection_operation
            );
            if (collectionOperations.includes(true)) {
              businessUnits = businessUnitData;
            } else {
              parentBusinessUnits = businessUnitData.map(
                (businessUnit) => businessUnit.id
              );
            }
          } else {
            const businessUnitData: any =
              await this.businessUnitsRepository.findOne({
                where: {
                  ...where,
                  tenant_id: { id: userData?.tenant?.id },
                  id: In(userBusinessUnitIds),
                },
                relations: [
                  'parent_level',
                  'tenant_id',
                  'organizational_level_id',
                ],
              });
            if (
              businessUnitData &&
              businessUnitData?.organizational_level_id?.is_collection_operation
            ) {
              businessUnits = [businessUnitData];
            }
            break;
          }
        }
      }

      return resSuccess(
        SuccessConstants.SUCCESS,
        'Collection Operations fetched',
        HttpStatus.OK,
        businessUnits
      );
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Business units getBusinessUnits >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getBusinessUnit(id: any) {
    try {
      if (!Number(id)) {
        throw new HttpException(`Invalid Id`, HttpStatus.NOT_FOUND);
      }
      const businessUnits = await this.businessUnitsRepository.findOne({
        where: {
          id: id as any,
        },
        relations: ['parent_level', 'organizational_level_id', 'created_by'],
      });

      const modifiedData: any = await getModifiedDataDetails(
        this.businessUnitsHistoryRepository,
        id,
        this.userRepository
      );
      return { ...businessUnits, ...modifiedData };
    } catch (error) {
      return { error };
    }
  }

  async updateBusinessUnit(id: any, businessUnitsDto: BusinessUnitDto) {
    try {
      id = Number(id);
      // if (!id) {
      //   throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      // }

      const businessUnitData = await this.businessUnitsRepository.findOne({
        relations: [
          'created_by',
          'organizational_level_id',
          'parent_level',
          'tenant_id',
        ],
        where: { id: id },
      });

      let parent_level = null;
      if (businessUnitsDto?.parent_level_id) {
        parent_level = await this.businessUnitsRepository.findOne({
          where: { id: businessUnitsDto?.parent_level_id },
        });
      }
      if (!businessUnitData) {
        throw new HttpException(
          `Business Unit not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      const dataToUpdate = {
        name: businessUnitsDto?.name,
        organizational_level_id: businessUnitsDto?.organizational_level_id,
        tenant_id: businessUnitsDto?.tenant_id,
        parent_level: parent_level,
        is_active: businessUnitsDto?.is_active,
        created_by: businessUnitsDto?.created_by,
      };

      await this.businessUnitsRepository.update(
        {
          id: id as any,
        },
        dataToUpdate as any
      );

      const businessUnitsHistory = new BusinessUnitsHistory();
      Object.assign(businessUnitsHistory, businessUnitData);
      businessUnitsHistory.history_reason = 'C';
      businessUnitsHistory.id = businessUnitData.id;
      businessUnitsHistory.name = businessUnitData?.name;
      businessUnitsHistory.organizational_level_id =
        businessUnitData?.organizational_level_id?.id ?? null;
      businessUnitsHistory.tenant_id = businessUnitData?.tenant_id?.id;
      businessUnitsHistory.parent_level =
        businessUnitData?.parent_level?.id ?? null;
      businessUnitsHistory.is_active = businessUnitData?.is_active;
      businessUnitsHistory.is_archived = businessUnitData?.is_archived;
      businessUnitsHistory.tenant_id = businessUnitData?.tenant_id?.id || null;
      businessUnitsHistory.created_by = businessUnitsDto?.updated_by;
      delete businessUnitsHistory?.created_at;
      await this.createHistory(businessUnitsHistory);

      return resSuccess(
        '', // message
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        {}
      );
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Business units update >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async archiveBusinessUnit(id: any, updatedBy: any) {
    try {
      const businessUnitToUpdate = await this.businessUnitsRepository.findOne({
        relations: [
          'created_by',
          'organizational_level_id',
          'parent_level',
          'tenant_id',
        ],
        where: { id: id },
      });
      if (!businessUnitToUpdate) {
        throw new HttpException(
          `Business Unit not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      if (
        businessUnitToUpdate?.organizational_level_id?.name ===
        'Collection Operation'
      ) {
        const collectionOperationRes = await this.businessUnitsRepository
          .createQueryBuilder('businessUnit')
          .innerJoinAndSelect(
            'equipments_collection_operations',
            'equipment',
            'businessUnit.id = equipment.collection_operation_id'
          )
          .where('businessUnit.id = :business_unit_id', {
            business_unit_id: businessUnitToUpdate?.id,
          })
          .andWhere('businessUnit.is_archived = :is_archived', {
            is_archived: false,
          })
          .getOne();

        if (collectionOperationRes != null) {
          throw new HttpException(
            `You cant archive this since some records depend on it. `,
            HttpStatus.CONFLICT
          );
        }
      }

      if (businessUnitToUpdate.is_archived === false) {
        businessUnitToUpdate.is_archived = true;
        const businessArchive = await this.businessUnitsRepository.save(
          businessUnitToUpdate
        );
      } else {
        throw new HttpException(
          `Business Unit is already archived.`,
          HttpStatus.NOT_FOUND
        );
      }
      const businessUnitsHistory = new BusinessUnitsHistory();
      Object.assign(businessUnitsHistory, businessUnitToUpdate);
      businessUnitsHistory.history_reason = 'C';
      businessUnitsHistory.id = businessUnitToUpdate.id;
      businessUnitsHistory.name = businessUnitToUpdate?.name;
      businessUnitsHistory.organizational_level_id =
        businessUnitToUpdate?.organizational_level_id?.id ?? null;
      businessUnitsHistory.tenant_id = businessUnitToUpdate?.tenant_id?.id;
      businessUnitsHistory.parent_level =
        businessUnitToUpdate?.parent_level?.id ?? null;
      businessUnitsHistory.is_active = businessUnitToUpdate?.is_active;
      businessUnitsHistory.is_archived = businessUnitToUpdate?.is_archived;
      businessUnitsHistory.tenant_id =
        businessUnitToUpdate?.tenant_id?.id || null;
      businessUnitsHistory.created_by = updatedBy;
      delete businessUnitsHistory?.created_at;
      await this.createHistory(businessUnitsHistory);
      businessUnitsHistory.history_reason = 'D';
      await this.createHistory(businessUnitsHistory);

      return resSuccess(
        'Business Unit Archived successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Business units archive >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
