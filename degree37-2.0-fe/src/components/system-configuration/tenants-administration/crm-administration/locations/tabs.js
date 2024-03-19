import Permissions from '../../../../../enums/PermissionsEnum';
import CheckPermission from '../../../../../helpers/CheckPermissions';

export const LocationsTabs = [
  CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.LOCATIONS.ROOM_SIZES.MODULE_CODE,
  ]) && {
    label: 'Room Sizes',
    link: '/system-configuration/tenant-admin/crm-admin/locations/room-size',
  },
  CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_CATEGORY.MODULE_CODE,
  ]) && {
    label: 'Attachment Categories',
    link: '/system-configuration/tenant-admin/crm-admin/locations/attachment-categories',
  },
  CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_SUBCATEGORY
      .MODULE_CODE,
  ]) && {
    label: 'Attachment Subcategories',
    link: '/system-configuration/tenant-admin/crm-admin/locations/attachment-subcategories',
  },
  CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.LOCATIONS.NOTES_CATEGORY.MODULE_CODE,
  ]) && {
    label: 'Note Categories',
    link: '/system-configuration/tenant-admin/crm-admin/locations/note-categories',
  },
  CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.LOCATIONS.NOTES_SUBCATEGORY.MODULE_CODE,
  ]) && {
    label: 'Note Subcategories',
    link: '/system-configuration/tenant-admin/crm-admin/locations/note-subcategories/list',
  },
].filter(Boolean);
