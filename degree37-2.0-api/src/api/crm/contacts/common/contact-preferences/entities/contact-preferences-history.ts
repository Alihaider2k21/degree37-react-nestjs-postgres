import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PolymorphicType } from '../../../../../common/enums/polymorphic-type.enum';

@Entity('contact_preferences_history')
export class ContactPreferencesHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'bigint', nullable: false })
  id: bigint;

  @Column({ type: 'varchar', length: 1 })
  history_reason: string;

  @Column({ type: 'bigint', nullable: false })
  contact_preferenceable_id: bigint;

  @Column({
    type: 'enum',
    enum: PolymorphicType,
    nullable: true,
    default: PolymorphicType.CRM_CONTACTS_VOLUNTEERS,
  })
  contact_preferenceable_type: PolymorphicType;

  @Column({ type: 'boolean', default: false })
  is_optout_email: boolean;

  @Column({ type: 'boolean', default: false })
  is_optout_sms: boolean;

  @Column({ type: 'boolean', default: false })
  is_optout_push: boolean;

  @Column({ type: 'boolean', default: false })
  is_optout_call: boolean;

  @Column({ nullable: true })
  next_call_date: Date;

  @Column({ default: false, nullable: false })
  is_archived: boolean;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'bigint', nullable: false })
  created_by: bigint;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
