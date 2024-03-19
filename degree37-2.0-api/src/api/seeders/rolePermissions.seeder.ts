import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import seedData from './seed-data.json';
import seedPlatform from './seed-platform-data.json';
import { Modules } from '../system-configuration/platform-administration/roles-administration/role-permissions/entities/module.entity';
import { Permissions } from '../system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { Applications } from '../system-configuration/platform-administration/roles-administration/application/entities/application.entity';

@Injectable()
export class rolePermissions implements Seeder {
  constructor(
    @InjectRepository(Applications)
    private readonly applicationRepository: Repository<Applications>,
    @InjectRepository(Modules)
    private readonly moduleRepository: Repository<Modules>,
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>
  ) {}

  async seed(): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const filePath = path.join(__dirname, './seed-data.json');
    const dataFile = fs.readFileSync(filePath);
    const seedData = JSON.parse(dataFile);
    const platformPermissionsFilePath = path.join(
      __dirname,
      './seed-platform-data.json'
    );
    const platformPermissionsDataFile = fs.readFileSync(
      platformPermissionsFilePath
    );
    const platformPermissionsSeedData = JSON.parse(platformPermissionsDataFile);
    try {
      const tenantApplications = await this.applicationRepository.query(
        `SELECT * FROM public.tenant_applications`
      );
      const rolePermission = await this.applicationRepository.query(
        `SELECT * FROM public.role_permission`
      );
      console.log({ rolePermission });
      await this.applicationRepository.query(
        `DELETE FROM public.role_permission`
      );

      // // Reset primary key sequence
      await this.applicationRepository.query(
        `ALTER SEQUENCE public.role_permission_id_seq RESTART WITH 1`
      );
      await this.applicationRepository.query(
        `DELETE FROM public.tenant_applications`
      );

      // // Reset primary key sequence
      // await this.applicationRepository.query(`DELETE FROM public.permissions`);

      // // Reset primary key sequence
      // await this.applicationRepository.query(
      //   `ALTER SEQUENCE public.permissions_id_seq RESTART WITH 1`
      // );
      // await this.applicationRepository.query(`DELETE FROM public.modules`);

      // // Reset primary key sequence
      // await this.applicationRepository.query(
      //   `ALTER SEQUENCE public.modules_id_seq RESTART WITH 1`
      // );
      // await this.applicationRepository.query(`DELETE FROM public.applications`);

      // // Reset primary key sequence
      // await this.applicationRepository.query(
      //   `ALTER SEQUENCE public.applications_id_seq RESTART WITH 1`
      // );

      const createPermissions = async (
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
          await this.permissionsRepository.update(
            { id },
            updatedPermissionName
          );
        }
      };
      const createModule = async (
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
          console.log('sdefghj', { savedModule });
        }
        if (data?.permissions && data?.permissions.length > 0) {
          for (const permissionsData of data?.permissions) {
            await createPermissions(
              permissionsData,
              application,
              isSupeAdminPermission,
              savedModule
            );
          }
        }
        if (data?.child_modules && data?.child_modules.length > 0) {
          for (const childModuleData of data.child_modules) {
            await createModule(
              childModuleData,
              application,
              isSupeAdminPermission,
              savedModule
            );
          }
        }
      };
      const createApplicationAndModules = async (
        data: any,
        isSupeAdminPermission: boolean,
        parentModule?: Modules
      ) => {
        const applicationAlreadyExist =
          await this.applicationRepository.findOne({
            where: {
              name: data?.name,
            },
          });

        let savedApplication: any;

        if (!applicationAlreadyExist) {
          const newApplication = new Applications();
          newApplication.name = data?.name;
          newApplication.is_active = true;

          savedApplication = await this.applicationRepository.save(
            newApplication
          );
        }

        if (data?.modules && data?.modules.length > 0) {
          for (const moduleData of data.modules) {
            await createModule(
              moduleData,
              applicationAlreadyExist
                ? applicationAlreadyExist
                : savedApplication,
              isSupeAdminPermission,
              parentModule
            );
          }
        }
      };
      if (seedData?.applications && seedData?.applications?.length) {
        for (const appData of seedData.applications) {
          await createApplicationAndModules(appData, false);
        }
      }

      if (
        platformPermissionsSeedData?.applications &&
        platformPermissionsSeedData?.applications?.length
      ) {
        for (const appData of platformPermissionsSeedData.applications) {
          await createApplicationAndModules(appData, true);
        }
      }
      try {
        for (const { tenant_id, application_id } of tenantApplications) {
          await this.applicationRepository.query(
            'INSERT INTO tenant_applications (tenant_id, application_id) VALUES ($1, $2)',
            [tenant_id, application_id]
          );
        }
        console.log('tenant applications data inserted successfully.');
      } catch (error) {
        console.error('Error inserting tenant_applications data:', error);
      }
      try {
        for (const { role_id, permission_id, created_by } of rolePermission) {
          await this.applicationRepository.query(
            'INSERT INTO role_permission (role_id, permission_id , created_by) VALUES ($1, $2, $3)',
            [role_id, permission_id, created_by]
          );
        }
        console.log('Role Permissions data inserted successfully.');
      } catch (error) {
        console.error('Error inserting Role Permissions data:', error);
      }
    } catch (e) {
      console.error('error seeding db : ', e);
    }
  }

  async drop(): Promise<any> {
    try {
      await this.applicationRepository.query(`DELETE FROM public.permissions`);

      // Reset primary key sequence
      await this.applicationRepository.query(
        `ALTER SEQUENCE public.permissions_id_seq RESTART WITH 1`
      );
      await this.applicationRepository.query(`DELETE FROM public.modules`);

      // Reset primary key sequence
      await this.applicationRepository.query(
        `ALTER SEQUENCE public.modules_id_seq RESTART WITH 1`
      );
      await this.applicationRepository.query(`DELETE FROM public.applications`);

      // Reset primary key sequence
      await this.applicationRepository.query(
        `ALTER SEQUENCE public.applications_id_seq RESTART WITH 1`
      );
    } catch (e) {
      console.error('error seeding db : ', e);
    }
  }
}
