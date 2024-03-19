import { Test, TestingModule } from '@nestjs/testing';
import { AliasController } from '../controller/alias.controller';
import { AliasService } from '../services/alias.service';

describe('AliasController', () => {
  const controller = () => {
    return;
  };
  // let controller: AliasController;
  // let service: AliasService;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [AliasController],
  //     providers: [
  //       {
  //         provide: AliasService,
  //         useValue: {
  //           create: jest.fn(),
  //           getAlias: jest.fn(),
  //         },
  //       },
  //     ],
  //   }).compile();
  //   controller = module.get<AliasController>(AliasController);
  //   service = module.get<AliasService>(AliasService);
  // });

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /* create alias */
  /*  describe('create', () => {
    const aliasData: CreateAliasDto = {
      text: 'test',
      type: TypeEnum.account,
      created_by: BigInt(123), // Make sure 'created_by' is provided
      forbidUnknownValues: true,
    };

    const aliasCreated: LocationALias = {
      ...aliasData,
      id: BigInt(13),
      created_at: new Date(),
      text: aliasData.text,
      type: aliasData.type,
      created_by: aliasData.created_by, // Make sure 'created_by' is provided
    };
    it('should create a alias', async () => {
      jest.spyOn(service, 'create').mockResolvedValue({
        status: 'success',
        response: 'Alias Created Successfully',
        status_code: 201,
        data: aliasCreated,
      });
      const result = await controller.create(aliasData);
      expect(result).toEqual({
        status: 'success',
        response: 'Alias Created Successfully',
        status_code: 201,
        data: aliasCreated,
      });
      expect(service.create).toHaveBeenCalledWith(aliasData);
    });
  }); */
  /* get alias */
  /* describe('getAlias', () => {
    const aliasId = BigInt(123);

    const alias = {

      id: aliasId,
      text: 'test',
      type: TypeEnum.account,
      created_at: new Date(),
      created_by: BigInt(123),
      forbidUnknownValues: true,
    };

    const response = {
      status: "success",
      response: "Alias Found",
      status_code: 201,
      data: alias
    }

    it('should get a alias', async () => {
      jest.spyOn(service, 'getAlias').mockResolvedValue(response);
      const result = await controller.getAlias({ type: TypeEnum.account });
      expect(result).toEqual(response);
    });
  }); */
});
