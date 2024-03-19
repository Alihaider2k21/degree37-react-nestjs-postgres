import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { enumType } from '../enum/ads.enum';

@Entity()
export class AdsHistory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  rowkey: bigint;

  @Column({ type: 'bigint', nullable: false })
  id: bigint;

  @Column({ nullable: false })
  image_name: string;

  @Column({ type: 'varchar', length: 1, nullable: false })
  history_reason: string;

  @Column({ nullable: false })
  image_url: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'text', nullable: true })
  redirect_url: string;

  @Column({ nullable: true })
  display_order: number;

  @Column({ default: false })
  is_archive: boolean;

  @Column({
    type: 'enum',
    enum: enumType,
    nullable: false,
  }) // define enum for type
  ad_type: enumType;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ type: 'bigint', nullable: false })
  created_by: bigint;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: bigint;
  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
