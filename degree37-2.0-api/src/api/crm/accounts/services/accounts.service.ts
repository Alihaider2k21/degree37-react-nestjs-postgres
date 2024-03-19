import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository, In } from 'typeorm';
import { Accounts } from '../entities/accounts.entity';
import {
  GetAccountsSearch,
  GetAllAccountsInterface,
  GetDrivesHistoryQuery,
} from '../interface/accounts.interface';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import {
  resError,
  resSuccess,
} from '../../../system-configuration/helpers/response';
import { ErrorConstants } from '../../../system-configuration/constants/error.constants';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { AccountsDto } from '../dto/accounts.dto';
import { AccountsHistory } from '../entities/accounts-history.entity';
import { HistoryService } from 'src/api/common/services/history.service';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';
import { AccountContactsService } from './accounts-contacts.service';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { AddressHistory } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/addressHistory.entity';
import * as _ from 'lodash';
import { IndustryCategoriesService } from 'src/api/system-configuration/tenants-administration/crm-administration/account/industry-categories/service/industry-categories.service';
import { StagesService } from 'src/api/system-configuration/tenants-administration/crm-administration/account/stages/service/stages.service';
import { SourcesService } from 'src/api/system-configuration/tenants-administration/crm-administration/account/sources/services/sources.service';
import { BusinessUnitsService } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/services/business-units.service';
import { UserService } from 'src/api/system-configuration/tenants-administration/user-administration/user/services/user.services';
import { TerritoryService } from 'src/api/system-configuration/tenants-administration/geo-administration/territories/services/territories.service';
import { BBCSConnector } from 'src/connector/bbcsconnector';
import { addressExtractionFilter } from 'src/api/common/services/addressExtraction.service';
import { ExportService } from '../../contacts/common/exportData.service';
import { saveCustomFields } from '../../../common/services/saveCustomFields.service';
import moment from 'moment';
import { CustomFields } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-field.entity';
import { DonationStatusEnum } from '../../contacts/donor/enum/donors.enum';
import { PolymorphicType } from 'src/api/common/enums/polymorphic-type.enum';
import { AccountDefaultBlueprintDto } from '../dto/account-default-blueprint.dto';
import { Drives } from 'src/api/operations-center/operations/drives/entities/drives.entity';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';
import * as fs from 'fs';
import { ContactsRoles } from 'src/api/system-configuration/tenants-administration/crm-administration/contacts/role/entities/contacts-role.entity';
import { CRMVolunteer } from '../../contacts/volunteer/entities/crm-volunteer.entity';
import { ContactTypeEnum } from '../../contacts/common/enums';
import { getTenantConfig } from 'src/api/common/utils/tenantConfig';
import { TenantConfigurationDetail } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenantConfigurationDetail';
import { AccountContacts } from '../entities/accounts-contacts.entity';
dotenv.config();

@Injectable()
export class AccountsService extends HistoryService<AccountsHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(Accounts)
    private readonly accountRepository: Repository<Accounts>,
    @InjectRepository(AccountsHistory)
    private readonly accountsHistoryRepository: Repository<AccountsHistory>,
    @InjectRepository(CustomFields)
    private readonly customFieldsRepository: Repository<CustomFields>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Drives)
    private readonly drivesRepository: Repository<Drives>,
    @InjectRepository(AddressHistory)
    private readonly addressHistoryRepository: Repository<AddressHistory>,
    @InjectRepository(BusinessUnits)
    private readonly businessUnitsRepository: Repository<BusinessUnits>,
    @InjectRepository(ContactsRoles)
    private readonly contactsRolesRepository: Repository<ContactsRoles>,
    @InjectRepository(AccountContacts)
    private readonly accountContactsRepo: Repository<AccountContacts>,
    @InjectRepository(CRMVolunteer)
    private crmVolunteerRepository: Repository<CRMVolunteer>,
    @InjectRepository(TenantConfigurationDetail)
    private readonly tenantConfigRepository: Repository<TenantConfigurationDetail>,
    private readonly entityManager: EntityManager,
    private readonly accountsContactService: AccountContactsService,
    private readonly industryCategoryService: IndustryCategoriesService,
    private readonly stagesService: StagesService,
    private readonly sourcesService: SourcesService,
    private readonly businessUnitsService: BusinessUnitsService,
    private readonly userService: UserService,
    private readonly territoryService: TerritoryService,
    private readonly BBCSConnectorService: BBCSConnector,
    private readonly exportService: ExportService
  ) {
    super(accountsHistoryRepository);
  }

  async findAll(params: GetAllAccountsInterface) {
    try {
      const fetchAll = params?.fetchAll;
      const sortName = params?.sortName;
      const sortBy = params?.sortOrder;

      if ((sortName && !sortBy) || (sortBy && !sortName)) {
        return new HttpException(
          'When selecting sort SortBy & SortName is required.',
          HttpStatus.BAD_REQUEST
        );
      }
      let addressesWithAccounts: any;
      const where = {
        is_archived: false,
        tenant_id: { id: params.tenant_id },
      };
      if (
        (params?.city !== undefined && params?.city !== '') ||
        (params?.state !== undefined && params?.state !== '') ||
        sortName === 'city' ||
        sortName === 'state'
      ) {
        const order: any =
          sortName === 'city' || sortName === 'state'
            ? { [sortName]: sortBy.toUpperCase() as 'ASC' | 'DESC' }
            : { city: 'ASC' };

        const filterWhere = {
          addressable_type: PolymorphicType.CRM_ACCOUNTS,
        };

        if (params?.city !== undefined && params?.city !== '') {
          filterWhere['city'] = ILike(`%${params?.city}%`);
        }

        if (params?.state !== undefined && params?.state !== '') {
          filterWhere['state'] = ILike(`%${params?.state}%`);
        }

        addressesWithAccounts = await this.addressRepository.find({
          where: filterWhere,
          order,
        });
        if (addressesWithAccounts.length > 0) {
          Object.assign(where, {
            id: In(
              addressesWithAccounts.map((item: any) => item.addressable_id)
            ),
          });
        } else {
          return {
            status: HttpStatus.OK,
            response: 'Accounts Fetched.',
            count: 0,
            data: [],
            addreses: [],
          };
        }
      }

      if (params?.status) {
        Object.assign(where, {
          is_active: params?.status,
        });
      }

      if (params?.industryCategory) {
        Object.assign(where, {
          industry_category: { id: In(params?.industryCategory.split(',')) },
        });
      }

      if (params?.industrySubCategory) {
        Object.assign(where, {
          industry_subcategory: {
            id: In(params?.industrySubCategory.split(',')),
          },
        });
      }
      if (params?.stage) {
        Object.assign(where, {
          stage: { id: In(params?.stage.split(',')) },
        });
      }
      if (params?.source) {
        Object.assign(where, {
          source: { id: In(params?.source.split(',')) },
        });
      }

      if (params?.collectionOperation) {
        const collectionOperationValues = params?.collectionOperation
          .split(',')
          .map((item) => item.trim());

        if (collectionOperationValues.length > 0) {
          // Use the array directly with In operator
          Object.assign(where, {
            collection_operation: In(collectionOperationValues),
          });
        } else {
          // Use the single value without wrapping it in an array
          Object.assign(where, {
            collection_operation: params?.collectionOperation,
          });
        }
      }
      if (params?.recruiter) {
        Object.assign(where, {
          recruiter: { id: params?.recruiter },
        });
      }
      if (params?.territory) {
        Object.assign(where, {
          territory: { id: In(params?.territory.split(',')) },
        });
      }
      if (params?.keyword) {
        Number.isNaN(parseInt(params?.keyword))
          ? Object.assign(where, {
              name: ILike(`%${params?.keyword}%`),
            })
          : Object.assign(where, {
              BECS_code: ILike(`%${params?.keyword}%`),
            });
      }

      const limit: number = params?.limit
        ? +params.limit
        : +process.env.PAGE_SIZE;

      const page = params?.page ? +params.page : 1;

      let response: any = [];
      let exportData: any = [];
      if (params?.exportType && params.downloadType) {
        const queryBuilder = this.accountRepository
          .createQueryBuilder('accounts')
          .where('accounts.tenant_id = :tenant_id', {
            tenant_id: params.tenant_id,
          })
          .andWhere('accounts.is_archived = :is_archived', {
            is_archived: false,
          })
          .leftJoinAndSelect('accounts.created_by', 'created_by')
          .leftJoinAndSelect('accounts.industry_category', 'industry_category')
          .leftJoinAndSelect(
            'accounts.industry_subcategory',
            'industry_subcategory'
          )
          .leftJoinAndSelect('accounts.stage', 'stage')
          .leftJoinAndSelect('accounts.source', 'source')
          .leftJoinAndSelect(
            'accounts.collection_operation',
            'collection_operation'
          )
          .leftJoinAndSelect('accounts.recruiter', 'recruiter')
          .leftJoinAndSelect('accounts.territory', 'territory');
        if (!fetchAll) {
          queryBuilder.where(where);
        }
        exportData = queryBuilder;
      }
      response = this.accountRepository
        .createQueryBuilder('accounts')
        .take(limit)
        .skip((page - 1) * limit)
        .leftJoinAndSelect('accounts.created_by', 'created_by')
        .leftJoinAndSelect('accounts.industry_category', 'industry_category')
        .leftJoinAndSelect(
          'accounts.industry_subcategory',
          'industry_subcategory'
        )
        .leftJoinAndSelect('accounts.stage', 'stage')
        .leftJoinAndSelect('accounts.source', 'source')
        .leftJoinAndSelect(
          'accounts.collection_operation',
          'collection_operation'
        )
        .leftJoinAndSelect('accounts.recruiter', 'recruiter')
        .leftJoinAndSelect('accounts.territory', 'territory')
        .where(where);

      if (sortName && sortBy && sortName !== 'city' && sortName !== 'state') {
        if (sortName === 'territory') {
          response.orderBy(
            `${sortName}.territory_name`,
            sortBy.toUpperCase() as 'ASC' | 'DESC'
          );
        } else if (sortName === 'recruiter') {
          response.orderBy(
            `${sortName}.first_name`,
            sortBy.toUpperCase() as 'ASC' | 'DESC'
          );
        } else if (
          sortName === 'collection_operation' ||
          sortName === 'industry_category' ||
          sortName === 'industry_subcategory' ||
          sortName === 'stage' ||
          sortName === 'source'
        ) {
          response.orderBy(
            `${sortName}.name`,
            sortBy.toUpperCase() as 'ASC' | 'DESC'
          );
        } else {
          response.orderBy(
            `accounts.${sortName}`,
            sortBy.toUpperCase() as 'ASC' | 'DESC'
          );
        }
      } else if (sortName !== 'city' && sortName !== 'state') {
        response.orderBy('accounts.id', 'DESC');
      }

      if (params?.organizational_levels) {
        const collection_operations = JSON.parse(params.organizational_levels);
        let olWhere = '';
        const payload = {};
        Object.entries(collection_operations).forEach(
          ([co_id, value], index) => {
            olWhere += olWhere ? ' OR ' : '';
            olWhere += `(collection_operation.id = :co_id${index}`;
            payload[`co_id${index}`] = co_id;
            const { recruiters } = <any>value;
            if (recruiters?.length) {
              olWhere += ` AND recruiter.id IN (:...recruiters${index})`;
              payload[`recruiters${index}`] = recruiters;
            }
            olWhere += ')';
          }
        );
        response.andWhere(`(${olWhere})`, payload);
      }

      let data: any = await response.getMany();
      const count = await response.getCount();

      const accountAddressData = await this.addressRepository.find({
        where: {
          addressable_type: PolymorphicType.CRM_ACCOUNTS,
          addressable_id: In(data.map((item) => item.id)),
        },
        relations: ['created_by'],
      });

      if (sortName === 'city' || sortName === 'state') {
        const addressObject = _.keyBy(accountAddressData, 'addressable_id');
        const accountsWithAddress = data.map((item: any) => {
          return {
            ...item,
            city: addressObject[item.id].city,
            state: addressObject[item.id].state,
          };
        });
        if (sortName === 'city') {
          data = _.orderBy(
            accountsWithAddress,
            ['city'],
            sortBy === 'asc' ? ['asc'] : ['desc']
          );
        } else {
          data = _.orderBy(
            accountsWithAddress,
            ['state'],
            sortBy === 'asc' ? ['asc'] : ['desc']
          );
        }
      }
      let url;
      function mapDataForExport(data) {
        const addressObject = _.keyBy(accountAddressData, 'addressable_id');
        return data.map((item) => ({
          // id: item.id,
          // created_at: moment(item.created_at).format('MM/DD/YYYY HH:mm:ss'),
          // is_archived: item.is_archived,
          name: item.name ?? '',
          // alternate_name: item.alternate_name,
          // phone: item?.phone ?? '',
          // website: item.website,
          // facebook: item.facebook,
          BECS_code: item.BECS_code ?? '',
          // population: item.population,
          Status: item.is_active ? 'Active' : 'Inactive',
          // RSMO: item.RSMO ?? '',
          // created_by: item.created_by.first_name,
          industry_category: item.industry_category.name ?? '',
          // industry_subcategory: item.industry_subcategory.name ?? '',
          // stage: item.stage.name ?? '',
          // source: item.source.name ?? '',
          collection_operation: item.collection_operation.name ?? '',
          recruiter: item.recruiter?.first_name ?? '',
          // territory: item.territory?.territory_name ?? '',
          city: addressObject[item.id]?.city ?? '',
          // state: addressObject[item.id]?.state ?? '',
        }));
      }
      if (params?.exportType && params.downloadType) {
        const DataExport = await exportData.getMany();
        const parsedData = mapDataForExport(DataExport);
        const prefixName = params?.selectedOptions
          ? params?.selectedOptions.trim()
          : 'Accounts';
        url = await this.exportService.exportDataToS3(
          parsedData,
          params,
          prefixName,
          'Accounts'
        );
      }
      return {
        status: HttpStatus.OK,
        response: 'Accounts Fetched.',
        count: count,
        data: data,
        addresses: accountAddressData,
        url,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllAccountsRecruiter() {
    try {
      const user = await this.userRepository.findOne({
        where: { id: this.request?.user?.id },
        relations: ['role'],
      });

      const response = this.accountRepository
        .createQueryBuilder('accounts')
        .leftJoinAndSelect('accounts.recruiter', 'recruiter')
        .leftJoinAndSelect(
          'accounts.collection_operation',
          'collection_operation'
        )
        .leftJoinAndSelect('accounts.territory', 'territory')
        .leftJoinAndSelect('accounts.industry_category', 'industry_category')
        .where(`accounts.is_archived = false`)
        .andWhere(`accounts.is_active = true`)
        .andWhere(`accounts.tenant_id = ${this?.request?.user?.tenant?.id}`)
        .orderBy('accounts.id', 'DESC');

      if (user?.role?.is_recruiter) {
        response.andWhere(`recruiter.id = ${this.request?.user?.id}`);
      }

      const data = await response.getMany();
      const array: any = [];
      for (const res of data) {
        array.push(res.id);
      }

      const result = await addressExtractionFilter(
        'accounts',
        array,
        data,
        this.request.user.id,
        null,
        null,
        null,
        this.addressRepository
      );
      const count = await response.getCount();
      return {
        status: HttpStatus.OK,
        response: 'Accounts Recruiters Fetched.',
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

  async findOne(id: any) {
    const tenant_id: any = +this.request?.user?.tenant?.id;
    try {
      const accountData = await this.accountRepository.findOneBy({
        id: id,
        tenant_id: tenant_id,
        is_archived: false,
      });
      if (!accountData) {
        throw new HttpException(`Account not found.`, HttpStatus.NOT_FOUND);
      }
      const response = await this.accountRepository
        .createQueryBuilder('accounts')
        .leftJoinAndSelect('accounts.created_by', 'created_by')
        .leftJoinAndSelect('accounts.industry_category', 'industry_category')
        .leftJoinAndSelect(
          'accounts.industry_subcategory',
          'industry_subcategory'
        )
        .leftJoinAndSelect('accounts.stage', 'stage')
        .leftJoinAndSelect('accounts.source', 'source')
        .leftJoinAndSelect(
          'accounts.collection_operation',
          'collection_operation'
        )
        .leftJoinAndSelect('accounts.recruiter', 'recruiter')
        .leftJoinAndSelect('accounts.territory', 'territory')
        .where({
          id,
        });
      const account: any = await response.getOne();
      const modifiedData: any = await getModifiedDataDetails(
        this.accountsHistoryRepository,
        id,
        this.userRepository
      );
      const accountAddressData = await this.addressRepository.findOne({
        where: {
          addressable_id: id,
          addressable_type: PolymorphicType.CRM_ACCOUNTS,
        },
        relations: ['created_by'],
      });
      if (!accountAddressData) {
        throw new HttpException(`Address not found.`, HttpStatus.NOT_FOUND);
      }
      return resSuccess(
        'Account Fetched.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { ...account, ...modifiedData, address: accountAddressData }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async create(user: User, createAccountDto: AccountsDto) {
    if (!createAccountDto?.contacts?.length) {
      throw new HttpException(
        'Atleast one contact is required to create a account.',
        HttpStatus.BAD_REQUEST
      );
    }
    const existingAccount = await this.accountRepository.findOne({
      where: {
        BECS_code: createAccountDto.BECS_code,
      },
    });
    if (existingAccount) {
      throw new HttpException(
        'This becs code already exist.',
        HttpStatus.BAD_REQUEST
      );
    }
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // const tenant: any = user.tenant_id
      // const { bbcs_account_id, bbcs_external_id } =
      //   await this.bbcsConnectionMethod(createAccountDto, tenant?.id);

      const recruiterUser = await this.userRepository.findOne({
        where: { id: createAccountDto.recruiter },
      });
      const collectionOperation = await this.businessUnitsRepository.findOne({
        where: { id: createAccountDto?.collection_operation },
      });
      const account = new Accounts();
      // account.account_id = bbcs_account_id || null;
      // account.external_id = bbcs_external_id || null;
      account.name = createAccountDto?.name;
      account.alternate_name = createAccountDto?.alternate_name;
      account.phone = createAccountDto?.phone;
      account.website = createAccountDto?.website;
      account.facebook = createAccountDto?.facebook;
      account.industry_category = createAccountDto?.industry_category;
      account.industry_subcategory = createAccountDto?.industry_subcategory;
      account.stage = createAccountDto?.stage;
      account.source = createAccountDto?.source;
      account.BECS_code = createAccountDto?.BECS_code;
      account.collection_operation = collectionOperation;
      account.recruiter = recruiterUser;
      account.territory = createAccountDto?.territory;
      account.population = createAccountDto?.population;
      account.is_active = createAccountDto?.is_active ?? true;
      account.RSMO = createAccountDto?.RSMO;
      account.tenant_id = user.tenant;
      account.created_by = user;
      const savedAccount: Accounts = await queryRunner.manager.save(account);

      // address section
      const address = new Address();
      address.address1 = createAccountDto.address1;
      address.address2 = createAccountDto.address2;
      address.zip_code = createAccountDto.zip_code;
      address.city = createAccountDto.city;
      address.state = createAccountDto.state;
      address.country = createAccountDto.country;
      address.county = createAccountDto.county;
      address.created_by = user.id;
      address.addressable_id = savedAccount.id;
      address.addressable_type = 'accounts';
      address.tenant_id = user.tenant;
      if (createAccountDto?.latitude && createAccountDto?.longitude) {
        address.coordinates = `(${createAccountDto?.latitude}, ${createAccountDto?.longitude})`;
        address.latitude = createAccountDto?.latitude;
        address.longitude = createAccountDto?.longitude;
      }

      // Save the address entity
      const accountAddress = await queryRunner.manager.save(address);
      const accountCustomFieds = [];
      await saveCustomFields(
        this.customFieldsRepository,
        queryRunner,
        savedAccount,
        user,
        user.tenant,
        createAccountDto,
        accountCustomFieds
      );
      await queryRunner.commitTransaction();

      if (
        savedAccount &&
        (createAccountDto?.contacts?.length > 0 ||
          createAccountDto?.deleteContacts?.length > 0)
      ) {
        await this.accountsContactService.createContacts(
          savedAccount.id,
          user,
          {
            contacts: createAccountDto.contacts,
            deleteContacts: createAccountDto.deleteContacts,
            closeout_date: null,
            forbidUnknownValues: true,
          }
        );
      }

      const writeTextRecord = await this.createTxtFile(
        createAccountDto,
        savedAccount.created_at
      );
      console.log(writeTextRecord, 'test file');
      return resSuccess(
        'Account Created.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        {
          ...savedAccount,
          address: accountAddress,
          customFields: accountCustomFieds,
        }
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return resError(error.message, ErrorConstants.Error, error.status);
    } finally {
      await queryRunner.release();
    }
  }

  async update(user: User, id: any, updateAccountDto: AccountsDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const account: any = await this.accountRepository.findOne({
        where: {
          id,
          is_archived: false,
        },
        relations: [
          'created_by',
          'territory',
          'recruiter',
          'collection_operation',
          'source',
          'stage',
          'industry_subcategory',
          'industry_category',
          'tenant_id',
        ],
      });
      if (!account) {
        throw new HttpException(`Account not found.`, HttpStatus.NOT_FOUND);
      }

      const accountCustomFieds = [];
      await saveCustomFields(
        this.customFieldsRepository,
        queryRunner,
        account,
        user,
        user.tenant,
        updateAccountDto,
        accountCustomFieds
      );

      // const tenant: any = user.tenant_id
      // const { bbcs_account_id, bbcs_external_id } =
      //   await this.bbcsConnectionMethod(updateAccountDto, tenant?.id);

      const accountHistory = new AccountsHistory();
      accountHistory.history_reason = 'C';
      accountHistory.id = account?.id;
      // accountHistory.account_id = account?.account_id;
      // accountHistory.external_id = account?.external_id;
      accountHistory.name = account?.name;
      accountHistory.alternate_name = account?.alternate_name;
      accountHistory.phone = account?.phone;
      accountHistory.website = account?.website;
      accountHistory.facebook = account?.facebook;
      accountHistory.industry_category = account?.industry_category?.id;
      accountHistory.industry_subcategory = account?.industry_subcategory?.id;
      accountHistory.stage = account?.stage?.id;
      accountHistory.source = account?.source?.id;
      accountHistory.BECS_code = account?.BECS_code;
      accountHistory.collection_operation = account?.collection_operation?.id;
      accountHistory.recruiter = account?.recruiter?.id;
      accountHistory.territory = account?.territory?.id;
      accountHistory.population = account?.population;
      accountHistory.is_active = account?.is_active;
      accountHistory.RSMO = account?.RSMO;
      accountHistory.tenant_id = account?.tenant_id?.id;
      accountHistory.created_by = user?.id;
      await this.createHistory(accountHistory);

      const accountUpdateObject = {
        // account_id: bbcs_account_id || null,
        // external_id: bbcs_external_id || null,
        id: account.id,
        name: updateAccountDto?.name,
        alternate_name: updateAccountDto?.alternate_name,
        phone: updateAccountDto?.phone,
        website: updateAccountDto?.website,
        facebook: updateAccountDto?.facebook,
        industry_category: updateAccountDto?.industry_category,
        industry_subcategory: updateAccountDto?.industry_subcategory,
        stage: updateAccountDto?.stage,
        source: updateAccountDto?.source,
        BECS_code: updateAccountDto?.BECS_code,
        collection_operation: { id: updateAccountDto?.collection_operation },
        recruiter: updateAccountDto.hasOwnProperty('recruiter')
          ? updateAccountDto.recruiter
          : account?.recruiter?.id,
        territory: updateAccountDto?.territory,
        population: updateAccountDto.hasOwnProperty('population')
          ? updateAccountDto.population
          : account?.population,
        RSMO: updateAccountDto.hasOwnProperty('RSMO')
          ? updateAccountDto.RSMO
          : account?.RSMO,
        is_active: updateAccountDto.hasOwnProperty('is_active')
          ? updateAccountDto.is_active
          : account?.is_active,
        tenant_id: user.tenant,
        created_by: user,
      };

      let updatedAccount: any = await this.accountRepository.save(
        accountUpdateObject
      );

      updatedAccount = await this.accountRepository.findOne({
        where: {
          id: account.id,
        },
        relations: [
          'created_by',
          'territory',
          'recruiter',
          'collection_operation',
          'source',
          'stage',
          'industry_subcategory',
          'industry_category',
        ],
      });
      if (
        updateAccountDto.contacts.length > 0 ||
        updateAccountDto.deleteContacts.length > 0
      ) {
        await this.accountsContactService.createContacts(account.id, user, {
          contacts: updateAccountDto.contacts,
          deleteContacts: updateAccountDto.deleteContacts,
          closeout_date: null,
          forbidUnknownValues: true,
        });
      }
      const address = await this.addressRepository.findOneBy({
        addressable_id: account?.id,
        addressable_type: PolymorphicType.CRM_ACCOUNTS,
      });

      const where: any = [
        {
          is_archived: false,
          contactable_id: { id: id },
        },
      ];
      let contacts: any = await this.accountContactsRepo.find({
        where: where,
        relations: ['created_by', 'contactable_id', 'record_id', 'role_id'],
      });

      contacts = contacts.map((contact) => ({
        ...contact,
        role_id: contact.role_id.id,
        record_id: contact.record_id.id,
      }));

      if (!address) {
        throw new HttpException(`Address not found.`, HttpStatus.NOT_FOUND);
      }

      const updatedAddressData = {
        ...address,
        ...updateAccountDto,
      };
      address.address1 = updatedAddressData?.mailing_address;
      address.address2 = updatedAddressData?.address2;
      address.zip_code = updatedAddressData?.zip_code;
      address.city = updatedAddressData?.city;
      address.state = updatedAddressData?.state;
      address.country = updatedAddressData?.country;
      address.county = updatedAddressData?.county;
      address.addressable_id = account?.id;
      address.tenant_id = address.tenant_id;
      if (updatedAddressData.latitude && updatedAddressData.longitude) {
        address.coordinates = `(${updatedAddressData?.latitude}, ${updatedAddressData?.longitude})`;
        address.latitude = updatedAddressData?.latitude;
        address.longitude = updatedAddressData?.longitude;
      }

      const updatedAddress = await this.addressRepository.save(address);

      const updatedAccountText = {
        ...updatedAccount,
        contacts: contacts,
        ...updatedAddress,
      };

      const writeTextRecord = await this.createTxtFile(
        updatedAccountText,
        updatedAccount.created_at
      );
      console.log(writeTextRecord, 'text file');
      await queryRunner.commitTransaction();

      if (updatedAddress) {
        const action = 'C';
        const tenantToSave: any = account?.created_by?.tenant || user.tenant;
        await this.updateAddressHistory(
          {
            ...address,
            created_by: user?.id,
            tenant_id: tenantToSave.id,
          },
          action
        ).catch((error) => {
          throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        });
      }
      return resSuccess(
        'Account Updated.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        { ...updatedAccount, address: updatedAddress }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async deleteAccount(user: any, id: any) {
    try {
      const account: any = await this.accountRepository.findOne({
        where: { id, is_archived: false },
        relations: [
          'created_by',
          'territory',
          'recruiter',
          'collection_operation',
          'source',
          'stage',
          'industry_subcategory',
          'industry_category',
          'tenant_id',
        ],
      });

      if (!account) {
        throw new NotFoundException('Account not found.');
      }

      const accountHistory = new AccountsHistory();
      accountHistory.history_reason = 'D';
      accountHistory.id = account?.id;
      accountHistory.name = account?.name;
      // accountHistory.account_id = account?.account_id;
      // accountHistory.external_id = account?.external_id;
      accountHistory.alternate_name = account?.alternate_name;
      accountHistory.phone = account?.phone;
      accountHistory.website = account?.website;
      accountHistory.facebook = account?.facebook;
      accountHistory.industry_category = account?.industry_category?.id;
      accountHistory.industry_subcategory = account?.industry_subcategory?.id;
      accountHistory.stage = account?.stage?.id;
      accountHistory.source = account?.source?.id;
      accountHistory.BECS_code = account?.BECS_code;
      accountHistory.collection_operation = account?.collection_operation?.id;
      accountHistory.recruiter = account?.recruiter?.id;
      accountHistory.territory = account?.territory?.id;
      accountHistory.population = account?.population;
      accountHistory.is_active = account?.is_active;
      accountHistory.RSMO = account?.RSMO;
      accountHistory.tenant_id = account?.tenant_id.id;
      accountHistory.created_by = user?.id;
      await this.createHistory(accountHistory);

      account.is_archived = true;
      const archivedAccount = await this.accountRepository.save(account);

      return resSuccess(
        'Account Archived.',
        SuccessConstants.SUCCESS,
        HttpStatus.GONE,
        archivedAccount
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async updateAddressHistory(data: any, action: string) {
    const AddressHistoryC = new AddressHistory();
    AddressHistoryC.address1 = data?.address1;
    AddressHistoryC.address2 = data?.address2;
    AddressHistoryC.id = data?.id;
    AddressHistoryC.city = data?.city;
    AddressHistoryC.state = data?.state;
    AddressHistoryC.country = data?.country;
    AddressHistoryC.zip_code = data?.zip_code;
    AddressHistoryC.county = data?.county;
    AddressHistoryC.created_by = data?.created_by;
    AddressHistoryC.addressable_id = data?.tenant_id || data?.addressable_id;
    AddressHistoryC.addressable_type = 'accounts';
    AddressHistoryC.coordinates = data?.coordinates;
    AddressHistoryC.latitude = data?.latitude;
    AddressHistoryC.longitude = data?.longitude;
    AddressHistoryC.tenant_id = data?.tenant_id;
    AddressHistoryC.history_reason = 'C';
    await this.addressHistoryRepository.save(AddressHistoryC);

    if (action === 'D') {
      const AddressHistoryD = new AddressHistory();
      AddressHistoryD.address1 = data?.address1;
      AddressHistoryD.address2 = data?.address2;
      AddressHistoryD.id = data?.id;
      AddressHistoryD.city = data?.city;
      AddressHistoryD.state = data?.state;
      AddressHistoryD.country = data?.country;
      AddressHistoryD.zip_code = data?.zip_code;
      AddressHistoryD.county = data?.county;
      AddressHistoryD.created_by = data?.created_by;
      AddressHistoryD.addressable_id = data?.tenant_id || data?.addressable_id;
      AddressHistoryD.addressable_type = 'accounts';
      AddressHistoryD.coordinates = data?.coordinates;
      AddressHistoryD.latitude = data?.latitude;
      AddressHistoryD.longitude = data?.longitude;
      AddressHistoryD.tenant_id = data?.tenant_id;
      AddressHistoryD.history_reason = 'D';
      await this.addressHistoryRepository.save(AddressHistoryD);
    }
  }

  async getAccountSeedData(user: any, queryParams: GetAllAccountsInterface) {
    try {
      const industryCategory: any = await this.industryCategoryService.findAll({
        fetchAll: 'true',
        status: queryParams?.isFilter === 'true' ? undefined : 'true',
        categories: 'true',
        name: '',
        subCategories: '',
        parent_id: '',
      });
      const industrySubCategory: any =
        await this.industryCategoryService.findAll({
          fetchAll: 'true',
          status: queryParams?.isFilter === 'true' ? undefined : 'true',
          categories: '',
          name: '',
          subCategories: 'true',
          parent_id: undefined,
        });
      const stages: any = await this.stagesService.findAll({
        fetchAll: true,
        is_active: true,
      });
      const sources: any = await this.sourcesService.getAllSources({
        fetchAll: 'true',
        status: 'true',
        page: 0,
        keyword: '',
      });
      const businessUnits: any =
        await this.businessUnitsService.getUserCollectionOperations(
          user,
          null,
          queryParams?.isFilter
        );
      const recruiters: any = await this.userService.getBusinessUnitRecruiters(
        user
      );
      const territories: any = await this.territoryService.getAllTerritories({
        fetchAll: true,
        status: 'true',
        recruiter_id: undefined,
      });
      const response = this.accountRepository
        .createQueryBuilder('accounts')
        .leftJoinAndSelect('accounts.recruiter', 'recruiter')
        .leftJoinAndSelect(
          'accounts.collection_operation',
          'collection_operation'
        )
        .leftJoinAndSelect('accounts.territory', 'territory')
        .leftJoinAndSelect('accounts.industry_category', 'industry_category')
        .where({
          is_archived: false,
        })
        .orderBy('accounts.id', 'DESC');
      const data = await response.getMany();
      const cities: any = await this.addressRepository
        .createQueryBuilder('address')
        .select('DISTINCT address.city', 'city')
        .where({
          addressable_type: PolymorphicType.CRM_ACCOUNTS,
          addressable_id: In(data.map((item) => item.id)),
          tenant_id: { id: queryParams.tenant_id },
        })
        .getRawMany();
      const states: any = await this.addressRepository
        .createQueryBuilder('address')
        .select('DISTINCT address.state', 'state')
        .where({
          addressable_type: PolymorphicType.CRM_ACCOUNTS,
          addressable_id: In(data.map((item) => item.id)),
          tenant_id: { id: queryParams.tenant_id },
        })
        .getRawMany();
      return {
        status: HttpStatus.OK,
        response: 'Account Seed Data Fetched.',
        data: {
          industryCategories: industryCategory?.data || [],
          industrySubCategories: industrySubCategory?.data || [],
          stages: stages?.data || [],
          sources: sources?.data?.data || [],
          businessUnits: businessUnits?.data || [],
          recruiters: recruiters?.data || [],
          territories: territories?.data || [],
          cities: cities || [],
          states: states || [],
        },
      };
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAllAccountsRecruiterByRecruiterId(
    id,
    getAccountsSearch: GetAccountsSearch,
    user
  ) {
    try {
      const where = {};

      Object.assign(where, {
        recruiter: { id },
        name: ILike(`%${getAccountsSearch?.name || ''}%`),
      });

      const response = this.accountRepository
        .createQueryBuilder('accounts')
        .leftJoinAndSelect('accounts.recruiter', 'recruiter')
        .leftJoinAndSelect(
          'accounts.collection_operation',
          'collection_operation'
        )
        .leftJoinAndSelect('accounts.territory', 'territory')
        .leftJoinAndSelect('accounts.industry_category', 'industry_category')
        .where({
          ...where,
          is_archived: false,
        })
        .orderBy('accounts.id', 'DESC');
      const data = await response.getMany();
      const count = await response.getCount();

      const array: any = [];
      for (const res of data) {
        array.push(res.id);
      }
      const result = await addressExtractionFilter(
        'accounts',
        array,
        data,
        user?.id,
        null,
        null,
        null,
        this.addressRepository
      );
      return {
        status: HttpStatus.OK,
        response: 'Accounts Recruiters Fetched.',
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

  async bbcsConnectionMethod(data: any, tenantId: bigint) {
    let bbcs_account_id = data?.account_id || null;
    let bbcs_external_id = data?.external_id || null;
    const objectData = {
      sponsorGroupName: data?.name,
      addressLineOne: data.mailing_address,
      city: data.city,
      state: data.state,
      zipCode: data.zip_code,
    };

    if (bbcs_account_id === null && bbcs_external_id === null) {
      const tenantConfig = await getTenantConfig(
        this.tenantConfigRepository,
        tenantId
      );
      const bbcsNewData =
        await this.BBCSConnectorService.createNewSponsorGroupApi(
          {
            ...objectData,
            phone: data?.phone,
            source: 'BBCS',
            user: 'D37',
          },
          tenantConfig
        );
      bbcs_account_id = bbcsNewData?.data[0]?.id;
      bbcs_external_id = bbcsNewData?.data[0]?.UUID;
    }
    return { bbcs_account_id, bbcs_external_id };
  }

  async driveHistory(id, params: GetDrivesHistoryQuery, user) {
    try {
      const { limit = parseInt(process.env.PAGE_SIZE), page = 1 } = params;
      const query = this.accountRepository
        .createQueryBuilder('accounts')
        .select([
          'accounts.id', // Select the account id
          `(SELECT JSON_BUILD_OBJECT(
          'id', drives.id,
          'date', drives.date,
          'oef_products', drives.oef_products,
          'oef_procedures', drives.oef_procedures,
          'operation_status', (
            SELECT JSON_BUILD_OBJECT(
              'id', os.id,
              'name', os.name,
              'description', os.description,
              'chip_color', os.chip_color
            )
            FROM operations_status os
            WHERE os.id = drives.operation_status_id
          ),
          'shifts', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'shiftable_type', shifts.shiftable_type,
                'start_time', shifts.start_time,
                'end_time', shifts.end_time,
                'shift_slots', (SELECT JSON_AGG(JSON_BUILD_OBJECT(
                  'shift_id', slot.shift_id,
                  'procedure_type_id', slot.procedure_type_id,
                  'start_time', slot.start_time,
                  'end_time', slot.end_time
                ))
                FROM shifts_slots slot
                WHERE slot.shift_id = shifts.id),
                'projections', (
                  SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                      'procedure_type_id', projections.procedure_type_id,
                      'staff_setup_id', projections.staff_setup_id,
                      'product_yield', projections.product_yield,
                      'procedure_type_qty', projections.procedure_type_qty,
                      'donor_donations', (
                        SELECT JSON_AGG(
                          JSON_BUILD_OBJECT(
                            'id', dd.id,
                            'donation_type', dd.donation_type,
                            'donation_date', dd.donation_date,
                            'donation_status', dd.donation_status,
                            'drive_id', dd.drive_id,
                            'next_eligibility_date', dd.next_eligibility_date,
                            'donation_ytd', dd.donation_ytd,
                            'donation_ltd', dd.donation_ltd,
                            'donation_last_year', dd.donation_last_year,
                            'points', dd.points,
                            'is_archived', dd.is_archived
                          )
                        )
                        FROM donors_donations dd
                        WHERE dd.donation_type = projections.procedure_type_id AND dd.drive_id = drives.id
                      ),
                      'procedure_type', (
                        SELECT JSON_BUILD_OBJECT(
                          'id', pt.id,
                          'name', pt.name,
                          'short_description', pt.short_description,
                          'description', pt.description,
                          'is_goal_type', pt.is_goal_type,
                          'is_archive', pt.is_archive,
                          'products', (
                            SELECT JSON_AGG(
                              JSON_BUILD_OBJECT(
                                'id', prod.id,
                                'name', prod.name,
                                'description', prod.description
                              )
                            )
                            FROM procedure_types_products ptp
                            JOIN products prod ON ptp.product_id = prod.id
                            WHERE ptp.procedure_type_id = projections.procedure_type_id
                          ),
                          'procedure_duration', pt.procedure_duration,
                          'is_generate_online_appointments', pt.is_generate_online_appointments,
                          'is_active', pt.is_active
                        )
                        FROM procedure_types pt
                        WHERE pt.id = projections.procedure_type_id
                      )
                    )
                  )
                  FROM shifts_projections_staff projections
                  WHERE projections.shift_id = shifts.id
                )
              )
            )
            FROM shifts
            WHERE shifts.shiftable_type = 'drives' AND shifts.shiftable_id = drives.id
          ),
          'donor_donations', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', dd.id,
                'donation_type', dd.donation_type,
                'donation_date', dd.donation_date,
                'donation_status', dd.donation_status,
                'drive_id', dd.drive_id,
                'next_eligibility_date', dd.next_eligibility_date,
                'donation_ytd', dd.donation_ytd,
                'donation_ltd', dd.donation_ltd,
                'donation_last_year', dd.donation_last_year,
                'points', dd.points,
                'is_archived', dd.is_archived
              )
            )
            FROM donors_donations dd
            WHERE dd.drive_id = drives.id
          ),
          'appointment_count', (
            SELECT COUNT(da.id)
            FROM donors_appointments da
            WHERE da.appointmentable_id = drives.id
            AND da.appointmentable_type = 'drives'
          ),
          'donor_appointments', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', da.id,
                'appointmentable_id', da.appointmentable_id,
                'appointmentable_type', da.appointmentable_type,
                'donor_id', da.donor_id,
                'slot_id', da.slot_id,
                'procedure_type_id', da.procedure_type_id,
                'status', da.status,
                'slot', (
                  SELECT JSON_BUILD_OBJECT(
                    'shift_id', slot.shift_id,
                    'procedure_type_id', slot.procedure_type_id,
                    'start_time', slot.start_time,
                    'end_time', slot.end_time
                  )
                  FROM shifts_slots slot
                  WHERE slot.id = da.slot_id
                )
              )
            )
            FROM donors_appointments da
            WHERE da.appointmentable_id = drives.id
            AND da.appointmentable_type = 'drives'
          )
        )
        FROM drives drive WHERE drive.id = drives.id
        ) AS "drives"`, // Subquery for Drives with Shifts
        ])
        .leftJoin('accounts.drives', 'drives')
        .where(`drives.is_archived = false`)
        .andWhere(`accounts.id = ${id}`);

      if (params.status != '') {
        query.andWhere(`drives.operation_status.id = ${params.status}`);
      }

      if (params.start_date != '' && params.end_date != '') {
        query.andWhere(
          `drives.date BETWEEN '${moment(params.start_date).format(
            'MM-DD-YYYY'
          )}' AND '${moment(params.end_date).format('MM-DD-YYYY')}'`
        );
      }
      const queryCount = query.getQuery();

      const dataCount = await this.accountRepository.query(queryCount);
      const projection =
        params?.view_as === 'products' ? 'product_yield' : 'procedure_type_qty';
      const oef =
        params?.view_as === 'products' ? 'oef_products' : 'oef_procedures';
      const quertAg = this.accountRepository
        .createQueryBuilder('accounts')
        .leftJoin('accounts.drives', 'drives')
        .innerJoin('drives.operation_status', 'os', `os.is_archived = false`)
        .leftJoinAndSelect(
          'donors_donations',
          'dd',
          'dd.drive_id = drives.id AND (dd.is_archived = false)'
        )
        .leftJoinAndSelect(
          'donors_appointments',
          'da',
          `da.appointmentable_id = drives.id AND (appointmentable_type = 'drives' AND da.is_archived = false)`
        )
        .leftJoinAndSelect(
          'shifts',
          'shifts',
          `shifts.shiftable_type = 'drives' AND shifts.shiftable_id = drives.id AND shifts.is_archived = false`
        )
        .leftJoinAndSelect(
          'shifts_projections_staff',
          'projections',
          `projections.shift_id = shifts.id AND (projections.is_archived = false)`
        )
        .leftJoinAndSelect(
          'shifts_slots',
          'slots',
          'slots.shift_id = shifts.id AND (slots.is_archived = false)'
        )
        .select([
          `COUNT(dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Deferred_At_Phlebotomy_020}, ${DonationStatusEnum.Deferred_Post_Defer_030})) AS deferrals`,
          `COUNT(dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Technically_Unsuable_015})) AS qns`,
          `COUNT(dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Donor_Left_012})) AS walkouts`,
          `COUNT(dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Post_Draw_Deferral_025})) AS void`,
          `SUM(DISTINCT projections.${projection}) AS projection`,
          `COUNT(DISTINCT dd.id) AS registered`,
          `COUNT(DISTINCT dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Donated_010}, ${DonationStatusEnum.Technically_Unsuable_015}, ${DonationStatusEnum.Deferred_At_Phlebotomy_020}, ${DonationStatusEnum.Deferred_Post_Defer_030}, ${DonationStatusEnum.Post_Draw_Deferral_025})) AS performed`,
          `COUNT(DISTINCT dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Donated_010}, ${DonationStatusEnum.Technically_Unsuable_015}, ${DonationStatusEnum.Post_Draw_Deferral_025})) AS actual`,
          `ROUND(((COUNT(DISTINCT dd.id) FILTER (WHERE dd.donation_status IN (${DonationStatusEnum.Donated_010}, ${DonationStatusEnum.Technically_Unsuable_015}, ${DonationStatusEnum.Post_Draw_Deferral_025}))::numeric) / (SUM(DISTINCT projections.${projection}))::numeric) * 100, 2) as pa`,
          `COUNT(DISTINCT da.id) AS appointment`,
          `drives.${oef} AS oef`,
          `COUNT(dd.id) FILTER (WHERE dd.donation_date IS NULL) AS ftd`,
          `COUNT(DISTINCT "shifts"."id") AS noOfshifts`,
          `os.name AS status`,
        ])
        .addSelect([`drives.date AS date`])
        .addSelect([`drives.id AS driveId`])
        .where(`drives.account_id =${id} AND drives.is_archived = false`)
        .groupBy('drives.id')
        .addGroupBy('os.name')
        .orderBy({ 'drives.created_at': 'DESC' });

      let sortBy = 'drives.id';
      let sortingOrder = params?.sortOrder.toUpperCase() as 'ASC' | 'DESC';
      if (params?.sortName) {
        if (params?.sortName == 'date') {
          sortBy = 'drives.date';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'appointment') {
          sortBy = 'appointment';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'projection') {
          sortBy = 'projection';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'registered') {
          sortBy = 'registered';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'performed') {
          sortBy = 'performed';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'actual') {
          sortBy = 'actual';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (params?.sortName == 'deferrals') {
          sortBy = 'deferrals';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (params?.sortName == 'qns') {
          sortBy = 'qns';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (params?.sortName == 'ftd') {
          sortBy = 'ftd';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }
        if (params?.sortName == 'walkouts') {
          sortBy = 'walkouts';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'void') {
          sortBy = 'void';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'noofshifts') {
          sortBy = 'noofshifts';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'status') {
          sortBy = 'status';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }

        if (params?.sortName == 'pa') {
          sortBy = 'pa';
          sortingOrder.toUpperCase() as 'ASC' | 'DESC';
        }
      } else {
        sortBy = 'drives.id';
        sortingOrder = 'DESC';
      }

      if (params.status != '') {
        quertAg.andWhere(`drives.operation_status.id = ${params.status}`);
      }

      if (params.start_date != '' && params.end_date != '') {
        quertAg.andWhere(
          `drives.date BETWEEN '${moment(params.start_date).format(
            'MM-DD-YYYY'
          )}' AND '${moment(params.end_date).format('MM-DD-YYYY')}'`
        );
      }
      quertAg.offset((page - 1) * limit).limit(limit);
      quertAg.orderBy(sortBy, sortingOrder);
      const result = await this.entityManager.query(quertAg.getQuery());
      return {
        status: HttpStatus.OK,
        response: 'Drive history fetched.',
        count: dataCount?.length ? dataCount?.length : 0,
        result,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async driveHistoryDetail(id, params: GetDrivesHistoryQuery, user, driveId) {
    try {
      const { limit = parseInt(process.env.PAGE_SIZE), page = 1 } = params;
      const query = this.accountRepository
        .createQueryBuilder('accounts')
        .select([
          'accounts.id', // Select the account id
          `(SELECT JSON_BUILD_OBJECT(
          'id', drives.id,
          'date', drives.date,
          'oef_products', drives.oef_products,
          'oef_procedures', drives.oef_procedures,
          'operation_status', (
            SELECT JSON_BUILD_OBJECT(
              'id', os.id,
              'name', os.name,
              'description', os.description,
              'chip_color', os.chip_color
            )
            FROM operations_status os
            WHERE os.id = drives.operation_status_id
          ),
          'shifts', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'shiftable_type', shifts.shiftable_type,
                'start_time', shifts.start_time,
                'end_time', shifts.end_time,
                'shift_slots', (SELECT JSON_AGG(JSON_BUILD_OBJECT(
                  'shift_id', slot.shift_id,
                  'procedure_type_id', slot.procedure_type_id,
                  'start_time', slot.start_time,
                  'end_time', slot.end_time
                ))
                FROM shifts_slots slot
                WHERE slot.shift_id = shifts.id),
                'projections', (
                  SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                      'procedure_type_id', projections.procedure_type_id,
                      'staff_setup_id', projections.staff_setup_id,
                      'product_yield', projections.product_yield,
                      'procedure_type_qty', projections.procedure_type_qty,
                      'donor_donations', (
                        SELECT JSON_AGG(
                          JSON_BUILD_OBJECT(
                            'id', dd.id,
                            'donation_type', dd.donation_type,
                            'donation_date', dd.donation_date,
                            'donation_status', dd.donation_status,
                            'drive_id', dd.drive_id,
                            'next_eligibility_date', dd.next_eligibility_date,
                            'donation_ytd', dd.donation_ytd,
                            'donation_ltd', dd.donation_ltd,
                            'donation_last_year', dd.donation_last_year,
                            'points', dd.points,
                            'is_archived', dd.is_archived
                          )
                        )
                        FROM donors_donations dd
                        WHERE dd.donation_type = projections.procedure_type_id AND dd.drive_id = drives.id
                      ),
                      'procedure_type', (
                        SELECT JSON_BUILD_OBJECT(
                          'id', pt.id,
                          'name', pt.name,
                          'short_description', pt.short_description,
                          'description', pt.description,
                          'is_goal_type', pt.is_goal_type,
                          'is_archive', pt.is_archive,
                          'products', (
                            SELECT JSON_AGG(
                              JSON_BUILD_OBJECT(
                                'id', prod.id,
                                'name', prod.name,
                                'description', prod.description
                              )
                            )
                            FROM procedure_types_products ptp
                            JOIN products prod ON ptp.product_id = prod.id
                            WHERE ptp.procedure_type_id = projections.procedure_type_id
                          ),
                          'procedure_duration', pt.procedure_duration,
                          'is_generate_online_appointments', pt.is_generate_online_appointments,
                          'is_active', pt.is_active
                        )
                        FROM procedure_types pt
                        WHERE pt.id = projections.procedure_type_id
                      )
                    )
                  )
                  FROM shifts_projections_staff projections
                  WHERE projections.shift_id = shifts.id
                )
              )
            )
            FROM shifts
            WHERE shifts.shiftable_type = 'drives' AND shifts.shiftable_id = drives.id
          ),
          'donor_donations', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', dd.id,
                'donation_type', dd.donation_type,
                'donation_date', dd.donation_date,
                'donation_status', dd.donation_status,
                'drive_id', dd.drive_id,
                'next_eligibility_date', dd.next_eligibility_date,
                'donation_ytd', dd.donation_ytd,
                'donation_ltd', dd.donation_ltd,
                'donation_last_year', dd.donation_last_year,
                'points', dd.points,
                'is_archived', dd.is_archived
              )
            )
            FROM donors_donations dd
            WHERE dd.drive_id = drives.id
          ),
          'appointment_count', (
            SELECT COUNT(da.id)
            FROM donors_appointments da
            WHERE da.appointmentable_id = drives.id
            AND da.appointmentable_type = 'drives'
          ),
          'donor_appointments', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', da.id,
                'appointmentable_id', da.appointmentable_id,
                'appointmentable_type', da.appointmentable_type,
                'donor_id', da.donor_id,
                'slot_id', da.slot_id,
                'procedure_type_id', da.procedure_type_id,
                'status', da.status,
                'slot', (
                  SELECT JSON_BUILD_OBJECT(
                    'shift_id', slot.shift_id,
                    'procedure_type_id', slot.procedure_type_id,
                    'start_time', slot.start_time,
                    'end_time', slot.end_time
                  )
                  FROM shifts_slots slot
                  WHERE slot.id = da.slot_id
                )
              )
            )
            FROM donors_appointments da
            WHERE da.appointmentable_id = drives.id
            AND da.appointmentable_type = 'drives'
          )
        )
        FROM drives drive WHERE drive.id = drives.id
        ) AS "drives"`, // Subquery for Drives with Shifts
        ])
        .leftJoin('accounts.drives', 'drives')
        .where(`drives.is_archived = false AND drives.id = ${driveId}`)
        .andWhere(`accounts.id = ${id}`);

      query.offset((page - 1) * limit).limit(limit);

      const queryList = query.getQuery();

      const data = await this.accountRepository.query(queryList);

      return {
        status: HttpStatus.OK,
        response: 'Drive history fetched.',
        data,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async driveHistoryKPI(id) {
    try {
      const query = this.accountRepository
        .createQueryBuilder('accounts')
        .select([
          'accounts.id', // Select the account id
          `(SELECT JSON_BUILD_OBJECT(
          'id', drives.id,
          'date', drives.date,
          'oef_products', drives.oef_products,
          'oef_procedures', drives.oef_procedures,
          'operation_status', (
            SELECT JSON_BUILD_OBJECT(
              'id', os.id,
              'name', os.name,
              'description', os.description,
              'chip_color', os.chip_color
            )
            FROM operations_status os
            WHERE os.id = drives.operation_status_id
          ),
          'shifts', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'shiftable_type', shifts.shiftable_type,
                'start_time', shifts.start_time,
                'end_time', shifts.end_time,
                'shift_slots', (SELECT JSON_AGG(JSON_BUILD_OBJECT(
                  'shift_id', slot.shift_id,
                  'procedure_type_id', slot.procedure_type_id,
                  'start_time', slot.start_time,
                  'end_time', slot.end_time
                ))
                FROM shifts_slots slot
                WHERE slot.shift_id = shifts.id),
                'projections', (
                  SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                      'procedure_type_id', projections.procedure_type_id,
                      'staff_setup_id', projections.staff_setup_id,
                      'product_yield', projections.product_yield,
                      'procedure_type_qty', projections.procedure_type_qty,
                      'donor_donations', (
                        SELECT JSON_AGG(
                          JSON_BUILD_OBJECT(
                            'id', dd.id,
                            'donation_type', dd.donation_type,
                            'donation_date', dd.donation_date,
                            'donation_status', dd.donation_status,
                            'drive_id', dd.drive_id,
                            'next_eligibility_date', dd.next_eligibility_date,
                            'donation_ytd', dd.donation_ytd,
                            'donation_ltd', dd.donation_ltd,
                            'donation_last_year', dd.donation_last_year,
                            'points', dd.points,
                            'is_archived', dd.is_archived
                          )
                        )
                        FROM donors_donations dd
                        WHERE dd.donation_type = projections.procedure_type_id AND dd.drive_id = drives.id
                      ),
                      'procedure_type', (
                        SELECT JSON_BUILD_OBJECT(
                          'id', pt.id,
                          'name', pt.name,
                          'short_description', pt.short_description,
                          'description', pt.description,
                          'is_goal_type', pt.is_goal_type,
                          'is_archive', pt.is_archive,
                          'products', (
                            SELECT JSON_AGG(
                              JSON_BUILD_OBJECT(
                                'id', prod.id,
                                'name', prod.name,
                                'description', prod.description
                              )
                            )
                            FROM procedure_types_products ptp
                            JOIN products prod ON ptp.product_id = prod.id
                            WHERE ptp.procedure_type_id = projections.procedure_type_id
                          ),
                          'procedure_duration', pt.procedure_duration,
                          'is_generate_online_appointments', pt.is_generate_online_appointments,
                          'is_active', pt.is_active
                        )
                        FROM procedure_types pt
                        WHERE pt.id = projections.procedure_type_id
                      )
                    )
                  )
                  FROM shifts_projections_staff projections
                  WHERE projections.shift_id = shifts.id
                )
              )
            )
            FROM shifts
            WHERE shifts.shiftable_type = 'drives' AND shifts.shiftable_id = drives.id
          ),
          'donor_donations', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', dd.id,
                'donation_type', dd.donation_type,
                'donation_date', dd.donation_date,
                'donation_status', dd.donation_status,
                'drive_id', dd.drive_id,
                'next_eligibility_date', dd.next_eligibility_date,
                'donation_ytd', dd.donation_ytd,
                'donation_ltd', dd.donation_ltd,
                'donation_last_year', dd.donation_last_year,
                'points', dd.points,
                'is_archived', dd.is_archived
              )
            )
            FROM donors_donations dd
            WHERE dd.drive_id = drives.id
          ),
          'appointment_count', (
            SELECT COUNT(da.id)
            FROM donors_appointments da
            WHERE da.appointmentable_id = drives.id
            AND da.appointmentable_type = 'drives'
          ),
          'donor_appointments', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', da.id,
                'appointmentable_id', da.appointmentable_id,
                'appointmentable_type', da.appointmentable_type,
                'donor_id', da.donor_id,
                'slot_id', da.slot_id,
                'procedure_type_id', da.procedure_type_id,
                'status', da.status,
                'slot', (
                  SELECT JSON_BUILD_OBJECT(
                    'shift_id', slot.shift_id,
                    'procedure_type_id', slot.procedure_type_id,
                    'start_time', slot.start_time,
                    'end_time', slot.end_time
                  )
                  FROM shifts_slots slot
                  WHERE slot.id = da.slot_id
                )
              )
            )
            FROM donors_appointments da
            WHERE da.appointmentable_id = drives.id
            AND da.appointmentable_type = 'drives'
          )
        )
        FROM drives drive WHERE drive.id = drives.id
        ) AS "drives"`, // Subquery for Drives with Shifts
        ])
        .leftJoin('accounts.drives', 'drives')
        .where(`drives.is_archived = false`)
        .andWhere(`accounts.id = ${id}`)
        .limit(4)
        .getQuery();
      const dataKPI = await this.accountRepository.query(query);

      return {
        status: HttpStatus.OK,
        response: 'Drive history fetched.',
        dataKPI,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async makeDefaultBlueprint(body: AccountDefaultBlueprintDto) {
    try {
      const blueprint = await this.drivesRepository.findOne({
        where: {
          id: body.blueprint_id,
          account_id: body.account_id,
          is_blueprint: true,
          is_archived: false,
          is_active: true,
        },
      });
      const updated = await this.entityManager.update(
        Drives,
        {
          account_id: body.account_id,
          is_blueprint: true,
          is_archived: false,
          is_active: true,
        },
        {
          is_default_blueprint: false,
        }
      );
      console.log({ updated });
      blueprint.is_default_blueprint = true;
      await this.entityManager.save(blueprint);
      return resSuccess(
        'Blueprint marked as default.',
        SuccessConstants.SUCCESS,
        HttpStatus.NO_CONTENT,
        {}
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async createTxtFile(data: any, created_at: any): Promise<any> {
    try {
      let volunteerData: any;
      const contactRolesIds = data.contacts.map(
        (element: any) => element?.role_id
      );

      if (contactRolesIds.length > 0) {
        const primaryChairpersonRole =
          await this.contactsRolesRepository.findOne({
            where: {
              id: In(contactRolesIds),
              is_primary_chairperson: true,
              is_archived: false,
            },
          });
        if (primaryChairpersonRole) {
          const contact = data.contacts.find(
            (element: any) => element.role_id === primaryChairpersonRole?.id
          );
          const volunteerQuery = this.crmVolunteerRepository
            .createQueryBuilder('volunteer')
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
              id: contact.record_id,
            })
            .select([
              'volunteer.id AS volunteer_id',
              'volunteer.first_name AS first_name',
              'volunteer.last_name AS last_name',
              'phone.data AS primary_phone',
              'email.data AS primary_email',
            ])
            .groupBy('volunteer.id, phone.id, email.id');
          volunteerData = await volunteerQuery.getRawOne();
        }
      }

      const currentWorkingDirectory = process.cwd();
      const fileOutPutPath =
        currentWorkingDirectory + `/src/assets/account-sponser-group.txt`;

      const records = [
        {
          GWKEY: data?.BECS_code.substring(0, 4).padEnd(4, '') || null,
          GWSHRT: data.name?.substring(0, 8).padEnd(8, '') || null,
          GWLONG:
            data?.alternate_name.substring(0, 20).padEnd(20, ' ') ||
            data?.name?.substring(0, 20).padEnd(20, '') ||
            null,
          GWEMPC: '    ',
          GWTYPE: 'U',
          GWCCP: 'N',
          GWMAIL: volunteerData
            ? (
                volunteerData?.first_name +
                ' ' +
                (volunteerData?.last_name
                  ? volunteerData?.last_name.substring(
                      0,
                      49 - volunteerData?.first_name.length
                    )
                  : '')
              ).padEnd(50, ' ')
            : null,
          GWCNAM: volunteerData
            ? (
                volunteerData?.first_name +
                ' ' +
                (volunteerData?.last_name
                  ? volunteerData?.last_name.substring(
                      0,
                      35 - volunteerData?.first_name.length
                    )
                  : '')
              ).padEnd(36, ' ')
            : null,
          GWCTIT: 'Primary Chairperson'.padEnd(36, ' '),
          GWCARA: volunteerData
            ? volunteerData?.primary_phone.substring(1, 4)
            : null,
          GWCPH: volunteerData
            ? volunteerData?.primary_phone.substring(6, 14)
            : null,
          GWEXTN: ''.padEnd(5, ' '),
          GWACNM: ''.padEnd(36, ' '),
          GWACTI: ''.padEnd(36, ' '),
          GWFXRA: ''.padEnd(3, ' '),
          GWFXPH: ''.padEnd(7, ' '),
          GWEML: ''.padEnd(25, ' '),
          GWADD1: data?.address1.substring(0, 36).padEnd(36, ' '),
          GWADD2: data?.address2.substring(0, 36).padEnd(36, ' '),
          GWCITY: data?.city.substring(0, 20).padEnd(20, ' '),
          GWST: data?.state.substring(0, 2).padEnd(2, ' '),
          GWZIP: data?.zip_code.substring(0, 5).padEnd(5, ' '),
          GWZIP4: ''.padEnd(4, ' '),
          GWCEO: ''.padEnd(40, ' '),
          GWNUME: ''.padEnd(6, ' '),
          GWSH1: ''.padEnd(4, ' '),
          GWSH2: ''.padEnd(4, ' '),
          GWSH3: ''.padEnd(4, ' '),
          GWACR: ''.padEnd(4, ' '),
          GWRTD: 'Y',
          GWSTS: 'A',
          GWBFLG: '1',
          GWLBCN: ''.padEnd(2, ' '),
          GWLBYR: ''.padEnd(2, ' '),
          GWLBMO: ''.padEnd(2, ' '),
          GWLBDA: ''.padEnd(2, ' '),
          GWCVCN: '20',
          GWCVYR: '99',
          GWCVMO: '12',
          GWCVDA: '31',
          GWSCPO: '1',
          GWPTCN: '20',
          GWPTYR: '99',
          GWPTMO: '12',
          GWPTDA: '31',
          GWPRCN: '20',
          GWPRYR: '99',
          GWPRMO: '12',
          GWPRDA: '31',
          GWEFCN: '20',
          GWEFYR: '99',
          GWEFMO: '12',
          GWEFDA: '31',
          GWDSCN: ''.padEnd(2, ' '),
          GWDSYR: ''.padEnd(2, ' '),
          GWDSMO: ''.padEnd(2, ' '),
          GWDSDA: ''.padEnd(2, ' '),
          GWRECT: 'N',
          GWTRCN: '20',
          GWTRYR: created_at
            ? created_at.getFullYear().toString().slice(-2)
            : null,
          GWTRMO: created_at
            ? (created_at.getMonth() + 1).toString().padStart(2, '0')
            : null,
          GWTRDA: created_at
            ? created_at.getDate().toString().padStart(2, '0')
            : null,
          GWTIME: created_at
            ? `${created_at.getHours().toString().padStart(2, '0')}${created_at
                .getMinutes()
                .toString()
                .padStart(2, '0')}${created_at
                .getSeconds()
                .toString()
                .padStart(2, '0')}`
            : null,
          GWUSER: ''.padEnd(4, ' '),
          GWCMD: ''.padEnd(1, ' '),
        },
      ];

      const recordString = Object.values(records[0])
        .map((value) => (Array.isArray(value) ? value.flat() : value))
        .join('');

      fs.appendFileSync(fileOutPutPath, recordString + '\n', {
        encoding: 'utf-8',
      });

      return 'Text file generated';
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
