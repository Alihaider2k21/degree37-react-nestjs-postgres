import { Test, TestingModule } from '@nestjs/testing';
import { DonorController } from '../controller/donor.controller';
import { CreateDonorDto } from '../dto/create-donor.dto';
import { DonorService } from '../services/donor.service';

describe('DonorController', () => {
  let controller: DonorController;
  let service: DonorService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonorController],
      providers: [
        {
          provide: DonorService,
          useValue: {
            createDonor: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DonorController>(DonorController);
    service = module.get<DonorService>(DonorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addUser', () => {
    const donorData: CreateDonorDto = {
      email: 'johndoe@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Don',
      forbidUnknownValues: true,
    };

    const createdDonorData = {
      ...donorData,
      id: BigInt(123),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdDonor = {
      status: 201,
      success: true,
      message: 'Donor Created Successfully',
      data: createdDonorData,
    };

    it('should create a new donor', async () => {
      jest.spyOn(service, 'createDonor').mockResolvedValue(createdDonor);

      const result = await controller.signUp(donorData);
      expect(result).toEqual(createdDonor);
      expect(service.createDonor).toHaveBeenCalledWith(donorData);
    });
  });
});
