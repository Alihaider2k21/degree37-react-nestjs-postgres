import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from '../../../../common/entities/generic-history.entity';

@Entity('sessions_promotions_history')
export class SessionsPromotionsHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint' })
  session_id: number;

  @Column({ type: 'bigint' })
  promotion_id: number;
}
