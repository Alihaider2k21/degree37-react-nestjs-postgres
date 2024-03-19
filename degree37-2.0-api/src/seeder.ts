import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Templates } from './api/admin/templates/entities/templates.entity';
import { TemplateSeeder } from './api/admin/templates/seeder/template.seeder';
import { PrefixesSeeder } from './api/crm/contacts/common/prefixes/seeder/prefixes.seeder';
import { entities } from './database/entities/entity';
import * as dotenv from 'dotenv';
import { Modules } from './api/system-configuration/platform-administration/roles-administration/role-permissions/entities/module.entity';
import { Permissions } from './api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { Applications } from './api/system-configuration/platform-administration/roles-administration/application/entities/application.entity';
import { rolePermissions } from './api/seeders/rolePermissions.seeder';
import { Prefixes } from './api/crm/contacts/common/prefixes/entities/prefixes.entity';
import { Suffixes } from './api/crm/contacts/common/suffixes/entities/suffixes.entity';
import { SuffixesSeeder } from './api/crm/contacts/common/suffixes/seeder/suffixes.seeder';
import { CrmLocationsSeed } from './api/seeders/crmlocations.seeders';
import { FilterCriteria } from './api/crm/Filters/entities/filter_criteria';
import { CrmAccountsSeed } from './api/seeders/crmAccounts.seeders';
import { StaffingManagementStaffListSeed } from './api/seeders/staffingManagementStaffList.seeders';
import { OcNonCollectionEventSeed } from './api/seeders/ocNonCollectionEvents.seeder';
import { SessionsFiltersSeed } from './api/seeders/sessionsFilters.seeder';
dotenv.config();

seeder({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'd37',
      entities,
      synchronize: false,
      logging: false,
    }),
    TypeOrmModule.forFeature([
      Applications,
      Modules,
      Permissions,
      Templates,
      Prefixes,
      Suffixes,
      FilterCriteria,
    ]),
  ],
}).run([
  rolePermissions,
  TemplateSeeder,
  PrefixesSeeder,
  SuffixesSeeder,
  CrmAccountsSeed,
  CrmLocationsSeed,
  OcNonCollectionEventSeed,
  SessionsFiltersSeed,
  StaffingManagementStaffListSeed,
]);
