import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  EntityManager,
  ILike,
  In,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { User } from '../entity/user.entity';
import {
  SearchInterface,
  ResetPasswordInterface,
} from '../interface/user.interface';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { keyCloakAdmin } from '../../../../../../config/keycloak.config';
import { Roles } from '../../../../platform-administration/roles-administration/role-permissions/entities/role.entity';
import { UserBusinessUnits } from '../entity/user-business-units.entity';
import { UserBusinessUnitsHistory } from '../entity/user-business-units-history.entity';
import { UserHistory } from '../entity/userhistory.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { BusinessUnits } from '../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { resError, resSuccess } from '../../../../helpers/response';
import { SuccessConstants } from '../../../../constants/success.constants';
import { ErrorConstants } from '../../../../constants/error.constants';
import { getModifiedDataDetails } from '../../../../../../common/utils/modified_by_detail';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { OrganizationalLevels } from '../../../organizational-administration/hierarchy/organizational-levels/entities/organizational-level.entity';
import { pagination } from 'src/common/utils/pagination';
import { UserRequest } from 'src/common/interface/request';
import { REQUEST } from '@nestjs/core';
import { CommunicationService } from 'src/api/crm/contacts/volunteer/communication/services/communication.service';
import { HistoryReason } from 'src/common/enums/history_reason.enum';
import {
  MessageType,
  getDSTemplates,
  sendDSEmail,
} from 'src/api/common/services/dailyStory.service';
import { QueryRunner } from 'typeorm/browser';

dotenv.config();
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserHistory)
    private readonly userHistoryRepository: Repository<UserHistory>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(UserBusinessUnits)
    private readonly userBusinessUnitsRepository: Repository<UserBusinessUnits>,
    @InjectRepository(UserBusinessUnitsHistory)
    private readonly userBusinessUnitsHistoryRepository: Repository<UserBusinessUnitsHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(BusinessUnits)
    private readonly businessRepository: Repository<BusinessUnits>,
    @InjectRepository(OrganizationalLevels)
    private readonly organizationalLevelRepository: Repository<OrganizationalLevels>,
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
    private readonly entityManager: EntityManager,
    private readonly communicationService: CommunicationService,
    @Inject(REQUEST)
    private request: UserRequest
  ) {}

  async addUser(createUserDto: any, subdomain: string) {
    const userData = await this.userRepository.findOne({
      where: { email: createUserDto?.email },
      withDeleted: true,
    });

    if (createUserDto?.role) {
      const roleData = await this.rolesRepository.findOne({
        where: { id: createUserDto?.role, is_archived: false },
      });
      const isTenantAdminExists = await this.userRepository.exist({
        where: {
          is_archived: false,
          role: {
            id: createUserDto?.role,
          },
        },
      });

      if (!roleData) {
        throw new NotFoundException('Role not found');
      } else if (roleData.is_auto_created && isTenantAdminExists) {
        throw new NotFoundException(
          `There can be only one ${roleData.name} in each tenant.`
        );
      }
    }

    if (createUserDto?.business_units) {
      const businessUnits = await this.businessRepository.find({
        where: { id: In(createUserDto?.business_units), is_archived: false },
      });

      if (!businessUnits.length) {
        throw new NotFoundException('Business units not found');
      }
    }

    if (userData || userData?.deleted_at) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    if (createUserDto?.unique_identifier) {
      const dupUniqueIden = await this.userRepository.findOne({
        where: { unique_identifier: createUserDto?.unique_identifier },
        withDeleted: true,
      });

      if (dupUniqueIden) {
        throw new HttpException(
          'Unique identifier already exists',
          HttpStatus.CONFLICT
        );
      }
    }
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const userData = await this.userRepository.findOne({
        where: { email: createUserDto?.email },
        withDeleted: true,
      });

      if (createUserDto?.role) {
        const roleData = await this.rolesRepository.findOne({
          where: { id: createUserDto?.role, is_archived: false },
        });

        if (!roleData) {
          // throw new NotFoundException('User not found');
          return resError('Role not found', ErrorConstants.Error, 400);
        }
      }

      if (createUserDto?.business_unit) {
        const businessData = await this.businessRepository.findOne({
          where: { id: createUserDto?.business_unit },
        });

        if (!businessData) {
          // throw new NotFoundException('Business not found');
          return resError(
            'There can be only one ${roleData.name} in each tenant.',
            ErrorConstants.Error,
            400
          );
        }
      }

      if (userData || userData?.deleted_at) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      if (createUserDto?.unique_identifier) {
        const dupUniqueIden = await this.userRepository.findOne({
          where: { unique_identifier: createUserDto?.unique_identifier },
          withDeleted: true,
        });

        if (dupUniqueIden) {
          throw new HttpException(
            'Unique identifier already exists',
            HttpStatus.CONFLICT
          );
        }
      }

      const user = await this.userRepository.findOne({
        where: { id: createUserDto?.created_by },
        relations: ['tenant'],
      });

      const passwordHash = await bcrypt.hash(
        createUserDto.password,
        +process.env.BCRYPT_SALT_ROUNDS ?? 10
      );

      const newUser = new User();

      newUser.first_name = createUserDto.first_name;
      newUser.last_name = createUserDto.last_name;
      newUser.last_permissions_updated = new Date();
      newUser.unique_identifier = createUserDto.unique_identifier;
      newUser.email = createUserDto.email.toLowerCase();
      newUser.date_of_birth = createUserDto.date_of_birth;
      newUser.gender = createUserDto.gender;
      newUser.home_phone_number = createUserDto?.home_phone_number;
      newUser.work_phone_number = createUserDto?.work_phone_number;
      newUser.work_phone_extension = createUserDto?.work_phone_extension;
      newUser.address_line_1 = createUserDto?.address_line_1;
      newUser.address_line_2 = createUserDto?.address_line_2;
      newUser.zip_code = createUserDto?.zip_code;
      newUser.city = createUserDto?.city;
      newUser.state = createUserDto?.state;
      newUser.role = createUserDto?.role;
      newUser.mobile_number = createUserDto?.mobile_number;
      newUser.is_manager = createUserDto?.is_manager;
      newUser.hierarchy_level = createUserDto?.hierarchy_level;
      newUser.assigned_manager = createUserDto?.assigned_manager;
      newUser.override = createUserDto?.override;
      newUser.adjust_appointment_slots =
        createUserDto?.adjust_appointment_slots;
      newUser.resource_sharing = createUserDto?.resource_sharing;
      newUser.edit_locked_fields = createUserDto?.edit_locked_fields;
      newUser.account_state = createUserDto?.account_state;
      newUser.tenant = user?.tenant;
      (newUser.created_at = new Date()),
        // newUser.updated_at = new Date(),
        (newUser.password = passwordHash);
      newUser.tenant = createUserDto?.tenant;
      newUser.keycloak_username = createUserDto.email.toLowerCase();
      if (createUserDto?.created_by)
        newUser.created_by = createUserDto?.created_by;
      newUser.is_active = createUserDto.is_active ?? false;
      newUser.all_hierarchy_access =
        createUserDto.all_hierarchy_access ?? false;
      console.log('createUserDto?.created_by', createUserDto?.created_by);

      const savedUser = await queryRunner.manager.save(newUser);

      const promises = [];
      for (const businessUnit of createUserDto?.business_units) {
        const newUserBusinessUnit = new UserBusinessUnits();
        newUserBusinessUnit.user_id = savedUser.id;
        newUserBusinessUnit.business_unit_id = businessUnit;
        newUserBusinessUnit.created_by = createUserDto?.created_by;
        promises.push(
          queryRunner.manager
            .getRepository(UserBusinessUnits)
            .insert(newUserBusinessUnit)
        );
      }
      await Promise.all(promises);

      await createKeyCloakUser(subdomain, createUserDto.password, {
        ...createUserDto,
      });

      // ********* Sending Email to new user *************
      const requestTenant = this.request.user.tenant;

      const emailTemplate = await getDSTemplates(
        requestTenant?.dailystory_campaign_id,
        requestTenant?.dailystory_token
      );

      await sendDSEmail(
        emailTemplate?.Response?.emails?.[0]?.emailId,
        createUserDto.email,
        {
          email_body: `Hi ${createUserDto.first_name} ${createUserDto.last_name},

          Welcome to Degree37. Your new account comes with access to platform Admin.
          
          Email: ${createUserDto.email}
          
          Password: ${createUserDto.password}
          
          For login to Degree37, please click here`,
          subject: `${createUserDto.first_name} ${createUserDto.last_name} , Welcome to ${requestTenant.tenant_name}`,
          from: requestTenant.email,
          messageType: MessageType.email,
        },
        requestTenant?.dailystory_token
      );
      // ********************************************************

      await queryRunner.commitTransaction();

      return resSuccess(
        'User Created Successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedUser
      );
    } catch (error) {
      console.log(error, 'error');
      await queryRunner.rollbackTransaction();
      console.log('<<<<<<<<<<<<<<<<<<<<<<< User add >>>>>>>>>>>>>>>>>>>>>>>>>');
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async getUsers(getAllUsersInterface, user = null) {
    const limit = parseInt(
      getAllUsersInterface?.limit?.toString() ?? process.env.PAGE_SIZE ?? '10'
    );
    let page = getAllUsersInterface?.page ? +getAllUsersInterface?.page : 1;
    if (page < 1) {
      page = 1;
    }

    const userQuery = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role', 'role.is_archived = false')
      .leftJoinAndSelect('user.tenant', 'tenant')
      .leftJoinAndSelect(
        'user.assigned_manager',
        'manager',
        'manager.is_archived = false'
      )
      .leftJoinAndSelect('user.business_units', 'bu', 'bu.is_archived = false')
      .leftJoinAndSelect('user.hierarchy_level', 'ol', 'ol.is_archived = false')
      .where({ is_archived: false })
      .orderBy({ 'user.id': 'DESC' });

    if (user) {
      userQuery.andWhere('tenant.id = :tenant_id', {
        tenant_id: user?.tenant?.id,
      });
    }
    if (getAllUsersInterface?.roleId) {
      userQuery.andWhere('role.id = :role_id', {
        role_id: getAllUsersInterface?.roleId,
      });
    }
    if (getAllUsersInterface?.assignedManager) {
      userQuery.andWhere('manager.id = :manager_id', {
        manager_id: getAllUsersInterface?.assignedManager,
      });
    }
    if (getAllUsersInterface?.keyword) {
      userQuery.andWhere(
        new Brackets((subQb) => {
          subQb
            .where("(user.first_name || ' ' || user.last_name) ILIKE :name", {
              name: `%${getAllUsersInterface?.keyword}%`,
            })
            .orWhere('user.email ILIKE :email', {
              email: `%${getAllUsersInterface?.keyword}%`,
            })
            .orWhere('user.mobile_number ILIKE :mobile_number', {
              mobile_number: `%${getAllUsersInterface?.keyword.replace(
                /%/g,
                ' '
              )}%`,
            })
            .orWhere('role.name ILIKE :roleName', {
              roleName: `%${getAllUsersInterface?.keyword}%`,
            })
            .orWhere(
              "(manager.first_name || ' ' || manager.last_name) ILIKE :managerName",
              {
                managerName: `%${getAllUsersInterface?.keyword}%`,
              }
            );
        })
      );
    }
    if (getAllUsersInterface?.organizational_levels) {
      const collection_operations = JSON.parse(
        getAllUsersInterface.organizational_levels
      );
      let olWhere = '';
      const params = {};
      Object.entries(collection_operations).forEach(([co_id, value], index) => {
        olWhere += olWhere ? ' OR ' : '';
        olWhere += `(bu.id = :co_id${index}`;
        params[`co_id${index}`] = co_id;
        const { recruiters } = <any>value;
        if (recruiters?.length) {
          olWhere += ` AND role.is_recruiter = true AND user.id IN (:...recruiters${index})`;
          params[`recruiters${index}`] = recruiters;
        }
        olWhere += ')';
      });
      userQuery.andWhere(`(${olWhere})`, params);
    }
    let where: any = {};
    const BusinessUnitsIds = getAllUsersInterface?.business_units
      ? Array.isArray(getAllUsersInterface?.business_units)
        ? getAllUsersInterface?.business_units
        : [getAllUsersInterface?.business_units]
      : [];
    if (BusinessUnitsIds && BusinessUnitsIds?.length > 0) {
      Object.assign(where, {
        business_units: {
          business_unit_id: {
            id: In(getAllUsersInterface?.business_units),
          },
        },
      });
    }
    let order: any = { id: 'DESC' }; // Default order

    if (getAllUsersInterface?.sortBy) {
      // Allow sorting by different columns

      if (getAllUsersInterface?.sortBy == 'assigned_manager') {
        const orderDirection = getAllUsersInterface.sortOrder || 'DESC';
        order = { assigned_manager: { first_name: orderDirection } };
      } else if (getAllUsersInterface?.sortBy == 'role') {
        const orderDirection = getAllUsersInterface.sortOrder || 'DESC';
        order = { role: { name: orderDirection } };
      } else if (getAllUsersInterface?.sortBy == 'business_unit') {
        const orderDirection = getAllUsersInterface.sortOrder || 'DESC';
        order = {
          business_units: { business_unit_id: { name: orderDirection } },
        };
      } else if (getAllUsersInterface?.sortBy == 'hierarchy_level') {
        const orderDirection = getAllUsersInterface.sortOrder || 'DESC';
        order = { hierarchy_level: { name: orderDirection } };
      } else {
        const orderBy = getAllUsersInterface.sortBy;
        const orderDirection = getAllUsersInterface.sortOrder || 'DESC';
        order = { [orderBy]: orderDirection };
      }
    }
    if (
      getAllUsersInterface?.status !== undefined &&
      getAllUsersInterface?.status !== '' &&
      getAllUsersInterface?.status !== 'undefined'
    ) {
      userQuery.andWhere('user.is_active = :status', {
        status: getAllUsersInterface?.status,
      });
    }
    if (getAllUsersInterface?.sortBy) {
      const sortByMap = {
        assigned_manager: 'manager.first_name',
        role: 'role.name',
        business_unit: 'bu.name',
        hierarchy_level: 'ol.name',
      };
      const sortName = sortByMap[getAllUsersInterface.sortBy];
      userQuery.orderBy({
        [sortName ? sortName : `user.${getAllUsersInterface.sortBy}`]:
          getAllUsersInterface.sortOrder === 'DESC' ? 'DESC' : 'ASC',
      });
    }
    if (limit && page) {
      const { skip, take } = pagination(page, limit);
      userQuery.limit(take).offset(skip);
    }

    if (getAllUsersInterface?.assignedManager) {
      Object.assign(where, {
        assigned_manager: {
          id: getAllUsersInterface?.assignedManager,
        },
      });
    }
    if (user) {
      // where = { ...where, is_archived: false, tenant: { id: user?.tenant?.id }, unique_identifier: Not(IsNull()) };
      where = {
        ...where,
        is_archived: false,
        tenant: {
          id: getAllUsersInterface.tenant_id
            ? getAllUsersInterface.tenant_id
            : user?.tenant?.id,
        },
      };
    }
    const query = [];
    if (getAllUsersInterface?.keyword) {
      query[0] = {
        ...where,
        first_name: ILike(`%${getAllUsersInterface?.keyword}%`),
      };
      query[1] = {
        ...where,
        last_name: ILike(`%${getAllUsersInterface?.keyword}%`),
      };
      query[2] = {
        ...where,
        email: ILike(`%${getAllUsersInterface?.keyword}%`),
      };
      query[3] = {
        ...where,
        mobile_number: ILike(
          `%${getAllUsersInterface?.keyword.replace(/%/g, ' ')}%`
        ),
      };
      query[4] = {
        ...where,
        role: { name: ILike(`%${getAllUsersInterface?.keyword}%`) },
      };
      query[5] = {
        ...where,
        assigned_manager: {
          first_name: ILike(`%${getAllUsersInterface?.keyword}%`),
        },
      };
      where = query;
    }
    let records: any = [];
    let count: any;
    if (getAllUsersInterface?.fetchAll) {
      [records, count] = await this.userRepository.findAndCount({
        where,
        order,
        relations: [
          'role',
          'tenant',
          'assigned_manager',
          'business_units',
          'business_units.business_unit_id',
          'hierarchy_level',
        ],
      });
    } else {
      [records, count] = await this.userRepository.findAndCount({
        where,
        skip: (page - 1) * limit || 0,
        take: limit,
        order,
        relations: [
          'role',
          'tenant',
          'assigned_manager',
          'business_units',
          'business_units.business_unit_id',
          'hierarchy_level',
        ],
      });
    }

    const newRecordType: (User & { roleName?: string })[] = [];
    for (const user of records) {
      const roleData = await this.rolesRepository.findOneBy({
        id: user?.id,
      });
      delete user.password;
      newRecordType.push({ ...user, roleName: roleData?.name });
    }

    return { total_records: count, page_number: page, data: newRecordType };
  }

  async getManagers(user = null) {
    try {
      let where: any = {
        is_archived: false,
        is_manager: true,
        is_active: true,
        is_impersonateable_user: false,
      };
      if (user) {
        where = {
          ...where,
          account_state: true,
          tenant: { id: user?.tenant?.id },
        };
      }
      const managerData: any = await this.userRepository.find({
        where,
        relations: ['tenant'],
      });

      return resSuccess(
        SuccessConstants.SUCCESS,
        'Mangers found successfully',
        HttpStatus.OK,
        managerData
      );
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< User get manager >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async deleteUser(id: any, subdomain: string, req: any) {
    const user = await this.userRepository.findOne({
      where: { id, is_archived: false },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    } else if (user.role.is_auto_created) {
      throw new HttpException(
        'You cannot archive tenant admin',
        HttpStatus.FORBIDDEN
      );
    }

    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      const user = await this.userRepository.findOne({
        where: { id, is_archived: false },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await queryRunner.connect();
      await queryRunner.startTransaction();

      user.is_archived = true;
      await queryRunner.manager.save(user);
      await this.saveUserHistory(
        {
          ...user,
          created_by: req?.user?.id,
          history_reason: 'D',
        },
        queryRunner
      );

      await archiveKeyCloakUser(subdomain, user);

      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'User Archived.',
        status_code: 204,
      };
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getUser(id: any) {
    try {
      const user = await this.userRepository.findOne({
        where: { id, is_archived: false },
        relations: [
          'role',
          'created_by',
          'assigned_manager',
          'business_units',
          'business_units.business_unit_id',
          'hierarchy_level',
          'tenant',
        ],
      });

      delete user?.password;
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const modifiedData: any = await getModifiedDataDetails(
        this.userHistoryRepository,
        id,
        this.userRepository
      );
      // const data ={...user,...modifiedData}
      return resSuccess(
        SuccessConstants.SUCCESS,
        'User found Successfully',
        HttpStatus.OK,
        { ...user, ...modifiedData }
      );
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< User getUser >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getCurrentUser(id: any) {
    const user = await this.userRepository.findOne({
      where: { id, is_archived: false },
      relations: [
        'role',
        'created_by',
        'assigned_manager',
        'business_units',
        'business_units.business_unit_id',
        'hierarchy_level',
      ],
    });

    delete user?.password;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const modifiedData: any = await getModifiedDataDetails(
      this.userHistoryRepository,
      id,
      this.userRepository
    );

    return resSuccess(
      SuccessConstants.SUCCESS,
      'User found Successfully',
      HttpStatus.OK,
      { ...user, ...modifiedData }
    );
  }

  async searchUsers(searchInterface: SearchInterface) {
    try {
      const limit: number = searchInterface?.limit
        ? +searchInterface?.limit
        : process.env.PAGE_SIZE
        ? +process.env.PAGE_SIZE
        : 10;
      const page = searchInterface?.page ? +searchInterface?.page : 1;

      const where = [
        {
          email: ILike(`%${searchInterface?.search}%`),
          first_name: ILike(`%${searchInterface?.search}%`),
          last_name: ILike(`%${searchInterface?.search}%`),
        },

        { is_archived: false },
        { is_impersonateable_user: false },
        { unique_identifier: Not(IsNull()) },
      ];

      const [records, count] = await this.userRepository.findAndCount({
        where,
        skip: (page - 1) * limit || 0,
        take: limit,
        relations: ['role'],
      });

      return { total_records: count, page_number: page, data: records };
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< User search user >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async update(userInterface: any, subdomain: string, req: any) {
    const userId = userInterface?.id;
    const user: any = await this.userRepository.findOne({
      where: { id: userId, is_archived: false },
      relations: [
        'created_by',
        'role',
        'business_units',
        'business_units.business_unit_id',
      ],
    });
    const userBusinessUnitIds = user?.business_units?.map(
      (bu) => bu.business_unit_id.id
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (userInterface?.existingTenantRoleId) {
      const user = await this.userRepository.findOne({
        where: {
          id: userInterface?.existingTenantRoleUserId,
          is_archived: false,
        },
        relations: ['created_by', 'role', 'tenant'],
      });

      subdomain = (user.tenant as any).admin_domain;
      subdomain = subdomain?.split('/')?.[2]?.split('.')?.[0];

      const updatedTenantAdminUser = {
        ...user,
        role: userInterface?.existingTenantRoleId,
        is_auto_created: false,
      };

      await this.userRepository.update(
        { id: userInterface?.existingTenantRoleUserId },
        { ...updatedTenantAdminUser }
      );
    }

    if (userInterface?.role) {
      const roleData = await this.rolesRepository.findOne({
        where: { id: userInterface?.role, is_archived: false },
      });
      const isTenantAdminExists = await this.userRepository.exist({
        where: {
          id: Not(userId),
          is_archived: false,
          role: {
            id: userInterface?.role,
          },
        },
      });

      if (!roleData) {
        throw new NotFoundException('Role not found');
      } else if (roleData.is_auto_created && isTenantAdminExists) {
        throw new NotFoundException(
          `There can be only one ${roleData.name} in each tenant.`
        );
      }
    }

    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      const userId = userInterface?.id;
      const user = await this.userRepository.findOne({
        where: { id: userId, is_archived: false },
        relations: ['created_by', 'role'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (userInterface?.role) {
        const roleData = await this.rolesRepository.findOne({
          where: { id: userInterface?.role, is_archived: false },
        });

        if (!roleData) {
          throw new NotFoundException('Role not found');
        }
      }

      if (userInterface?.business_unit) {
        const businessData = await this.businessRepository.findOne({
          where: { id: userInterface?.business_unit },
        });

        if (!businessData) {
          throw new NotFoundException('Business not found');
        }
      }

      await queryRunner.connect();
      await queryRunner.startTransaction();

      const updatedUser = {
        // updated_by: userInterface?.updated_by,
        first_name: userInterface?.first_name,
        last_name: userInterface?.last_name,
        last_permissions_updated: new Date(),
        date_of_birth: userInterface?.date_of_birth,
        gender: userInterface?.gender,
        home_phone_number: userInterface?.home_phone_number,
        work_phone_number: userInterface?.work_phone_number,
        work_phone_extension: userInterface?.work_phone_extension,
        address_line_1: userInterface?.address_line_1,
        address_line_2: userInterface?.address_line_2,
        zip_code: userInterface?.zip_code,
        city: userInterface?.city,
        state: userInterface?.state,
        is_active: userInterface?.is_active,
        all_hierarchy_access: userInterface?.all_hierarchy_access,
        role: userInterface?.role,
        mobile_number: userInterface?.mobile_number,
        is_manager: userInterface?.is_manager,
        hierarchy_level: userInterface?.hierarchy_level,
        assigned_manager: userInterface?.assigned_manager,
        override: userInterface?.override,
        adjust_appointment_slots: userInterface?.adjust_appointment_slots,
        resource_sharing: userInterface?.resource_sharing,
        edit_locked_fields: userInterface?.edit_locked_fields,
        account_state: userInterface?.account_state,
        is_auto_created: userInterface?.existingTenantRoleId ? true : false,
        // updated_at: new Date(),
      };
      await this.userRepository.update({ id: userId }, { ...updatedUser });

      await this.saveUserHistory({
        ...user,
        created_by: req?.user?.id,
        history_reason: 'C',
      });

      const where: any = {
        is_archived: false,
        user_id: { id: userId },
        business_unit_id: { id: Not(In(userInterface?.business_units)) },
      };

      const businessUnitsToRemove: any =
        await this.userBusinessUnitsRepository.find({
          where: where,
          relations: ['business_unit_id', 'user_id'],
        });

      let promises = [];
      for (const businessUnitToRemove of businessUnitsToRemove) {
        promises.push(
          queryRunner.manager.getRepository(UserBusinessUnitsHistory).insert({
            ...businessUnitToRemove,
            history_reason: HistoryReason.D,
            business_unit_id: businessUnitToRemove.business_unit_id.id,
            user_id: businessUnitToRemove.user_id.id,
            created_by: req?.user?.id,
          })
        );
      }
      await Promise.all(promises);

      await queryRunner.manager
        .getRepository(UserBusinessUnits)
        .remove(businessUnitsToRemove);

      promises = [];
      for (const businessUnit of userInterface?.business_units) {
        if (!userBusinessUnitIds.includes(businessUnit)) {
          const newUserBusinessUnits = new UserBusinessUnits();
          newUserBusinessUnits.user_id = userId;
          newUserBusinessUnits.business_unit_id = businessUnit;
          newUserBusinessUnits.created_by = req?.user?.id;
          promises.push(
            queryRunner.manager
              .getRepository(UserBusinessUnits)
              .insert(newUserBusinessUnits)
          );
        }
      }
      await Promise.all(promises);

      await updateKeyCloakUser(subdomain, user.email, updatedUser);

      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Changes Saved.',
        status_code: 204,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< User update >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async updateManager(userInterface: any, subdomain: string, userData: any) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      const userId = userInterface?.id;
      const user = await this.userRepository.findOne({
        where: { id: userId, is_archived: false },
        relations: ['created_by', 'role'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await queryRunner.connect();
      await queryRunner.startTransaction();

      const updatedUser = {
        assigned_manager: userInterface?.assigned_manager,
      };

      await this.userRepository.update({ id: userId }, { ...updatedUser });

      await this.saveUserHistory({
        ...user,
        created_by: userData?.id,
        history_reason: 'C',
      });

      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Changes Saved.',
        status_code: 204,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to update user data.');
    } finally {
      await queryRunner.release();
    }
  }

  async updatePassword(
    id: any,
    resetPasswordInterface: ResetPasswordInterface,
    subdomain: string,
    req: any
  ) {
    console.log({ resetPasswordInterface, subdomain });
    const userId = id;
    const user: any = await this.userRepository.findOne({
      where: { id: userId, is_archived: false },
      relations: ['tenant'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const url = user?.tenant?.admin_domain;
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.');
    const keycloakDomain = parts.length > 3 ? parts[1] : parts[0];
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      const userId = id;
      const user: any = await this.userRepository.findOne({
        where: { id: userId, is_archived: false },
        relations: ['tenant'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      const url = user?.tenant?.admin_domain;
      const hostname = new URL(url).hostname;
      const parts = hostname.split('.');
      const keycloakDomain = parts.length > 3 ? parts[1] : parts[0];
      console.log({ keycloakDomain, hostname, parts });

      await queryRunner.connect();
      await queryRunner.startTransaction();
      const passwordHash = await bcrypt.hash(
        resetPasswordInterface.password,
        +process.env.BCRYPT_SALT_ROUNDS ?? 10
      );
      await this.userRepository.update(
        { id: userId },
        {
          password: passwordHash,
          // updated_by:resetPasswordInterface?.updated_by
        }
      );
      await this.saveUserHistory({
        ...user,
        created_by: req?.user?.id,
        history_reason: 'C',
      });

      // const tenant: Tenant = await this.tenantRepository.findOne({where: {id: user?.tenant?.id}});
      // subdomain = getSubdomain(tenant?.admin_domain) ?? subdomain;
      await updateKeyCloakPassword(
        keycloakDomain,
        user.keycloak_username,
        resetPasswordInterface.password
      );

      await queryRunner.commitTransaction();
      // Return a success response
      return {
        status: 'success',
        response: 'Changes Saved.',
        status_code: 204,
      };
    } catch (error) {
      // Rollback the transaction in case of any errors
      await queryRunner.rollbackTransaction();
      console.log(error);

      throw new InternalServerErrorException('Failed to update user data.');
    } finally {
      // Release the queryRunner, whether the transaction succeeded or failed
      await queryRunner.release();
    }
  }

  async updateAccountSate(id: any, accountState) {
    try {
      const user = await this.userRepository.findOne({
        where: { id, is_archived: false },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.account_state = accountState?.account_state;
      await this.userRepository.save(user);
      return resSuccess(
        'Resource update',
        SuccessConstants.SUCCESS,
        HttpStatus.NO_CONTENT,
        null
      );
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< User update account state >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async saveUserHistory(user: any, queryRunner: QueryRunner = null) {
    try {
      const userHistory = new UserHistory();
      userHistory.id = user?.id;
      userHistory.first_name = user?.first_name;
      userHistory.last_name = user?.last_name;
      userHistory.unique_identifier = user?.unique_identifier;
      userHistory.email = user?.email;
      userHistory.date_of_birth = user?.date_of_birth;
      userHistory.gender = user?.gender;
      userHistory.home_phone_number = user?.home_phone_number;
      userHistory.work_phone_number = user?.work_phone_number;
      userHistory.work_phone_extension = user?.work_phone_extension;
      userHistory.address_line_1 = user?.address_line_1;
      userHistory.address_line_2 = user?.address_line_2;
      userHistory.zip_code = user?.zip_code;
      userHistory.city = user?.city;
      userHistory.state = user?.state;
      userHistory.password = user?.password;
      userHistory.is_active = user?.is_active;
      userHistory.all_hierarchy_access = user?.all_hierarchy_access;
      userHistory.history_reason = user?.history_reason;
      userHistory.created_by = user?.created_by;
      userHistory.role = user?.role?.id;
      userHistory.mobile_number = user?.mobile_number;
      userHistory.is_manager = user?.is_manager;
      userHistory.hierarchy_level = user?.hierarchy_level;
      userHistory.assigned_manager = user?.assigned_manager;
      userHistory.override = user?.override;
      userHistory.adjust_appointment_slots = user?.adjust_appointment_slots;
      userHistory.resource_sharing = user?.resource_sharing;
      userHistory.edit_locked_fields = user?.edit_locked_fields;
      userHistory.account_state = user?.account_state;

      if (queryRunner) await queryRunner.manager.save(userHistory);
      else await this.userHistoryRepository.save(userHistory);
    } catch (error) {
      throw new Error(error);
    }
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
  findDeletedUser(email: string) {
    return this.userRepository.findOne({
      withDeleted: true,
      where: { email, deleted_at: Not(IsNull()) },
    });
  }
  async findByKCUsername(username: string) {
    try {
      const user: any = await this.userRepository.findOne({
        where: { keycloak_username: username },
        relations: ['tenant', 'role'],
      });
      let permissions: any = [];
      if (user?.role?.id) {
        permissions = await this.permissionsRepository.find({
          where: {
            rolePermissions: {
              role: {
                id: user.role.id,
              },
            },
          },
          relations: ['rolePermissions.role', 'application', 'module'],
        });
      }
      const module = [],
        application = [];
      if (permissions?.length) {
        permissions = permissions.map((permission) => {
          if (permission?.module) {
            const mod = module.find((mod) => mod === permission?.module?.code);
            if (!mod) {
              module.push(permission?.module?.code);
            }
          }
          if (permission?.application) {
            const app = application.find(
              (app) => app === permission?.application?.name
            );
            if (!app) {
              application.push(permission?.application?.name);
            }
          }
          return permission.code;
        });
      }
      user.permissions = permissions;
      user.application = application;
      user.module = module;
      // console.log({ permissions });
      return user;
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< User findByKCUsername >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log(error);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  async getRecruiters(user = null) {
    try {
      let where: any = {
        is_archived: false,
        is_active: true,
        is_impersonateable_user: false,
      };
      if (user) {
        where = {
          ...where,
          tenant: { id: user?.tenant?.id },
          role: { is_recruiter: true, is_active: true, is_archived: false },
        };
      }

      const managerData: any = await this.userRepository.find({
        where,
        relations: [
          'tenant',
          'role',
          'business_units',
          'business_units.business_unit_id',
        ],
      });

      return resSuccess(
        SuccessConstants.SUCCESS,
        'Recruiter found successfully',
        HttpStatus.OK,
        managerData
      );
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< User get recruiter >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getBusinessUnitRecruiters(user = null, id = null) {
    try {
      const userData: any = await this.userRepository.findOne({
        where: {
          id: user?.id,
        },
        relations: [
          'role',
          'tenant',
          'assigned_manager',
          'business_units',
          'business_units.business_unit_id',
          'hierarchy_level',
        ],
      });
      const where: any = { is_archived: false, is_active: true };
      const userBusinessUnitIds = userData?.business_units?.map(
        (bu) => bu.business_unit_id.id
      );

      let businessUnitId = id && id !== 'undefined' ? id : null;
      let businessUnitIds: any = [];

      if (businessUnitId) {
        businessUnitIds.push(businessUnitId);

        while (true) {
          const businessUnitData = await this.businessRepository.findOne({
            where: {
              ...where,
              tenant_id: { id: userData?.tenant?.id },
              id: businessUnitId,
            },
            relations: ['parent_level', 'tenant_id', 'organizational_level_id'],
          });
          if (businessUnitData && businessUnitData?.parent_level) {
            if (
              businessUnitData?.parent_level?.id !== userData?.business_unit?.id
            ) {
              businessUnitId = businessUnitData?.parent_level?.id;
              businessUnitIds.push(businessUnitId);
            } else {
              businessUnitIds.push(businessUnitData?.parent_level?.id);
              break;
            }
          } else {
            // businessUnitIds = [];
            break;
          }
        }
      } else if (userBusinessUnitIds.length) {
        let parentBusinessUnits = userBusinessUnitIds;
        businessUnitIds = userBusinessUnitIds;

        while (true) {
          const businessUnitData = await this.businessRepository.find({
            where: {
              ...where,
              tenant_id: { id: userData?.tenant?.id },
              parent_level: In(parentBusinessUnits),
            },
            relations: ['parent_level', 'tenant_id', 'organizational_level_id'],
          });
          const businessUnitMappedIds = businessUnitData.map(
            (businessUnit) => businessUnit.id
          );
          if (
            businessUnitData.length &&
            !businessUnitMappedIds.some((bu) => businessUnitIds.includes(bu))
          ) {
            businessUnitIds = businessUnitIds.concat(businessUnitMappedIds);
            const collectionOperations = businessUnitData.map(
              (businessUnit) =>
                businessUnit.organizational_level_id.is_collection_operation
            );
            if (collectionOperations.includes(true)) {
              break;
            } else {
              parentBusinessUnits = businessUnitIds;
            }
          } else {
            break;
          }
        }
      }

      const recruiters: any = await this.userRepository.find({
        where: {
          ...where,
          role: { is_recruiter: true },
          tenant: { id: userData?.tenant?.id },
          is_impersonateable_user: false,
          business_units: {
            business_unit_id: {
              id: In(businessUnitIds),
            },
          },
        },
        relations: [
          'role',
          'tenant',
          'assigned_manager',
          'business_units',
          'business_units.business_unit_id',
          'hierarchy_level',
        ],
      });

      return resSuccess(
        SuccessConstants.SUCCESS,
        'Recruiters fetched.',
        HttpStatus.OK,
        recruiters
      );
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< User getBusinessUnitRecruiters >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getAllUsers(user = null) {
    try {
      let where: any = {
        is_archived: false,
        is_active: true,
        is_impersonateable_user: false,
      };
      if (user) {
        where = { ...where, tenant: { id: user?.tenant?.id } };
      }
      const usersData: any = await this.userRepository.find({
        where,
        relations: ['tenant'],
      });

      return resSuccess(
        SuccessConstants.SUCCESS,
        'Users found successfully',
        HttpStatus.OK,
        usersData
      );
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< User get all >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getOwner(user: any, id: any) {
    try {
      const collectionOperations = id.split(',');
      const BusinessData: any = await this.businessRepository.find({
        where: {
          id: In(collectionOperations),
        },
        relations: ['parent_level', 'tenant_id', 'organizational_level_id'],
      });
      const where: any = { is_archived: false, is_active: true };
      let owners: any = [];

      let parentIds: any = id.split(',');
      if (BusinessData) {
        const parentBusinessUnits = BusinessData.map(
          (item) => item.parent_level
        );
        parentIds.push(...BusinessData.map((item) => item.parent_level.id));
        for (const item of parentBusinessUnits) {
          let currentParentLevel = item;
          while (currentParentLevel !== null) {
            const businessUnitData = await this.businessRepository.findOne({
              where: {
                ...where,
                tenant_id: { id: user?.tenant?.id },
                id: currentParentLevel?.id,
              },
              relations: [
                'parent_level',
                'tenant_id',
                'organizational_level_id',
              ],
            });
            if (businessUnitData.parent_level !== null) {
              parentIds = parentIds.concat(businessUnitData?.parent_level?.id);
              currentParentLevel = businessUnitData?.parent_level;
            } else {
              break;
            }
          }
        }
        const uniqueParentIds = Array.from(new Set(parentIds));
        owners = await this.userRepository.find({
          where: {
            ...where,
            is_impersonateable_user: false,
            tenant: { id: user?.tenant?.id },
            business_units: {
              business_unit_id: {
                id: In(uniqueParentIds),
              },
            },
          },
          relations: [
            'tenant',
            'business_units',
            'business_units.business_unit_id',
            'hierarchy_level',
          ],
        });
      }

      return resSuccess(
        SuccessConstants.SUCCESS,
        'Recruiters fetched.',
        HttpStatus.OK,
        owners
      );
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< User get owner >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getCollectionOperationOwner(user: any, id: any) {
    try {
      const businessUnitsData: any = await this.businessRepository.findOne({
        where: {
          id: id,
        },
        relations: ['organizational_level_id'],
      });
      const where: any = { is_archived: false, is_active: true };
      let owners: any = [];

      const parentIds: any = [id];

      if (businessUnitsData?.organizational_level_id?.is_collection_operation) {
        owners = await this.userRepository.find({
          where: {
            ...where,
            tenant: { id: user?.tenant?.id },
            business_unit: {
              id: In(parentIds),
            },
          },
          relations: ['tenant', 'business_unit'],
        });
      } else {
        const childOrganizationLevels =
          await this.organizationalLevelRepository.find({
            where: {
              parent_level: {
                id: businessUnitsData?.organizational_level_id?.id,
              },
            },
            relations: ['parent_level'],
          });

        const childOrganizationLevelIds = childOrganizationLevels.map(
          (level) => level.id
        );

        const businessUnits = await this.businessRepository.find({
          where: {
            organizational_level_id: {
              id: In(childOrganizationLevelIds),
            },
          },
          relations: ['organizational_level_id'],
        });

        const businessUnitsIds = businessUnits.map((level) => level.id);
        owners = await this.userRepository.find({
          where: {
            ...where,
            tenant: { id: user?.tenant?.id },
            business_unit: {
              id: In(businessUnitsIds),
            },
          },
          relations: ['tenant', 'business_unit'],
        });
      }

      return resSuccess(
        SuccessConstants.SUCCESS,
        'Owners fetched.',
        HttpStatus.OK,
        owners
      );
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< User get collection operation owner >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const workEmail = email?.trim()?.toLowerCase();
      const user = await this.userRepository.findOne({
        where: { email: workEmail, is_archived: false },
        relations: [
          'role',
          'created_by',
          'assigned_manager',
          'business_units',
          'business_units.business_unit_id',
          'hierarchy_level',
        ],
      });
      delete user?.password;
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const userId = Number(user.id);
      const modifiedData: any = await getModifiedDataDetails(
        this.userHistoryRepository,
        userId,
        this.userRepository
      );
      // const data ={...user,...modifiedData}
      return resSuccess(
        SuccessConstants.SUCCESS,
        'User found Successfully',
        HttpStatus.OK,
        { ...user, ...modifiedData }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
  async getAdminUser(tenantId) {
    try {
      const tenant: any = await this.tenantRepository.findOne({
        where: {
          id: tenantId,
        },
      });
      if (!tenant) {
        throw new NotFoundException('tenant not found');
      }
      const where: any = {
        tenant: {
          id: tenant.id,
        },
        is_impersonateable_user: true,
      };
      const user = await this.userRepository.findOne({
        where,
        relations: ['tenant'],
      });
      if (!user) {
        throw new NotFoundException('Admin user not found');
      }
      // const data ={...user,...modifiedData}
      return resSuccess(
        SuccessConstants.SUCCESS,
        'Admin user found Successfully',
        HttpStatus.OK,
        user
      );
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< User getAdminUser >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}

async function createKeyCloakUser(
  realmName: string,
  password: string,
  userData: any = {}
) {
  try {
    const kcAdmin = await keyCloakAdmin();
    if (realmName) {
      const user = await kcAdmin.users.create({
        realm: realmName,
        username: userData.email.toLowerCase(),
        email: userData.email,
        enabled: true,
        attributes: userData,
      });
      await kcAdmin.users.resetPassword({
        realm: realmName,
        id: user.id,
        credential: {
          temporary: false,
          value: password,
        },
      });

      return 'User created successfully';
    } else {
      throw new Error('Provide input');
    }
  } catch (err) {
    return resError('Iternal', ErrorConstants.Error, 400);
  }
}

async function updateKeyCloakUser(
  realmName: string,
  userName: string,
  userData: any = {}
) {
  try {
    const kcAdmin = await keyCloakAdmin();
    if (realmName && userName) {
      const user = await kcAdmin.users.findOne({
        realm: realmName,
        username: userName,
      });

      if (!user) {
        throw new Error('User not found in Keycloak');
      }

      const response = await fetch(
        `${kcAdmin.baseUrl}/admin/realms/${realmName}/users/${user[0].id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${kcAdmin.accessToken}`,
          },
          body: JSON.stringify({ attributes: userData }),
        }
      );

      if (response.status === 204)
        return 'User archived successfully in Keycloak';
      else throw new Error('User not updated');
    } else {
      throw new Error('Provide input');
    }
  } catch (error) {
    console.log(
      '<<<<<<<<<<<<<<<<<<<<<<< User updating Keycloak user >>>>>>>>>>>>>>>>>>>>>>>>>'
    );
    console.error({ error });
    throw new Error('Failed to update Keycloak user.');
  }
}

async function archiveKeyCloakUser(realmName: string, user: User) {
  const kcAdmin = await keyCloakAdmin();
  if (kcAdmin) {
    try {
      const kcUser = await kcAdmin.users.findOne({
        realm: realmName,
        username: user.email,
      });
      if (kcUser) {
        const response = await fetch(
          `${kcAdmin.baseUrl}/admin/realms/${realmName}/users/${kcUser[0].id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${kcAdmin.accessToken}`,
            },
            body: JSON.stringify({ enabled: false }),
          }
        );
        if (response.status === 204)
          return 'User archived successfully in Keycloak';
        else throw new Error('User not updated');
      } else {
        throw new Error('User not found in Keycloak');
      }
    } catch (error) {
      throw error;
    }
  }
}

async function updateKeyCloakPassword(
  realmName: string,
  email: string,
  newPassword: string
) {
  const kcAdmin = await keyCloakAdmin();
  if (kcAdmin) {
    try {
      const kcUser = await kcAdmin.users.find({
        realm: realmName,
      });
      if (kcUser) {
        const existingUser = kcUser.find(
          (user: any) => user.username === email
        );
        if (!existingUser) {
          throw new Error('User not found in Keycloak');
        }

        await kcAdmin.users.resetPassword({
          realm: realmName,
          id: existingUser.id,
          credential: {
            temporary: false,
            value: newPassword,
          },
        });

        return 'User password updated successfully in Keycloak';
      } else {
        throw new Error('User not found in Keycloak');
      }
    } catch (error) {
      throw error;
    }
  }
}
