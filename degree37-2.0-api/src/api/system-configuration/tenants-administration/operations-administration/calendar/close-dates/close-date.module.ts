import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CloseDateService } from './services/close-date.services';
import { CloseDateController } from './controller/close-date.controller';
import { CloseDate } from './entities/close-date.entity';
import { CloseDateCollectionOperation } from './entities/close-date-collection-operations.entity';
import { CloseDateHistory } from './entities/close-date-history.entity';

import { User } from '../../../user-administration/user/entity/user.entity';
import { AuthMiddleware } from '../../../../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CloseDateCollectionOperation,
      CloseDate,
      CloseDateHistory,
      User,
      Permissions,
    ]),
  ],
  providers: [CloseDateService, JwtService],
  controllers: [CloseDateController],
  exports: [CloseDateService],
})
export class CloseDateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/close-dates', method: RequestMethod.GET },
        { path: '/close-dates', method: RequestMethod.POST },
        { path: '/close-dates/:id', method: RequestMethod.GET },
        { path: '/close-dates/:id', method: RequestMethod.PUT },
        { path: '/close-dates/:id', method: RequestMethod.DELETE },
        { path: '/close-dates/is_closed', method: RequestMethod.GET }
      );
  }
}
