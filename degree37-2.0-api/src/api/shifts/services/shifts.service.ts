import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository, LessThan, Between } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import {
  resError,
  resSuccess,
} from '../../system-configuration/helpers/response';
import { ErrorConstants } from '../../system-configuration/constants/error.constants';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { HistoryService } from '../../common/services/history.service';
import moment from 'moment';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { ShiftsHistory } from '../entities/shifts-history.entity';
import { Shifts } from '../entities/shifts.entity';
import { QueryRunner } from 'typeorm/browser';
import { ShiftsDto } from '../dto/shifts.dto';
import { Drives } from 'src/api/operations-center/operations/drives/entities/drives.entity';
import { shiftable_type_enum } from '../enum/shifts.enum';
import { ShiftsProjectionsStaff } from '../entities/shifts-projections-staff.entity';
import { ShiftsVehicles } from '../entities/shifts-vehicles.entity';
import { ShiftsDevices } from '../entities/shifts-devices.entity';
import { ShiftsStaffSetups } from '../entities/shifts-staffsetups.entity';
import { ShiftsSlots } from '../entities/shifts-slots.entity';
import { HistoryReason } from 'src/common/enums/history_reason.enum';
import { ShiftsProjectionsStaffHistory } from '../entities/shifts-projections-staff-history.entity';
import { ShiftsStaffSetupsHistory } from '../entities/shifts-staffsetups-history.entity';
import { ShiftsVehiclesHistory } from '../entities/shifts-vehicles-history.entity';
import { ShiftsSlotsHistory } from '../entities/shifts-slots-history.entity';
import { ShiftsDevicesHistory } from '../entities/shifts-devices-history.entity';
import { StaffSetup } from 'src/api/system-configuration/tenants-administration/staffing-administration/staff-setups/entity/staffSetup.entity';
import { Vehicle } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/vehicles/entities/vehicle.entity';
import { ProcedureTypesProducts } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/procedure-types/entities/procedure-types-products.entity';
import { Products } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/products/entities/products.entity';

dotenv.config();

@Injectable()
export class ShiftsService extends HistoryService<ShiftsHistory> {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepo: Repository<Products>,
    @InjectRepository(ProcedureTypesProducts)
    private readonly procedureTypesProductsRepo: Repository<ProcedureTypesProducts>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(StaffSetup)
    private readonly staffSetupRepo: Repository<StaffSetup>,
    @InjectRepository(ShiftsProjectionsStaffHistory)
    private readonly shiftsProjectionsStaffHistoryRepo: Repository<ShiftsProjectionsStaffHistory>,
    @InjectRepository(ShiftsProjectionsStaff)
    private readonly shiftsProjectionsStaffRepo: Repository<ShiftsProjectionsStaff>,
    @InjectRepository(ShiftsDevices)
    private readonly shiftDeviceRepo: Repository<ShiftsDevices>,
    @InjectRepository(ShiftsSlots)
    private readonly shiftsSlotsRepo: Repository<ShiftsSlots>,
    @InjectRepository(ShiftsVehicles)
    private readonly shiftsVehiclesRepo: Repository<ShiftsVehicles>,
    @InjectRepository(ShiftsStaffSetups)
    private readonly shiftsStaffSetupRepo: Repository<ShiftsStaffSetups>,
    @InjectRepository(Shifts)
    private readonly shiftsRepository: Repository<Shifts>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ShiftsHistory)
    private readonly shiftsHistory: Repository<ShiftsHistory>,
    private readonly entityManager: EntityManager
  ) {
    super(shiftsHistory);
  }

  async createShiftByShiftAble(
    body,
    queryRunner: QueryRunner,
    shifts: ShiftsDto[],
    data: any,
    created_by: User,
    tenant_id,
    shiftable_type: shiftable_type_enum,
    hasVehicles: boolean,
    hasSlots: boolean
  ) {
    console.log('Creating shifts with following data', shifts.length);
    for (let i = 0; i < shifts.length; i++) {
      console.log(`Creating shifts ${i}`);
      const shiftItem = shifts[i];
      const shift = new Shifts();
      shift.shiftable_id = data.id;
      shift.shiftable_type = shiftable_type;
      shift.start_time = shiftItem.start_time;
      shift.end_time = shiftItem.end_time;
      if (shiftItem.break_start_time) {
        shift.break_start_time =
          shiftItem.break_start_time != ''
            ? new Date(shiftItem.break_start_time)
            : null;
      }
      if (shiftItem.break_end_time) {
        shift.break_end_time =
          shiftItem.break_end_time != ''
            ? new Date(shiftItem.break_end_time)
            : null;
      }

      shift.created_by = created_by;
      shift.oef_procedures = shiftItem.oef_procedures;
      shift.oef_products = shiftItem.oef_products;
      shift.reduce_slots = shiftItem.reduce_slots;
      shift.reduction_percentage = shiftItem.reduction_percentage;
      shift.tenant_id = tenant_id;
      await queryRunner.manager.save(shift);

      for (const projectionItem of shiftItem.projections) {
        for (const staffSetup of projectionItem.staff_setups) {
          const projection = new ShiftsProjectionsStaff();
          projection.procedure_type_id = projectionItem.procedure_type_id;
          projection.procedure_type_qty = projectionItem.procedure_type_qty;
          projection.product_yield = projectionItem.product_yield;
          projection.shift = shift;
          projection.staff_setup_id = staffSetup;
          projection.created_by = created_by;
          await queryRunner.manager.save(projection);

          const shiftstaff = new ShiftsStaffSetups();
          shiftstaff.shift_id = shift;
          shiftstaff.staff_setup_id = staffSetup;
          shiftstaff.created_by = created_by;
          await queryRunner.manager.save(shiftstaff);
        }
      }

      if (hasVehicles)
        for (const vehicle of shiftItem.vehicles) {
          const shiftVehicle = new ShiftsVehicles();
          shiftVehicle.shift = shift;
          shiftVehicle.vehicle_id = vehicle;
          shiftVehicle.created_by = created_by;
          await queryRunner.manager.save(shiftVehicle);
        }

      if (hasSlots) {
        for (const slots of body.slots[i.toString()]) {
          for (const time of slots.items) {
            const saveSlots = new ShiftsSlots();
            saveSlots.shift_id = shift.id;
            saveSlots.procedure_type_id = slots.procedure_type_id;
            saveSlots.created_by = created_by;
            saveSlots.start_time = time.startTime;
            saveSlots.end_time = time.endTime;
            await queryRunner.manager.save(saveSlots);
          }
        }
      }

      for (const device of shiftItem.devices) {
        const shiftDevice = new ShiftsDevices();
        shiftDevice.shift = shift;
        shiftDevice.device_id = device;
        shiftDevice.created_by = created_by;
        await queryRunner.manager.save(shiftDevice);
      }
    }
  }

  async duplicateShiftById(queryRunner: QueryRunner, blueprint, id) {
    const findShifts = await this.shiftsRepository.find({
      where: {
        shiftable_id: id,
        shiftable_type: 'crm_donor_center_blueprints',
      },
      relations: ['created_by', 'tenant'],
    });
    for (const shiftItem of findShifts) {
      const shift = new Shifts();
      shift.shiftable_id = blueprint.id;
      shift.shiftable_type = 'crm_donor_center_blueprints';
      shift.start_time = shiftItem.start_time;
      shift.end_time = shiftItem.end_time;
      shift.break_start_time = shiftItem.break_start_time;
      shift.break_end_time = shiftItem.break_end_time;
      shift.created_by = blueprint.created_by;
      shift.oef_procedures = shiftItem.oef_procedures;
      shift.oef_products = shiftItem.oef_products;
      shift.reduce_slots = shiftItem.reduce_slots;
      shift.reduction_percentage = shiftItem.reduction_percentage;
      shift.tenant_id = blueprint.tenant_id;

      const newShift = await queryRunner.manager.save(shift);

      const findProjectionStaff = await this.shiftsProjectionsStaffRepo.find({
        where: {
          shift: { id: shiftItem.id },
        },
        relations: ['procedure_type', 'staff_setup'],
      });

      if (findProjectionStaff?.length == 0) {
        return resError('No ProjectionStaff found', ErrorConstants.Error, 400);
      }

      for (const projectionItem of findProjectionStaff) {
        const projection = new ShiftsProjectionsStaff();
        projection.procedure_type_id = projectionItem.procedure_type_id;
        projection.procedure_type_qty = projectionItem.procedure_type_qty;
        projection.product_yield = projectionItem.product_yield;
        projection.shift_id = newShift.id;
        projection.staff_setup_id = projectionItem.staff_setup_id;
        projection.created_by = blueprint.created_by;
        await queryRunner.manager.save(projection);
      }

      const findShiftStaffSetup = await this.shiftsStaffSetupRepo.find({
        where: {
          shift_id: shiftItem?.id as any,
        },
        relations: ['staff_setup_id'],
      });

      if (findShiftStaffSetup?.length == 0) {
        return resError('No ShiftStaffSetup found', ErrorConstants.Error, 400);
      }
      for (const staffItem of findShiftStaffSetup) {
        const shiftstaff = new ShiftsStaffSetups();
        shiftstaff.shift_id = newShift;
        shiftstaff.staff_setup_id = staffItem.staff_setup_id;
        shiftstaff.created_by = blueprint.created_by;
        await queryRunner.manager.save(shiftstaff);
      }

      const findShiftSlots = await this.shiftsSlotsRepo.find({
        where: {
          shift: { id: shiftItem.id },
        },
        relations: ['shift', 'procedure_type', 'donors', 'appointments'],
      });
      if (findShiftSlots?.length == 0) {
        for (const slots of findShiftSlots) {
          const saveSlots = new ShiftsSlots();
          saveSlots.shift_id = newShift.id;
          saveSlots.procedure_type_id = slots.procedure_type_id;
          saveSlots.created_by = blueprint.created_by;
          saveSlots.start_time = slots.start_time;
          saveSlots.appointments = slots.appointments;
          saveSlots.end_time = slots.end_time;
          await queryRunner.manager.save(saveSlots);
        }
      }

      const findShiftDevices = await this.shiftDeviceRepo.find({
        where: {
          shift_id: shiftItem?.id,
        },
        relations: ['device'],
      });

      for (const device of findShiftDevices) {
        const shiftDevice = new ShiftsDevices();
        shiftDevice.shift = newShift;
        shiftDevice.device_id = device.device_id;
        shiftDevice.created_by = blueprint.created_by;
        await queryRunner.manager.save(shiftDevice);
      }
    }
  }

  async createShiftHistory(
    shiftable_id: bigint,
    shiftable_type: shiftable_type_enum,
    history_reson: HistoryReason
  ) {
    const shifts = await this.shiftsRepository.find({
      where: {
        shiftable_id,
        shiftable_type,
      },
      relations: [
        'projections',
        'projections.created_by',
        'staff_setups',
        'staff_setups.created_by',
        'vehicles',
        'vehicles.created_by',
        'slots',
        'slots.created_by',
        'devices',
        'devices.created_by',
        'created_by',
      ],
    });

    for (const shiftItem of shifts) {
      const shiftItemHistory = new ShiftsHistory();
      Object.assign(shiftItemHistory, shiftItem);
      shiftItemHistory.history_reason = history_reson;
      shiftItemHistory.tenant_id = shiftItem.tenant_id;
      shiftItemHistory.created_by = shiftItem.created_by.id;
      await this.createHistory(shiftItemHistory);
      for (const projectionItem of shiftItem.projections) {
        const projectionItemHistory = new ShiftsProjectionsStaffHistory();
        Object.assign(projectionItemHistory, projectionItem);
        projectionItemHistory.history_reason = history_reson;
        projectionItemHistory.created_by = projectionItem.created_by.id;
        await this.entityManager.save(projectionItemHistory);
      }

      for (const staffSetup of shiftItem.staff_setups) {
        const staffSetupHistory = new ShiftsStaffSetupsHistory();
        Object.assign(staffSetupHistory, staffSetup);
        staffSetupHistory.shift_id = shiftItem.id;
        staffSetupHistory.history_reason = history_reson;
        staffSetupHistory.created_by = staffSetup.created_by.id;
        await this.entityManager.save(staffSetupHistory);
      }
      for (const vehicle of shiftItem.vehicles) {
        const shiftVehicleHistory = new ShiftsVehiclesHistory();
        Object.assign(shiftVehicleHistory, vehicle);
        shiftVehicleHistory.history_reason = history_reson;
        shiftVehicleHistory.created_by = vehicle.created_by.id;
        await this.entityManager.save(shiftVehicleHistory);
      }

      for (const slot of shiftItem.slots) {
        const slotHistory = new ShiftsSlotsHistory();
        Object.assign(slotHistory, slot);
        slotHistory.history_reason = history_reson;
        slotHistory.created_by = slot.created_by.id;
        await this.entityManager.save(slotHistory);
      }

      for (const device of shiftItem.devices) {
        const shiftDeviceHistory = new ShiftsDevicesHistory();
        Object.assign(shiftDeviceHistory, device);
        shiftDeviceHistory.history_reason = history_reson;
        shiftDeviceHistory.created_by = device.created_by.id;
        await this.entityManager.save(shiftDeviceHistory);
      }
    }
  }

  async editShift(
    queryRunner: QueryRunner,
    body: any,
    slots,
    shiftable_id: any,
    shiftable_type: shiftable_type_enum,
    history_reson: HistoryReason,
    created_by: User,
    tenant_id
  ) {
    body = body.sort((a, b) => a.id - b.id);
    const shifts = await this.shiftsRepository.find({
      where: {
        shiftable_id,
        shiftable_type,
      },
      relations: [
        'projections',
        'projections.created_by',
        'staff_setups',
        'staff_setups.created_by',
        'vehicles',
        'vehicles.created_by',
        'slots',
        'slots.created_by',
        'devices',
        'devices.created_by',
        'created_by',
      ],
      order: { id: 'ASC' },
    });
    let i = 0;
    for (const shiftItem of body) {
      const shiftsbody = await this.shiftsRepository.findOne({
        where: {
          id: shiftItem.shift_id,
        },
        relations: ['created_by'],
      });
      if (!shiftsbody) {
        const new_shift = new Shifts();
        new_shift.shiftable_id = shiftable_id;
        new_shift.shiftable_type = shiftable_type;
        new_shift.start_time = shiftItem?.start_time;
        new_shift.end_time = shiftItem?.end_time;
        if (shiftItem.break_start_time) {
          new_shift.break_start_time =
            shiftItem.break_start_time != ''
              ? new Date(shiftItem.break_start_time)
              : null;
        } else {
          new_shift.break_end_time = null;
        }
        if (shiftItem.break_end_time) {
          new_shift.break_end_time =
            shiftItem.break_end_time != ''
              ? new Date(shiftItem.break_end_time)
              : null;
        } else {
          new_shift.break_end_time = null;
        }
        new_shift.created_by = created_by;
        new_shift.oef_procedures = shiftItem?.oef_procedures;
        new_shift.oef_products = shiftItem?.oef_products;
        new_shift.reduce_slots = shiftItem?.reduce_slots;
        new_shift.reduction_percentage = shiftItem?.reduction_percentage;
        new_shift.tenant_id = tenant_id;
        await queryRunner.manager.save(new_shift);
      } else {
        const shiftHistory = new ShiftsHistory();
        Object.assign(shiftHistory, shiftsbody);
        shiftHistory.history_reason = history_reson;
        shiftHistory.created_by = shiftsbody?.created_by?.id;
        // shiftHistory.tenant_id = shiftsbody?.tenant_id;
        await queryRunner.manager.save(shiftHistory);
        // shiftsbody.id = shiftItem?.shift_id;
        shiftsbody.shiftable_id = shiftable_id;
        shiftsbody.shiftable_type = shiftable_type;
        shiftsbody.start_time = new Date(shiftItem?.start_time);
        shiftsbody.end_time = new Date(shiftItem?.end_time);
        if (shiftItem.break_start_time) {
          shiftsbody.break_start_time =
            shiftItem.break_start_time != ''
              ? new Date(shiftItem.break_start_time)
              : null;
        } else {
          shiftsbody.break_end_time = null;
        }
        if (shiftItem.break_end_time) {
          shiftsbody.break_end_time =
            shiftItem.break_end_time != ''
              ? new Date(shiftItem.break_end_time)
              : null;
        } else {
          shiftsbody.break_end_time = null;
        }
        shiftsbody.created_by = created_by;
        shiftsbody.oef_procedures = shiftItem?.oef_procedures;
        shiftsbody.oef_products = shiftItem?.oef_products;
        shiftsbody.reduce_slots = shiftItem?.reduce_slots;
        shiftsbody.reduction_percentage = shiftItem?.reduction_percentage;
        shiftsbody.tenant_id = tenant_id;
        // await queryRunner.manager.update(shiftsbody);
        queryRunner.manager.update(Shifts, { id: shiftsbody.id }, shiftsbody);
      }
      // ========================== history and edit==========================//

      let count = 0;

      for (const projectionItem of shiftItem.projections) {
        for (const staffSetup of projectionItem.staff_setups) {
          count++;
          const projection = await this.shiftsProjectionsStaffRepo.findOne({
            where: {
              id: projectionItem?.id,
              shift_id: shiftItem?.shift_id,
            },
            relations: ['created_by'],
          });
          await queryRunner.manager.delete(ShiftsProjectionsStaff, {
            id: projection.id,
          });
          const projectionHistory = new ShiftsProjectionsStaffHistory();
          Object.assign(projectionHistory, projection);
          projectionHistory.history_reason = history_reson;
          projectionHistory.created_by = projection?.created_by?.id;
          //  projectionHistory.tenant_id = shiftsbody?.tenant_id;
          await queryRunner.manager.save(projectionHistory);
          projection.procedure_type_id = projectionItem?.procedure_type_id;
          projection.procedure_type_qty = projectionItem?.procedure_type_qty;
          projection.product_yield = projectionItem?.product_yield;
          projection.shift_id = shiftItem?.shift_id;
          projection.staff_setup_id = staffSetup;
          projection.created_by = created_by;
          await queryRunner.manager.save(projection);
          const findShisftStaffSetup = await this.shiftsStaffSetupRepo.findOne({
            where: {
              shift_id: shiftItem?.id as any,
              staff_setup_id: staffSetup,
            },
            relations: ['shift_id'],
          });
          if (!findShisftStaffSetup) {
            break;
          }
          const findShisftStaffSetupHistory = new ShiftsStaffSetupsHistory();
          Object.assign(findShisftStaffSetupHistory, findShisftStaffSetup);
          findShisftStaffSetupHistory.history_reason = history_reson;
          findShisftStaffSetupHistory.created_by = shiftsbody?.created_by?.id;
          //  projectionHistory.tenant_id = shiftsbody?.tenant_id;
          await queryRunner.manager.save(projectionHistory);
          const data = await queryRunner.manager.delete(ShiftsStaffSetups, {
            shift_id: shiftItem?.id as any,
            staff_setup_id: staffSetup?.id as any,
          });
          if (data.affected > 0) {
            const shiftstaff = new ShiftsStaffSetups();
            shiftstaff.shift_id = shiftItem?.shift_id;
            shiftstaff.staff_setup_id = staffSetup;
            shiftstaff.created_by = created_by;
            await queryRunner.manager.save(shiftstaff);
          }
        }
      }
      for (const slot of shifts[i].slots) {
        const slotHistory = new ShiftsSlotsHistory();
        Object.assign(slotHistory, slot);
        slotHistory.history_reason = history_reson;
        slotHistory.created_by = slot?.created_by?.id;

        await queryRunner.manager.save(slotHistory);
        // await queryRunner.manager.delete(ShiftsSlots, { id: slot?.id });
      }

      for (const key in slots) {
        const slotArray = slots[key]; // Get the array of slots for the current key
        for (const slotObject of slotArray) {
          // Now, 'slotObject' represents each individual object within the slotArray
          // Perform your operations on 'slotObject' here
          // For example, you can uncomment and modify your existing code accordingly
          for (const item of slotObject.items) {
            const editSlot = new ShiftsSlots();
            editSlot.id = item?.id;
            editSlot.shift_id = shiftItem?.shift_id;
            editSlot.start_time = new Date(item?.startTime);
            editSlot.end_time = new Date(item?.endTime);
            editSlot.procedure_type_id = slotObject?.procedure_type_id;
            editSlot.created_by = created_by;
            await this.entityManager.save(editSlot);
          }
        }
      }
      console.log('---------------', shifts[i]?.devices);
      for (const delDevices of shifts[i]?.devices) {
        await this.shiftDeviceRepo.delete({
          shift_id: delDevices?.shift_id,
        });
      }
      if (shiftItem?.devices) {
        for (const insertdevices of shiftItem?.devices) {
          const shiftDevices = new ShiftsDevices();
          shiftDevices.shift_id = shiftItem?.shift_id;
          shiftDevices.device_id = insertdevices;
          shiftDevices.created_by = created_by;
          await queryRunner.manager.save(shiftDevices);
        }
      }
      i++;
    }
  }

  async GetLinkDataOnShift(shift_id) {
    try {
      const getShift = await this.shiftsRepository.findOne({
        where: {
          id: shift_id,
        },
      });
      const getshiftStaffSetup = await this.shiftsStaffSetupRepo.findOne({
        where: {
          shift_id: { id: shift_id },
        },
      });
      const getShiftProjectionStaff =
        await this.shiftsProjectionsStaffRepo.findOne({
          where: { shift_id: shift_id },
          relations: ['procedure_type'],
        });
      const getprocedureTypeProducts =
        await this.procedureTypesProductsRepo.findOne({
          where: {
            procedure_type_id: getShiftProjectionStaff.procedure_type.id,
          },
        });
      const products = await this.productsRepo.findOne({
        where: { id: getprocedureTypeProducts.product_id },
      });
      const getStaffSetup: any = await this.staffSetupRepo.find({
        where: {
          id: getshiftStaffSetup?.staff_setup_id,
        },
      });
      const getshiftvehicles = await this.shiftsVehiclesRepo.find({
        where: {
          shift_id: shift_id,
        },
      });
      const get_vehicles = [];
      for (const veh of getshiftvehicles) {
        get_vehicles.push(
          await this.vehicleRepo.findOne({
            where: { id: veh.vehicle_id },
          })
        );
      }
      const data = {
        shift: getShift,
        projection: getShiftProjectionStaff,
        products: products,
        staff: getStaffSetup,
        vehicles: get_vehicles,
      };
      return resSuccess('Vehicles Found.', 'success', HttpStatus.CREATED, data);
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
