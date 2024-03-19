import { User } from '../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class GenericEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;
}
