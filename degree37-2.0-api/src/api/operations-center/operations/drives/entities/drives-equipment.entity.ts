import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Drives } from './drives.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { EquipmentEntity } from 'src/api/system-configuration/tenants-administration/operations-administration/manage-equipment/equipment/entity/equipment.entity';
import { GenericEntity } from 'src/api/common/entities/generic.entity';

@Entity('drives_equipments')
export class DrivesEquipments extends GenericEntity {
  @ManyToOne(() => Drives, (drive) => drive.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'drive_id' })
  drive: Drives;

  @Column({ type: 'int', nullable: false })
  drive_id: bigint;

  @ManyToOne(() => EquipmentEntity, (equipment) => equipment.id, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'equipment_id' })
  equipment: EquipmentEntity;

  @Column({ type: 'int', nullable: false, primary: true })
  equipment_id: bigint;

  @Column({ type: 'int', nullable: false })
  quantity: number;
}
