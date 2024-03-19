// import { Test, TestingModule } from '@nestjs/testing';
// import { AttachmentSubCategoryController } from '../controller/attachment-subcategory.controller';
// import { AttachmentSubCategoryService } from '../service/attachment-subcategory.service';
// import { typeEnum } from '../../../common/enums/type.enum';
// import { CreateAttachmentSubCategoryDto } from '../dto/create-attachment-subcategory.dto';

// describe('AttachmentSubCategoryController', () => {
//   let controller: AttachmentSubCategoryController,
//     service: AttachmentSubCategoryService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AttachmentSubCategoryController],
//       providers: [
//         {
//           provide: AttachmentSubCategoryService,
//           useValue: {
//             create: jest.fn(),
//           },
//         },
//       ],
//     }).compile();
//     controller = module.get<AttachmentSubCategoryController>(
//       AttachmentSubCategoryController,
//     );
//     service = module.get<AttachmentSubCategoryService>(
//       AttachmentSubCategoryService,
//     );
//   });

//   describe('create', () => {
//     const payload: CreateAttachmentSubCategoryDto = {
//       name: 'Alaska',
//       description: 'Alaska is a very big state',
//       is_active: true,
//       parent_id: BigInt(1),
//     };

//     const result: {
//       status: string;
//       response: string;
//       status_code: number;
//       data: any;
//     } = {
//       status: 'success',
//       response: '',
//       status_code: 201,
//       data: {
//         id: 1,
//         name: 'Alaska',
//         description: 'Alaska is a very big state',
//         status: true,
//         type: typeEnum.CRM_CONTACTS_ATTACHMENTS,
//         is_archived: false,
//         created_at: new Date(),
//         created_by: {
//           id: 1,
//           first_name: 'test',
//           last_name: 'test',
//           keycloak_username: 'test@cooperativecomputing.com',
//           unique_identifier: null,
//           email: 'test@cooperativecomputing.com',
//           date_of_birth: null,
//           gender: null,
//           home_phone_number: null,
//           work_phone_number: null,
//           work_phone_extension: null,
//           address_line_1: null,
//           address_line_2: null,
//           zip_code: null,
//           city: null,
//           state: null,
//           is_archived: false,
//           password: 'test',
//           is_active: false,
//           is_super_admin: false,
//           created_at: new Date(),
//           updated_at: new Date(),
//           deleted_at: null,
//           tenant: null,
//         },
//       },
//     };

//     const statusResponseMock = {
//       json: jest.fn((x) => x),
//     };
//     const responseMock = {
//       status: jest.fn(() => statusResponseMock),
//     } as unknown as Response;

//     it('should create attachment subcategory', async () => {
//       jest.spyOn(service, 'create').mockResolvedValue(result);
//       const response = await controller.create(responseMock, payload);
//       expect(response).toEqual(result);
//       expect(service.create).toHaveBeenCalledWith(payload);
//     });
//   });
// });

describe('calculateSumFiveUp', () => {
  it('should calculate the sum of two numbers', () => {
    const num1 = 5;
    const num2 = 10;
    const expectedResult = 15;

    const result = calculateSumFiveUp(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of negative and positive numbers', () => {
    const num1 = -8;
    const num2 = 3;
    const expectedResult = -5;

    const result = calculateSumFiveUp(num1, num2);

    expect(result).toEqual(expectedResult);
  });

  it('should calculate the sum of zero and a number', () => {
    const num1 = 0;
    const num2 = 7;
    const expectedResult = 7;

    const result = calculateSumFiveUp(num1, num2);

    expect(result).toEqual(expectedResult);
  });
});

function calculateSumFiveUp(a: number, b: number): number {
  return a + b;
}
