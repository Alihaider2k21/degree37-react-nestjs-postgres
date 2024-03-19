import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository, Not, In } from 'typeorm';
import { resError } from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { Contacts } from './entities/contacts.entity';
import { HistoryService } from 'src/api/common/services/history.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonFunction } from './common-functions';
import { ContactsHistory } from './entities/contacts-history.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';

@Injectable()
export class ContactsService extends HistoryService<ContactsHistory> {
  constructor(
    @InjectRepository(Contacts)
    private readonly contactsRepository: Repository<Contacts>,
    @InjectRepository(ContactsHistory)
    private readonly entityHistoryRepository: Repository<ContactsHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commonFunction: CommonFunction
  ) {
    super(entityHistoryRepository);
  }

  /**
   * Contacts create entity
   * @param updateContacts
   * @returns
   */
  async createContacts(createdDto, contactableId) {
    try {
      const { contact, created_by, tenant_id } = createdDto;
      //set values in create obj
      for (const item of contact) {
        const keys = Object.keys(item);
        const create = new Contacts();
        for (const key of keys) {
          create[key] = item?.[key];
        }
        create.created_by = created_by;
        create.tenant_id = tenant_id;
        create.contactable_id = contactableId;
        // Save entity
        await this.contactsRepository.save(create);
      }
      return contact;
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  /**
   * Update Contacts entity
   * @param updateDto
   * @returns
   */
  async updateContacts(id: any, updatedDto: any, contactableType?: string) {
    try {
      const { contact, created_by, tenant_id } = updatedDto;

      const user = await this.commonFunction.entityExist(
        this.userRepository,
        { where: { id: created_by } },
        'User'
      );

      const entities = await this.commonFunction.entityList(
        this.contactsRepository,
        { where: { contactable_id: id } }
      );

      for (const entity of entities) {
        const saveHistory = new ContactsHistory();
        Object.assign(saveHistory, entity);
        saveHistory.created_by = user.id;
        saveHistory.history_reason = 'C';
        saveHistory.tenant_id = tenant_id;
        delete saveHistory.created_at;
        await this.createHistory(saveHistory);
      }

      const excludedContacts = contact.map((item) => item?.contact_type);
      const contactsToRemove = await this.commonFunction.entityList(
        this.contactsRepository,
        {
          where: {
            contactable_id: id,
            contactable_type: contactableType,
            is_archived: false,
            contact_type: Not(In(excludedContacts)),
          },
        }
      );

      if (contactsToRemove?.length > 0) {
        for (const entity of contactsToRemove) {
          if (entity?.id) {
            entity.is_archived = true;
            entity.created_by = user;
            entity.is_primary = false;
            await this.contactsRepository.update({ id: entity.id }, entity);
          }
        }
      }

      for (const item of contact) {
        const entity = await this.commonFunction.entity(
          this.contactsRepository,
          {
            where: {
              contactable_id: id,
              contact_type: item.contact_type,
              contactable_type: contactableType,
              is_archived: false,
            },
          }
        );
        if (entity && entity?.id) {
          // Contact already exist - Updating the contact

          if (entity.data === item.data) {
            // User just changes the primary status
            // Object.assign(entity, item);
            entity.is_primary = item.is_primary;
            entity.created_by = user;
            await this.contactsRepository.update({ id: entity.id }, entity);
          } else {
            // User updated the contact data - Archiving the old and creating the new
            entity.is_archived = true;
            entity.created_by = user;
            entity.is_primary = false;
            await this.contactsRepository.update({ id: entity.id }, entity);

            const keys = Object.keys(item);
            const create = new Contacts();
            for (const key of keys) {
              create[key] = item?.[key];
            }
            create.created_by = created_by;
            create.tenant_id = tenant_id;
            create.contactable_id = id;
            delete create?.id;
            delete create?.created_at;
            await this.contactsRepository.save(create);
          }
        } else {
          // Contsct did not exist - Creating the contact
          const keys = Object.keys(item);
          const create = new Contacts();
          for (const key of keys) {
            create[key] = item?.[key];
          }
          create.created_by = created_by;
          create.tenant_id = tenant_id;
          create.contactable_id = id;
          // Save entity
          await this.contactsRepository.save(create);
        }
      }

      const updateEntities = await this.commonFunction.entityList(
        this.contactsRepository,
        { where: { contactable_id: id, contactable_type: contactableType } }
      );
      return updateEntities;
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
