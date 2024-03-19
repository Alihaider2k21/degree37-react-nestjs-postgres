import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ApplicationService } from './services/application.service';
import { ApplicationController } from './controller/application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applications } from './entities/application.entity';
import { Modules } from '../role-permissions/entities/module.entity';
import { Tenant } from '../../tenant-onboarding/tenant/entities/tenant.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Applications,
      Modules,
      Tenant,
      User,
      Permissions,
    ]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, JwtService],
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/application/tenant-permissions',
      method: RequestMethod.GET,
    });
  }
}
