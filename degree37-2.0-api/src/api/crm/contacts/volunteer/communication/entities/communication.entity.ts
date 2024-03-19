import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Tenant } from '../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { GenericEntity } from '../../../../../common/entities/generic.entity';
import { Contacts } from '../../../common/entities/contacts.entity';
import {
  communication_message_type_enum,
  communication_status_enum,
} from '../enum/communication.enum';

@Entity()
export class Communications extends GenericEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  communicationable_type: string;

  @Column({ type: 'bigint', nullable: false })
  communicationable_id: bigint;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @ManyToOne(() => Contacts, (contacts) => contacts.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'contacts_id' })
  contacts_id: Contacts;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({
    type: 'enum',
    enum: communication_message_type_enum,
  })
  message_type: communication_message_type_enum;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subject: string;

  @Column({ type: 'text', nullable: false })
  message_text: string;

  @Column({ type: 'bigint', nullable: true })
  template_id: bigint;

  @Column({
    type: 'enum',
    enum: communication_status_enum,
  })
  status: communication_status_enum;

  @Column({ type: 'text', nullable: false })
  status_detail: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
