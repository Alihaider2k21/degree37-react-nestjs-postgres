import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { TasksModule } from '../tasks.module';
import { testingModuleConfigs } from 'test/utils';

describe.skip('Tasks', () => {
  let app: INestApplication;
  let userRepository: any;
  let tasksRepository: any;
  let taskHistoryRepository: any;
  let loggedInUser: any;
  let tasksType: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TasksModule, TypeOrmModule.forRoot(testingModuleConfigs())],
    }).compile();
    app = module.createNestApplication();
    userRepository = module.get('UserRepository');
    tasksRepository = module.get('tasksRepository');
    taskHistoryRepository = module.get('taskHistoryRepository');
    loggedInUser = await userRepository.save({
      first_name: 'John',
      last_name: 'Doe',
      unique_identifier: 'jd',
      email: 'jd@test.com',
      is_active: true,
    });
    tasksType = await taskHistoryRepository.save({
      name: 'Test',
      location_type_id: 1,
      description: 'Test',
      linkable: true,
      is_active: true,
      created_by: loggedInUser.id,
    });
    await app.init();
  });

  afterEach(async () => {
    await tasksRepository.query('DELETE FROM tasks;');
  });

  afterAll(async () => {
    await taskHistoryRepository.query('DELETE FROM task_history;');
    await userRepository.query('DELETE FROM "user";');
    await app.close();
  });

  describe('GET /tasks', () => {
    it('should return an array of tasks', async () => {
      await tasksRepository.save([
        {
          assigned_by: loggedInUser.id,
          assigned_to: loggedInUser.id,
          created_by: loggedInUser.id,
          due_date: '26-03-2023',
          task_name: 'Test 1',
          description: 'Test 1',
          status: 1,
          taskable_id: '1',
          taskable_type: 'accounts',
          taskable_name: 'account',
          tenant_id: loggedInUser.id,
          is_active: true,
        },
        {
          assigned_by: loggedInUser.id,
          assigned_to: loggedInUser.id,
          created_by: loggedInUser.id,
          due_date: '26-03-2023',
          task_name: 'Test 2',
          description: 'Test 2',
          status: 2,
          taskable_id: '1',
          taskable_type: 'staff',
          taskable_name: 'staff',
          tenant_id: loggedInUser.id,
          is_active: true,
        },
      ]);

      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/tasks?fetchAll=true')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body.data.tasks).toHaveLength(2);
    });
  });
});
