import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, MoreThanOrEqual, Repository } from 'typeorm';
import { BusinessUnits } from '../../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { MarketingMaterials } from '../entities/marketing-material.entity';
import {
  resError,
  resSuccess,
} from '../../../../../../system-configuration/helpers/response';
import { SuccessConstants } from '../../../../../../system-configuration/constants/success.constants';
import { ErrorConstants } from '../../../../../../system-configuration/constants/error.constants';
import { CreateMarketingMaterialDto } from '../dto/create-marketing-material.dto';
import { UpdateMarketingMaterialDto } from '../dto/update-marketing-material.dto';
import { MarketingMaterialsHistory } from '../entities/marketing-material-history.entity';
import {
  GetAllMarketingMaterialCOInterface,
  GetAllMarketingMaterialInterface,
} from '../interface/marketing-material.interface';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import moment from 'moment';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';

@Injectable()
export class MarketingMaterialService {
  constructor(
    @InjectRepository(MarketingMaterials)
    private readonly marketingMaterialRepository: Repository<MarketingMaterials>,
    @InjectRepository(MarketingMaterialsHistory)
    private readonly marketingMaterialHistoryRepository: Repository<MarketingMaterialsHistory>,
    @InjectRepository(BusinessUnits)
    private readonly businessUnitsRepository: Repository<BusinessUnits>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>
  ) {}

  async create(createMarketingMaterialDto: CreateMarketingMaterialDto) {
    try {
      const {
        name,
        short_name,
        description,
        collection_operation,
        status,
        retire_on,
        created_by,
        tenant_id,
      } = createMarketingMaterialDto;

      const user = await this.userRepository.findOneBy({
        id: created_by,
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const tenant = await this.tenantRepository.findOneBy({
        id: tenant_id,
      });
      if (!tenant) {
        throw new HttpException(`Tenant not found.`, HttpStatus.NOT_FOUND);
      }

      const businessUnits: any = await this.businessUnitsRepository.findBy({
        id: In(collection_operation),
      });
      if (businessUnits && businessUnits.length < collection_operation.length) {
        throw new HttpException(
          `Some Collection Operations not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      let retireOn;

      try {
        retireOn = new Date(
          moment(retire_on, 'DD-MM-YYYY').format('YYYY-MM-DD')
        );
        if (isNaN(retireOn.getTime())) {
          throw new Error('Invalid date');
        }
      } catch (error) {
        retireOn = null;
        console.error(`Error parsing date: ${error.message}`);
      }

      const marketingMaterials = new MarketingMaterials();

      marketingMaterials.created_by = user;
      marketingMaterials.tenant_id = tenant;
      marketingMaterials.name = name;
      marketingMaterials.short_name = short_name;
      marketingMaterials.description = description;
      marketingMaterials.status = status;
      marketingMaterials.is_archived = false;
      marketingMaterials.retire_on = retireOn;
      marketingMaterials.collection_operation = businessUnits;

      const savedMarketingMaterial =
        await this.marketingMaterialRepository.save(marketingMaterials);

      delete savedMarketingMaterial.created_by;

      return resSuccess(
        'Marketing Material Created Successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedMarketingMaterial
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findOne(id: any) {
    try {
      let marketingMaterial: any =
        await this.marketingMaterialRepository.findOne({
          where: { id: id },
          relations: ['created_by', 'collection_operation'],
        });

      if (!marketingMaterial) {
        throw new HttpException(
          `Marketing material not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      if (marketingMaterial?.is_archived) {
        throw new HttpException(
          `Marketing material is archived.`,
          HttpStatus.NOT_FOUND
        );
      }
      marketingMaterial = {
        ...marketingMaterial,
        created_by: {
          id: marketingMaterial?.created_by?.id,
          first_name: marketingMaterial?.created_by?.first_name,
          last_name: marketingMaterial?.created_by?.last_name,
        },
      };
      const modifiedData: any = await getModifiedDataDetails(
        this.marketingMaterialHistoryRepository,
        id,
        this.userRepository
      );

      return resSuccess(
        'Material Marketing fetched successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { ...marketingMaterial, ...modifiedData }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async update(
    id: any,
    updateMarketingMaterialDto: UpdateMarketingMaterialDto
  ) {
    try {
      const marketingMaterial = await this.marketingMaterialRepository.findOne({
        where: { id },
        relations: ['created_by', 'collection_operation', 'tenant_id'],
      });

      const marketingMaterialBeforeUpdate = { ...marketingMaterial };

      if (!marketingMaterial) {
        throw new HttpException(
          `Marketing Material not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      if (marketingMaterial.is_archived) {
        throw new HttpException(
          `Marketing Material is archived and cannot be updated.`,
          HttpStatus.NOT_FOUND
        );
      }

      const {
        name,
        short_name,
        description,
        collection_operation,
        status,
        retire_on,
      } = updateMarketingMaterialDto;

      marketingMaterial.name = name ?? marketingMaterial.name;
      marketingMaterial.short_name = short_name ?? marketingMaterial.short_name;
      marketingMaterial.description =
        description ?? marketingMaterial.description;
      marketingMaterial.status = status ?? marketingMaterial.status;
      marketingMaterial.retire_on = retire_on
        ? new Date(moment(retire_on, 'DD-MM-YYYY').format('YYYY-MM-DD'))
        : null;

      if (collection_operation && collection_operation?.length) {
        const businessUnits: any = await this.businessUnitsRepository.findBy({
          id: In(collection_operation),
        });

        if (
          businessUnits &&
          businessUnits.length < collection_operation.length
        ) {
          throw new HttpException(
            `Some Collection Operations not found.`,
            HttpStatus.NOT_FOUND
          );
        }

        marketingMaterial.collection_operation = businessUnits;
      }

      const updatedMarketingMaterial =
        await this.marketingMaterialRepository.save(marketingMaterial);

      await this.createMarketingMaterialHistory(marketingMaterialBeforeUpdate);

      return resSuccess(
        'Marketing Material Updated Successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        updatedMarketingMaterial
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAll(
    getAllMarketingMaterialInterface: GetAllMarketingMaterialInterface
  ) {
    try {
      const sortBy = getAllMarketingMaterialInterface?.sortBy;
      const sortOrder = getAllMarketingMaterialInterface?.sortOrder;

      if ((sortBy && !sortOrder) || (sortOrder && !sortBy)) {
        return new HttpException(
          'When selecting sort SortBy & sortOrder is required.',
          HttpStatus.BAD_REQUEST
        );
      }

      const limit: number =
        getAllMarketingMaterialInterface?.limit &&
        getAllMarketingMaterialInterface?.limit !== undefined
          ? +getAllMarketingMaterialInterface?.limit
          : +process.env.PAGE_SIZE ?? 10;

      const page = getAllMarketingMaterialInterface?.page
        ? +getAllMarketingMaterialInterface?.page
        : 1;

      const where = {
        tenant_id: {
          id: getAllMarketingMaterialInterface?.tenantId,
        },
        is_archived: false,
      };

      const sorting: { [key: string]: 'ASC' | 'DESC' } = {};
      if (sortBy && sortOrder) {
        sorting[sortBy] = sortOrder.toUpperCase() as 'ASC' | 'DESC';
      } else {
        sorting['id'] = 'DESC';
      }

      if (
        getAllMarketingMaterialInterface?.status !== undefined &&
        getAllMarketingMaterialInterface?.status !== '' &&
        getAllMarketingMaterialInterface?.status !== 'undefined'
      ) {
        Object.assign(where, {
          status: getAllMarketingMaterialInterface?.status,
        });
      }

      if (getAllMarketingMaterialInterface?.keyword) {
        Object.assign(where, {
          name: ILike(`%${getAllMarketingMaterialInterface?.keyword}%`),
        });
      }

      if (getAllMarketingMaterialInterface.collectionOperationId) {
        const collectionOperations =
          getAllMarketingMaterialInterface.collectionOperationId
            .split(',')
            .map((op) => op.trim());
        let Ids = [];
        const query = this.marketingMaterialRepository
          .createQueryBuilder('marketing_material')
          .leftJoinAndSelect(
            'marketing_material.collection_operation',
            'collection_operation'
          )
          .where('collection_operation.id IN (:...collectionOperations)', {
            collectionOperations,
          });
        const result = await query.getRawMany();
        Ids = result.map((row) => row.marketing_material_id);
        Object.assign(where, {
          id: In(Ids),
        });
      }
      const queryBuilder = this.marketingMaterialRepository
        .createQueryBuilder('marketing_material')
        .leftJoinAndSelect(
          'marketing_material.collection_operation',
          'collection_operation'
        )
        .leftJoinAndSelect('marketing_material.tenant_id', 'tenant_id')
        .take(limit)
        .skip((page - 1) * limit)
        .orderBy(
          sortBy
            ? `marketing_material.${sortBy}`
            : 'marketing_material.created_at',
          sorting[sortBy] || 'DESC'
        )
        .where(where);

      const [marketingMaterials, total] = await queryBuilder.getManyAndCount();

      return {
        status: SuccessConstants.SUCCESS,
        message: 'Marketing Materials Fetched successfully',
        status_code: HttpStatus.CREATED,
        total_records: total,
        data: marketingMaterials,
      };
    } catch (error) {
      return {
        status: error.status,
        message: error.message,
        status_code: ErrorConstants.Error,
        data: null,
      };
    }
  }

  async findAllByCollectionOperation(
    getAllMarketingMaterialCOInterface: GetAllMarketingMaterialCOInterface
  ) {
    try {
      const where = {
        tenant_id: {
          id: getAllMarketingMaterialCOInterface?.tenantId,
        },
        is_archived: false,
        retire_on: MoreThanOrEqual(new Date()),
      };

      Object.assign(where, {
        collection_operation: {
          id: getAllMarketingMaterialCOInterface?.collectionOperationId,
        },
      });

      const response = await this.marketingMaterialRepository.find({
        relations: ['collection_operation', 'tenant_id'],
        where,
      });
      return {
        status: SuccessConstants.SUCCESS,
        message: 'Marketing Materials Fetched successfully',
        status_code: HttpStatus.OK,
        data: response,
      };
    } catch (error) {
      return {
        status: error.status,
        message: error.message,
        status_code: ErrorConstants.Error,
        data: null,
      };
    }
  }

  async createMarketingMaterialHistory(marketingMaterial: any, type = 'C') {
    try {
      const marketingMaterialHistoryC = new MarketingMaterialsHistory();

      marketingMaterialHistoryC.name = marketingMaterial.name;
      marketingMaterialHistoryC.short_name = marketingMaterial.short_name;
      marketingMaterialHistoryC.description = marketingMaterial.description;
      marketingMaterialHistoryC.status = marketingMaterial.status;
      marketingMaterialHistoryC.is_archived = marketingMaterial.is_archived;
      marketingMaterialHistoryC.retire_on = marketingMaterial.retire_on;
      marketingMaterialHistoryC.created_by = marketingMaterial.created_by.id;
      marketingMaterialHistoryC.tenant_id = marketingMaterial.tenant_id.id;
      marketingMaterialHistoryC.history_reason = 'C';
      marketingMaterialHistoryC.id = marketingMaterial?.id;

      await this.marketingMaterialHistoryRepository.save(
        marketingMaterialHistoryC
      );

      if (type === 'D') {
        const marketingMaterialHistoryD = new MarketingMaterialsHistory();

        marketingMaterialHistoryD.name = marketingMaterial.name;
        marketingMaterialHistoryD.short_name = marketingMaterial.short_name;
        marketingMaterialHistoryD.description = marketingMaterial.description;
        marketingMaterialHistoryD.status = marketingMaterial.status;
        marketingMaterialHistoryD.is_archived = marketingMaterial.is_archived;
        marketingMaterialHistoryD.retire_on = marketingMaterial.retire_on;
        marketingMaterialHistoryD.created_by = marketingMaterial.created_by.id;
        marketingMaterialHistoryC.tenant_id = marketingMaterial.tenant_id.id;
        marketingMaterialHistoryD.history_reason = 'D';
        marketingMaterialHistoryD.id = marketingMaterial?.id;

        await this.marketingMaterialHistoryRepository.save(
          marketingMaterialHistoryD
        );
      }
      return resSuccess(
        'Marketing Material History Saved successfully', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        {}
      );
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async archiveMarketingMaterial(id: any) {
    try {
      const marketingMaterialToArchive =
        await this.marketingMaterialRepository.findOne({
          where: { id },
        });

      if (!marketingMaterialToArchive) {
        throw new HttpException(`Ad not found.`, HttpStatus.NOT_FOUND);
      }

      if (marketingMaterialToArchive.is_archived === false) {
        marketingMaterialToArchive.is_archived = true;
        await this.marketingMaterialRepository.save(marketingMaterialToArchive);

        const marketingMaterialArchived =
          await this.marketingMaterialRepository.findOne({
            relations: ['created_by', 'tenant_id'],
            where: { id: id },
          });
        const action = 'D';
        await this.createMarketingMaterialHistory(
          marketingMaterialArchived,
          action
        );
      } else {
        throw new HttpException(
          `Marketing Material is already archived.`,
          HttpStatus.NOT_FOUND
        );
      }

      return resSuccess(
        'Marketing Material Archived successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
