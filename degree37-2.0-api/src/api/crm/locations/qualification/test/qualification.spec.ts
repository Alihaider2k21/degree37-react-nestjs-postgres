import { Test, TestingModule } from '@nestjs/testing';
import { QualificationController } from '../controller/qualification.controller';
import { QualificationService } from '../service/qualification.service';

describe('QualificationService', () => {
  let qualificationController: QualificationController;
  let qualificationService: QualificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QualificationController],
      providers: [
        {
          provide: QualificationService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            updateDirectionConfig: jest.fn(),
            getDirectionConfig: jest.fn(),
          },
        },
      ],
    }).compile();

    qualificationController = module.get<QualificationController>(
      QualificationController
    );
    qualificationService =
      module.get<QualificationService>(QualificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const QualificationData: any = {
      direction: 'hello1',
      description: 'dfvfd',
      location_id: 9,
      qualification_date:
        'Sat Sep 23 2023 00:00:00 GMT+0500 (Pakistan Standard Time)',
      qualification_expires: '12-29-2024',
      qualification_status: true,
      qualified_by: 6,
    };

    const createdQualification: any = {
      status: 'success',
      message: 'Qualification Created',
      status_code: 201,
      data: {
        id: BigInt(1),
        description: 'dfvfd',
        location_id: 9,
        qualification_date:
          'Sat Sep 23 2023 00:00:00 GMT+0500 (Pakistan Standard Time)',
        qualification_expires: '12-29-2024',
        qualification_status: true,
        qualified_by: 6,
      },
    };

    it('should create a new Qualification', async () => {
      jest
        .spyOn(qualificationService, 'create')
        .mockResolvedValue(createdQualification);
      const user: any = {
        id: 7,
      };
      const result = await qualificationController.createQualification(
        user,
        QualificationData
      );
      expect(result).toEqual(createdQualification);
      // expect(qualificationService.create).toHaveBeenCalledWith(
      //   user,
      //   QualificationData
      // );
    });
  });

  describe('listOfAllQualification', () => {
    const QualificationSearch: any = {
      page: 1,
      location_id: 1,
      qualification_status: true,
    };
    const Qualification: any = {
      id: BigInt(1),
      description: 'dfvfd',
      location_id: 9,
      qualification_date:
        'Sat Sep 23 2023 00:00:00 GMT+0500 (Pakistan Standard Time)',
      qualification_expires: '12-29-2024',
      qualification_status: true,
      qualified_by: 6,
      created_by: 5,
      created_at: new Date(),
    };

    it('should get all qualification', async () => {
      jest
        .spyOn(qualificationService, 'findAll')
        .mockResolvedValue(Qualification);
      const result = await qualificationController.getQualification(
        QualificationSearch
      );
      expect(result).toEqual(Qualification);
      expect(qualificationService.findAll).toHaveBeenCalledWith(
        QualificationSearch
      );
    });
  });
});
