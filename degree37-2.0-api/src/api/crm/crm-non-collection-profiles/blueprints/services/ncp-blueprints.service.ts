import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository, Not, EntityManager } from 'typeorm';
import { User } from '../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import {
  resError,
  resSuccess,
} from '../../../../system-configuration/helpers/response';
import { SuccessConstants } from '../../../../system-configuration/constants/success.constants';
import { ErrorConstants } from '../../../../system-configuration/constants/error.constants';
import { CreateNCPBluePrintsDto } from '../dto/create-ncp-blueprints.dto';
import { CrmNonCollectionProfiles } from '../../entities/crm-non-collection-profiles.entity';
import { UpdateNCPBluePrintsDto } from '../dto/update-ncp-blueprints.dto';
import { HistoryService } from '../../../../common/services/history.service';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { NCPBluePrintsInterface } from '../interface/ncp-blueprints.interface';
import { CrmNcpBluePrints } from '../entities/ncp-blueprints.entity';
import { CrmLocations } from 'src/api/crm/locations/entities/crm-locations.entity';
import { shiftable_type_enum } from 'src/api/shifts/enum/shifts.enum';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { ShiftsVehicles } from 'src/api/shifts/entities/shifts-vehicles.entity';
import { ShiftsDevices } from 'src/api/shifts/entities/shifts-devices.entity';
import { ShiftsRoles } from '../entities/shifts-roles.entity';
import { CrmNcpBluePrintsHistory } from '../entities/ncp-blueprints-history.entity';
import { ShiftsHistory } from 'src/api/shifts/entities/shifts-history.entity';
import { Device } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/device/entities/device.entity';
import { Vehicle } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/vehicles/entities/vehicle.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { NCPBluePrintsInfoInterface } from '../../interface/ncp-blueprints-collection-operation-info';

@Injectable()
export class NCPBluePrintsService extends HistoryService<CrmNcpBluePrintsHistory> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CrmNcpBluePrints)
    private readonly bluePrintRepository: Repository<CrmNcpBluePrints>,
    @InjectRepository(CrmNcpBluePrintsHistory)
    private readonly bluePrintHistoryRepository: Repository<CrmNcpBluePrintsHistory>,
    @InjectRepository(CrmLocations)
    private readonly crmLocationsRepository: Repository<CrmLocations>,
    @InjectRepository(Shifts)
    private readonly shiftsRepository: Repository<Shifts>,
    @InjectRepository(ShiftsDevices)
    private readonly shiftsDevicesRepository: Repository<ShiftsDevices>,
    @InjectRepository(ShiftsVehicles)
    private readonly shiftsVehiclesRepository: Repository<ShiftsVehicles>,
    @InjectRepository(ShiftsRoles)
    private readonly shiftsRolesRepository: Repository<ShiftsRoles>,
    @InjectRepository(CrmNonCollectionProfiles)
    private readonly nonCollectionProfilesRepository: Repository<CrmNonCollectionProfiles>,
    @InjectRepository(ShiftsHistory)
    private readonly shiftsHistoryRepository: Repository<ShiftsHistory>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(Vehicle)
    private readonly vehiceRepository: Repository<Vehicle>,
    @InjectRepository(ContactsRoles)
    private readonly contactsRolesRepository: Repository<ContactsRoles>,
    private readonly entityManager: EntityManager
  ) {
    super(bluePrintHistoryRepository);
  }

  async create(
    ncpId: any,
    createNCPBluePrintsDto: CreateNCPBluePrintsDto,
    user: any
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const {
        blueprint_name,
        location_id,
        additional_info,
        shift_schedule,
        is_active,
      }: any = createNCPBluePrintsDto;

      const nonCollectionProfile: any =
        await this.nonCollectionProfilesRepository.findOne({
          where: { id: ncpId, is_archived: false },
        });

      if (!nonCollectionProfile) {
        throw new HttpException(
          `Non-Collection profile not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      const crmLocation = await this.crmLocationsRepository.findOne({
        where: { id: location_id, is_archived: false },
      });

      if (!crmLocation) {
        throw new HttpException(`Location not found.`, HttpStatus.NOT_FOUND);
      }

      const bluePrint = await this.bluePrintRepository.findOne({
        where: {
          blueprint_name: blueprint_name,
        },
      });

      if (bluePrint) {
        throw new HttpException(
          `Blueprint already exists.`,
          HttpStatus.NOT_FOUND
        );
      }

      const crmNcpBluePrints = new CrmNcpBluePrints();
      crmNcpBluePrints.created_by = user;
      crmNcpBluePrints.tenant_id = user.tenant;
      crmNcpBluePrints.blueprint_name = blueprint_name;
      crmNcpBluePrints.additional_info = additional_info;
      crmNcpBluePrints.crm_non_collection_profiles_id = ncpId;
      crmNcpBluePrints.location_id = crmLocation;
      crmNcpBluePrints.id_default = false;
      crmNcpBluePrints.is_archived = false;
      crmNcpBluePrints.is_active = is_active;

      const savedNonCollectionProfile = await queryRunner.manager.save(
        crmNcpBluePrints
      );

      for (const schedule of shift_schedule) {
        const shift = new Shifts();
        shift.shiftable_id = crmNcpBluePrints?.id;
        shift.shiftable_type =
          shiftable_type_enum.CRM_NON_COLLECTION_PROFILES_BLUEPRINTS;
        shift.start_time = schedule.start_time;
        shift.end_time = schedule.end_time;
        shift.break_start_time = schedule.break_start_time;
        shift.break_end_time = schedule.break_end_time;
        shift.created_by = user;
        shift.tenant_id = user.tenant;

        const savedShift = await queryRunner.manager.save(shift);

        for (const vehicleId of schedule.vehicles_ids) {
          const vehicle = await this.vehiceRepository.findOne({
            where: {
              id: vehicleId as any,
              is_archived: false,
            },
          });

          if (!vehicle) {
            throw new HttpException(`Vehicle not found.`, HttpStatus.NOT_FOUND);
          }

          const shiftVehicle = new ShiftsVehicles();
          shiftVehicle.shift_id = savedShift?.id;
          shiftVehicle.vehicle_id = vehicle?.id;
          shiftVehicle.created_by = user;

          await queryRunner.manager.save(shiftVehicle);
        }

        for (const deviceId of schedule.devices_ids) {
          const device = await this.deviceRepository.findOne({
            where: {
              id: deviceId as any,
              is_archived: false,
            },
          });

          if (!device) {
            throw new HttpException(`Device not found.`, HttpStatus.NOT_FOUND);
          }
          const shiftDevice = new ShiftsDevices();
          shiftDevice.shift_id = savedShift?.id;
          shiftDevice.device_id = device?.id;
          shiftDevice.created_by = user;

          await queryRunner.manager.save(shiftDevice);
        }

        const roleQuantities = {};

        for (const roleObj of schedule?.shift_roles) {
          const roleId = roleObj?.role_id as any;
          roleQuantities[roleId] =
            (roleQuantities[roleId] || 0) + (roleObj?.qty || 0);
        }

        const updatedShiftRoles: any = Object.keys(roleQuantities).map(
          (roleId) => ({
            role_id: parseInt(roleId),
            qty: roleQuantities[roleId],
          })
        );

        for (const roleObj of updatedShiftRoles) {
          const role = await this.contactsRolesRepository.findOne({
            where: {
              id: roleObj?.role_id as any,
              function_id: 1 as any,
              is_archived: false,
            },
          });

          if (!role) {
            throw new HttpException(`Role not found.`, HttpStatus.NOT_FOUND);
          }

          const shiftRoles = new ShiftsRoles();
          shiftRoles.shift = savedShift;
          shiftRoles.role_id = roleObj?.role_id;
          shiftRoles.quantity = roleObj?.qty;
          shiftRoles.created_by = user;

          await queryRunner.manager.save(shiftRoles);
        }
      }

      await queryRunner.commitTransaction();
      delete savedNonCollectionProfile?.tenant_id;
      delete savedNonCollectionProfile?.created_by;

      return resSuccess(
        'NCP blueprint created successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedNonCollectionProfile
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(ncpId: any, ncpBluePrintsInterface: NCPBluePrintsInterface) {
    try {
      let blueprintsWithShiftInfo = null;
      const { keyword, tenant_id, sortBy, sortOrder, is_active } =
        ncpBluePrintsInterface;
      let { page, limit } = ncpBluePrintsInterface;

      limit = limit ? +limit : +process.env.PAGE_SIZE;

      page = page ? +page : 1;

      let where: any = {
        crm_non_collection_profiles_id: { id: ncpId },
        is_archived: false,
        tenant_id: { id: tenant_id },
      };

      if (keyword) {
        where = {
          ...where,
          blueprint_name: ILike(`%${keyword}%`),
        };
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
      let order: any = { id: 'DESC' };

      if (sortBy) {
        const orderDirection = sortOrder || 'DESC';
        if (sortBy == 'location_id') {
          order = { location_id: { name: orderDirection } };
        } else {
          const orderBy = sortBy;
          order = { [orderBy]: orderDirection };
        }
      }

      const [response, count] = await this.bluePrintRepository.findAndCount({
        where,
        relations: [
          'created_by',
          'tenant_id',
          'location_id',
          'crm_non_collection_profiles_id',
        ],
        take: limit,
        skip: (page - 1) * limit,
        order,
      });

      if (response?.length) {
        const bluePrintIds = response?.map((item) => item.id);

        const shifts = await this.shiftsRepository
          .createQueryBuilder('shift')
          .select([
            'shift.shiftable_id',
            'MIN(shift.start_time) AS min_start_time',
            'MAX(shift.end_time) AS max_end_time',
          ])
          .where({
            shiftable_id: In(bluePrintIds),
            shiftable_type:
              shiftable_type_enum.CRM_NON_COLLECTION_PROFILES_BLUEPRINTS,
            is_archived: false,
          })
          .groupBy('shift.shiftable_id')
          .getRawMany();

        blueprintsWithShiftInfo = response?.map((blueprint) => {
          const shiftInfo = shifts.find(
            (shift) => shift.shift_shiftable_id === blueprint.id
          );
          const formatTime = (time: any) => {
            if (!time) return null;
            const formattedTime = new Date(time).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            });
            return formattedTime;
          };

          return {
            ...blueprint,
            min_start_time: formatTime(shiftInfo?.min_start_time),
            max_end_time: formatTime(shiftInfo?.max_end_time),
          };
        });
      }

      return {
        status: HttpStatus.OK,
        message: 'NCP Blue Prints Fetched successfully',
        count: count,
        data: blueprintsWithShiftInfo ?? response,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findOne(id: any) {
    try {
      const nonCollectionProfile: any = await this.bluePrintRepository.findOne({
        where: { id, is_archived: false },
        relations: [
          'created_by',
          'tenant_id',
          'location_id',
          'crm_non_collection_profiles_id',
        ],
      });

      if (!nonCollectionProfile) {
        throw new HttpException(`Blue print not found.`, HttpStatus.NOT_FOUND);
      }
      const modifiedData = await getModifiedDataDetails(
        this.bluePrintHistoryRepository,
        id,
        this.userRepository
      );
      const modified_by = modifiedData['modified_by'];
      const modified_at = modifiedData['modified_at'];

      return resSuccess(
        'NCP blue print fetched successfully.',
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

  async findShifts(id: any) {
    try {
      const shifts: any = await this.shiftsRepository.find({
        where: {
          shiftable_id: id,
          shiftable_type:
            shiftable_type_enum.CRM_NON_COLLECTION_PROFILES_BLUEPRINTS,
          is_archived: false,
        },
      });

      if (!shifts) {
        throw new HttpException(`Shifts not found.`, HttpStatus.NOT_FOUND);
      }

      const formatTime = async (time: any) => {
        if (!time) return null;
        const formattedTime = new Date(time).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });
        return formattedTime;
      };
      const promises = shifts.map(async (shift: any) => {
        shift.start_time = await formatTime(shift.start_time);
        shift.end_time = await formatTime(shift.end_time);
        shift.break_start_time = await formatTime(shift.break_start_time);
        shift.break_end_time = await formatTime(shift.break_end_time);

        const shiftDevices = await this.shiftsDevicesRepository.find({
          where: {
            shift_id: shift.id,
          },
          relations: ['device'],
          select: ['device_id', 'device'],
        });

        const shiftVehicles = await this.shiftsVehiclesRepository.find({
          where: {
            shift_id: shift.id,
          },
          relations: ['vehicle'],
          select: ['vehicle_id', 'vehicle'],
        });

        const vehicles: any = [];
        for (const vehicle of shiftVehicles) {
          const vehicleData = await this.vehiceRepository.findOne({
            where: {
              id: vehicle.vehicle_id,
            },
          });

          vehicles.push({
            vehicle_id: vehicleData?.id,
            vehicle: vehicleData,
          });
        }

        const shiftRoles = await this.shiftsRolesRepository.find({
          where: {
            shift_id: shift.id,
          },
          relations: ['role'],
          select: ['role_id', 'role', 'quantity'],
        });

        shift = {
          ...shift,
          shiftDevices,
          shiftVehicles: vehicles,
          shiftRoles,
        };

        return shift;
      });

      const shiftsWithData = await Promise.all(promises);

      return resSuccess(
        'NCP blue print shifts fetched successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        shiftsWithData
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async update(
    bluePrintId: any,
    updateNCPBluePrintsDto: UpdateNCPBluePrintsDto,
    user: any
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const {
        blueprint_name,
        location_id,
        additional_info,
        shift_schedule,
        is_active,
      }: any = updateNCPBluePrintsDto;

      const crmLocation = await this.crmLocationsRepository.findOne({
        where: { id: location_id, is_archived: false },
      });

      if (!crmLocation) {
        throw new HttpException(`Location not found.`, HttpStatus.NOT_FOUND);
      }

      const bluePrint = await this.bluePrintRepository.findOneBy({
        blueprint_name,
        id: Not(bluePrintId),
      });

      if (bluePrint) {
        throw new HttpException(
          `Blueprint already exists.`,
          HttpStatus.NOT_FOUND
        );
      }

      const crmNcpBluePrints: any = await this.bluePrintRepository.findOne({
        where: { id: bluePrintId, is_archived: false },
        relations: [
          'created_by',
          'tenant_id',
          'location_id',
          'crm_non_collection_profiles_id',
        ],
      });

      const crmNcpBluePrintsBeforeUpdate = { ...crmNcpBluePrints };

      crmNcpBluePrints.blueprint_name = blueprint_name;
      crmNcpBluePrints.additional_info = additional_info;
      crmNcpBluePrints.location_id = crmLocation;
      crmNcpBluePrints.is_active = is_active;

      const updatedNonCollectionProfile = await queryRunner.manager.save(
        crmNcpBluePrints
      );

      const blueprintHistory = new CrmNcpBluePrintsHistory();

      Object.assign(blueprintHistory, crmNcpBluePrintsBeforeUpdate);

      blueprintHistory.blueprint_name =
        crmNcpBluePrintsBeforeUpdate?.blueprint_name;
      blueprintHistory.crm_non_collection_profiles_id =
        crmNcpBluePrintsBeforeUpdate?.crm_non_collection_profiles_id?.id;
      blueprintHistory.location_id =
        crmNcpBluePrintsBeforeUpdate?.location_id?.id;
      blueprintHistory.additional_info =
        crmNcpBluePrintsBeforeUpdate?.additional_info;
      blueprintHistory.is_active = crmNcpBluePrintsBeforeUpdate?.is_active;
      blueprintHistory.id_default = crmNcpBluePrintsBeforeUpdate?.id_default;
      blueprintHistory.tenant_id = crmNcpBluePrintsBeforeUpdate?.tenant_id?.id;
      blueprintHistory.created_by = user?.id;
      blueprintHistory.is_archived = crmNcpBluePrintsBeforeUpdate?.is_archived;
      blueprintHistory.history_reason = 'C';
      delete blueprintHistory?.created_at;
      await this.createHistory(blueprintHistory);

      const existingShifts: any = await this.shiftsRepository.find({
        where: {
          shiftable_id: crmNcpBluePrints?.id,
          shiftable_type:
            shiftable_type_enum.CRM_NON_COLLECTION_PROFILES_BLUEPRINTS,
        },
      });

      if (!existingShifts.length) {
        throw new Error('Shifts not found for the given blueprint');
      }

      for (const shift of existingShifts) {
        await this.shiftsVehiclesRepository.delete({
          shift_id: shift?.id,
        });

        await this.shiftsDevicesRepository.delete({
          shift_id: shift?.id,
        });

        await this.shiftsRolesRepository.delete({
          shift_id: shift?.id,
        });

        await this.shiftsRepository.delete({
          id: shift?.id,
        });

        const shiftHistory = new ShiftsHistory();

        Object.assign(shiftHistory, shift);

        shiftHistory.start_time = shift?.start_time;
        shiftHistory.end_time = shift?.end_time;
        shiftHistory.break_start_time = shift?.break_start_time;
        shiftHistory.break_end_time = shift?.break_end_time;
        shiftHistory.tenant_id = shift?.tenant_id?.id;
        shiftHistory.created_by = user?.id;
        shiftHistory.is_archived = shift?.is_archived;
        shiftHistory.tenant_id = shift?.tenant_id;
        shiftHistory.history_reason = 'C';
        delete shiftHistory?.created_at;
        await queryRunner.manager.save(shiftHistory);
      }

      for (const shiftSchedule of shift_schedule) {
        const shift = new Shifts();
        shift.shiftable_id = crmNcpBluePrints?.id;
        shift.shiftable_type =
          shiftable_type_enum.CRM_NON_COLLECTION_PROFILES_BLUEPRINTS;
        shift.start_time = shiftSchedule.start_time;
        shift.end_time = shiftSchedule.end_time;
        shift.break_start_time = shiftSchedule.break_start_time;
        shift.break_end_time = shiftSchedule.break_end_time;
        shift.created_by = user;
        shift.tenant_id = user.tenant;

        const savedShift = await queryRunner.manager.save(shift);

        for (const vehicleId of shiftSchedule.vehicles_ids) {
          const vehicle = await this.vehiceRepository.findOne({
            where: {
              id: vehicleId as any,
              is_archived: false,
            },
          });

          if (!vehicle) {
            throw new HttpException(`Vehicle not found.`, HttpStatus.NOT_FOUND);
          }
          const shiftVehicle = new ShiftsVehicles();
          shiftVehicle.shift_id = savedShift?.id;
          shiftVehicle.vehicle_id = vehicleId;
          shiftVehicle.created_by = user;

          await queryRunner.manager.save(shiftVehicle);
        }

        for (const deviceId of shiftSchedule.devices_ids) {
          const device = await this.deviceRepository.findOne({
            where: {
              id: deviceId as any,
              is_archived: false,
            },
          });

          if (!device) {
            throw new HttpException(`Device not found.`, HttpStatus.NOT_FOUND);
          }

          const shiftDevice = new ShiftsDevices();
          shiftDevice.shift_id = savedShift?.id;
          shiftDevice.device_id = device?.id;
          shiftDevice.created_by = user;

          await queryRunner.manager.save(shiftDevice);
        }

        const roleQuantities = {};

        for (const roleObj of shiftSchedule?.shift_roles) {
          const roleId = roleObj?.role_id as any;
          roleQuantities[roleId] =
            (roleQuantities[roleId] || 0) + (roleObj?.qty || 0);
        }

        const updatedShiftRoles: any = Object.keys(roleQuantities).map(
          (roleId) => ({
            role_id: parseInt(roleId),
            qty: roleQuantities[roleId],
          })
        );

        for (const roleObj of updatedShiftRoles) {
          const role = await this.contactsRolesRepository.findOne({
            where: {
              id: roleObj?.role_id as any,
              is_archived: false,
              function_id: 1 as any,
            },
          });

          if (!role) {
            throw new HttpException(`Role not found.`, HttpStatus.NOT_FOUND);
          }
          const shiftRoles = new ShiftsRoles();
          shiftRoles.shift_id = savedShift?.id;
          shiftRoles.role_id = roleObj?.role_id;
          shiftRoles.quantity = roleObj?.qty;
          shiftRoles.created_by = user;

          await queryRunner.manager.save(shiftRoles);
        }
      }

      await queryRunner.commitTransaction();

      return resSuccess(
        'NCP blueprint updated successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        updatedNonCollectionProfile
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async archive(id: any, req: any) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const crmNcpBluePrints: any = await this.bluePrintRepository.findOne({
        where: { id: id },
        relations: [
          'created_by',
          'tenant_id',
          'location_id',
          'crm_non_collection_profiles_id',
        ],
      });

      if (!crmNcpBluePrints) {
        throw new HttpException(
          `NCP blue print not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      if (crmNcpBluePrints?.is_archived) {
        throw new HttpException(
          `NCP blue print is already archived.`,
          HttpStatus.NOT_FOUND
        );
      }

      crmNcpBluePrints.is_archived = true;
      const archivedBluePrint = await queryRunner.manager.save(
        crmNcpBluePrints
      );

      const crmNcpBluePrintsHistoryC = new CrmNcpBluePrintsHistory();
      Object.assign(crmNcpBluePrintsHistoryC, archivedBluePrint);
      crmNcpBluePrintsHistoryC.blueprint_name =
        archivedBluePrint?.blueprint_name;
      crmNcpBluePrintsHistoryC.crm_non_collection_profiles_id =
        archivedBluePrint?.crm_non_collection_profiles_id?.id;
      crmNcpBluePrintsHistoryC.location_id = archivedBluePrint?.location_id?.id;
      crmNcpBluePrintsHistoryC.additional_info =
        archivedBluePrint?.additional_info;
      crmNcpBluePrintsHistoryC.is_active = archivedBluePrint?.is_active;
      crmNcpBluePrintsHistoryC.id_default = archivedBluePrint?.id_default;
      crmNcpBluePrintsHistoryC.tenant_id = archivedBluePrint?.tenant_id?.id;
      crmNcpBluePrintsHistoryC.created_by = req?.user?.id;
      crmNcpBluePrintsHistoryC.is_archived = archivedBluePrint?.is_archived;
      crmNcpBluePrintsHistoryC.history_reason = 'C';
      delete crmNcpBluePrintsHistoryC?.created_at;
      await queryRunner.manager.save(crmNcpBluePrintsHistoryC);

      const crmNcpBluePrintsHistoryD = new CrmNcpBluePrintsHistory();
      Object.assign(crmNcpBluePrintsHistoryD, archivedBluePrint);
      crmNcpBluePrintsHistoryD.blueprint_name =
        archivedBluePrint?.blueprint_name;
      crmNcpBluePrintsHistoryD.crm_non_collection_profiles_id =
        archivedBluePrint?.crm_non_collection_profiles_id?.id;
      crmNcpBluePrintsHistoryD.location_id = archivedBluePrint?.location_id?.id;
      crmNcpBluePrintsHistoryD.additional_info =
        archivedBluePrint?.additional_info;
      crmNcpBluePrintsHistoryD.is_active = archivedBluePrint?.is_active;
      crmNcpBluePrintsHistoryD.id_default = archivedBluePrint?.id_default;
      crmNcpBluePrintsHistoryD.tenant_id = archivedBluePrint?.tenant_id?.id;
      crmNcpBluePrintsHistoryD.created_by = req?.user?.id;
      crmNcpBluePrintsHistoryD.is_archived = archivedBluePrint?.is_archived;
      crmNcpBluePrintsHistoryD.history_reason = 'D';
      delete crmNcpBluePrintsHistoryD?.created_at;
      await queryRunner.manager.save(crmNcpBluePrintsHistoryD);

      const existingShifts: any = await this.shiftsRepository.find({
        where: {
          shiftable_id: crmNcpBluePrints?.id,
          shiftable_type:
            shiftable_type_enum.CRM_NON_COLLECTION_PROFILES_BLUEPRINTS,
        },
      });

      for (const shift of existingShifts) {
        shift.is_archived = true;
        await this.shiftsRepository.save(shift);

        const shiftHistoryC = new ShiftsHistory();
        Object.assign(shiftHistoryC, shift);
        shiftHistoryC.start_time = shift?.start_time;
        shiftHistoryC.end_time = shift?.end_time;
        shiftHistoryC.break_start_time = shift?.break_start_time;
        shiftHistoryC.break_end_time = shift?.break_end_time;
        shiftHistoryC.tenant_id = shift?.tenant_id?.id;
        shiftHistoryC.created_by = req?.user?.id;
        shiftHistoryC.is_archived = shift?.is_archived;
        shiftHistoryC.tenant_id = shift?.tenant_id;
        shiftHistoryC.history_reason = 'C';
        delete shiftHistoryC?.created_at;
        await queryRunner.manager.save(shiftHistoryC);

        const shiftHistoryD = new ShiftsHistory();
        Object.assign(shiftHistoryD, shift);
        shiftHistoryD.start_time = shift?.start_time;
        shiftHistoryD.end_time = shift?.end_time;
        shiftHistoryD.break_start_time = shift?.break_start_time;
        shiftHistoryD.break_end_time = shift?.break_end_time;
        shiftHistoryD.tenant_id = shift?.tenant_id?.id;
        shiftHistoryD.created_by = req?.user?.id;
        shiftHistoryD.is_archived = shift?.is_archived;
        shiftHistoryD.tenant_id = shift?.tenant_id;
        shiftHistoryD.history_reason = 'D';
        delete shiftHistoryD?.created_at;
        await queryRunner.manager.save(shiftHistoryD);

        const shiftVehicles = await this.shiftsVehiclesRepository.find({
          where: {
            shift_id: shift?.id,
          },
        });

        if (shiftVehicles?.length) {
          for (const vehicle of shiftVehicles) {
            vehicle.is_archived = true;
            await queryRunner.manager.save(vehicle);
          }
        }

        const shiftDevices = await this.shiftsDevicesRepository.find({
          where: {
            shift_id: shift?.id,
          },
        });

        if (shiftDevices?.length) {
          for (const device of shiftDevices) {
            device.is_archived = true;
            await queryRunner.manager.save(device);
          }
        }

        const shiftRoles = await this.shiftsRolesRepository.find({
          where: {
            shift_id: shift?.id,
          },
        });

        if (shiftRoles?.length) {
          for (const role of shiftRoles) {
            role.is_archived = true;
            await queryRunner.manager.save(role);
          }
        }
      }

      await queryRunner.commitTransaction();
      return resSuccess(
        'NCP blue print archived successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async makeDefault(id: any, req: any) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const crmNcpBluePrints: any = await this.bluePrintRepository.findOne({
        where: { id: id },
        relations: ['crm_non_collection_profiles_id'],
      });

      await this.bluePrintRepository.update(
        {
          crm_non_collection_profiles_id:
            crmNcpBluePrints?.crm_non_collection_profiles_id?.id,
        },
        { id_default: false }
      );

      if (!crmNcpBluePrints) {
        throw new HttpException(
          `NCP blue print not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      if (crmNcpBluePrints?.is_archived) {
        throw new HttpException(
          `NCP blue print is already archived.`,
          HttpStatus.NOT_FOUND
        );
      }

      crmNcpBluePrints.id_default = true;
      await queryRunner.manager.save(crmNcpBluePrints);

      await queryRunner.commitTransaction();
      return resSuccess(
        'NCP blue print made default successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async getColectionOperationInfo(
    collection_opration_id: any,
    ncpBpCollectionOperationInfo: NCPBluePrintsInfoInterface,
    req: any
  ) {
    try {
      const { vehicles, devices, roles } = ncpBpCollectionOperationInfo;

      if (vehicles) {
        const vehiclesQuery: any = this.vehiceRepository
          .createQueryBuilder('vehicle')
          .select([
            'vehicle.id AS id',
            'vehicle.name AS name',
            'vehicle.short_name AS short_name',
            'vehicle.retire_on AS retire_on',
            'vm.start_date_time AS vm_start_date_time',
            'vm.end_date_time AS vm_end_date_time',
            'vm.prevent_booking AS vm_prevent_booking',
          ])
          .leftJoin('vehicle_maintenance', 'vm', 'vm.vehicle_id = vehicle.id')

          .where(
            `vehicle.is_archived = false AND vehicle.is_active = true AND vehicle.collection_operation_id = ${collection_opration_id}`
          )
          .getQuery();

        const vehiclesData = await this.vehiceRepository.query(vehiclesQuery);

        return {
          status: HttpStatus.OK,
          message: 'Collection Operation Vehicles fetched Successfully',
          data: vehiclesData,
        };
      } else if (devices) {
        const where: any = {
          is_archived: false,
          collection_operation: { id: collection_opration_id },
        };
        const devicesQuery = await this.deviceRepository
          .createQueryBuilder('devices')
          .select([
            'devices.id AS id',
            'devices.name AS name',
            'devices.short_name AS short_name',
            'devices.retire_on AS retire_on',
            'dm.start_date_time AS vm_start_date_time',
            'dm.end_date_time AS vm_end_date_time',
          ])
          .leftJoin('device_maintenance', 'dm', 'dm.device = devices.id')

          .where(
            `devices.is_archived = false AND devices.collection_operation = ${collection_opration_id}`
          )
          .getQuery();

        const devices = await this.vehiceRepository.query(devicesQuery);

        return {
          status: HttpStatus.OK,
          message: 'Collection Operation Devices  Fetched Successfully',
          data: devices,
        };
      } else if (roles) {
        const role_id: any = 1;
        const roles = await this.contactsRolesRepository.find({
          where: {
            function_id: role_id,
            is_archived: false,
            tenant: { id: req.user?.tenant?.id },
            status: true,
          },
        });

        return {
          status: HttpStatus.OK,
          message: 'Collection Operation Roles Fetched Successfully',
          data: roles,
        };
      }
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
