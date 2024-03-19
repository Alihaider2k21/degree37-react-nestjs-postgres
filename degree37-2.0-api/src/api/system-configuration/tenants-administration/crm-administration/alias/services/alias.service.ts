import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { CreateAliasDto } from '../dto/create-alias.dto';
import { Alias } from '../entities/alias.entity';
import { GetAliasInterface } from '../interface/alias.interface';
import { HistoryService } from '../../../../../common/services/history.service';
import { AliasHistory } from '../entities/aliasHistory.entity';
import { User } from '../../../user-administration/user/entity/user.entity';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/common/interface/request';

dotenv.config();
@Injectable()
export class AliasService extends HistoryService<AliasHistory> {
  constructor(
    @Inject(REQUEST)
    private request: UserRequest,
    @InjectRepository(Alias)
    private readonly aliasRepository: Repository<Alias>,
    @InjectRepository(AliasHistory)
    private readonly aliasHistoryRepository: Repository<AliasHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super(aliasHistoryRepository);
  }

  /* create alias */
  async create(createAliasDto: CreateAliasDto) {
    const aliasData = await this.aliasRepository.findOneBy({
      type: createAliasDto?.type,
    });
    const user = await this.userRepository.findOne({
      where: { id: createAliasDto.created_by },
    });
    try {
      if (aliasData) {
        aliasData.text = createAliasDto.text;
        aliasData.created_by = user;
        aliasData.tenant_id = this.request.user?.tenant;
        const saveAlias = await this.aliasRepository.update(
          { id: aliasData?.id },
          { ...aliasData }
        );
        return {
          status: 'success',
          response: 'Alias Updated Successfully',
          status_code: 201,
          data: saveAlias,
        };
      } else {
        const alias = new Alias();
        alias.text = createAliasDto.text;
        alias.type = createAliasDto.type;
        alias.created_by = user;
        alias.tenant_id = this.request.user?.tenant;
        const saveAlias = await this.aliasRepository.save(alias);
        return {
          status: 'success',
          response: 'Alias Created Successfully',
          status_code: 201,
          data: saveAlias,
        };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /* get alias */
  async getAlias(typeAlias: GetAliasInterface) {
    const resp = await this.aliasRepository.findOneBy({
      type: typeAlias.type,
      tenant_id: this.request.user?.tenant?.id,
    });
    let message = '';
    if (resp) {
      message = 'Alias Found';
    } else message = 'No Alias Found';
    return {
      status: 'success',
      response: message,
      status_code: 201,
      data: resp,
    };
  }
}
