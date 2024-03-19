import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { DailyHour } from './entities/daily-hour.entity';
import { DailyHourController } from './controller/daily-hour.controller';
import { DailyHourService } from './services/daily-hour.service';
import { BusinessUnits } from '../../../organizational-administration/hierarchy/business-units/entities/business-units.entity';
import { DailyHourHistory } from './entities/daily-hour-history.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      DailyHour,
      BusinessUnits,
      DailyHourHistory,
      Permissions,
    ]),
  ],
  controllers: [DailyHourController],
  providers: [DailyHourService, JwtService],
  exports: [DailyHourService],
})
export class DailyHourModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/booking-drive/daily-hour',
        method: RequestMethod.GET,
      },
      {
        path: '/booking-drive/daily-hour',
        method: RequestMethod.POST,
      },
      {
        path: '/booking-drive/daily-hour/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/booking-drive/daily-hour/:id',
        method: RequestMethod.PUT,
      },

      {
        path: '/booking-drive/daily-hour/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: '/booking-drive/daily-hour/drive',
        method: RequestMethod.GET,
      }
    );
  }
}
