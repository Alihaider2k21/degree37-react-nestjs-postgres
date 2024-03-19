import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { GenericEntity } from '../../../../../common/entities/generic.entity';
import { Tenant } from '../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { StaffingClassificationSetting } from '../../classification-settings/entity/setting.entity';

@Entity()
export class StaffingClassification extends GenericEntity {
  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  short_description: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @OneToMany(
    () => StaffingClassificationSetting,
    (staffingClassificationSetting) =>
      staffingClassificationSetting.classification_id
  )
  staffing_classification_setting: StaffingClassificationSetting[];

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
