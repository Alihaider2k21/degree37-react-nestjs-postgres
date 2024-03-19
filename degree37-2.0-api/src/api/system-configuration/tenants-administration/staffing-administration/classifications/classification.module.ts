import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassificationService } from './services/classification.services';
import { ClassificationController } from './controller/classification.controller';
import { StaffingClassification } from './entity/classification.entity';
import { StaffingClassificationHistory } from './entity/classification-history.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user-administration/user/entity/user.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StaffingClassification,
      User,
      StaffingClassificationHistory,
      Permissions,
    ]),
  ],
  controllers: [ClassificationController],
  providers: [ClassificationService, JwtService],
  exports: [ClassificationService],
})
export class ClassificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/staffing-admin/classifications', method: RequestMethod.POST },
      { path: '/staffing-admin/classifications', method: RequestMethod.GET },
      {
        path: '/staffing-admin/classifications/settingless',
        method: RequestMethod.GET,
      },
      {
        path: '/staffing-admin/classifications/search',
        method: RequestMethod.POST,
      },
      {
        path: '/staffing-admin/classifications/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/staffing-admin/classifications/:id',
        method: RequestMethod.PUT,
      },
      {
        path: '/staffing-admin/classifications/:id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
