import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class CRMVolunteerHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', nullable: true, name: 'prefix_id' })
  prefix_id: bigint;

  @Column({ type: 'bigint', nullable: true, name: 'suffix_id' })
  suffix_id: bigint;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  employee: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  nick_name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  last_name: string;

  @Column({ type: 'timestamp', precision: 6, nullable: false })
  birth_date: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;
}
