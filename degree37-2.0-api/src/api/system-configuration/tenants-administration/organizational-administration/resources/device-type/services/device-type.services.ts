import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { DeviceType } from '../entity/device-type.entity';
import {
  GetAllDeviceTypesInterface,
  ArchiveDeviceTypeInterface,
} from '../interface/device-type.interface';
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
import { CreateDeviceTypeDto } from '../dto/create-device-type.dto';
import { UpdateDeviceTypeDto } from '../dto/update-device-type.dto';
import { ProcedureTypes } from '../../../products-procedures/procedure-types/entities/procedure-types.entity';
import { DeviceTypeHistory } from '../entity/deviceTypeHistory';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
dotenv.config();

@Injectable({ scope: Scope.REQUEST })
export class DeviceTypeService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(DeviceType)
    private readonly deviceTypeRepository: Repository<DeviceType>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProcedureTypes)
    private readonly procedureTypesRepository: Repository<ProcedureTypes>,
    @InjectRepository(DeviceTypeHistory)
    private readonly deviceTypeHistoryRepository: Repository<DeviceTypeHistory>
  ) {}

  async addDeviceType(createDeviceTypeDto: CreateDeviceTypeDto) {
    try {
      const user = await this.userRepository.findOneBy({
        id: createDeviceTypeDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      const procedureType = await this.procedureTypesRepository.findOneBy({
        id: createDeviceTypeDto?.procedure_type,
      });
      if (!procedureType) {
        throw new HttpException(
          `Procedure type not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      const deviceType = new DeviceType();
      deviceType.name = createDeviceTypeDto?.name;
      deviceType.procedure_type = createDeviceTypeDto?.procedure_type;
      deviceType.description = createDeviceTypeDto?.description;
      deviceType.status = createDeviceTypeDto?.status ?? true;
      deviceType.created_by = createDeviceTypeDto?.created_by;
      deviceType.tenant = this.request.user?.tenant;
      const savedDeviceType = await this.deviceTypeRepository.save(deviceType);
      return resSuccess(
        'Device Type created successfully', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedDeviceType
      );
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAll(getAllDeviceTypesInterface: GetAllDeviceTypesInterface) {
    try {
      const limit: number = getAllDeviceTypesInterface?.limit
        ? +getAllDeviceTypesInterface?.limit
        : +process.env.PAGE_SIZE;

      let page = getAllDeviceTypesInterface?.page
        ? +getAllDeviceTypesInterface?.page
        : 1;

      if (page < 1) {
        page = 1;
      }
      let orderObject: any = {
        id: 'DESC',
      };
      const where = { is_archive: false };
      if (getAllDeviceTypesInterface?.name) {
        Object.assign(where, {
          name: ILike(`%${getAllDeviceTypesInterface?.name}%`),
        });
      }
      if (getAllDeviceTypesInterface.hasOwnProperty('status')) {
        Object.assign(where, {
          status: getAllDeviceTypesInterface.status,
        });
      }

      if (getAllDeviceTypesInterface?.sortBy) {
        if (getAllDeviceTypesInterface?.sortBy === 'procedure_type') {
          const sortOrder = getAllDeviceTypesInterface.sortOrder ?? 'DESC';
          orderObject = {
            procedure_type: {
              name: sortOrder,
            },
          };
        } else {
          const sortKey = getAllDeviceTypesInterface.sortBy;
          const sortOrder = getAllDeviceTypesInterface.sortOrder ?? 'DESC';
          orderObject = { [sortKey]: sortOrder };
        }
      }

      Object.assign(where, {
        tenant: { id: this.request.user?.tenant?.id },
      });

      let response;
      let count;
      if (getAllDeviceTypesInterface?.fetchAll) {
        [response, count] = await this.deviceTypeRepository.findAndCount({
          where,
          relations: ['procedure_type'],
        });
      } else {
        [response, count] = await this.deviceTypeRepository.findAndCount({
          where,
          relations: ['procedure_type'],
          take: limit,
          skip: (page - 1) * limit,
          order: { ...orderObject },
        });
      }

      return {
        status: HttpStatus.OK,
        response: 'Device types fetched successfully',
        count: count,
        data: response,
      };
    } catch (error) {
      // return error
      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async find(id: any) {
    try {
      const deviceTypeData = await this.deviceTypeRepository.findOneBy({
        id: id,
      });
      if (!deviceTypeData) {
        throw new HttpException(`Device Type not found.`, HttpStatus.NOT_FOUND);
      }
      const deviceType: any = await this.deviceTypeRepository.findOne({
        where: {
          id: id,
        },
        relations: ['procedure_type', 'created_by'],
      });

      const getName = await this.userRepository.findOneBy({
        id: deviceType?.created_by?.id,
      });
      const modifiedData: any = await getModifiedDataDetails(
        this.deviceTypeHistoryRepository,
        id,
        this.userRepository
      );

      const deviceTypeDetails = {
        ...deviceType,
        ...modifiedData,
        created_by: {
          id: deviceType?.created_by?.id,
          first_name: getName?.first_name,
          last_name: getName?.last_name,
        },
      };

      return resSuccess(
        'Device Type fetch successfully', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        deviceTypeDetails
      );
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async updateDeviceType(updateDeviceTypeDto: UpdateDeviceTypeDto) {
    try {
      const deviceTypeData = await this.deviceTypeRepository.findOne({
        where: {
          id: updateDeviceTypeDto.id,
        },
        relations: ['procedure_type', 'created_by', 'tenant'],
      });
      if (!deviceTypeData) {
        throw new HttpException(`Device Type not found.`, HttpStatus.NOT_FOUND);
      }
      const user = await this.userRepository.findOneBy({
        id: updateDeviceTypeDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      const procedureType = await this.procedureTypesRepository.findOneBy({
        id: updateDeviceTypeDto?.procedure_type,
      });
      if (!procedureType) {
        throw new HttpException(
          `Procedure type not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      const deviceTypeUpdateObject = {
        name: updateDeviceTypeDto?.name ?? deviceTypeData?.name,
        procedure_type: updateDeviceTypeDto?.procedure_type,
        description:
          updateDeviceTypeDto?.description ?? deviceTypeData?.description,
        status: updateDeviceTypeDto.hasOwnProperty('status')
          ? updateDeviceTypeDto.status
          : deviceTypeData?.status,
        created_by: updateDeviceTypeDto?.created_by,
        tenant: deviceTypeData?.tenant,
        // updated_by: updateDeviceTypeDto?.updated_by
      };
      const updateDeviceType = await this.deviceTypeRepository.update(
        { id: deviceTypeData.id },
        { ...deviceTypeUpdateObject }
      );
      if (!updateDeviceType.affected) {
        throw new HttpException(
          `device type update failed.`,
          HttpStatus.NOT_MODIFIED
        );
      }
      await this.deviceHistoryCreate({
        ...deviceTypeData,
        created_by: updateDeviceTypeDto?.updated_by,
        tenant_id: deviceTypeData?.tenant?.id,
      });
      const savedDeviceType = await this.deviceTypeRepository.findOne({
        where: {
          id: updateDeviceTypeDto.id,
        },
        relations: ['procedure_type'],
      });
      return resSuccess(
        'Device Type updated successfully', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedDeviceType
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
  async archiveDeviceType(
    archiveDeviceTypeInterface: ArchiveDeviceTypeInterface,
    updatedBy: any
  ) {
    try {
      const deviceTypeData = await this.deviceTypeRepository.findOne({
        where: { id: archiveDeviceTypeInterface?.id },
        relations: ['tenant'],
      });
      if (!deviceTypeData) {
        throw new HttpException(`Device Type not found.`, HttpStatus.NOT_FOUND);
      }
      const updateDeviceType = await this.deviceTypeRepository.update(
        { id: deviceTypeData.id },
        { is_archive: archiveDeviceTypeInterface.is_archive }
      );
      if (!updateDeviceType.affected) {
        throw new HttpException(
          `device type archived failed.`,
          HttpStatus.NOT_MODIFIED
        );
      }

      await this.deviceHistoryCreate({
        ...deviceTypeData,
        created_by: updatedBy,
        tenant_id: deviceTypeData?.tenant?.id,
      });
      const savedDeviceType = await this.deviceTypeRepository.findOne({
        where: {
          id: archiveDeviceTypeInterface.id,
        },
        relations: ['procedure_type'],
      });
      return resSuccess(
        'Device Type archived successfully', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedDeviceType
      );
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
  async deviceHistoryCreate(deviceType, type = 'C') {
    try {
      const deviceTypeHistoryObject = new DeviceTypeHistory();
      deviceTypeHistoryObject.name = deviceType?.name;
      deviceTypeHistoryObject.procedure_type_id =
        deviceType?.procedure_type?.id;
      deviceTypeHistoryObject.description = deviceType?.description;
      deviceTypeHistoryObject.status = deviceType.status;
      deviceTypeHistoryObject.created_by = deviceType?.created_by;
      deviceTypeHistoryObject.history_reason = 'C';
      deviceTypeHistoryObject.id = deviceType.id;
      deviceTypeHistoryObject.tenant_id = deviceType?.tenant_id;
      await this.deviceTypeHistoryRepository.save(deviceTypeHistoryObject);
      if (type === 'D') {
        const deviceTypeHistoryDelete = new DeviceTypeHistory();
        deviceTypeHistoryDelete.name = deviceType?.name;
        deviceTypeHistoryDelete.procedure_type_id =
          deviceType?.procedure_type?.id;
        deviceTypeHistoryDelete.description = deviceType?.description;
        deviceTypeHistoryDelete.status = deviceType.status;
        deviceTypeHistoryDelete.created_by = deviceType?.created_by;
        deviceTypeHistoryDelete.history_reason = 'D';
        deviceTypeHistoryDelete.id = deviceType.id;
        deviceTypeHistoryObject.tenant_id = deviceType?.tenant_id;
        await this.deviceTypeHistoryRepository.save(deviceTypeHistoryDelete);
      }
      return resSuccess(
        'Device Type History Saved successfully', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        {}
      );
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
