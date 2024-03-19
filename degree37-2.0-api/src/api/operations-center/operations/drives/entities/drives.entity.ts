import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { GenericEntity } from '../../../../common/entities/generic.entity';
import { Accounts } from 'src/api/crm/accounts/entities/accounts.entity';
import { ApprovalStatusEnum } from '../enums';
import { CrmLocations } from 'src/api/crm/locations/entities/crm-locations.entity';
import { Tenant } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { PromotionEntity } from 'src/api/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotions/entity/promotions.entity';
import { OperationsStatus } from 'src/api/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/entities/operations_status.entity';
import { User } from 'src/api/system-configuration/tenants-administration/user-administration/user/entity/user.entity';
import { DrivesContacts } from './drive-contacts.entity';
import { DonorDonations } from 'src/api/crm/contacts/donor/donorDonationHistory/entities/donor-donations.entity';
import { DrivesEquipments } from './drives-equipment.entity';
import { DrivesCertifications } from './drives-certifications.entity';
import { DrivesMarketingMaterialItems } from './drives-marketing-material-items.entity';
import { DrivesDonorCommunicationSupplementalAccounts } from './drives-donor-comms-supp-accounts.entity';
import { DrivesZipCodes } from './drives-zipcodes.entity';

@Entity('drives')
export class Drives extends GenericEntity {
  @Column({ type: 'varchar', length: 60, nullable: true })
  name: string;

  @ManyToOne(() => Accounts, (account) => account.id, { nullable: false })
  @JoinColumn({ name: 'account_id' })
  account: Accounts;

  @Column({ type: 'bigint' })
  account_id: bigint;

  @ManyToOne(() => CrmLocations, (location) => location.id, { nullable: false })
  @JoinColumn({ name: 'location_id' })
  location: CrmLocations;

  @Column({ type: 'bigint' })
  location_id: bigint;

  @Column({
    type: 'date',
  })
  date: Date;

  @Column({
    type: 'date',
  })
  order_due_date: Date;

  @Column({
    type: 'date',
  })
  marketing_start_date: Date;

  @Column({ type: 'date' })
  marketing_end_date: Date;

  @Column({ type: 'timestamptz' })
  marketing_start_time: Date;

  @Column({ type: 'timestamptz' })
  marketing_end_time: Date;

  @Column({ nullable: false })
  online_scheduling_allowed: boolean;

  @Column({ type: 'varchar', nullable: false })
  instructional_information: string;

  @Column({ type: 'varchar', nullable: false })
  donor_information: string;

  @Column({ nullable: false })
  tele_recruitment: boolean;

  @Column({ nullable: false })
  sms: boolean;

  @Column({ nullable: false })
  email: boolean;

  @Column({ type: 'varchar', length: 20, nullable: false })
  tele_recruitment_status: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  sms_status: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  email_status: string;

  @Column({ nullable: false })
  is_multi_day_drive: boolean;

  @Column({ type: 'float', nullable: false })
  oef_procedures: number;

  @Column({ type: 'float', nullable: false })
  oef_products: number;

  @Column({ nullable: false, default: false })
  is_linked: boolean;

  @Column({ nullable: false, default: true })
  is_linkable: boolean;

  @Column({ nullable: false })
  open_to_public: boolean;

  // @Column({ type: "int" })
  // approval_status: ApprovalStatusEnum;

  @ManyToOne(() => Tenant, (tenant) => tenant.id, { nullable: true })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'bigint' })
  tenant_id: bigint;

  @ManyToOne(() => PromotionEntity, (promotion) => promotion.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'promotion_id' })
  promotion: PromotionEntity;

  @Column({ type: 'bigint' })
  promotion_id: bigint;

  @ManyToOne(
    () => OperationsStatus,
    (operation_status) => operation_status.id,
    { nullable: false }
  )
  @JoinColumn({ name: 'operation_status_id' })
  operation_status: OperationsStatus;

  @Column({ type: 'bigint' })
  operation_status_id: bigint;

  @Column({ type: 'boolean', default: true, nullable: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  is_blueprint: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  is_default_blueprint: boolean;

  @ManyToOne(() => User, (recuriter) => recuriter.id, { nullable: false })
  @JoinColumn({ name: 'recruiter_id' })
  recuriter: User;

  @Column({ type: 'bigint' })
  recruiter_id: bigint;

  @OneToMany(() => DrivesContacts, (driveContacts) => driveContacts.drive, {
    nullable: false,
  })
  drive_contacts: DrivesContacts[];

  @OneToMany(() => DrivesEquipments, (eq) => eq.drive, {
    nullable: false,
  })
  equipments: DrivesEquipments[];

  @OneToMany(() => DrivesCertifications, (cert) => cert.drive, {
    nullable: false,
  })
  certifications: DrivesCertifications[];

  @OneToMany(
    () => DrivesMarketingMaterialItems,
    (marketing) => marketing.drive,
    {
      nullable: false,
    }
  )
  marketing_items: DrivesMarketingMaterialItems[];

  @OneToMany(
    () => DrivesDonorCommunicationSupplementalAccounts,
    (ddcsa) => ddcsa.drive,
    {
      nullable: false,
    }
  )
  drives_donor_comms_supp_accounts: DrivesDonorCommunicationSupplementalAccounts[];

  @OneToMany(() => DrivesZipCodes, (zip_codes) => zip_codes.drive, {
    nullable: false,
  })
  zip_codes: DrivesZipCodes[];

  @OneToMany(() => DonorDonations, (donor_donation) => donor_donation.drive)
  donations: DonorDonations;
}
