import { ExportService } from './../../common/exportData.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, ILike, Not } from 'typeorm';
import { OrderByConstants } from 'src/api/system-configuration/constants/order-by.constants';
import { HistoryService } from 'src/api/common/services/history.service';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { resError } from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { Contacts } from '../../common/entities/contacts.entity';
import { CommonFunction } from '../../common/common-functions';
import { AddressService } from '../../common/address.service';
import { ContactsService } from '../../common/contacts.service';
import { CRMVolunteerHistory } from '../entities/crm-volunteer-history.entity';
import { CRMVolunteer } from '../entities/crm-volunteer.entity';
import {
  CreateCRMVolunteerDto,
  UpdateCRMVolunteerDto,
} from '../dto/create-crm-volunteer.dto';
import {
  GetAllCRMVolunteerFilteredInterface,
  GetAllCRMVolunteerInterface,
} from '../interface/crm-volunteer.interface';
import { Prefixes } from '../../common/prefixes/entities/prefixes.entity';
import { Suffixes } from '../../common/suffixes/entities/suffixes.entity';
import { AttachmentableType, ContactTypeEnum } from '../../common/enums';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { PolymorphicType } from 'src/api/common/enums/polymorphic-type.enum';
import { saveCustomFields } from 'src/api/common/services/saveCustomFields.service';
import { CustomFields } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-field.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { CreateCRMVolunteerActivityLog } from '../dto/create-activity-log.dto';
import { CRMVolunteerActivityLog } from '../entities/crm-volunteer-activity-log.entity';
import { GetAllCRMVolunteerActivityLogInterface } from '../interface/crm-volunteer-activity-log.interface';
import { AccountContacts } from 'src/api/crm/accounts/entities/accounts-contacts.entity';
import { CrmLocations } from 'src/api/crm/locations/entities/crm-locations.entity';
import { CrmLocationsHistory } from 'src/api/crm/locations/entities/crm-locations-history';

@Injectable()
export class CRMVolunteerService extends HistoryService<CRMVolunteerHistory> {
  private message = 'CRM Volunteer';
  constructor(
    @InjectRepository(CRMVolunteer)
    private entityRepository: Repository<CRMVolunteer>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Contacts)
    private contactsRepository: Repository<Contacts>,
    @InjectRepository(CRMVolunteerHistory)
    private readonly entityHistoryRepository: Repository<CRMVolunteerHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Prefixes)
    private readonly prefixesRepository: Repository<Prefixes>,
    @InjectRepository(CRMVolunteerActivityLog)
    private readonly activityLogRepository: Repository<CRMVolunteerActivityLog>,
    @InjectRepository(Suffixes)
    private readonly suffixesRepository: Repository<Suffixes>,
    @InjectRepository(CustomFields)
    private readonly customFieldsRepository: Repository<CustomFields>,
    @InjectRepository(AccountContacts)
    private readonly accontContactRepository: Repository<AccountContacts>,
    @InjectRepository(CrmLocations)
    private readonly crmLocationsRepository: Repository<CrmLocations>,
    @InjectRepository(CrmLocationsHistory)
    private readonly crmLocationsHistoryRepository: Repository<CrmLocationsHistory>,
    private readonly exportService: ExportService,
    private readonly commonFunction: CommonFunction,
    private readonly entityManager: EntityManager,
    private readonly addressService: AddressService,
    private readonly contactsService: ContactsService
  ) {
    super(entityHistoryRepository);
  }

  /**
   * create new entity
   * @param createDto
   * @returns
   */
  async create(createdDto: CreateCRMVolunteerDto, user: User) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.commonFunction.entityExist(
        this.userRepository,
        { where: { id: createdDto?.created_by } },
        'User'
      );

      await this.commonFunction.entityExist(
        this.userRepository,
        { where: { id: createdDto?.created_by } },
        'User'
      );
      if (createdDto.prefix_id) {
        await this.commonFunction.entityExist(
          this.prefixesRepository,
          { where: { id: createdDto?.prefix_id } },
          'Prefixes'
        );
      }
      if (createdDto.suffix_id) {
        await this.commonFunction.entityExist(
          this.suffixesRepository,
          { where: { id: createdDto?.suffix_id } },
          'Suffixes'
        );
      }

      const { address, ...createDto } = createdDto;

      const create = new CRMVolunteer();
      const keys = Object.keys(createDto);
      //set values in create obj
      for (const key of keys) {
        create[key] = createDto?.[key];
      }
      // Save entity
      const saveObj = await queryRunner.manager.save(create);

      const volunteerCustomFieds = [];
      await saveCustomFields(
        this.customFieldsRepository,
        queryRunner,
        saveObj,
        user,
        user.tenant,
        createDto,
        volunteerCustomFieds
      );

      address.addressable_id = saveObj.id;
      address.created_by = createdDto?.created_by;
      address.tenant_id = createdDto?.tenant_id;
      address.coordinates = `(${createdDto?.address?.latitude}, ${createdDto?.address?.longitude})`;
      await this.addressService.createAddress(address);
      await this.contactsService.createContacts(createdDto, saveObj.id);
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

  /**
   * update record
   * insert data in history table
   * @param id
   * @param updateDto
   * @returns
   */
  async update(id: any, updatedDto: UpdateCRMVolunteerDto, myUser: User) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { address, ...updateDto } = updatedDto;

      const user = await this.commonFunction.entityExist(
        this.userRepository,
        { where: { id: updatedDto?.created_by } },
        'User'
      );

      const entity = await this.commonFunction.entityExist(
        this.entityRepository,
        {
          where: { id, is_archived: false },
          relations: ['created_by', 'tenant_id'],
        },
        this.message
      );

      const volunteerCustomFileds = [];
      await saveCustomFields(
        this.customFieldsRepository,
        queryRunner,
        entity,
        myUser,
        myUser.tenant,
        updatedDto,
        volunteerCustomFileds
      );

      const saveHistory = new CRMVolunteerHistory();
      Object.assign(saveHistory, entity);
      saveHistory.history_reason = 'C';
      saveHistory.created_by = user.id;
      saveHistory.tenant_id = entity.tenant_id.id;
      delete saveHistory?.created_at;
      await this.createHistory(saveHistory);

      Object.assign(entity, updateDto);
      entity.created_by = user;
      const updatedData = await this.entityRepository.save(entity);

      address.created_by = updateDto?.created_by;
      address.tenant_id = updateDto?.tenant_id;
      address.coordinates = `(${updatedDto?.address?.latitude}, ${updatedDto?.address?.longitude})`;
      await this.addressService.updateAddress(address);

      await this.contactsService.updateContacts(
        id,
        updatedDto,
        AttachmentableType.CRM_CONTACTS_VOLUNTEERS
      );

      await queryRunner.commitTransaction();

      return {
        status: HttpStatus.CREATED,
        message: `${this.message} Update Successfully`,
        data: updatedData,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  async archive(id: any, updatedBy: any) {
    try {
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
      const user = await this.commonFunction.entityExist(
        this.userRepository,
        { where: { id: updatedBy } },
        'User'
      );

      const saveHistory = new CRMVolunteerHistory();
      Object.assign(saveHistory, entity);
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
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  /**
   * fetch single record
   * @param id
   * @returns {object}
   */
  async findOne(id: any) {
    try {
      const query = Object.assign(
        {},
        {
          relations: ['created_by', 'tenant_id', 'prefix_id', 'suffix_id'],
          where: {
            id,
            is_archived: false,
          },
        }
      );
      const entity = await this.commonFunction.entityExist(
        this.entityRepository,
        query,
        this.message
      );
      const data = await this.commonFunction.createObj(
        AttachmentableType.CRM_CONTACTS_VOLUNTEERS,
        entity
      );
      const modifiedData: any = await getModifiedDataDetails(
        this.entityHistoryRepository,
        id,
        this.userRepository
      );

      return {
        status: HttpStatus.OK,
        message: `${this.message} fetched successfully.`,
        data: { ...data, ...modifiedData },
      };
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< CRM volunteer find one >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * fetch single record
   * @param id
   * @returns {object}
   */
  async findServiceHistory(id: any) {
    try {
      const andWhere: any = {
        record_id: { id: id },
      };
      const accountContacts = await this.accontContactRepository.find({
        where: {
          is_archived: false,
          ...andWhere,
          contactable_type: PolymorphicType.CRM_ACCOUNTS,
        },
        relations: ['role_id', 'record_id', 'contactable_id'],
      });
      const extractAccountData = accountContacts?.map((item) => {
        const contactableData = item.contactable_id as any;
        const roleAbleData = item.role_id as any;

        return {
          account_name: contactableData?.name,
          role_name: roleAbleData?.name,
          start_date: item.created_at,
          closeout_date: item?.closeout_date,
          created_at: item?.created_at,
        };
      });
      const crmLocationsData = await this.crmLocationsRepository.findOne({
        where: {
          site_contact_id: { id: id },
          is_archived: false,
        },
        relations: ['site_contact_id'],
      });

      const closeOutData = await this.crmLocationsHistoryRepository.find({
        where: {
          id: id,
          history_reason: 'C',
          site_contact_id: Not(id),
        },
        order: {
          created_at: 'DESC',
        },
      });
      const mapCloseOutData = closeOutData?.map((item) => {
        const concatenatedName = `${item?.name} ${item?.room}`;
        return {
          account_name: concatenatedName,
          role_name: item.name,
          start_date: crmLocationsData?.created_at,
          closeout_date: item?.created_at ? item?.created_at : null,
          created_at: crmLocationsData?.created_at,
        };
      });
      const combinedData = extractAccountData
        .concat(mapCloseOutData)
        .sort((a: any, b: any) => a.created_at - b.created_at);

      return {
        status: HttpStatus.OK,
        response: 'Service History fetched successfully.',
        data: combinedData,
      };
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< CRM volunteer find one >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * get all records
   * @param getAllInterface
   * @returns {objects}
   * @deprecated
   */
  async findAll(getAllInterface: GetAllCRMVolunteerInterface) {
    try {
      const {
        name,
        limit = parseInt(process.env.PAGE_SIZE),
        page = 1,
        sortBy = 'id',
        sortOrder = OrderByConstants.DESC,
        tenant_id,
        fetchAll,
        city,
        state,
        status,
      } = getAllInterface;
      const { skip, take } = this.commonFunction.pagination(limit, page);
      const order = { [sortBy]: sortOrder };

      const where = {
        is_archived: false,
      };

      Object.assign(where, {
        tenant_id: { id: tenant_id },
      });

      if (name) {
        Object.assign(where, {
          first_name: ILike(`%${name}%`),
        });
      }
      if (city) {
        Object.assign(where, {
          city: ILike(`%${city}%`),
        });
      }
      if (status) {
        Object.assign(where, {
          is_active: status,
        });
      }
      if (state) {
        Object.assign(where, {
          state: state,
        });
      }

      let data: any;
      let count: any;
      if (!fetchAll) {
        [data, count] = await this.entityRepository.findAndCount({
          relations: ['created_by', 'tenant_id', 'prefix_id', 'suffix_id'],
          where,
          skip,
          take,
          order,
        });
      } else {
        [data, count] = await this.entityRepository.findAndCount({
          relations: ['created_by', 'tenant_id', 'prefix_id', 'suffix_id'],
          where,
          order,
        });
      }

      const entities = [];
      for (const entity of data) {
        const dataObj = await this.commonFunction.createObj(
          AttachmentableType.CRM_CONTACTS_VOLUNTEERS,
          entity
        );
        entities.push(dataObj);
      }
      return {
        status: HttpStatus.OK,
        message: `${this.message} fetched successfully`,
        count: count,
        data: entities,
      };
    } catch (error) {
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<< CRM volunteer find all >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * get all records
   * @param getAllInterface
   * @returns {objects}
   */
  async findAllFiltered(getAllInterface: GetAllCRMVolunteerFilteredInterface) {
    try {
      const {
        name,
        limit = parseInt(process.env.PAGE_SIZE),
        page = 1,
        sortBy = 'volunteer.id',
        sortOrder = OrderByConstants.DESC,
        fetchAll,
      } = getAllInterface;
      const volunteerQuery = this.entityRepository
        .createQueryBuilder('volunteer')
        .leftJoinAndSelect(
          'address',
          'address',
          `address.addressable_id = volunteer.id AND (address.addressable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}')`
        )
        .leftJoinAndSelect(
          'contacts',
          'phone',
          `phone.contactable_id = volunteer.id AND (phone.is_primary = true AND phone.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND phone.contact_type >= '${ContactTypeEnum.WORK_PHONE}' AND phone.contact_type <= '${ContactTypeEnum.OTHER_PHONE}')`
        )
        .leftJoinAndSelect(
          'contacts',
          'email',
          `email.contactable_id = volunteer.id AND (email.is_primary = true AND email.contactable_type = '${PolymorphicType.CRM_CONTACTS_VOLUNTEERS}' AND email.contact_type >= '${ContactTypeEnum.WORK_EMAIL}' AND email.contact_type <= '${ContactTypeEnum.OTHER_EMAIL}')`
        )
        .where({
          is_archived: false,
          tenant_id: { id: getAllInterface['tenant_id'] },
        })
        .select([
          'volunteer.id AS volunteer_id',
          'volunteer.nick_name AS nick_name',
          "concat(volunteer.first_name, ' ', volunteer.last_name) AS name",
          'volunteer.is_active AS status',
          'address.city AS address_city',
          'address.state AS address_state',
          'address.county AS address_county',
          'phone.data AS primary_phone',
          'email.data AS primary_email',
        ]);
      if (getAllInterface.account_id) {
        const { account_id } = getAllInterface;
        volunteerQuery
          .leftJoinAndSelect(
            'account_contacts',
            'ac',
            'ac.record_id = volunteer.id AND ac.is_archived = false'
          )
          .andWhere('ac.contactable_id = :account_id', {
            account_id,
          });
        volunteerQuery.groupBy(
          'volunteer.id, address.id, phone.id, email.id, ac.id'
        );
      } else {
        volunteerQuery.groupBy('volunteer.id, address.id, phone.id, email.id');
      }
      // 'volunteer.id', 'address.id', 'phone.id', 'email.id', 'ac.id';
      // if (getAllInterface.account_id) {
      //   const { account_id } = getAllInterface;
      //   volunteerQuery
      //     .leftJoinAndSelect(
      //       'account_contacts',
      //       'ac',
      //       'ac.record_id = volunteer.id AND ac.is_archived = false'
      //     )
      //     .andWhere('ac.contactable_id = :account_id', {
      //       account_id,
      //     });
      // }

      let exportData;
      const isFetchAll = fetchAll ? fetchAll.trim() === 'true' : false;
      if (isFetchAll) {
        exportData = await volunteerQuery.getRawMany();
      }
      if (name) {
        volunteerQuery.andWhere(
          `concat(volunteer.first_name, ' ', volunteer.last_name) ILIKE :name`,
          {
            name: `%${name}%`,
          }
        );
      }
      if (getAllInterface?.status)
        volunteerQuery.andWhere({
          is_active: getAllInterface.status,
        });
      if (getAllInterface?.city)
        volunteerQuery.andWhere(`address.city ILIKE :city`, {
          city: `%${getAllInterface.city}%`,
        });
      if (getAllInterface?.state)
        volunteerQuery.andWhere(`address.state ILIKE :state`, {
          state: `%${getAllInterface.state}%`,
        });
      if (getAllInterface?.organizational_levels) {
        const collection_operations = JSON.parse(
          getAllInterface.organizational_levels
        );
        volunteerQuery
          .leftJoin(
            'account_contacts',
            'ac',
            'ac.record_id = volunteer.id AND ac.is_archived = false'
          )
          .leftJoin(
            'accounts',
            'acc',
            'ac.contactable_id = acc.id AND acc.is_archived = false'
          );
        let olWhere = '';
        const params = {};
        Object.entries(collection_operations).forEach(
          ([co_id, value], index) => {
            olWhere += olWhere ? ' OR ' : '';
            olWhere += `(acc.collection_operation = :co_id${index}`;
            params[`co_id${index}`] = co_id;
            const { recruiters } = <any>value;
            if (recruiters?.length) {
              olWhere += ` AND acc.recruiter IN (:...recruiters${index})`;
              params[`recruiters${index}`] = recruiters;
            }
            olWhere += ')';
          }
        );
        volunteerQuery.andWhere(`(${olWhere})`, params);
      }
      if (getAllInterface?.county)
        volunteerQuery.andWhere(`address.county ILIKE :county`, {
          county: `%${getAllInterface.county}%`,
        });
      if (getAllInterface?.account) {
        volunteerQuery.andWhere(
          `volunteer.id IN (SELECT DISTINCT record_id FROM account_contacts WHERE contactable_id = :account_id AND contactable_type = '${PolymorphicType.CRM_ACCOUNTS}')`,
          {
            account_id: getAllInterface?.account,
          }
        );
      }

      if (sortBy && sortOrder)
        volunteerQuery.orderBy({
          [sortBy]: sortOrder === 'DESC' ? 'DESC' : 'ASC',
        });

      const count = await volunteerQuery.getCount();
      if (!isFetchAll) {
        exportData = await volunteerQuery.getRawMany();
      }
      if (page && limit && !isFetchAll) {
        const { skip, take } = this.commonFunction.pagination(limit, page);
        volunteerQuery.limit(take).offset(skip);
      }
      if (limit && page && !isFetchAll) {
        volunteerQuery.offset((page - 1) * limit).limit(limit);
      }
      const records = await volunteerQuery.getRawMany();
      let url;
      if (getAllInterface?.exportType && getAllInterface.downloadType) {
        const columnsToFilter = new Set(
          getAllInterface.tableHeaders.split(',')
        );
        const filteredData = exportData.map((obj) => {
          const newObj = {};
          for (const [key, val] of Object.entries(obj)) {
            const nameKey = key === 'status' ? 'is_active' : key;
            const value =
              key === 'status' ? (val ? 'Active' : 'Inactive') : val;
            if (columnsToFilter.has(nameKey)) {
              newObj[key] = value;
            }
          }
          return newObj;
        });
        const prefixName = getAllInterface?.selectedOptions
          ? getAllInterface?.selectedOptions.trim()
          : 'Volunteer';
        url = await this.exportService.exportDataToS3(
          filteredData,
          getAllInterface,
          prefixName,
          'Volunteer'
        );
      }
      return {
        status: HttpStatus.OK,
        message: `${this.message} fetched successfully.`,
        count,
        data: records,
        url,
      };
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createActivityLog(
    id: any,
    createdActivityDto: CreateCRMVolunteerActivityLog,
    user: any
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      const { activity_title, name, date } = createdActivityDto;

      await queryRunner.connect();
      await queryRunner.startTransaction();

      const userFound = await this.commonFunction.entityExist(
        this.userRepository,
        { where: { id: user?.id } },
        'User'
      );

      if (!userFound) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      const entity = await this.commonFunction.entityExist(
        this.entityRepository,
        {
          where: { id },
        },
        this.message
      );

      if (!entity) {
        throw new HttpException(`Volunteer not found.`, HttpStatus.NOT_FOUND);
      }

      const createActivity = new CRMVolunteerActivityLog();
      createActivity.volunteer_id = id;
      createActivity.activity_title = activity_title;
      createActivity.name = name;
      createActivity.date = date;
      createActivity.created_by = userFound;
      const saveObj = await queryRunner.manager.save(createActivity);
      await queryRunner.commitTransaction();

      return {
        status: HttpStatus.CREATED,
        message: `Activity Log Created Successfully`,
        data: saveObj,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllActivity(
    id: any,
    getAllInterface: GetAllCRMVolunteerActivityLogInterface
  ) {
    try {
      const {
        limit = parseInt(process.env.PAGE_SIZE),
        page = 1,
        sortBy = 'id',
        sortOrder = OrderByConstants.DESC,
        fetchAll,
      } = getAllInterface;
      const { skip, take } = this.commonFunction.pagination(limit, page);
      const order = { [sortBy]: sortOrder };
      let pagination = {};
      if (!fetchAll) {
        pagination = {
          skip,
          take,
        };
      }
      const [data, count] = await this.activityLogRepository.findAndCount({
        relations: ['created_by'],
        where: {
          volunteer_id: id,
        },
        ...pagination,
        order,
      });

      return {
        status: HttpStatus.OK,
        message: `Activity Logs fetched successfully`,
        count: count,
        data: data,
      };
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
