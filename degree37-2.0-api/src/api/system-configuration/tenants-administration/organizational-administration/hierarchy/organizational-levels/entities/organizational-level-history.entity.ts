import { GenericHistoryEntity } from '../../../../../../common/entities/generic-history.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrganizationalLevelsHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  short_label: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'bigint', nullable: true })
  parent_level_id: bigint;

  @Column({ default: true, nullable: false })
  is_active: boolean;
}
