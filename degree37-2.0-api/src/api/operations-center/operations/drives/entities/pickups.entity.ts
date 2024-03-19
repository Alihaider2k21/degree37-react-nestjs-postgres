import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { GenericEntity } from '../../../../common/entities/generic.entity';
import { Drives } from './drives.entity';
import { EquipmentEntity } from 'src/api/system-configuration/tenants-administration/operations-administration/manage-equipment/equipment/entity/equipment.entity';

@Entity('pickups')
export class Pickups extends GenericEntity {
  @ManyToOne(() => Drives, (drive) => drive.id, { nullable: false })
  @JoinColumn({ name: 'pickable_id' })
  pickable_id: bigint;

  @ManyToOne(() => EquipmentEntity, (equipment) => equipment.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'equipment_id' })
  equipment_id: bigint;

  @Column({ type: 'int', nullable: true })
  pickable_type: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  start_time: Date;

  @Column({ type: 'text', nullable: true })
  description: string;
}
