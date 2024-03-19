export enum contact_type_enum {
  WORK_PHONE = 'work_phone', // Work Phone
  MOBILE_PHONE = 'mobile_phone', // Mobile Phone
  OTHER_PHONE = 'other_phone', // Other Phone
  WORK_EMAIL = 'work_email', // Work Email
  PERSONAL_EMAIL = 'personal_email', // Personal Email
  OTHER_EMAIL = 'other_email', // Other email
}

export enum communication_message_type_enum {
  Email = 'email',
  SMS = 'sms',
}

export enum communication_status_enum {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  DELIVERED = 'delivered',
  BOUNCED = 'bounced',
  BLOCKED = 'blocked',
  DEFERRED = 'deferred',
  FAILED = 'failed',
  SENT = 'sent',
  UNDELIVERED = 'undelivered',
}

export enum type_enum {
  CRM_ACCOUNTS = 'accounts', //CRM -> Accounts
  CRM_LOCATIONS = 'crm_locations', //CRM -> Locations
  CRM_CONTACTS_STAFF = 'staff', //CRM -> Contacts -> Staff
  CRM_CONTACTS_VOLUNTEERS = 'crm_volunteer', //CRM -> Contacts -> Volunteer
  CRM_CONTACTS_DONORS = 'donors', //CRM -> Contacts -> Donors
  CRM_DONOR_CENTERS = 'donor_centers', //CRM Menu -> Donor Centers
  CRM_NON_COLLECTION_PROFILES = 'non_collection_profiles', //CRM Menu -> Non-Collection Profil
  OC_OPERATIONS_SESSIONS = 'oc_sessions', //OC -> Operations -> Sessions
  OC_OPERATIONS_NON_COLLECTION_EVENTS = 'oc_non_collection_events', //OC -> Operations -> NOC
}
