import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity('favorites_recruiters_history')
export class FavoritesRecruitersHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', name: 'favorite_id', nullable: false })
  favorite_id: bigint;

  @Column({ type: 'bigint', name: 'recruiter_id', nullable: false })
  recruiter_id: bigint;

  @Column({ type: 'bigint', name: 'tenant_id', nullable: false })
  tenant_id: bigint;
}
