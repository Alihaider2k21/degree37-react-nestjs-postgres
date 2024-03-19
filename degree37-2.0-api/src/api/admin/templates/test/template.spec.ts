import { Test, TestingModule } from '@nestjs/testing';
import { TemplateController } from '../controller/template.controller';
import { TemplateService } from '../services/template.service';

describe('TemplateController', () => {
  let controller: TemplateController;
  let service: TemplateService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [
        {
          provide: TemplateService,
          useValue: {
            listOfTemplates: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TemplateController>(TemplateController);
    service = module.get<TemplateService>(TemplateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listOfTemplates', () => {
    const templateId = BigInt(123);
    const templateSearch = {
      title: 'get',
      page: 1,
    };
    const template = {
      id: templateId,
      title: 'New Donor Notification',
      slug: 'NEW_DONOR_NOTIFICATION',
      variables: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('should get a template', async () => {
      jest.spyOn(service, 'listOfTemplates').mockResolvedValue(template);

      const result = await controller.getListOfTemplates(templateSearch);
      expect(result).toEqual(template);
      expect(service.listOfTemplates).toHaveBeenCalledWith(templateSearch);
    });
  });
});
