import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class DonorsHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  external_id: number;

  @Column({ type: 'int', nullable: true })
  prefix_id: bigint;

  @Column({ type: 'int', nullable: true })
  suffix_id: bigint;

  @Column({ type: 'varchar', length: 60, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  last_name: string;

  @Column({ type: 'timestamp', precision: 6, nullable: false })
  birth_date: Date;

  @Column({ type: 'varchar', length: 60, nullable: true })
  nick_name: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  blood_type: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;
}
