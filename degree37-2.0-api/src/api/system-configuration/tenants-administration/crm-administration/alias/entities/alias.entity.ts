import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TypeEnum } from '../dto/create-alias.dto';
import { GenericEntity } from '../../../../../common/entities/generic.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class Alias extends GenericEntity {
  @Column({ type: 'varchar', length: 100 })
  text: string;

  @Column({ type: 'varchar' })
  type: TypeEnum;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;
}
