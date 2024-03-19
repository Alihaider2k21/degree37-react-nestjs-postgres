import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { Device } from 'src/api/system-configuration/tenants-administration/organizational-administration/resources/device/entities/device.entity';
import { ResourceSharings } from './resource-sharing.entity';

@Entity()
export class ResourceSharingsFulfillment {
  @ManyToOne(() => ResourceSharings, (resourceSharing) => resourceSharing.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'resource_share_id' })
  resource_share: ResourceSharings;

  @Column({ type: 'int', nullable: false, primary: true })
  resource_share_id: bigint;

  @Column({ type: 'int', nullable: false, primary: true })
  share_type_id: bigint;

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
