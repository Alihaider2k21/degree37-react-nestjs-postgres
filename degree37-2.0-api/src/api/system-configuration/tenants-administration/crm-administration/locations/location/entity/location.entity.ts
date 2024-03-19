import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Locations {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  physical_address: string;

  @Column({ type: 'float' })
  zip_code: number;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'varchar', length: 100 })
  cross_street: string;

  @Column({ type: 'varchar', length: 100 })
  floor: string;

  @Column({ type: 'varchar', length: 100 })
  room: string;

  @Column({ type: 'varchar', length: 100 })
  room_phone: string;

  @Column({ type: 'bigint' })
  site_contact: bigint;

  @Column({ type: 'float' })
  BECS_code: number;

  @Column({ type: 'bigint' })
  site_type: bigint;
}
