import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RolesHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'bigint', nullable: false })
  id: bigint;

  @Column({ type: 'varchar', length: 1 })
  history_reason: string;

  @Column({ type: 'varchar', length: 255 })
  role_name: string;

  @Column({ type: 'text', nullable: true })
  role_description: string;

  @Column({ type: 'boolean', default: false })
  is_impersonateable_role: boolean;

  @Column({ type: 'boolean', default: false })
  is_autocreated: boolean;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'bigint', nullable: false })
  created_by: bigint;
}
