import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserEventService } from './services/user-event.service';
import { UserEventController } from './controller/user-event.controller';
import UserEvents from './entities/user-event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpApiService } from './services/ip-api.service';
import { UserModule } from '../tenants-administration/user-administration/user/user.module';
import { ReportService } from './services/report.service';
import { ReportController } from './controller/reports.controller';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from '../platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { User } from '../tenants-administration/user-administration/user/entity/user.entity';
@Module({
  controllers: [UserEventController, ReportController],
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserEvents, Permissions, User]),
  ],
  providers: [UserEventService, IpApiService, ReportService, JwtService],
  exports: [UserEventService],
})
export class LogsEventModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/reports/:type', method: RequestMethod.GET });
  }
}
