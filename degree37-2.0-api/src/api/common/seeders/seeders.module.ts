import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { SeedersController } from './controllers/seeders.controller';
import { SeedersService } from './services/seeders.service';
import { Applications } from '../../system-configuration/platform-administration/roles-administration/application/entities/application.entity';
import { Modules } from '../../system-configuration/platform-administration/roles-administration/role-permissions/entities/module.entity';
import { FilterCriteria } from '../../crm/Filters/entities/filter_criteria';
import { CrmAccountsSeed } from '../../seeders/crmAccounts.seeders';
import { CrmLocationsSeed } from '../../seeders/crmlocations.seeders';
import { migrations } from '../../seeders/migrations.seeder';
import { OcNonCollectionEventSeed } from '../../seeders/ocNonCollectionEvents.seeder';
import { rolePermissions } from '../../seeders/rolePermissions.seeder';
import { SessionsFiltersSeed } from '../../seeders/sessionsFilters.seeder';
import { StaffingManagementStaffListSeed } from '../../seeders/staffingManagementStaffList.seeders';
import { User } from '../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Applications,
      Modules,
      Permissions,
      FilterCriteria,
      User,
    ]),
  ],
  controllers: [SeedersController],
  providers: [
    SeedersService,
    CrmAccountsSeed,
    CrmLocationsSeed,
    migrations,
    OcNonCollectionEventSeed,
    rolePermissions,
    SessionsFiltersSeed,
    StaffingManagementStaffListSeed,
  ],
  exports: [SeedersService],
})
export class SeedersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes(
        { path: '/seeders/seed/', method: RequestMethod.POST },
        { path: '/seeders/roles', method: RequestMethod.POST },
        { path: '/seeders/drop/', method: RequestMethod.POST }
      );
  }
}
