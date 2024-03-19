import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericEntity } from '../../common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
@Entity('bbcs_data_syncs')
export class BBCSDataSyncs extends GenericEntity {
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  job_start: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  job_end: Date;

  @Column({ type: 'varchar', nullable: true })
  next_start: string;

  @Column({ nullable: false })
  status: boolean;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @Column({ type: 'int', nullable: false })
  inserted_count: number;

  @Column({ type: 'int', nullable: false })
  updated_count: number;

  @Column({ type: 'boolean', nullable: false })
  is_running: boolean;

  @Column({ type: 'int', nullable: false })
  total_count: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
