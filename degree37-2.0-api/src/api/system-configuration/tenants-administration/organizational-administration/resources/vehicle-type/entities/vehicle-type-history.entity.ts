import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../../user-administration/user/entity/user.entity';

@Entity()
export class VehicleTypeHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;

  @Column({ type: 'bigint', nullable: false })
  id: bigint;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'bigint', nullable: true })
  location_type_id: bigint;

  @Column({ default: true, nullable: false })
  linkable: boolean;

  @Column({ default: true, nullable: false })
  collection_vehicle: boolean;

  @Column({ default: false, nullable: false })
  is_active: boolean;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'bigint', nullable: false })
  created_by: bigint;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
}
