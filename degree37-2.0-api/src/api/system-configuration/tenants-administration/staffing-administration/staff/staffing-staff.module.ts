import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { BusinessUnits } from '../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';

import { StaffService } from './services/staff.services';
import { StaffController } from './controller/staff.controller';
import { User } from '../../user-administration/user/entity/user.entity';
import { StaffCollectionOperation } from './entity/staff-collection-operation.entity';
import { TeamStaff } from '../teams/entity/team-staff.entiity';
import { Team } from '../teams/entity/team.entity';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { StaffRolesMapping } from 'src/api/crm/contacts/staff/staffRolesMapping/entities/staff-roles-mapping.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Staff,
      User,
      BusinessUnits,
      StaffCollectionOperation,
      TeamStaff,
      Team,
      StaffRolesMapping,
      Permissions,
    ]),
  ],
  providers: [StaffService, JwtService],
  controllers: [StaffController],
  exports: [StaffService],
})
export class StaffingStaffModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/staffing-admin/staff', method: RequestMethod.POST },
      { path: '/staffing-admin/staff', method: RequestMethod.GET },
      {
        path: '/staffing-admin/staff-certification',
        method: RequestMethod.GET,
      },
      {
        path: '/staffing-admin/team-members',
        method: RequestMethod.GET,
      },
      {
        path: '/staffing-admin/other-teams-staff',
        method: RequestMethod.GET,
      }
    );
  }
}
