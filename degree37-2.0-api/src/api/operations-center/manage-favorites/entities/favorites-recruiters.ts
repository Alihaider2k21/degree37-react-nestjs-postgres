import { Entity, ManyToOne, JoinColumn } from 'typeorm';

import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Favorites } from './favorites.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';

@Entity('favorites_recruiters')
export class FavoritesRecruiters extends GenericEntity {
  @ManyToOne(() => Favorites, (favorites) => favorites.id, { nullable: false })
  @JoinColumn({ name: 'favorite_id' })
  favorite_id: Favorites;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'recruiter_id' })
  recruiter_id: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;
}
