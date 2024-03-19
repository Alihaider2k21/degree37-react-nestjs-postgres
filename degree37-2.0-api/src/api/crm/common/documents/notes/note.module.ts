import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { NotesController } from './controller/note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from '../../../../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Category } from '../../../../system-configuration/tenants-administration/crm-administration/common/entity/category.entity';
import { User } from '../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Tenant } from '../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Notes } from './entities/note.entity';
import { NotesService } from './services/note.service';
import { NotesHistory } from './entities/note-history.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      User,
      Tenant,
      Notes,
      NotesHistory,
      Permissions,
    ]),
  ],
  providers: [NotesService, JwtService],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/notes',
        method: RequestMethod.POST,
      },
      {
        path: '/notes',
        method: RequestMethod.GET,
      },
      {
        path: '/notes/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/notes/:id',
        method: RequestMethod.PUT,
      },
      {
        path: '/notes/archive/:id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
