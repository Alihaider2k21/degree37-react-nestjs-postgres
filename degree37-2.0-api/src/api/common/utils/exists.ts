import { HttpException, HttpStatus } from '@nestjs/common';
import { FindOptionsWhere, In, Repository } from 'typeorm';

export async function isExists<T>(
  id: number,
  repository: Repository<T>,
  message = 'Not found'
): Promise<T> {
  const where: FindOptionsWhere<any> = {
    id,
    is_archived: false,
  };
  const entity = await repository.findOneBy(where);
  if (!entity) {
    throw new HttpException(message, HttpStatus.NOT_FOUND);
  }
  return entity;
}

export async function isExistMultiple<T>(
  ids: number[],
  repository: Repository<T>,
  message = 'Some are not found'
): Promise<T[]> {
  if (!ids.length) return [];
  const where: FindOptionsWhere<any> = {
    id: In(ids),
    is_archived: false,
  };
  const entitys = await repository.findBy(where);
  if (entitys.length !== ids.length) {
    throw new HttpException(message, HttpStatus.NOT_FOUND);
  }
  return entitys;
}
