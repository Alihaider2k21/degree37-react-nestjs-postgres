// import { Test, TestingModule } from '@nestjs/testing';
// import { FacilityController } from '../controller/facility.controller';
// import { FacilityService } from '../services/facility.services';

// describe('FacilityTypeController', () => {
//   let facilityTypeController: FacilityController;
//   let facilityTypeService: FacilityService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [FacilityController],
//       providers: [
//         {
//           provide: FacilityService,
//           useValue: {
//             getFacilities: jest.fn(),
//             getFacility: jest.fn(),
//             addFacility: jest.fn(),
//             updateFacility: jest.fn(),
//           },
//         },
//       ],
//     }).compile();
//     facilityTypeController = module.get<FacilityController>(FacilityController);
//     facilityTypeService = module.get<FacilityService>(FacilityService);
//   });

//   describe('addFacility', () => {
//     const addFacilityInput = {
//       created_by: BigInt(1),
//       name: 'test facility',
//       alternate_name: 'test facility 2',
//       city: 'test city',
//       state: 'test state',
//       country: 'test country',
//       physical_address: 'test address',
//       postal_code: 'test 23424',
//       phone: '3334718979',
//       code: '+92',
//       donor_center: true,
//       staging_site: true,
//       collection_operation: BigInt(1),
//       status: true,
//       industry_category: BigInt(2),
//       industry_sub_category: BigInt(5),
//       updated_by: BigInt(1),
//       is_archived: false,
//     };

//     const facility: any = {
//       status: 'success',
//       response: '',
//       status_code: 201,
//       data: {
//         name: 'test facility',
//         alternate_name: 'test facility',
//         city: 'test city',
//         state: 'test state',
//         country: 'test country',
//         physical_address: 'test address',
//         postal_code: 'test 23424',
//         phone: '3334718979',
//         code: '+92',
//         donor_center: true,
//         staging_site: true,
//         collection_operation: BigInt(1),
//         status: true,
//         industry_category: BigInt(2),
//         industry_sub_category: BigInt(5),
//         created_by: 1,
//         id: '1',
//         created_at: '2023-07-29T20:14:21.819Z',
//         updated_at: '2023-07-29T20:14:21.819Z',
//       },
//     };

//     it('should create facility', async () => {
//       jest
//         .spyOn(facilityTypeService, 'addFacility')
//         .mockResolvedValue(facility);
//       const result = await facilityTypeController.addFacility(addFacilityInput);
//       expect(result).toEqual(facility);
//       expect(facilityTypeService.addFacility).toHaveBeenCalledWith(
//         addFacilityInput
//       );
//     });
//   });
// });

describe('calculateSum', () => {
  it('should calculate the sum of two numbers', () => {
    const num1 = 5;
    const num2 = 10;
    const expectedResult = 15;

    const result = calculateSumSevenOne(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of negative and positive numbers', () => {
    const num1 = -8;
    const num2 = 3;
    const expectedResult = -5;

    const result = calculateSumSevenOne(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of zero and a number', () => {
    const num1 = 0;
    const num2 = 7;
    const expectedResult = 7;

    const result = calculateSumSevenOne(num1, num2);

    expect(result).toEqual(expectedResult);
  });
});

function calculateSumSevenOneTwo(a: number, b: number): number {
  return a + b;
}
describe('calculateSum', () => {
  it('should calculate the sum of two numbers', () => {
    const num1 = 5;
    const num2 = 10;
    const expectedResult = 15;

    const result = calculateSumSevenOne(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of negative and positive numbers', () => {
    const num1 = -8;
    const num2 = 3;
    const expectedResult = -5;

    const result = calculateSumSevenOne(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of zero and a number', () => {
    const num1 = 0;
    const num2 = 7;
    const expectedResult = 7;

    const result = calculateSumSevenOneTwo(num1, num2);

    expect(result).toEqual(expectedResult);
  });
});

function calculateSumSevenOne(a: number, b: number): number {
  return a + b;
}
