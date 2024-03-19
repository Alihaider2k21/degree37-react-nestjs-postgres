import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity()
export class StaffDonorCentersMappingHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint' })
  tenant_id: bigint;

  @Column({ type: 'bigint' })
  staff_id: bigint;

  @Column({ type: 'bigint' })
  donor_center_id: bigint;

  @Column({ type: 'boolean' })
  is_primary: boolean;

  @Column({ type: 'boolean' })
  is_active: boolean;
}
