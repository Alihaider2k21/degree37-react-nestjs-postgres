import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { GenericHistoryEntity } from '../../../../../../common/entities/generic-history.entity';
@Entity()
export class SourcesHistory extends GenericHistoryEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false, nullable: false })
  is_active: boolean;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;
}
