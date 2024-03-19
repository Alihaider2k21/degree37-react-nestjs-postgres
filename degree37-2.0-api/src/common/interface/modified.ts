import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';

export interface Modified {
  modified_by: User;
  modified_at: Date;
}
