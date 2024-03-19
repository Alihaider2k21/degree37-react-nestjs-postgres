import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, ILike, Equal } from 'typeorm';
import { ProcedureTypes } from '../entities/procedure-types.entity';
import {
  CreateProcedureTypesDto,
  UpdateProcedureTypesDto,
} from '../dto/create-procedure-types.dto';
import { Products } from '../../products/entities/products.entity';
import { ProcedureTypesProducts } from '../entities/procedure-types-products.entity';
import { GetProcedureTypesInterface } from '../interface/procedure-types.interface';
import { resError } from '../../../../../helpers/response';
import { ErrorConstants } from '../../../../../constants/error.constants';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { ProcedureTypesHistory } from '../entities/procedure-types-history.entity';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';

@Injectable()
export class ProcedureTypesService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProcedureTypesProducts)
    private readonly procedureTypesProductsRepository: Repository<ProcedureTypesProducts>,
    @InjectRepository(ProcedureTypesHistory)
    private readonly procedureTypesHistoryRepository: Repository<ProcedureTypesHistory>,
    @InjectRepository(ProcedureTypes)
    private readonly procedureTypesRepository: Repository<ProcedureTypes>,
    private readonly entityManager: EntityManager
  ) {}

  async create(
    createProcedureTypesDto: CreateProcedureTypesDto,
    tenant_id: bigint
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const procedure_name = await this.procedureTypesRepository.findOne({
        where: {
          name: createProcedureTypesDto?.name,
          tenant_id: tenant_id,
          is_archive: false,
        },
      });

      const user = await this.userRepository.findOneBy({
        id: createProcedureTypesDto?.created_by,
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      if (procedure_name) {
        throw new HttpException(
          `Procedure name already exists.`,
          HttpStatus.CONFLICT
        );
      }

      for (const product of createProcedureTypesDto.procedure_types_products) {
        // Validate product_id
        if (!product.product_id || typeof product.product_id !== 'number') {
          throw new BadRequestException('Invalid product_id');
        }

        // Check if the product ID exists in the database
        const existingProduct = await this.productsRepository.findOneBy({
          id: product.product_id,
        });
        if (!existingProduct) {
          throw new BadRequestException(
            `Product with ID ${product.product_id} not found`
          );
        }

        // Validate quantity
        if (
          !product.quantity ||
          typeof product.quantity !== 'number' ||
          product.quantity <= 0
        ) {
          throw new BadRequestException('Invalid quantity');
        }
      }

      // Create the Procedure Types
      const procedureTypes = new ProcedureTypes();
      // Set Procedure Types properties from createProcedureTypes
      procedureTypes.name = createProcedureTypesDto.name;
      procedureTypes.short_description =
        createProcedureTypesDto.short_description;
      procedureTypes.description = createProcedureTypesDto.description;
      procedureTypes.is_goal_type = createProcedureTypesDto.is_goal_type;
      procedureTypes.procedure_duration =
        createProcedureTypesDto.procedure_duration;
      procedureTypes.is_active = createProcedureTypesDto?.is_active;
      procedureTypes.is_generate_online_appointments =
        createProcedureTypesDto.is_generate_online_appointments;
      procedureTypes.created_by = createProcedureTypesDto?.created_by;
      procedureTypes.tenant_id = tenant_id;

      // Save the Procedure Types entity
      const savedProcedureType = await queryRunner.manager.save(procedureTypes);
      await queryRunner.commitTransaction();
      const savedProcedureTypeId = BigInt(savedProcedureType.id);

      // Create and format the ProcedureTypesProducts entities
      const procedureTypesProducts: ProcedureTypesProducts[] =
        createProcedureTypesDto.procedure_types_products.map((item) => {
          const procedureTypesProduct = new ProcedureTypesProducts();
          procedureTypesProduct.quantity = item.quantity;
          procedureTypesProduct.product_id = item.product_id;
          procedureTypesProduct.procedure_type_id = savedProcedureTypeId;
          return procedureTypesProduct;
        });

      // Save the ProcedureTypesProducts entities in the bridge table
      await this.procedureTypesProductsRepository.insert(
        procedureTypesProducts
      );

      return {
        status: 'success',
        response: 'Procedure Type Created Successfully',
        status_code: 201,
        data: savedProcedureType,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async getAllProcedureTypes(
    getProcedureTypesInterface: GetProcedureTypesInterface,
    user: any
  ): Promise<any> {
    try {
      const fetchAll = getProcedureTypesInterface?.fetchAll === 'true';
      const sortName = getProcedureTypesInterface?.sortName;
      const sortBy = getProcedureTypesInterface?.sortOrder;

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
        [response, count] = await this.procedureTypesRepository.findAndCount({
          where: this.buildWhereClause(getProcedureTypesInterface, user), // Use a helper method to build the 'where' object
          order: sorting,
          relations: ['procedure_types_products.products', 'created_by'],
        });
      } else {
        const limit: number = getProcedureTypesInterface?.limit
          ? +getProcedureTypesInterface.limit
          : +process.env.PAGE_SIZE;

        const page = getProcedureTypesInterface?.page
          ? +getProcedureTypesInterface.page
          : 1;

        [response, count] = await this.procedureTypesRepository.findAndCount({
          where: this.buildWhereClause(getProcedureTypesInterface, user),
          take: limit,
          skip: (page - 1) * limit,
          order: sorting,
          relations: ['procedure_types_products.products', 'created_by'],
        });
      }

      return {
        status: HttpStatus.OK,
        response: 'Procedure Types Fetched Successfully',
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

  async findOne(id: any): Promise<any> {
    try {
      const procedureTypes = await this.procedureTypesRepository.findOne({
        where: { id: id },
        relations: ['procedure_types_products.products', 'created_by'],
      });
      if (!procedureTypes) {
        return new HttpException(
          'Procedure Types not found',
          HttpStatus.BAD_REQUEST
        );
      }

      const modifiedData: any = await getModifiedDataDetails(
        this.procedureTypesHistoryRepository,
        id,
        this.userRepository
      );

      return {
        status: HttpStatus.OK,
        response: 'Procedure Types Fetched Succesfuly',
        data: { ...procedureTypes, ...modifiedData },
      };
    } catch (error) {
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: any, updateProcedureTypesDto: UpdateProcedureTypesDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const procedureTypes = await this.procedureTypesRepository.findOne({
        where: {
          id: id,
        },
        relations: ['tenant'],
      });

      if (!procedureTypes) {
        throw new HttpException(`Procedure not found.`, HttpStatus.NOT_FOUND);
      }

      const user = await this.userRepository.findOneBy({
        id: updateProcedureTypesDto?.created_by,
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      for (const productType of updateProcedureTypesDto?.procedure_types_products) {
        // Validate product_id
        if (
          !productType.product_id ||
          typeof productType.product_id !== 'number'
        ) {
          throw new BadRequestException('Invalid product_id');
        }

        // Check if the product ID exists in the database
        const existingProduct = await this.productsRepository.findOneBy({
          id: productType.product_id,
        });
        if (!existingProduct) {
          throw new BadRequestException(
            `Product with ID ${productType.product_id} not found`
          );
        }

        // Validate quantity
        if (
          !productType.quantity ||
          typeof productType.quantity !== 'number' ||
          productType.quantity <= 0
        ) {
          throw new BadRequestException('Invalid quantity');
        }
      }

      procedureTypes.name = updateProcedureTypesDto.name;
      procedureTypes.short_description =
        updateProcedureTypesDto.short_description;
      procedureTypes.description = updateProcedureTypesDto.description;
      procedureTypes.is_goal_type = updateProcedureTypesDto?.is_goal_type;
      procedureTypes.procedure_duration =
        updateProcedureTypesDto?.procedure_duration;
      procedureTypes.is_active = updateProcedureTypesDto?.is_active;
      procedureTypes.is_generate_online_appointments =
        updateProcedureTypesDto?.is_generate_online_appointments;
      procedureTypes.created_by = updateProcedureTypesDto?.created_by;
      procedureTypes.tenant_id = procedureTypes?.tenant?.id;

      const updatedProcedureType = await this.procedureTypesRepository.save(
        procedureTypes
      );

      if (updatedProcedureType) {
        const action = 'C';
        await this.updateProcedureTypeHistory(
          {
            ...procedureTypes,
            created_by: updateProcedureTypesDto?.updated_by,
          },
          action
        );
      }

      await this.procedureTypesProductsRepository
        .createQueryBuilder('procedure_types_products')
        .delete()
        .from('procedure_types_products')
        .where('procedure_type_id = :procedure_type_id', {
          procedure_type_id: id,
        })
        .execute();

      // Create and format the ProceduresTypesProducts entities
      const procedureTypesProducts: ProcedureTypesProducts[] =
        updateProcedureTypesDto.procedure_types_products.map((item) => {
          const procedureTypesProduct = new ProcedureTypesProducts();
          procedureTypesProduct.quantity = item.quantity;
          procedureTypesProduct.product_id = item.product_id;
          procedureTypesProduct.procedure_type_id = id;
          return procedureTypesProduct;
        });

      // Save the ProceduresTypesProducts entities in the bridge table
      await this.procedureTypesProductsRepository.insert(
        procedureTypesProducts
      );

      await queryRunner.commitTransaction();
      return {
        status: 'Success',
        response: 'Changes Saved.',
        status_code: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async updateProcedureTypeHistory(data: any, action: string) {
    const ProcedureTypeC = new ProcedureTypesHistory();
    ProcedureTypeC.id = data?.id;
    ProcedureTypeC.name = data.name;
    ProcedureTypeC.short_description = data.short_description;
    ProcedureTypeC.description = data.description;
    ProcedureTypeC.is_goal_type = data.is_goal_type;
    ProcedureTypeC.procedure_duration = data.procedure_duration;
    ProcedureTypeC.is_active = data?.is_active;
    ProcedureTypeC.created_by = data?.created_by;
    ProcedureTypeC.is_generate_online_appointments =
      data.is_generate_online_appointments;
    ProcedureTypeC.history_reason = 'C';
    ProcedureTypeC.tenant_id = data.tenant_id;
    await this.procedureTypesHistoryRepository.save(ProcedureTypeC);

    if (action === 'D') {
      const ProcedureD = new ProcedureTypesHistory();
      ProcedureTypeC.id = data?.id;
      ProcedureTypeC.name = data.name;
      ProcedureTypeC.short_description = data.short_description;
      ProcedureTypeC.description = data.description;
      ProcedureTypeC.is_goal_type = data.is_goal_type;
      ProcedureTypeC.procedure_duration = data.procedure_duration;
      ProcedureTypeC.is_active = data?.is_active;
      ProcedureTypeC.created_by = data?.created_by;
      ProcedureTypeC.is_generate_online_appointments =
        data.is_generate_online_appointments;
      ProcedureD.history_reason = 'D';
      ProcedureD.tenant_id = data.tenant_id;
      await this.procedureTypesHistoryRepository.save(ProcedureD);
    }
  }

  async archive(id: any) {
    try {
      const procedureType = await this.procedureTypesRepository.findOneBy({
        id: id,
      });

      if (!procedureType) {
        throw new HttpException(
          `Procedure Type not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      const isArchive = !procedureType.is_archive;
      const updatedRequest = {
        ...procedureType,
        is_archive: isArchive,
      };

      // return updatedRequest;
      const updatedProcedure = await this.procedureTypesRepository.save(
        updatedRequest
      );
      if (updatedProcedure) {
        const action = 'C';
        await this.updateProcedureTypeHistory(
          { ...procedureType, is_archive: isArchive },
          action
        );
      }

      return {
        status: 'Success',
        response: 'Changes Saved.',
        status_code: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  // Helper method to build the 'where' object based on the interface properties
  private buildWhereClause(
    getProcedureTypesInterface: GetProcedureTypesInterface,
    user: any
  ) {
    const where = {};

    if (getProcedureTypesInterface?.name) {
      Object.assign(where, {
        name: ILike(`%${getProcedureTypesInterface.name}%`),
      });
    }

    if (getProcedureTypesInterface?.status) {
      Object.assign(where, {
        is_active: getProcedureTypesInterface.status,
      });
    }

    if (getProcedureTypesInterface?.goal_type) {
      Object.assign(where, {
        is_goal_type: getProcedureTypesInterface.goal_type,
      });
    }

    Object.assign(where, {
      is_archive: false,
    });

    Object.assign(where, {
      tenant_id: Equal(user?.tenant?.id),
    });

    return where;
  }
}
