import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity('banners')
export class Banner extends GenericEntity {
  @Column({ type: 'varchar', length: 60, nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'date', nullable: false })
  start_date: string;

  @Column({ type: 'date', nullable: false })
  end_date: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
