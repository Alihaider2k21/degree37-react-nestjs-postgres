import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../../user-administration/user/entity/user.entity';
import { GenericEntity } from '../../../../../common/entities/generic.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class Territory extends GenericEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  territory_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'recruiter' })
  recruiter: bigint;

  @Column({ default: true, nullable: false })
  status: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;
}
