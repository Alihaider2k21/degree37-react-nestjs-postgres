import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AssociationType } from '../enums/association_type.enum';
import { GenericEntity } from 'src/api/common/entities/generic.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';

@Entity()
export class Certification extends GenericEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  short_name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: AssociationType,
    nullable: true,
  })
  association_type: AssociationType;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  expires: boolean;

  @Column({ default: 0 })
  expiration_interval: number;

  @Column({ default: 0 })
  assignments: number;

  @Column({ default: true })
  is_active: boolean;
}
