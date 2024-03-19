import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from '../../../../user-administration/user/entity/user.entity';
import { typeEnum } from '../../common/type.enum';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { EquipmentCollectionOperationEntity } from './equipment-collection-operations.entity';

@Entity({ name: 'equipments' })
export class EquipmentEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  short_name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: typeEnum,
    nullable: true,
    default: typeEnum.COLLECTIONS,
  })
  type: typeEnum;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'date', nullable: true })
  retire_on: string;

  @Column({ default: false, nullable: false })
  is_archived: boolean;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint', nullable: false })
  tenant_id: number;

  @OneToMany(
    () => EquipmentCollectionOperationEntity,
    (equipmentCollectionOperationEntity) =>
      equipmentCollectionOperationEntity.equipment_id,
    {
      nullable: false,
    }
  )
  @JoinColumn({ name: 'equipment_id' })
  collection_operations: bigint;
}
