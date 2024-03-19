import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { Category } from '../../common/entity/category.entity';
import { CategoryHistory } from '../../common/entity/categoryhistory.entity';
import { NoteSubCategoryController } from './controller/note_subcategory.controller';
import { NoteSubCategoryService } from './services/note_subcategory.services';
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
export class LocationNoteSubCategoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/locations/note-subcategory', method: RequestMethod.POST },
        { path: '/locations/note-subcategory', method: RequestMethod.GET },
        { path: '/locations/note-subcategory/:id', method: RequestMethod.GET },
        { path: '/locations/note-subcategory/:id', method: RequestMethod.PUT },
        { path: '/locations/note-subcategory/:id', method: RequestMethod.PATCH }
      );
  }
}
