import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { VehicleService } from './services/vehicle.service';
import { VehicleController } from './controller/vehicle.controller';
import { Vehicle } from './entities/vehicle.entity';
import { User } from '../../../user-administration/user/entity/user.entity';
import { VehicleType } from '../vehicle-type/entities/vehicle-type.entity';
import { VehicleCertification } from './entities/vehicle-certification.entity';
import { VehicleMaintenance } from './entities/vehicle-maintenance.entity';
import { VehicleShare } from './entities/vehicle-share.entity';
import { VehicleRetirement } from './cron/vehicle-retirement.cron';
import { Certification } from '../../../staffing-administration/certification/entity/certification.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { VehicleHistory } from './entities/vehicle-history.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vehicle,
      User,
      VehicleType,
      VehicleCertification,
      VehicleMaintenance,
      VehicleShare,
      Certification,
      VehicleHistory,
      Permissions,
    ]),
  ],
  providers: [VehicleService, VehicleRetirement, JwtService],
  controllers: [VehicleController],
  exports: [VehicleService],
})
export class VehicleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/vehicles', method: RequestMethod.GET },
      { path: '/vehicles/drives', method: RequestMethod.GET },
      { path: '/vehicles', method: RequestMethod.POST },
      { path: '/vehicles/:id/maintenances', method: RequestMethod.POST },
      {
        path: '/vehicles/:id/maintenances/:maintenanceId',
        method: RequestMethod.PUT,
      },
      {
        path: '/vehicles/:id/maintenances/:maintenanceId',
        method: RequestMethod.GET,
      },
      { path: '/vehicles/:id/shares', method: RequestMethod.POST },
      { path: '/vehicles/:id/shares', method: RequestMethod.GET },
      { path: '/vehicles/:id/shares/:shareId', method: RequestMethod.GET },
      { path: '/vehicles/:id/shares/:shareId', method: RequestMethod.PUT },
      { path: '/vehicles/:id/retirement', method: RequestMethod.POST },
      { path: '/vehicles/:id/maintenances', method: RequestMethod.GET },
      { path: '/vehicles/:id', method: RequestMethod.PUT },
      { path: '/vehicles/:id', method: RequestMethod.GET },
      { path: '/vehicles/:id', method: RequestMethod.DELETE }
    );
  }
}
