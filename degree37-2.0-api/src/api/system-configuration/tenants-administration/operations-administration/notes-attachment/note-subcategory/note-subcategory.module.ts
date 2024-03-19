import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { Category } from '../../../crm-administration/common/entity/category.entity';
import { CategoryHistory } from '../../../crm-administration/common/entity/categoryhistory.entity';
import { NoteSubCategoryController } from './controller/note-subcategory.controller';
import { NoteSubCategoryService } from './services/note-subcategory.service';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, CategoryHistory, Permissions]),
  ],
  controllers: [NoteSubCategoryController],
  providers: [NoteSubCategoryService, JwtService],
  exports: [NoteSubCategoryService],
})
export class NoteSubCategoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'note-attachment/note-subcategory',
        method: RequestMethod.POST,
      },
      {
        path: 'note-attachment/note-subcategory',
        method: RequestMethod.GET,
      },
      {
        path: 'note-attachment/note-subcategory/:id',
        method: RequestMethod.GET,
      },
      {
        path: 'note-attachment/note-subcategory/:id',
        method: RequestMethod.PUT,
      },
      {
        path: 'note-attachment/note-subcategory/:id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
