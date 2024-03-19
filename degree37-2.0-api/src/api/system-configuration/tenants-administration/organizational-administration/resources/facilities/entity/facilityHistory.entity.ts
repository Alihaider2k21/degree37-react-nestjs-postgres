import { User } from '../../../../user-administration/user/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GenericHistoryEntity } from '../../../../../../common/entities/generic-history.entity';

@Entity()
export class FacilityHistory extends GenericHistoryEntity {
  // @PrimaryGeneratedColumn({ type: 'bigint' })
  // rowkey: bigint;

  // @Column({ type: 'bigint', nullable: false })
  // id: bigint;

  // @Column({ type: 'varchar', length: 1 })
  // history_reason: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  alternate_name: string;

  // @Column({ nullable: false })
  // city: string;

  // @Column({ nullable: false })
  // state: string;

  // @Column({ nullable: false })
  // country: string;

  // @Column({ nullable: false })
  // physical_address: string;

  // @Column({ nullable: false })
  // postal_code: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ default: false })
  donor_center: boolean;

  @Column({ default: false })
  staging_site: boolean;

  @Column({ nullable: false })
  collection_operation: string;

  @Column({ default: false })
  status: boolean;

  @Column({ nullable: false })
  industry_category: string;

  @Column({ nullable: false })
  industry_sub_category: string;

  // @Column({ default: false })
  // is_archived: boolean;

  // @ManyToOne(() => User, (user) => user.id, { nullable: false })
  // @JoinColumn({ name: 'created_by' })
  // created_by: bigint;

  // @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  // created_at: Date;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
