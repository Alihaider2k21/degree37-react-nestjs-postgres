import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { OrderByConstants } from 'src/api/system-configuration/constants/order-by.constants';
import { HistoryService } from 'src/api/common/services/history.service';
import {
  CreateStaffRolesMappingDto,
  UpdateStaffRolesMappingDto,
} from '../dto/create-staff-roles-mapping.dto';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { resError } from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { StaffRolesMapping } from '../entities/staff-roles-mapping.entity';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { Staff } from '../../entities/staff.entity';
import { StaffRolesMappingHistory } from '../entities/staff-roles-mapping-history.entity';
import { CommonFunction } from '../../../common/common-functions';
import { GetAllStaffRolesMappingInterface } from '../interface/staff-roles-mapping.interface';

@Injectable()
export class StaffRolesMappingService extends HistoryService<StaffRolesMappingHistory> {
  private message = 'Staff Roles';
  constructor(
    @InjectRepository(StaffRolesMapping)
    private entityRepository: Repository<StaffRolesMapping>,
    @InjectRepository(StaffRolesMappingHistory)
    private readonly entityHistoryRepository: Repository<StaffRolesMappingHistory>,
    @InjectRepository(ContactsRoles)
    private contactsRolesRepository: Repository<ContactsRoles>,
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
  async create(createDto: CreateStaffRolesMappingDto) {
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

      const { role_id, ...createdDto } = createDto;
      for (const item of role_id) {
        const create = new StaffRolesMapping();
        const keys = Object.keys(createdDto);
        //set values in create obj
        for (const key of keys) {
          create[key] = createdDto?.[key];
        }
        const role = await this.commonFunction.entityExist(
          this.contactsRolesRepository,
          { where: { id: item } },
          'Contacts Roles'
        );
        create.role_id = role;
        const staffRoles = await this.commonFunction.entity(
          this.entityRepository,
          {
            where: {
              role_id: { id: item },
              staff_id: { id: createdDto.staff_id },
            },
          }
        );

        if (!staffRoles)
          // Save entity
          await queryRunner.manager.save(create);
      }
      await queryRunner.commitTransaction();
      const saveObj = await this.commonFunction.entityList(
        this.entityRepository,
        {
          relations: ['role_id', 'staff_id'],
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
  async update(id: any, role_id: any, updateDto: UpdateStaffRolesMappingDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await this.commonFunction.entityExist(
        this.userRepository,
        { where: { id: updateDto?.created_by } },
        'User'
      );
      await this.commonFunction.entityExist(
        this.contactsRolesRepository,
        { where: { id: updateDto?.role_id } },
        'Contacts Roles'
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
          relations: ['tenant_id', 'created_by', 'staff_id', 'role_id'],
          where: {
            role_id: { id: updateDto.role_id },
            staff_id: { id: updateDto.staff_id },
          },
        },
        this.message
      );
      const saveHistory = new StaffRolesMappingHistory();
      Object.assign(saveHistory, entity);
      saveHistory.created_by = entity.created_by.id;
      saveHistory.tenant_id = entity.tenant_id.id;
      saveHistory.staff_id = entity.staff_id.id;
      saveHistory.role_id = entity.role_id.id;
      saveHistory.history_reason = 'C';

      delete saveHistory?.created_at;
      await this.createHistory(saveHistory);
      entity.is_primary = updateDto?.is_primary;
      const updatedData = await this.entityRepository.save(entity);
      return {
        status: HttpStatus.CREATED,
        message: `${this.message} Update Successfully`,
        data: updatedData,
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
      relations: ['role_id'],
      where: {
        staff_id: { id },
        is_archived: false,
      },
    };
    let data = await this.commonFunction.entityList(
      this.entityRepository,
      query
    );

    if (data?.length) {
      data = data.filter((staffRole) => {
        // Check if is_archived is false in role_id
        return staffRole.role_id.is_archived === false;
      });
    }
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
  async findAll(getAllInterface: GetAllStaffRolesMappingInterface) {
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

  async archive(id: any, role_id: any, updateDto: UpdateStaffRolesMappingDto) {
    try {
      const entity = await this.commonFunction.entityExist(
        this.entityRepository,
        {
          relations: ['tenant_id', 'created_by', 'staff_id', 'role_id'],
          where: {
            role_id: { id: updateDto.role_id },
            staff_id: { id: updateDto.staff_id },
            tenant_id: { id: updateDto.tenant_id },
          },
        },
        this.message
      );
      if (!entity) {
        return {
          status: 'error',
          code: 404,
          response: 'Role not found.',
        };
      }
      // Use remove to delete the entity
      await this.entityRepository.remove(entity);

      return {
        status: HttpStatus.OK,
        message: 'Role removed.',
        data: null, // Assuming you don't want to return the deleted entity
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
