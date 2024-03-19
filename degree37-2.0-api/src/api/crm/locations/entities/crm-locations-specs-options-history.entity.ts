import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity('crm_locations_specs_options_history')
export class CrmLocationsSpecsOptionsHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', nullable: false })
  location_specs_id: bigint;

  @Column({ type: 'varchar', length: 60, nullable: false })
  specs_key: string;

  @Column({ type: 'boolean', nullable: false })
  specs_value: boolean;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
