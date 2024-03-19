import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../../user-administration/user/entity/user.entity';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
@Entity()
export class PerformanceRules extends GenericEntity {
  @Column({ type: 'int', nullable: false })
  projection_accuracy_minimum: number;

  @Column({ type: 'int', nullable: false })
  projection_accuracy_maximum: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  projection_accuracy_ref: string;

  @Column({ nullable: false })
  is_include_qns: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant_id: Tenant;
}
