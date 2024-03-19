import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { StagesController } from './controller/stages.controller';
import { StagesService } from './service/stages.service';
import { Stages } from './entities/stages.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from '../../../../../middlewares/auth';
import { StagesHistory } from './entities/stage-history.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Stages, StagesHistory, Permissions]),
  ],
  controllers: [StagesController],
  providers: [StagesService, JwtService],
  exports: [StagesService],
})
export class StagesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/stages/:id', method: RequestMethod.PUT },
        { path: '/stages', method: RequestMethod.GET },
        { path: '/stages', method: RequestMethod.POST },
        { path: '/stages/archive/:id', method: RequestMethod.PUT },
        { path: '/stages/:id', method: RequestMethod.GET }
      );
  }
}
