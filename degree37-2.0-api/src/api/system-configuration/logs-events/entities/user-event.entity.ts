import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../tenants-administration/user-administration/user/entity/user.entity';
@Entity()
export default class UserEvents {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;
  @Column({ type: 'varchar', length: 255, nullable: false })
  page_name: string;
  @Column({ type: 'varchar', length: 255, nullable: false })
  activity: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  browser?: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;
  @Column({ type: 'varchar', length: 30, nullable: false })
  ip: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  city?: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  country?: string;

  @Column({ type: 'varchar', length: 60, default: false })
  status: string;
  @Column({ type: 'varchar', length: 100, nullable: false })
  type: string;
  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  date_time: Date; // If event has occurred earlier, but we are capturing later
  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by?: bigint;
}
