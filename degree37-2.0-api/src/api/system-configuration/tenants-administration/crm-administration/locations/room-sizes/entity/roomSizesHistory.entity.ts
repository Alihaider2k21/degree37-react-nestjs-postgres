import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { GenericHistoryEntity } from '../../../../../../common/entities/generic-history.entity';

@Entity()
export class RoomSizesHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 250, nullable: false })
  description: string;

  @Column({ type: 'varchar', default: 1 })
  is_active: boolean;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
