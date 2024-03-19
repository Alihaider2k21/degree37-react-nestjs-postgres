export enum DonorAppointmentsEnum {
  DRIVES = 'drives',
  SESSION = 'session',
}

export enum DonationStatusEnum {
  Appeared_005 = '1', // Registered
  Donated_010 = '2', // Donation
  Donor_Left_012 = '3', // Walkout
  Technically_Unsuable_015 = '4', // QNS (Quantity Non Sufficient)
  Deferred_At_Phlebotomy_020 = '5', // Deferral
  Post_Draw_Deferral_025 = '6', // TBD
  Deferred_Post_Defer_030 = '7', // Deferral
}
