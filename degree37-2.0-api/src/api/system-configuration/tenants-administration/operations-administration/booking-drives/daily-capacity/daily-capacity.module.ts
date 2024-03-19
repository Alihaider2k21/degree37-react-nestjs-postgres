import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { DailyCapacity } from './entities/daily-capacity.entity';
import { DailyCapacityController } from './controller/daily-capacity.controller';
import { DailyCapacityService } from './services/daily-capacity.service';
import { BusinessUnits } from '../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { DailyCapacityHistory } from './entities/daily-capacity-history.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      DailyCapacity,
      BusinessUnits,
      DailyCapacityHistory,
      Permissions,
    ]),
  ],
  controllers: [DailyCapacityController],
  providers: [DailyCapacityService, JwtService],
  exports: [DailyCapacityService],
})
export class DailyCapacityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/booking-drive/daily-capacity',
        method: RequestMethod.GET,
      },
      {
        path: '/booking-drive/daily-capacity',
        method: RequestMethod.POST,
      },
      {
        path: '/booking-drive/daily-capacity/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/booking-drive/daily-capacity/:id',
        method: RequestMethod.PUT,
      },
      {
        path: '/booking-drive/daily-capacity/:id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
