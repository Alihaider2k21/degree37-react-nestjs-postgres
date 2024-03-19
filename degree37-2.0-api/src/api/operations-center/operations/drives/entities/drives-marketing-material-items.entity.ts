import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Drives } from './drives.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { MarketingMaterials } from 'src/api/system-configuration/tenants-administration/operations-administration/marketing-equipment/marketing-material/entities/marketing-material.entity';

@Entity('drives_marketing_material_items')
export class DrivesMarketingMaterialItems {
  @ManyToOne(() => Drives, (drive) => drive.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'drive_id' })
  drive: Drives;

  @Column({ type: 'int', nullable: false, primary: true })
  drive_id: bigint;

  @ManyToOne(
    () => MarketingMaterials,
    (marketingmaterials) => marketingmaterials.id,
    {
      nullable: false,
    }
  )
  @JoinColumn({ name: 'marketing_material_id' })
  marketing_material: MarketingMaterials;

  @Column({ type: 'int', nullable: false, primary: true })
  marketing_material_id: bigint;

  @Column({ type: 'int', nullable: false })
  quantity: number;

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
