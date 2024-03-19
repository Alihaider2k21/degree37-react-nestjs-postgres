import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
// import { GenericEntity } from "../../../common/entities/generic.entity";
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity('crm_locations_specs_history')
export class CrmLocationsSpecsHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', nullable: false })
  location_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  room_size_id: bigint;

  @Column({ type: 'varchar', length: 150, nullable: false })
  elevator: string;

  @Column({ type: 'bigint', nullable: false })
  inside_stairs: bigint;

  @Column({ type: 'bigint', nullable: true })
  outside_stairs: bigint;

  @Column({ type: 'varchar', length: 225, nullable: true })
  electrical_note: string;

  @Column({ type: 'varchar', length: 225, nullable: true })
  special_instructions: string;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
