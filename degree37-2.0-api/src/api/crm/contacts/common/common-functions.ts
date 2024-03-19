import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { resError } from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';
import { Contacts } from './entities/contacts.entity';
import { AddressHistory } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/addressHistory.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommonFunction {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Contacts)
    private contactsRepository: Repository<Contacts>,
    private readonly entityManager: EntityManager
  ) {}

  /**
   * check entity exist in database
   * if entity not found throw error
   * @param repository
   * @param query
   * @param entityName
   * @returns {object}
   */
  async entityExist<T>(
    repository: Repository<T>,
    query,
    entityName
  ): Promise<T> {
    const entityObj = await repository.findOne(query);
    if (!entityObj) {
      throw new HttpException(`${entityName} not found.`, HttpStatus.NOT_FOUND);
    }

    return entityObj;
  }

  /**
   * check entity exist in database
   * if entity not found return null
   * @param repository
   * @param query
   * @param entityName
   * @returns {object}
   */
  async entity<T>(repository: Repository<T>, query): Promise<T> {
    const entityObj = await repository.findOne(query);
    return entityObj;
  }

  /**
   * list entity in database
   * @param repository
   * @param query
   * @returns {objects}
   */
  async entityList<T>(repository: Repository<T>, query) {
    const entities = await repository.find(query);
    if (entities.length > 0) {
      return entities;
    }
    return [];
  }

  /**
   * Calculate limit and skip
   * @param limit
   * @param page
   * @returns {skip, take}
   */
  pagination(limit: number, page: number) {
    page = page <= 0 ? 1 : page;
    const take: any = limit <= 5 ? 5 : limit;
    const skip: any = (page - 1) * limit;

    return { skip, take };
  }

  /**
   * create response
   * @param id
   * @param entity
   * @returns {skip, take}
   */
  async createObj(contactableType: any, entity: any) {
    const addressWhere = Object.assign(
      {},
      {
        relations: [],
        where: {
          addressable_id: entity.id,
          addressable_type: contactableType,
          tenant_id: { id: entity.tenant_id.id },
        },
      }
    );
    const address = await this.entityExist(
      this.addressRepository,
      addressWhere,
      'Address'
    );

    const contactWhere = Object.assign(
      {},
      {
        relations: [],
        where: {
          contactable_id: entity.id,
          contactable_type: contactableType,
          is_archived: false,
          tenant_id: { id: entity.tenant_id.id },
        },
      }
    );

    const contacts = await this.entityList(
      this.contactsRepository,
      contactWhere
    );
    entity['address'] = address;
    entity['contact'] = contacts;

    return entity;
  }
}
