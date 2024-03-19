// import { Test, TestingModule } from '@nestjs/testing';
// import { ProcedureController } from '../controller/procedures.controller';
// import { ProcedureService } from '../services/procedures.service';

// describe('ProcedureService', () => {
//   let procedureController: ProcedureController;
//   let procedureService: ProcedureService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [ProcedureController],
//       providers: [
//         {
//           provide: ProcedureService,
//           useValue: {
//             create: jest.fn(),
//             findAll: jest.fn(),
//             findOne: jest.fn(),
//             update: jest.fn(),
//             archive: jest.fn()
//           },
//         },
//       ],
//     }).compile();
//     procedureController = module.get<ProcedureController>(ProcedureController);
//     procedureService = module.get<ProcedureService>(ProcedureService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('create', () => {
//     const procedureData = {
//       name: 'hello1',
//       description: 'test1@gmail.com',
//       procedure_type_id: BigInt(1),
//       is_active: false,
//       external_reference: 'ASDFGH',
//       forbidUnknownValues: true as true, // Update the type explicitly
//       procedure_products: [
//         {
//           procedures_id : BigInt(1),
//           quantity: 1,
//           product_id: BigInt(1),
//           forbidUnknownValues: true as true, // Update the type explicitly
//         },
//         {
//           procedures_id : BigInt(1),
//           quantity: 3,
//           product_id: BigInt(2),
//           forbidUnknownValues: true as true, // Update the type explicitly

//         },
//       ],
//       created_by: BigInt(1),
//     };

//     const createdProcedure = {
//       status: 'success',
//       response: 'Procedure Created Successfully',
//       status_code: 201,
//       data: {
//         id: BigInt(1),
//         name: 'hello1',
//         description: 'test1@gmail.com',
//         is_active: false,
//         created_by: BigInt(1),
//         external_reference: 'ASDFGH',
//         procedure_type_id: BigInt(1),
//         created_at: new Date()
//       },
//     };

//     it('should create a new procedure', async () => {
//       jest.spyOn(procedureService, 'create').mockResolvedValue(createdProcedure);

//       const result = await procedureController.create(procedureData);
//       expect(result).toEqual(createdProcedure);
//       expect(procedureService.create).toHaveBeenCalledWith(procedureData);
//     });
//   });

//   describe('listOfAllProcedures', () => {
//     const procedureId = BigInt(123);
//     const procedureSearch = {
//       page: 1,
//       name: '',
//       status: '',
//       goal_type: '',
//     };
//     const procedure = {
//       id: procedureId,
//       name: 'test',
//       description: 'abc',
//       external_reference: 'Password',
//       is_active: true,
//       created_at: new Date(),
//       procedure_products: [
//         {
//           id: BigInt(1),
//           procedures_id: procedureId,
//           product_id: BigInt(2),
//           quantity: 1,
//           products: [
//             {
//               id: "2",
//               name: "bbcs",
//               short_description: "sndjsd",
//               description: "sdjjsdjb",
//               is_active: true,
//               external_reference: null,
//               created_at: new Date()
//             }
//           ]
//         }

//       ]
//     };

//     it('should get all procedures', async () => {
//       jest.spyOn(procedureService, 'findAll').mockResolvedValue(procedure);
//       const result = await procedureController.findAll(procedureSearch);
//       expect(result).toEqual(procedure);
//       expect(procedureService.findAll).toHaveBeenCalledWith(procedureSearch);
//     });
//   });

//   describe('GetSingleProcedure', () => {
//     const id = BigInt(1);
//     const input = {
//       id: id
//     };

//     const procedure = {
//       id: id,
//       name: 'test',
//       description: 'abc',
//       external_reference: 'Password',
//       is_active: true,
//       created_at: new Date(),
//       procedure_type_id: {
//           id: id,
//           name: "bbcs",
//           short_description: "sndjsd",
//           description: "sdjjsdjb",
//           is_goal_type: true,
//           procedure_duration: 0,
//           is_generate_online_appointments: true,
//           is_active: true,
//           created_at: new Date(),
//           products: [
//             {
//               id: "2",
//               name: "bbcs",
//               short_description: "sndjsd",
//               description: "sdjjsdjb",
//               is_active: true,
//               external_reference: null,
//               created_at: new Date()
//             }
//           ]
//         },
//         procedure_products : [
//           {
//             id: id,
//             procedures_id: id,
//             product_id: id,
//             quantity: id,
//             products: [
//               {
//                 id: "2",
//                 name: "bbcs",
//                 short_description: "sndjsd",
//                 description: "sdjjsdjb",
//                 is_active: true,
//                 external_reference: null,
//                 created_at: new Date()
//               }
//             ]
//           }
//         ]
//       };

//     it('should get a single procedure', async () => {
//       jest.spyOn(procedureService, 'findOne').mockResolvedValue(procedure);

//       const result = await procedureController.findOne(input);
//       expect(result).toEqual(procedure);
//       expect(procedureService.findOne).toHaveBeenCalledWith(input);
//     });
//   });

//   describe('update', () => {
//     const procedureId = {
//       id: BigInt(1),
//     };
//     const procedureData = {
//       name: 'hello1',
//       description: 'test1@gmail.com',
//       procedure_type_id: BigInt(1),
//       is_active: false,
//       external_reference: 'ASDFGH',
//       forbidUnknownValues: true as true, // Update the type explicitly
//       procedure_products: [],
//       created_by: BigInt(1),
//       updated_by: BigInt(1),

//     };

//     const updatedTenant:any = {
//       status: 'Success',
//       response: 'Changes Saved.',
//       status_code: 204,
//     };

//     it('should update a procedure', async () => {
//       jest.spyOn(procedureService, 'update').mockResolvedValue(updatedTenant);

//       const result = await procedureController.update(procedureId, procedureData);
//       expect(result).toEqual(updatedTenant);
//       expect(procedureService.update).toHaveBeenCalledWith(procedureId, procedureData);
//     });
//   });

//   describe('archive', () => {
//     const procedureId = {
//       id: BigInt(1),
//     };

//     const updatedTenant:any = {
//       status: 'Success',
//       response: 'Changes Saved.',
//       status_code: 204,
//     };

//     it('should update a procedure', async () => {
//       jest.spyOn(procedureService, 'archive').mockResolvedValue(updatedTenant);

//       const result = await procedureController.archive(procedureId);
//       expect(result).toEqual(updatedTenant);
//       expect(procedureService.archive).toHaveBeenCalledWith(procedureId);
//     });
//   });

// });

describe('calculateSumSource', () => {
  it('should calculate the sum of two numbers', () => {
    const num1 = 5;
    const num2 = 10;
    const expectedResult = 15;

    const result = calculateSumSource(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of negative and positive numbers', () => {
    const num1 = -8;
    const num2 = 3;
    const expectedResult = -5;

    const result = calculateSumSource(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of zero and a number', () => {
    const num1 = 0;
    const num2 = 7;
    const expectedResult = 7;

    const result = calculateSumSource(num1, num2);

    expect(result).toEqual(expectedResult);
  });
});

function calculateSumSource(a: number, b: number): number {
  return a + b;
}
