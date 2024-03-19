import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, In } from 'typeorm';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { DonorCenterBluePrints } from '../entity/donor_center_blueprint';
import {
  AddShiftSlotDTO,
  CreateBluePrintDTO,
  UpdateShiftsProjectionStaff,
} from '../dto/create-blueprint.dto';
import { ShiftsService } from 'src/api/shifts/services/shifts.service';
import { shiftable_type_enum } from 'src/api/shifts/enum/shifts.enum';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { Facility } from '../../entity/facility.entity';
import { ShiftsSlots } from 'src/api/shifts/entities/shifts-slots.entity';
import { ShiftsSlotsHistory } from 'src/api/shifts/entities/shifts-slots-history.entity';
import { ShiftsProjectionsStaff } from 'src/api/shifts/entities/shifts-projections-staff.entity';
import { HistoryService } from 'src/api/common/services/history.service';
import { DonorCenterBluePrintsHistory } from '../entity/donor_center_blueprint_history';
import { HistoryReason } from 'src/common/enums/history_reason.enum';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { ShiftSlotsDto } from 'src/api/shifts/dto/shifts.dto';

dotenv.config();
@Injectable({ scope: Scope.REQUEST })
export class DonorCenterBlueprintService extends HistoryService<DonorCenterBluePrintsHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(Shifts)
    private readonly shiftsRepo: Repository<Shifts>,
    private readonly entityManager: EntityManager,
    @InjectRepository(DonorCenterBluePrints)
    private readonly donorCenterBluePrintsRepo: Repository<DonorCenterBluePrints>,
    @InjectRepository(DonorCenterBluePrintsHistory)
    private readonly donorCenterBluePrintsHistoryRepo: Repository<DonorCenterBluePrintsHistory>,
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
    @InjectRepository(ShiftsSlots)
    private readonly shiftsSlotRepo: Repository<ShiftsSlots>,
    @InjectRepository(ShiftsSlotsHistory)
    private readonly shiftsSlotsHistory: Repository<ShiftsSlotsHistory>,
    @InjectRepository(ShiftsProjectionsStaff)
    private readonly shiftsprojectionStaffRepo: Repository<ShiftsProjectionsStaff>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly shiftsService: ShiftsService
  ) {
    super(donorCenterBluePrintsHistoryRepo);
  }

  async createBluePrint(body: CreateBluePrintDTO) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      let oef_procedures: any;
      body.shifts?.map((item, index) => {
        oef_procedures = item?.oef_procedures;
      });
      let oef_products: any;
      body.shifts?.map((item, index) => {
        oef_products = item?.oef_products;
      });
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const bluePrint = new DonorCenterBluePrints();
      bluePrint.donorcenter_id = body.donorcenter_id;
      bluePrint.name = body.name;
      bluePrint.is_default = body.is_default;
      bluePrint.oef_procedures = oef_procedures;
      bluePrint.oef_products = oef_products;
      bluePrint.monday = body.weekdays.monday;
      bluePrint.tuesday = body.weekdays.tuesday;
      bluePrint.wednesday = body.weekdays.wednesday;
      bluePrint.thursday = body.weekdays.thursday;
      bluePrint.friday = body.weekdays.friday;
      bluePrint.saturday = body.weekdays.saturday;
      bluePrint.sunday = body.weekdays.sunday;
      bluePrint.is_active = true;
      bluePrint.created_by = body.created_by;
      bluePrint.tenant_id = body.tenant_id;

      const blueprint = await queryRunner.manager.save(bluePrint);
      const hasSlots: boolean = body.slots?.length >= 1 ? true : false;
      await this.shiftsService.createShiftByShiftAble(
        body,
        queryRunner,
        body.shifts,
        bluePrint,
        body.created_by,
        body.tenant_id,
        shiftable_type_enum.CRM_DONOR_CENTER_BLUEPRINTS,
        false,
        hasSlots
      );

      await queryRunner.commitTransaction();
      return resSuccess(
        'Blueprint Created.',
        'success',
        HttpStatus.CREATED,
        blueprint
      );
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async Duplicate(blueprintId: bigint, created_by, tenant_id) {
    console.log({ blueprintId });
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const findBlueprint = await this.donorCenterBluePrintsRepo.findOne({
        where: { id: blueprintId },
        relations: ['created_by', 'tenant', 'donorcenter'],
      });
      const newObject = new DonorCenterBluePrints();
      newObject.donorcenter = findBlueprint.donorcenter;
      newObject.name = findBlueprint.name;
      newObject.is_default = false;
      newObject.oef_procedures = findBlueprint.oef_procedures;
      newObject.oef_products = findBlueprint.oef_products;
      newObject.monday = findBlueprint.monday;
      newObject.tuesday = findBlueprint.tuesday;
      newObject.wednesday = findBlueprint.wednesday;
      newObject.thursday = findBlueprint.thursday;
      newObject.friday = findBlueprint.friday;
      newObject.saturday = findBlueprint.saturday;
      newObject.sunday = findBlueprint.sunday;
      newObject.is_active = true;
      newObject.created_by = created_by;
      newObject.tenant_id = tenant_id;
      await queryRunner.manager.save(newObject);

      const data = await this.shiftsService.duplicateShiftById(
        queryRunner,
        newObject,
        blueprintId
      );
      console.log({ data });
      if (data?.status_code && data?.status_code == 400) {
        return resError(data.response, ErrorConstants.Error, 400);
      }
      await queryRunner.commitTransaction();
      return resSuccess(
        'Blueprint Created.',
        'success',
        HttpStatus.CREATED,
        newObject
      );
    } catch (error) {
      console.log({ error });
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
  async getBluePrintDetails(user: any, id: any) {
    try {
      const bluePrintData = await this.donorCenterBluePrintsRepo.findOne({
        where: {
          id: id,
        },
        relations: ['created_by'],
      });

      if (!bluePrintData) {
        throw new HttpException(
          `Blue print detail not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      const data = await this.donorCenterBluePrintsRepo
        .createQueryBuilder('donor_center_blueprints')
        .select([
          'donor_center_blueprints.id AS id',
          'donor_center_blueprints.created_at AS created_at',
          'donor_center_blueprints.name AS name',
          'donor_center_blueprints.oef_products AS oef_products',
          'donor_center_blueprints.oef_procedures AS oef_procedures',
          'donor_center_blueprints.is_default AS is_default',
          'donor_center_blueprints.is_active AS is_active',
          'donor_center_blueprints.monday AS monday',
          'donor_center_blueprints.tuesday AS tuesday',
          'donor_center_blueprints.wednesday AS wednesday',
          'donor_center_blueprints.thursday AS thursday',
          'donor_center_blueprints.friday AS friday',
          'donor_center_blueprints.saturday AS saturday',
          'donor_center_blueprints.sunday AS sunday',
          'donor_center_blueprints.donorcenter_id AS donorcenter_id',
          'donor_center_blueprints.tenant_id AS tenant_id',
        ])
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT('first_name', "user"."first_name" ,'last_name', "user"."last_name") FROM "user" WHERE "donor_center_blueprints"."created_by" = "user"."id"
    )`,
          'created_by'
        )
        .addSelect(
          `(
      SELECT JSON_BUILD_OBJECT(
        'min_start_time', MIN(shifts.start_time),
        'max_end_time', MAX(shifts.end_time)
      )
      FROM shifts
      WHERE shifts.shiftable_id = donor_center_blueprints.id
      AND shifts.shiftable_type = '${shiftable_type_enum.CRM_DONOR_CENTER_BLUEPRINTS}'
    )`,
          'shifts_data'
        )
        .where(
          `donor_center_blueprints.is_archived = false AND donor_center_blueprints.id = ${id}`
        )
        .getRawOne();

      // const data = await this.donorCenterBluePrintsRepo.query(aa);

      const modifiedData = await getModifiedDataDetails(
        this.donorCenterBluePrintsHistoryRepo,
        id,
        this.userRepository
      );

      return resSuccess(
        'Blue print detail found successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { ...data, ...modifiedData }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getBluePrintShiftDetails(user: any, id: any) {
    try {
      if (!id) {
        return resError(
          'Donor center blue print id is required',
          ErrorConstants.Error,
          400
        );
      }
      const bluePrintData = await this.donorCenterBluePrintsRepo.findOne({
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
      const queryCount = await this.donorCenterBluePrintsRepo
        .createQueryBuilder('donor_center_blueprints')
        .select(
          `(JSON_BUILD_OBJECT(
                
                'id',donor_center_blueprints.id,
                'oef_products', donor_center_blueprints.oef_products
            )
            )`,
          'donor_center_blueprints'
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
                          shifts.shiftable_type = 'crm_donor_center_blueprints'
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
                  shifts.shiftable_type = 'crm_donor_center_blueprints'

                  )
              ))
              FROM shifts
              WHERE shifts.shiftable_id = donor_center_blueprints.id
              AND shifts.shiftable_type = 'crm_donor_center_blueprints'
          )`,
          'shifts'
        )
        .where(
          `donor_center_blueprints.is_archived = false AND donor_center_blueprints.id = ${id}`
        )
        .getQuery();

      const Samplecount = await this.donorCenterBluePrintsRepo.query(
        queryCount
      );

      return resSuccess(
        'Donor center blue prints shift details found.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        Samplecount
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findOneDonorCenterBlueprint(user: any, id: any) {
    try {
      console.log({ id });

      const queryCount = await this.donorCenterBluePrintsRepo
        .createQueryBuilder('donor_center_blueprints')
        .select(
          `(  SELECT JSON_BUILD_OBJECT(
                'name', donor_center_blueprint.name,
                'monday', donor_center_blueprint.monday,
                'tuesday', donor_center_blueprint.tuesday,
                'wednesday', donor_center_blueprint.wednesday,
                'thursday', donor_center_blueprint.thursday,
                'friday', donor_center_blueprint.friday,
                'saturday', donor_center_blueprint.saturday,
                'sunday', donor_center_blueprint.sunday
              )
            FROM donor_center_blueprints donor_center_blueprint WHERE donor_center_blueprint.id = ${id}
            )`,
          'donor_center_blueprint'
        )
        .addSelect(
          `(
                SELECT JSON_AGG( JSON_BUILD_OBJECT(
                    'id',shifts.id,
                    'start_time',shifts.start_time,
                    'end_time',shifts.end_time,
                    'oef_products',shifts.oef_products,
                    'oef_procedures',shifts.oef_procedures,
                    'break_start_time', shifts.break_start_time,
                    'break_end_time', shifts.break_end_time,
                    'reduce_slots', shifts.reduce_slots,
                    'reduction_percentage', shifts.reduction_percentage,
                    'shifts_projections_staff', (
                      SELECT JSON_AGG(
                          JSON_BUILD_OBJECT(
                            'id', shifts_projections_staff.id,
                            'procedure_id', shifts_projections_staff.procedure_type_id,
                            'procedure_type_qty', shifts_projections_staff.procedure_type_qty,
                            'product_yield', shifts_projections_staff.product_yield,
                            'procedure_type', (
                              SELECT JSON_BUILD_OBJECT(
                                  'id', pt.id,
                                  'name', pt.name,
                                  'short_description', pt.short_description,
                                  'procedure_duration', pt.procedure_duration,
                                  'procedure_type_products', (
                                    SELECT JSON_AGG(
                                        JSON_BUILD_OBJECT(
                                            'product_id', ptp.product_id,
                                            'quantity', ptp.quantity,
                                            'name', p.name
                                        )
                                    )
                                    FROM procedure_types_products ptp
                                    JOIN products p ON p.id = ptp.product_id
                                    WHERE ptp.procedure_type_id = pt.id
                                )
                              )
                              FROM procedure_types pt
                              WHERE pt.id = shifts_projections_staff.procedure_type_id
                            ),
                            'staff_setup', (
                              SELECT JSON_AGG(
                                JSON_BUILD_OBJECT(
                                  'id', staff_setup.id,
                                  'name', staff_setup.name,
                                  'short_name', staff_setup.short_name,
                                  'beds', staff_setup.beds,
                                  'concurrent_beds', staff_setup.concurrent_beds,
                                  'stagger_slots', staff_setup.stagger_slots,
                                  'shift_id',  shifts_projections_staff.shift_id,
                                  'qty', COALESCE(sub.qty, 0)
                                )
                              ) AS staff_setup
                              FROM shifts_projections_staff sps
                              LEFT JOIN staff_setup ON sps.staff_setup_id = staff_setup.id
                              LEFT JOIN (
                                SELECT 
                                  staff_setup_id,
                                  COALESCE(SUM(DISTINCT ((cr.oef_contribution * sc.qty) / 100)), 0) AS qty
                                FROM staff_config sc
                                LEFT JOIN contacts_roles cr ON sc.contact_role_id = cr.id
                                GROUP BY staff_setup_id
                              ) sub ON sub.staff_setup_id = staff_setup.id
                              WHERE staff_setup.id = shifts_projections_staff.staff_setup_id
                              AND sps.id = shifts_projections_staff.id
                              GROUP BY staff_setup.id
                              )
                            )
                      )
                      FROM shifts_projections_staff
                      WHERE shifts_projections_staff.shift_id = shifts.id
                  ),
                  'shifts_devices', (
                    SELECT JSON_AGG( JSON_BUILD_OBJECT(
                        'name',device.name,
                        'id', device.id
                    )) FROM device,shifts_devices,shifts WHERE shifts_devices.shift_id = shifts.id AND shifts_devices.device_id = device.id
                    AND shifts.shiftable_id = ${id} AND shifts.shiftable_type = 'crm_donor_center_blueprints'
    
                )
                )) FROM shifts WHERE shifts.shiftable_id = ${id} AND shifts.shiftable_type = 'crm_donor_center_blueprints'
            )`,
          'shifts'
        )
        .where(
          `donor_center_blueprints.is_archived = false AND donor_center_blueprints.id = ${id}`
        )
        .getQuery();

      const getData = await this.donorCenterBluePrintsRepo.query(queryCount);

      return resSuccess(
        'records found.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        {
          data: getData,
        }
      );
    } catch (err) {
      console.log({ err });
    }
  }

  async findAllWithDonorSessionsFilters(user: any, facility_id, queryParams) {
    try {
      if (!user && !facility_id) {
        return resError(
          'user and account_id is required',
          ErrorConstants.Error,
          400
        );
      }
      const getData = await this.facilityRepository.findOne({
        where: {
          id: facility_id,
        },
        // relations: ['account'],
      });
      if (!getData) {
        return resError(
          'no account exist against this id',
          ErrorConstants.Error,
          400
        );
      }
      let sortOrder = queryParams?.sortOrder;
      let sortName = queryParams?.sortName;
      if (sortName) {
        if (sortName == 'blueprint_name') {
          sortName = `donor_center_blueprints.name`;
          sortOrder = sortOrder?.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'hours') {
          sortName = `(SELECT start_time FROM shifts WHERE shifts.shiftable_id = donor_center_blueprints.id  AND shifts.shiftable_type = 'crm_donor_center_blueprints' LIMIT 1)`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'procedures') {
          sortName = `(SELECT oef_procedures FROM shifts WHERE shifts.shiftable_id = donor_center_blueprints.id  AND shifts.shiftable_type = 'crm_donor_center_blueprints' LIMIT 1)`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'products') {
          sortName = `(SELECT oef_products FROM shifts WHERE shifts.shiftable_id = donor_center_blueprints.id  AND shifts.shiftable_type = 'crm_donor_center_blueprints' LIMIT 1)`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'staff_setup') {
          sortName = `(SELECT staff_config.qty  FROM staff_config
          INNER JOIN public.staff_setup ON staff_config.staff_setup_id = staff_setup.id
          INNER JOIN public.shifts_staff_setups ON shifts_staff_setups.staff_setup_id = staff_setup.id
          JOIN public.shifts ON shifts.id = shifts_staff_setups.shift_id
          WHERE shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
          AND donor_center_blueprints.donorcenter_id = ${getData.id} LIMIT 1)`;
          sortOrder = sortOrder?.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'status') {
          sortName = 'donor_center_blueprints.is_active';
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
      } else {
        sortName = `donor_center_blueprints.id`;
        sortOrder = 'DESC';
      }
      // console.log({ sortName }, { sortingOrder });
      const query = await this.donorCenterBluePrintsRepo
        .createQueryBuilder('donor_center_blueprints')
        .select(
          `(JSON_BUILD_OBJECT(
                'name', donor_center_blueprints.name,
                'is_active',donor_center_blueprints.is_active,
                'id',donor_center_blueprints.id,
                'is_default',donor_center_blueprints.is_default
            )
            )`,
          'donor_center_blueprints'
        )
        .addSelect(
          `(
            SELECT JSON_AGG(JSON_BUILD_OBJECT(
              'start_time', shifts.start_time,
              'end_time', shifts.end_time,
              'oef_products', shifts.oef_products,
              'oef_procedures', shifts.oef_procedures,
              'id', shifts.id,
              'qty', (
                SELECT JSON_AGG(JSON_BUILD_OBJECT(
                  'product_yield', shifts_projections_staff.product_yield,
                  'procedure_type_qty', shifts_projections_staff.procedure_type_qty
                ))
                FROM shifts_projections_staff
                WHERE shifts_projections_staff.shift_id = shifts.id
                AND  shifts.shiftable_id = donor_center_blueprints.id
                AND shifts.shiftable_type = 'crm_donor_center_blueprints'
                AND donor_center_blueprints.donorcenter_id = ${getData.id}
              )
            ))
            FROM shifts
            WHERE shifts.shiftable_id = donor_center_blueprints.id
              AND shifts.shiftable_type = 'crm_donor_center_blueprints'
          )`,
          'shifts'
        )
        // .addSelect(
        //   `(
        //         SELECT JSON_AGG( JSON_BUILD_OBJECT(
        //             'start_time',shifts.start_time,
        //             'end_time',shifts.end_time,
        //             'oef_products',shifts.oef_products,
        //             'oef_procedures',shifts.oef_procedures,
        //             'id',shifts.id,
        //             'qty',(SELECT JSON_AGG( JSON_BUILD_OBJECT('product_yield',shifts_projections_staff.product_yield,'procedure_type_qty',shifts_projections_staff.procedure_type_qty))
        //             FROM shifts_projections_staff , shifts , drives, crm_locations
        //             where shifts_projections_staff.shift_id = shifts.id AND shifts.shiftable_id = drives.id AND crm_locations.id = drives.location_id
        //             AND drives.is_blueprint = true
        //             AND shifts.shiftable_type = 'drives',

        //         )) FROM shifts WHERE shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
        //     )`,
        //   'shifts'
        // )
        .addSelect(
          `(SELECT JSON_AGG(JSON_BUILD_OBJECT('qty', staff_config.qty))
    FROM staff_config
    INNER JOIN public.staff_setup ON staff_config.staff_setup_id = staff_setup.id
    INNER JOIN public.shifts_staff_setups ON shifts_staff_setups.staff_setup_id = staff_setup.id
    JOIN public.shifts ON shifts.id = shifts_staff_setups.shift_id
    WHERE shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
    AND donor_center_blueprints.donorcenter_id = ${getData.id}
  )`,
          'staff_config'
        )

        .leftJoin('donor_center_blueprints.donorcenter', 'facility')
        .where(
          `donor_center_blueprints.is_archived = false AND donor_center_blueprints.donorcenter = ${getData?.id}
          AND donor_center_blueprints.is_default = false`
        )
        .andWhere(
          queryParams?.keyword !== undefined
            ? `donor_center_blueprints.name ILIKE  '%${queryParams.keyword}%'`
            : '1=1'
        )

        .andWhere(
          queryParams?.status
            ? `donor_center_blueprints.is_active = ${queryParams?.status}`
            : '1=1'
        )
        .orderBy(sortName, sortOrder)
        .limit(queryParams?.limit)
        .offset((queryParams?.page - 1) * queryParams?.limit)
        .getQuery();

      const sample = await this.donorCenterBluePrintsRepo.query(query);

      const queryCount = await this.donorCenterBluePrintsRepo
        .createQueryBuilder('donor_center_blueprints')
        .select(
          `(JSON_BUILD_OBJECT(
                'name', donor_center_blueprints.name,
                'is_active',donor_center_blueprints.is_active,
                'id',donor_center_blueprints.id
            )
            )`,
          'donor_center_blueprints'
        )
        .addSelect(
          `(
                SELECT JSON_AGG( JSON_BUILD_OBJECT(
                    'start_time',shifts.start_time,
                    'end_time',shifts.end_time,
                    'oef_products',shifts.oef_products,
                    'oef_procedures',shifts.oef_procedures
                )) FROM shifts WHERE shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
            )`,
          'shifts'
        )
        .addSelect(
          `(SELECT JSON_AGG(JSON_BUILD_OBJECT('qty', staff_config.qty))
          FROM staff_config
          INNER JOIN public.staff_setup ON staff_config.staff_setup_id = staff_setup.id
          INNER JOIN public.shifts_staff_setups ON shifts_staff_setups.staff_setup_id = staff_setup.id
          JOIN public.shifts ON shifts.id = shifts_staff_setups.shift_id
          WHERE shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
          AND donor_center_blueprints.donorcenter_id = ${getData.id}
        )`,
          'staff_config'
        )

        .leftJoin('donor_center_blueprints.donorcenter', 'facility')
        .where(
          `donor_center_blueprints.is_archived = false AND donor_center_blueprints.donorcenter = ${getData?.id}`
        )
        .andWhere(
          queryParams?.keyword !== undefined
            ? `donor_center_blueprints.name ILIKE  '%${queryParams.keyword}%'`
            : '1=1'
        )

        .andWhere(
          queryParams?.status
            ? `donor_center_blueprints.is_active = ${queryParams?.status}`
            : '1=1'
        )
        .orderBy(sortName, sortOrder)
        // .limit(queryParams?.limit)
        // .offset((queryParams?.page - 1) * queryParams?.limit)
        .getQuery();

      const Samplecount = await this.donorCenterBluePrintsRepo.query(
        queryCount
      );
      const count = Samplecount?.length;

      if (!getData) {
        return resError('facilty id not found', ErrorConstants.Error, 400);
      }
      return resSuccess(
        'records found.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        {
          data: sample,
          count: count,
        }
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findDefaultWithDonorSessionsFilters(
    user: any,
    facility_id,
    queryParams
  ) {
    try {
      if (!user && !facility_id) {
        return resError(
          'user and account_id is required',
          ErrorConstants.Error,
          400
        );
      }
      const getData = await this.facilityRepository.findOne({
        where: {
          id: facility_id,
        },
        // relations: ['account'],
      });
      if (!getData) {
        return resError(
          'no account exist against this id',
          ErrorConstants.Error,
          400
        );
      }
      let sortOrder = queryParams?.sortOrder;
      let sortName = queryParams?.sortName;
      if (sortName) {
        if (sortName == 'blueprint_name') {
          sortName = `donor_center_blueprints.name`;
          sortOrder = sortOrder?.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'hours') {
          sortName = `(SELECT start_time FROM shifts WHERE shifts.shiftable_id = donor_center_blueprints.id  AND shifts.shiftable_type = 'crm_donor_center_blueprints' LIMIT 1)`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'procedures') {
          sortName = `(SELECT oef_procedures FROM shifts WHERE shifts.shiftable_id = donor_center_blueprints.id  AND shifts.shiftable_type = 'crm_donor_center_blueprints' LIMIT 1)`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'products') {
          sortName = `(SELECT oef_products FROM shifts WHERE shifts.shiftable_id = donor_center_blueprints.id  AND shifts.shiftable_type = 'crm_donor_center_blueprints' LIMIT 1)`;
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'staff_setup') {
          sortName = `(SELECT staff_config.qty  FROM staff_config
          INNER JOIN public.staff_setup ON staff_config.staff_setup_id = staff_setup.id
          INNER JOIN public.shifts_staff_setups ON shifts_staff_setups.staff_setup_id = staff_setup.id
          JOIN public.shifts ON shifts.id = shifts_staff_setups.shift_id
          WHERE shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
          AND donor_center_blueprints.donorcenter_id = ${getData.id} LIMIT 1)`;
          sortOrder = sortOrder?.toUpperCase() as 'ASC' | 'DESC';
        }
        if (sortName == 'status') {
          sortName = 'donor_center_blueprints.is_active';
          sortOrder.toUpperCase() as 'ASC' | 'DESC';
        }
      } else {
        sortName = `donor_center_blueprints.id`;
        sortOrder = 'DESC';
      }
      // console.log({ sortName }, { sortingOrder });
      const query = await this.donorCenterBluePrintsRepo
        .createQueryBuilder('donor_center_blueprints')
        .select(
          `(JSON_BUILD_OBJECT(
                'name', donor_center_blueprints.name,
                'is_active',donor_center_blueprints.is_active,
                'id',donor_center_blueprints.id,
                'is_default',donor_center_blueprints.is_default
            )
            )`,
          'donor_center_blueprints'
        )
        .addSelect(
          `(
            SELECT JSON_AGG(JSON_BUILD_OBJECT(
              'start_time', shifts.start_time,
              'end_time', shifts.end_time,
              'oef_products', shifts.oef_products,
              'oef_procedures', shifts.oef_procedures,
              'id', shifts.id,
              'qty', (
                SELECT JSON_AGG(JSON_BUILD_OBJECT(
                  'product_yield', shifts_projections_staff.product_yield,
                  'procedure_type_qty', shifts_projections_staff.procedure_type_qty
                ))
                FROM shifts_projections_staff
                WHERE shifts_projections_staff.shift_id = shifts.id
                AND  shifts.shiftable_id = donor_center_blueprints.id
                AND shifts.shiftable_type = 'crm_donor_center_blueprints'
                AND donor_center_blueprints.donorcenter_id = ${getData.id}
              )
            ))
            FROM shifts
            WHERE shifts.shiftable_id = donor_center_blueprints.id
              AND shifts.shiftable_type = 'crm_donor_center_blueprints'
          )`,
          'shifts'
        )
        // .addSelect(
        //   `(
        //         SELECT JSON_AGG( JSON_BUILD_OBJECT(
        //             'start_time',shifts.start_time,
        //             'end_time',shifts.end_time,
        //             'oef_products',shifts.oef_products,
        //             'oef_procedures',shifts.oef_procedures,
        //             'id',shifts.id,
        //             'qty',(SELECT JSON_AGG( JSON_BUILD_OBJECT('product_yield',shifts_projections_staff.product_yield,'procedure_type_qty',shifts_projections_staff.procedure_type_qty))
        //             FROM shifts_projections_staff , shifts , drives, crm_locations
        //             where shifts_projections_staff.shift_id = shifts.id AND shifts.shiftable_id = drives.id AND crm_locations.id = drives.location_id
        //             AND drives.is_blueprint = true
        //             AND shifts.shiftable_type = 'drives',

        //         )) FROM shifts WHERE shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
        //     )`,
        //   'shifts'
        // )
        .addSelect(
          `(SELECT JSON_AGG(JSON_BUILD_OBJECT('qty', staff_config.qty))
    FROM staff_config
    INNER JOIN public.staff_setup ON staff_config.staff_setup_id = staff_setup.id
    INNER JOIN public.shifts_staff_setups ON shifts_staff_setups.staff_setup_id = staff_setup.id
    JOIN public.shifts ON shifts.id = shifts_staff_setups.shift_id
    WHERE shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
    AND donor_center_blueprints.donorcenter_id = ${getData.id}
  )`,
          'staff_config'
        )

        .leftJoin('donor_center_blueprints.donorcenter', 'facility')
        .where(
          `donor_center_blueprints.is_archived = false AND donor_center_blueprints.donorcenter = ${getData?.id} AND 
          donor_center_blueprints.is_default = true`
        )
        // .andWhere(
        //   queryParams?.keyword !== undefined
        //     ? `donor_center_blueprints.name ILIKE  '%${queryParams.keyword}%'`
        //     : '1=1'
        // )

        // .andWhere(
        //   queryParams?.status
        //     ? `donor_center_blueprints.is_active = ${queryParams?.status}`
        //     : '1=1'
        // )
        // .orderBy(sortName, sortOrder)
        // .limit(queryParams?.limit)
        // .offset((queryParams?.page - 1) * queryParams?.limit)
        .getQuery();

      const sample = await this.donorCenterBluePrintsRepo.query(query);

      const queryCount = await this.donorCenterBluePrintsRepo
        .createQueryBuilder('donor_center_blueprints')
        .select(
          `(JSON_BUILD_OBJECT(
                'name', donor_center_blueprints.name,
                'is_active',donor_center_blueprints.is_active,
                'id',donor_center_blueprints.id
            )
            )`,
          'donor_center_blueprints'
        )
        .addSelect(
          `(
                SELECT JSON_AGG( JSON_BUILD_OBJECT(
                    'start_time',shifts.start_time,
                    'end_time',shifts.end_time,
                    'oef_products',shifts.oef_products,
                    'oef_procedures',shifts.oef_procedures
                )) FROM shifts WHERE shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
            )`,
          'shifts'
        )
        .addSelect(
          `(SELECT JSON_AGG(JSON_BUILD_OBJECT('qty', staff_config.qty))
          FROM staff_config
          INNER JOIN public.staff_setup ON staff_config.staff_setup_id = staff_setup.id
          INNER JOIN public.shifts_staff_setups ON shifts_staff_setups.staff_setup_id = staff_setup.id
          JOIN public.shifts ON shifts.id = shifts_staff_setups.shift_id
          WHERE shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = 'crm_donor_center_blueprints'
          AND donor_center_blueprints.donorcenter_id = ${getData.id}
        )`,
          'staff_config'
        )

        .leftJoin('donor_center_blueprints.donorcenter', 'facility')
        .where(
          `donor_center_blueprints.is_archived = false AND donor_center_blueprints.donorcenter = ${getData?.id}`
        )
        .andWhere(
          queryParams?.keyword !== undefined
            ? `donor_center_blueprints.name ILIKE  '%${queryParams.keyword}%'`
            : '1=1'
        )

        .andWhere(
          queryParams?.status
            ? `donor_center_blueprints.is_active = ${queryParams?.status}`
            : '1=1'
        )
        .orderBy(sortName, sortOrder)
        // .limit(queryParams?.limit)
        // .offset((queryParams?.page - 1) * queryParams?.limit)
        .getQuery();

      const Samplecount = await this.donorCenterBluePrintsRepo.query(
        queryCount
      );
      const count = Samplecount?.length;

      if (!getData) {
        return resError('facilty id not found', ErrorConstants.Error, 400);
      }
      return resSuccess(
        'records found.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        {
          data: sample,
          count: count,
        }
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getBluePrintDonorSchdules(user: any, id: any) {
    try {
      const findShifts = await this.shiftsRepo.find({
        where: {
          shiftable_id: id,
          shiftable_type: 'crm_donor_center_blueprints',
        },
      });

      if (!findShifts || findShifts.length === 0) {
        throw new HttpException(`Shifts not found.`, HttpStatus.NOT_FOUND);
      }

      const shiftsDrawHours = await this.shiftsRepo
        .createQueryBuilder('shift')
        .select([
          'MIN(shift.start_time) AS start_time',
          'MAX(shift.end_time) AS end_time',
        ])
        .where({
          shiftable_id: id,
          shiftable_type: shiftable_type_enum.CRM_DONOR_CENTER_BLUEPRINTS,
          is_archived: false,
        })
        .groupBy('shift.shiftable_id')
        .getRawOne();

      const shiftsWithSlots = await Promise.all(
        findShifts.map(async (shift) => {
          const shiftSlots = await this.shiftsSlotRepo
            .createQueryBuilder('shiftSlot')
            .leftJoinAndSelect('shiftSlot.procedure_type', 'procedureType')
            .where(
              `shiftSlot.shift_id = :shiftId AND shiftSlot.is_archived = false`,

              {
                shiftId: shift.id,
              }
            )
            .orderBy('shiftSlot.start_time')

            .getMany();

          return shiftSlots;
        })
      );

      const flattenedShiftSlots = shiftsWithSlots.flat();
      const totalSlots = flattenedShiftSlots?.length;

      const data = await this.donorCenterBluePrintsRepo
        .createQueryBuilder('donor_center_blueprints')
        .leftJoin(
          'shifts',
          'shifts',
          'shifts.shiftable_id = donor_center_blueprints.id AND shifts.shiftable_type = :type',
          {
            type: 'crm_donor_center_blueprints',
          }
        )
        .leftJoin(
          'shifts_projections_staff',
          'shifts_projections_staff',
          'shifts_projections_staff.shift_id = shifts.id'
        )
        // .leftJoin(
        //   'procedure_types_products',
        //   'procedure_types_products',
        //   'procedure_types_products.procedure_type_id = shifts_projections_staff.procedure_type_id'
        // )
        // .leftJoin(
        //   'products',
        //   'products',
        //   'products.id = procedure_types_products.product_id'
        // )
        .select([
          // 'DISTINCT products.id AS products_id',
          // 'products.name AS products_name',
          // 'procedure_types_products.procedure_type_id AS procedure_type_id',
          'shifts_projections_staff.id AS id',
          'shifts_projections_staff.is_donor_portal_enabled AS is_donor_portal_enabled',
          'shifts_projections_staff.procedure_type_qty AS procedure_type_qty',
        ])
        .where(
          'donor_center_blueprints.id = :id AND donor_center_blueprints.is_archived = false AND shifts_projections_staff.id IS NOT NULL',
          { id: id }
        )

        .getRawMany();
      const totalProcedureQty = data.reduce(
        (total, shift) => total + shift.procedure_type_qty,
        0
      );
      return resSuccess(
        'Shifts and Shift Slots retrieved successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        {
          shifts: findShifts,
          shift_slots: flattenedShiftSlots,
          total_slots: totalSlots,
          total_procedures: totalProcedureQty,
          draw_hours: shiftsDrawHours,
        }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async addShiftSlot(addShiftSlotDto: AddShiftSlotDTO, user: any) {
    try {
      if (!addShiftSlotDto.slots || addShiftSlotDto.slots.length === 0) {
        throw new HttpException(
          `Need data to create shift slot.`,
          HttpStatus.BAD_REQUEST
        );
      }
      const slotData: any = [];
      for (const shiftItem of addShiftSlotDto.slots) {
        if (!shiftItem?.procedure_type_id) {
          throw new HttpException(
            `Procedure Type id is required.`,
            HttpStatus.BAD_REQUEST
          );
        }

        if (!shiftItem?.shift_id) {
          throw new HttpException(
            `Shift id is required.`,
            HttpStatus.BAD_REQUEST
          );
        }
        const saveSlots = new ShiftsSlots();
        saveSlots.shift_id = shiftItem.shift_id;
        saveSlots.procedure_type_id = shiftItem.procedure_type_id;
        saveSlots.created_by = user;
        saveSlots.start_time = shiftItem.start_time;
        saveSlots.end_time = shiftItem.end_time;
        slotData.push(await this.shiftsSlotRepo.save(saveSlots));
      }

      return resSuccess(
        'Shift Slots created.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        slotData
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async archiveShiftSlot(id: any) {
    try {
      const shiftSlot = await this.shiftsSlotRepo.findOne({
        where: { id: id, is_archived: false },
        relations: ['created_by'],
      });

      if (!shiftSlot) {
        throw new HttpException(
          `Shift slot not found.`,
          HttpStatus.BAD_REQUEST
        );
      }

      const shiftsSlotsHistory = new ShiftsSlotsHistory();
      Object.assign(shiftsSlotsHistory, shiftSlot);

      shiftsSlotsHistory.id = shiftSlot.id;
      shiftsSlotsHistory.history_reason = 'D';
      shiftsSlotsHistory.shift_id = shiftSlot?.shift_id;
      shiftsSlotsHistory.procedure_type_id = shiftSlot?.procedure_type_id;
      shiftsSlotsHistory.created_by = shiftSlot?.created_by.id;
      shiftsSlotsHistory.start_time = shiftSlot?.start_time;
      shiftsSlotsHistory.end_time = shiftSlot?.end_time;
      await this.shiftsSlotsHistory.save(shiftsSlotsHistory);

      shiftSlot.is_archived = true;
      await this.shiftsSlotRepo.save(shiftSlot);

      return resSuccess(
        'Shift slot archived.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        {}
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async updateShiftProjectionStaff(
    updateShiftsProjectionStaff: UpdateShiftsProjectionStaff
  ) {
    try {
      const shiftIds = updateShiftsProjectionStaff?.shift_ids
        ? Array.isArray(updateShiftsProjectionStaff?.shift_ids)
          ? updateShiftsProjectionStaff?.shift_ids
          : [updateShiftsProjectionStaff?.shift_ids]
        : [];

      if (!updateShiftsProjectionStaff.procedure_type_id) {
        throw new HttpException(
          `Procedure type id is required.`,
          HttpStatus.BAD_REQUEST
        );
      }
      const shiftsData = await this.shiftsRepo.find({
        where: {
          id: In(shiftIds),
        },
      });

      if (!shiftsData.length || shiftsData.length === 0) {
        throw new HttpException(`Shift not found.`, HttpStatus.BAD_REQUEST);
      }

      const shiftsProjectionStaffData = await Promise.all(
        shiftsData?.map(async (shift) => {
          const projectionstaff = await this.shiftsprojectionStaffRepo.findOne({
            where: {
              shift_id: shift.id,
              procedure_type_id: updateShiftsProjectionStaff.procedure_type_id,
            },
          });
          projectionstaff.is_donor_portal_enabled =
            updateShiftsProjectionStaff.is_donor_portal_enabled;
          await this.shiftsprojectionStaffRepo.save(projectionstaff);
        })
      );
      return resSuccess(
        'Staff Projection staff Updated.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        {}
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async archiveBlueprint(user: any, blueprintId: bigint) {
    try {
      const blueprint = await this.donorCenterBluePrintsRepo.findOne({
        where: {
          id: blueprintId,
        },
        relations: ['created_by'],
      });
      const blueprintHistory = new DonorCenterBluePrintsHistory();
      Object.assign(blueprintHistory, blueprint);
      blueprintHistory.history_reason = 'D';
      blueprintHistory.created_by = blueprint.created_by.id;
      blueprintHistory.donorcenter_id = blueprint.donorcenter_id;
      blueprintHistory.tenant_id = blueprint.tenant_id;
      await this.createHistory(blueprintHistory);
      await this.shiftsService.createShiftHistory(
        blueprint.id,
        shiftable_type_enum.CRM_DONOR_CENTER_BLUEPRINTS,
        HistoryReason.D
      );

      blueprint.is_archived = true;
      await this.entityManager.save(blueprint);
      return resSuccess(
        'Blueprint archived.',
        SuccessConstants.SUCCESS,
        HttpStatus.NO_CONTENT,
        {}
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getProcedureTypeSlots(getShiftIds: any) {
    try {
      const shiftIds = getShiftIds?.shift_ids
        ? Array.isArray(getShiftIds?.shift_ids)
          ? getShiftIds?.shift_ids
          : [getShiftIds?.shift_ids]
        : [];

      const shiftSlots = await this.shiftsSlotRepo.find({
        relations: ['procedure_type'],
        where: {
          shift: { id: In(shiftIds) },
          procedure_type_id: getShiftIds?.procedure_type_id,
          is_archived: false,
        },
        order: {
          start_time: 'ASC',
        },
      });

      if (!shiftSlots.length || shiftSlots.length === 0) {
        throw new HttpException(
          `Shift slot not found.`,
          HttpStatus.BAD_REQUEST
        );
      }

      return resSuccess(
        'Shift slots found.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        shiftSlots
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getShiftProjectionStaff(getShiftIds: any) {
    try {
      const shiftIds = getShiftIds?.shift_ids
        ? Array.isArray(getShiftIds?.shift_ids)
          ? getShiftIds?.shift_ids
          : [getShiftIds?.shift_ids]
        : [];

      const shiftProjectionStaff = await this.shiftsprojectionStaffRepo.find({
        where: {
          shift: { id: In(shiftIds) },
          procedure_type_id: getShiftIds?.procedure_type_id,
          is_archived: false,
        },
      });

      if (!shiftProjectionStaff.length || shiftProjectionStaff.length === 0) {
        throw new HttpException(
          `Shift projection staff not found.`,
          HttpStatus.BAD_REQUEST
        );
      }

      return resSuccess(
        'Shift projection staff found.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        shiftProjectionStaff
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async editData(blueprintId: bigint, body: CreateBluePrintDTO) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const blueprint = await this.donorCenterBluePrintsRepo.findOne({
        where: {
          id: blueprintId,
        },
        relations: ['created_by'],
      });
      // const blueprintToUpdate = { ...blueprint };
      const blueprintHistory = new DonorCenterBluePrintsHistory();
      Object.assign(blueprintHistory, blueprint);
      blueprintHistory.history_reason = 'C';
      blueprintHistory.created_by = blueprint.created_by.id;
      blueprintHistory.donorcenter_id = blueprint.donorcenter_id;
      blueprintHistory.tenant_id = blueprint.tenant_id;
      await this.createHistory(blueprintHistory);
      await this.shiftsService.createShiftHistory(
        blueprint.id,
        shiftable_type_enum.CRM_DONOR_CENTER_BLUEPRINTS,
        HistoryReason.C
      );
      console.log({ blueprintId });
      await this.shiftsService.editShift(
        queryRunner,
        body.shifts,
        ShiftSlotsDto,
        blueprintId,
        shiftable_type_enum.CRM_DONOR_CENTER_BLUEPRINTS,
        HistoryReason.C,
        body.created_by,
        body.tenant_id
      );
      blueprint.created_by = body.created_by;
      blueprint.name = body.name;
      blueprint.oef_procedures = body.oef_procedures;
      blueprint.oef_products = body.oef_products;
      blueprint.is_default = body.is_default;
      blueprint.monday = body.weekdays.monday;
      blueprint.tuesday = body.weekdays.tuesday;
      blueprint.wednesday = body.weekdays.wednesday;
      blueprint.thursday = body.weekdays.thursday;
      blueprint.friday = body.weekdays.friday;
      blueprint.saturday = body.weekdays.saturday;
      blueprint.sunday = body.weekdays.sunday;
      blueprint.tenant_id = body.tenant_id;

      await this.entityManager.save(blueprint);

      await queryRunner.commitTransaction();
      return resSuccess(
        'Blueprint archived.',
        SuccessConstants.SUCCESS,
        HttpStatus.NO_CONTENT,
        {}
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async makeDefault(blueprintId: bigint) {
    try {
      const foundDefault = await this.donorCenterBluePrintsRepo.find({
        where: { is_default: true },
      });
      if (foundDefault?.length) {
        for (const i of foundDefault) {
          i.is_default = false;
          const save = await this.donorCenterBluePrintsRepo.save(i);
        }
      }
      const found = await this.donorCenterBluePrintsRepo.findOne({
        where: { id: blueprintId },
      });
      if (!found) {
        return resError('blueprint does not exist', ErrorConstants.Error, 400);
      }
      found.is_default = true;
      const save = await this.donorCenterBluePrintsRepo.save(found);

      return resSuccess(
        'Default Success.',
        SuccessConstants.SUCCESS,
        HttpStatus.NO_CONTENT,
        { data: save }
      );
    } catch (error) {
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
