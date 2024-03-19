import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { OrganizationalLevels } from './entities/organizational-level.entity';
import { OrganizationalLevelController } from './controller/organizational-level.controller';
import { OrganizationalLevelService } from './services/organizational-level.service';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { OrganizationalLevelsHistory } from './entities/organizational-level-history.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      OrganizationalLevels,
      Tenant,
      OrganizationalLevelsHistory,
      Permissions,
    ]),
  ],
  controllers: [OrganizationalLevelController],
  providers: [OrganizationalLevelService, JwtService],
  exports: [],
})
export class OrganizationalLevelModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/organizational_levels', method: RequestMethod.POST },
      { path: '/organizational_levels', method: RequestMethod.GET },
      { path: '/organizational_levels/:id', method: RequestMethod.PUT },
      {
        path: '/organizational_levels/archive/:id',
        method: RequestMethod.PATCH,
      },
      { path: '/organizational_levels/:id', method: RequestMethod.GET }
    );
  }
}
