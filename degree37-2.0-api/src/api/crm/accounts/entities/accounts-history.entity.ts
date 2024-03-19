import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AccountsHistory extends GenericHistoryEntity {
  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  // @Column({ type: 'varchar', length: 36, nullable: true })
  // external_id: string;

  // @Column({ type: 'integer', nullable: true })
  // account_id: number;

  @Column({ type: 'varchar', length: 60, nullable: true })
  alternate_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true })
  facebook: string;

  @Column({ type: 'bigint', nullable: false })
  industry_category: bigint;

  @Column({ type: 'bigint', nullable: false })
  industry_subcategory: bigint;

  @Column({ type: 'bigint', nullable: false })
  stage: bigint;

  @Column({ type: 'bigint', nullable: false })
  source: bigint;

  @Column({ type: 'varchar', length: 255, nullable: true })
  BECS_code: string;

  @Column({ type: 'bigint', nullable: false })
  collection_operation: bigint;

  @Column({ type: 'bigint', nullable: false })
  recruiter: bigint;

  @Column({ type: 'bigint', nullable: true })
  territory: bigint;

  @Column({ type: 'float', nullable: true })
  population: number;

  @Column({ default: true, nullable: false })
  is_active: boolean;

  @Column({ default: false, nullable: false })
  RSMO: boolean;

  @Column({ type: 'bigint', nullable: true })
  tenant_id: bigint;
}
