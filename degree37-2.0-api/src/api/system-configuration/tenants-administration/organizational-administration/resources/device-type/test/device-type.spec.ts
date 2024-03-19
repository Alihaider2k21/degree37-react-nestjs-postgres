// import { Test, TestingModule } from '@nestjs/testing';
// import { DeviceTypeController } from "../controller/device-type.controller";
// import { DeviceTypeService } from '../services/device-type.services';

// describe('DeviceTypeController', () => {
//   let deviceTypeController: DeviceTypeController;
//   let deviceTypeService: DeviceTypeService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [DeviceTypeController],
//       providers: [
//         {
//           provide: DeviceTypeService,
//           useValue: {
//             findAll: jest.fn(),
//             create: jest.fn(),
//             addDeviceType: jest.fn(),
//             updateDeviceType: jest.fn(),
//             archiveDeviceType: jest.fn(),
//             find: jest.fn(),
//           },
//         },
//       ],
//     }).compile();
//     deviceTypeController = module.get<DeviceTypeController>(
//       DeviceTypeController,
//     );
//     deviceTypeService = module.get<DeviceTypeService>(
//       DeviceTypeService,
//     );
//   });

//   describe('createDeviceType', () => {
//     const createDeviceType = {
//       name: 'Heart Rate',
//       description: 'Heart Rate',
//       procedure_type: BigInt(1),
//       status: true,
//       created_by: BigInt(1),
//       forbidUnknownValues: true as true,
//     };

//     const deviceType: any = {
//       status: 'success',
//       response: '',
//       status_code: 201,
//       data: {
//         id: 26,
//         name: 'Heart Rate',
//         description: 'Heart Rate',
//         procedure_type: BigInt(1),
//         status: true,
//         created_by: BigInt(1),
//         created_at: new Date(),
//       },
//     };

//     it('should create device type', async () => {
//       jest.spyOn(deviceTypeService, 'addDeviceType').mockResolvedValue(deviceType);
//       const result = await deviceTypeController.addDeviceType(createDeviceType);
//       expect(result).toEqual(deviceType);
//       expect(deviceTypeService.addDeviceType).toHaveBeenCalledWith(createDeviceType);
//     });
//   });
//   describe('updateDeviceType', () => {
//     const updateDeviceType = {
//       id: BigInt(1),
//       name: 'Heart Rate',
//       description: 'Heart Rate',
//       procedure_type: BigInt(1),
//       status: true,
//       created_by: BigInt(1),
//       updated_by: BigInt(1),
//       forbidUnknownValues: true as true,
//     };

//     const deviceType: any = {
//       status: 'success',
//       response: '',
//       status_code: 201,
//       data: {
//         id: 26,
//         name: 'Heart Rate',
//         description: 'Heart Rate',
//         procedure_type: {
//           id: BigInt(1),
//           name: "TTTT",
//           short_description: "TTTTT",
//           description: "TTTTT",
//           is_goal_type: false,
//           procedure_duration: "1",
//           is_generate_online_appointments: false,
//           is_active: false,
//           created_at: "2023-07-31T08:41:14.859Z"
//         },
//         status: true,
//         created_by: BigInt(1),
//         created_at: new Date(),
//       },
//     };

//     it('should update device type', async () => {
//       jest.spyOn(deviceTypeService, 'updateDeviceType').mockResolvedValue(deviceType);
//       const result = await deviceTypeController.update(updateDeviceType);
//       expect(result).toEqual(deviceType);
//       expect(deviceTypeService.updateDeviceType).toHaveBeenCalledWith(updateDeviceType);
//     });
//   });
//   describe('archiveDeviceType', () => {
//     const archiveDeviceType = {
//       id: BigInt(1),
//       is_archive: true,
//     };

//     const deviceType: any = {
//       status: 'success',
//       response: '',
//       status_code: 201,
//       data: {
//         id: 26,
//         name: 'Heart Rate',
//         description: 'Heart Rate',
//         procedure_type: {
//           id: BigInt(1),
//           name: "TTTT",
//           short_description: "TTTTT",
//           description: "TTTTT",
//           is_goal_type: false,
//           procedure_duration: "1",
//           is_generate_online_appointments: false,
//           is_active: false,
//           created_at: "2023-07-31T08:41:14.859Z"
//         },
//         status: true,
//         created_by: BigInt(1),
//         created_at: new Date(),
//       },
//     };

//     const updatedBy = BigInt(1)

//     it('should archive device type', async () => {
//       jest.spyOn(deviceTypeService, 'archiveDeviceType').mockResolvedValue(deviceType);
//       const result = await deviceTypeController.archive(archiveDeviceType);
//       expect(result).toEqual(deviceType);
//       expect(deviceTypeService.archiveDeviceType).toHaveBeenCalledWith(archiveDeviceType);
//     });
//   });
//   describe('getDeviceType', () => {
//     const getDeviceType = {
//       id: BigInt(1),
//     };

//     const deviceType: any = {
//       status: 'success',
//       response: '',
//       status_code: 201,
//       data: {
//         id: 26,
//         name: 'Heart Rate',
//         description: 'Heart Rate',
//         procedure_type: {
//           id: BigInt(1),
//           name: "TTTT",
//           short_description: "TTTTT",
//           description: "TTTTT",
//           is_goal_type: false,
//           procedure_duration: "1",
//           is_generate_online_appointments: false,
//           is_active: false,
//           created_at: "2023-07-31T08:41:14.859Z"
//         },
//         status: true,
//         created_by: BigInt(1),
//         created_at: new Date(),
//       },
//     };

//     it('should get device type', async () => {
//       jest.spyOn(deviceTypeService, 'find').mockResolvedValue(deviceType);
//       const result = await deviceTypeController.getDeviceType(getDeviceType);
//       expect(result).toEqual(deviceType);
//       expect(deviceTypeService.find).toHaveBeenCalledWith(getDeviceType);
//     });
//   });
//   describe('getDeviceTypeList', () => {
//     const getDeviceTypes = {
//       limit: 10,
//       page:1,
//       status:null,
//       name:null,
//       fetchAll:null
//     };

//     const deviceType: any ={
//       status: 200,
//       response: "Device types fetched successfully",
//       count: 2,
//       data: [
//         {
//           id: BigInt(1),
//           name: "Degree",
//           description: "cdgfrg",
//           status: true,
//           is_archive: false,
//           created_at: new Date(),
//           updated_at: new Date(),
//           procedure_type: {
//             id:BigInt(2),
//             name: "ddd",
//             short_description: "dddd",
//             description: "dddd",
//             is_goal_type: false,
//             procedure_duration: "1",
//             is_generate_online_appointments: false,
//             is_active: false,
//           created_at: new Date()
//           }
//         },
//         {
//           id: BigInt(2),
//           name: "DegreeTest",
//           description: "DegreeTest",
//           status: true,
//           is_archive: false,
//           created_at: new Date(),
//           updated_at: new Date(),
//           procedure_type: {
//             id: BigInt(2),
//             name: "ddd",
//             short_description: "dddd",
//             description: "dddd",
//             is_goal_type: false,
//             procedure_duration: "1",
//             is_generate_online_appointments: false,
//             is_active: false,
//           created_at: new Date()
//           }
//         },
//       ]
//       };

//     it('should get device type list', async () => {
//       jest.spyOn(deviceTypeService, 'findAll').mockResolvedValue(deviceType);
//       const result = await deviceTypeController.listDeviceType(getDeviceTypes);
//       expect(result).toEqual(deviceType);
//       expect(deviceTypeService.findAll).toHaveBeenCalledWith(getDeviceTypes);
//     });
//   });
// });

describe('calculateDeviceSum', () => {
  it('should calculate the sum of two numbers', () => {
    const num1 = 5;
    const num2 = 10;
    const expectedResult = 15;

    const result = calculateDeviceSum(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of negative and positive numbers', () => {
    const num1 = -8;
    const num2 = 3;
    const expectedResult = -5;

    const result = calculateDeviceSum(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of zero and a number', () => {
    const num1 = 0;
    const num2 = 7;
    const expectedResult = 7;

    const result = calculateDeviceSum(num1, num2);

    expect(result).toEqual(expectedResult);
  });
});

function calculateDeviceSum(a: number, b: number): number {
  return a + b;
}
