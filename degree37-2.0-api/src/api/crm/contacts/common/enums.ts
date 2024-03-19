export enum AttachmentableType {
  CRM_ACCOUNTS = 'accounts', //CRM -> Accounts
  CRM_LOCATIONS = 'crm_locations', //CRM -> Locations
  CRM_CONTACTS_STAFF = 'staff', //CRM -> Contacts -> Staff
  CRM_CONTACTS_VOLUNTEERS = 'crm_volunteer', //CRM -> Contacts -> Volunteer
  CRM_CONTACTS_DONORS = 'donors', //CRM -> Contacts -> Donors
  CRM_DONOR_CENTERS = 'donor_centers', //CRM -> Donor Centers
  CRM_NON_COLLECTION_PROFILES = 'crm_non_collection_profiles',
  OC_OPERATIONS_DRIVES = 'drives', //OC -> Operations -> Drives
  OC_OPERATIONS_SESSIONS = 'sessions', //OC -> Operations -> Sessions
  OC_OPERATIONS_NON_COLLECTION_EVENTS = 'oc_non_collection_events', //OC -> Operations -> Non Collection Events
}

export enum ContactTypeEnum {
  'WORK_PHONE' = 1, // Work Phone
  'MOBILE_PHONE' = 2, // Mobile Phone
  'OTHER_PHONE' = 3, // Other Phone
  'WORK_EMAIL' = 4, // Work Email
  'PERSONAL_EMAIL' = 5, // Personal Email
  'OTHER_EMAIL' = 6, // Other email
}

export enum CommunicationMessageTypeEnum {
  EMAIL = '1',
  SMS = '2',
}

export enum CommunicationStatusEnum {
  'NEW' = '1', // email and SMS CC Defined
  'IN_PROGRESS' = '2', // email and SMS CC Defined
  'DELIVERED' = '3', // email and SMS
  'BOUNCED' = '4', // email only
  'BLOCKED' = '5', // email only
  'DEFERRED' = '6', // email only
  'FAILED' = '7', // email and SMS
  'SENT' = '8', // SMS only
  'UNDELIVERED' = '9', // SMS only
}

export enum AppointmentStatusTypeEnum {
  Scheduled = '1', // default value at the time of the record creation
  Complete = '2',
  Incomplete = '3',
  Cancelled = '4',
}
