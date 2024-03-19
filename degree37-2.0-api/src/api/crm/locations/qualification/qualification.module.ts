import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QualificationController } from './controller/qualification.controller';
import { QualificationService } from './service/qualification.service';
import { Qualification } from './entities/qualification.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from '../../../middlewares/auth';
import { QualificationHistory } from './entities/qualification-history.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Qualification,
      QualificationHistory,
      Permissions,
    ]),
  ],
  controllers: [QualificationController],
  providers: [QualificationService, JwtService],
  exports: [QualificationService],
})
export class QualificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      // { path: "/stages/:id", method: RequestMethod.PUT },
      {
        path: '/locations/:location_id/qualification',
        method: RequestMethod.GET,
      },
      {
        path: '/locations/:location_id/qualification',
        method: RequestMethod.POST,
      },
      {
        path: '/locations/:location_id/qualification/:id',
        method: RequestMethod.DELETE,
      }
    );
  }
}
