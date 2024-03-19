import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class StaffHistory extends GenericHistoryEntity {
  @Column({ type: 'int', nullable: true })
  prefix: number;

  @Column({ type: 'int', nullable: true })
  suffix: number;

  @Column({ type: 'varchar', length: 60, nullable: true })
  nick_name: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  last_name: string;

  @Column({ type: 'timestamp', precision: 6, nullable: false })
  birth_date: Date;

  @Column({ type: 'bigint', nullable: true })
  collection_operation_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  classification_id: bigint;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'bigint' })
  tenant_id: bigint;
}
