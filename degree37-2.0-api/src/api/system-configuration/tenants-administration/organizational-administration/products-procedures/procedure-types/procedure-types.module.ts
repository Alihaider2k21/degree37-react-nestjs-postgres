import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcedureTypesController } from './controller/procedure-types.controller';
import { ProcedureTypesService } from './services/procedure-types.service';
import { ProcedureTypes } from './entities/procedure-types.entity';
import { ProcedureTypesProducts } from './entities/procedure-types-products.entity';
import { Products } from '../products/entities/products.entity';
import { User } from '../../../user-administration/user/entity/user.entity';
import { ProcedureTypesHistory } from './entities/procedure-types-history.entity';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Products,
      ProcedureTypes,
      ProcedureTypesProducts,
      ProcedureTypesHistory,
      Permissions,
    ]),
  ],
  controllers: [ProcedureTypesController],
  providers: [ProcedureTypesService, JwtService],
  exports: [ProcedureTypesService],
})
export class ProcedureTypesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/procedure_types', method: RequestMethod.GET },
        { path: '/procedure_types', method: RequestMethod.POST },
        { path: '/procedure_types/:id', method: RequestMethod.GET },
        { path: '/procedure_types/:id', method: RequestMethod.PUT },
        { path: '/procedure_types/:id', method: RequestMethod.PATCH }
      );
  }
}
