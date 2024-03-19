import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Prospects } from './prospects.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity('prospects_communications')
export class ProspectsCommunications extends GenericEntity {
  @ManyToOne(() => Prospects, (prospect) => prospect.id, { nullable: false })
  @JoinColumn({ name: 'prospect_id' })
  prospect_id: Prospects;

  @Column({ type: 'varchar', length: 500, nullable: false })
  message: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  message_type: string;

  @Column({ type: 'int', nullable: false })
  template_id: number;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  schedule_date: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;
}
