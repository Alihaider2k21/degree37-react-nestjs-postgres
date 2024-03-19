import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrefixesService } from './service/prefixes.service';
import { PrefixesController } from './controller/prefixes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Prefixes } from './entities/prefixes.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Prefixes, Permissions])],
  controllers: [PrefixesController],
  providers: [PrefixesService, JwtService],
})
export class PrefixesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/prefixes', method: RequestMethod.GET });
  }
}
