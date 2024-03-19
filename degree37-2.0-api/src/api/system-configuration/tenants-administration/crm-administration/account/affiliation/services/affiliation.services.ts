import { EntityManager, ILike, In, Repository } from 'typeorm';
import { Affiliation } from '../entity/affiliation.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { CreateAffiliationDto } from '../dto/create-affiliation.dto';
import { User } from '../../../../user-administration/user/entity/user.entity';
import {
  GetAllAffiliationsInterface,
  UpdateAffiliationsInterface,
} from '../interface/affiliation.interface';
import { BusinessUnits } from '../../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { AffiliationHistory } from '../entity/affiliationHistory.entity';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { resError } from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
dotenv.config();
@Injectable()
export class AffiliationService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(AffiliationHistory)
    private readonly affiliationHistoryRepository: Repository<AffiliationHistory>,

    @InjectRepository(BusinessUnits)
    private readonly businessUnitsRepository: Repository<BusinessUnits>,

    @InjectRepository(Affiliation)
    private readonly affiliationRepository: Repository<Affiliation>,
    private readonly entityManager: EntityManager
  ) {}

  async addAffiliation(createAffiliationDto: CreateAffiliationDto) {
    const collectionOp = await this.businessUnitsRepository.find({
      where: { id: In(createAffiliationDto.collection_operation) },
    });
    if (!collectionOp) {
      throw new NotFoundException('collection Operation not found');
    }

    try {
      const newAffiliation = new Affiliation();
      newAffiliation.name = createAffiliationDto?.name;
      newAffiliation.description = createAffiliationDto?.description;
      newAffiliation.created_by = createAffiliationDto?.created_by;
      newAffiliation.is_active = createAffiliationDto.is_active;
      newAffiliation.created_at = new Date();
      newAffiliation.collection_operation = collectionOp;
      newAffiliation.tenant = this.request.user?.tenant;

      const savedAffiliation = await this.affiliationRepository.save(
        newAffiliation
      );
      return {
        status: 'success',
        response: 'Affiliation Created Successfully',
        status_code: 201,
        data: savedAffiliation,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error
      );
    }
  }

  async getAffiliations(params: GetAllAffiliationsInterface) {
    try {
      const limit: number = params?.limit
        ? +params?.limit
        : +process.env.PAGE_SIZE;

      let page = params?.page ? +params?.page : 1;

      if (page < 1) {
        page = 1;
      }

      const where = {};
      if (params?.name) {
        Object.assign(where, {
          name: ILike(`%${params?.name}%`),
        });
      }

      if (params?.status) {
        Object.assign(where, {
          is_active: params?.status,
        });
      }
      if (params?.collection_operation) {
        if (params?.collection_operation) {
          const collectionOperations = params?.collection_operation
            .split(',')
            .map((op) => parseInt(op.trim()));
          let Ids = [];
          const query = this.affiliationRepository
            .createQueryBuilder('affiliation')
            .leftJoinAndSelect(
              'affiliation.collection_operation',
              'collection_operation'
            )
            .where('collection_operation.id IN (:...collectionOperations)', {
              collectionOperations,
            });
          const result = await query.getRawMany();
          Ids = result.map((row) => row.affiliation_id);
          Object.assign(where, {
            id: In(Ids),
          });
        }
      }

      Object.assign(where, {
        tenant: { id: this.request.user?.tenant?.id },
      });

      let affiliations: any = [];
      if (params?.fetchAll) {
        affiliations = this.affiliationRepository
          .createQueryBuilder('affiliations')
          .leftJoinAndSelect(
            'affiliations.collection_operation_id',
            'collection_operation'
          )
          .leftJoinAndSelect('affiliations.created_by', 'created_by')
          .orderBy({ 'affiliations.id': 'DESC' })
          .where({ ...where, is_archived: false });
      } else if (params?.sortName) {
        affiliations = this.affiliationRepository
          .createQueryBuilder('affiliations')
          .leftJoinAndSelect(
            'affiliations.collection_operation_id',
            'collection_operation'
          )
          .leftJoinAndSelect('affiliations.created_by', 'created_by')
          .take(limit)
          .orderBy(
            params.sortName === 'collection_operation'
              ? {
                  [`collection_operation.name`]:
                    params.sortOrder === 'asc' ? 'ASC' : 'DESC' || 'ASC',
                }
              : {
                  [`affiliations.${params.sortName}`]:
                    params.sortOrder === 'asc' ? 'ASC' : 'DESC' || 'ASC',
                }
          )
          .skip((page - 1) * limit)
          .where({ ...where, is_archived: false });
      } else {
        affiliations = this.affiliationRepository
          .createQueryBuilder('affiliations')
          .leftJoinAndSelect(
            'affiliations.collection_operation',
            'collection_operation'
          )
          .leftJoinAndSelect('affiliations.created_by', 'created_by')
          .take(limit)
          .skip((page - 1) * limit)
          .orderBy({ 'affiliations.id': 'DESC' })
          .where({ ...where, is_archived: false });
      }

      const [data, count] = await affiliations.getManyAndCount();

      return {
        status: HttpStatus.OK,
        message: 'Affiliations Fetched Successfully',
        count: count,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAffiliationsByCollectionOperation(
    params: GetAllAffiliationsInterface
  ) {
    try {
      // const limit: number = params?.limit
      //   ? +params?.limit
      //   : +process.env.PAGE_SIZE;

      // let page = params?.page ? +params?.page : 1;

      // if (page < 1) {
      //   page = 1;
      // }

      const where = {};
      if (params?.name) {
        Object.assign(where, {
          name: ILike(`%${params?.name}%`),
        });
      }

      if (params?.status) {
        Object.assign(where, {
          is_active: params?.status,
        });
      }
      const collection_operation = await this.getUserBusinessUnits();
      const collectionOperationIds = collection_operation.map(
        (collection) => collection.id
      );
      if (collectionOperationIds.length) {
        const query = this.affiliationRepository
          .createQueryBuilder('affiliation')
          .leftJoinAndSelect(
            'affiliation.collection_operation',
            'collection_operation'
          )
          .where('collection_operation.id IN (:...collectionOperations)', {
            collectionOperations: collectionOperationIds,
          });
        const result = await query.getRawMany();
        const Ids = result.map((row) => row.affiliation_id);
        Object.assign(where, {
          id: In(Ids),
        });
      }

      Object.assign(where, {
        tenant: { id: this.request.user?.tenant?.id },
      });

      let affiliations: any = [];
      affiliations = this.affiliationRepository
        .createQueryBuilder('affiliations')
        .leftJoinAndSelect(
          'affiliations.collection_operation',
          'collection_operation'
        )
        .leftJoinAndSelect('affiliations.created_by', 'created_by')
        .orderBy({ 'affiliations.id': 'DESC' })
        .where({ ...where, is_archived: false });

      const [data, count] = await affiliations.getManyAndCount();

      return {
        status: HttpStatus.OK,
        message: 'Affiliations Fetched Successfully',
        count: count,
        data: data,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(affiliationInterface: UpdateAffiliationsInterface) {
    const affiliationId = affiliationInterface?.id;

    const affiliation = await this.affiliationRepository.findOne({
      relations: ['created_by'],
      where: { id: affiliationId, is_archived: false },
    });

    if (!affiliation) {
      throw new NotFoundException('Affiliation not found');
    }

    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const affiliation = await this.affiliationRepository.findOne({
        where: {
          id: affiliationId,
        },
        relations: ['collection_operation'],
      });

      const collectionOp = await this.businessUnitsRepository.find({
        where: { id: In(affiliationInterface.collection_operation) },
      });

      affiliation.name = affiliationInterface.name;
      affiliation.description = affiliationInterface.description;
      affiliation.collection_operation = collectionOp;
      affiliation.is_active = affiliationInterface.is_active;
      await this.affiliationRepository.save(affiliation);

      const affiliationHistory = new AffiliationHistory();
      affiliationHistory.id = Number(affiliationId);
      (affiliationHistory.name = affiliation.name),
        (affiliationHistory.description = affiliation.description),
        (affiliationHistory.history_reason = 'C');
      affiliationHistory.is_archived = false;
      affiliationHistory.is_active = affiliation.is_active;
      affiliationHistory.created_by = affiliationInterface.updated_by;

      affiliationHistory.tenant_id = affiliation?.tenant_id;
      await this.saveAffiliationHistory(affiliationHistory);

      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Changes Saved.',
        status_code: 204,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Affiliation update >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async getSingleAffiliation(id: any) {
    const affiliation = await this.affiliationRepository.findOne({
      where: { id, is_archived: false },
      relations: ['collection_operation', 'created_by'],
    });
    if (!affiliation) {
      throw new NotFoundException('affiliation not found');
    }
    const modifiedData: any = await getModifiedDataDetails(
      this.affiliationHistoryRepository,
      id,
      this.userRepository
    );
    return { ...affiliation, ...modifiedData };
  }

  async deleteAffilations(id: any, updated_by: any, deleteData: any) {
    const affiliation = await this.affiliationRepository.findOne({
      where: { id, is_archived: false },
      relations: ['created_by'],
    });

    if (!affiliation) {
      throw new NotFoundException('Affiliation not found');
    }
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const affiliationHistory = new AffiliationHistory();
      affiliationHistory.id = Number(id);
      (affiliationHistory.name = affiliation.name),
        (affiliationHistory.description = affiliation.description),
        (affiliationHistory.deleted_at = new Date());
      affiliationHistory.history_reason = 'C';
      affiliationHistory.is_archived = false;
      affiliationHistory.is_active = affiliation.is_active;
      affiliationHistory.created_by = updated_by;
      affiliationHistory.tenant_id = affiliation?.tenant_id;

      await this.saveAffiliationHistory(affiliationHistory);
      affiliationHistory.history_reason = 'D';
      await this.saveAffiliationHistory(affiliationHistory);

      affiliation.is_archived = true;
      affiliation.deleted_at = new Date();
      await this.affiliationRepository.save(affiliation);

      await queryRunner.commitTransaction();

      return {
        status: 'success',
        response: 'Affiliation Archived.',
        status_code: 204,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Affiliation delete >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async saveAffiliationHistory(affiliation: AffiliationHistory) {
    try {
      const affiliationHistory = new AffiliationHistory();
      affiliationHistory.collection_operation_id =
        affiliation.collection_operation_id;
      affiliationHistory.created_at = new Date();
      affiliationHistory.created_by = affiliation.created_by;
      affiliationHistory.deleted_at = affiliation.deleted_at;
      affiliationHistory.description = affiliation.description;
      affiliationHistory.id = affiliation.id;
      affiliationHistory.history_reason = affiliation.history_reason;
      affiliationHistory.is_active = affiliation.is_active;
      affiliationHistory.is_archived = affiliation.is_archived;
      affiliationHistory.name = affiliation.name;
      affiliationHistory.tenant_id = affiliation?.tenant_id;

      await this.affiliationHistoryRepository.save(affiliationHistory);
    } catch (error) {
      console.log(error);
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< Affiliation save history >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getUserBusinessUnits() {
    try {
      const userData: any = await this.userRepository.findOne({
        where: {
          id: this.request.user?.id,
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

      const where: any = { is_archived: false, is_active: true };

      let businessUnits: any = [];
      const userBusinessUnitIds = userData?.business_units?.map(
        (bu) => bu.business_unit_id.id
      );

      if (userBusinessUnitIds.length || userData?.all_hierarchy_access) {
        let parentBusinessUnits = userBusinessUnitIds;

        if (userData?.all_hierarchy_access) {
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

      return businessUnits;
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
