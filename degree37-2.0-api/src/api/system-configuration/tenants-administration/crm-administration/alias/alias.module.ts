import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AliasService } from './services/alias.service';
import { AliasController } from './controller/alias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alias } from './entities/alias.entity';
import { AliasHistory } from './entities/aliasHistory.entity';
import { AuthMiddleware } from '../../../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user-administration/user/entity/user.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alias, AliasHistory, User, Permissions])],
  providers: [AliasService, JwtService],
  controllers: [AliasController],
  exports: [AliasService],
})
/* alias-module */
export class AliasModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/crm-admin/alias', method: RequestMethod.POST },
        { path: '/crm-admin/alias', method: RequestMethod.GET }
      );
  }
}
