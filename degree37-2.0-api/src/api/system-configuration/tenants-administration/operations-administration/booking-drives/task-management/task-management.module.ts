import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TaskManagementService } from './services/task-management.service';
import { TaskManagementController } from './controller/task-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskManagement } from './entities/task-management.entity';
import { User } from '../../../user-administration/user/entity/user.entity';
import { AuthMiddleware } from '../../../../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { TaskManagementHistory } from './entities/task-management-history.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { TaskCollectionOperation } from './entities/task-management-collection-operation.entity';
import { BusinessUnits } from '../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      TaskManagement,
      TaskManagementHistory,
      Permissions,
      TaskCollectionOperation,
      BusinessUnits,
    ]),
  ],
  controllers: [TaskManagementController],
  providers: [TaskManagementService, JwtService],
  exports: [TaskManagementService],
})
export class TaskManagementModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/booking-drive/task',
        method: RequestMethod.POST,
      },
      {
        path: '/booking-drive/task',
        method: RequestMethod.GET,
      },
      {
        path: '/booking-drive/task/:id',
        method: RequestMethod.GET,
      },
      { path: '/booking-drive/task/:id', method: RequestMethod.PUT },
      { path: '/booking-drive/task/archive/:id', method: RequestMethod.PATCH }
    );
  }
}
