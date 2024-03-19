import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { Category } from '../../../crm-administration/common/entity/category.entity';
import { CategoryHistory } from '../../../crm-administration/common/entity/categoryhistory.entity';
import { NoteCategoryController } from './controller/note-category.controller';
import { NoteCategoryService } from './services/note-category.service';
import { AuthMiddleware } from '../../../../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, CategoryHistory, Permissions]),
  ],
  controllers: [NoteCategoryController],
  providers: [NoteCategoryService, JwtService],
  exports: [NoteCategoryService],
})
export class NoteCategoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'note-attachment/note-category', method: RequestMethod.POST },
      { path: 'note-attachment/note-category', method: RequestMethod.GET },
      {
        path: 'note-attachment/note-category/:id',
        method: RequestMethod.GET,
      },
      {
        path: 'note-attachment/note-category/:id',
        method: RequestMethod.PUT,
      },
      {
        path: 'note-attachment/note-category/:id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
