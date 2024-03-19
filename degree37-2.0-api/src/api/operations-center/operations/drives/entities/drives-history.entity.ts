import { Entity, Column } from 'typeorm';
import { ApprovalStatusEnum } from '../enums';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity('drives_history')
export class DrivesHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 60, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  changes_from: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  changes_to: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  changes_field: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  changed_when: string;

  @Column({ type: 'bigint', name: 'account_id', nullable: false })
  account_id: bigint;

  @Column({ type: 'bigint', name: 'location_id', nullable: false })
  location_id: bigint;

  @Column({
    type: 'date',
  })
  date: Date;

  // @Column({ nullable: false })
  // tele_recruitment: boolean;

  // @Column({ nullable: false })
  // sms: boolean;

  // @Column({ nullable: false })
  // email: boolean;

  // @Column({ nullable: false })
  // online_scheduling: boolean;

  // @Column({ type: "varchar", length: 20, nullable: false })
  // tele_recruitment_status: string;

  // @Column({ type: "varchar", length: 20, nullable: false })
  // sms_status: string;

  // @Column({ type: "varchar", length: 20, nullable: false })
  // email_status: string;

  @Column({ nullable: false })
  is_multi_day_drive: boolean;

  // @Column({ type: "float", nullable: false })
  // oef_procedures: number;

  // @Column({ type: "float", nullable: false })
  // oef_products: number;

  // @Column({ nullable: false })
  // is_linked: boolean;

  // @Column({ nullable: false })
  // is_linkable: boolean;

  // @Column({ type: "int" })
  // approval_status: ApprovalStatusEnum;

  @Column({ type: 'bigint' })
  tenant_id: bigint;

  @Column({ type: 'bigint' })
  promotion_id: bigint;

  @Column({ type: 'bigint' })
  operation_status_id: bigint;

  @Column({ type: 'bigint' })
  recruiter_id: bigint;

  @Column({ type: 'boolean', default: false, nullable: true })
  is_blueprint: boolean;
}
