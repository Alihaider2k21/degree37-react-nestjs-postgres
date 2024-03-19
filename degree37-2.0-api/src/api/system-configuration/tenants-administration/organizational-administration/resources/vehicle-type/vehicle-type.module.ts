import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleTypeController } from './controller/vehicle-type.controller';
import { VehicleTypeService } from './services/vehicle-type.service';
import { VehicleType } from './entities/vehicle-type.entity';
import { User } from '../../../user-administration/user/entity/user.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { VehicleTypeHistory } from './entities/vehicle-type-history.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      VehicleType,
      VehicleTypeHistory,
      Permissions,
    ]),
  ],
  controllers: [VehicleTypeController],
  providers: [VehicleTypeService, JwtService],
  exports: [VehicleTypeService],
})
export class VehicleTypeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/vehicle-types', method: RequestMethod.GET },
        { path: '/vehicle-types', method: RequestMethod.POST },
        { path: '/vehicle-types/:id', method: RequestMethod.PUT },
        { path: '/vehicle-types/:id', method: RequestMethod.GET },
        { path: '/vehicle-types/:id', method: RequestMethod.DELETE }
      );
  }
}
