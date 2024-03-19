import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SuffixesService } from './service/suffixes.service';
import { SuffixesController } from './controller/suffixes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Suffixes } from './entities/suffixes.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Suffixes, Permissions])],
  controllers: [SuffixesController],
  providers: [SuffixesService, JwtService],
})
export class SuffixesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/suffixes', method: RequestMethod.GET });
  }
}
