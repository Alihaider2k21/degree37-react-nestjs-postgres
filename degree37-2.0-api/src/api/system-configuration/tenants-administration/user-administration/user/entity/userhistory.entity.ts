import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class UserHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'bigint', nullable: false })
  id: bigint;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  unique_identifier?: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true, default: false })
  is_impersonateable_user: boolean;

  @Column({ nullable: true })
  date_of_birth?: Date;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  home_phone_number?: string;

  @Column({ nullable: true })
  work_phone_number?: string;

  @Column({ nullable: true })
  work_phone_extension?: string;

  @Column({ nullable: true })
  address_line_1?: string;

  @Column({ nullable: true })
  address_line_2?: string;

  @Column({ nullable: true })
  zip_code?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  history_reason?: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: true })
  all_hierarchy_access: boolean;

  @Column({ nullable: true })
  mobile_number: string;

  @Column({ nullable: true, default: false })
  is_manager: boolean;

  @Column({ nullable: true })
  hierarchy_level: string;

  @Column({ type: 'bigint', nullable: true })
  assigned_manager: bigint;

  @Column({ nullable: true, default: false })
  override: boolean;

  @Column({ nullable: true, default: false })
  adjust_appointment_slots: boolean;

  @Column({ nullable: true, default: false })
  resource_sharing: boolean;

  @Column({ nullable: true, default: false })
  edit_locked_fields: boolean;

  @Column({ nullable: true, default: true })
  account_state: boolean;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'bigint', nullable: true })
  created_by?: bigint;

  @Column({ type: 'bigint', nullable: true })
  role?: bigint;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @DeleteDateColumn()
  deleted_at?: Date;
}
