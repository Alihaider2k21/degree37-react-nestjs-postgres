import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity()
export class ShiftsProjectionsStaffHistory extends GenericHistoryEntity {
  @Column({ type: 'int', nullable: false })
  shift_id: bigint;

  @Column({ type: 'int', nullable: false })
  procedure_type_id: bigint;

  @Column({ type: 'float', nullable: false })
  procedure_type_qty: number;

  @Column({ type: 'int', nullable: false })
  staff_setup_id: bigint;

  @Column({ type: 'float', nullable: false })
  product_yield: number;
}
