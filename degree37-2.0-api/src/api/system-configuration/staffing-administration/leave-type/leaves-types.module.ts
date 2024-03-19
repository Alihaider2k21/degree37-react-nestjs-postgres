import {
  Module,
  RequestMethod,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeavesController } from './controller/leaves-types.controller';
import { LeavesTypesServices } from './service/leaves-types.service';
import { LeavesTypes } from './entities/leave-types.entity';
import { User } from '../../tenants-administration/user-administration/user/entity/user.entity';
import { LeavesTypesHistory } from './entities/leaves-types-history.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      LeavesTypes,
      LeavesTypesHistory,
      Permissions,
    ]),
  ],
  controllers: [LeavesController],
  providers: [LeavesTypesServices, JwtService],
  exports: [LeavesTypesServices],
})
export class LeavesTypesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: '/staffing-admin/leave-type', method: RequestMethod.GET },
      { path: '/staffing-admin/leave-type/:id', method: RequestMethod.GET },
      { path: '/staffing-admin/leave-type', method: RequestMethod.POST },
      { path: '/staffing-admin/leave-type/:id', method: RequestMethod.PUT },
      {
        path: '/staffing-admin/leave-type/archive/:id',
        method: RequestMethod.PUT,
      }
    );
  }
}
