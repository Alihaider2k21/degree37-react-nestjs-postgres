import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { DeviceService } from './services/device.services';
import { DeviceController } from './controller/device.controller';
import { Device } from './entities/device.entity';
import { User } from '../../../user-administration/user/entity/user.entity';
import { DeviceType } from '../device-type/entity/device-type.entity';
import { DeviceHistory } from './entities/device-history.entity';
import { DeviceMaintenance } from './entities/device-maintenance.entity';
import { DeviceShare } from './entities/device-share.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { DeviceRetirement } from './cron/device-retirement.cron';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Device,
      User,
      DeviceType,
      DeviceHistory,
      DeviceMaintenance,
      DeviceShare,
      Permissions,
    ]),
  ],
  providers: [DeviceService, JwtService, DeviceRetirement],
  controllers: [DeviceController],
  exports: [DeviceService],
})
export class DeviceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/devices/create', method: RequestMethod.POST },
        { path: '/devices', method: RequestMethod.GET },
        { path: '/devices/drives', method: RequestMethod.GET },
        { path: '/devices/:id', method: RequestMethod.PUT },
        { path: '/devices/:id', method: RequestMethod.GET },
        { path: '/devices/:id/maintenances', method: RequestMethod.POST },
        { path: '/devices/:id/maintenances', method: RequestMethod.GET },
        { path: '/devices/:id/retirement', method: RequestMethod.POST },
        { path: '/devices/:id/shares', method: RequestMethod.POST },
        { path: '/devices/:id/shares', method: RequestMethod.GET },
        { path: '/devices/:id', method: RequestMethod.DELETE }
      );
  }
}
