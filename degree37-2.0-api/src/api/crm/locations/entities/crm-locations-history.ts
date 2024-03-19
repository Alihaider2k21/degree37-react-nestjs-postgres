import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity('crm_locations_history')
export class CrmLocationsHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  cross_street: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  floor: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  room: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  room_phone: string;

  @Column({ type: 'bigint', nullable: false })
  site_contact_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  becs_code: bigint;

  @Column({ type: 'varchar', length: 150, nullable: false })
  site_type: string;

  @Column({ type: 'boolean', nullable: false })
  is_active: boolean;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
