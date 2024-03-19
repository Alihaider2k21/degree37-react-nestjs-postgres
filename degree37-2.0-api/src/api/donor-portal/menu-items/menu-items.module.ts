import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemsController } from './controller/menu-items.controller';
import { MenuItems } from './entities/menu-items.entity';
import { MenuItemsService } from './services/menu-items.service';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([MenuItems, Permissions, User])],
  controllers: [MenuItemsController],
  providers: [MenuItemsService, JwtService],
  exports: [MenuItemsService],
})
export class MenuItemsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'api/menu-items', method: RequestMethod.GET },
        { path: 'api/menu-items', method: RequestMethod.POST },
        { path: 'api/menu-items/:id', method: RequestMethod.GET },
        { path: 'api/menu-items/:id', method: RequestMethod.PUT }
      );
  }
}
