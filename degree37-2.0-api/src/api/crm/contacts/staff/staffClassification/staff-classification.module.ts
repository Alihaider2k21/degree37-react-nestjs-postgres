import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { StaffClassificationController } from './controller/staff-classification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Staff } from 'src/api/crm/contacts/staff/entities/staff.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { StaffClassificationService } from './service/staff-classification.service';
import { StaffClassification } from './entity/staff-classification.entity';
import { StaffClassificationHistory } from './entity/staff-classification-history.entity';
import { StaffingClassification } from 'src/api/system-configuration/tenants-administration/staffing-administration/classifications/entity/classification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Staff,
      Permissions,
      StaffClassification,
      StaffClassificationHistory,
      StaffingClassification,
    ]),
  ],
  controllers: [StaffClassificationController],
  providers: [StaffClassificationService, JwtService],
})
export class StaffClassificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/staffs/classification/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: '/staffs/classification/:id',
        method: RequestMethod.GET,
      }
    );
  }
}
