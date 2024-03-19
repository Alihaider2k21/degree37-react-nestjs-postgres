import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, ILike, Repository } from 'typeorm';
import { OrganizationalLevels } from '../entities/organizational-level.entity';
import { OrganizationalLevelDto } from '../dto/organizational-level.dto';
import { User } from '../../../../../tenants-administration/user-administration/user/entity/user.entity';
import { resError } from '../../../../../../system-configuration/helpers/response';
import { ErrorConstants } from '../../../../../../system-configuration/constants/error.constants';
import { GetAllOrganizationalLevelsInterface } from '../interface/organizational-level.interface';
import { SuccessConstants } from '../../../../../../system-configuration/constants/success.constants';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { HistoryService } from '../../../../../../common/services/history.service';
import { OrganizationalLevelsHistory } from '../entities/organizational-level-history.entity';
import { getModifiedDataDetails } from '../../../../../../../common/utils/modified_by_detail';

@Injectable()
export class OrganizationalLevelService extends HistoryService<OrganizationalLevelsHistory> {
  constructor(
    @InjectRepository(OrganizationalLevels)
    private readonly organizationalLevelsRepository: Repository<OrganizationalLevels>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(OrganizationalLevelsHistory)
    private readonly organizationalLevelsHistoryRepository: Repository<OrganizationalLevelsHistory>
  ) {
    super(organizationalLevelsHistoryRepository);
  }

  async create(createOrganizationalLevelDto: OrganizationalLevelDto) {
    try {
      const user = await this.userRepository.findOneBy({
        id: createOrganizationalLevelDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const tenant = await this.tenantRepository.findOneBy({
        id: createOrganizationalLevelDto?.tenant_id,
      });

      if (!tenant) {
        throw new HttpException(`Tenant not found.`, HttpStatus.NOT_FOUND);
      }

      let parentLevel = null;
      if (createOrganizationalLevelDto?.parent_level_id) {
        parentLevel = await this.organizationalLevelsRepository.findOne({
          where: { id: createOrganizationalLevelDto?.parent_level_id },
        });
      }

      const organizationalLevel: any = new OrganizationalLevels();
      organizationalLevel.name = createOrganizationalLevelDto.name;
      organizationalLevel.short_label =
        createOrganizationalLevelDto.short_label;
      organizationalLevel.description =
        createOrganizationalLevelDto.description;
      organizationalLevel.is_active = createOrganizationalLevelDto.is_active;
      organizationalLevel.created_by = createOrganizationalLevelDto.created_by;
      organizationalLevel.parent_level = parentLevel;
      organizationalLevel.tenant = tenant;

      // Save the Organizational Levels entity
      const savedOrganizationalLevel =
        await this.organizationalLevelsRepository.save(organizationalLevel);

      return {
        status: SuccessConstants.SUCCESS,
        response: 'Organizational Level Created Successfully',
        status_code: HttpStatus.CREATED,
        data: savedOrganizationalLevel,
      };
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAll(
    getAllOrganizationalLevelsInterface: GetAllOrganizationalLevelsInterface
  ) {
    let where: any = {};
    let records: OrganizationalLevels[] = [];
    const orderBy: any = { id: 'DESC' };
    let count = 0;
    let page = 0;
    where = {
      tenant: { id: getAllOrganizationalLevelsInterface.tenant_id },
    };

    if (
      getAllOrganizationalLevelsInterface.limit &&
      getAllOrganizationalLevelsInterface.page
    ) {
      if (getAllOrganizationalLevelsInterface.collectionOperation === 'false') {
        where.is_collection_operation = Equal(false);
      }
      // If the keyword is provided, add the name search condition
      if (getAllOrganizationalLevelsInterface.keyword?.length > 1) {
        where.name = ILike(`%${getAllOrganizationalLevelsInterface.keyword}%`);
      }

      // If the status is provided, add the is_active condition
      if (getAllOrganizationalLevelsInterface.status) {
        where.is_active = getAllOrganizationalLevelsInterface.status;
      }

      // If parent_level_id is provided, add the parent_level search condition
      if (getAllOrganizationalLevelsInterface.parent_level_id) {
        where.parent_level = {
          id: +getAllOrganizationalLevelsInterface.parent_level_id,
        };
      }
      where.is_archived = false;

      // Apply pagination options
      const limit: number = parseInt(
        getAllOrganizationalLevelsInterface.limit.toString() ??
          process.env.PAGE_SIZE ??
          '10'
      );
      page = getAllOrganizationalLevelsInterface.page
        ? +getAllOrganizationalLevelsInterface.page
        : 1;
      [records, count] = await this.organizationalLevelsRepository.findAndCount(
        {
          where,
          skip: (page - 1) * limit || 0,
          take: limit,
          relations: ['parent_level'],
          order: orderBy,
        }
      );
    } else {
      // If limit and page are not provided, fetch all records without pagination, but whose status is activ

      where = {
        is_active: true,
        is_archived: false,
        tenant: { id: getAllOrganizationalLevelsInterface.tenant_id },
      };

      if (getAllOrganizationalLevelsInterface.collectionOperation === 'false') {
        where.is_collection_operation = Equal(false);
      }

      // If parent_level_id is provided, add the parent_level search condition
      if (getAllOrganizationalLevelsInterface.parent_level_id) {
        where.parent_level = {
          id: +getAllOrganizationalLevelsInterface.parent_level_id,
        };
      }

      records = await this.organizationalLevelsRepository.find({
        where,
        order: orderBy,
        relations: ['parent_level'],
      });
      count = records.length;
    }
    return { total_records: count, page_number: page, data: records };
  }

  async update(id: any, updateOrganizationalLevelDto: OrganizationalLevelDto) {
    try {
      const organizationalLevel =
        await this.organizationalLevelsRepository.findOneBy({
          id: id,
        });
      if (!organizationalLevel) {
        throw new HttpException(
          `Organizational Level not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      const user = await this.userRepository.findOneBy({
        id: updateOrganizationalLevelDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      let parentLevel = null;
      if (updateOrganizationalLevelDto?.parent_level_id) {
        parentLevel = await this.organizationalLevelsRepository.findOne({
          where: { id: updateOrganizationalLevelDto?.parent_level_id },
        });
      }

      const dataToUpdate = {
        name: updateOrganizationalLevelDto.name,
        short_label: updateOrganizationalLevelDto.short_label,
        description: updateOrganizationalLevelDto.description,
        is_active: updateOrganizationalLevelDto.is_active,
        parent_level: parentLevel,
      };

      // Save the Organizational Levels entity
      await this.organizationalLevelsRepository.update(
        {
          id: id as any,
        },
        dataToUpdate as any
      );

      const organizationalLevelHistory = new OrganizationalLevelsHistory();
      Object.assign(organizationalLevelHistory, organizationalLevel);
      organizationalLevelHistory.history_reason = 'C';
      organizationalLevelHistory.created_by =
        updateOrganizationalLevelDto?.updated_by;
      delete organizationalLevelHistory?.created_at;
      await this.createHistory(organizationalLevelHistory);

      return {
        status: SuccessConstants.SUCCESS,
        response: 'Organizational Level Updated Successfully',
        status_code: HttpStatus.OK,
        data: dataToUpdate,
      };
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findOne(id: any) {
    try {
      const organizationalLevel =
        await this.organizationalLevelsRepository.findOne({
          where: { id: id },
          relations: ['parent_level', 'created_by'],
        });
      if (!organizationalLevel) {
        throw new HttpException(
          `Organizational Level not found.`,
          HttpStatus.NOT_FOUND
        );
      }

      const modifiedData: any = await getModifiedDataDetails(
        this.organizationalLevelsHistoryRepository,
        id,
        this.userRepository
      );

      return {
        status: SuccessConstants.SUCCESS,
        response: 'Organizational Level Found Successfully',
        status_code: HttpStatus.FOUND,
        data: { ...organizationalLevel, ...modifiedData },
      };
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async archive(id: any, updatedBy: any) {
    try {
      const organizationalLevel =
        await this.organizationalLevelsRepository.findOne({
          where: { id: id },
        });
      if (!organizationalLevel) {
        throw new HttpException(
          `Organizational Level not found.`,
          HttpStatus.NOT_FOUND
        );
      }
      if (organizationalLevel?.is_collection_operation) {
        throw new HttpException(
          `Collection operations cannot be archived.`,
          HttpStatus.NOT_FOUND
        );
      }
      const savedOrganizationalLevel =
        await this.organizationalLevelsRepository.save({
          ...organizationalLevel,
          is_archived: true,
        });

      const organizationalLevelHistory = new OrganizationalLevelsHistory();
      Object.assign(organizationalLevelHistory, organizationalLevel);
      organizationalLevelHistory.history_reason = 'C';
      organizationalLevelHistory.created_by = updatedBy;
      delete organizationalLevelHistory?.created_at;
      await this.createHistory(organizationalLevelHistory);
      organizationalLevelHistory.history_reason = 'D';
      await this.createHistory(organizationalLevelHistory);

      return {
        status: SuccessConstants.SUCCESS,
        response: 'Organizational Level Archived Successfully',
        status_code: HttpStatus.OK,
        data: savedOrganizationalLevel,
      };
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
