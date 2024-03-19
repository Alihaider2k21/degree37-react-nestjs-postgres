import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { typeEnum } from '../../common/type.enum';

@Entity('equipments_history')
export class EquipmentHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;

  @Column({ type: 'bigint', nullable: false })
  id: bigint;

  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  short_name: string;

  @Column({
    type: 'enum',
    enum: typeEnum,
    nullable: true,
    default: typeEnum.COLLECTIONS,
  })
  type: typeEnum;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'date', nullable: true })
  resign_on_date: string;

  @Column({ type: 'bigint', array: true, nullable: true })
  collection_operations: Array<bigint>;

  @Column({ default: false, nullable: false })
  is_archived: boolean;

  @Column({ type: 'bigint' })
  created_by: bigint;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;
}
