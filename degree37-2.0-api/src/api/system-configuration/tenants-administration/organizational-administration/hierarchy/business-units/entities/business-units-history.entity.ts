import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GenericHistoryEntity } from '../../../../../../common/entities/generic-history.entity';
@Entity()
export class BusinessUnitsHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'bigint', nullable: false })
  organizational_level_id?: bigint;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  parent_level?: bigint;

  @Column({ default: true, nullable: false })
  is_active: boolean;
}
