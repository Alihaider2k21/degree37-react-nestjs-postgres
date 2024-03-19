import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { IndustryCategories } from './industry-categories.entity';

@Entity()
export class IndustryCategoriesHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;

  @ManyToOne(
    () => IndustryCategories,
    (industryCategories) => industryCategories.id,
    { nullable: false }
  )
  @JoinColumn({ name: 'id' })
  id: bigint;

  @ManyToOne(
    () => IndustryCategories,
    (industryCategories) => industryCategories.id,
    { nullable: true }
  )
  @JoinColumn({ name: 'parent_id' })
  parent_id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'double precision', nullable: true })
  minimum_oef: number;

  @Column({ type: 'double precision', nullable: true })
  maximum_oef: number;

  @Column({ default: false, nullable: false })
  is_active: boolean;

  // common fields

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ default: false, nullable: true })
  is_deleted: boolean;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  deleted_at: Date;

  @Column({ default: false, nullable: true })
  is_archive: boolean;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;
}
