import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassificationSettingService } from './services/setting.service';
import { ClassificationSettingController } from './controller/settings.controller';
import { StaffingClassificationSetting } from './entity/setting.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { StaffingClassification } from '../classifications/entity/classification.entity';
import { User } from '../../user-administration/user/entity/user.entity';
import { StaffingClassificationSettingHistory } from './entity/setting-history.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StaffingClassification,
      User,
      StaffingClassificationSetting,
      StaffingClassificationSettingHistory,
      Permissions,
    ]),
  ],
  providers: [ClassificationSettingService, JwtService],
  controllers: [ClassificationSettingController],
  exports: [ClassificationSettingService],
})
export class ClassificationSettingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/staffing-admin/setting', method: RequestMethod.POST },
      { path: '/staffing-admin/setting', method: RequestMethod.GET },
      { path: '/staffing-admin/setting/search', method: RequestMethod.POST },
      { path: '/staffing-admin/setting/:id', method: RequestMethod.GET },
      {
        path: '/staffing-admin/setting/classification/:classificationId',
        method: RequestMethod.GET,
      },
      { path: '/staffing-admin/setting/:id', method: RequestMethod.PUT },
      { path: '/staffing-admin/setting/:id', method: RequestMethod.PATCH }
    );
  }
}
