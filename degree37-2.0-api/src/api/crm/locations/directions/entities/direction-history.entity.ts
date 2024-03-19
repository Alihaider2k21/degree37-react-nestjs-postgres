import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';

@Entity('location_directions_history')
export class DirectionsHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint', name: 'collection_operation_id' })
  collection_operation_id: bigint;

  @Column({ type: 'varchar', length: 100 })
  direction: string;

  @Column({ type: 'float' })
  miles: number;

  @Column({ type: 'float' })
  minutes: number;

  @Column({ type: 'bigint', name: 'tenant_id', nullable: false })
  tenant_id: bigint;
}
