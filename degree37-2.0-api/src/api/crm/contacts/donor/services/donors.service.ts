import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  EntityManager,
  ILike,
  Between,
  Brackets,
  MoreThanOrEqual,
  Not,
  In,
} from 'typeorm';
import { DonorsHistory } from '../entities/donors-history.entity';
import { OrderByConstants } from 'src/api/system-configuration/constants/order-by.constants';
import { HistoryService } from 'src/api/common/services/history.service';
import { CreateDonorsDto, UpdateDonorsDto } from '../dto/create-donors.dto';
import { Donors } from '../entities/donors.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import {
  GetAllDonorsAppointments,
  GetAllDonorsInterface,
  GetAppointmentCreateDetailsInterface,
  GetAppointmentsCreateListingInterface,
  GetStartTimeCreateDetailsInterface,
} from '../interface/donors.interface';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { Contacts } from '../../common/entities/contacts.entity';
import { CommonFunction } from '../../common/common-functions';
import { AddressService } from '../../common/address.service';
import { ContactsService } from '../../common/contacts.service';
import { AttachmentableType, ContactTypeEnum } from '../../common/enums';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { PolymorphicType } from 'src/api/common/enums/polymorphic-type.enum';
import { ExportService } from '../../common/exportData.service';
import { saveCustomFields } from 'src/api/common/services/saveCustomFields.service';
import { CustomFields } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-field.entity';
import { DonorsAppointments } from '../entities/donors-appointments.entity';
import { Shifts } from 'src/api/shifts/entities/shifts.entity';
import { shiftable_type_enum } from 'src/api/shifts/enum/shifts.enum';
import { ShiftsSlots } from 'src/api/shifts/entities/shifts-slots.entity';
import { Drives } from 'src/api/operations-center/operations/drives/entities/drives.entity';
import { Sessions } from 'src/api/operations-center/operations/sessions/entities/sessions.entity';
import moment from 'moment';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { DonorsAppointmentsHistory } from '../entities/donors-appointments-history.entity';
import { CreateDonorAppointmentDto } from '../dto/create-donors-appointment.dto';
import {
  cancelDonorAppointmentDto,
  updateDonorAppointmentDto,
} from '../dto/update-donors-appointment.dto';
import { BBCSConnector } from 'src/connector/bbcsconnector';
import { enumKeyByValue } from 'src/common/utils/enum';
import { getTenantConfig } from 'src/api/common/utils/tenantConfig';
import { TenantConfigurationDetail } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenantConfigurationDetail';
import { trimPhone } from 'src/common/utils/phone';

@Injectable()
export class DonorsService extends HistoryService<DonorsHistory> {
  private message = 'Donors';
  constructor(
    @InjectRepository(Donors)
    private entityRepository: Repository<Donors>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Contacts)
    private contactsRepository: Repository<Contacts>,
    @InjectRepository(DonorsHistory)
    private readonly entityHistoryRepository: Repository<DonorsHistory>,
    @InjectRepository(DonorsAppointments)
    private readonly entityDonorsAppointmentsRepository: Repository<DonorsAppointments>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Shifts)
    private readonly shiftsRepository: Repository<Shifts>,

    @InjectRepository(ShiftsSlots)
    private readonly shiftsSlotsRepository: Repository<ShiftsSlots>,

    @InjectRepository(Drives)
    private readonly drivesRepository: Repository<Drives>,

    @InjectRepository(Sessions)
    private readonly sessionsRepository: Repository<Sessions>,

    @InjectRepository(CustomFields)
    private readonly customFieldsRepository: Repository<CustomFields>,
    @InjectRepository(DonorsAppointmentsHistory)
    private readonly donorsAppointmentsHistoryRepository: Repository<DonorsAppointmentsHistory>,
    @InjectRepository(TenantConfigurationDetail)
    private readonly tenantConfigRepository: Repository<TenantConfigurationDetail>,
    private readonly commonFunction: CommonFunction,
    private readonly entityManager: EntityManager,
    private readonly addressService: AddressService,
    private readonly contactsService: ContactsService,
    private readonly exportService: ExportService,
    private readonly bbcsConnector: BBCSConnector
  ) {
    super(entityHistoryRepository);
  }

  /**
   * create new entity
   * @param createDto
   * @returns
   */
  async create(createdDto: CreateDonorsDto, user: User) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await this.commonFunction.entityExist(
        this.userRepository,
        { where: { id: createdDto?.created_by } },
        'User'
      );
      const { address, contact, ...createDto } = createdDto;
      const create = new Donors();
      const keys = Object.keys(createDto);
      //set values in create obj
      for (const key of keys) {
        create[key] = createDto?.[key];
      }
      // Save entity
      const saveObj = await queryRunner.manager.save(create);

      const donorCustomFieds = [];
      await saveCustomFields(
        this.customFieldsRepository,
        queryRunner,
        saveObj,
        user,
        user.tenant,
        createDto,
        donorCustomFieds
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

  async updateToBBCS(donor: Donors, updatedDto: UpdateDonorsDto) {
    /**
     * The function `isUpdate` checks if there are any differences between the properties of two
     * objects.
     * @param {any} src - The `src` parameter is an object that represents the source data.
     * @param {any} dest - The `dest` parameter is the destination object that you want to compare with
     * the `src` object.
     * @param {string[]} [keys] - The `keys` parameter is an optional array of strings. It represents
     * the specific keys that should be checked for updates. If this parameter is provided, only the
     * keys in the `src` object that are present in the `keys` array will be considered for comparison.
     * @returns a boolean value.
     */
    const isUpdate = (src: any, dest: any, keys?: string[]): boolean => {
      if (!src) return false;
      else if (!dest) return true;

      let truthy = false;
      const srcKeys = keys && keys.length ? keys : Object.keys(src);
      srcKeys.forEach((key) => {
        if (src[key] !== dest[key]) {
          truthy = true;
          return;
        }
      });

      return truthy;
    };

    // tenant configs
    const tenantConfig = await getTenantConfig(
      this.tenantConfigRepository,
      donor.tenant_id.id
    );

    const address = updatedDto.address;
    if (
      isUpdate(
        address,
        await this.addressRepository.findOneBy({ id: address.id }),
        [
          'address1',
          'address2',
          'zip_code',
          'city',
          'state',
          'country',
          'latitude',
          'longitude',
        ]
      )
    ) {
      // update address of donor into BBCS
      console.log(
        `Donor ${donor.id} address "${JSON.stringify(
          address
        )}" needs to be updated in BBCS`
      );
      await this.bbcsConnector.modifyDonor(
        {
          addressLineOne: address.address1,
          addressLineTwo: address.address2,
          city: address.city,
          state: address.state,
          zipCode: address.zip_code,
          uuid: donor.external_id,
          user: 'D37',
        },
        tenantConfig
      );
    }

    const email = updatedDto.contact.find(
      (c) => c.contact_type >= 4 && c.contact_type <= 6 && c.is_primary === true
    );

    if (
      email &&
      isUpdate(
        email,
        await this.contactsRepository.findOneBy({
          data: email.data,
          is_archived: false,
        }),
        ['data']
      )
    ) {
      // update email of donor into BBCS
      console.log(
        `Donor ${donor.id} email "${email.data}" needs to be updated in BBCS`
      );
      await this.bbcsConnector.modifyDonor(
        {
          email: email.data,
          uuid: donor.external_id,
          user: 'D37',
        },
        tenantConfig
      );
    }

    const phones = updatedDto.contact.filter(
      (c) => c.contact_type >= 1 && c.contact_type <= 3
    );

    const deletePhones = await this.contactsRepository.findBy({
      data: Not(In(phones.map((p) => p.data))),
      contactable_type: PolymorphicType.CRM_CONTACTS_DONORS,
      contactable_id: donor.id,
      contact_type: Between(1, 3),
      is_archived: false,
    });

    for (const phone of deletePhones) {
      // delete phone of donor into BBCS
      console.log(
        `Donor ${donor.id} ${enumKeyByValue(
          ContactTypeEnum,
          phone.contact_type
        )} "${phone.data}" needs to be deleted in BBCS`
      );

      await this.bbcsConnector.modifyDonor(
        {
          ...(phone.contact_type === 1 && { workPhone: '' }),
          ...(phone.contact_type === 2 && { cellPhone: '' }),
          ...(phone.contact_type === 3 && { homePhone: '' }),
          uuid: donor.external_id,
          user: 'D37',
        },
        tenantConfig
      );
    }

    for (const phone of phones) {
      const storedPhone = await this.contactsRepository.findOneBy({
        data: phone.data,
        contactable_type: PolymorphicType.CRM_CONTACTS_DONORS,
        contactable_id: donor.id,
        contact_type: phone.contact_type,
        is_archived: false,
      });
      if (phone?.id && storedPhone && phone?.data === storedPhone?.data) {
        continue;
      }

      // update phone of donor into BBCS
      console.log(
        `Donor ${donor.id} ${enumKeyByValue(
          ContactTypeEnum,
          phone.contact_type
        )} "${phone.data}" needs to be updated in BBCS`
      );

      await this.bbcsConnector.modifyDonor(
        {
          ...(phone.contact_type === 1 && { workPhone: trimPhone(phone.data) }),
          ...(phone.contact_type === 2 && { cellPhone: trimPhone(phone.data) }),
          ...(phone.contact_type === 3 && { homePhone: trimPhone(phone.data) }),
          uuid: donor.external_id,
          user: 'D37',
        },
        tenantConfig
      );
    }
  }

  /**
   * update record
   * insert data in history table
   * @param id
   * @param updateDto
   * @returns
   */
  async update(id: any, updatedDto: UpdateDonorsDto, myUser: User) {
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
          relations: ['created_by', 'tenant_id'],
          where: { id },
        },
        this.message
      );

      // updating custom fields
      const donorsCustomFileds = [];
      await saveCustomFields(
        this.customFieldsRepository,
        queryRunner,
        entity,
        myUser,
        myUser.tenant,
        updatedDto,
        donorsCustomFileds
      );

      // store donor history
      const saveHistory = new DonorsHistory();
      Object.assign(saveHistory, entity);
      saveHistory.history_reason = 'C';
      saveHistory.created_by = user.id;
      saveHistory.tenant_id = entity.tenant_id.id;
      delete saveHistory?.created_at;
      await this.createHistory(saveHistory);

      // update donor into BBCS
      await this.updateToBBCS(entity, updatedDto);

      // update donor details
      Object.assign(entity, updateDto);
      entity.created_by = user;
      const updatedData = await this.entityRepository.save(entity);

      // update address details
      address.created_by = updateDto?.created_by;
      address.tenant_id = updateDto?.tenant_id;
      address.coordinates = `(${updatedDto?.address?.latitude}, ${updatedDto?.address?.longitude})`;
      await this.addressService.updateAddress(address);

      // update contact details
      await this.contactsService.updateContacts(
        id,
        updatedDto,
        AttachmentableType.CRM_CONTACTS_DONORS
      );

      // commit all changes
      await queryRunner.commitTransaction();
      return {
        status: HttpStatus.CREATED,
        message: `${this.message} update successfully`,
        data: updatedData,
      };
    } catch (error) {
      console.error(error);
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
      const saveHistory = new DonorsHistory();
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

  async addDonorAppointment(
    createDonorAppointmentDto: CreateDonorAppointmentDto
  ) {
    try {
      const user = await this.userRepository.findOneBy({
        id: createDonorAppointmentDto?.created_by,
      });
      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      const appointment = new DonorsAppointments();
      appointment.appointmentable_id =
        createDonorAppointmentDto?.appointmentable_id;
      appointment.appointmentable_type =
        createDonorAppointmentDto?.appointmentable_type;
      appointment.slot_id = createDonorAppointmentDto.slot_id;
      appointment.created_by = createDonorAppointmentDto.created_by;
      appointment.status = createDonorAppointmentDto?.status || '1';
      appointment.donor_id = createDonorAppointmentDto?.donor_id;
      appointment.note = createDonorAppointmentDto?.note;
      appointment.procedure_type_id =
        createDonorAppointmentDto?.procedure_type_id;
      const savedAppointment =
        await this.entityDonorsAppointmentsRepository.save(appointment);
      return resSuccess(
        'Donor Appointment Created.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedAppointment
      );
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async updateDonorAppointment(
    userId: any,
    donorId: bigint,
    appointmentId: bigint,
    updateDonorAppointmentDto: updateDonorAppointmentDto
  ) {
    try {
      const existingAppointment =
        await this.entityDonorsAppointmentsRepository.findOneBy({
          donor_id: donorId,
          id: appointmentId,
        });
      if (!existingAppointment) {
        throw new HttpException(`Appointment not found.`, HttpStatus.NOT_FOUND);
      }
      const appointment = new DonorsAppointmentsHistory();
      appointment.appointmentable_id = existingAppointment?.appointmentable_id;
      appointment.appointmentable_type =
        existingAppointment?.appointmentable_type;
      appointment.slot_id = existingAppointment.slot_id;
      appointment.created_by = userId;
      appointment.status = existingAppointment?.status;
      appointment.donor_id = existingAppointment?.donor_id;
      appointment.id = existingAppointment?.id;
      appointment.history_reason = 'C';
      appointment.procedure_type_id = existingAppointment?.procedure_type_id;

      await this.donorsAppointmentsHistoryRepository.save(appointment);
      const updatedAppointment =
        await this.entityDonorsAppointmentsRepository.update(
          { id: appointmentId },
          updateDonorAppointmentDto
        );
      return resSuccess(
        'Donor Appointment Updated.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        updatedAppointment
      );
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async cancelDonorAppointment(
    userId: any,
    donorId: bigint,
    appointmentId: bigint,
    cancelDonorAppointmentDto: cancelDonorAppointmentDto
  ) {
    try {
      const existingAppointment =
        await this.entityDonorsAppointmentsRepository.findOneBy({
          donor_id: donorId,
          id: appointmentId,
        });
      if (!existingAppointment) {
        throw new HttpException(`Appointment not found.`, HttpStatus.NOT_FOUND);
      }
      const appointment = new DonorsAppointmentsHistory();
      appointment.appointmentable_id = existingAppointment?.appointmentable_id;
      appointment.appointmentable_type =
        existingAppointment?.appointmentable_type;
      appointment.slot_id = existingAppointment.slot_id;
      appointment.created_by = userId;
      appointment.status = existingAppointment?.status;
      appointment.donor_id = existingAppointment?.donor_id;
      appointment.id = existingAppointment?.id;
      appointment.history_reason = 'C';
      appointment.procedure_type_id = existingAppointment?.procedure_type_id;

      await this.donorsAppointmentsHistoryRepository.save(appointment);
      const updatedAppointment =
        await this.entityDonorsAppointmentsRepository.update(
          { id: appointmentId },
          cancelDonorAppointmentDto
        );
      return resSuccess(
        'Donor Appointment Cancelled.', // message
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        updatedAppointment
      );
    } catch (error) {
      // return error
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findBySlotAndProcedureType(data: any) {
    try {
      const res = await this.entityDonorsAppointmentsRepository.find({
        where: {
          slot_id: data?.slot_id,
          procedure_type_id: data?.procedure_type_id,
          is_archived: false,
        },
        relations: ['created_by', 'tenant_id'],
      });
      return {
        status: HttpStatus.OK,
        message: `${this.message} found successfully`,
        data: res,
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
        AttachmentableType.CRM_CONTACTS_DONORS,
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
        '<<<<<<<<<<<<<<<<<<<<<<< Contact Donors findOne >>>>>>>>>>>>>>>>>>>>>>>>>'
      );
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  /**
   * get all records
   * @param getAllInterface
   * @returns {objects}
   * @deprecated
   */
  async findAll(getAllInterface: GetAllDonorsInterface) {
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

      Object.assign(where, {
        tenant_id: { id: getAllInterface['tenant_id'] },
      });

      if (name) {
        Object.assign(where, {
          first_name: ILike(`%${name}%`),
        });
      }

      const [data, count] = await this.entityRepository.findAndCount({
        relations: ['created_by', 'tenant_id', 'prefix_id', 'suffix_id'],
        where,
        skip,
        take,
        order,
      });
      const entities = [];
      for (const entity of data) {
        const data = await this.commonFunction.createObj(
          AttachmentableType.CRM_CONTACTS_DONORS,
          entity
        );
        entities.push({ ...data });
      }
      return {
        status: HttpStatus.OK,
        message: `${this.message} fetched successfully.`,
        count: count,
        data: entities,
      };
    } catch (error) {
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * get all filtered records
   * @param getAllInterface
   * @returns {objects}
   */
  async findAllFiltered(getAllInterface: GetAllDonorsInterface) {
    try {
      const {
        name,
        limit = parseInt(process.env.PAGE_SIZE),
        page = 1,
        sortBy = 'donor.id',
        sortOrder = OrderByConstants.DESC,
        fetchAll,
      } = getAllInterface;

      let donorQuery = this.entityRepository
        .createQueryBuilder('donor')
        .leftJoinAndSelect(
          'address',
          'address',
          `address.addressable_id = donor.id AND (address.addressable_type = '${PolymorphicType.CRM_CONTACTS_DONORS}')`
        )
        .leftJoinAndSelect(
          'contacts',
          'phone',
          `phone.contactable_id = donor.id AND (phone.is_primary = true AND phone.contactable_type = '${PolymorphicType.CRM_CONTACTS_DONORS}' AND phone.contact_type >= '${ContactTypeEnum.WORK_PHONE}' AND phone.contact_type <= '${ContactTypeEnum.OTHER_PHONE}')`
        )
        .leftJoinAndSelect(
          'contacts',
          'email',
          `email.contactable_id = donor.id AND (email.is_primary = true AND email.contactable_type = '${PolymorphicType.CRM_CONTACTS_DONORS}' AND email.contact_type >= '${ContactTypeEnum.WORK_EMAIL}' AND email.contact_type <= '${ContactTypeEnum.OTHER_EMAIL}')`
        )
        .where({
          is_archived: false,
          tenant_id: { id: getAllInterface['tenant_id'] },
        })
        .select([
          'donor.id AS donor_id',
          "concat(donor.first_name, ' ', donor.last_name) AS name",
          'address.city AS address_city',
          'address.state AS address_state',
          'phone.data AS primary_phone',
          'address.address1 AS address1',
          'address.address2 AS address2',
          'address.zip_code AS zip_code',
          'email.data AS primary_email',
          'donor.blood_type AS blood_type',
          'external_id',
          /**
           * TODO: we need to fetch it from other service in future.
           */
          'null AS last_donation',
        ]);
      let exportData;
      const isFetchAll = fetchAll ? fetchAll.trim() === 'true' : false;
      if (isFetchAll) {
        exportData = await donorQuery.getRawMany();
      }
      if (name) {
        donorQuery = donorQuery.andWhere(`email.data ILIKE :data`, {
          data: `%${name}%`,
        });
        donorQuery = donorQuery.orWhere(`external_id ILIKE :external_id`, {
          external_id: `%${name}%`,
        });
        donorQuery = donorQuery.orWhere(`phone.data ILIKE :data`, {
          data: `%${name}%`,
        });
        donorQuery = donorQuery.orWhere(
          `concat(donor.first_name, ' ', donor.last_name) ILIKE :name`,
          {
            name: `%${name}%`,
          }
        );
      }
      if (getAllInterface?.blood_type)
        donorQuery = donorQuery.andWhere({
          blood_type: ILike(`%${getAllInterface.blood_type}%`),
        });
      if (getAllInterface?.city)
        donorQuery = donorQuery.andWhere(`address.city ILIKE :city`, {
          city: `%${getAllInterface.city}%`,
        });
      if (getAllInterface?.state)
        donorQuery = donorQuery.andWhere(`address.state ILIKE :state`, {
          state: `%${getAllInterface.state}%`,
        });

      if (getAllInterface?.keyword) {
        const keywordCondition = `%${getAllInterface.keyword}%`;

        donorQuery = donorQuery.andWhere(
          new Brackets((qb) => {
            qb.where(`donor.external_id ILIKE :external_id`, {
              external_id: keywordCondition,
            })

              .orWhere(`email.data ILIKE :email`, { email: keywordCondition })
              .orWhere(
                "(donor.first_name || ' ' || donor.last_name) ILIKE :name",
                {
                  name: `%${keywordCondition}%`,
                }
              );
          })
        );

        donorQuery = donorQuery.orWhere(`phone.data ILIKE :data`, {
          data: `%${getAllInterface?.keyword.replace(/%/g, ' ')}%`,
        });
      }

      if (sortBy && sortOrder)
        donorQuery = donorQuery.orderBy({
          [sortBy]: sortOrder === 'DESC' ? 'DESC' : 'ASC',
        });

      const count = await donorQuery.getCount();
      if (!isFetchAll) {
        exportData = await donorQuery.getRawMany();
      }
      if (page && limit) {
        const { skip, take } = this.commonFunction.pagination(limit, page);
        donorQuery = donorQuery.limit(take).offset(skip);
      }

      const records = await donorQuery.getRawMany();
      let url;
      if (getAllInterface?.exportType && getAllInterface.downloadType) {
        const columnsToFilter = new Set(
          getAllInterface.tableHeaders.split(',')
        );
        const filteredData = exportData.map((obj) => {
          const newObj = {};
          for (const [key, val] of Object.entries(obj)) {
            const keyName = key === 'donor_id' ? 'external_id' : key;
            if (key === 'external_id') continue;
            if (columnsToFilter.has(keyName)) {
              const keys =
                key === 'address_state'
                  ? 'state'
                  : key === 'address_city'
                  ? 'city'
                  : key;
              newObj[keys] = val;
            }
          }
          return newObj;
        });
        const prefixName = getAllInterface?.selectedOptions
          ? getAllInterface?.selectedOptions.trim()
          : 'Donors';
        url = await this.exportService.exportDataToS3(
          filteredData,
          getAllInterface,
          prefixName,
          'Donors'
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
      console.error(error);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async fetchDonorAppointments(
    getAppointmentsInterface: GetAllDonorsAppointments
  ) {
    try {
      let { sortBy, sortOrder } = getAppointmentsInterface;
      const {
        page,
        limit,
        status,
        procedure_type,
        locationType,
        search,
        dateRange,
        donor_id,
      } = getAppointmentsInterface;
      if (sortBy) {
        if (sortBy === 'slot_start_time') {
          sortBy = `(SELECT MIN(EXTRACT(HOUR FROM shifts_slots.start_time)*60 + EXTRACT(MINUTE FROM shifts_slots.start_time)) FROM shifts_slots WHERE donor_appointment.slot_id = shifts_slots.id)`;
          sortOrder = sortOrder?.toUpperCase();
        }
        if (sortBy === 'status') {
          sortBy = 'donor_appointment.status';
          sortOrder = sortOrder?.toUpperCase();
        }
        if (sortBy === 'note') {
          sortBy = 'donor_appointment.note';
          sortOrder = sortOrder?.toUpperCase();
        }
        if (sortBy === 'donation_type') {
          sortBy = `(
          SELECT procedure_types.name
          FROM procedure_types 
          WHERE donor_appointment.procedure_type = procedure_types.id)`;
          sortOrder = sortOrder?.toUpperCase();
        }
        if (sortBy === 'date') {
          sortBy = `(
            SELECT COALESCE(
              (
                SELECT sessions.date 
                FROM sessions 
                WHERE "donor_appointment"."appointmentable_id" = sessions.id 
                AND "donor_appointment"."appointmentable_type" = 'session'
              ),
              (
                SELECT drives.date
                FROM drives 
                WHERE "donor_appointment"."appointmentable_id" = drives.id 
                AND "donor_appointment"."appointmentable_type" = 'drives'
              )
            )
          )`;
          sortOrder = sortOrder?.toUpperCase();
        }
        if (sortBy === 'location') {
          sortBy = `(
            SELECT COALESCE(
              (
                SELECT facility.name
                FROM facility 
                WHERE facility.id = (
                  SELECT sessions.donor_center_id
                  FROM sessions
                  WHERE "donor_appointment"."appointmentable_id" = sessions.id
                  AND "donor_appointment"."appointmentable_type" = 'session'
                )
              ),
              (
                SELECT crm_locations.name
                FROM crm_locations
                WHERE crm_locations.id = (
                  SELECT drives.location_id
                  FROM drives
                  WHERE "donor_appointment"."appointmentable_id" = drives.id
                  AND "donor_appointment"."appointmentable_type" = 'drives'
                )
              )
            )
          )`;
          sortOrder = sortOrder?.toUpperCase();
        }
      }
      const query = this.entityDonorsAppointmentsRepository
        .createQueryBuilder('donor_appointment')
        .select(
          `(JSON_BUILD_OBJECT('id',donor_appointment.id, 'status', donor_appointment.status, 
          'note', donor_appointment.note, 'type', donor_appointment.appointmentable_type)) 
          as donor_appointment`
        )
        .addSelect(
          `(  SELECT COALESCE(
            (SELECT JSON_BUILD_OBJECT('date', sessions.date,'location', (
                SELECT JSON_BUILD_OBJECT(
                    'id', dc.id,'created_at', dc.created_at, 'location', dc.name
                )
                FROM facility dc
                WHERE dc.id = sessions.donor_center_id
            )) 
            FROM sessions 
            WHERE "donor_appointment"."appointmentable_id" = sessions.id AND "donor_appointment"."appointmentable_type" = 'session'
            ),
            (SELECT JSON_BUILD_OBJECT('date', drives.date,'location', (
                SELECT JSON_BUILD_OBJECT(
                    'id', loc.id, 'location', loc.name, 'account_id', drives.account_id
                )
                FROM crm_locations loc
                WHERE loc.id = drives.location_id
            )) 
            FROM drives 
            WHERE "donor_appointment"."appointmentable_id" = drives.id 
            AND "donor_appointment"."appointmentable_type" = 'drives'
            )
        ))`,
          'date'
        )
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT('slot_start_time', shifts_slots.start_time,'slot_end_time', shifts_slots.end_time ) 
          FROM shifts_slots WHERE donor_appointment.slot_id = shifts_slots.id
            )`,
          'shifts_slots'
        )
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT('donation_type', procedure_types.name, 'donation_id', procedure_types.id) 
          FROM procedure_types 
          WHERE donor_appointment.procedure_type = procedure_types.id
            )`,
          'procedure_types'
        )
        .leftJoin('donor_appointment.procedure_type', 'procedure_type')
        .leftJoin('donor_appointment.slot_id', 'slot_id')
        .orderBy(
          sortBy || 'donor_appointment.id',
          (sortOrder as 'ASC' | 'DESC') || 'DESC'
        )
        .where(
          `donor_appointment.is_archived = false AND donor_appointment.donor_id = ${donor_id}`
        )
        .getQuery();
      let withWhereQuery = query.split('ORDER BY')[0];
      const orderQuery = query.split('ORDER BY')[1];
      if (procedure_type) {
        withWhereQuery += ` AND "donor_appointment"."procedure_type_id" = ${procedure_type}`;
      }
      if (status) {
        withWhereQuery += ` AND "donor_appointment"."status" = '${status}'`;
      }

      if (locationType) {
        withWhereQuery += ` AND (SELECT COALESCE(
          (
            SELECT facility.name
            FROM facility 
            WHERE facility.id = (
              SELECT sessions.donor_center_id
              FROM sessions
              WHERE "donor_appointment"."appointmentable_id" = sessions.id
              AND "donor_appointment"."appointmentable_type" = 'session'
            )
          ),
          (
            SELECT crm_locations.name
            FROM crm_locations
            WHERE crm_locations.id = (
              SELECT drives.location_id
              FROM drives
              WHERE "donor_appointment"."appointmentable_id" = drives.id
              AND "donor_appointment"."appointmentable_type" = 'drives'
            )
          )
        )
      ) = '${locationType}'`;
      }
      if (dateRange) {
        const startDate = dateRange?.split(' ')[0];
        const endDate = dateRange?.split(' ')[1];
        const queryDate = ` AND (SELECT COALESCE(
        (
            SELECT sessions.date
            FROM sessions
            WHERE "donor_appointment"."appointmentable_id" = sessions.id
            AND "donor_appointment"."appointmentable_type" = 'session'
        ),
        (
            SELECT drives.date
            FROM drives
            WHERE "donor_appointment"."appointmentable_id" = drives.id
            AND "donor_appointment"."appointmentable_type" = 'drives'
          )
      )
    )`;
        withWhereQuery += queryDate + ` >= DATE '${startDate}'`;
        withWhereQuery += queryDate + ` <= DATE '${endDate}'`;
      }

      if (search) {
        withWhereQuery += ` AND (SELECT COALESCE(
            (
              SELECT facility.name
              FROM facility 
              WHERE facility.id = (
                SELECT sessions.donor_center_id
                FROM sessions
                WHERE "donor_appointment"."appointmentable_id" = sessions.id
                AND "donor_appointment"."appointmentable_type" = 'session'
              )
            ),
            (
              SELECT crm_locations.name
              FROM crm_locations
              WHERE crm_locations.id = (
                SELECT drives.location_id
                FROM drives
                WHERE "donor_appointment"."appointmentable_id" = drives.id
                AND "donor_appointment"."appointmentable_type" = 'drives'
              )
            )
          ) ILIKE '%${search}%' OR (
            SELECT procedure_types.name
            FROM procedure_types 
            WHERE donor_appointment.procedure_type_id = procedure_types.id) ILIKE '%${search}%')`;
      }

      const count = await this.entityDonorsAppointmentsRepository.query(
        ` SELECT COUNT(*) OVER()
        FROM (${withWhereQuery} ORDER BY ${orderQuery}) as subquery`
      );

      const appointments = await this.entityDonorsAppointmentsRepository.query(
        withWhereQuery +
          ' ORDER BY ' +
          orderQuery +
          ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`
      );

      return {
        status: HttpStatus.OK,
        message: `Donor schedule fetched successfully.`,
        count: count?.[0]?.count,
        data: appointments,
      };
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getDonorAppointment(id: any) {
    try {
      const query = this.entityDonorsAppointmentsRepository
        .createQueryBuilder('donor_appointment')
        .select(
          `(JSON_BUILD_OBJECT('id',donor_appointment.id, 'status', donor_appointment.status, 'note', donor_appointment.note,'created_at',donor_appointment.created_at,'created_by',donor_appointment.created_by)) as donor_appointment`
        )
        .addSelect(
          `(  SELECT COALESCE(
            (SELECT JSON_BUILD_OBJECT('date', sessions.date,'location', (
                SELECT JSON_BUILD_OBJECT(
                    'id', dc.id,'created_at', dc.created_at, 'location', dc.name
                )
                FROM facility dc
                WHERE dc.id = sessions.donor_center_id
            )) 
            FROM sessions 
            WHERE "donor_appointment"."appointmentable_id" = sessions.id AND "donor_appointment"."appointmentable_type" = 'session'
            ),
            (SELECT JSON_BUILD_OBJECT('date', drives.date,'location', (
                SELECT JSON_BUILD_OBJECT(
                    'id', loc.id, 'location', loc.name
                )
                FROM crm_locations loc
                WHERE loc.id = drives.location_id
            )) 
            FROM drives 
            WHERE "donor_appointment"."appointmentable_id" = drives.id AND "donor_appointment"."appointmentable_type" = 'drives'
            )
        ))`,
          'date'
        )
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT('slot_start_time', shifts_slots.start_time) FROM shifts_slots WHERE donor_appointment.slot_id = shifts_slots.id
            )`,
          'shifts_slots'
        )
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT('first_name', "user"."first_name" ,'last_name', "user"."last_name" ) FROM "user" WHERE "donor_appointment"."created_by" = "user"."id"
            )`,
          'created_by'
        )
        .addSelect(
          `(SELECT JSON_BUILD_OBJECT('donation_type', procedure_types.name) FROM procedure_types WHERE donor_appointment.procedure_type = procedure_types.id
            )`,
          'procedure_types'
        )
        .leftJoin('donor_appointment.procedure_type', 'procedure_type')
        .leftJoin('donor_appointment.slot_id', 'slot_id')
        .where(`donor_appointment.is_archived = false`)
        .where(`donor_appointment.id = ${id}`)
        .getQuery();

      const appointments = await this.entityDonorsAppointmentsRepository.query(
        query
      );

      return {
        status: HttpStatus.OK,
        message: `Donor schedule fetched successfully.`,
        data: appointments,
      };
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSingleAppointment(id: any) {
    const result = await this.entityDonorsAppointmentsRepository.findOne({
      where: { id: id },
      relations: ['donor_id', 'slot_id', 'procedure_type'],
    });
    if (!result) {
      throw new HttpException(`Appointment not found.`, HttpStatus.NOT_FOUND);
    }

    return {
      status: HttpStatus.OK,
      message: `Appointment fetched successfully.`,
      data: result,
    };
  }

  async getDonorAppointmentFilters(tenant_id: bigint) {
    try {
      // Getting procedure types filter
      const procedureTypes = await this.entityManager.query(`
      SELECT procedure.name AS label, procedure.id AS value 
      FROM procedure_types procedure
      WHERE procedure.id IN (
          SELECT shifts_projections_staff.procedure_type_id 
          FROM shifts_projections_staff
          WHERE shifts_projections_staff.shift_id IN (
              SELECT shifts.id 
              FROM shifts
              WHERE shiftable_type ILIKE 'sessions' OR shiftable_type ILIKE 'drives'
          )
      )`);

      // Getting account filters
      const accounts = await this.drivesRepository
        .createQueryBuilder('drive')
        .select(['account.name as label', 'account.id as value'])
        .innerJoin('drive.account', 'account')
        .where({ tenant_id: { id: tenant_id } })
        .groupBy('account.id, account.name')
        .getRawMany();

      // Getting donor centers filters
      const donorCenters = await this.sessionsRepository
        .createQueryBuilder('sessions')
        .select(['donor_center.name as label', 'donor_center.id as value'])
        .innerJoin('sessions.donor_center', 'donor_center')
        .where({ tenant_id: { id: tenant_id } })
        .groupBy('donor_center.id, donor_center.name')
        .getRawMany();

      return {
        status: HttpStatus.OK,
        message: `Schedule donor filter fetched successfully.`,
        data: { procedureTypes, accounts, donorCenters },
      };
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async createDonorListing(
    id: bigint,
    getAppointmentsCreateListingInterface: GetAppointmentsCreateListingInterface,
    tenant_id: bigint
  ) {
    try {
      const {
        page,
        limit,
        procedureType,
        accountType,
        dateRange,
        donorCenter,
        earlierThan,
        laterThan,
        sortBy,
        sortOrder,
        radius,
      } = getAppointmentsCreateListingInterface;
      let newSort = '';
      const radiusIds = {
        drives: [],
        sessions: [],
      };
      const latLongDonor = await this.addressRepository.findOne({
        where: {
          addressable_type: PolymorphicType.CRM_CONTACTS_DONORS,
          addressable_id: id,
        },
        select: ['latitude', 'longitude'],
      });
      let testDebugRes;
      if (radius) {
        const resAdd = await this.addressRepository.query(`SELECT
        a.id,
        a.addressable_type,
        a.addressable_id,
        a.coordinates,
        a.latitude,
        a.longitude,
        COALESCE(s.id, d.id) as temp_id
         FROM
           address a
         LEFT JOIN
           facility f ON f.id = a.addressable_id AND a.addressable_type = 'facility' AND f.donor_center = true
         LEFT JOIN
           sessions s ON s.donor_center_id = f.id
         LEFT JOIN
           crm_locations cl ON cl.id = a.addressable_id AND a.addressable_type = 'crm_locations'
        LEFT JOIN
           drives d ON d.location_id = cl.id
         WHERE
        a.tenant_id = ${tenant_id}
        AND (f.id IS NOT NULL OR a.addressable_type = 'crm_locations')
        AND a.latitude IS NOT NULL
        AND a.longitude IS NOT NULL;`);

        testDebugRes = { alladdresses: resAdd, latLongDonor };
        console.log({ testDebugRes });

        if (!latLongDonor?.latitude || !latLongDonor?.longitude) {
          radiusIds.drives.push(0);
          radiusIds.sessions.push(0);
        } else {
          resAdd?.map((singleAdd) => {
            console.log(resAdd);

            if (
              this.getDistanceFromLatLonInMiles(
                Number(singleAdd.latitude),
                Number(singleAdd.longitude),
                Number(latLongDonor.latitude),
                Number(latLongDonor.longitude)
              ) &&
              this.getDistanceFromLatLonInMiles(
                Number(singleAdd.latitude),
                Number(singleAdd.longitude),
                Number(latLongDonor.latitude),
                Number(latLongDonor.longitude)
              ) <= radius
            ) {
              if (singleAdd.addressable_type === 'crm_locations')
                radiusIds.drives.push(Number(singleAdd.temp_id));
              else radiusIds.sessions.push(Number(singleAdd.temp_id));
            }
          });
          if (!(radiusIds.drives.length > 0)) radiusIds.drives.push(0);
          if (!(radiusIds.sessions.length > 0)) radiusIds.sessions.push(0);
        }
      }
      console.log({ radiusIds });

      const startDate = dateRange?.split(' ')[0];
      const endDate = dateRange?.split(' ')[1];
      const earlyTime = moment(earlierThan).format('HH:mm:ss');
      const laterTime = moment(laterThan).format('HH:mm:ss');
      let queryBuilder: any;
      let queryBuilderDrive: any;
      const isCombined = !donorCenter && !accountType;

      if (donorCenter && accountType) {
        return {
          status: HttpStatus.OK,
          message: `Donor create schedule fetched successfully.`,
          count: 0,
          data: [],
        };
      }

      if ((donorCenter && !accountType) || isCombined) {
        queryBuilder = this.sessionsRepository
          .createQueryBuilder('sessions')
          .select([
            'DATE(sessions.date) as date',
            'sessions.id as id',
            'sessions.created_at as created_at',
            "'session' as type",
          ])
          .addSelect(
            `(
              SELECT dc.name
              FROM facility dc 
              WHERE dc.id = sessions.donor_center_id
              )`,
            'location'
          )
          .addSelect(
            `(SELECT p.name
              FROM promotion_entity p 
              WHERE p.id = (
                SELECT sp.promotion_id
                FROM sessions_promotions sp
                WHERE sp.session_id = sessions.id
                ORDER BY sp.created_at DESC
                LIMIT 1
              )
            ) AS "promotions"`
          )
          .addSelect(
            `(
              SELECT MAX(CAST(shifts.end_time AS TIME))
              FROM shifts
              WHERE shifts.shiftable_type ILIKE 'sessions'
                AND shifts.shiftable_id = sessions.id
            ) AS "earlier_than"`
          )
          .addSelect(
            `(
              SELECT MIN(CAST(shifts.start_time AS TIME))
              FROM shifts
              WHERE shifts.shiftable_type ILIKE 'sessions'
                AND shifts.shiftable_id = sessions.id
            ) AS "later_than"`
          )
          .innerJoin('sessions.donor_center', 'donor_center')
          .where({ tenant_id: { id: tenant_id }, is_archived: false });

        if (startDate && endDate) {
          queryBuilder = queryBuilder.andWhere({
            date: Between(new Date(startDate), new Date(endDate)),
          });
        } else
          queryBuilder = queryBuilder.andWhere({
            date: MoreThanOrEqual(new Date()),
          });
        if (earlierThan) {
          queryBuilder = queryBuilder.andWhere(`(
            SELECT MAX(CAST(shifts.end_time AS TIME))
            FROM shifts
            WHERE shifts.shiftable_type ILIKE 'sessions'
              AND shifts.shiftable_id = sessions.id
          ) >= '${earlyTime}'`);
        }
        if (radius) {
          queryBuilder = queryBuilder.andWhere(`
            sessions.id IN (${radiusIds.sessions})
          `);
        }
        if (procedureType)
          queryBuilder = queryBuilder.andWhere(
            ` 
        ${procedureType} IN (
          SELECT shifts_projections_staff.procedure_type_id
          FROM shifts_projections_staff
          WHERE shifts_projections_staff.shift_id IN (
            SELECT shifts.id
            FROM shifts
            WHERE shifts.shiftable_type ILIKE 'sessions'
              AND shifts.shiftable_id = sessions.id 
              AND shifts.is_archived = false
          )
        )
      `
          );

        if (laterThan) {
          queryBuilder = queryBuilder.andWhere(`(
            SELECT MIN(CAST(shifts.start_time AS TIME))
            FROM shifts
            WHERE shifts.shiftable_type ILIKE 'sessions'
              AND shifts.shiftable_id = sessions.id
          ) >= CAST('${laterTime}' AS TIME) `);
        }
        if (donorCenter)
          queryBuilder = queryBuilder.andWhere(
            `sessions.donor_center_id = ${donorCenter}`
          );

        if (sortBy) {
          if (sortBy === 'date') {
            newSort = `DATE(sessions.date)`;
          } else if (sortBy === 'location') {
            newSort = `(
              SELECT dc.name
              FROM facility dc 
              WHERE dc.id = sessions.donor_center_id
              )`;
          } else if (sortBy === 'promotions') {
            newSort = `(SELECT p.name
                FROM promotion_entity p 
                WHERE p.id = (
                  SELECT sp.promotion_id
                  FROM sessions_promotions sp
                  WHERE sp.session_id = sessions.id
                  ORDER BY sp.created_at DESC
                  LIMIT 1
                )
              )`;
          } else if (sortBy === 'appointmentTime') {
            newSort = `(
              SELECT CAST(shifts.start_time AS TIME)
              FROM shifts
              WHERE shifts.shiftable_type ILIKE 'sessions'
                AND shifts.shiftable_id = sessions.id
            )`;
          }
        }
      }

      if ((!donorCenter && accountType) || isCombined) {
        queryBuilderDrive = this.drivesRepository
          .createQueryBuilder('drives')
          .select([
            'DATE(drives.date) as date',
            'drives.id as id',
            'drives.created_at as created_at',
            "'drives' as type",
          ])
          .addSelect(
            ` (
            SELECT crm_locations.name
            FROM crm_locations
            WHERE crm_locations.id = drives.location_id
          )`,
            'location'
          )
          .addSelect(
            `(SELECT promotion_entity.name
              FROM promotion_entity 
              WHERE promotion_entity.id = drives.promotion_id
            ) AS "promotions"`
          )
          .addSelect(
            `(
              SELECT MAX(CAST(shifts.end_time AS TIME))
              FROM shifts
              WHERE shifts.shiftable_type ILIKE '${shiftable_type_enum.DRIVES}'
                AND shifts.shiftable_id = drives.id
            ) AS "earlier_than"`
          )
          .addSelect(
            `(
              SELECT MIN(CAST(shifts.start_time AS TIME))
              FROM shifts
              WHERE shifts.shiftable_type ILIKE '${shiftable_type_enum.DRIVES}'
                AND shifts.shiftable_id = drives.id
            ) AS "later_than"`
          )
          .innerJoin('drives.promotion', 'promotion_entity')
          .innerJoin('drives.location', 'crm_locations')
          .where({ tenant_id: { id: tenant_id }, is_archived: false });

        if (startDate && endDate) {
          queryBuilderDrive = queryBuilderDrive.andWhere({
            date: Between(new Date(startDate), new Date(endDate)),
          });
        } else
          queryBuilderDrive = queryBuilderDrive.andWhere({
            date: MoreThanOrEqual(new Date()),
          });

        if (procedureType)
          queryBuilderDrive = queryBuilderDrive.andWhere(
            ` 
          ${procedureType} IN (
            SELECT shifts_projections_staff.procedure_type_id
            FROM shifts_projections_staff
            WHERE shifts_projections_staff.shift_id IN (
              SELECT shifts.id
              FROM shifts
              WHERE shifts.shiftable_type ILIKE 'drives'
                AND shifts.shiftable_id = drives.id 
                AND shifts.is_archived = false
            )
          )
        `
          );

        if (accountType)
          queryBuilderDrive = queryBuilderDrive.andWhere(`
          drives.account = ${accountType}
        `);

        if (radius) {
          queryBuilderDrive = queryBuilderDrive.andWhere(`
            drives.id IN (${radiusIds.drives})
          `);
        }
        if (earlierThan) {
          queryBuilderDrive = queryBuilderDrive.andWhere(`(
            SELECT MAX(CAST(shifts.end_time AS TIME))
            FROM shifts
            WHERE shifts.shiftable_type ILIKE '${shiftable_type_enum.DRIVES}'
              AND shifts.shiftable_id = drives.id
          ) >= '${earlyTime}'`);
        }
        if (laterThan) {
          queryBuilderDrive = queryBuilderDrive.andWhere(`(
            SELECT MIN(CAST(shifts.start_time AS TIME))
            FROM shifts
            WHERE shifts.shiftable_type ILIKE '${shiftable_type_enum.DRIVES}'
              AND shifts.shiftable_id = drives.id
          ) >= CAST('${laterTime}' AS TIME) `);
        }

        if (sortBy) {
          if (sortBy === 'date') {
            newSort = `DATE(drives.date)`;
          } else if (sortBy === 'location') {
            newSort = `(
              SELECT crm_locations.name
              FROM crm_locations
              WHERE crm_locations.id = drives.location_id
            )`;
          } else if (sortBy === 'promotions') {
            newSort = `(SELECT promotion_entity.name
              FROM promotion_entity 
              WHERE promotion_entity.id = drives.promotion_id
            )`;
          } else if (sortBy === 'appointmentTime') {
            newSort = `(
              SELECT CAST(shifts.start_time AS TIME)
              FROM shifts
              WHERE shifts.shiftable_type ILIKE '${shiftable_type_enum.DRIVES}'
                AND shifts.shiftable_id = drives.id
            )`;
          }
        }
      }

      if (queryBuilder && !isCombined) {
        const [data, count] = await Promise.all([
          queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy(
              newSort || `sessions.id`,
              (sortOrder?.toUpperCase() as 'ASC' | 'DESC') || 'DESC'
            )
            .getRawMany(),
          queryBuilder.getCount(),
        ]);
        return {
          testDebugRes,

          status: HttpStatus.OK,
          message: `Donor create schedule fetched successfully.`,
          count: count,
          data: data,
        };
      }
      if (queryBuilderDrive && !isCombined) {
        const [data, count] = await Promise.all([
          queryBuilderDrive
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy(
              newSort || `drives.id`,
              (sortOrder?.toUpperCase() as 'ASC' | 'DESC') || 'DESC'
            )
            .getRawMany(),
          queryBuilderDrive.getCount(),
        ]);
        return {
          status: HttpStatus.OK,
          message: `Donor create schedule fetched successfully.`,
          count: count,
          testDebugRes,
          data: data,
        };
      } else {
        const baseParams: (bigint | boolean | Date | string[])[] = [
          tenant_id,
          false,
        ];

        if (dateRange) {
          baseParams.push(new Date(startDate), new Date(endDate));
        } else baseParams.push(new Date());

        if (sortBy === 'date') {
          newSort = 'DATE(date)';
        }
        if (sortBy === 'location') {
          newSort = 'location';
        }

        if (sortBy === 'promotions') {
          newSort = 'promotions';
        }
        if (sortBy === 'appointmentTime') {
          newSort = 'later_than';
        }

        let newQuery =
          queryBuilder?.getSql() +
          ' UNION ' +
          queryBuilderDrive?.getSql() +
          ` ORDER BY ${newSort || 'created_at'} ${
            sortOrder?.toUpperCase() || 'DESC'
          }`;

        const count = await this.entityManager.query(
          ` SELECT COUNT(*) OVER()
            FROM (${newQuery}) as subquery LIMIT 1`,
          baseParams
        );

        newQuery = newQuery + ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;

        const result = await this.entityManager.query(newQuery, baseParams);
        return {
          status: HttpStatus.OK,
          message: `Donor create schedule fetched successfully.`,
          count: count?.[0]?.count,
          data: result,
          testDebugRes,
        };
      }
    } catch (error) {
      console.log(error);

      throw new HttpException(
        { message: `error in fetching filters.`, error: error },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async archiveDonorAppointment(id: any, user) {
    try {
      const appointment: any =
        await this.entityDonorsAppointmentsRepository.findOne({
          where: {
            id: id,
          },
          relations: ['donor_id', 'slot_id', 'procedure_type'],
        });
      if (!appointment) {
        throw new HttpException(`Appointment not found.`, HttpStatus.NOT_FOUND);
      }
      if (appointment.is_archived === false) {
        appointment.is_archived = true;
        await this.entityDonorsAppointmentsRepository.save(appointment);

        const appointmentHistory: any = new DonorsAppointmentsHistory();
        appointmentHistory.id = appointment.id;
        appointmentHistory.appointmentable_id = appointment?.appointmentable_id;
        appointmentHistory.appointmentable_type =
          appointment?.appointmentable_type;
        appointmentHistory.created_by = user.id;
        appointmentHistory.donor_id = appointment.donor_id.id;
        appointmentHistory.slot_id = appointment.slot_id.id;
        appointmentHistory.procedure_type_id = appointment.procedure_type.id;
        appointmentHistory.status = appointment.status;
        appointmentHistory.is_archived = true;
        appointmentHistory.history_reason = 'C';
        await this.donorsAppointmentsHistoryRepository.save(appointmentHistory);
        const appointmentHistoryD: any = new DonorsAppointmentsHistory();
        appointmentHistoryD.id = appointment.id;
        appointmentHistoryD.appointmentable_id =
          appointment?.appointmentable_id;
        appointmentHistoryD.appointmentable_type =
          appointment?.appointmentable_type;
        appointmentHistoryD.created_by = user.id;
        appointmentHistoryD.donor_id = appointment.donor_id.id;
        appointmentHistoryD.slot_id = appointment.slot_id.id;
        appointmentHistoryD.procedure_type_id = appointment.procedure_type.id;
        appointmentHistoryD.status = appointment.status;
        appointmentHistoryD.is_archived = true;
        appointmentHistoryD.history_reason = 'D';
        await this.donorsAppointmentsHistoryRepository.save(
          appointmentHistoryD
        );
      } else {
        throw new HttpException(
          `Appointment is already archived.`,
          HttpStatus.NOT_FOUND
        );
      }

      return resSuccess(
        'Appointment archived successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      console.log(
        '<================== Donor archiveDonorAppointment ==================> '
      );
      console.log({ error });
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async getDonationTypeAppointmentCreateDetails(
    getAppointmentCreateDetailsInterface: GetAppointmentCreateDetailsInterface,
    tenant_id: any
  ) {
    try {
      const { id, type } = getAppointmentCreateDetailsInterface;

      const result = await this.entityManager.query(`
        SELECT DISTINCT ON (procedure_types.id) procedure_types.id as value, 
        procedure_types.name as label, 
        shifts_projections_staff.shift_id as shift_id
        FROM procedure_types
        JOIN shifts_projections_staff ON procedure_types.id = shifts_projections_staff.procedure_type_id
        WHERE procedure_types.id IN ( SELECT shifts_projections_staff.procedure_type_id
        FROM shifts_projections_staff
        WHERE shifts_projections_staff.shift_id IN (SELECT shifts.id
        FROM shifts
        WHERE shifts.shiftable_id = ${id}  ${
        tenant_id ? 'AND shifts.tenant_id = ' + tenant_id : ''
      } AND shifts.shiftable_type ILIKE '${
        type === 'drives'
          ? shiftable_type_enum.DRIVES
          : PolymorphicType.OC_OPERATIONS_SESSIONS
      }')) ORDER BY procedure_types.id, procedure_types.name DESC`);

      const locationDate =
        type === 'drives'
          ? await this.entityManager.query(`
        SELECT drives.date as date, crm_locations.name as location
        FROM drives
        INNER JOIN crm_locations ON drives.location_id = crm_locations.id
        WHERE drives.id = ${id}`)
          : await this.entityManager.query(`
        SELECT sessions.date as date, facility.name as location
        FROM sessions
        INNER JOIN facility ON sessions.donor_center_id = facility.id
        WHERE sessions.id = ${id}`);

      return {
        status: HttpStatus.OK,
        message: `Donoation type fetched successfully.`,
        data: { donationType: result, locationDate },
      };
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getStartTimeAppointmentCreateDetails(
    getStartTimeCreateDetailsInterface: GetStartTimeCreateDetailsInterface
  ) {
    try {
      const { slotId, shiftId, id, type, isCancelled } =
        getStartTimeCreateDetailsInterface;

      const compare =
        type === 'drives'
          ? shiftable_type_enum.DRIVES
          : PolymorphicType.OC_OPERATIONS_SESSIONS;

      const allShifts = await this.shiftsRepository.query(`
        SELECT shifts.id 
        FROM shifts 
        WHERE shifts.shiftable_type ILIKE '${compare}' AND shifts.shiftable_id = ${id}
      `);

      const shifts = allShifts?.map((shif) => shif?.id);

      const alreadyBooked = await this.entityDonorsAppointmentsRepository
        .query(`SELECT slots.id
        FROM shifts_slots slots
        LEFT JOIN donors_appointments appointments ON slots.id = appointments.slot_id
        WHERE slots.procedure_type_id = ${shiftId} 
        ${shifts ? `AND slots.shift_id IN (${shifts})` : ''} 
        ${slotId && isCancelled === 'false' ? `AND slots.id <> ${slotId}` : ''}
        AND appointments.status != '4'
        GROUP BY slots.id
        HAVING EXISTS (
            SELECT 1
            FROM donors_appointments AS da
            WHERE da.slot_id = slots.id AND da.is_archived = false AND da.status != '4'
        );
      `);

      const ids = alreadyBooked?.map((single) => single.id).join(',');
      const procedure_types = await this.shiftsSlotsRepository
        .query(`SELECT DISTINCT ON (slots.id)
      JSON_BUILD_OBJECT ('label', slots.start_time) as time,
      slots.id as value,
      slots.procedure_type_id as procedure
      FROM shifts_slots slots
      WHERE slots.procedure_type_id = ${shiftId}        
      ${shifts ? `AND slots.shift_id IN (${shifts})` : ''} 
      ${ids ? `AND slots.id NOT IN (${ids})` : ''}`);

      return {
        status: HttpStatus.OK,
        message: `Donoation type fetched successfully.`,
        data: procedure_types,
      };
    } catch (error) {
      console.log(error);

      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 0.621371;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}
