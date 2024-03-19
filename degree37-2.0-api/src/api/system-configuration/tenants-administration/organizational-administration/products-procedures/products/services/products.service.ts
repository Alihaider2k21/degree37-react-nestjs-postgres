import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Equal } from 'typeorm';
import { GetProductsInterface } from '../interface/products.interface';
import { Products } from '../entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>
  ) {}

  async getAllProducts(
    getProductsInterface: GetProductsInterface,
    user: any
  ): Promise<any> {
    try {
      const fetchAll = getProductsInterface?.fetchAll === 'true';
      const sortName = getProductsInterface?.sortName;
      const sortBy = getProductsInterface?.sortOrder;

      if ((sortName && !sortBy) || (sortBy && !sortName)) {
        return new HttpException(
          'When selecting sort SortBy & SortName is required.',
          HttpStatus.BAD_REQUEST
        );
      }

      let response;
      let count;

      const sorting: { [key: string]: 'ASC' | 'DESC' } = {};
      if (sortName && sortBy) {
        sorting[sortName] = sortBy.toUpperCase() as 'ASC' | 'DESC';
      } else {
        sorting['id'] = 'DESC';
      }

      if (fetchAll) {
        // If fetchAll is true, ignore the limit and page and fetch all records
        [response, count] = await this.productsRepository.findAndCount({
          where: this.buildWhereClause(getProductsInterface, user), // Use a helper method to build the 'where' object
          order: sorting,
        });
      } else {
        const limit: number = getProductsInterface?.limit
          ? +getProductsInterface.limit
          : +process.env.PAGE_SIZE;

        const page = getProductsInterface?.page
          ? +getProductsInterface.page
          : 1;
        [response, count] = await this.productsRepository.findAndCount({
          where: this.buildWhereClause(getProductsInterface, user),
          take: limit,
          skip: (page - 1) * limit,
          order: sorting,
        });
      }

      return {
        status: HttpStatus.OK,
        message: 'Products Fetched Succesfuly',
        count: count,
        data: response,
      };
    } catch {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  private buildWhereClause(
    getProductsInterface: GetProductsInterface,
    user: any
  ) {
    const where = {};

    if (getProductsInterface?.name) {
      Object.assign(where, {
        name: ILike(`%${getProductsInterface.name}%`),
      });
    }

    if (getProductsInterface?.status) {
      Object.assign(where, {
        is_active: getProductsInterface.status,
      });
    }

    Object.assign(where, {
      tenant_id: Equal(user?.tenant?.id),
    });

    Object.assign(where, {
      is_archived: false,
    });

    return where;
  }
}
