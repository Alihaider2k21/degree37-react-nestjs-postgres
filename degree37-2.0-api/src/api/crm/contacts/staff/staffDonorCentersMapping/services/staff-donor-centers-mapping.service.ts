import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { OrderByConstants } from 'src/api/system-configuration/constants/order-by.constants';
import { HistoryService } from 'src/api/common/services/history.service';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { resError } from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { Staff } from '../../entities/staff.entity';
import { CommonFunction } from '../../../common/common-functions';
import { StaffDonorCentersMapping } from '../entities/staff-donor-centers-mapping.entity';
import { StaffDonorCentersMappingHistory } from '../entities/staff-donor-centers-mapping-history.entity';
import {
  CreateStaffDonorCentersMappingDto,
  UpdateStaffDonorCentersMappingDto,
} from '../dto/create-donor-centers-mapping.dto';
import { GetAllStaffDonorCentersMappingInterface } from '../interface/staff-donor-centers-mapping.interface';
import { Facility } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/facilities/entity/facility.entity';

@Injectable()
export class StaffDonorCentersMappingService extends HistoryService<StaffDonorCentersMappingHistory> {
  private message = 'Staff Donor Centers';
  constructor(
    @InjectRepository(StaffDonorCentersMapping)
    private entityRepository: Repository<StaffDonorCentersMapping>,
    @InjectRepository(StaffDonorCentersMappingHistory)
    private readonly entityHistoryRepository: Repository<StaffDonorCentersMappingHistory>,
    @InjectRepository(Facility)
    private facilityRepository: Repository<Facility>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commonFunction: CommonFunction,
    private readonly entityManager: EntityManager
  ) {
    super(entityHistoryRepository);
  }

  /**
   * create new entity
   * @param createDto
   * @returns
   */
  async create(createDto: CreateStaffDonorCentersMappingDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.commonFunction.entityExist(
        this.userRepository,
        { where: { id: createDto?.created_by } },
        'User'
      );

      await this.commonFunction.entityExist(
        this.staffRepository,
        { where: { id: createDto?.staff_id } },
        'Staff'
      );

      const { donor_center_id, ...createdDto } = createDto;
      for (const item of donor_center_id) {
        const create = new StaffDonorCentersMapping();
        const keys = Object.keys(createdDto);
        //set values in create obj
        for (const key of keys) {
          create[key] = createdDto?.[key];
        }
        const facility = await this.commonFunction.entityExist(
          this.facilityRepository,
          { where: { id: item, donor_center: true } },
          'Donor Center'
        );
        create.donor_center_id = facility;
        const staffDonorCenter = await this.commonFunction.entity(
          this.entityRepository,
          {
            where: {
              donor_center_id: { id: item },
              staff_id: { id: createdDto.staff_id },
            },
          }
        );

        if (!staffDonorCenter)
          // Save entity
          await queryRunner.manager.save(create);
      }
      await queryRunner.commitTransaction();
      const saveObj = await this.commonFunction.entityList(
        this.entityRepository,
        {
          relations: ['donor_center_id', 'staff_id'],
          where: { staff_id: { id: createDto.staff_id } },
        }
      );
      return {
        status: HttpStatus.CREATED,
        message: `${this.message} Created Successfully`,
        data: saveObj,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * update record
   * insert data in history table
   * @param id
   * @param updateDto
   * @returns
   */
  async update(
    id: any,
    donor_center_id: any,
    updateDto: UpdateStaffDonorCentersMappingDto
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.commonFunction.entityExist(
        this.userRepository,
        { where: { id: updateDto?.created_by } },
        'User'
      );
      await this.commonFunction.entityExist(
        this.facilityRepository,
        { where: { id: updateDto?.donor_center_id } },
        'Donor Center'
      );
      await this.commonFunction.entityExist(
        this.staffRepository,
        { where: { id: updateDto?.staff_id } },
        'Staff'
      );
      const entities = await this.commonFunction.entityList(
        this.entityRepository,
        { where: { staff_id: { id: updateDto.staff_id } } }
      );
      for (const item of entities) {
        item.is_primary = false;
        await this.entityRepository.save(item);
      }
      const entity = await this.commonFunction.entityExist(
        this.entityRepository,
        {
          relations: ['tenant_id', 'created_by', 'staff_id', 'donor_center_id'],
          where: {
            donor_center_id: { id: updateDto.donor_center_id },
            staff_id: { id: updateDto.staff_id },
          },
        },
        this.message
      );
      const saveHistory = new StaffDonorCentersMappingHistory();
      Object.assign(saveHistory, entity);
      saveHistory.created_by = entity.created_by.id;
      saveHistory.tenant_id = entity.tenant_id.id;
      saveHistory.staff_id = entity.staff_id.id;
      saveHistory.donor_center_id = entity.donor_center_id.id;
      saveHistory.history_reason = 'C';

      delete saveHistory?.created_at;
      await this.createHistory(saveHistory);
      entity.is_primary = updateDto?.is_primary;

      const updatedData = await this.entityRepository.save(entity);

      const query = {
        relations: ['donor_center_id'],
        where: {
          staff_id: { id },
          is_archived: false,
        },
      };
      const data = await this.commonFunction.entityList(
        this.entityRepository,
        query
      );
      return {
        status: HttpStatus.CREATED,
        message: `${this.message} Update Successfully`,
        data: data,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * update record
   * insert data in history table
   * @param id
   * @param updateDto
   * @returns
   */
  async remove(
    id: any,
    donor_center_id: any,
    updateDto: UpdateStaffDonorCentersMappingDto
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const entity = await this.commonFunction.entityExist(
        this.entityRepository,
        {
          relations: ['tenant_id', 'created_by', 'staff_id', 'donor_center_id'],
          where: {
            donor_center_id: { id: updateDto.donor_center_id },
            staff_id: { id: updateDto.staff_id },
          },
        },
        this.message
      );
      if (!entity) {
        return {
          status: 'error',
          code: 404,
          response: 'Donor center not found.',
        };
      }
      await this.entityRepository.remove(entity);
      return {
        status: HttpStatus.OK,
        message: 'Donor center removed.',
        data: null,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * fetch single record
   * @param id
   * @returns {object}
   */
  async findOne(id: any) {
    const query = {
      relations: ['donor_center_id'],
      where: {
        staff_id: { id },
        is_archived: false,
      },
    };
    const data = await this.commonFunction.entityList(
      this.entityRepository,
      query
    );
    return {
      status: HttpStatus.OK,
      message: `${this.message} Fetched Successfully`,
      data,
    };
  }

  /**
   * get all records
   * @param getAllInterface
   * @returns {objects}
   */
  async findAll(getAllInterface: GetAllStaffDonorCentersMappingInterface) {
    try {
      const {
        limit = parseInt(process.env.PAGE_SIZE),
        page = 1,
        sortBy = 'id',
        sortOrder = OrderByConstants.DESC,
        tenant_id,
      } = getAllInterface;
      const { skip, take } = this.commonFunction.pagination(limit, page);
      const order = { [sortBy]: sortOrder };

      const where = {
        is_archived: false,
      };

      Object.assign(where, {
        tenant_id: { id: tenant_id },
      });

      const [data, count] = await this.entityRepository.findAndCount({
        relations: ['tenant_id', 'created_by'],
        where,
        skip,
        take,
        order,
      });
      return {
        status: HttpStatus.OK,
        message: `${this.message} Fetched Successfully`,
        count,
        data,
      };
    } catch (error) {
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
