import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GenericHistoryEntity } from '../../../common/entities/generic-history.entity';
import { templateType } from '../enums/template-type.enum';
import { Tenant } from '../../../system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class EmailTemplateHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  subject: string;

  @Column({
    type: 'enum',
    enum: templateType,
    default: templateType.admin,
  })
  type: templateType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  variables: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;
}
