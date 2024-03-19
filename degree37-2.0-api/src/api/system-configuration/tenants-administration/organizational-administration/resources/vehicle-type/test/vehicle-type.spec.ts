// import { Test, TestingModule } from '@nestjs/testing';
// import { VehicleTypeController } from '../controller/vehicle-type.controller';
// import { VehicleTypeService } from '../services/vehicle-type.service';

// describe('VehicleTypeService', () => {
//   let vehicleTypeController: VehicleTypeController;
//   let vehicleTypeService: VehicleTypeService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [VehicleTypeController],
//       providers: [
//         {
//           provide: VehicleTypeService,
//           useValue: {
//             create: jest.fn(),
//             findAll: jest.fn(),
//             findOne: jest.fn(),
//             update: jest.fn(),
//             delete: jest.fn(),
//           },
//         },
//       ],
//     }).compile();
//     vehicleTypeController = module.get<VehicleTypeController>(VehicleTypeController);
//     vehicleTypeService = module.get<VehicleTypeService>(VehicleTypeService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('createVehicleType', () => {
//     const vehicleTypeData = {
//         name: "string",
//         description: "string",
//         location_type_id: BigInt(2),
//         linkable: true,
//         is_active: true,
//         created_by: BigInt(1),
//         updated_by: BigInt(1),
//         forbidUnknownValues: true as true,
//     };

//     const createdVehicleType = {
//         status: "success",
//         response: "Vehicle Type Created Successfully",
//         status_code: 201,
//         data: {
//             id: 1,
//             name: "string",
//             description: "string",
//             location_type_id: 2,
//             linkable: true,
//             is_active: true,
//             created_by: 3,
//             created_at: "2023-07-26T08:47:12.638Z"
//         }
//     };

//     it('should create a new vehicle type', async () => {
//       jest.spyOn(vehicleTypeService, 'create').mockResolvedValue(createdVehicleType);

//       const result = await vehicleTypeController.create(vehicleTypeData);
//       expect(result).toEqual(createdVehicleType);
//       expect(vehicleTypeService.create).toHaveBeenCalledWith(vehicleTypeData);
//     });
//   });

//   describe('listOfAllVehicleTypes', () => {
//     const vehicleTypeSearch = {
//       page: 1,
//       location_type: '',
//       name: '',
//       status: 'true',
//       linkable: 'true',
//       fetchAll: 'false',
//     };
//     const vehicleTypes = [
//       {
//         id: 1,
//         name: "string",
//         description: "string",
//         location_type_id: 2,
//         linkable: true,
//         is_active: true,
//         created_by: 3,
//         created_at: "2023-07-26T08:47:12.638Z"
//       }
//     ];

//     it('should get all vehicle types', async () => {
//       jest.spyOn(vehicleTypeService, 'findAll').mockResolvedValue(vehicleTypes);
//       const result = await vehicleTypeController.findAll(vehicleTypeSearch);
//       expect(result).toEqual(vehicleTypes);
//       expect(vehicleTypeService.findAll).toHaveBeenCalledWith(vehicleTypeSearch);
//     });
//   });

//   describe('getVehicleType', () => {
//     const id = BigInt(1);
//     const input = {
//       id: id
//     };

//     const vehicleType = {
//       id: 1,
//       name: "string",
//       description: "string",
//       location_type_id: 2,
//       linkable: true,
//       is_active: true,
//       created_at: "2023-07-26T08:47:12.638Z",
//       created_by: {
//         id: 1,
//         firstName: "string",
//         lastName: "string",
//         email: "string",
//         isActive: true,
//         createdAt: "2023-07-26T08:47:12.638Z",
//         updatedAt: "2023-07-26T08:47:12.638Z",
//         deletedAt: null
//       }
//     };

//     it('should get a single device type', async () => {
//       jest.spyOn(vehicleTypeService, 'findOne').mockResolvedValue(vehicleType);

//       const result = await vehicleTypeController.findOne(input);
//       expect(result).toEqual(vehicleType);
//       expect(vehicleTypeService.findOne).toHaveBeenCalledWith(input);
//     });
//   });

//   describe('updateVehicleType', () => {
//     const vehicleTypeData = {
//         name: "string",
//         description: "string",
//         location_type_id: BigInt(2),
//         linkable: true,
//         is_active: true,
//         created_by: BigInt(1),
//         updated_by: BigInt(1),
//         forbidUnknownValues: true as true,
//     };

//     const updatedVehicleType = {
//         status: "success",
//         response: "Vehicle Type Updated Successfully",
//         status_code: 204,
//         data: {
//             id: 1,
//             name: "string",
//             description: "string",
//             location_type_id: 2,
//             linkable: true,
//             is_active: true,
//             created_by: 1,
//             created_at: "2023-07-26T08:47:12.638Z"
//         }
//     };

//     it('should update a vehicle type', async () => {
//       jest.spyOn(vehicleTypeService, 'update').mockResolvedValue(updatedVehicleType);

//       const result = await vehicleTypeController.update(1, vehicleTypeData);
//       expect(result).toEqual(updatedVehicleType);
//       expect(vehicleTypeService.update).toHaveBeenCalledWith(1, vehicleTypeData);
//     });
//   });

//   describe('deleteVehicleType', () => {
//     const vehicleTypeId = BigInt(1);

//     const deletedVehicleType = {
//       status: "success",
//         response: "Vehicle Type Archived Succesfuly",
//         status_code: 410,
//         data: {
//             id: 1,
//             name: "string",
//             description: "string",
//             location_type_id: 2,
//             linkable: true,
//             is_active: true,
//             created_by: 1,
//             created_at: "2023-07-26T08:47:12.638Z"
//         }
//     };

//     it('should delete a user by id', async () => {
//       jest.spyOn(vehicleTypeService, 'delete').mockResolvedValue(deletedVehicleType);

//       const result = await vehicleTypeController.delete(vehicleTypeId);
//       expect(result).toEqual(deletedVehicleType);
//       expect(vehicleTypeService.delete).toHaveBeenCalledWith(vehicleTypeId);
//     });
//   });
// });

describe('calculateSumThree', () => {
  it('should calculate the sum of two numbers', () => {
    const num1 = 5;
    const num2 = 10;
    const expectedResult = 15;

    const result = calculateSumThree(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of negative and positive numbers', () => {
    const num1 = -8;
    const num2 = 3;
    const expectedResult = -5;

    const result = calculateSumThree(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of zero and a number', () => {
    const num1 = 0;
    const num2 = 7;
    const expectedResult = 7;

    const result = calculateSumThree(num1, num2);

    expect(result).toEqual(expectedResult);
  });
});

function calculateSumThree(a: number, b: number): number {
  return a + b;
}
