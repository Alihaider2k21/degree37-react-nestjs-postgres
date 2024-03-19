import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity({ name: 'donor_center_blueprints_history' })
export class DonorCenterBluePrintsHistory extends GenericHistoryEntity {
  @Column({ nullable: false })
  name: string;

  @Column('double precision', { nullable: false })
  oef_products: number;

  @Column('double precision', { nullable: false })
  oef_procedures: number;

  @Column({ nullable: false, default: false })
  is_default: boolean;

  @Column({ default: false })
  is_active: boolean;

  @Column({ nullable: false, default: false })
  monday: boolean;

  @Column({ nullable: false, default: false })
  tuesday: boolean;

  @Column({ nullable: false, default: false })
  wednesday: boolean;

  @Column({ default: false })
  thursday: boolean;

  @Column({ nullable: false, default: false })
  friday: boolean;

  @Column({ nullable: false, default: false })
  saturday: boolean;

  @Column({ default: false })
  sunday: boolean;

  @Column({ type: 'bigint' })
  donorcenter_id: bigint;

  @Column({ default: false })
  is_archived: boolean;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;
}
