import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user-administration/user/entity/user.entity';
import { Territory } from './entities/territories.entity';
import { TerritoryController } from './controller/territories.controller';
import { TerritoryService } from './services/territories.service';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { TerritoryHistory } from './entities/territories-history.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Tenant,
      Territory,
      TerritoryHistory,
      Permissions,
    ]),
  ],
  controllers: [TerritoryController],
  providers: [TerritoryService, JwtService],
  exports: [TerritoryService],
})
export class TerritoriesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/territories', method: RequestMethod.POST },
        { path: '/territories', method: RequestMethod.GET },
        { path: '/territories/:id', method: RequestMethod.GET },
        { path: '/territories/:id', method: RequestMethod.PUT },
        { path: '/territories/:id', method: RequestMethod.PATCH }
      );
  }
}
