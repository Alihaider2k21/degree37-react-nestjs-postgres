import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Accounts } from '../entities/accounts.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import {
  resError,
  resSuccess,
} from '../../../system-configuration/helpers/response';
import { ErrorConstants } from '../../../system-configuration/constants/error.constants';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { HistoryService } from 'src/api/common/services/history.service';
import { AccountAffiliations } from '../entities/account-affiliations.entity';
import { AccountAffiliationsDto } from '../dto/account-affiliations.dto';
import { AccountAffilitaionsHistory } from '../entities/account-affiliations-history.entity';
import { GetAllAccountAffiliationsInterface } from '../interface/account-affiliations.interface';
import moment from 'moment';
dotenv.config();

@Injectable()
export class AccountAffiliationsService extends HistoryService<AccountAffilitaionsHistory> {
  constructor(
    @InjectRepository(Accounts)
    private readonly accountRepository: Repository<Accounts>,
    @InjectRepository(AccountAffiliations)
    private readonly accountAffiliationsRepository: Repository<AccountAffiliations>,
    @InjectRepository(AccountAffilitaionsHistory)
    private readonly accountsAffiliationsHistoryRepository: Repository<AccountAffilitaionsHistory>
  ) {
    super(accountsAffiliationsHistoryRepository);
  }

  async createAffiliations(
    id: any,
    user: User,
    createAffiliationsDto: AccountAffiliationsDto
  ) {
    try {
      const accountData = await this.accountRepository.findOneBy({
        id: id,
        is_archived: false,
      });
      if (!accountData) {
        throw new HttpException(`Account not found.`, HttpStatus.NOT_FOUND);
      }

      const deletePromises = [];
      const historyPromises = [];
      const closeout_account_affiliations = [];

      let savedAccountAffiliations: any;
      if (createAffiliationsDto.deleteAffiliations.length > 0) {
        for (const item of createAffiliationsDto.deleteAffiliations) {
          const where: any = {
            id: item,
            is_archived: false,
          };
          const account_affiliation: any =
            await this.accountAffiliationsRepository.findOne({
              where: where,
              relations: [
                'created_by',
                'tenant_id',
                'account_id',
                'affiliation_id',
              ],
            });
          if (!account_affiliation) continue;
          if (account_affiliation && account_affiliation?.closeout_date) {
            closeout_account_affiliations.push(account_affiliation);
          }
          const account_affiliation_history = new AccountAffilitaionsHistory();
          account_affiliation_history.history_reason = 'D';
          account_affiliation_history.id = account_affiliation?.id;
          account_affiliation_history.account_id =
            account_affiliation?.account_id?.id;
          account_affiliation_history.start_date =
            account_affiliation?.start_date;
          account_affiliation_history.closeout_date =
            account_affiliation?.closeout_date || null;
          account_affiliation_history.tenant_id =
            account_affiliation?.tenant_id?.id;
          account_affiliation_history.affiliation_id =
            account_affiliation?.affiliation_id?.id;
          account_affiliation_history.created_by = user?.id;
          historyPromises.push(this.createHistory(account_affiliation_history));

          account_affiliation.is_archived = true;
          deletePromises.push(
            this.accountAffiliationsRepository.save(account_affiliation)
          );
        }
        await Promise.all(historyPromises);
        await Promise.all(deletePromises);
        savedAccountAffiliations = [];
      }

      const promises = [];
      if (createAffiliationsDto.allAffiliations.length > 0) {
        for (const affiliationItem of createAffiliationsDto.allAffiliations) {
          const affiliationId: any = affiliationItem;
          const findAllAffiliation = closeout_account_affiliations.find(
            (ele) => ele?.affiliation_id?.id == affiliationId
          );
          const affiliation = new AccountAffiliations();
          affiliation.is_archived = false;
          affiliation.created_by = user;
          affiliation.account_id = id;
          affiliation.tenant_id = user?.tenant;
          affiliation.affiliation_id = affiliationId;
          if (findAllAffiliation) {
            affiliation.closeout_date = findAllAffiliation?.closeout_date;
            affiliation.start_date = findAllAffiliation?.start_date;
          }
          promises.push(this.accountAffiliationsRepository.save(affiliation));
        }
        savedAccountAffiliations = await Promise.all(promises);
      }
      return resSuccess(
        'Affiliations Added.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedAccountAffiliations
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async updateAffiliation(
    id: any,
    user: User,
    affiliationsDto: AccountAffiliationsDto
  ) {
    try {
      const where: any = {
        id: id,
        is_archived: false,
      };
      const account_affiliation: any =
        await this.accountAffiliationsRepository.findOne({
          where: where,
          relations: [
            'created_by',
            'tenant_id',
            'account_id',
            'affiliation_id',
          ],
        });
      const account_affiliation_history = new AccountAffilitaionsHistory();
      account_affiliation_history.history_reason = 'C';
      account_affiliation_history.id = account_affiliation?.id;
      account_affiliation_history.account_id =
        account_affiliation?.account_id?.id;
      account_affiliation_history.start_date = account_affiliation?.start_date;
      account_affiliation_history.closeout_date =
        account_affiliation?.closeout_date || null;
      account_affiliation_history.tenant_id =
        account_affiliation?.tenant_id?.id;
      account_affiliation_history.affiliation_id =
        account_affiliation?.affiliation_id?.id;
      account_affiliation_history.created_by = user?.id;

      await this.createHistory(account_affiliation_history);

      account_affiliation.closeout_date = affiliationsDto?.closeout_date;

      const updatedAccountAffiliation =
        await this.accountAffiliationsRepository.save(account_affiliation);
      return resSuccess(
        'Affiliation updated successfully.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        updatedAccountAffiliation
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }

  async findAllAffiliations(
    id: any,
    getAllAccountAffiliationsInterface: GetAllAccountAffiliationsInterface
  ) {
    try {
      const is_current =
        getAllAccountAffiliationsInterface.is_current === 'true';
      const where: any = [
        {
          is_archived: false,
          account_id: { id: id },
          closeout_date: is_current
            ? MoreThanOrEqual(moment().format('YYYY-MM-DD')) || IsNull()
            : LessThan(moment().format('YYYY-MM-DD')),
        },
        {
          is_archived: false,
          account_id: { id: id },
          closeout_date: is_current
            ? IsNull()
            : LessThan(moment().format('YYYY-MM-DD')),
        },
      ];
      const response = await this.accountAffiliationsRepository.find({
        where: where,
        relations: ['created_by', 'tenant_id', 'account_id', 'affiliation_id'],
        order: { id: 'ASC' },
      });
      return {
        status: HttpStatus.OK,
        response: 'Affiliations Fetched ',
        data: response,
      };
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Internel Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
