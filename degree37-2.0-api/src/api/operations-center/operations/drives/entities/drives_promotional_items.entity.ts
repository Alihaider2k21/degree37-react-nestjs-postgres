import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Drives } from './drives.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { EquipmentEntity } from 'src/api/system-configuration/tenants-administration/operations-administration/manage-equipment/equipment/entity/equipment.entity';
import { PromotionalItems } from 'src/api/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotional-items/entities/promotional-item.entity';

@Entity('drives_promotional_items')
export class DrivesPromotionalItems {
  @ManyToOne(() => Drives, (drive) => drive.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'drive_id' })
  drive: Drives;

  @Column({ type: 'int', nullable: false, primary: true })
  drive_id: bigint;

  @ManyToOne(
    () => PromotionalItems,
    (promotionalitems) => promotionalitems.id,
    {
      nullable: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn({ name: 'promotional_item_id' })
  promotional_item: PromotionalItems;

  @Column({ type: 'int', nullable: false, primary: true })
  promotional_item_id: bigint;

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
