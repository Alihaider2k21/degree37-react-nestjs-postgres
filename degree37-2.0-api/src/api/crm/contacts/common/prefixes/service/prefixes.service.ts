import { HttpStatus, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prefixes } from '../entities/prefixes.entity';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';

@Injectable({ scope: Scope.REQUEST })
export class PrefixesService {
  constructor(
    @InjectRepository(Prefixes)
    private readonly prefixesRepository: Repository<Prefixes>
  ) {}

  async get() {
    try {
      const [records] = await Promise.all([this.prefixesRepository.find()]);
      return resSuccess(
        'Prefixes Records Fetched',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { records }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
