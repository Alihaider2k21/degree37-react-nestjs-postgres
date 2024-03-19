import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { OperationStatusService } from './services/operation-status.service';
import { OperationStatusController } from './controller/operation-status.controller';
import { OperationsStatus } from './entities/operations_status.entity';
import { OperationsStatusHistory } from './entities/operations_status_history.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { NonCollectionEvents } from 'src/api/operations-center/operations/non-collection-events/entities/oc-non-collection-events.entity';
import { Drives } from 'src/api/operations-center/operations/drives/entities/drives.entity';
import { Sessions } from 'src/api/operations-center/operations/sessions/entities/sessions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      OperationsStatus,
      OperationsStatusHistory,
      Permissions,
      NonCollectionEvents,
      Drives,
      Sessions,
    ]),
  ],
  controllers: [OperationStatusController],
  providers: [OperationStatusService, JwtService],
  exports: [OperationStatusService],
})
export class OperationStatusModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/booking-drive/operation-status',
        method: RequestMethod.POST,
      },
      {
        path: '/booking-drive/operation-status',
        method: RequestMethod.GET,
      },
      {
        path: '/booking-drive/operation-status/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/booking-drive/operation-status/:id',
        method: RequestMethod.PUT,
      },
      {
        path: '/booking-drive/operation-status/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: '/booking-drive/operation-status/association/:id',
        method: RequestMethod.GET,
      }
    );
  }
}
