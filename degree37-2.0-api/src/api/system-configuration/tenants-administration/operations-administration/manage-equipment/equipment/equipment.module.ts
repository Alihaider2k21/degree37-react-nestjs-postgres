import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentController } from './controller/equipment_controller';
import { EquipmentService } from './services/equipment_services';
import { EquipmentEntity } from './entity/equipment.entity';
import { EquipmentCollectionOperationEntity } from './entity/equipment-collection-operations.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { User } from '../../../user-administration/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { EquipmentRetirement } from '../equipment/cron/equipment-retirement.cron';
import { BusinessUnits } from '../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { EquipmentHistory } from './entity/equipment-history.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      EquipmentEntity,
      BusinessUnits,
      EquipmentCollectionOperationEntity,
      EquipmentHistory,
      Permissions,
    ]),
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService, JwtService, EquipmentRetirement],
  exports: [EquipmentService],
})
export class EquipmentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/marketing-equipment/equipment',
        method: RequestMethod.POST,
      },
      {
        path: '/marketing-equipment/equipment/drives',
        method: RequestMethod.GET,
      },
      {
        path: '/marketing-equipment/equipment/:equipmentId',
        method: RequestMethod.PUT,
      },
      {
        path: '/marketing-equipment/equipment',
        method: RequestMethod.GET,
      },
      {
        path: '/marketing-equipment/equipment/:equipmentId',
        method: RequestMethod.GET,
      },
      {
        path: '/marketing-equipment/equipment/archive/:equipmentId',
        method: RequestMethod.PATCH,
      }
    );
  }
}
