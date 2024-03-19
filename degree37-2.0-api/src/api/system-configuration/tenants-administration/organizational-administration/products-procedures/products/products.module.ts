import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './controller/products.controller';
import { ProductsService } from './services/products.service';
import { Products } from './entities/products.entity';
import { User } from '../../../user-administration/user/entity/user.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Products, Permissions])],
  controllers: [ProductsController],
  providers: [ProductsService, JwtService],
  exports: [ProductsService],
})
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/products', method: RequestMethod.GET });
  }
}
