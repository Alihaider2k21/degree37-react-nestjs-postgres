import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, EntityManager } from 'typeorm';
import { VehicleType } from '../entities/vehicle-type.entity';
import { VehicleTypeHistory } from '../entities/vehicle-type-history.entity';
import { VehicleTypeDto } from '../dto/vehicle-type.dto';
import { resError, resSuccess } from '../../../../../helpers/response';
import { ErrorConstants } from '../../../../../constants/error.constants';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { SuccessConstants } from '../../../../../constants/success.constants';
import { GetAllVehicleTypesInterface } from '../interface/vehicle-type.interface';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';

@Injectable({ scope: Scope.REQUEST })
export class VehicleTypeService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(VehicleType)
    private readonly vehicleTypeRepository: Repository<VehicleType>,
    @InjectRepository(VehicleTypeHistory)
    private readonly vehicleTypeHistoryRepository: Repository<VehicleTypeHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager
  ) {}

  async create(createVehicleTypeDto: VehicleTypeDto) {
    try {
      const user = await this.userRepository.findOneBy({
        id: createVehicleTypeDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      // Create a Vehicle Type instance
      const vehicleType = new VehicleType();
      // Set Vehicle Type properties from createVehicleType
      vehicleType.name = createVehicleTypeDto.name;
      vehicleType.description = createVehicleTypeDto.description;
      vehicleType.location_type_id = createVehicleTypeDto?.location_type_id;
      vehicleType.linkable = createVehicleTypeDto?.linkable;
      vehicleType.collection_vehicle = createVehicleTypeDto?.collection_vehicle;
      vehicleType.is_active = createVehicleTypeDto?.is_active;
      vehicleType.created_by = createVehicleTypeDto?.created_by;
      vehicleType.tenant = this.request?.user?.tenant;

      // Save the Vehicle Type entity
      const savedVehicleType = await this.vehicleTypeRepository.save(
        vehicleType
      );
      return resSuccess(
        'Vehicle Type Created Successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedVehicleType
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAll(
    getAllVehicleTypesInterface: GetAllVehicleTypesInterface
  ): Promise<any> {
    try {
      const page =
        getAllVehicleTypesInterface?.page &&
        +getAllVehicleTypesInterface?.page >= 1
          ? +getAllVehicleTypesInterface?.page
          : 1;
      const limit: number = getAllVehicleTypesInterface?.limit
        ? +getAllVehicleTypesInterface?.limit
        : +process.env.PAGE_SIZE;

      const where = {};
      if (getAllVehicleTypesInterface?.name) {
        Object.assign(where, {
          name: ILike(`%${getAllVehicleTypesInterface?.name}%`),
        });
      }

      if (getAllVehicleTypesInterface?.location_type) {
        Object.assign(where, {
          location_type_id: getAllVehicleTypesInterface.location_type,
        });
      }

      if (getAllVehicleTypesInterface?.linkable) {
        Object.assign(where, {
          linkable: getAllVehicleTypesInterface.linkable,
        });
      }

      if (getAllVehicleTypesInterface?.status) {
        Object.assign(where, {
          is_active: getAllVehicleTypesInterface.status,
        });
      }

      Object.assign(where, {
        tenant: { id: this.request.user?.tenant?.id },
      });

      let response = [];
      let count = 0;
      if (getAllVehicleTypesInterface?.fetchAll) {
        [response, count] = await this.vehicleTypeRepository.findAndCount({
          where: { ...where, is_archived: false },
          order: { id: 'DESC' },
        });
      } else {
        [response, count] = await this.vehicleTypeRepository.findAndCount({
          where: { ...where, is_archived: false },
          take: limit,
          skip: (page - 1) * limit,
          order: { id: 'DESC' },
        });
      }

      return {
        status: HttpStatus.OK,
        response: 'Vehicle Types Fetched Successfully',
        count: count,
        data: response,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findOne(id: any): Promise<any> {
    try {
      const vehicleType = await this.vehicleTypeRepository.findOne({
        where: { id, is_archived: false },
        relations: ['created_by'],
      });

      if (!vehicleType) {
        throw new NotFoundException('Vehicle type not found');
      }
      const modifiedData: any = await getModifiedDataDetails(
        this.vehicleTypeHistoryRepository,
        id,
        this.userRepository
      );

      return resSuccess(
        'Vehicle Type Fetched Succesfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { ...vehicleType, ...modifiedData }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async update(id: any, updateVehicleTypeDto: VehicleTypeDto): Promise<any> {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const vehicleType: any = await this.vehicleTypeRepository.findOne({
        where: { id, is_archived: false },
        relations: ['created_by', 'tenant'],
      });

      if (!vehicleType) {
        throw new NotFoundException('Vehicle type not found');
      }

      // Create a Vehicle Type history instance
      const vehicleTypeHistory = new VehicleTypeHistory();
      // Set Vehicle Type History properties from createVehicleType
      vehicleTypeHistory.history_reason = 'C';
      vehicleTypeHistory.id = vehicleType.id;
      vehicleTypeHistory.name = vehicleType.name;
      vehicleTypeHistory.description = vehicleType.description;
      vehicleTypeHistory.location_type_id = vehicleType.location_type_id;
      vehicleTypeHistory.linkable = vehicleType.linkable;
      vehicleTypeHistory.collection_vehicle = vehicleType.collection_vehicle;
      vehicleTypeHistory.is_active = vehicleType.is_active;
      vehicleTypeHistory.created_by = updateVehicleTypeDto?.updated_by;
      vehicleTypeHistory.tenant_id = vehicleType?.tenant?.id;

      // Save the Vehicle Type History entity
      await queryRunner.manager.save(vehicleTypeHistory);

      vehicleType.name = updateVehicleTypeDto.name;
      vehicleType.description = updateVehicleTypeDto.description;
      vehicleType.location_type_id = updateVehicleTypeDto.location_type_id;
      vehicleType.linkable = updateVehicleTypeDto.linkable;
      vehicleType.collection_vehicle = updateVehicleTypeDto.collection_vehicle;
      vehicleType.is_active = updateVehicleTypeDto.is_active;
      // vehicleType.updated_by = updateVehicleTypeDto?.updated_by
      // Update the Vehicle Type entity
      const updatedVehicleType = await queryRunner.manager.save(vehicleType);
      await queryRunner.commitTransaction();

      return resSuccess(
        'Vehicle Type Updated Succesfuly',
        SuccessConstants.SUCCESS,
        HttpStatus.NO_CONTENT,
        updatedVehicleType
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: any, updatedBy: any) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const vehicleType: any = await this.vehicleTypeRepository.findOne({
        where: { id, is_archived: false },
        relations: ['created_by', 'tenant'],
      });

      if (!vehicleType) {
        throw new NotFoundException('Vehicle type not found');
      }

      // Create a Vehicle Type history instance
      const vehicleTypeHistory = new VehicleTypeHistory();
      // Set Vehicle Type History properties from createVehicleType
      vehicleTypeHistory.history_reason = 'D';
      vehicleTypeHistory.id = vehicleType.id;
      vehicleTypeHistory.name = vehicleType.name;
      vehicleTypeHistory.description = vehicleType.description;
      vehicleTypeHistory.location_type_id = vehicleType.location_type_id;
      vehicleTypeHistory.linkable = vehicleType.linkable;
      vehicleTypeHistory.collection_vehicle = vehicleType.collection_vehicle;
      vehicleTypeHistory.is_active = vehicleType?.is_active;
      vehicleTypeHistory.created_by = updatedBy;
      vehicleTypeHistory.tenant_id = vehicleType?.tenant?.id;

      // Save the Vehicle Type History entity
      await queryRunner.manager.save(vehicleTypeHistory);

      vehicleType.is_archived = true;
      // Archive the Vehicle Type entity
      const archivedVehicleType = await queryRunner.manager.save(vehicleType);
      await queryRunner.commitTransaction();

      return resSuccess(
        'Vehicle Type Archived Succesfuly',
        SuccessConstants.SUCCESS,
        HttpStatus.GONE,
        archivedVehicleType
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
}
