import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { ProcedureTypes } from '../procedure-types/entities/procedure-types.entity';
import { Products } from '../products/entities/products.entity';
import { ProcedureController } from './controller/procedures.controller';
import { Procedure } from './entities/procedure.entity';
import { ProcedureHistory } from './entities/procedures-history.entity';
import { ProceduresProducts } from './entities/procedures-products.entity';
import { ProcedureService } from './services/procedures.service';
import { AuthMiddleware } from 'src/api/middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Products,
      Procedure,
      ProcedureTypes,
      ProceduresProducts,
      ProcedureHistory,
      Permissions,
    ]),
  ],
  controllers: [ProcedureController],
  providers: [ProcedureService, JwtService],
  exports: [ProcedureService],
})
export class ProcedureModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/procedures', method: RequestMethod.GET },
        { path: '/procedures', method: RequestMethod.POST },
        { path: '/procedures/:id', method: RequestMethod.PUT },
        { path: '/procedures/:id', method: RequestMethod.GET },
        { path: '/procedures/:id', method: RequestMethod.PATCH }
      );
  }
}
