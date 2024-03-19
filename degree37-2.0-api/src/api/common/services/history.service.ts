import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { GenericHistoryEntity } from '../entities/generic-history.entity';
import { User } from '../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Modified } from '../../../common/interface/modified';
import { GenericEntity } from '../entities/generic.entity';

@Injectable()
export class HistoryService<T extends GenericHistoryEntity> {
  constructor(private readonly repository: Repository<T>) {}

  async createHistory(entityData: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(entityData);
    return await this.repository.save(entity);
  }

  async createHistorys(entitiesData: DeepPartial<T>[]) {
    const entities = [];
    for (const entityData of entitiesData) {
      entities.push(this.repository.create(entityData));
    }
    await this.repository.insert(entities);
  }

  async getLastHistory(where: Partial<GenericHistoryEntity>): Promise<T> {
    const options: FindOneOptions<GenericHistoryEntity> = {
      where,
      order: { created_at: 'DESC' },
    };

    return await this.repository.findOne(options as FindOneOptions<T>);
  }

  async getModifiedData(
    entity: Partial<GenericEntity>,
    userRepository: Repository<User>,
    where?: Partial<T>
  ): Promise<Modified> {
    const history = await this.getLastHistory(where || { id: entity.id });
    let modified_by = entity.created_by,
      modified_at = entity.created_at;

    if (history) {
      const user = await userRepository.findOne({
        where: { id: history.created_by, is_archived: false },
      });
      modified_by = user;
      modified_at = history.created_at;
    }

    return { modified_by, modified_at: new Date(modified_at) };
  }
}
