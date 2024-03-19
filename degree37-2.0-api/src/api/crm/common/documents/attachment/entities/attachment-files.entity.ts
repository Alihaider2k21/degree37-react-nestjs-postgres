import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../../../../system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { CrmAttachments } from './attachment.entity';

@Entity()
export class AttachmentsFiles {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @ManyToOne(() => CrmAttachments, (attachment) => attachment.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'attachment_id' })
  attachment_id: CrmAttachments;

  @Column({ type: 'varchar', length: 255, nullable: true })
  attachment_path: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}
