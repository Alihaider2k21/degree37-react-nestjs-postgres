import { HttpStatus, Injectable } from '@nestjs/common';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { RoleDto, SeedDto } from '../dto/seed.dto';
import { migrations } from '../../../seeders/migrations.seeder';
import { CrmAccountsSeed } from '../../../seeders/crmAccounts.seeders';
import { CrmLocationsSeed } from '../../../seeders/crmlocations.seeders';
import { OcNonCollectionEventSeed } from '../../../seeders/ocNonCollectionEvents.seeder';
import { rolePermissions } from '../../../seeders/rolePermissions.seeder';
import { SessionsFiltersSeed } from '../../../seeders/sessionsFilters.seeder';
import { StaffingManagementStaffListSeed } from '../../../seeders/staffingManagementStaffList.seeders';
import { SeederEnum } from '../enums/seeder.enum';
import { SuccessConstants } from '../../../system-configuration/constants/success.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Applications } from 'src/api/system-configuration/platform-administration/roles-administration/application/entities/application.entity';
import { Repository } from 'typeorm';
import { Modules } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/module.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Injectable()
export class SeedersService {
  constructor(
    private readonly migrations: migrations,
    private readonly crmAccountsSeed: CrmAccountsSeed,
    private readonly crmLocationsSeed: CrmLocationsSeed,
    private readonly ocNonCollectionEventSeed: OcNonCollectionEventSeed,
    private readonly rolePermissions: rolePermissions,
    private readonly sessionsFiltersSeed: SessionsFiltersSeed,
    private readonly staffingManagementStaffListSeed: StaffingManagementStaffListSeed,

    @InjectRepository(Applications)
    private readonly applicationRepository: Repository<Applications>,
    @InjectRepository(Modules)
    private readonly moduleRepository: Repository<Modules>,
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>
  ) {}

  async seed(dto: SeedDto) {
    const { type } = dto;
    try {
      switch (type) {
        case SeederEnum.CRM_ACCOUNTS:
          await this.crmAccountsSeed.seed();
          break;
        case SeederEnum.CRM_LOCATIONS:
          await this.crmLocationsSeed.seed();
          break;
        case SeederEnum.MIGRATIONS:
          await this.migrations.seed();
          break;
        case SeederEnum.OC_NCE:
          await this.ocNonCollectionEventSeed.seed();
          break;
        case SeederEnum.ROLE_PERMISSIONS:
          await this.rolePermissions.seed();
          break;
        case SeederEnum.SESSIONS_FILTERS:
          await this.sessionsFiltersSeed.seed();
          break;
        case SeederEnum.STAFFING_MANAGEMENT_STAFF_LIST_FILTERS:
          await this.staffingManagementStaffListSeed.seed();
          break;
      }

      return resSuccess(
        `Data seed successfully for ${type}`,
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async drop(dto: SeedDto) {
    const { type } = dto;
    try {
      switch (type) {
        case SeederEnum.CRM_ACCOUNTS:
          await this.crmAccountsSeed.drop();
          break;
        case SeederEnum.CRM_LOCATIONS:
          await this.crmLocationsSeed.drop();
          break;
        case SeederEnum.MIGRATIONS:
          await this.migrations.drop();
          break;
        case SeederEnum.OC_NCE:
          await this.ocNonCollectionEventSeed.drop();
          break;
        case SeederEnum.ROLE_PERMISSIONS:
          await this.rolePermissions.drop();
          break;
        case SeederEnum.SESSIONS_FILTERS:
          await this.sessionsFiltersSeed.drop();
          break;
        case SeederEnum.STAFFING_MANAGEMENT_STAFF_LIST_FILTERS:
          await this.staffingManagementStaffListSeed.drop();
          break;
      }
      return resSuccess(
        `Data drop successfully for ${type}`,
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async role(dto: RoleDto) {
    try {
      if (dto?.applications && dto?.applications?.length) {
        for (const appData of dto.applications) {
          await this.createApplicationAndModules(appData, false);
        }
      }

      return resSuccess(
        `Role Added Successfully`,
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  createPermissions = async (
    data: any,
    application: any,
    isSupeAdminPermission: boolean,
    parentModule?: any
  ) => {
    const permissionExist = await this.permissionsRepository.findOne({
      where: { code: data.code },
    });
    if (!permissionExist) {
      const newPermissions = new Permissions();
      newPermissions.name = data.name;
      newPermissions.code = data.code;
      newPermissions.application = application.id;
      newPermissions.is_super_admin_permission = isSupeAdminPermission;
      newPermissions.module = parentModule?.id ? parentModule.id : null;
      const savedPermission = await this.permissionsRepository.save(
        newPermissions
      );
      console.log({ savedPermission });
    } else {
      const updatedPermissionName = {
        name: data?.name,
      };
      const id = permissionExist?.id;
      await this.permissionsRepository.update({ id }, updatedPermissionName);
    }
  };
  createModule = async (
    data: any,
    application: any,
    isSupeAdminPermission: boolean,
    parentModule?: any
  ) => {
    let savedModule = await this.moduleRepository.findOne({
      where: { code: data.code },
    });
    if (!savedModule) {
      console.log({ savedModule });
      const newModule = new Modules();
      newModule.name = data.name;
      newModule.code = data.code;
      newModule.application = application.id;
      newModule.parent_id = parentModule?.id ? parentModule.id : null;
      newModule.is_super_admin_module = isSupeAdminPermission;

      savedModule = await this.moduleRepository.save(newModule);
    }
    if (data?.permissions && data?.permissions.length > 0) {
      for (const permissionsData of data?.permissions) {
        this.createPermissions(
          permissionsData,
          application,
          isSupeAdminPermission,
          savedModule
        );
      }
    }
    if (data?.child_modules && data?.child_modules.length > 0) {
      for (const childModuleData of data.child_modules) {
        this.createModule(
          childModuleData,
          application,
          isSupeAdminPermission,
          savedModule
        );
      }
    }
  };
  createApplicationAndModules = async (
    data: any,
    isSupeAdminPermission: boolean,
    parentModule?: Modules
  ) => {
    const applicationAlreadyExist = await this.applicationRepository.findOne({
      where: {
        name: data?.name,
      },
    });

    let savedApplication: any;

    if (!applicationAlreadyExist) {
      const newApplication = new Applications();
      newApplication.name = data?.name;
      newApplication.is_active = true;

      savedApplication = await this.applicationRepository.save(newApplication);
    }

    if (data?.modules && data?.modules.length > 0) {
      for (const moduleData of data.modules) {
        this.createModule(
          moduleData,
          applicationAlreadyExist ? applicationAlreadyExist : savedApplication,
          isSupeAdminPermission,
          parentModule
        );
      }
    }
  };
}
