import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { StaffDuplicatesController } from './controller/staff-duplicates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Duplicates } from 'src/api/common/entities/duplicates/duplicates.entity';
import { DuplicatesHistory } from 'src/api/common/entities/duplicates/duplicates-history.entity';
import { StaffDuplicatesService } from './service/staff-duplicates.service';
import { Staff } from '../entities/staff.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Duplicates,
      DuplicatesHistory,
      Staff,
      Permissions,
    ]),
  ],
  controllers: [StaffDuplicatesController],
  providers: [StaffDuplicatesService, JwtService],
})
export class StaffDuplicatesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/contact-staff/:id/duplicates/create',
        method: RequestMethod.POST,
      },
      { path: '/contact-staff/:id/duplicates/list', method: RequestMethod.GET },
      {
        path: '/contact-staff/:id/duplicates/resolve',
        method: RequestMethod.PATCH,
      },
      {
        path: '/contact-staff/duplicates/identify',
        method: RequestMethod.POST,
      }
    );
  }
}
