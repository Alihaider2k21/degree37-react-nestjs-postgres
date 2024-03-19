import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, IsNull, LessThan, Repository } from 'typeorm';
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
import { AccountContactsDto } from '../dto/accounts-contact.dto';
import { AccountContacts } from '../entities/accounts-contacts.entity';
import { AccountContactsHistory } from '../entities/accounts-contacts-history.entity';
import { GetAllAccountContactsInterface } from '../interface/account-contacts.interface';
import moment from 'moment';
dotenv.config();

@Injectable()
export class AccountContactsService extends HistoryService<AccountContactsHistory> {
  constructor(
    @InjectRepository(Accounts)
    private readonly accountRepository: Repository<Accounts>,
    @InjectRepository(AccountContacts)
    private readonly accountContactsRepository: Repository<AccountContacts>,
    @InjectRepository(AccountContactsHistory)
    private readonly accountsContactHistoryRepository: Repository<AccountContactsHistory>
  ) {
    super(accountsContactHistoryRepository);
  }

  async createContacts(
    id: any,
    user: User,
    createContactsDto: AccountContactsDto
  ) {
    try {
      const deletePromises = [];
      const historyPromises = [];
      let savedAccountContacts: any;
      if (createContactsDto?.deleteContacts?.length > 0) {
        for (const item of createContactsDto.deleteContacts) {
          const where: any = {
            id: item,
            is_archived: false,
          };
          const account_contact: any =
            await this.accountContactsRepository.findOne({
              where: where,
              relations: [
                'created_by',
                'contactable_id',
                'record_id',
                'role_id',
              ],
            });
          const account_contact_history = new AccountContactsHistory();
          account_contact_history.history_reason = 'D';
          account_contact_history.id = account_contact?.id;
          account_contact_history.closeout_date =
            account_contact?.closeout_date;
          account_contact_history.contactable_id =
            account_contact?.contactable_id?.id;
          account_contact_history.contactable_type =
            account_contact?.contactable_type;
          account_contact_history.record_id = account_contact?.record_id?.id;
          account_contact_history.role_id = account_contact?.role_id?.id;
          account_contact_history.created_by = user?.id;
          historyPromises.push(this.createHistory(account_contact_history));

          account_contact.is_archived = true;
          deletePromises.push(
            this.accountContactsRepository.save(account_contact)
          );
        }
        await Promise.all(historyPromises);
        await Promise.all(deletePromises);
        savedAccountContacts = [];
      }
      const promises = [];
      if (createContactsDto?.contacts?.length > 0) {
        for (const element of createContactsDto.contacts) {
          const contact = new AccountContacts();
          contact.is_archived = false;
          contact.created_by = user;
          contact.contactable_type = element?.contactable_type;
          contact.contactable_id = element?.contactable_id || id;
          contact.record_id = element?.record_id;
          contact.role_id = element?.role_id;

          promises.push(this.accountContactsRepository.save(contact));
        }
        savedAccountContacts = await Promise.all(promises);
      }
      return resSuccess(
        'Contacts Added.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        savedAccountContacts
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
  async updateContacts(
    id: any,
    user: User,
    createContactsDto: AccountContactsDto
  ) {
    try {
      const where: any = {
        id: id,
        is_archived: false,
      };
      const account_contact: any = await this.accountContactsRepository.findOne(
        {
          where: where,
          relations: ['created_by', 'contactable_id', 'record_id', 'role_id'],
        }
      );

      if (!account_contact) {
        throw new HttpException(`Contact not found.`, HttpStatus.NOT_FOUND);
      }
      const account_contact_history = new AccountContactsHistory();
      account_contact_history.history_reason = 'D';
      account_contact_history.id = account_contact?.id;
      account_contact_history.closeout_date = account_contact?.closeout_date;
      account_contact_history.contactable_id =
        account_contact?.contactable_id?.id;
      account_contact_history.contactable_type =
        account_contact?.contactable_type;
      account_contact_history.record_id = account_contact?.record_id?.id;
      account_contact_history.role_id = account_contact?.role_id?.id;
      account_contact_history.created_by = user?.id;

      await this.createHistory(account_contact_history);

      account_contact.closeout_date = createContactsDto.closeout_date;

      const updatedAccountContact = await this.accountContactsRepository.save(
        account_contact
      );
      return resSuccess(
        'Closeout Date Added.',
        SuccessConstants.SUCCESS,
        HttpStatus.CREATED,
        updatedAccountContact
      );
    } catch (error) {
      console.log(error);
      return resError(error.message, ErrorConstants.Error, error.status);
    }
  }
  async findAllContacts(
    id: any,
    getAllAccountContactsInterface: GetAllAccountContactsInterface
  ) {
    try {
      const is_current = getAllAccountContactsInterface.is_current === 'true';

      const where: any = [
        {
          is_archived: false,
          contactable_id: { id: id },
          closeout_date: is_current
            ? MoreThanOrEqual(moment().format('YYYY-MM-DD')) || IsNull()
            : LessThan(moment().format('YYYY-MM-DD')),
        },
        {
          is_archived: false,
          contactable_id: { id: id },
          closeout_date: is_current
            ? IsNull()
            : LessThan(moment().format('YYYY-MM-DD')),
        },
      ];
      const response = await this.accountContactsRepository.find({
        where: where,
        relations: ['created_by', 'contactable_id', 'record_id', 'role_id'],
        order: { id: 'ASC' },
      });
      return {
        status: HttpStatus.OK,
        response: 'Contacts Fetched ',
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
