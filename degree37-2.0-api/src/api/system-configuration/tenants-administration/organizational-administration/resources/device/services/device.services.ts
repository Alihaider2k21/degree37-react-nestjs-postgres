import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, In, Repository } from 'typeorm';
import { Device } from '../entities/device.entity';
import {
  GetAllDevicesInterface,
  GetDevicesForDriveInterface,
} from '../interface/device.interface';
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
import { CreateDeviceDto } from '../dto/create-device.dto';
import { DeviceType } from '../../device-type/entity/device-type.entity';
import { UpdateDeviceDto } from '../dto/update-device.dto';
import { DeviceHistory } from '../entities/device-history.entity';
import { DeviceMaintenanceDto } from '../dto/device-maintenance.dto';
import { DeviceMaintenance } from '../entities/device-maintenance.entity';
import { DeviceRetirementDto } from '../dto/device-retirement.dto';
import { DeviceShareDto } from '../dto/device-share.dto';
import { DeviceShare } from '../entities/device-share.entity';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { DeviceUnscheduleRetirementDto } from '../dto/device-unschedule-retirement.dto';
dotenv.config();

@Injectable({ scope: Scope.REQUEST })
export class DeviceService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DeviceType)
    private readonly deviceTypeRepository: Repository<DeviceType>,
    @InjectRepository(DeviceHistory)
    private readonly deviceHistoryRepository: Repository<DeviceHistory>,
    @InjectRepository(DeviceMaintenance)
    private readonly deviceMaintenanceRepository: Repository<DeviceMaintenance>,
    @InjectRepository(DeviceShare)
    private readonly deviceShareRepository: Repository<DeviceShare>,
    private readonly entityManager: EntityManager
  ) {}

  async addDevice(createDeviceDto: CreateDeviceDto) {
    try {
      const user = await this.userRepository.findOneBy({
        id: createDeviceDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      const deviceType = await this.deviceTypeRepository.findOneBy({
        id: createDeviceDto?.device_type_id,
      });
      if (!deviceType) {
        throw new HttpException(`Device Type not found.`, HttpStatus.NOT_FOUND);
      }
      const device = new Device();
      device.name = createDeviceDto?.name;
      device.short_name = createDeviceDto?.short_name;
      device.device_type = createDeviceDto.device_type_id;
      device.collection_operation = createDeviceDto.collection_operation_id;
      device.description = createDeviceDto?.description;
      device.status = createDeviceDto?.status ?? true;
      device.created_by = createDeviceDto?.created_by;
      device.tenant = this.request.user?.tenant;
      const savedDevice = await this.deviceRepository.save(device);
      return resSuccess(
        'Device Created.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedDevice
      );
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getDevices(params: GetAllDevicesInterface) {
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
          status: params?.status,
        });
      }

      if (params?.device_type) {
        Object.assign(where, {
          device_type: params?.device_type,
        });
      }

      Object.assign(where, {
        is_archived: false,
      });

      Object.assign(where, {
        tenant: { id: this.request.user?.tenant?.id },
      });

      if (params?.collection_operation) {
        const collectionOperationValues = params?.collection_operation
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
            collection_operation: params?.collection_operation,
          });
        }
      }

      const devices = this.deviceRepository
        .createQueryBuilder('devices')
        .leftJoinAndSelect('devices.device_type', 'device_type')
        .leftJoinAndSelect(
          'devices.collection_operation',
          'collection_operation'
        )
        .take(limit)
        .skip((page - 1) * limit)
        .orderBy({ 'devices.id': 'DESC' })
        .where(where);

      const [data, count] = await devices.getManyAndCount();
      return {
        status: HttpStatus.OK,
        response: 'Devices Fetched Succesfuly',
        count: count,
        data: data,
      };
    } catch (e) {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getDevicesByCollectionOperation(params: GetDevicesForDriveInterface) {
    try {
      const where = { collection_operation: params.collection_operation };

      Object.assign(where, {
        status: true,
      });

      Object.assign(where, {
        is_archived: false,
      });

      Object.assign(where, {
        tenant: { id: this.request.user?.tenant?.id },
      });

      const devices = this.deviceRepository
        .createQueryBuilder('devices')
        .leftJoinAndSelect('devices.device_type', 'device_type')
        .leftJoinAndSelect(
          'devices.collection_operation',
          'collection_operation'
        )
        .orderBy({ 'devices.id': 'DESC' })
        .where(where);

      const response = await devices.getMany();
      return {
        status: HttpStatus.OK,
        response: 'Devices Fetched Succesfuly',
        data: response,
      };
    } catch (e) {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getDevice(id: any) {
    try {
      const deviceData = await this.deviceRepository.findOneBy({
        id: id,
      });
      if (!deviceData) {
        throw new HttpException(`Device not found.`, HttpStatus.NOT_FOUND);
      }
      const device = await this.deviceRepository.findOne({
        where: {
          id,
        },
        relations: ['device_type', 'created_by', 'collection_operation'],
      });

      const modifiedData: any = await getModifiedDataDetails(
        this.deviceHistoryRepository,
        id,
        this.userRepository
      );

      return resSuccess(
        'Device fetched.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { ...device, ...modifiedData }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async updateDevice(updateDeviceDto: UpdateDeviceDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const deviceData = await this.deviceRepository.findOne({
        where: { id: updateDeviceDto?.id, is_archived: false },
        relations: [
          'created_by',
          'device_type',
          'collection_operation',
          'tenant',
        ],
      });

      if (!deviceData) {
        throw new HttpException(`Device Type not found.`, HttpStatus.NOT_FOUND);
      }
      const user = await this.userRepository.findOneBy({
        id: updateDeviceDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      const deviceTypeData = await this.deviceTypeRepository.findOneBy({
        id: updateDeviceDto?.device_type_id,
      });
      if (!deviceTypeData) {
        throw new HttpException(`Device type not found.`, HttpStatus.NOT_FOUND);
      }
      const deviceUpdateObject = {
        name: updateDeviceDto?.name ?? deviceData?.name,
        short_name: updateDeviceDto?.short_name ?? deviceData?.short_name,
        device_type: updateDeviceDto?.device_type_id ?? deviceData?.device_type,
        description: updateDeviceDto?.description ?? deviceData?.description,
        collection_operation:
          updateDeviceDto.collection_operation_id ??
          deviceData?.collection_operation,
        status: updateDeviceDto.hasOwnProperty('status')
          ? updateDeviceDto.status
          : deviceData?.status,
        created_by: updateDeviceDto?.created_by ?? deviceData?.created_by,
        tenant: this.request.user?.tenant,
        //  updated_by: updateDeviceDto?.updated_by
      };
      const updateDevice = await queryRunner.manager.update(
        Device,
        { id: deviceData.id },
        { ...deviceUpdateObject }
      );
      if (!updateDevice.affected) {
        throw new HttpException(
          `Device update failed.`,
          HttpStatus.NOT_MODIFIED
        );
      }
      const action = 'C';
      await this.updateDeviceHistory(
        queryRunner,
        {
          ...deviceData,
          created_by: updateDeviceDto?.updated_by,
          tenant_id: deviceData?.tenant?.id,
        },
        action
      ).catch((error) => {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
      const savedDevice = await this.deviceRepository.findOne({
        where: {
          id: updateDeviceDto.id,
        },
        relations: ['device_type'],
      });
      await queryRunner.commitTransaction();
      return resSuccess(
        'Device Updated.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedDevice
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async updateDeviceHistory(queryRunner, data: any, action: string) {
    const DeviceC = new DeviceHistory();
    DeviceC.id = BigInt(data?.id);
    DeviceC.name = data.name;
    DeviceC.short_name = data.short_name;
    DeviceC.description = data.description;
    DeviceC.device_type = BigInt(data?.device_type?.id) || null;
    DeviceC.replace_device = data?.replace_device_id
      ? BigInt(data?.replace_device_id)
      : null;
    DeviceC.collection_operation = data?.collection_operation?.id
      ? BigInt(data?.collection_operation?.id)
      : null;
    DeviceC.retire_on = data.retire_on;
    DeviceC.status = data?.status;
    DeviceC.created_by = BigInt(data?.created_by);
    DeviceC.history_reason = 'C';
    DeviceC.tenant_id = data?.tenant_id;
    await queryRunner.manager.save(DeviceC);
    if (action === 'D') {
      const DeviceD = new DeviceHistory();
      DeviceD.id = BigInt(data?.id);
      DeviceD.name = data.name;
      DeviceD.short_name = data.short_name;
      DeviceD.description = data.description;
      DeviceD.device_type = BigInt(data?.device_type?.id) || null;
      DeviceD.replace_device = data?.replace_device_id
        ? BigInt(data?.replace_device_id)
        : null;
      DeviceD.collection_operation = data?.collection_operation?.id
        ? BigInt(data?.collection_operation?.id)
        : null;
      DeviceD.retire_on = data.retire_on;
      DeviceD.status = data?.status;
      DeviceD.created_by = BigInt(data?.created_by);
      DeviceD.history_reason = 'D';
      DeviceC.tenant_id = data?.tenant_id;
      await queryRunner.manager.save(DeviceD);
    }
  }
  async remove(id: any, updatedBy: any): Promise<any> {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const device = await this.deviceRepository.findOne({
        where: { id, is_archived: false },
        relations: [
          'created_by',
          'device_type',
          'collection_operation',
          'tenant',
        ],
      });

      if (!device) {
        throw new HttpException(`Device not found.`, HttpStatus.NOT_FOUND);
      }

      await this.updateDeviceHistory(
        queryRunner,
        { ...device, created_by: updatedBy, tenant_id: device?.tenant?.id },
        'D'
      );

      device.is_archived = true;
      // Archive the Device entity
      const archivedDevice = await queryRunner.manager.save(device);
      if (archivedDevice) {
        const action = 'C';
        await this.updateDeviceHistory(
          queryRunner,
          { ...device, created_by: updatedBy, tenant_id: device?.tenant?.id },
          action
        );
      }
      await queryRunner.commitTransaction();

      return resSuccess(
        'Device Archived',
        SuccessConstants.SUCCESS,
        HttpStatus.GONE,
        archivedDevice
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async scheduleMaintenance(id: any, maintenanceDTO: DeviceMaintenanceDto) {
    try {
      const user = await this.userRepository.findOneBy({
        id: maintenanceDTO?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const maintenance = new DeviceMaintenance();
      maintenance.device = id;
      maintenance.start_date_time = maintenanceDTO?.start_date_time;
      maintenance.end_date_time = maintenanceDTO?.end_date_time;
      maintenance.description = maintenanceDTO?.description;
      maintenance.reduce_slots = maintenanceDTO?.reduce_slots ?? true;
      maintenance.created_by = maintenanceDTO?.created_by;
      maintenance.tenant = this.request.user?.tenant;
      const savedMaintenance = await this.deviceMaintenanceRepository.save(
        maintenance
      );

      return resSuccess(
        'Device Maintenance Created.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedMaintenance
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findMaintenances(id: any) {
    try {
      const device = await this.deviceRepository.findOne({
        where: {
          id,
          is_archived: false,
        },
      });

      if (!device) {
        throw new HttpException(`Device not found.`, HttpStatus.NOT_FOUND);
      }

      const maintenances = await this.deviceMaintenanceRepository
        .createQueryBuilder('dm')
        .where('device = :device_id', { device_id: device.id })
        .execute();

      return resSuccess(
        'Device Maintenances Fetched',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        maintenances
      );
    } catch (e) {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async scheduleRetirement(id: any, retirementDto: DeviceRetirementDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const deviceData = await this.deviceRepository.findOne({
        where: {
          id,
          is_archived: false,
        },
        relations: [
          'device_type',
          'created_by',
          'replace_device',
          'collection_operation',
          'tenant',
        ],
      });
      if (!deviceData) {
        throw new HttpException(`Device not found.`, HttpStatus.NOT_FOUND);
      }
      const user = await this.userRepository.findOneBy({
        id: retirementDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      await this.updateDeviceHistory(
        queryRunner,
        {
          ...deviceData,
          created_by: retirementDto?.created_by,
          tenant_id: deviceData?.tenant?.id,
        },
        'C'
      );

      const updateObject = {
        retire_on: retirementDto?.retire_on ?? deviceData?.retire_on,
        replace_device:
          retirementDto?.replace_device_id ?? deviceData?.replace_device,
        created_by: retirementDto?.created_by ?? deviceData?.created_by,
        tenant: this?.request?.user?.tenant,
      };
      let updatedDevice: any = await queryRunner.manager.update(
        Device,
        { id: deviceData.id },
        { ...updateObject }
      );
      if (!updatedDevice.affected) {
        throw new HttpException(
          `Device retirement failed.`,
          HttpStatus.NOT_MODIFIED
        );
      }

      await queryRunner.commitTransaction();

      updatedDevice = await this.deviceRepository.findOne({
        where: {
          id: deviceData.id,
        },
        relations: ['device_type', 'replace_device'],
      });

      return resSuccess(
        'Device Updated.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        updatedDevice
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
  async unScheduleRetirement(
    id: any,
    retirementDto: DeviceUnscheduleRetirementDto
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const deviceData = await this.deviceRepository.findOne({
        where: {
          id,
          is_archived: false,
        },
        relations: [
          'device_type',
          'created_by',
          'replace_device',
          'collection_operation',
          'tenant',
        ],
      });
      if (!deviceData) {
        throw new HttpException(`Device not found.`, HttpStatus.NOT_FOUND);
      }
      const user = await this.userRepository.findOneBy({
        id: retirementDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      await this.updateDeviceHistory(
        queryRunner,
        {
          ...deviceData,
          created_by: retirementDto?.created_by,
          tenant_id: deviceData?.tenant?.id,
        },
        'C'
      );

      const updateObject = {
        retire_on: null,
        replace_device: null,
        created_by: retirementDto?.created_by ?? deviceData?.created_by,
        tenant: this?.request?.user?.tenant,
      };
      let updatedDevice: any = await queryRunner.manager.update(
        Device,
        { id: deviceData.id },
        { ...updateObject }
      );
      if (!updatedDevice.affected) {
        throw new HttpException(
          `Device unschedule retirement failed.`,
          HttpStatus.NOT_MODIFIED
        );
      }

      await queryRunner.commitTransaction();

      updatedDevice = await this.deviceRepository.findOne({
        where: {
          id: deviceData.id,
        },
        relations: ['device_type', 'replace_device'],
      });

      return resSuccess(
        'Device Updated.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        updatedDevice
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
  async share(id: any, shareDto: DeviceShareDto) {
    try {
      const user = await this.userRepository.findOneBy({
        id: shareDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const deviceShare = new DeviceShare();
      deviceShare.device = id;
      deviceShare.start_date = shareDto?.start_date;
      deviceShare.end_date = shareDto?.end_date;
      deviceShare.from = shareDto?.from;
      deviceShare.to = shareDto?.to;
      deviceShare.created_by = shareDto?.created_by;
      deviceShare.tenant = this.request.user?.tenant;
      const saveddeviceShare = await this.deviceShareRepository.save(
        deviceShare
      );

      return resSuccess(
        'Device Share Created.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        saveddeviceShare
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findShares(id: any) {
    try {
      const deviceData = await this.deviceRepository.findOne({
        where: {
          id,
          is_archived: false,
        },
      });

      if (!deviceData) {
        throw new HttpException(`Device not found.`, HttpStatus.NOT_FOUND);
      }

      const shares = await this.deviceShareRepository
        .createQueryBuilder('ds')
        .leftJoinAndSelect('ds.from', 'from')
        .leftJoinAndSelect('ds.to', 'to')
        .where('device = :device_id', { device_id: deviceData.id })
        .execute();

      return resSuccess(
        'Device Shares Fetched.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        shares
      );
    } catch (e) {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
