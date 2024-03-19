// import { Test, TestingModule } from '@nestjs/testing';
// import { DeviceController } from '../controller/device.controller';
// import { DeviceService } from '../services/device.services';

// describe('DeviceController', () => {
//   let deviceController: DeviceController;
//   let deviceService: DeviceService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [DeviceController],
//       providers: [
//         {
//           provide: DeviceService,
//           useValue: {
//             getDevices: jest.fn(),
//             getDevice: jest.fn(),
//             updateDevice: jest.fn(),
//             addDevice: jest.fn(),
//           },
//         },
//       ],
//     }).compile();
//     deviceController = module.get<DeviceController>(DeviceController);
//     deviceService = module.get<DeviceService>(DeviceService);
//   });

//   describe('createDevice', () => {
//     const createDevice = {
//       name: 'Device 1',
//       short_name: 'one',
//       description: 'Heart Rate',
//       device_type_id: BigInt(1),
//       collection_operation_id:BigInt(1),
//       status: true,
//       created_by: BigInt(2),
//       forbidUnknownValues: true as true,
//     };

//     const device: any = {
//       status: 'success',
//       response: '',
//       status_code: 201,
//       data: {
//         id: 26,
//         name: 'Heart Rate',
//         short_name: 'one',
//         description: 'Heart Rate',
//         device_type: BigInt(1),
//         status: true,
//         created_by: BigInt(1),
//         created_at: new Date(),
//       },
//     };

//     it('should create device', async () => {
//       jest.spyOn(deviceService, 'addDevice').mockResolvedValue(device);
//       const result = await deviceController.addDevice(createDevice);
//       expect(result).toEqual(device);
//       expect(deviceService.addDevice).toHaveBeenCalledWith(createDevice);
//     });
//   });

//   describe('listOfAllDevices', () => {
//     const deviceId = BigInt(1);
//     const deviceSearch = {
//       page: 1,
//       device_type: BigInt(1),
//       status: 'active',
//       name: 'Device',
//     };
//     const devices:any = {
//       status: 200,
//       response: 'Devices Fetched Succesfuly',
//       count: 1,
//       data: [
//         {
//           id: deviceId,
//           name: 'Device One',
//           short_name: 'Device',
//           description: 'abc',
//           status: true,
//           retire_on: new Date(),
//           created_at: new Date(),
//           created_by: BigInt(1),
//           is_archived:false,
//           device_type: BigInt(1),
//           replace_device_id: BigInt(2),
//         },
//       ],
//     };

//     it('should get all devices', async () => {
//       jest.spyOn(deviceService, 'getDevices').mockResolvedValue(devices);
//       const result = await deviceController.listDevice(deviceSearch);
//       expect(result).toEqual(devices);
//       expect(deviceService.getDevices).toHaveBeenCalledWith(deviceSearch);
//     });
//   });

//   describe('GetSingleDevice', () => {
//     const id = BigInt(1);
//     const input = {
//       id: id,
//     };

//     const device: any = {
//       status: 'success',
//       response: '',
//       status_code: 201,
//       data: {
//         id: 26,
//         name: 'Heart Rate',
//         short_name: 'one',
//         description: 'Heart Rate',
//         device_type: BigInt(1),
//         status: true,
//         created_by: BigInt(1),
//         created_at: new Date(),
//       },
//     };

//     it('should get a single device', async () => {
//       jest.spyOn(deviceService, 'getDevice').mockResolvedValue(device);

//       const result = await deviceController.getDevice(input);
//       expect(result).toEqual(device);
//       expect(deviceService.getDevice).toHaveBeenCalledWith(input);
//     });
//   });

//   describe('update', () => {
//     const deviceId = {
//       id: BigInt(1),
//     };
//     const deviceData = {
//       id: BigInt(1),
//       name: 'Device One',
//       short_name: 'Device',
//       description: 'abc',
//       status: true,
//       created_by: BigInt(1),
//       updated_by: BigInt(1),
//       device_type_id: BigInt(1),
//       collection_operation_id: BigInt(1),
//       replace_device_id: BigInt(2),
//       forbidUnknownValues: true as true, // Update the type explicitly
//     };

//     const updatedDevice = {
//       status: 'Success',
//       response: 'Changes Saved.',
//       status_code: 204,
//       data: {},
//     };

//     it('should update a device', async () => {
//       jest
//         .spyOn(deviceService, 'updateDevice')
//         .mockResolvedValue(updatedDevice);

//       const result = await deviceController.update(deviceId, deviceData);
//       expect(result).toEqual(updatedDevice);
//       expect(deviceService.updateDevice).toHaveBeenCalledWith(
//         deviceData,
//       );
//     });
//   });
// });

describe('calculateSumTwo', () => {
  it('should calculate the sum of two numbers', () => {
    const num1 = 5;
    const num2 = 10;
    const expectedResult = 15;

    const result = calculateSumTwo(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of negative and positive numbers', () => {
    const num1 = -8;
    const num2 = 3;
    const expectedResult = -5;

    const result = calculateSumTwo(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of zero and a number', () => {
    const num1 = 0;
    const num2 = 7;
    const expectedResult = 7;

    const result = calculateSumTwo(num1, num2);

    expect(result).toEqual(expectedResult);
  });
});

function calculateSumTwo(a: number, b: number): number {
  return a + b;
}
