import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { Drives } from 'src/api/operations-center/operations/drives/entities/drives.entity';

dotenv.config();

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Drives)
    private readonly drivesRepository: Repository<Drives>,
    private readonly entityManager: EntityManager
  ) {}

  async find(id: any) {
    try {
      if (!id) {
        return resError(
          'Accounts blue print id is required',
          ErrorConstants.Error,
          400
        );
      }
      const bluePrintData = await this.drivesRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!bluePrintData) {
        throw new HttpException(
          `Blue print detail not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      const queryCount = await this.drivesRepository
        .createQueryBuilder('drives')
        .select(
          `(JSON_BUILD_OBJECT(
                        
                        'id',drives.id
                    )
                    )`,
          'drives'
        )

        .addSelect(
          `(
                      SELECT JSON_AGG(JSON_BUILD_OBJECT(
                          'start_time', shifts.start_time,
                          'end_time', shifts.end_time,
                          'oef_products', shifts.oef_products,
                          'oef_procedures', shifts.oef_procedures,
                          'reduce_slots', shifts.reduce_slots,
                          'reduction_percentage', shifts.reduction_percentage,
                          'break_start_time', shifts.break_start_time,
                          'break_end_time', shifts.break_end_time,
                          'vehicle', (
                              SELECT JSON_AGG(JSON_BUILD_OBJECT(
                                  'id', vehicle.id,
                                  'name', vehicle.name
                              ))
                              FROM shifts_vehicles
                              JOIN vehicle ON shifts_vehicles.vehicle_id = vehicle.id
                              WHERE shifts_vehicles.shift_id = shifts.id
                          ),
                          'device', (
                              SELECT JSON_AGG(JSON_BUILD_OBJECT(
                                  'id', device.id,
                                  'name', device.name
                              ))
                              FROM shifts_devices
                              JOIN device ON shifts_devices.device_id = device.id
                              WHERE shifts_devices.shift_id = shifts.id
                          ),
                          'staff_setup', (
                              SELECT JSON_AGG(JSON_BUILD_OBJECT(
                                  'id', staff_setup.id,
                                  'name', staff_setup.name
                              ))
                              FROM shifts_staff_setups
                              JOIN staff_setup ON shifts_staff_setups.staff_setup_id = staff_setup.id
                              WHERE shifts_staff_setups.shift_id = shifts.id
                          ),
                          'products', (SELECT JSON_AGG(JSON_BUILD_OBJECT(
                            'id', products.id,
                              'name', products.name 
                          ) ) FROM products
                                  JOIN procedure_types_products ON products.id = procedure_types_products.product_id
                                  JOIN shifts_projections_staff ON procedure_types_products.procedure_type_id = shifts_projections_staff.procedure_type_id
                                  JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
                                  WHERE shifts.shiftable_id = ${id} AND
                                  shifts.shiftable_type = 'drives'
                        ),
                          'shifts_projections_staff', (SELECT JSON_AGG( JSON_BUILD_OBJECT(
                            'id', shifts_projections_staff.id,
                            'procedure_type_qty',  shifts_projections_staff.procedure_type_qty,
                            'product_qty', shifts_projections_staff.product_yield
        
                            )
                        )
                        FROM shifts_projections_staff, shifts
                          WHERE shifts.id = shifts_projections_staff.shift_id 
                          AND shifts.shiftable_id = ${id} AND
                          shifts.shiftable_type = 'drives'
        
                          )
                      ))
                      FROM shifts
                      WHERE shifts.shiftable_id = drives.id
                      AND shifts.shiftable_type = 'drives'
                  )`,
          'shifts'
        )
        .where(`drives.is_archived = false AND drives.id = ${id}`)
        .getQuery();

      const SampleCount = await this.drivesRepository.query(queryCount);
      return resSuccess(
        'Shift details fetched successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { ...SampleCount }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
