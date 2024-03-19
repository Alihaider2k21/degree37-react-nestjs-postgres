import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, In, Repository } from 'typeorm';
import { resError } from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { UserRequest } from 'src/common/interface/request';
import { HistoryService } from 'src/api/common/services/history.service';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { CommonFunction } from '../../../common/common-functions';
import { AssertionCodesHistory } from '../../entities/assertion-codes-history.entity';
import { AssertionCodes } from '../../entities/assertion-codes.entity';
import { CreateAssertionCodeDto } from '../dto/create-assertion-codes.dto';
import { GetAllAssertionCodesInterface } from '../../interface/assertion.interface';
import { OrderByConstants } from '../../../../../system-configuration/constants/order-by.constants';

@Injectable()
export class AssertionCodesService extends HistoryService<AssertionCodesHistory> {
  private message = 'Assertion Code';

  constructor(
    @InjectRepository(AssertionCodes)
    private entityRepository: Repository<AssertionCodes>,
    @InjectRepository(AssertionCodesHistory)
    private readonly entityHistoryRepository: Repository<AssertionCodesHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly commonFunction: CommonFunction
  ) {
    super(entityHistoryRepository);
  }

  async create(createdDto: CreateAssertionCodeDto, req: UserRequest) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const create = new AssertionCodes();
      const keys = Object.keys(createdDto);
      //set values in create obj
      for (const key of keys) {
        create[key] = createdDto?.[key];
      }

      create.created_by = req.user.id;
      create.tenant_id = req.user.tenant.id;

      // Save entity
      const saveObj = await queryRunner.manager.save(create);
      await queryRunner.commitTransaction();

      return {
        status: HttpStatus.CREATED,
        message: `${this.message} Created Successfully`,
        data: saveObj,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: any) {
    try {
      const response = await this.entityRepository.find({
        where: {
          id: id,
          is_archived: false,
        },
        order: { id: 'ASC' },
      });
      return {
        status: HttpStatus.OK,
        response: `${this.message} Fetched `,
        data: response,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async archive(id: any, updatedBy: any) {
    try {
      const user = await this.commonFunction.entityExist(
        this.userRepository,
        { where: { id: updatedBy } },
        'User'
      );
      const query = {
        relations: ['created_by', 'tenant_id'],
        where: {
          id,
          is_archived: false,
        },
      };
      const entity = await this.commonFunction.entityExist(
        this.entityRepository,
        query,
        this.message
      );
      const saveHistory = new AssertionCodesHistory();
      Object.assign(saveHistory, entity);
      saveHistory.id = entity.id;
      saveHistory.created_by = user.id;
      saveHistory.tenant_id = entity.tenant_id.id;
      saveHistory.history_reason = 'D';
      delete saveHistory?.created_at;
      await this.createHistory(saveHistory);
      entity['is_archived'] = !entity.is_archived;
      await this.entityRepository.save(entity);
      return {
        status: HttpStatus.NO_CONTENT,
        message: `${this.message} Archive Successfully`,
        data: entity,
      };
    } catch (error) {
      return resError(error, ErrorConstants.Error, error.status);
    }
  }

  async findAll(getAllInterface: GetAllAssertionCodesInterface) {
    try {
      const {
        name,
        limit = parseInt(process.env.PAGE_SIZE),
        page = 1,
        sortBy = 'id',
        sortOrder = OrderByConstants.DESC,
      } = getAllInterface;
      const { skip, take } = this.commonFunction.pagination(limit, page);
      const order = { [sortBy]: sortOrder };

      const where = {
        is_archived: false,
      };

      console.log(getAllInterface['tenant_id']);

      Object.assign(where, {
        tenant_id: { id: getAllInterface['tenant_id'] },
      });

      if (name) {
        Object.assign(where, {
          first_name: ILike(`%${name}%`),
        });
      }

      const [data, count] = await this.entityRepository.findAndCount({
        relations: ['created_by', 'tenant_id'],
        where,
        skip,
        take,
        order,
      });
      return {
        status: HttpStatus.OK,
        message: `${this.message} fetched successfully.`,
        count: count,
        data: data,
      };
    } catch (error) {
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
