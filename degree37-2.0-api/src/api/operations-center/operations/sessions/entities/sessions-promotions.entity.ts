import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from '../../../../common/entities/generic.entity';
import { Sessions } from './sessions.entity';
import { PromotionEntity } from 'src/api/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotions/entity/promotions.entity';

@Entity('sessions_promotions')
export class SessionsPromotions extends GenericEntity {
  @ManyToOne(() => Sessions, (session) => session.id, { nullable: false })
  @JoinColumn({ name: 'session_id' })
  session: Sessions;

  @Column({ type: 'bigint' })
  session_id: number;

  @ManyToOne(() => PromotionEntity, (promotion) => promotion.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'promotion_id' })
  promotion: PromotionEntity;

  @Column({ type: 'bigint' })
  promotion_id: number;
}
