import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../controller/products.controller';
import { ProductsService } from '../services/products.service';

describe('ProductService', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            getAllProducts: jest.fn(),
          },
        },
      ],
    }).compile();
    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('listOfAllProducts', () => {
    const productID = BigInt(123);
    const productSearch = {
      page: 1,
      name: '',
      status: 'true',
      fetchAll: 'true',
    };
    const products = {
      id: productID,
      name: 'Product',
      short_description: 'Short Description',
      description: 'Description',
      is_active: true,
      external_reference: 'External Reference',
      created_at: '2023-07-25T06:02:15.384Z',
    };

    it('should get all products', async () => {
      jest.spyOn(productsService, 'getAllProducts').mockResolvedValue(products);
      const result = await productsController.findAll(productSearch, {
        user: { tenant: { id: 1 } },
      } as any);
      expect(result).toEqual(products);
      // expect(productsService.getAllProducts).toHaveBeenCalledWith(
      //   productSearch,
      //   {
      //     user: { tenant: { id: 1 } },
      //   }
      // );
    });
  });
});
