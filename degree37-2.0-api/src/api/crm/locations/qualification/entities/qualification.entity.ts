import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'qualifications' })
export class Qualification {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ nullable: true })
  location_id: number;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ nullable: true })
  qualified_by: number;

  @Column({ nullable: false })
  qualification_date: Date;

  @Column({ nullable: false })
  qualification_expires: Date;

  @Column({ type: 'boolean', default: true })
  qualification_status: boolean;

  @Column('text', { array: true, default: {} })
  attachment_files: string[];

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}
