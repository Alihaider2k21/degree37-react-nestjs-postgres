import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controller/tasks.controller';
import { User } from '../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { AuthMiddleware } from '../middlewares/auth';
import { JwtService } from '@nestjs/jwt';
import { Tasks } from './entities/tasks.entity';
import { Tenant } from '../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { TasksHistory } from './entities/tasks-history.entity';
import { Permissions } from 'src/api/system-configuration/platform-administration/roles-administration/role-permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tasks, Tenant, TasksHistory, Permissions]),
  ],
  providers: [TasksService, JwtService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/tasks', method: RequestMethod.POST },
        { path: '/tasks', method: RequestMethod.GET },
        { path: '/tasks/:id', method: RequestMethod.GET },
        { path: '/tasks/:id', method: RequestMethod.PUT },
        { path: '/tasks/archive/:id', method: RequestMethod.PUT }
      );
  }
}
