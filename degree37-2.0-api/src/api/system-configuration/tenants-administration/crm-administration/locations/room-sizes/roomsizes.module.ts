import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomSizesService } from './services/roomSizes.service';
import { RoomSizeController } from './controller/roomsizes.controller';
import { RoomSize } from './entity/roomsizes.entity';
import { RoomSizesHistory } from './entity/roomSizesHistory.entity';
import { User } from '../../../user-administration/user/entity/user.entity';
import { AuthMiddleware } from '../../../../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomSize, RoomSizesHistory, User, Permissions]),
  ],
  providers: [RoomSizesService, JwtService],
  controllers: [RoomSizeController],
  exports: [RoomSizesService],
})
export class RoomSizesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/room-size/create', method: RequestMethod.POST },
        { path: '/room-size', method: RequestMethod.GET },
        { path: '/room-size/:id', method: RequestMethod.GET },
        { path: '/room-size/:id', method: RequestMethod.PUT },
        { path: '/room-size/archive/:id', method: RequestMethod.PATCH }
      );
  }
}
