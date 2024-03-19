import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class ContactsRolesHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 2, nullable: false })
  short_name: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  description: string;

  @Column({ type: 'bigint', nullable: false })
  function_id: bigint;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  average_hourly_rate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  oef_contribution: number;

  @Column({ type: 'boolean' })
  impacts_oef: boolean;

  @Column({ type: 'boolean' })
  staffable: boolean;

  @Column({ type: 'boolean' })
  status: boolean;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
