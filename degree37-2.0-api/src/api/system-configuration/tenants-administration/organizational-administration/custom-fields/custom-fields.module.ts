import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CustomFieldsService } from './services/custom-fields.service';
import { CustomFieldsController } from './controller/custom-fields.controller';
import { CustomFieldsDataHistory } from './entities/custom-filed-data-history';
import { User } from '../../user-administration/user/entity/user.entity';
import { CustomFields } from './entities/custom-field.entity';
import { PickLists } from './entities/pick-lists.entity';
import { CustomFieldsData } from './entities/custom-filed-data.entity';
import { CustomFieldsHistory } from './entities/custome-field-history.entity';
import { PickListsHistory } from './entities/pick-lists-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      CustomFields,
      PickLists,
      CustomFieldsData,
      CustomFieldsHistory,
      PickListsHistory,
      CustomFieldsDataHistory,
      Permissions,
    ]),
  ],
  controllers: [CustomFieldsController],
  providers: [CustomFieldsService, JwtService],
  exports: [CustomFieldsService],
})
export class CustomFieldsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/system-configuration/organization-administration/custom-fields',
        method: RequestMethod.POST,
      },
      {
        path: '/system-configuration/organization-administration/custom-fields',
        method: RequestMethod.GET,
      },
      {
        path: '/system-configuration/organization-administration/custom-fields/modules/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/system-configuration/organization-administration/custom-fields/data',
        method: RequestMethod.POST,
      },
      {
        path: '/system-configuration/organization-administration/custom-fields/data',
        method: RequestMethod.PUT,
      },
      {
        path: '/system-configuration/organization-administration/custom-fields/data',
        method: RequestMethod.GET,
      },
      {
        path: '/system-configuration/organization-administration/custom-fields/:id',
        method: RequestMethod.GET,
      },
      {
        path: '/system-configuration/organization-administration/custom-fields/:id',
        method: RequestMethod.PUT,
      },
      {
        path: '/system-configuration/organization-administration/custom-fields/archive/:id',
        method: RequestMethod.PATCH,
      }
    );
  }
}
