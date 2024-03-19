import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LockDateService } from './services/lock-date.services';
import { LockDateController } from './controller/lock-date.controller';
import { LockDate } from './entities/lock-date.entity';
import { LockDateCollectionOperation } from './entities/lock-date-collection-operations.entity';
import { LockDateHistory } from './entities/lock-date-history.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

import { User } from '../../../user-administration/user/entity/user.entity';
import { AuthMiddleware } from '../../../../../../api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LockDateCollectionOperation,
      LockDate,
      LockDateHistory,
      User,
      Tenant,
      Permissions,
    ]),
  ],
  providers: [LockDateService, JwtService],
  controllers: [LockDateController],
  exports: [LockDateService],
})
export class LockDateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/lock-dates', method: RequestMethod.GET },
        { path: '/lock-dates', method: RequestMethod.POST },
        { path: '/lock-dates/:id', method: RequestMethod.GET },
        { path: '/lock-dates/:id', method: RequestMethod.PUT },
        { path: '/lock-dates/:id', method: RequestMethod.DELETE }
      );
  }
}
