import { Entity, Column } from 'typeorm';

import { GenericHistoryEntity } from 'src/api/common/entities/generic-history.entity';
@Entity('donors_donations_history')
export class DonorDonationsHistory extends GenericHistoryEntity {
  @Column({ type: 'bigint' })
  donor_id: bigint;

  @Column({ type: 'bigint' })
  donation_type: bigint;

  @Column({ type: 'date', nullable: true })
  donation_date: Date;

  @Column({ type: 'int' })
  donation_status: number;

  @Column({ type: 'date', nullable: true })
  next_eligibility_date: Date;

  @Column({ type: 'int' })
  donation_ytd: number;

  @Column({ type: 'int' })
  donation_ltd: number;

  @Column({ type: 'int' })
  donation_last_year: number;

  @Column({ type: 'bigint' })
  account_id: bigint;

  @Column({ type: 'bigint' })
  drive_id: bigint;

  @Column({ type: 'bigint' })
  facility_id: bigint;

  @Column({ type: 'int' })
  points: number;
}
