import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ContactsRoleService } from './services/contacts-role.service';
import { ContactsRoleController } from './controller/contacts-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { ContactsRoles } from './entities/contacts-role.entity';
import { ContactsRolesHistory } from './entities/contact-role-history.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ContactsRoles,
      ContactsRolesHistory,
      Permissions,
    ]),
  ],
  controllers: [ContactsRoleController],
  providers: [ContactsRoleService, JwtService],
  exports: [ContactsRoleService],
})
export class ContactsRoleModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/contact-roles', method: RequestMethod.GET },
        { path: '/contact-roles/:id', method: RequestMethod.GET },
        { path: '/contact-roles', method: RequestMethod.POST },
        { path: '/contact-roles/:id', method: RequestMethod.PUT },
        { path: '/contact-roles/:id', method: RequestMethod.PATCH }
      );
  }
}
