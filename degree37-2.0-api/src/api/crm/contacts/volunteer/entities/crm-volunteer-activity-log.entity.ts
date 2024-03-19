import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import {
//   ActivityDateEnum,
//   ActivityNameEnum,
//   ActivityTitleEnum,
// } from '../enums';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';

@Entity('volunteers_activities')
export class CRMVolunteerActivityLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: bigint;

  @Column({ type: 'bigint' })
  volunteer_id: bigint;

  @Column({ type: 'varchar', nullable: false })
  // @Column({
  //   type: 'enum',
  //   enum: ActivityTitleEnum,
  //   nullable: false
  // })
  // activity_title: ActivityTitleEnum;
  activity_title: string;

  @Column({ type: 'varchar', nullable: false })
  // @Column({
  //   type: 'enum',
  //   enum: ActivityNameEnum,
  //   nullable: false
  // })
  // name: ActivityNameEnum;
  name: string;

  @Column({ type: 'date', nullable: false })
  // @Column({
  //   type: 'enum',
  //   enum: ActivityDateEnum,
  //   nullable: false
  // })
  // date: ActivityDateEnum;
  date: string;

  @Column({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;
}
