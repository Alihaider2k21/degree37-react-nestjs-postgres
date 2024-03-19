// This file contains all Permissions Enums of System Configuration TenantAdmin + PlatformAdmin

const Permissions = {
  // This is Platform Admin SC
  SYSTEM_CONFIGURATION: {
    APPLICATION_CODE: 'System Configuration',
    DASHBOARD: {
      ACCESSABLE_PRODUCTS: '010101',
      WRITE: '010102',
      MODULE_CODE: 'dashboard',
    },
    TENANT_ONBOARDING: {
      READ: '010201',
      WRITE: '010202',
      ARCHIVE: '010203',
      MODULE_CODE: 'tenant_onboarding',
    },
    TENANT_MANAGEMENT: {
      READ: '010301',
      WRITE: '010302',
      ARCHIVE: '010303',
      ADD_CONFIG: '010304',
      LOGIN_AS_TENANT: '010305',
      MODULE_CODE: 'tenant_management',
    },
    PRODUCT_LICENSING: {
      READ: '010401',
      WRITE: '010402',
      ARCHIVE: '010403',
      MODULE_CODE: 'platform_product_licensing',
    },
    USER_ADMINISTRATION: {
      READ: '010501',
      WRITE: '010502',
      ARCHIVE: '010503',
      UPDATE_PASSWORD: '010504',
      MODULE_CODE: 'user_administration',
    },
    ROLE_ADMINISTRATION: {
      READ: '010601',
      WRITE: '010602',
      ARCHIVE: '010603',
      MODULE_CODE: 'platform_roles_administration',
    },
    LOG_AND_EVENT_MANAGEMENT: {
      READ: '010701',
      WRITE: '010702',
      ARCHIVE: '010703',
      MODULE_CODE: 'log_and_event_management',
    },
  },
  DASHBOARD: {
    APPLICATION_CODE: 'dashboard',
    ACCESSABLE_APPLICATIONS: {
      READ: '01080101',
    },
  },
  // Rest of them is Tenant Dashboard Admin SC
  ORGANIZATIONAL_ADMINISTRATION: {
    HIERARCHY: {
      ORGANIZATIONAL_LEVELS: {
        READ: '0109010101',
        WRITE: '0109010102',
        ARCHIVE: '0109010103',
        MODULE_CODE: 'organizational_levels',
      },
      BUSINESS_UNITS: {
        READ: '0109010201',
        WRITE: '0109010202',
        ARCHIVE: '0109010203',
        MODULE_CODE: 'business_units',
      },
    },
    GOALS: {
      MONTHLY_GOALS: {
        READ: '0109020101',
        WRITE: '0109020102',
        ARCHIVE: '0109020103',
        MODULE_CODE: 'monthly_goals',
      },
      DAILY_GOALS_ALLOCATION: {
        READ: '0109020201',
        WRITE: '0109020202',
        SCHEDULE_CHANGE: '0109020203',
        ARCHIVE: '0109020204',
        MODULE_CODE: 'daily_goals_allocation',
      },
      DAILY_GOALS_CALENDAR: {
        READ: '0109020301',
        WRITE: '0109020302',
        MODULE_CODE: 'daily_goals_calendar',
      },
      PERFORMANCE_RULES: {
        READ: '0109020401',
        WRITE: '0109020402',
        MODULE_CODE: 'performance_rules',
      },
    },
    PRODUCTS_AND_PROCEDURES: {
      PRODUCTS: {
        READ: '0109030101',
        WRITE: '0109030102',
        ARCHIVE: '0109030103',
        MODULE_CODE: 'products',
      },
      PROCEDURES: {
        READ: '0109030201',
        WRITE: '0109030202',
        ARCHIVE: '0109030203',
        MODULE_CODE: 'procedures',
      },
      PROCEDURE_TYPES: {
        READ: '0109030301',
        WRITE: '0109030302',
        ARCHIVE: '0109030303',
        MODULE_CODE: 'procedure_types',
      },
    },
    RESOURCES: {
      DEVICES: {
        READ: '0109040101',
        WRITE: '0109040102',
        ARCHIVE: '0109040103',
        SHARE_DEVICE: '0109040104',
        SCHEDULE_RETIREMENT: '0109040105',
        SCHEDULE_MAINTENANCE: '0109040106',
        MODULE_CODE: 'devices',
      },
      DEVICE_TYPE: {
        READ: '0109040201',
        WRITE: '0109040202',
        ARCHIVE: '0109040203',
        MODULE_CODE: 'device_type',
      },
      VEHICLES: {
        READ: '0109040301',
        WRITE: '0109040302',
        ARCHIVE: '0109040303',
        SHARE_VEHICLE: '0109040304',
        SCHEDULE_RETIREMENT: '0109040305',
        SCHEDULE_MAINTENANCE: '0109040306',
        MODULE_CODE: 'vehicles',
      },
      VEHICLE_TYPE: {
        READ: '0109040401',
        WRITE: '0109040402',
        ARCHIVE: '0109040403',
        MODULE_CODE: 'vehicle_type',
      },
      FACILITIES: {
        READ: '0109040501',
        WRITE: '0109040502',
        ARCHIVE: '0109040503',
        MODULE_CODE: 'facilities',
      },
    },
    // LOYALTY_PROGRAM: {
    //   READ: '01090501',
    //   WRITE: '01090502',
    //   MODULE_CODE: 'loyalty_program',
    // },
    // todo its gone?
    CONTENT_MANAGEMENT_SYSTEM: {
      ADS: {
        READ: '0109060101',
        WRITE: '0109060102',
        ARCHIVE: '0109060103',
        MODULE_CODE: 'ads',
      },
      EMAIL_TEMPLATES: {
        READ: '0109060201',
        WRITE: '0109060202',
        ARCHIVE: '0109060203',
        MODULE_CODE: 'email_templates',
      },
    },
    CUSTOM_FIELDS: {
      MODULE_CODE: 'custom_fields',
      READ: '01090701',
      WRITE: '01090702',
      ARCHIVE: '01090703',
    },
  },
  GEO_ADMINISTRATION: {
    TERRITORY_MANAGEMENT: {
      READ: '01100101',
      WRITE: '01100102',
      ARCHIVE: '01100103',
      MODULE_CODE: 'territory_management',
    },
  },
  CALL_CENTER_ADMINISTRATION: {
    CALL_OUTCOMES: {
      READ: '01110101',
      WRITE: '01110102',
      ARCHIVE: '01110103',
      MODULE_CODE: 'call_outcomes',
    },
  },
  CRM_ADMINISTRATION: {
    ACCOUNTS: {
      AFFILIATION: {
        READ: '0112010101',
        WRITE: '0112010102',
        ARCHIVE: '0112010103',
        MODULE_CODE: 'crm_accounts_affiliation',
      },
      SOURCES: {
        READ: '0112010201',
        WRITE: '0112010202',
        ARCHIVE: '0112010203',
        MODULE_CODE: 'crm_accounts_sources',
      },
      STAGES: {
        READ: '0112010301',
        WRITE: '0112010302',
        ARCHIVE: '0112010303',
        MODULE_CODE: 'crm_accounts_stages',
      },
      INDUSTRY_CATEGORY: {
        READ: '0112010401',
        WRITE: '0112010402',
        ARCHIVE: '0112010403',
        MODULE_CODE: 'crm_accounts_industry-categories',
      },
      INDUSTRY_SUBCATEGORY: {
        READ: '0112010501',
        WRITE: '0112010502',
        ARCHIVE: '0112010503',
        MODULE_CODE: 'crm_accounts_industry-subcategories',
      },
      ATTACHMENTS_CATEGORY: {
        READ: '0112010601',
        WRITE: '0112010602',
        ARCHIVE: '0112010603',
        MODULE_CODE: 'crm_accounts_attachments-categories',
      },
      ATTACHMENTS_SUBCATEGORY: {
        READ: '0112010701',
        WRITE: '0112010702',
        ARCHIVE: '0112010703',
        MODULE_CODE: 'crm_accounts_attachments-subcategories',
      },
      NOTES_CATEGORY: {
        READ: '0112010801',
        WRITE: '0112010802',
        ARCHIVE: '0112010803',
        MODULE_CODE: 'crm_accounts_notes-categories',
      },
      NOTES_SUBCATEGORY: {
        READ: '0112010901',
        WRITE: '0112010902',
        ARCHIVE: '0112010903',
        MODULE_CODE: 'crm_accounts_notes-subcategories',
      },
    },
    CONTACTS: {
      ROLES: {
        READ: '0112020101',
        WRITE: '0112020102',
        ARCHIVE: '0112020103',
        MODULE_CODE: 'crm_contacts_roles',
      },
      ATTACHMENTS_CATEGORY: {
        READ: '0112020201',
        WRITE: '0112020202',
        ARCHIVE: '0112020203',
        MODULE_CODE: 'crm_contacts_attachments-categories',
      },
      ATTACHMENTS_SUBCATEGORY: {
        READ: '0112020301',
        WRITE: '0112020302',
        ARCHIVE: '0112020303',
        MODULE_CODE: 'crm_contacts_attachments-subcategories',
      },
      NOTES_CATEGORY: {
        READ: '0112020401',
        WRITE: '0112020402',
        ARCHIVE: '0112020403',
        MODULE_CODE: 'crm_contacts_notes-categories',
      },
      NOTES_SUBCATEGORY: {
        READ: '0112020501',
        WRITE: '0112020502',
        ARCHIVE: '0112020503',
        MODULE_CODE: 'crm_contacts_notes-subcategories',
      },
    },
    LOCATIONS: {
      ROOM_SIZES: {
        READ: '0112030101',
        WRITE: '0112030102',
        ARCHIVE: '0112030103',
        MODULE_CODE: 'crm_locations_roomSize',
      },
      ATTACHMENTS_CATEGORY: {
        READ: '0112030201',
        WRITE: '0112030202',
        ARCHIVE: '0112030203',
        MODULE_CODE: 'crm_locations_attachments-categories',
      },
      ATTACHMENTS_SUBCATEGORY: {
        READ: '0112030301',
        WRITE: '0112030302',
        ARCHIVE: '0112030303',
        MODULE_CODE: 'crm_locations_attachments-subcategories',
      },
      NOTES_CATEGORY: {
        READ: '0112030401',
        WRITE: '0112030402',
        ARCHIVE: '0112030403',
        MODULE_CODE: 'crm_locations_notes-categories',
      },
      NOTES_SUBCATEGORY: {
        READ: '0112030501',
        WRITE: '0112030502',
        ARCHIVE: '0112030503',
        MODULE_CODE: 'crm_locations_notes-subcategories',
      },
    },
  },
  OPERATIONS_ADMINISTRATION: {
    BOOKING_DRIVES: {
      BOOKING_RULE: {
        READ: '0113010101',
        WRITE: '0113010102',
        MODULE_CODE: 'booking_rule',
      },
      DAILY_CAPACITY: {
        READ: '0113010201',
        WRITE: '0113010202',
        ARCHIVE: '0113010203',
        SCHEDULE: '0113010204',
        MODULE_CODE: 'daily_capacity',
      },
      DAILY_HOURS: {
        READ: '0113010301',
        WRITE: '0113010302',
        ARCHIVE: '0113010303',
        SCHEDULE: '0113010304',
        MODULE_CODE: 'daily_hours',
      },
      OPERATION_STATUS: {
        READ: '0113010401',
        WRITE: '0113010402',
        ARCHIVE: '0113010403',
        MODULE_CODE: 'operation_status',
      },
      TASK_MANAGEMENT: {
        READ: '0113010501',
        WRITE: '0113010502',
        ARCHIVE: '0113010503',
        MODULE_CODE: 'task_management',
      },
    },
    CALENDAR: {
      BANNER: {
        READ: '0113020101',
        WRITE: '0113020102',
        ARCHIVE: '0113020103',
        MODULE_CODE: 'calendar_banner',
      },
      LOCK_DATES: {
        READ: '0113020201',
        WRITE: '0113020202',
        ARCHIVE: '0113020203',
        MODULE_CODE: 'calendar_lock_dates',
      },
      CLOSE_DATES: {
        READ: '0113020301',
        WRITE: '0113020302',
        ARCHIVE: '0113020303',
        MODULE_CODE: 'calendar_close_dates',
      },
      GOAL_VARIANCE: {
        READ: '0113020401',
        WRITE: '0113020402',
        MODULE_CODE: 'goal_variance',
      },
    },
    MARKETING_EQUIPMENTS: {
      PROMOTIONS: {
        READ: '0113030101',
        WRITE: '0113030102',
        ARCHIVE: '0113030103',
        MODULE_CODE: 'marketing_equipments_promotions',
      },
      PROMOTIONAL_ITEMS: {
        READ: '0113030201',
        WRITE: '0113030202',
        ARCHIVE: '0113030203',
        MODULE_CODE: 'marketing_equipments_promotional_items',
      },
      MARKETING_MATERIAL: {
        READ: '0113030301',
        WRITE: '0113030302',
        ARCHIVE: '0113030303',
        MODULE_CODE: 'marketing_equipments_marketing_material',
      },
      APPROVALS: {
        READ: '0113030401',
        WRITE: '0113030402',
        MODULE_CODE: 'marketing_equipments_approvals',
      },
      EQUIPMENTS: {
        READ: '0113030501',
        WRITE: '0113030502',
        ARCHIVE: '0113030503',
        MODULE_CODE: 'marketing_equipments_equipments',
      },
    },
    NOTES_AND_ATTACHMENTS: {
      ATTACHMENTS_CATEGORY: {
        READ: '0113040101',
        WRITE: '0113040102',
        ARCHIVE: '0113040103',
        MODULE_CODE: 'operation_administration_attachments-categories',
      },
      ATTACHMENTS_SUBCATEGORY: {
        READ: '0113040201',
        WRITE: '0113040202',
        ARCHIVE: '0113040203',
        MODULE_CODE: 'operation_administration_attachments-subcategories',
      },
      NOTES_CATEGORY: {
        READ: '0113040301',
        WRITE: '0113040302',
        ARCHIVE: '0113040303',
        MODULE_CODE: 'operation_administration_notes-categories',
      },
      NOTES_SUBCATEGORY: {
        READ: '0113040401',
        WRITE: '0113040402',
        ARCHIVE: '0113040403',
        MODULE_CODE: 'operation_administration_notes-subcategories',
      },
    },
    NON_COLLECTION_EVENTS: {
      NCE_CATEGORY: {
        READ: '0113050101',
        WRITE: '0113050102',
        ARCHIVE: '0113050103',
        MODULE_CODE: 'operation_administration_nce-categories',
      },
      NCE_SUBCATEGORY: {
        READ: '0113050201',
        WRITE: '0113050202',
        ARCHIVE: '0113050203',
        MODULE_CODE: 'operation_administration_nce-subcategories',
      },
    },
  },
  STAFF_ADMINISTRATION: {
    STAFF_SETUPS: {
      READ: '01140101',
      WRITE: '01140102',
      ARCHIVE: '01140103',
      MODULE_CODE: 'staff_administration_staff_setups',
    },
    CLASSIFICATIONS: {
      CLASSIFICATIONS: {
        READ: '0114020101',
        WRITE: '0114020102',
        ARCHIVE: '0114020103',
        MODULE_CODE: 'staff_administration_classification',
      },
      SETTINGS: {
        READ: '0114020201',
        WRITE: '0114020202',
        ARCHIVE: '0114020203',
        MODULE_CODE: 'staff_administration_settings',
      },
    },
    LEAVE_TYPES: {
      READ: '01140301',
      WRITE: '01140302',
      ARCHIVE: '01140303',
      MODULE_CODE: 'staff_administration_leave_types',
    },
    CERTIFICATIONS: {
      CERTIFICATIONS: {
        READ: '0114030101',
        WRITE: '0114030102',
        ARCHIVE: '0114030103',
        MODULE_CODE: 'staff_administration_certification',
      },
      ASSIGNED_CERTIFICATION: {
        READ: '0114030201',
        WRITE: '0114030202',
        MODULE_CODE: 'staff_administration_assigned_certifications',
      },
    },
    TEAMS: {
      TEAMS: {
        READ: '0114040101',
        WRITE: '0114040102',
        ARCHIVE: '0114040103',
        MODULE_CODE: 'staff_administration_teams',
      },
      ASSIGNED_MEMBER: {
        READ: '0114040201',
        WRITE: '0114040202',
        MODULE_CODE: 'staff_administration_assigned_members',
      },
    },
  },
  USER_ADMINISTRATIONS: {
    USER_ROLES: {
      READ: '01150101',
      WRITE: '01150102',
      ARCHIVE: '01150103',
      MODULE_CODE: 'users_roles',
    },
    USERS: {
      READ: '01150201',
      WRITE: '01150202',
      ARCHIVE: '01150203',
      MODULE_CODE: 'users',
    },
  },
};

export default Permissions;
