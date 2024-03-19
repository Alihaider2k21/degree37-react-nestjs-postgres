import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HistoryService } from 'src/api/common/services/history.service';
import { Sessions } from './entities/sessions.entity';
import { SessionsHistory } from './entities/sessions-history.entity';
import { SessionsPromotions } from './entities/sessions-promotions.entity';
import { SessionsPromotionsHistory } from './entities/sessions-promotions-history.entity';
import { CustomFields } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-field.entity';
import { PromotionEntity } from 'src/api/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotions/entity/promotions.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { CreateSessionDto } from './dto/create-sessions.dto';
import {
  Response,
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { Facility } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/facilities/entity/facility.entity';
import { UserRequest } from 'src/common/interface/request';
import { REQUEST } from '@nestjs/core';
import { saveCustomFields } from 'src/api/common/services/saveCustomFields.service';
import { ApprovalStatusEnum } from '../drives/enums';
import { Sort } from 'src/common/interface/sort';
import { FilterSessions } from './interfaces/filter-sessions.interface';
import { pagination } from 'src/common/utils/pagination';
import { PolymorphicType } from 'src/api/common/enums/polymorphic-type.enum';
import { HistoryReason } from 'src/common/enums/history_reason.enum';
import { ShiftsService } from 'src/api/shifts/services/shifts.service';
import { shiftable_type_enum } from 'src/api/shifts/enum/shifts.enum';
import { isExistMultiple, isExists } from 'src/api/common/utils/exists';

@Injectable()
export class SessionsService extends HistoryService<SessionsHistory> {
  constructor(
    @Inject(REQUEST)
    private readonly request: UserRequest,
    @InjectRepository(Sessions)
    private readonly sessionsRepository: Repository<Sessions>,
    @InjectRepository(SessionsHistory)
    private readonly sessionsHistoryRepository: Repository<SessionsHistory>,
    @InjectRepository(SessionsPromotions)
    private readonly sessionsPromotionsRepository: Repository<SessionsPromotions>,
    @InjectRepository(SessionsPromotionsHistory)
    private readonly sessionsPromotionsHistoryRepository: Repository<SessionsPromotionsHistory>,
    @InjectRepository(CustomFields)
    private readonly customFieldsRepository: Repository<CustomFields>,
    @InjectRepository(PromotionEntity)
    private readonly promotionsRespository: Repository<PromotionEntity>,
    @InjectRepository(OperationsStatus)
    private readonly operationStatusRespository: Repository<OperationsStatus>,
    @InjectRepository(BusinessUnits)
    private readonly collectionOperationRespository: Repository<BusinessUnits>,
    @InjectRepository(Facility)
    private readonly donorCenterRespository: Repository<Facility>,
    private readonly shiftsService: ShiftsService,
    private readonly entityManager: EntityManager
  ) {
    super(sessionsHistoryRepository);
  }

  async create(createDto: CreateSessionDto): Promise<Response> {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      const [collectionOperation, operationStatus, promotions, donorCenter] =
        await Promise.all([
          isExists<BusinessUnits>(
            createDto.collection_operation_id,
            this.collectionOperationRespository,
            'Collection Operation not found'
          ),
          isExists<OperationsStatus>(
            createDto.status_id,
            this.operationStatusRespository,
            'Status not found'
          ),
          isExistMultiple<PromotionEntity>(
            createDto.promotion_ids,
            this.promotionsRespository,
            'Some Promotions are not found'
          ),
          isExists<Facility>(
            createDto.donor_center_id,
            this.donorCenterRespository,
            'Donor Center not found'
          ),
        ]);

      let approval_status = ApprovalStatusEnum.APPROVED;
      if (!this.request.user.override && operationStatus.requires_approval) {
        approval_status = ApprovalStatusEnum.REQUIRES_APPROVAL;
      }

      await queryRunner.startTransaction();

      // Saving session
      const session = await queryRunner.manager.save(
        this.sessionsRepository.create({
          date: createDto.date,
          collection_operation: collectionOperation,
          operation_status: operationStatus,
          donor_center: donorCenter,
          tenant: this.request.user?.tenant,
          created_by: this.request.user,
          approval_status,
        })
      );

      // Saving custom fields
      const customFields = [];
      await saveCustomFields(
        this.customFieldsRepository,
        queryRunner,
        session,
        session.created_by,
        session.tenant,
        createDto,
        customFields
      );

      // Saving session promotions
      await queryRunner.manager.insert(
        SessionsPromotions,
        promotions.map((promotion) => ({
          session,
          promotion,
          created_by: this.request.user,
        }))
      );

      // Saving shifts
      await this.shiftsService.createShiftByShiftAble(
        createDto,
        queryRunner,
        createDto.shifts,
        session,
        this.request.user,
        this.request.user?.tenant?.id,
        shiftable_type_enum.SESSIONS,
        false,
        true
      );

      await queryRunner.commitTransaction();

      return resSuccess(
        'Session Created.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { ...session, customFields, promotions }
      );
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException)
        return resError(error.message, ErrorConstants.Error, error.getStatus());
      return resError(
        'Something went wrong.',
        ErrorConstants.Error,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      await queryRunner.release();
    }
  }

  async get(
    page: number,
    limit: number,
    sortBy: Sort,
    filters: FilterSessions
  ) {
    try {
      const sessionsQuery = this.sessionsRepository
        .createQueryBuilder('sessions')
        .leftJoinAndSelect(
          'sessions.donor_center',
          'dc',
          'dc.is_archived = false'
        )
        .leftJoinAndSelect(
          'business_units',
          'bu',
          'dc.collection_operation = bu.id AND bu.is_archived = false'
        )
        .leftJoinAndSelect(
          'sessions.operation_status',
          'oc',
          'oc.is_archived = false'
        )
        .leftJoinAndSelect(
          'sessions_promotions',
          'sessions_promos',
          'sessions.id = sessions_promos.session_id AND sessions_promos.is_archived = false'
        )
        .leftJoinAndSelect(
          'promotion_entity',
          'promos',
          'promos.id = sessions_promos.promotion_id AND promos.is_archived = false'
        )
        .leftJoinAndSelect(
          'shifts',
          'shifts',
          `shifts.shiftable_type = '${PolymorphicType.OC_OPERATIONS_SESSIONS}' AND shifts.shiftable_id = sessions.id AND shifts.is_archived = false`
        )
        .leftJoinAndSelect(
          'shifts_projections_staff',
          'projections',
          `projections.shift_id = shifts.id AND (projections.is_archived = false)`
        )
        .select([
          'sessions.id AS id',
          'sessions.date AS date',
          'dc.name AS donor_center',
          'bu.name AS collection_operation',
          'oc.name AS status',
          `STRING_AGG(promos.name, ', ') AS promotions`,
          `CONCAT(COALESCE(SUM(projections.product_yield), 0), ' / ', COALESCE(SUM(projections.procedure_type_qty), 0)) AS projection`,
          `CONCAT(ROUND(sessions.oef_products, 2), ' / ', ROUND(sessions.oef_procedures, 2)) AS oef`,
          'MIN(DISTINCT shifts.start_time) AS start_time',
          'MAX(DISTINCT shifts.end_time) AS end_time',
        ])
        .groupBy('sessions.id, dc.id, oc.id, bu.id')
        .where({
          tenant: this.request.user.tenant,
          is_archived: false,
        });

      const operationStatusQuery = this.sessionsRepository
        .createQueryBuilder('sessions')
        .leftJoinAndSelect(
          'sessions.operation_status',
          'oc',
          'oc.is_archived = false'
        )
        .where({ is_archived: false })
        .select(['oc.id AS id', 'oc.name AS name'])
        .distinctOn(['oc.id'])
        .orderBy('oc.id');

      const promotionsQuery = this.sessionsPromotionsRepository
        .createQueryBuilder('sessions_promos')
        .leftJoinAndSelect(
          'sessions_promos.session',
          'sessions',
          'sessions.is_archived = false'
        )
        .leftJoinAndSelect(
          'sessions_promos.promotion',
          'promos',
          'promos.is_archived = false'
        )
        .where({ is_archived: false })
        .select(['promos.id AS id', 'promos.name AS name'])
        .distinctOn(['promos.id'])
        .orderBy('promos.id');

      if (filters?.keyword) {
        sessionsQuery.andWhere(`dc.name ILIKE :keyword`, {
          keyword: `%${filters.keyword}%`,
        });
      }
      if (filters?.start_date) {
        sessionsQuery.andWhere(`sessions.date > :start_date`, {
          start_date: filters.start_date,
        });
      }
      if (filters?.end_date) {
        sessionsQuery.andWhere(`sessions.date <= :end_date`, {
          end_date: filters.end_date,
        });
      }
      if (filters?.promotion_id) {
        sessionsQuery.andWhere(`promos.id = :promotion_id`, {
          promotion_id: filters.promotion_id,
        });
      }
      if (filters?.status_id) {
        sessionsQuery.andWhere(`oc.id = :status_id`, {
          status_id: filters.status_id,
        });
      }
      if (filters?.min_projection) {
        sessionsQuery.andHaving(
          `COALESCE(SUM(projections.procedure_type_qty), 0) >= :min_projection`,
          {
            min_projection: filters.min_projection,
          }
        );
      }
      if (filters?.max_projection) {
        sessionsQuery.andHaving(
          `COALESCE(SUM(projections.procedure_type_qty), 0) < :max_projection`,
          {
            max_projection: filters.max_projection,
          }
        );
      }
      if (filters?.organizational_levels) {
        const collection_operations = JSON.parse(filters.organizational_levels);
        let olWhere = '';
        const params = {};
        Object.entries(collection_operations).forEach(
          ([co_id, value], index) => {
            olWhere += olWhere ? ' OR ' : '';
            olWhere += `(bu.id = :co_id${index}`;
            params[`co_id${index}`] = co_id;
            const { donor_centers } = <any>value;
            if (donor_centers?.length) {
              olWhere += ` AND dc.id IN (:...donor_centers${index})`;
              params[`donor_centers${index}`] = donor_centers;
            }
            olWhere += ')';
          }
        );
        sessionsQuery.andWhere(`(${olWhere})`, params);
      }
      if (sortBy.sortName && sortBy.sortOrder) {
        sessionsQuery.addOrderBy(sortBy.sortName, sortBy.sortOrder);
      }

      const count = await sessionsQuery.getCount();

      if (page && limit) {
        const { skip, take } = pagination(page, limit - 1);
        sessionsQuery.limit(take).offset(skip);
      }

      const [records, operationStatus, promotions] = await Promise.all([
        sessionsQuery.getRawMany(),
        operationStatusQuery.getRawMany(),
        promotionsQuery.getRawMany(),
      ]);

      return resSuccess(
        'Sessions records',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { count, records, operationStatus, promotions }
      );
    } catch (error) {
      console.error(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getShiftInfo(id: any) {
    try {
      const queryCount = await this.sessionsRepository
        .createQueryBuilder('sessions')
        .select(`(JSON_BUILD_OBJECT('id', sessions.id))`, 'sessions')
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
                    'name', products.name, 
                    'product_qty',shifts_projections_staff.product_yield
                ) ) FROM products
                        JOIN procedure_types_products ON products.id = procedure_types_products.product_id
                        JOIN shifts_projections_staff ON procedure_types_products.procedure_type_id = shifts_projections_staff.procedure_type_id
                        JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
                        WHERE shifts.shiftable_id = ${id} AND
                        shifts.shiftable_type = 'sessions'
              ),
              'procedure_types', (SELECT JSON_AGG(JSON_BUILD_OBJECT(
                'id', procedure_types.id,
                  'name', procedure_types.name, 
                  'procedure_type_qty',shifts_projections_staff.procedure_type_qty
              ) ) FROM procedure_types
                      JOIN shifts_projections_staff ON procedure_types.id = shifts_projections_staff.procedure_type_id
                      JOIN shifts ON shifts_projections_staff.shift_id = shifts.id
                      WHERE shifts.shiftable_id = ${id} AND
                      shifts.shiftable_type = 'sessions'
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
                shifts.shiftable_type = 'sessions'

                )
            ))
            FROM shifts
            WHERE shifts.shiftable_id = sessions.id
            AND shifts.shiftable_type = 'sessions'
          )`,
          'shifts'
        )
        .where(`sessions.is_archived = false AND sessions.id = ${id}`)
        .getQuery();

      const SampleCount = await this.sessionsRepository.query(queryCount);
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

  async archive(id: string) {
    try {
      if (isNaN(parseInt(id))) {
        return resError(
          'Invalid data',
          ErrorConstants.Error,
          HttpStatus.BAD_REQUEST
        );
      }

      const session = await this.sessionsRepository.findOneBy({
        id: <any>id,
        is_archived: false,
      });

      if (!session) {
        return resError(
          'Not Found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      // archive session
      session.is_archived = true;
      this.sessionsRepository.save(session);

      // store history
      this.createHistory({
        ...session,
        history_reason: HistoryReason.D,
        created_by: this.request.user?.id,
        tenant_id: this.request.user.tenant?.id,
        is_archived: false,
      });

      return resSuccess(
        'Session Archive Successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK
      );
    } catch (error) {
      console.error(error);
      return resError(error, ErrorConstants.Error);
    }
  }
}
