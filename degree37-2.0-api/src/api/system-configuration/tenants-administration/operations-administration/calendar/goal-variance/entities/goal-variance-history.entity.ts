import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { GoalVariance } from './goal-variance.entity';

@Entity()
export class GoalVarianceHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @ManyToOne(() => GoalVariance, (goalVariance) => goalVariance.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'id' })
  id: bigint;

  @Column({ type: 'int', nullable: true })
  over_goal: number;

  @Column({ type: 'int', nullable: true })
  under_goal: number;

  // common fields
  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: bigint;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updated_by: bigint;

  @Column({
    type: 'timestamp',
    precision: 6,
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    precision: 6,
    nullable: true,
  })
  updated_at: Date;

  @Column({
    type: 'timestamp',
    precision: 6,
    nullable: true,
  })
  deleted_at: Date;

  @Column({ default: false, nullable: true })
  is_deleted: boolean;

  @Column({ default: false, nullable: true })
  is_archive: boolean;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
