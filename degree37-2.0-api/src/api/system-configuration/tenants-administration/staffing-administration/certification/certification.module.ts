import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CertificationService } from './service/certification.service';
import { CertificationController } from './controller/certification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user-administration/user/entity/user.entity';
import { Certification } from './entity/certification.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { CertificationHistory } from './entity/certification-history.entity';
import { StaffCertificationController } from './controller/staff-certification.controller';
import { StaffCertificationService } from './service/staff-certification.service';
import { StaffCertification } from './entity/staff-certification.entity';
import { StaffCertificationHistory } from './entity/staff-certification-history.entity';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { StaffRolesMapping } from 'src/api/crm/contacts/staff/staffRolesMapping/entities/staff-roles-mapping.entity';
import { TeamStaff } from '../teams/entity/team-staff.entiity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Certification,
      CertificationHistory,
      Staff,
      StaffCertification,
      StaffCertificationHistory,
      StaffRolesMapping,
      TeamStaff,
      Permissions,
    ]),
  ],
  controllers: [CertificationController, StaffCertificationController],
  providers: [CertificationService, StaffCertificationService, JwtService],
})
export class CertificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/staffing-admin/certification/list', method: RequestMethod.GET },
      { path: '/staffing-admin/certification', method: RequestMethod.GET },
      {
        path: '/staffing-admin/certification/create',
        method: RequestMethod.POST,
      },
      {
        path: '/staffing-admin/certification/:id/find',
        method: RequestMethod.GET,
      },
      {
        path: '/staffing-admin/certification/:id/archive',
        method: RequestMethod.PATCH,
      },
      {
        path: '/staffing-admin/certification/:id/edit',
        method: RequestMethod.PUT,
      },
      {
        path: '/staffing-admin/certification/staff-certification/not-certified',
        method: RequestMethod.GET,
      },
      {
        path: '/staffing-admin/certification/staff-certification/list',
        method: RequestMethod.GET,
      },
      {
        path: '/staffing-admin/certification/staff-certification/assign',
        method: RequestMethod.POST,
      },
      {
        path: '/staffing-admin/certification/staff-certification/:id/delete',
        method: RequestMethod.DELETE,
      }
    );
  }
}
