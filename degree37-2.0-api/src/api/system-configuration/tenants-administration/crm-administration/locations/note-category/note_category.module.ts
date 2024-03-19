import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteCategoryController } from './controller/note_category.controller';
import { NoteCategoryService } from './services/note_category.services';
import { Category } from '../../common/entity/category.entity';
import { CategoryHistory } from '../../common/entity/categoryhistory.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { User } from '../../../../tenants-administration/user-administration/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, CategoryHistory, Category, Permissions]),
  ],
  controllers: [NoteCategoryController],
  providers: [NoteCategoryService, JwtService],
  exports: [NoteCategoryService],
})
export class LocationsNoteCategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/locations/note-category', method: RequestMethod.POST },
        { path: '/locations/note-category', method: RequestMethod.GET },
        { path: '/locations/note-category/:id', method: RequestMethod.GET },
        { path: '/locations/note-category/:id', method: RequestMethod.PUT },
        { path: '/locations/note-category/:id', method: RequestMethod.PATCH }
      );
  }
}
