import { User } from '../../../user-administration/user/entity/user.entity';
import { AssociationType } from '../enums/association_type.enum';
import { HistoryReason } from '../../../../../../common/enums/history_reason.enum';

export interface CreateCertificationHistory {
  history_reason: HistoryReason;
  name: string;
  short_name: string;
  description: string;
  association_type: AssociationType;
  expires: boolean;
  expiration_interval?: number;
  status: boolean;
  created_by: User;
}
