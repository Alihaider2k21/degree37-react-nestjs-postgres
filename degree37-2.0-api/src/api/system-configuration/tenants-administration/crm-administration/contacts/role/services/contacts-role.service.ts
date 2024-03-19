import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import {
  ArchiveDto,
  CreateContactsRoleDto,
} from '../dto/create-contacts-role.dto';
import { UpdateContactsRoleDto } from '../dto/update-contacts-role.dto';
import { ContactsRoles } from '../entities/contacts-role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Repository } from 'typeorm';
import { User } from '../../../../user-administration/user/entity/user.entity';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { GetAllRolesInterface } from '../interface/contact-role.interface';
import { ContactsRolesHistory } from '../entities/contact-role-history.entity';
import { getModifiedDataDetails } from 'src/common/utils/modified_by_detail';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';

@Injectable({ scope: Scope.REQUEST })
export class ContactsRoleService {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(ContactsRoles)
    private readonly contactsRolesRepository: Repository<ContactsRoles>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ContactsRolesHistory)
    private readonly contactsRolesHistoryRepo: Repository<ContactsRolesHistory>,
    private readonly entityManager: EntityManager
  ) {}

  async create(createContactsRoleDto: CreateContactsRoleDto) {
    try {
      const user = await this.userRepository.findOneBy({
        id: createContactsRoleDto?.created_by,
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      const short_name = await this.contactsRolesRepository.findOneBy({
        short_name: createContactsRoleDto?.short_name,
      });

      if (short_name) {
        throw new HttpException(
          `Short Name duplicate already exists.`,
          HttpStatus.NOT_FOUND
        );
      }
      const createContactRole = new ContactsRoles();
      const keys = Object.keys(createContactsRoleDto);

      for (const key of keys) {
        createContactRole[key] = createContactsRoleDto?.[key];
      }

      const savedContactRole = await this.contactsRolesRepository.save({
        ...createContactRole,
        tenant_id: this?.request?.user?.tenant?.id,
      });

      return resSuccess(
        'Contact roles Created Successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedContactRole
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findVolunteerContactRoles(user: any) {
    try {
      const functionId: any = 3;
      const roles: any = await this.contactsRolesRepository.find({
        where: {
          is_archived: false,
          function_id: functionId,
          tenant_id: user.tenant.id,
        },
      });

      return resSuccess(
        'Volunteer roles found successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        roles
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAll(
    getAllrolesInterface: GetAllRolesInterface,
    user: any
  ): Promise<any> {
    try {
      const fetchAll = getAllrolesInterface?.fetchAll === 'true';
      const limit: number = getAllrolesInterface?.limit
        ? +getAllrolesInterface?.limit
        : +process.env.PAGE_SIZE;

      let page = getAllrolesInterface?.page ? +getAllrolesInterface?.page : 1;

      if (page < 1) {
        page = 1;
      }

      const where = { is_archived: false };

      if (getAllrolesInterface?.function_id !== undefined) {
        // Filter based on both status and is_archived
        where['function_id'] = +getAllrolesInterface.function_id;
      }
      if (getAllrolesInterface?.status !== undefined) {
        // Filter based on both status and is_archived
        where['status'] = getAllrolesInterface.status;
      }

      if (getAllrolesInterface?.staffable !== undefined) {
        // Filter based on both status and is_archived
        where['staffable'] = getAllrolesInterface.staffable;
      }

      if (getAllrolesInterface?.name) {
        Object.assign(where, {
          name: ILike(`%${getAllrolesInterface?.name}%`),
        });
      }

      if (getAllrolesInterface?.short_name) {
        Object.assign(where, {
          short_name: ILike(`%${getAllrolesInterface?.short_name}%`),
        });
      }
      Object.assign(where, {
        tenant: { id: user?.tenant?.id },
      });

      let order: any = { id: 'DESC' }; // Default order

      if (getAllrolesInterface?.sortBy) {
        // Allow sorting by different columns
        const orderBy = getAllrolesInterface.sortBy;
        const orderDirection = getAllrolesInterface.sortOrder || 'DESC';
        order = { [orderBy]: orderDirection };
      }
      let response: any;
      let count: any;

      if (fetchAll) {
        [response, count] = await this.contactsRolesRepository.findAndCount({
          where,
          order,
        });
      } else {
        [response, count] = await this.contactsRolesRepository.findAndCount({
          where,
          take: limit,
          skip: (page - 1) * limit,
          order,
        });
      }

      return {
        status: HttpStatus.OK,
        message: 'Roles Fetched Successfully',
        count: count,
        data: response,
      };
    } catch (error) {
      console.log('Error while fetching contacts roles ', error);

      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: any) {
    try {
      const contactRole: any = await this.contactsRolesRepository.findOne({
        where: { id: id, is_archived: false },
        relations: ['created_by'],
      });

      if (!contactRole) {
        throw new HttpException(`Role not found.`, HttpStatus.NOT_FOUND);
      }
      const modifiedData: any = await getModifiedDataDetails(
        this.contactsRolesHistoryRepo,
        id,
        this.userRepository
      );

      return resSuccess(
        'Role found successfully',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { ...contactRole, ...modifiedData }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async update(id: any, updateContactsRoleDto: UpdateContactsRoleDto) {
    try {
      const contactRole = await this.contactsRolesRepository.findOne({
        where: {
          id: id,
          is_archived: false,
        },
        relations: ['tenant'],
      });

      if (!contactRole) {
        throw new HttpException(`Role not found.`, HttpStatus.NOT_FOUND);
      }
      const user = await this.userRepository.findOneBy({
        id: updateContactsRoleDto?.created_by,
      });
      const beforeUpdate = { ...contactRole };

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      const updateData = { ...updateContactsRoleDto };
      delete updateData.created_by;
      if (contactRole?.short_name != updateContactsRoleDto?.short_name) {
        const short_name = await this.contactsRolesRepository.findOneBy({
          short_name: updateData?.short_name,
        });

        if (short_name) {
          throw new HttpException(
            `Short Name duplicate already exists.`,
            HttpStatus.NOT_FOUND
          );
        }
      }
      // Update the contact role with the new data from the DTO
      Object.assign(contactRole, updateData);

      // Save the updated contact role entity
      const updatedContactRole = await this.contactsRolesRepository.save(
        contactRole
      );

      if (updatedContactRole) {
        const action = 'C';
        await this.updateContactRoleHistory(
          {
            ...beforeUpdate,
            created_by: user?.id,
            tenant_id: contactRole?.tenant?.id,
          },
          action
        );
      }
      return resSuccess(
        'Role updated',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async archive(id: any, archiveDto: ArchiveDto): Promise<any> {
    try {
      const contactRole: any = await this.contactsRolesRepository.findOne({
        where: { id: id, is_archived: false },
        relations: ['tenant'],
      });

      if (!contactRole) {
        throw new HttpException(`Role not found.`, HttpStatus.NOT_FOUND);
      }

      const user = await this.userRepository.findOneBy({
        id: archiveDto?.updated_by,
      });

      if (!user) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }
      const beforeUpdate = { ...contactRole };

      contactRole.is_archived = archiveDto?.is_archived;
      const data = await this.contactsRolesRepository.save(contactRole);

      if (data) {
        const action = 'D';
        await this.updateContactRoleHistory(
          {
            ...beforeUpdate,
            created_by: user?.id,
            tenant_id: contactRole?.tenant?.id,
          },
          action
        );
      }

      return resSuccess(
        'Role Archived',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        null
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async updateContactRoleHistory(data: any, action: string) {
    const ContactRoleC = new ContactsRolesHistory();
    ContactRoleC.id = data?.id;
    ContactRoleC.name = data?.name;
    ContactRoleC.short_name = data?.short_name;
    ContactRoleC.description = data?.description;
    ContactRoleC.function_id = data?.function_id;
    ContactRoleC.average_hourly_rate = data?.average_hourly_rate;
    ContactRoleC.impacts_oef = data?.impacts_oef;
    ContactRoleC.oef_contribution = data?.oef_contribution;
    ContactRoleC.staffable = data?.staffable;
    ContactRoleC.impacts_oef = data?.impacts_oef;
    ContactRoleC.status = data?.status;
    ContactRoleC.created_by = data?.created_by;
    ContactRoleC.tenant_id = data?.tenant_id;
    ContactRoleC.history_reason = 'C';
    await this.contactsRolesHistoryRepo.save(ContactRoleC);

    if (action === 'D') {
      const ContactRoleD = new ContactsRolesHistory();
      ContactRoleD.id = data?.id;
      ContactRoleD.name = data?.name;
      ContactRoleD.short_name = data?.short_name;
      ContactRoleD.description = data?.description;
      ContactRoleD.function_id = data?.function_id;
      ContactRoleD.average_hourly_rate = data?.average_hourly_rate;
      ContactRoleD.impacts_oef = data?.impacts_oef;
      ContactRoleD.oef_contribution = data?.oef_contribution;
      ContactRoleD.staffable = data?.staffable;
      ContactRoleD.impacts_oef = data?.impacts_oef;
      ContactRoleD.status = data?.status;
      ContactRoleD.created_by = data?.created_by;
      ContactRoleC.tenant_id = data?.tenant_id;
      ContactRoleD.history_reason = 'D';
      await this.contactsRolesHistoryRepo.save(ContactRoleD);
    }
  }
}
