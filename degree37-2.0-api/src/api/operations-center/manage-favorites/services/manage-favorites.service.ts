import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { EntityManager, ILike, Not, Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import {
  CreateManageFavoritesDto,
  ListManageFavoritesDto,
  MakeDefaultDto,
} from '../dto/manage-favorites.dto';
import { Favorites } from '../entities/favorites.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { OrganizationalLevels } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/organizational-levels/entities/organizational-level.entity';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { Procedure } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/procedures/entities/procedure.entity';
import { Products } from 'src/api/system-configuration/tenants-administration/organizational-administration/products-procedures/products/entities/products.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { FavoriteCalendarPreviewTypeEnum } from '../enum/manage-favorites.enum';
import { FavoritesHistory } from '../entities/favorites-history.entity';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
// import { FavoritesRecruiters } from '../entities/favorites-recruiters';
dotenv.config();
@Injectable()
export class ManageFavoritesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Procedure)
    private readonly procedureRepository: Repository<Procedure>,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(OperationsStatus)
    private readonly operationsStatusRepository: Repository<OperationsStatus>,
    @InjectRepository(OrganizationalLevels)
    private readonly organizationalLevelsRepository: Repository<OrganizationalLevels>,
    @InjectRepository(Favorites)
    private readonly favoritesRepository: Repository<Favorites>,
    // @InjectRepository(FavoritesRecruiters)
    // private readonly favoritesRecruitersRepository: Repository<FavoritesRecruiters>,
    @InjectRepository(FavoritesHistory)
    private readonly favoritesHistoryRepository: Repository<FavoritesHistory>,
    private readonly entityManager: EntityManager
  ) {}
  async create(createManageFavoritesDto: CreateManageFavoritesDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { user, tenant } = await this.checkExistancesAuth({
        created_by: createManageFavoritesDto.created_by,
        tenant_id: createManageFavoritesDto.tenant_id,
      });

      const existingSameNameFavorite = await this.favoritesRepository.findOne({
        where: {
          tenant_id: { id: tenant.id },
          name: ILike(createManageFavoritesDto.name),
          is_archived: false,
        },
      });

      if (existingSameNameFavorite) {
        throw new HttpException(`Name already exists.`, HttpStatus.CONFLICT);
      }

      const { organizationalLevels, product, procedureExis, operationsStatus } =
        await this.checkExistancesValues({
          product_id: createManageFavoritesDto.product_id,
          procedure_id: createManageFavoritesDto.procedure_id,
          operations_status_id: createManageFavoritesDto.operations_status_id,
          organization_level_id: createManageFavoritesDto.organization_level_id,
        });
      if (!user || !tenant || !organizationalLevels) {
        throw new HttpException(
          `Data not found user || tenant || organizational level`,
          HttpStatus.NOT_FOUND
        );
      }
      if (createManageFavoritesDto.is_default) {
        const existingDefaultFavorite = await this.favoritesRepository.findOne({
          where: {
            tenant_id: { id: tenant.id },
            is_default: true,
            is_archived: false,
          },
          relations: [
            'organization_level_id',
            'product_id',
            'procedure_id',
            'operations_status_id',
          ],
        });
        if (existingDefaultFavorite) {
          await this.createHistory(
            existingDefaultFavorite,
            existingDefaultFavorite.id,
            user.id,
            tenant.id,
            'C'
          );
          existingDefaultFavorite.is_default = false;
          await this.favoritesRepository.save(existingDefaultFavorite);
        }
      }
      const newFavorite = new Favorites();

      newFavorite.name = createManageFavoritesDto.name;
      if (createManageFavoritesDto?.alternate_name)
        newFavorite.alternate_name = createManageFavoritesDto.alternate_name;
      newFavorite.tenant_id = tenant;
      newFavorite.preview_in_calendar =
        createManageFavoritesDto?.preview_in_calendar ??
        FavoriteCalendarPreviewTypeEnum.Month;
      newFavorite.organization_level_id = organizationalLevels;
      if (createManageFavoritesDto?.operation_type)
        newFavorite.operation_type = createManageFavoritesDto.operation_type;
      if (createManageFavoritesDto?.location_type)
        newFavorite.location_type = createManageFavoritesDto.location_type;
      newFavorite.status = createManageFavoritesDto.is_active;
      newFavorite.created_at = new Date();
      newFavorite.is_archived = false;
      newFavorite.is_open_in_new_tab =
        createManageFavoritesDto.is_open_in_new_tab;
      newFavorite.created_by = user;
      if (product) newFavorite.product_id = product;
      if (procedureExis) newFavorite.procedure_id = procedureExis;
      newFavorite.is_default = createManageFavoritesDto.is_default ?? false;

      newFavorite.operations_status_id = operationsStatus;

      const savedFavorite = await queryRunner.manager.save(newFavorite);
      //   if(createManageFavoritesDto.recruiters_ids?.length > 0)
      // {  const promises = [];
      //   for (const recruiter of createManageFavoritesDto.recruiters_ids) {
      //  FIND COLLECTION OPERATION WHICH IS RECRUITER
      //     const teamCollectionOperation = new FavoritesRecruiters();
      //     teamCollectionOperation.favorite_id = savedFavorite;
      //     teamCollectionOperation.recruiter_id = recruiter;
      //     teamCollectionOperation.created_by = user.id;
      //     teamCollectionOperation.tenant = tenant.id;
      //     promises.push(
      //       this.favoritesRecruitersRepository.save(teamCollectionOperation)
      //     );
      //   }
      //   await Promise.all(promises);}

      await queryRunner.commitTransaction();

      return resSuccess(
        'Favorite Created.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedFavorite
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }
  async listFavorites(params: ListManageFavoritesDto, tenant_id: number) {
    try {
      const limit: number = params?.limit
        ? +params?.limit
        : +process.env.PAGE_SIZE;

      let page = params?.page ? +params?.page : 1;

      if (page < 1) {
        page = 1;
      }

      const where = {};
      if (params?.name) {
        Object.assign(where, {
          name: ILike(`%${params?.name}%`),
        });
      }

      if (params?.status) {
        Object.assign(where, {
          status: params?.status,
        });
      }

      Object.assign(where, {
        tenant_id: { id: tenant_id },
      });

      let favorites: any = [];
      if (params?.fetchAll) {
        favorites = this.favoritesRepository
          .createQueryBuilder('favorites')
          .leftJoinAndSelect(
            'favorites.organization_level_id',
            'organization_level_id'
          )
          .leftJoinAndSelect('favorites.procedure_id', 'procedure_id')
          .leftJoinAndSelect('favorites.product_id', 'product_id')
          .leftJoinAndSelect(
            'favorites.operations_status_id',
            'operations_status_id'
          )
          .orderBy({ 'favorites.id': 'DESC' })
          .where({ ...where, is_archived: false });
      } else if (params?.sortName) {
        favorites = this.favoritesRepository
          .createQueryBuilder('favorites')
          .leftJoinAndSelect(
            'favorites.organization_level_id',
            'organization_level_id'
          )
          .leftJoinAndSelect('favorites.procedure_id', 'procedure_id')
          .leftJoinAndSelect('favorites.product_id', 'product_id')
          .leftJoinAndSelect(
            'favorites.operations_status_id',
            'operations_status_id'
          )
          .take(limit)
          .orderBy(
            params.sortName === 'organization_level_id'
              ? {
                  [`organization_level_id.name`]:
                    params.sortOrder === 'ASC' ? 'ASC' : 'DESC' || 'ASC',
                }
              : params.sortName === 'product_id'
              ? {
                  [`product_id.name`]:
                    params.sortOrder === 'ASC' ? 'ASC' : 'DESC' || 'ASC',
                }
              : params.sortName === 'procedure_id'
              ? {
                  [`procedure_id.name`]:
                    params.sortOrder === 'ASC' ? 'ASC' : 'DESC' || 'ASC',
                }
              : params.sortName === 'operations_status_id'
              ? {
                  [`operations_status_id.name`]:
                    params.sortOrder === 'ASC' ? 'ASC' : 'DESC' || 'ASC',
                }
              : {
                  [`favorites.${params.sortName}`]:
                    params.sortOrder === 'ASC' ? 'ASC' : 'DESC' || 'ASC',
                }
          )
          .skip((page - 1) * limit)
          .where({ ...where, is_archived: false });
      } else {
        favorites = this.favoritesRepository
          .createQueryBuilder('favorites')
          .leftJoinAndSelect(
            'favorites.organization_level_id',
            'organization_level_id'
          )
          .leftJoinAndSelect('favorites.procedure_id', 'procedure_id')
          .leftJoinAndSelect('favorites.product_id', 'product_id')
          .leftJoinAndSelect(
            'favorites.operations_status_id',
            'operations_status_id'
          )
          .take(limit)
          .skip((page - 1) * limit)
          .orderBy({ 'favorites.id': 'DESC' })
          .where({ ...where, is_archived: false });
      }

      const [data, count] = await favorites.getManyAndCount();

      const result = data.map((favorite) => ({
        ...favorite,
        ...(favorite?.location_type === 'InsideOutside' && {
          location_type: 'Inside/Outside',
        }),
        ...(favorite?.is_default && {
          verticalLabel: 'Default',
        }),
        organization_level_id: favorite?.organization_level_id?.name,
        procedure_id: favorite?.procedure_id?.name,
        product_id: favorite?.product_id?.name,
        operations_status_id: favorite?.operations_status_id?.name,
      }));
      return {
        status: HttpStatus.OK,
        message: 'favorites Fetched Successfully',
        count: count,
        data: result,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getSingleFavorite(id: any) {
    const favorite: any = await this.favoritesRepository.findOne({
      where: { id: id },
      relations: [
        'created_by',
        'organization_level_id',
        'product_id',
        'procedure_id',
        'operations_status_id',
      ],
    });
    if (!favorite) {
      throw new HttpException(`Favorite not found.`, HttpStatus.NOT_FOUND);
    }

    if (favorite?.is_archived) {
      throw new HttpException(`Favorite is archived.`, HttpStatus.NOT_FOUND);
    }

    const modifiedData: any = await getModifiedDataDetails(
      this.favoritesHistoryRepository,
      id,
      this.userRepository
    );
    return resSuccess(
      'Favorite fetched successfully.',
      SuccessConstants.SUCCESS,
      HttpStatus.CREATED,
      { ...favorite, ...modifiedData }
    );
  }
  async update(
    id: any,
    updatedData: CreateManageFavoritesDto,
    updated_by: any
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const { user, tenant } = await this.checkExistancesAuth({
        created_by: updated_by?.id,
        tenant_id: updated_by?.tenant?.id,
      });
      const existingSameNameFavorite = await this.favoritesRepository.findOne({
        where: {
          tenant_id: { id: tenant.id },
          name: ILike(updatedData.name),
          id: Not(id),
          is_archived: false,
        },
      });

      if (existingSameNameFavorite) {
        throw new HttpException(`Name already exists.`, HttpStatus.CONFLICT);
      }
      const { organizationalLevels, product, procedureExis, operationsStatus } =
        await this.checkExistancesValues({
          product_id: updatedData.product_id,
          procedure_id: updatedData.procedure_id,
          operations_status_id: updatedData.operations_status_id,
          organization_level_id: updatedData.organization_level_id,
        });

      if (!user || !tenant || !organizationalLevels) {
        throw new HttpException(`Data not found`, HttpStatus.NOT_FOUND);
      }
      const existingFavorite = await this.favoritesRepository.findOne({
        where: {
          tenant_id: { id: tenant.id },
          id,
          is_archived: false,
        },
        relations: [
          'organization_level_id',
          'product_id',
          'procedure_id',
          'operations_status_id',
        ],
      });

      await this.createHistory(existingFavorite, id, user.id, tenant.id, 'C');

      if (updatedData.is_default) {
        const existingDefaultFavorite = await this.favoritesRepository.findOne({
          where: {
            tenant_id: { id: tenant.id },
            is_default: true,
            is_archived: false,
          },
          relations: [
            'organization_level_id',
            'product_id',
            'procedure_id',
            'operations_status_id',
          ],
        });
        if (existingDefaultFavorite) {
          await this.createHistory(
            existingDefaultFavorite,
            existingDefaultFavorite.id,
            user.id,
            tenant.id,
            'C'
          );
          existingDefaultFavorite.is_default = false;
          await this.favoritesRepository.save(existingDefaultFavorite);
        }
      }
      existingFavorite.name = updatedData.name;
      existingFavorite.alternate_name = updatedData.alternate_name;
      existingFavorite.tenant_id = tenant;
      existingFavorite.preview_in_calendar =
        updatedData?.preview_in_calendar ??
        FavoriteCalendarPreviewTypeEnum.Month;
      existingFavorite.organization_level_id = organizationalLevels;
      existingFavorite.operation_type = updatedData.operation_type ?? null;
      existingFavorite.location_type = updatedData.location_type ?? null;
      existingFavorite.status = updatedData.is_active;
      existingFavorite.is_archived = false;
      existingFavorite.is_open_in_new_tab = updatedData.is_open_in_new_tab;
      existingFavorite.created_by = user;
      existingFavorite.product_id = product ?? null;
      existingFavorite.procedure_id = procedureExis ?? null;
      existingFavorite.is_default = updatedData.is_default ?? false;

      existingFavorite.operations_status_id = operationsStatus ?? null;

      await this.favoritesRepository.save(existingFavorite);
      await queryRunner.commitTransaction();

      return {
        status: 'success',
        response: 'Changes Saved',
        status_code: 204,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async archive(id: any, updated_by: any) {
    const favorite = await this.favoritesRepository.findOne({
      where: { id, is_archived: false },
      relations: [
        'organization_level_id',
        'product_id',
        'procedure_id',
        'operations_status_id',
      ],
    });

    if (!favorite) {
      throw new HttpException(`Favorite not found`, HttpStatus.NOT_FOUND);
    }
    const { user, tenant } = await this.checkExistancesAuth({
      created_by: updated_by?.id,
      tenant_id: updated_by?.tenant?.id,
    });
    if (!user || !tenant) {
      throw new HttpException(`Data not found`, HttpStatus.NOT_FOUND);
    }

    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.createHistory(favorite, id, user.id, tenant.id, 'D');

      favorite.is_archived = true;
      await this.favoritesRepository.save(favorite);

      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Favorite Archived.',
        status_code: 204,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        { message: ['Something went wrong'], error },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      await queryRunner.release();
    }
  }

  async setDefaultFavorite(
    fav_id: any,
    tenant_id: any,
    user_id: any,
    makeDefaultDto: MakeDefaultDto
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const { user, tenant } = await this.checkExistancesAuth({
        created_by: user_id,
        tenant_id,
      });
      if (!tenant || !user) {
        throw new HttpException(
          `Tenant or User not found`,
          HttpStatus.NOT_FOUND
        );
      }
      const existingDefaultFavorite = await this.favoritesRepository.findOne({
        where: {
          tenant_id: { id: tenant.id },
          is_default: true,
          is_archived: false,
        },
        relations: [
          'organization_level_id',
          'product_id',
          'procedure_id',
          'operations_status_id',
        ],
      });
      if (existingDefaultFavorite) {
        await this.createHistory(
          existingDefaultFavorite,
          existingDefaultFavorite.id,
          user.id,
          tenant.id,
          'C'
        );
        existingDefaultFavorite.is_default = false;
        await this.favoritesRepository.save(existingDefaultFavorite);
      }
      const favorite = await this.favoritesRepository.findOne({
        where: {
          id: fav_id,
          is_archived: false,
        },
        relations: [
          'organization_level_id',
          'product_id',
          'procedure_id',
          'operations_status_id',
        ],
      });

      if (!favorite) {
        throw new HttpException(`Favorite not found`, HttpStatus.NOT_FOUND);
      }
      await this.createHistory(favorite, favorite.id, user.id, tenant.id, 'C');

      favorite.is_default = true;
      await this.favoritesRepository.save(favorite);
      await queryRunner.commitTransaction();
      return {
        status: 'success',
        response: 'Resource Set as Default',
        status_code: 200,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  async checkExistancesAuth(idsData: any) {
    const user = await this.userRepository.findOne({
      where: {
        id: idsData?.created_by,
        is_archived: false,
      },
    });
    const tenant = await this.tenantRepository.findOne({
      where: {
        id: idsData?.tenant_id,
      },
    });

    return {
      user,
      tenant,
    };
  }
  async checkExistancesValues(idsData: any) {
    const organizationalLevels =
      await this.organizationalLevelsRepository.findOne({
        where: {
          id: idsData?.organization_level_id,
          is_archived: false,
        },
      });
    let product, procedureExis, operationsStatus;
    if (idsData?.product_id) {
      product = await this.productsRepository.findOne({
        where: {
          id: idsData?.product_id,
          is_archived: false,
        },
      });
      if (!product)
        throw new HttpException(`Product not found`, HttpStatus.NOT_FOUND);
    }
    if (idsData?.procedure_id) {
      procedureExis = await this.procedureRepository.findOne({
        where: {
          id: idsData?.procedure_id,
          is_archive: false,
        },
      });
      if (!procedureExis)
        throw new HttpException(`Procedure not found`, HttpStatus.NOT_FOUND);
    }
    if (idsData?.operations_status_id) {
      operationsStatus = await this.operationsStatusRepository.findOne({
        where: {
          id: idsData?.operations_status_id,
          is_archived: false,
        },
      });
      if (!operationsStatus)
        throw new HttpException(
          `Operation Status not found`,
          HttpStatus.NOT_FOUND
        );
    }
    return {
      organizationalLevels,
      product,
      procedureExis,
      operationsStatus,
    };
  }
  async createHistory(
    existingFavorite: Favorites,
    id: any,
    user_id: any,
    tenant_id: any,
    history_reason: string
  ) {
    const {
      name,
      alternate_name,
      is_default,
      organization_level_id,
      location_type,
      operation_type,
      procedure_id,
      product_id,
      status,
      is_open_in_new_tab,
      operations_status_id,
      preview_in_calendar,
    } = existingFavorite;
    const favHist = new FavoritesHistory();
    favHist.name = name;
    favHist.alternate_name = alternate_name;
    favHist.is_default = is_default;
    favHist.organization_level_id = organization_level_id?.id;
    favHist.location_type = location_type;
    favHist.operation_type = operation_type;
    favHist.is_open_in_new_tab = is_open_in_new_tab;
    favHist.procedure_id = procedure_id?.id;
    favHist.product_id = product_id?.id;
    favHist.operations_status_id = operations_status_id?.id;
    favHist.status = status;
    favHist.preview_in_calendar = preview_in_calendar;
    favHist.id = id;
    favHist.status = status;
    favHist.is_default = is_default;
    favHist.history_reason = history_reason;
    favHist.created_by = user_id;
    favHist.tenant_id = tenant_id;

    try {
      const createdHistory = await this.favoritesHistoryRepository.save(
        favHist
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getProductsProcedures(id: bigint) {
    try {
      const procedure = await this.procedureRepository.findOne({
        where: { id },
        relations: ['products'],
      });

      return {
        status: HttpStatus.OK,
        message: 'Products Fetched Successfully',
        data: procedure?.products,
      };
    } catch (error) {
      console.log('favorite product errorr---------------', error);

      return resError(error?.message, ErrorConstants.Error, error);
    }
  }
}
