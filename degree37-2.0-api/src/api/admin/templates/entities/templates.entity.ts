import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { EmailTemplate } from '../../email-template/entities/email-template.entity';

@Entity()
export class Templates {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @OneToMany(() => EmailTemplate, (emailTemplate) => emailTemplate.template)
  emailTemplates: EmailTemplate[];

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column('json', { nullable: true })
  variables: JSON | any;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
