import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourcesController } from './controller/sources.controller';
import { SourcesService } from './services/sources.service';
import { Sources } from './entities/sources.entity';
import { User } from '../../../user-administration/user/entity/user.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { SourcesHistory } from './entities/sources-history.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Sources, SourcesHistory, Permissions]),
  ],
  controllers: [SourcesController],
  providers: [SourcesService, JwtService],
  exports: [SourcesService],
})
export class SourcesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/accounts/sources', method: RequestMethod.POST },
        { path: '/accounts/sources', method: RequestMethod.GET },
        { path: '/accounts/sources/search', method: RequestMethod.POST },
        { path: '/accounts/sources/:id', method: RequestMethod.PUT },
        { path: '/accounts/sources/:id', method: RequestMethod.PATCH },
        { path: '/accounts/sources/:id', method: RequestMethod.GET }
      );
  }
}
