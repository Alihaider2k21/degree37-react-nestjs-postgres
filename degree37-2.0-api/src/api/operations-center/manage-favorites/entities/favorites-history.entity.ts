import { Entity, Column } from 'typeorm';
import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import {
  FavoriteCalendarPreviewTypeEnum,
  FavoriteLocationTypeEnum,
  FavoriteOperationTypeEnum,
} from '../enum/manage-favorites.enum';
@Entity()
export class FavoritesHistory extends GenericHistoryEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  alternate_name: string;

  @Column({ type: 'boolean', nullable: true })
  is_default: boolean;

  @Column({ type: 'boolean', nullable: true })
  is_open_in_new_tab: boolean;

  @Column({ type: 'bigint', name: 'tenant_id', nullable: false })
  tenant_id: bigint;

  @Column({ type: 'bigint', nullable: false })
  organization_level_id: bigint;

  @Column({
    type: 'enum',
    enum: FavoriteCalendarPreviewTypeEnum,
  })
  preview_in_calendar: FavoriteCalendarPreviewTypeEnum;

  @Column({
    type: 'enum',
    enum: FavoriteLocationTypeEnum,
  })
  location_type: FavoriteLocationTypeEnum;

  @Column({
    type: 'enum',
    enum: FavoriteOperationTypeEnum,
  })
  operation_type: FavoriteOperationTypeEnum;

  @Column({ type: 'bigint', nullable: true })
  product_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  procedure_id: bigint;

  @Column({ type: 'bigint', nullable: true })
  operations_status_id: bigint;

  @Column({ type: 'bool', nullable: true })
  status: boolean;
}
