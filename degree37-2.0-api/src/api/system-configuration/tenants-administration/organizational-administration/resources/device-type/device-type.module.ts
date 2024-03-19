import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { DeviceTypeService } from './services/device-type.services';
import { DeviceTypeController } from './controller/device-type.controller';
import { DeviceType } from './entity/device-type.entity';
import { User } from '../../../user-administration/user/entity/user.entity';
import { ProcedureTypes } from '../../products-procedures/procedure-types/entities/procedure-types.entity';
import { DeviceTypeHistory } from './entity/deviceTypeHistory';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeviceType,
      User,
      ProcedureTypes,
      DeviceTypeHistory,
      Permissions,
    ]),
  ],
  providers: [DeviceTypeService, JwtService],
  controllers: [DeviceTypeController],
  exports: [DeviceTypeService],
})
export class DeviceTypeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/system-configuration/device-type/create',
        method: RequestMethod.POST,
      },
      {
        path: '/system-configuration/device-type/edit',
        method: RequestMethod.PUT,
      },
      {
        path: '/system-configuration/device-type/archive',
        method: RequestMethod.PUT,
      },
      { path: '/system-configuration/device-type', method: RequestMethod.GET },
      {
        path: '/system-configuration/device-type/:id',
        method: RequestMethod.GET,
      }
    );
  }
}
