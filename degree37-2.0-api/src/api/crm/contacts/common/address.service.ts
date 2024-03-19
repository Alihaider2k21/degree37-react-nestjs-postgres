import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { resError } from 'src/api/system-configuration/helpers/response';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { HistoryService } from 'src/api/common/services/history.service';
import { AddressHistory } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/addressHistory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonFunction } from './common-functions';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Address } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/address.entity';

@Injectable()
export class AddressService extends HistoryService<AddressHistory> {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(AddressHistory)
    private readonly entityHistoryRepository: Repository<AddressHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commonFunction: CommonFunction,
    private readonly entityManager: EntityManager
  ) {
    super(entityHistoryRepository);
  }

  /**
   * Address new entity
   * @param addressDto
   * @returns
   */
  async createAddress(addressDto: any) {
    try {
      const create = new Address();
      const keys = Object.keys(addressDto);
      //set values in create obj
      for (const key of keys) {
        create[key] = addressDto?.[key];
      }
      // Save entity
      const saveObj = await this.addressRepository.save(create);
      return saveObj;
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  /**
   * Address update entity
   * @param updateDto
   * @returns
   */
  async updateAddress(updateDto: any) {
    try {
      const user = await this.commonFunction.entityExist(
        this.userRepository,
        { where: { id: updateDto.created_by } },
        'User'
      );
      const entity = await this.commonFunction.entityExist(
        this.addressRepository,
        { where: { id: updateDto.id } },
        'Address'
      );
      // save history
      const saveHistory = new AddressHistory();
      Object.assign(saveHistory, entity);
      saveHistory.created_by = user.id;
      saveHistory.tenant_id = updateDto?.tenant_id;
      saveHistory.history_reason = 'C';
      saveHistory.coordinates = `(${entity?.latitude}, ${entity?.longitude})`;
      delete saveHistory.created_at;
      await this.createHistory(saveHistory);

      // update entity
      Object.assign(entity, updateDto);
      const updateData = await this.addressRepository.update(
        { id: updateDto.id },
        entity
      );
      return updateData;
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
