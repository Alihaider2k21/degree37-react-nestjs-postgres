import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateTenantConfigDto,
  CreateTenantDto,
} from '../dto/create-tenant.dto';
import {
  UpdateTenantConfigDto,
  UpdateTenantDto,
} from '../dto/update-tenant.dto';
import { Tenant } from '../entities/tenant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, Not, ILike, In } from 'typeorm';
import { Address } from '../entities/address.entity';
import * as bcrypt from 'bcrypt';
import { decryptSecretKey, encryptSecretKey } from '../utils/encryption';
import { TenantHistory } from '../entities/tenantHistory.entity';
import { AddressHistory } from '../entities/addressHistory.entity';
import {
  enumStatus,
  GetAllTenantInterface,
} from '../interface/tenant.interface';
import { TenantConfigurationDetail } from '../entities/tenantConfigurationDetail';
import { TenantConfigurationDetailHistory } from '../entities/tenantConfigurationDetailHistory';
import { resError } from '../../../../helpers/response';
import { SuccessConstants } from '../../../../constants/success.constants';
import { ErrorConstants } from '../../../../constants/error.constants';
import { User } from '../../../../tenants-administration/user-administration/user/entity/user.entity';
import { OrganizationalLevels } from '../../../../tenants-administration/organizational-administration/hierarchy/organizational-levels/entities/organizational-level.entity';
import { keyCloakAdmin } from '../../../../../../config/keycloak.config';
import { Applications } from '../../../roles-administration/application/entities/application.entity';
import { getModifiedDataDetails } from '../../../../../../common/utils/modified_by_detail';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { RolePermission } from '../../../roles-administration/role-permissions/entities/rolePermission.entity';
import { Permissions } from '../../../roles-administration/role-permissions/entities/permission.entity';
import { Roles } from '../../../roles-administration/role-permissions/entities/role.entity';
import { TenantRole } from '../../../roles-administration/role-permissions/entities/tenantRole.entity';
import {
  MessageType,
  createDailyStoryTenant,
  createOrUpdateCampaign,
  getDSTemplates,
  getDailyStoryTenantUsers,
  sendDSEmail,
} from 'src/api/common/services/dailyStory.service';
import { v4 as uuidv4 } from 'uuid';
import { CommunicationService } from 'src/api/crm/contacts/volunteer/communication/services/communication.service';
import { UserRequest } from 'src/common/interface/request';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(TenantHistory)
    private readonly tenantHistoryRepository: Repository<TenantHistory>,
    @InjectRepository(TenantConfigurationDetail)
    private readonly tenantConfigDetailRepository: Repository<TenantConfigurationDetail>,
    @InjectRepository(TenantConfigurationDetailHistory)
    private readonly tenantConfigDetailHistoryRepository: Repository<TenantConfigurationDetailHistory>,
    @InjectRepository(AddressHistory)
    private readonly addressHistoryREpo: Repository<AddressHistory>,
    private readonly entityManager: EntityManager,
    @InjectRepository(Applications)
    private readonly applicationRepository: Repository<Applications>,
    @InjectRepository(ContactsRoles)
    private readonly contactsRolesRepository: Repository<ContactsRoles>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    private readonly communicationService: CommunicationService,
    @Inject(REQUEST)
    private request: UserRequest
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    console.log('12345');

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const user = await this.userRepository.findOneBy({
        id: createTenantDto?.created_by,
      });
      const urlRegex = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})(\/[^\s]*)?$/;
      const tenantDomain = urlRegex.test(createTenantDto?.tenant_domain);
      if (!tenantDomain) {
        return resError(
          'Invalid tenant domain.',
          ErrorConstants.Error,
          HttpStatus.BAD_REQUEST
        );
      }

      const adminDomain = urlRegex.test(createTenantDto?.admin_domain);
      if (!adminDomain) {
        return resError(
          'Invalid admin domain.',
          ErrorConstants.Error,
          HttpStatus.BAD_REQUEST
        );
      }

      if (!user) {
        return resError(
          'User not found',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      const tenantName = await this.tenantRepository.findOne({
        where: { tenant_name: createTenantDto?.tenant_name },
      });
      if (tenantName) {
        return resError(
          'Tenant name already exists!',
          ErrorConstants.Error,
          HttpStatus.NOT_FOUND
        );
      }

      const tenantEmail = await this.tenantRepository.findOne({
        where: { email: createTenantDto?.email },
      });
      if (tenantEmail) {
        return resError(
          'Email already exists!',
          ErrorConstants.Error,
          HttpStatus.CONFLICT
        );
      }

      const tenantCode = await this.tenantRepository.findOne({
        where: { tenant_code: createTenantDto?.tenant_code },
      });

      if (tenantCode) {
        return resError(
          'Tenant code already exists!',
          ErrorConstants.Error,
          HttpStatus.CONFLICT
        );
      }

      const applications: any = await this.applicationRepository.findBy({
        id: In(createTenantDto?.applications),
      });
      if (
        applications &&
        applications?.length < createTenantDto?.applications?.length
      ) {
        throw new HttpException(
          `Some Applications not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      const passwordHash = await bcrypt.hash(
        createTenantDto.password,
        +process.env.BCRYPT_SALT_ROUNDS ?? 10
      );
      const url = createTenantDto.admin_domain;
      const hostname = new URL(url).hostname;
      const parts = hostname.split('.');
      const subdomain = parts.length > 3 ? parts[1] : parts[0];

      const tenant = new Tenant();
      // Set tenant properties from createTenantDto
      tenant.tenant_name = createTenantDto.tenant_name;
      tenant.tenant_code = createTenantDto.tenant_code;
      tenant.tenant_domain = createTenantDto.tenant_domain;
      tenant.admin_domain = createTenantDto.admin_domain;
      tenant.phone_number = createTenantDto.phone_number;
      tenant.tenant_timezone = createTenantDto.tenant_timezone;
      tenant.created_by = createTenantDto.created_by;
      tenant.is_active = createTenantDto?.is_active;
      tenant.email = createTenantDto.email.toLowerCase();
      tenant.password = passwordHash;
      tenant.allow_email = createTenantDto.allow_email;
      tenant.applications = applications;
      tenant.allow_donor_minimum_age = createTenantDto.allow_donor_minimum_age;

      // Save the tenant entity
      const savedTenant = await queryRunner.manager.save(tenant);

      // Create the address
      const address = new Address();
      // Set address properties from createTenantDto
      address.address1 = createTenantDto.address1;
      address.address2 = createTenantDto.address2;
      address.zip_code = createTenantDto.zip_code;
      address.city = createTenantDto.city;
      address.state = createTenantDto.state;
      address.country = createTenantDto.country;
      address.county = createTenantDto.county;
      address.created_by = createTenantDto.created_by;
      address.addressable_id = savedTenant.id;
      address.tenant_id = savedTenant.id;
      address.addressable_type = 'Tenant';
      if (createTenantDto.coordinates) {
        address.coordinates = `(${createTenantDto?.coordinates?.latitude}, ${createTenantDto?.coordinates?.longitude})`;
      }
      // Save the address entity
      await queryRunner.manager.save(address);

      const organizationalLevel: any = new OrganizationalLevels();
      organizationalLevel.name = 'Collection Operation';
      organizationalLevel.short_label = 'CO';
      organizationalLevel.description = '';
      organizationalLevel.is_active = true;
      organizationalLevel.created_by = createTenantDto.created_by;
      organizationalLevel.is_collection_operation = true;
      organizationalLevel.tenant = savedTenant;

      await queryRunner.manager.save(organizationalLevel);
      // Find permissions associated with applications
      const permissions: any = await this.permissionsRepository.find({
        where: {
          application: { id: In(createTenantDto?.applications) },
          is_super_admin_permission: false,
        },
        relations: ['application'],
      });
      // create admin role
      const adminRole = new Roles();
      adminRole.name = 'Tenant Admin';
      adminRole.description = 'Tenant Admin';
      adminRole.is_active = true;
      adminRole.is_auto_created = true;
      adminRole.created_by = createTenantDto.created_by;
      adminRole.tenant = savedTenant.id;
      const savedAdminRole = await queryRunner.manager.save(adminRole);
      // assign all permissions to admin role
      if (savedAdminRole && permissions?.length) {
        const rolePermission = permissions.map((permission) => {
          const rolePermissionData = new RolePermission();
          rolePermissionData.permission = permission;
          rolePermissionData.role = savedAdminRole;
          rolePermissionData.created_by = createTenantDto.created_by;
          return rolePermissionData;
        });
        await queryRunner.manager.save(RolePermission, rolePermission);
      } else {
        throw new HttpException(
          `Some Permissions not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      // create admin role
      const autoCreatedRole: any = new Roles();
      autoCreatedRole.name = 'impersonate role';
      autoCreatedRole.description = 'impersonate role';
      autoCreatedRole.is_autocreated = true;
      autoCreatedRole.is_impersonateable_role = true;
      autoCreatedRole.is_active = true;
      autoCreatedRole.created_by = createTenantDto.created_by;
      autoCreatedRole.tenant = savedTenant.id;
      const savedAutoCreatedRole = await queryRunner.manager.save(
        autoCreatedRole
      );
      // assign read permissions to admin role
      if (savedAutoCreatedRole && permissions?.length) {
        const rolePermissionsArray = [];
        const rolePermission = permissions.map((permission) => {
          if (permission?.name === 'Read') {
            const rolePermissionData = new RolePermission();
            rolePermissionData.permission = permission;
            rolePermissionData.role = savedAutoCreatedRole;
            rolePermissionData.created_by = createTenantDto.created_by;
            rolePermissionsArray.push(rolePermissionData);
            return rolePermissionData;
          }
        });
        if (rolePermissionsArray?.length) {
          await queryRunner.manager.save(RolePermission, rolePermissionsArray);
        }
        // await this.rolePermissionRepository.save(rolePermission);
      } else {
        throw new HttpException(
          `Some Permissions not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      // create tenant role
      const tenantRole = new TenantRole();
      tenantRole.role = adminRole;
      tenantRole.tenant = tenant;
      await queryRunner.manager.save(tenantRole);
      // create contact role Primary Chairperson
      const contactRole: any = new ContactsRoles();
      contactRole.name = 'Primary Chairperson';
      contactRole.description = 'Primary Chairperson';
      contactRole.staffable = true;
      contactRole.function_id = '1';
      contactRole.tenant_id = savedTenant.id;
      contactRole.average_hourly_rate = '1';
      contactRole.oef_contribution = '1';
      contactRole.impacts_oef = false;
      contactRole.created_by = createTenantDto.created_by;
      contactRole.is_primary_chairperson = true;
      await queryRunner.manager.save(contactRole);

      // create autoCreated admin user
      const adminUserData = new User();
      adminUserData.first_name = 'impersonate admin';
      adminUserData.last_name = '';
      adminUserData.password = passwordHash;
      adminUserData.email =
        'impersonateable_' + createTenantDto.email.toLowerCase();
      adminUserData.keycloak_username =
        'impersonateable_' + createTenantDto.email.toLowerCase();
      adminUserData.tenant = savedTenant.id;
      adminUserData.is_super_admin = true;
      adminUserData.role = savedAutoCreatedRole;
      adminUserData.is_impersonateable_user = true;
      // Save the user entity
      const savedAdminUser = await queryRunner.manager.save(adminUserData);
      //create tenant configuration details
      const tenantConfigData = createTenantDto?.tenant_config?.map((detail) => {
        const encryptedSecretKey = encryptSecretKey(detail?.secret_key);
        const encryptedSecretValue = encryptSecretKey(detail?.secret_value);

        const tenantConfig = new TenantConfigurationDetail();
        tenantConfig.element_name = detail?.element_name;
        tenantConfig.end_point_url = detail?.end_point_url;
        tenantConfig.secret_key = encryptedSecretKey;
        tenantConfig.secret_value = encryptedSecretValue;
        tenantConfig.tenant_id = savedTenant.id;
        tenantConfig.created_by = createTenantDto.created_by;

        return tenantConfig;
      });
      if (createTenantDto?.tenant_config) {
        await queryRunner.manager.save(
          TenantConfigurationDetail,
          tenantConfigData
        );
      }

      const realm: any = await this.createRealm(
        subdomain,
        createTenantDto.password,
        {
          email: createTenantDto.email.toLowerCase(),
          emailVerified: createTenantDto?.is_active == false ? false : true,
          attributes: {
            tenant_id: savedTenant?.id,
            is_active: savedTenant?.is_active,
            phone_number: savedTenant?.phone_number,
          },
        },
        createTenantDto.admin_domain
      );
      console.log({ realm });
      if (realm.status === 'error') {
        console.log({ realm });
        throw new HttpException(
          {
            message: realm,
            additionalData: realm, // Add your additional data here
          },
          HttpStatus.CONFLICT
        );
      }

      // Create the user
      const userData = new User();

      userData.first_name = createTenantDto.tenant_name;
      userData.last_name = '';
      userData.password = passwordHash;
      userData.email = createTenantDto.email.toLowerCase();
      userData.keycloak_username = createTenantDto.email.toLowerCase();
      userData.tenant = savedTenant.id;
      userData.is_super_admin = true;
      userData.is_auto_created = true;
      userData.role = savedAdminRole;
      // Save the user entity
      await queryRunner.manager.save(userData);

      const tenantData = await this.tenantRepository.findOne({
        where: {
          id: savedTenant.id,
        },
        relations: ['configuration_detail', 'applications'],
        order: {
          applications: {
            id: 'ASC',
          },
        },
      });

      const updatedAddress = await this.addressRepository.findOne({
        where: {
          addressable_id: savedTenant.id,
          addressable_type: 'Tenant',
        },
      });

      // ********* Sending Email to tenant *************

      const requestTenant = this.request.user.tenant;

      const emailTemplate = await getDSTemplates(
        requestTenant?.dailystory_campaign_id,
        requestTenant?.dailystory_token
      );

      await sendDSEmail(
        emailTemplate?.Response?.emails?.[0]?.emailId,
        createTenantDto.email,
        {
          email_body: `Hi ${tenant.tenant_name},

           Welcome to Degree37. Your new account comes with access to Degree37 products, apps, and services.

           Email: ${tenant.email}

           Password: ${createTenantDto.password}

           For log in to Degree37 as admin of ${tenant.tenant_name} please <a href=${tenant.admin_domain}>click here</a>

           For more information

           Please refer to the Frequently Asked Questions (FAQs).

           Thank You`,
          subject: `${tenant.tenant_name}, Welcome to Degree37`,
          from: requestTenant.email,
          messageType: MessageType.email,
        },
        requestTenant?.dailystory_token
      );
      // ********************************************************

      // );
      // return resSuccess(
      //   '', // message
      //   SuccessConstants.SUCCESS,
      //   HttpStatus.CREATED,
      //   tenantData,
      // );

      // *************** Daily Story Integration ***************
      this.createDailyStoryTenantAndCampaignService(savedTenant, userData)
        .then((res) => {
          console.log(res);
        })
        .catch((er) => console.log(er));

      await queryRunner.commitTransaction();
      return {
        status: SuccessConstants.SUCCESS,
        message: 'Tenant created Successfully',
        status_code: HttpStatus.CREATED,
        data: { ...tenantData, address: updatedAddress },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.deleteRealm(createTenantDto?.tenant_name);
      // return error
      // return resError(error.message, ErrorConstants.Error, error.status);
      return {
        status: ErrorConstants.Error,
        message: error?.message,
        status_code: error.status,
        data: error,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(getAllTenantInterface: GetAllTenantInterface): Promise<any> {
    try {
      const limit: number = getAllTenantInterface?.limit
        ? +getAllTenantInterface?.limit
        : +process.env.PAGE_SIZE;

      let page = getAllTenantInterface?.page ? +getAllTenantInterface?.page : 1;

      if (page < 1) {
        page = 1;
      }

      const where = {};
      if (getAllTenantInterface?.tenantName) {
        Object.assign(where, {
          tenant_name: ILike(`%${getAllTenantInterface?.tenantName}%`),
        });
      }

      const [response, count] = await this.tenantRepository.findAndCount({
        select: [
          'id',
          'tenant_name',
          'phone_number',
          'email',
          'tenant_domain',
          'admin_domain',
          'is_active',
        ],
        where,
        take: limit,
        skip: (page - 1) * limit,
        order: { id: 'DESC' },
      });

      return {
        status: HttpStatus.OK,
        message: 'Tenants Fetched Successfully',
        count: count,
        data: response,
      };
    } catch {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: any) {
    try {
      const tenant = await this.tenantRepository.findOne({
        where: { id },
        relations: ['configuration_detail', 'applications', 'created_by'],
        order: {
          applications: {
            id: 'ASC',
          },
        },
      });
      if (!tenant) {
        throw new HttpException(
          `Tenant not found.`,

          HttpStatus.NOT_FOUND
        );
      }

      const configuration_detail = tenant.configuration_detail.map((detail) => {
        return {
          ...detail,
          secret_key: decryptSecretKey(detail.secret_key),
          secret_value: decryptSecretKey(detail.secret_value),
        };
      });

      const modifiedData: any = await getModifiedDataDetails(
        this.tenantHistoryRepository,
        id,
        this.userRepository
      );
      console.log({ modifiedData });
      // return resSuccess(
      //   '', // message
      //   SuccessConstants.SUCCESS,
      //   HttpStatus.OK,
      //   { ...tenant, ...modifiedData, configuration_detail },
      // );

      const addresses = await this.addressRepository.find({
        where: {
          addressable_id: id,
          addressable_type: 'Tenant',
        },
      });

      return {
        status: SuccessConstants.SUCCESS,
        message: 'Tenant Found Successfully',
        status_code: HttpStatus.OK,
        data: {
          ...tenant,
          ...modifiedData,
          configuration_detail,
          addresses: addresses,
        },
      };
    } catch (error) {
      // return resError(error.message, ErrorConstants.Error, error.status);
      return {
        status: ErrorConstants.Error,
        message: error?.message,
        status_code: error.status,
        data: null,
      };
    }
  }

  async update(id: any, updateTenantDto: UpdateTenantDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    // try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Check if tenant_name already exists with a different tenant ID
      const existingTenantWithName = await this.tenantRepository.findOne({
        where: { tenant_name: updateTenantDto.tenant_name, id: Not(id) },
      });
      if (existingTenantWithName) {
        throw new HttpException(
          `Tenant with the same name already exists.`,
          HttpStatus.BAD_REQUEST
        );
      }

      // Check if tenant_code already exists with a different tenant ID
      const existingTenantWithCode = await this.tenantRepository.findOne({
        where: { tenant_code: updateTenantDto?.tenant_code, id: Not(id) },
      });
      if (existingTenantWithCode) {
        throw new HttpException(
          `Tenant with the same code already exists.`,
          HttpStatus.BAD_REQUEST
        );
      }
      const urlRegex = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})(\/[^\s]*)?$/;
      const tenantDomain = urlRegex.test(updateTenantDto?.tenant_domain);
      if (!tenantDomain) {
        throw new HttpException(
          `Invalid tenant domain.`,
          HttpStatus.BAD_REQUEST
        );
      }

      const adminDomain = urlRegex.test(updateTenantDto?.admin_domain);
      if (!adminDomain) {
        throw new HttpException(
          `Invalid admin domain.`,
          HttpStatus.BAD_REQUEST
        );
      }

      const tenant = await this.tenantRepository.findOneBy({
        id: id,
      });

      if (!tenant) {
        throw new HttpException(`Tenant not found.`, HttpStatus.NOT_FOUND);
      }

      const applications: any = await this.applicationRepository.findBy({
        id: In(updateTenantDto?.applications),
      });
      if (
        applications &&
        applications?.length < updateTenantDto?.applications?.length
      ) {
        throw new HttpException(
          `Some Applications not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      const autoCreatedAdminRoleCondition: any = {
        tenant: {
          id: id,
        },
        is_autocreated: true,
        is_impersonateable_role: true,
      };
      const autoCreatedAdminRole: any = await this.rolesRepository.findOne({
        where: autoCreatedAdminRoleCondition,
        relations: ['tenant', 'created_by'],
      });
      if (autoCreatedAdminRole && applications && applications?.length) {
        // Find permissions associated with applications
        const permissions: any = await this.permissionsRepository.find({
          where: {
            application: { id: In(updateTenantDto?.applications) },
            is_super_admin_permission: false,
          },
          relations: ['application'],
        });
        // update permissions according to new applications
        if (permissions && permissions.length > 0) {
          const permissionsIds = permissions.map((per) => {
            return per.id;
          });
          await this.updateRolePermissions(
            autoCreatedAdminRole,
            permissionsIds
          );
        }
      }
      const user = await this.userRepository.findOneBy({
        id: updateTenantDto?.created_by,
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const address = await this.addressRepository.findOneBy({
        id: updateTenantDto?.address_id,
      });

      if (!address) {
        throw new HttpException(`Address not found.`, HttpStatus.NOT_FOUND);
      }

      const updatedAddressData = {
        ...address,
        ...updateTenantDto,
      };
      address.address1 = updatedAddressData?.address1;
      address.address2 = updatedAddressData?.address2;
      address.zip_code = updatedAddressData?.zip_code;
      address.city = updatedAddressData?.city;
      address.state = updatedAddressData?.state;
      address.country = updatedAddressData?.country;
      if (updateTenantDto.coordinates) {
        address.coordinates = `(${updateTenantDto?.coordinates?.latitude}, ${updateTenantDto?.coordinates?.longitude})`;
      }

      const updatedAddress = await this.addressRepository.save(address);
      if (updatedAddress) {
        const action = 'C';
        await this.updateAddressHistory(
          { ...address, created_by: user?.id, tenant_id: id },
          action
        ).catch((error) => {
          throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        });
      }

      const updatedTenantData = {
        ...tenant,
        ...updateTenantDto,
      };

      tenant.tenant_name = updatedTenantData.tenant_name;
      tenant.tenant_domain = updatedTenantData.tenant_domain;
      tenant.admin_domain = updatedTenantData.admin_domain;
      tenant.tenant_code = updatedTenantData.tenant_code;
      tenant.tenant_timezone = updatedTenantData.tenant_timezone;
      tenant.phone_number = updatedTenantData.phone_number;
      tenant.is_active = updatedTenantData.is_active;
      tenant.allow_email = updatedTenantData.allow_email;
      tenant.applications = applications;
      tenant.allow_donor_minimum_age =
        updatedTenantData.allow_donor_minimum_age;
      // tenant.updated_by = updateTenantDto?.updated_by
      const updatedTenant = await this.tenantRepository.save(tenant);

      if (updatedTenant) {
        const action = 'C';
        await this.updateTenantHistory(
          { ...tenant, created_by: updateTenantDto?.updated_by },
          action
        ).catch((error) => {
          throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        });
      }

      if (updateTenantDto?.tenant_config?.length) {
        await Promise.all(
          updateTenantDto?.tenant_config?.map(async (tenantConfig) => {
            const userExist = await this.userRepository.findOneBy({
              id: tenantConfig?.created_by,
            });

            if (!userExist) {
              throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
            }

            if (!tenantConfig?.id) {
              //create tenant configuration details
              const encryptedSecretKey = encryptSecretKey(
                tenantConfig?.secret_key
              );
              const encryptedSecretValue = encryptSecretKey(
                tenantConfig?.secret_value
              );
              const tenantConfigDetail = new TenantConfigurationDetail();
              tenantConfigDetail.element_name = tenantConfig?.element_name;
              tenantConfigDetail.end_point_url = tenantConfig?.end_point_url;
              tenantConfigDetail.secret_key = encryptedSecretKey;
              tenantConfigDetail.secret_value = encryptedSecretValue;
              tenantConfigDetail.tenant_id = tenant.id;
              tenantConfigDetail.created_by = userExist.id;

              await this.tenantConfigDetailRepository.save(tenantConfigDetail);
            } else {
              const tenantConfigData =
                await this.tenantConfigDetailRepository.findOne({
                  where: {
                    id: tenantConfig?.id,
                  },
                });

              if (tenantConfigData) {
                const configDetailData = {
                  ...(tenantConfig?.element_name && {
                    element_name: tenantConfig.element_name,
                  }),
                  ...(tenantConfig?.end_point_url && {
                    end_point_url: tenantConfig.end_point_url,
                  }),
                  ...(tenantConfig?.secret_key && {
                    secret_key: encryptSecretKey(tenantConfig.secret_key),
                  }),
                  ...(tenantConfig?.secret_value && {
                    secret_value: encryptSecretKey(tenantConfig.secret_value),
                  }),
                };

                tenantConfigData.element_name = configDetailData?.element_name;
                tenantConfigData.end_point_url =
                  configDetailData?.end_point_url;
                tenantConfigData.secret_key = configDetailData?.secret_key;
                tenantConfigData.secret_value = configDetailData?.secret_value;

                const updatedConfigData =
                  await this.tenantConfigDetailRepository.save(
                    tenantConfigData
                  );

                if (updatedConfigData) {
                  const action = 'C';
                  await this.updateTenantConfigDetailHistory(
                    {
                      ...tenantConfigData,
                      created_by: userExist?.id,
                      tenant_id: tenant?.id,
                    },
                    action
                  ).catch((error) => {
                    throw new HttpException(
                      error.message,
                      HttpStatus.INTERNAL_SERVER_ERROR
                    );
                  });
                }
              }
            }
          })
        );
      }

      await queryRunner.commitTransaction();
      const tenantresponse = await this.tenantRepository.findOne({
        where: {
          id: tenant.id,
        },
        relations: ['configuration_detail', 'applications'],
        order: {
          applications: {
            id: 'ASC',
          },
        },
      });
      const addresses = await this.addressRepository.find({
        where: {
          addressable_id: id,
          addressable_type: 'Tenant',
        },
      });
      // return resSuccess(
      //   '', // message
      //   SuccessConstants.SUCCESS,
      //   HttpStatus.CREATED,
      //   tenantresponse,
      // );

      return {
        status: SuccessConstants.SUCCESS,
        message: 'Tenant updated Successfully',
        status_code: HttpStatus.OK,
        data: { ...tenantresponse, addresses },
      };
    } catch (error) {
      console.log({ error });
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }

  async addTenantConfig(
    id: bigint,
    createTenantConfigDto: CreateTenantConfigDto
  ) {
    const tenant = await this.tenantRepository.findOneBy({
      id: id,
    });
    if (!tenant) {
      throw new HttpException(`Tenant not found.`, HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOneBy({
      id: createTenantConfigDto?.created_by,
    });
    if (!user) {
      throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
    }

    let configDetail = [];
    configDetail = await Promise.all(
      createTenantConfigDto?.configuration_detail?.map(async (detail) => {
        const encryptedSecretKey = encryptSecretKey(detail?.secret_key);
        const encryptedSecretValue = encryptSecretKey(detail?.secret_value);
        const user = await this.userRepository.findOneBy({
          id: detail?.created_by,
        });
        if (!user) {
          throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
        }
        return {
          element_name: detail?.element_name,
          end_point_url: detail?.end_point_url,
          secret_key: encryptedSecretKey,
          secret_value: encryptedSecretValue,
          created_by: detail?.created_by,
          tenant_id: tenant.id,
        };
      })
    );

    await this.tenantConfigDetailRepository.save(configDetail);

    const latestConfigDetails = await this.tenantRepository.findOne({
      where: {
        id: tenant.id,
      },
      relations: ['configuration_detail'],
    });

    return {
      status: 'success',
      response: 'Changes Saved Successfully',
      response_code: 201,
      data: { ...tenant, configuration_detail: latestConfigDetails },
    };
  }

  async updateTenantConfig(
    id: any,
    updateTenantConfigDto: UpdateTenantConfigDto
  ) {
    const tenant = await this.tenantRepository.findOneBy({
      id: id,
    });

    if (!tenant) {
      throw new HttpException(`Tenant not found.`, HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOneBy({
      id: updateTenantConfigDto?.created_by,
    });

    if (!user) {
      throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
    }

    const updatedTenantConfig = await this.tenantRepository.update(
      { id: id },
      {
        ...tenant,
        allow_email: updateTenantConfigDto.allow_email,
      }
    );

    if (updatedTenantConfig?.affected) {
      const action = 'C';
      const data = {
        ...tenant,
        allow_email: updateTenantConfigDto.allow_email,
        created_by: updateTenantConfigDto?.created_by,
      };

      await this.updateTenantHistory(data, action);
    } else {
      throw new NotFoundException('Tenant Configuration update failed');
    }
    let configDetail = [];

    configDetail = await Promise.all(
      updateTenantConfigDto?.configuration_detail?.map(async (detail) => {
        const user = await this.userRepository.findOneBy({
          id: detail?.created_by,
        });

        if (!user) {
          throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
        }

        if (!detail?.id) {
          //create tenant configuration details
          const encryptedSecretKey = encryptSecretKey(detail?.secret_key);
          const encryptedSecretValue = encryptSecretKey(detail?.secret_value);
          const tenantConfig = new TenantConfigurationDetail();
          tenantConfig.element_name = detail?.element_name;
          tenantConfig.end_point_url = detail?.end_point_url;
          tenantConfig.secret_key = encryptedSecretKey;
          tenantConfig.secret_value = encryptedSecretValue;
          tenantConfig.tenant_id = tenant.id;
          tenantConfig.created_by = user.id;

          await this.tenantConfigDetailRepository.save(tenantConfig);
        } else {
          const configDetail = await this.tenantConfigDetailRepository.findOne({
            where: {
              id: detail?.id,
            },
            relations: ['created_by'],
          });

          if (configDetail) {
            const configDetailData = {
              ...(detail?.element_name && {
                element_name: detail.element_name,
              }),
              ...(detail?.end_point_url && {
                end_point_url: detail.end_point_url,
              }),
              ...(detail?.secret_key && {
                secret_key: encryptSecretKey(detail.secret_key),
              }),
              ...(detail?.secret_value && {
                secret_value: encryptSecretKey(detail.secret_value),
              }),
            };
            const updatedConfigDetail =
              await this.tenantConfigDetailRepository.update(
                { id: detail?.id },
                {
                  ...configDetailData,
                }
              );

            let tenantConfigDetailData: any = {
              ...configDetail,
            };

            tenantConfigDetailData = {
              ...tenantConfigDetailData,
              created_by: +tenantConfigDetailData?.created_by?.id,
            };

            if (updatedConfigDetail?.affected) {
              const historydata = {
                ...configDetail,
                tenant_id: id,
                created_by: tenantConfigDetailData?.created_by,
              };
              const action = 'C';
              await this.updateTenantConfigDetailHistory(historydata, action);
            } else {
              throw new NotFoundException(
                'Tenant Configuration detail update failed'
              );
            }
          }
        }
      })
    );
    return {
      status: 'success',
      response: 'Changes Saved Successfully',
      status_code: 204,
    };
  }

  async getTenantConfig(id: any) {
    const tenant = await this.tenantRepository.find({
      where: [{ id: id }],
      relations: ['configuration_detail'],
    });
    if (!tenant) {
      throw new HttpException(`Tenant Config not found.`, HttpStatus.NOT_FOUND);
    }

    const transformedData = tenant.map((item) => {
      const configurationDetail = item.configuration_detail.reduce(
        (acc, detail) => {
          acc[detail.element_name] = {
            ...detail,
            secret_key: decryptSecretKey(detail.secret_key),
            secret_value: decryptSecretKey(detail.secret_value),
          };
          return acc;
        },
        {}
      );

      return { ...item, configuration_detail: configurationDetail };
    });

    return {
      status: 'success',
      response: 'Data Fetched Successfully',
      response_code: 200,
      data: transformedData,
    };
  }

  async updateTenantConfigDetailHistory(data: any, action: string) {
    const tenantConfigDetailHistoryC = new TenantConfigurationDetailHistory();
    tenantConfigDetailHistoryC.id = data?.id;
    tenantConfigDetailHistoryC.tenant_id = data?.tenant_id;
    tenantConfigDetailHistoryC.created_by = data?.created_by;
    tenantConfigDetailHistoryC.secret_key = data?.secret_key;
    tenantConfigDetailHistoryC.secret_value = data?.secret_value;
    tenantConfigDetailHistoryC.element_name = data?.element_name;
    tenantConfigDetailHistoryC.end_point_url = data?.end_point_url;
    tenantConfigDetailHistoryC.history_reason = 'C';

    await this.tenantConfigDetailHistoryRepository.save(
      tenantConfigDetailHistoryC
    );

    if (action === 'D') {
      const tenantConfigDetailHistoryD = new TenantConfigurationDetailHistory();
      tenantConfigDetailHistoryD.id = data?.id;
      tenantConfigDetailHistoryD.tenant_id = data?.tenant_id;
      tenantConfigDetailHistoryD.created_by = data?.created_by;
      tenantConfigDetailHistoryD.secret_key = data?.secret_key;
      tenantConfigDetailHistoryD.secret_value = data?.secret_value;
      tenantConfigDetailHistoryD.element_name = data?.element_name;
      tenantConfigDetailHistoryD.end_point_url = data?.end_point_url;
      tenantConfigDetailHistoryD.history_reason = 'D';

      await this.tenantConfigDetailHistoryRepository.save(
        tenantConfigDetailHistoryD
      );
    }
  }

  async updateTenantHistory(data: any, action: string) {
    const TenantHistoryC = new TenantHistory();
    TenantHistoryC.tenant_name = data?.tenant_name;
    TenantHistoryC.id = data?.id;
    TenantHistoryC.email = data?.email;
    TenantHistoryC.password = data?.password;
    TenantHistoryC.tenant_domain = data?.tenant_domain;
    TenantHistoryC.admin_domain = data?.admin_domain;
    TenantHistoryC.tenant_code = data?.tenant_code;
    TenantHistoryC.phone_number = data?.phone_number;
    TenantHistoryC.is_active = data?.is_active;
    TenantHistoryC.created_by = data?.created_by;
    TenantHistoryC.allow_email = data?.allow_email;
    TenantHistoryC.tenant_timezone = data?.tenant_timezone;
    TenantHistoryC.allow_donor_minimum_age = data?.allow_donor_minimum_age;
    TenantHistoryC.status = enumStatus.Active;
    TenantHistoryC.history_reason = 'C';
    await this.tenantHistoryRepository.save(TenantHistoryC);

    if (action === 'D') {
      const TenantHistoryD = new TenantHistory();
      TenantHistoryD.tenant_name = data?.tenant_name;
      TenantHistoryD.id = data?.id;
      TenantHistoryD.email = data?.email;
      TenantHistoryD.password = data?.password;
      TenantHistoryD.tenant_domain = data?.tenant_domain;
      TenantHistoryD.admin_domain = data?.admin_domain;
      TenantHistoryD.tenant_code = data?.tenant_code;
      TenantHistoryD.phone_number = data?.phone_number;
      TenantHistoryD.is_active = data?.is_active;
      TenantHistoryD.created_by = data?.created_by;
      TenantHistoryC.allow_email = data?.allow_email;
      TenantHistoryC.tenant_timezone = data?.tenant_timezone;
      TenantHistoryC.allow_donor_minimum_age = data?.allow_donor_minimum_age;
      TenantHistoryD.history_reason = 'D';
      await this.tenantHistoryRepository.save(TenantHistoryD);
    }
  }

  async updateAddressHistory(data: any, action: string) {
    const AddressHistoryC = new AddressHistory();
    AddressHistoryC.address1 = data?.address1;
    AddressHistoryC.address2 = data?.address2;
    AddressHistoryC.id = data?.id;
    AddressHistoryC.city = data?.city;
    AddressHistoryC.state = data?.state;
    AddressHistoryC.country = data?.country;
    AddressHistoryC.zip_code = data?.zip_code;
    AddressHistoryC.county = data?.county;
    AddressHistoryC.created_by = data?.created_by;
    AddressHistoryC.addressable_id = data?.addressable_id;
    AddressHistoryC.tenant_id = data?.tenant_id;
    AddressHistoryC.history_reason = 'C';
    await this.addressHistoryREpo.save(AddressHistoryC);

    if (action === 'D') {
      const AddressHistoryC = new AddressHistory();
      AddressHistoryC.address1 = data?.address1;
      AddressHistoryC.address2 = data?.address2;
      AddressHistoryC.id = data?.id;
      AddressHistoryC.city = data?.city;
      AddressHistoryC.state = data?.state;
      AddressHistoryC.country = data?.country;
      AddressHistoryC.zip_code = data?.zip_code;
      AddressHistoryC.county = data?.county;
      AddressHistoryC.created_by = data?.created_by;
      AddressHistoryC.addressable_id = data?.tenant_id;
      AddressHistoryC.history_reason = 'D';
      await this.addressHistoryREpo.save(AddressHistoryC);
    }
  }
  async findKeycloakUser(realm: any, username: any) {
    try {
      const kcAdmin = await keyCloakAdmin();
      const kcUser = await kcAdmin.users.findOne({
        realm,
        username,
      });
      if (!kcUser) {
        throw new Error('User not found in Keycloak');
      }

      return {
        status: 'success',
        response: 'Data Fetched Successfully',
        response_code: 200,
        data: kcUser,
      };
    } catch (error) {
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findImpersonateableUser(tenantId: any) {
    try {
      const where: any = {
        tenant: {
          id: tenantId,
        },
        is_impersonateable_user: true,
      };

      const user: any = await this.userRepository.findOne({
        where,
        relations: ['tenant'],
      });

      if (!user) {
        throw new NotFoundException(
          'Impersonateable user not found in Tenant.'
        );
      }

      return {
        status: 'success',
        response: 'Data Fetched Successfully',
        response_code: 200,
        data: user,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findKeycloakRealm(tenantId: any) {
    try {
      const tenant = await this.tenantRepository.findOne({
        where: {
          id: tenantId,
        },
      });

      if (!tenant) {
        throw new NotFoundException('Tenant not found.');
      }

      const url = tenant.admin_domain;
      const hostname = new URL(url).hostname;
      const parts = hostname.split('.');
      const subdomain = parts.length > 3 ? parts[1] : parts[0];

      const kcAdmin = await keyCloakAdmin();
      const realms = await kcAdmin.realms.find();
      const realm = realms.find((realm: any) => realm.realm === subdomain);
      if (!realm) {
        throw new HttpException(`'Realm not exists.`, HttpStatus.NOT_FOUND);
      }

      return {
        status: 'success',
        response: 'Data Fetched Successfully',
        response_code: 200,
        data: realm,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async impersonateKeyCloakUser(realm: any, keyCloakUserId: any) {
    try {
      const kcAdmin = await keyCloakAdmin();
      const impersonateUserApiUrl = `${kcAdmin.baseUrl}/admin/realms/${realm}/users/${keyCloakUserId}/impersonation`;

      const apiResponse = await fetch(impersonateUserApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${kcAdmin.accessToken}`,
        },
        body: JSON.stringify({ enabled: false }),
      });
      const cookies = apiResponse.headers.get('set-cookie');
      const KEYCLOAK_IDENTITY_COOKIE = 'KEYCLOAK_IDENTITY';
      const tokenStartIndex = cookies.indexOf(`${KEYCLOAK_IDENTITY_COOKIE}=`);

      const endIndex = cookies.indexOf(';', tokenStartIndex);
      const keycloakIdentity =
        endIndex !== -1
          ? cookies.substring(
              tokenStartIndex + KEYCLOAK_IDENTITY_COOKIE.length + 1,
              endIndex
            )
          : cookies.substring(
              tokenStartIndex + KEYCLOAK_IDENTITY_COOKIE.length + 1
            );

      if (!keycloakIdentity) {
        throw new Error('Some Error occured while generating token');
      }

      return {
        status: 'success',
        response: 'User Impersonated Successfully',
        response_code: 200,
        data: { keycloakIdentity },
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async impersonateTenantUser(tenantId: any) {
    try {
      const userResponse: any = await this.findImpersonateableUser(tenantId);
      if (userResponse.status == 'error') {
        return userResponse;
      }
      const username = userResponse?.data?.keycloak_username;
      const realmResponse: any = await this.findKeycloakRealm(tenantId);
      if (realmResponse.status == 'error') {
        return realmResponse;
      }
      const realmName = realmResponse?.data?.realm;
      const kcUserResponse = await this.findKeycloakUser(realmName, username);

      if (kcUserResponse.status == 'error') {
        return kcUserResponse;
      }
      const keycloakUserId = kcUserResponse.data[0].id;
      const keycloakIdentityResponse = await this.impersonateKeyCloakUser(
        realmName,
        keycloakUserId
      );

      if (keycloakIdentityResponse.status == 'error') {
        return keycloakIdentityResponse;
      }

      const keycloakIdentity = keycloakIdentityResponse?.data.keycloakIdentity;

      return {
        status: SuccessConstants.SUCCESS,
        message: 'User Impersonated',
        status_code: HttpStatus.CREATED,
        data: {
          realm: realmName,
          keycloakIdentity,
          username,
        },
      };
    } catch (error) {
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async createRealm(
    name: string,
    password: string,
    userData: any = {},
    domain
  ) {
    try {
      const kcAdmin = await keyCloakAdmin();
      if (name) {
        const realms = await kcAdmin.realms.find();
        const existingRealm = realms.find((realm: any) => realm.realm === name);
        if (existingRealm) {
          return 'Realm Already Exists';
        }
        const realm = {
          realm: name,
          enabled: true,
          loginTheme: process.env.KEYCLOAK_LOGIN_THEME, // Set the appropriate theme name
          resetPasswordAllowed: true,
        };
        console.log({ realm });
        await kcAdmin.realms.create(realm);
        const user = await kcAdmin.users.create({
          realm: name,
          username: userData?.email,
          enabled: true,
          ...userData,
        });
        console.log({ user });
        const AdminUserObject = {
          ...userData,
          email: 'impersonateable_' + userData?.email,
        };
        const AdminUser = await kcAdmin.users.create({
          realm: name,
          username: 'impersonateable_' + userData?.email,
          enabled: true,
          ...AdminUserObject,
        });
        await kcAdmin.users.resetPassword({
          realm: name,
          id: user.id,
          credential: {
            temporary: false,
            value: password,
          },
        });
        const updateAdminRole = await kcAdmin.users.resetPassword({
          realm: name,
          id: AdminUser.id,
          credential: {
            temporary: false,
            value: password,
          },
        });
        const clientSettings = {
          clientId: name,
          name,
          realm: name,
          rootUrl: `${domain}`,
          baseUrl: '/',
          redirectUris: ['/*'],
          webOrigins: ['*', `${domain}`],
          directAccessGrantsEnabled: true,
          publicClient: true,
        };

        const realmClient = await kcAdmin.clients.create(clientSettings);
        console.log({ realmClient });
        // Enable user events (Login and Login-error)
        const eventSettings = {
          eventsEnabled: true,
          enabledEventTypes: [
            // "LOGIN",
            'LOGIN_ERROR',
          ],
          adminEventsEnabled: true,
          adminEventsDetailsEnabled: true,
        };
        await kcAdmin.realms.updateConfigEvents({ realm: name }, eventSettings);

        return { message: 'Realm, Client and User created successfully' };
      } else {
        return 'Provide input';
      }
    } catch (e) {
      return resError(e, ErrorConstants.Error, e.status);
    }
  }

  async deleteRealm(realmName: string) {
    try {
      const kcAdmin = await keyCloakAdmin();

      const realm = await kcAdmin.realms.findOne({ realm: realmName });
      if (!realm) {
        return 'Realm not found';
      }

      await kcAdmin.realms.del({ realm: realmName });
      return 'Realm deleted successfully';
    } catch (error) {
      return resError(error, ErrorConstants.Error, error.status);
    }
  }
  // Helper function to update role permissions and handle missing permissions.
  async updateRolePermissions(role: any, permissions: any[]) {
    console.log({ permissions });
    const permissionsFound = await this.permissionsRepository.findBy({
      id: In(permissions),
    });

    if (permissionsFound && !permissionsFound.length) {
      throw new HttpException(
        'Some permissions not found.',
        HttpStatus.NOT_FOUND
      );
    }

    const rolePermission = [];
    for (const permission of permissionsFound) {
      rolePermission.push({
        permission: permission,
        role: role,
        created_by: role.created_by,
      });
    }

    await this.rolePermissionRepository.delete({ role: role });
    await this.rolePermissionRepository.save(rolePermission);
  }

  async createDailyStoryTenantAndCampaignAndAssignToTenant(tenantId: any) {
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
      relations: ['configuration_detail', 'applications', 'created_by'],
      order: {
        applications: {
          id: 'ASC',
        },
      },
    });

    if (!tenant) {
      return resError('Tenant not found', ErrorConstants.Error, 404);
    }

    const userQuery = this.userRepository.createQueryBuilder('users').where({
      tenant: {
        id: tenant.id,
      },
      is_super_admin: true,
    });
    const [data] = await userQuery.getManyAndCount();
    const user = data[0];

    if (!user) {
      return resError(
        'No user is associated with this tenant',
        ErrorConstants.Error,
        404
      );
    }

    const res = await this.createDailyStoryTenantAndCampaignService(
      tenant,
      user
    );
    return res;
  }
  async createDailyStoryTenantAndCampaignService(tenant: Tenant, user: User) {
    if (process.env.DAILY_STORY_ENABLED !== 'true') {
      return resError(
        'You need to set environment variable first',
        ErrorConstants.Error,
        401
      );
    }
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const uniqueId = uuidv4();

      // ********** created DS Tenant  **********
      const dsTenantRes = await createDailyStoryTenant(
        tenant.tenant_name,
        tenant.email
      );

      // ********** created DS Campaign **********
      const campaignData = {
        tenantName: tenant.tenant_name,
        tenantId: dsTenantRes?.token?.TenantId,
      };
      const campaignResponse: any = await createOrUpdateCampaign(
        campaignData,
        dsTenantRes?.token?.Token
      );

      //  ********** Updated Local Tenant with DS Tenant ids **********
      tenant.dailystory_token = encryptSecretKey(dsTenantRes?.token?.Token);
      tenant.dailystory_tenant_uid = dsTenantRes?.tenantuid;
      tenant.dailystory_tenant_id = dsTenantRes?.token?.TenantId;
      tenant.tenant_secret_key = encryptSecretKey(uniqueId);
      tenant.dailystory_campaign_id = campaignResponse?.Response?.id;

      await queryRunner.manager.save(tenant);

      // Updated Tenant Config with DS Tenant ids
      if (dsTenantRes?.token) {
        const encryptedSecretKey = encryptSecretKey(dsTenantRes?.token?.Token);
        // const encryptedSecretValue = encryptSecretKey();
        const tenantConfig = new TenantConfigurationDetail();
        tenantConfig.element_name = 'daily_story_api';
        tenantConfig.end_point_url = process.env.DAILY_STORY_COMMUNICATION_URL;
        tenantConfig.secret_key = encryptedSecretKey;
        tenantConfig.secret_value = 'encryptedSecretValue';
        tenantConfig.tenant_id = tenant.id;
        tenantConfig.created_by = tenant.created_by;
        await queryRunner.manager.save(tenantConfig);
      }

      // Updated Local Users with DS Tenant User
      const dailtStoryUsers = await getDailyStoryTenantUsers(
        dsTenantRes?.token?.Token
      );
      const users = dailtStoryUsers?.Response?.users;
      let dailyStoryUserUid;
      if (users && users.length > 0) {
        for (const user of users) {
          const tenantEmail = user.email;
          const uniqueId = user.uniqueId;
          if (tenantEmail == tenant.email.toLowerCase()) {
            dailyStoryUserUid = uniqueId;
          }
        }
      }
      user.dailystory_useruid = dailyStoryUserUid;
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      return {
        status: SuccessConstants.SUCCESS,
        message:
          'Successfully created and assigned both DS tenant and its campaign',
        status_code: HttpStatus.CREATED,
        data: { tenant, user },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
