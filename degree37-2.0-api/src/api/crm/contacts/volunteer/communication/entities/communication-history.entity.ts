import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Tenant } from '../../../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
// import {
//   appliesToTypeEnum,
//   fieldDataTypeEnum,
// } from '../enum/custom-field.enum';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity()
export class CommunicationsHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  communicationable_type: string;

  @Column({ type: 'bigint', nullable: false })
  communicationable_id: bigint;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;

  @Column({ type: 'bigint', nullable: true })
  contacts_id: bigint;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'bigint', nullable: false })
  message_type: bigint;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subject: string;

  @Column({ type: 'text', nullable: false })
  message_text: string;

  @Column({ type: 'bigint', nullable: true })
  template_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  status: bigint;

  @Column({ type: 'text', nullable: true })
  status_detail: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
