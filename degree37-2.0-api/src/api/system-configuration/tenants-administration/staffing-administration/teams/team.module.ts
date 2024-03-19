import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamService } from './services/team.services';
import { TeamController } from './controller/team.controller';
import { Team } from './entity/team.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user-administration/user/entity/user.entity';
import { BusinessUnits } from '../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { TeamHistory } from './entity/teamHistory';
import { TeamCollectionOperation } from './entity/team-collection-operation.entity';
import { TeamStaff } from './entity/team-staff.entiity';
import { TeamStaffHistory } from './entity/team-staff-history';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Team,
      User,
      BusinessUnits,
      TeamHistory,
      TeamCollectionOperation,
      TeamStaff,
      TeamStaffHistory,
      Permissions,
    ]),
  ],
  providers: [TeamService, JwtService],
  controllers: [TeamController],
  exports: [TeamService],
})
export class TeamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/staff-admin/teams', method: RequestMethod.POST },
      { path: '/staff-admin/teams', method: RequestMethod.GET },
      { path: '/staff-admin/teams/:id', method: RequestMethod.GET },
      { path: '/staff-admin/teams/:id', method: RequestMethod.PUT },
      { path: '/staff-admin/teams/list', method: RequestMethod.GET },
      {
        path: '/staff-admin/teams/archive/:id',
        method: RequestMethod.DELETE,
      },
      { path: '/staff-admin/teams/team-members', method: RequestMethod.POST }
    );
  }
}
