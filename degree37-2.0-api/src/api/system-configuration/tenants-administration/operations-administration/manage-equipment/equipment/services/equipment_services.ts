import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, Not, ILike, In } from 'typeorm';
import {
  CreateEquipmentDto,
  UpdateEquipmentDto,
} from '../dto/create-equipment.dto';
import { ErrorConstants } from '../../../../../constants/error.constants';
import { resError, resSuccess } from '../../../../../helpers/response';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { EquipmentEntity } from '../entity/equipment.entity';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { EquipmentCollectionOperationEntity } from '../entity/equipment-collection-operations.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import {
  GetAllEquipmentInterface,
  GetEquipmentForDriveInterface,
} from '../interface/equipment.interface';
import { typeEnum } from '../../common/type.enum';
import { EquipmentHistory } from '../entity/equipment-history.entity';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';

@Injectable({ scope: Scope.REQUEST })
export class EquipmentService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(EquipmentEntity)
    private readonly equipmentRespistory: Repository<EquipmentEntity>,
    @InjectRepository(EquipmentHistory)
    private readonly equipmentHistoryRespistory: Repository<EquipmentHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BusinessUnits)
    private readonly businessRepository: Repository<BusinessUnits>,
    @InjectRepository(EquipmentCollectionOperationEntity)
    private readonly equipmentCollectionOperationRepository: Repository<EquipmentCollectionOperationEntity>,
    private readonly entityManager: EntityManager
  ) {}

  async create(createEquipmentDto: CreateEquipmentDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      const equipmentEntity = new EquipmentEntity();

      equipmentEntity.name = createEquipmentDto.name;
      equipmentEntity.description = createEquipmentDto.description;
      equipmentEntity.is_active = createEquipmentDto.status;
      equipmentEntity.short_name = createEquipmentDto.short_name;
      equipmentEntity.created_by = this.request.user;
      equipmentEntity.tenant = this.request.user?.tenant;
      equipmentEntity.retire_on = createEquipmentDto?.retire_on;

      if (createEquipmentDto.type)
        equipmentEntity.type = createEquipmentDto.type;

      const savedEquipment = await queryRunner.manager.save(equipmentEntity);

      const promises = [];
      for (const collectionOperations of createEquipmentDto.collection_operations) {
        const equipmentCollectionOperation =
          new EquipmentCollectionOperationEntity();
        equipmentCollectionOperation.equipment_id = savedEquipment.id;
        equipmentCollectionOperation.collection_operation_id =
          collectionOperations;

        const collectionOperation = await this.businessRepository.findOne({
          where: { id: collectionOperations },
        });

        // console.log('collectionOperation', collectionOperation)

        equipmentCollectionOperation.collection_operation_name =
          collectionOperation.name;

        equipmentCollectionOperation.created_by = this.request.user.id;
        promises.push(queryRunner.manager.save(equipmentCollectionOperation));
      }
      const collections = await Promise.all(promises);

      return {
        status: 'success',
        response: 'Equipment Created.',
        code: 201,
        data: {
          savedEquipment,
          collection_operation: collections,
        },
      };
    } catch (error) {
      // console.log(error)
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    getAllEquipmentInterface: GetAllEquipmentInterface
  ): Promise<any> {
    try {
      let sortName = getAllEquipmentInterface?.sort_name;
      const sortOrder = getAllEquipmentInterface?.sort_order;
      if ((sortName && !sortOrder) || (sortOrder && !sortName)) {
        return new HttpException(
          'When selecting sort SortOrder & SortName is required.',
          HttpStatus.BAD_REQUEST
        );
      }

      const limit: number = getAllEquipmentInterface?.limit
        ? +getAllEquipmentInterface?.limit
        : +process.env.PAGE_SIZE;

      let page = getAllEquipmentInterface?.page
        ? +getAllEquipmentInterface?.page
        : 1;

      if (page < 1) {
        page = 1;
      }

      const where = {};
      if (getAllEquipmentInterface?.keyword) {
        Object.assign(where, {
          name: ILike(`%${getAllEquipmentInterface.keyword}%`),
        });
      }

      if (getAllEquipmentInterface?.collection_operations) {
        const collection_items: any =
          getAllEquipmentInterface.collection_operations;
        const collectionOperations = collection_items.split(',');
        let equipmentIds = [];
        const qb = this.equipmentCollectionOperationRepository
          .createQueryBuilder('collectionOperation')
          .select('collectionOperation.equipment_id', 'equipment_id')
          .where(
            'collectionOperation.collection_operation_id IN (:...collectionOperations)',
            { collectionOperations }
          );

        const result = await qb.getRawMany();
        equipmentIds = result.map((row) => row.equipment_id);
        Object.assign(where, {
          id: In(equipmentIds),
        });
      }

      if (getAllEquipmentInterface?.status) {
        Object.assign(where, {
          is_active: getAllEquipmentInterface?.status,
        });
      }

      Object.assign(where, {
        is_archived: false,
      });

      Object.assign(where, {
        tenant: { id: this.request.user?.tenant?.id },
      });

      let equipment;
      if (sortName == 'status') {
        sortName = 'is_active';
      }
      if (
        sortName == 'name' ||
        sortName == 'short_description' ||
        sortName == 'description'
      ) {
        equipment = this.equipmentRespistory
          .createQueryBuilder('equipment_entity')
          .take(limit)
          .skip((page - 1) * limit)
          .orderBy(
            `LOWER(equipment_entity.${sortName})`,
            sortOrder as 'ASC' | 'DESC'
          )
          .where(where);
      } else if (sortName) {
        equipment = this.equipmentRespistory
          .createQueryBuilder('equipment_entity')
          .take(limit)
          .skip((page - 1) * limit)
          .orderBy(`equipment_entity.${sortName}`, sortOrder as 'ASC' | 'DESC')
          .where(where);
      } else {
        equipment = this.equipmentRespistory
          .createQueryBuilder('equipment_entity')
          .take(limit)
          .skip((page - 1) * limit)
          .orderBy('equipment_entity.created_at', 'DESC')
          .where(where);
      }

      const countQuery = equipment;

      const data = await equipment.getMany();
      const count = await countQuery.getCount();

      const updatedEquipments = [];

      for (const item of data) {
        const collectionOperations =
          await this.equipmentCollectionOperationRepository.find({
            where: {
              equipment_id: In([item.id]),
            },
            relations: ['collection_operation_id'],
          });

        updatedEquipments.push({
          ...item,
          collectionOperations,
        });
      }

      await Promise.all(updatedEquipments);

      return {
        status: HttpStatus.OK,
        message: 'Equipments Fetched Succesfuly',
        count: count,
        data: updatedEquipments,
      };
    } catch (e) {
      // console.log(e)

      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllForDrives(params: GetEquipmentForDriveInterface): Promise<any> {
    try {
      const response = await this.equipmentRespistory
        .createQueryBuilder('equipments')
        .leftJoinAndSelect(
          'equipments.collection_operations',
          'collection_operations'
        )
        .where(
          'collection_operations.collection_operation_id = :collection_operation_id',
          {
            collection_operation_id: params.collection_operations,
          }
        )
        .andWhere('equipments.type = :type', {
          type: params.type,
        })
        .andWhere('equipments.is_archived = :is_archived', {
          is_archived: false,
        })
        .andWhere('equipments.is_active = :is_active', {
          is_active: true,
        })
        .getMany();
      return {
        status: HttpStatus.OK,
        message: 'Equipments Fetched Succesfuly',
        data: response,
      };
    } catch (e) {
      // console.log(e)

      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: any, updateEquipmentDto: UpdateEquipmentDto, req: any) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const equipment = await this.equipmentRespistory.findOneBy({
        id: id,
      });

      if (!equipment) {
        throw new HttpException(`Equipment not found.`, HttpStatus.NOT_FOUND);
      }

      equipment.name = updateEquipmentDto?.name ?? equipment.name;
      equipment.description =
        updateEquipmentDto?.description ?? equipment.description;
      equipment.is_active = updateEquipmentDto?.status ?? equipment.is_active;
      equipment.short_name =
        updateEquipmentDto?.short_name ?? equipment.short_name;
      equipment.retire_on = updateEquipmentDto?.retire_on;
      equipment.type = updateEquipmentDto?.type ?? equipment.type;

      const savedEquipment = await queryRunner.manager.save(equipment);

      const oldCollectionOperations: any =
        await this.equipmentCollectionOperationRepository.find({
          where: {
            equipment_id: In([equipment.id]),
          },
          relations: ['collection_operation_id'],
        });

      // Create a Banner history instance
      const equipmentHistory = new EquipmentHistory();
      equipmentHistory.history_reason = 'C';
      equipmentHistory.id = equipment.id;
      equipmentHistory.name = equipment.name;
      equipmentHistory.short_name = equipment.short_name;
      equipmentHistory.description = equipment.description;
      equipmentHistory.resign_on_date = equipment.retire_on;
      equipmentHistory.type = equipment.type;
      equipmentHistory.collection_operations = oldCollectionOperations.map(
        (co) => co.collection_operation_id.id
      );
      equipmentHistory.created_by = req?.user?.id;
      equipmentHistory.tenant_id = equipment?.tenant_id;
      await queryRunner.manager.save(equipmentHistory);

      await this.equipmentCollectionOperationRepository
        .createQueryBuilder('equipment_collection_operations')
        .delete()
        .from(EquipmentCollectionOperationEntity)
        .where('equipment_id = :equipment_id', {
          equipment_id: savedEquipment.id,
        })
        .execute();

      const promises = [];
      if (updateEquipmentDto.collection_operations?.length > 0) {
        for (const collectionOperations of updateEquipmentDto.collection_operations) {
          const equipmentCollectionOperation =
            new EquipmentCollectionOperationEntity();
          equipmentCollectionOperation.equipment_id = savedEquipment.id;
          equipmentCollectionOperation.collection_operation_id =
            collectionOperations;

          const collectionOperation = await this.businessRepository.findOne({
            where: { id: collectionOperations },
          });

          equipmentCollectionOperation.collection_operation_name =
            collectionOperation.name;

          equipmentCollectionOperation.created_by = this.request.user.id;
          promises.push(queryRunner.manager.save(equipmentCollectionOperation));
        }
        await Promise.all(promises);
      }

      await queryRunner.commitTransaction();
      return {
        status: 'Success',
        response: 'Resource updated',
        status_code: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      // console.log(error)
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: any): Promise<any> {
    try {
      const equipment = await this.equipmentRespistory.findOne({
        where: { id: id },
        relations: ['created_by'],
      });
      if (!equipment) {
        return new HttpException('Equipment not found', HttpStatus.BAD_REQUEST);
      }

      const collectionOperations =
        await this.equipmentCollectionOperationRepository.find({
          where: {
            equipment_id: In([equipment.id]),
          },
          relations: ['collection_operation_id'],
        });

      await this.equipmentCollectionOperationRepository.find({
        where: {
          equipment_id: In([equipment.id]),
        },
      });
      const modifiedData: any = await getModifiedDataDetails(
        this.equipmentHistoryRespistory,
        id,
        this.userRepository
      );

      return {
        status: HttpStatus.OK,
        message: 'Equipment Fetched.',
        data: {
          ...equipment,
          ...modifiedData,
          collectionOperations,
        },
      };
    } catch (e) {
      // console.log(e)

      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async archive(id: any, req: any) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const equipment = await this.equipmentRespistory.findOneBy({
        id: id,
      });

      if (!equipment) {
        throw new HttpException(`Equipment not found.`, HttpStatus.NOT_FOUND);
      }

      const oldCollectionOperations: any =
        await this.equipmentCollectionOperationRepository.find({
          where: {
            equipment_id: In([equipment.id]),
          },
          relations: ['collection_operation_id'],
        });

      const isArchive = !equipment.is_archived;
      const updatedRequest = {
        ...equipment,
        is_archived: isArchive,
      };

      // return updatedRequest;
      const updatedEquipment = await this.equipmentRespistory.save(
        updatedRequest
      );

      const equipmentHistory = new EquipmentHistory();
      equipmentHistory.history_reason = 'C';
      equipmentHistory.id = updatedEquipment.id;
      equipmentHistory.name = updatedEquipment.name;
      equipmentHistory.short_name = updatedEquipment.short_name;
      equipmentHistory.description = updatedEquipment.description;
      equipmentHistory.resign_on_date = updatedEquipment.retire_on;
      equipmentHistory.type = updatedEquipment.type;
      equipmentHistory.collection_operations = oldCollectionOperations.map(
        (co) => co.collection_operation_id.id
      );
      equipmentHistory.created_by = req?.user?.id;
      equipmentHistory.tenant_id = equipment?.tenant_id;
      await queryRunner.manager.save(equipmentHistory);
      equipmentHistory.history_reason = 'D';
      await queryRunner.manager.save(equipmentHistory);

      await queryRunner.commitTransaction();
      return {
        status: 'Success',
        response: 'Equipment Archived',
        status_code: HttpStatus.NO_CONTENT,
        updatedEquipment,
      };
    } catch (error) {
      // console.log(error)
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
}
