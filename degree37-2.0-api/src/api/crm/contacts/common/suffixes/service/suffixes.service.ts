import { HttpStatus, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suffixes } from '../entities/suffixes.entity';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';

@Injectable({ scope: Scope.REQUEST })
export class SuffixesService {
  constructor(
    @InjectRepository(Suffixes)
    private readonly suffixesRepository: Repository<Suffixes>
  ) {}

  async get() {
    try {
      const [records] = await Promise.all([this.suffixesRepository.find()]);
      return resSuccess(
        'Suffixes Records Fetched',
        SuccessConstants.SUCCESS,
        HttpStatus.OK,
        { records }
      );
    } catch (error) {
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
}
