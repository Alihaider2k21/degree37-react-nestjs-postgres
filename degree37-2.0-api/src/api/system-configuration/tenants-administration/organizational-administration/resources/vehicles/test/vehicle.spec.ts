import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { VehicleModule } from '../vehicle.module';
import { BusinessUnitModule } from '../../../hierarchy/business-units/business-units.module';
import { testingModuleConfigs } from '../../../../../../../../test/utils';

describe.skip('Vehicle', () => {
  let app: INestApplication;
  let userRepository: any;
  let vehicleRepository: any;
  let vehicleTypeRepository: any;
  let businessUnitsRepository: any;
  let loggedInUser: any;
  let vehicleType: any;
  let collectionOperation: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        VehicleModule,
        BusinessUnitModule,
        TypeOrmModule.forRoot(testingModuleConfigs()),
      ],
    }).compile();
    app = module.createNestApplication();
    userRepository = module.get('UserRepository');
    vehicleRepository = module.get('VehicleRepository');
    vehicleTypeRepository = module.get('VehicleTypeRepository');
    businessUnitsRepository = module.get('BusinessUnitsRepository');
    loggedInUser = await userRepository.save({
      first_name: 'John',
      last_name: 'Doe',
      unique_identifier: 'jd',
      email: 'jd@test.com',
      is_active: true,
    });
    collectionOperation = await businessUnitsRepository.save({
      name: 'Test',
      organizational_level_id: null,
      tenant_id: null,
      parent_level: null,
      created_by: loggedInUser.id,
    });
    vehicleType = await vehicleTypeRepository.save({
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
    await vehicleRepository.query('DELETE FROM vehicle;');
  });

  afterAll(async () => {
    await vehicleTypeRepository.query('DELETE FROM vehicle_type;');
    await businessUnitsRepository.query('DELETE FROM business_units;');
    await userRepository.query('DELETE FROM "user";');
    await app.close();
  });

  describe('GET /vehicles', () => {
    it('should return an array of vehicles', async () => {
      await vehicleRepository.save([
        {
          name: 'Test 1',
          short_name: 'Test 1',
          description: 'Test 1',
          vehicle_type_id: vehicleType.id,
          collection_operation_id: collectionOperation.id,
          certifications: [1],
          is_active: true,
          created_by: loggedInUser.id,
        },
        {
          name: 'Test 2',
          short_name: 'Test 2',
          description: 'Test 2',
          vehicle_type_id: vehicleType.id,
          collection_operation_id: collectionOperation.id,
          certifications: [2],
          is_active: true,
          created_by: loggedInUser.id,
        },
      ]);

      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/vehicles?fetchAll=true')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body.data.vehicles).toHaveLength(2);
    });
  });
});
