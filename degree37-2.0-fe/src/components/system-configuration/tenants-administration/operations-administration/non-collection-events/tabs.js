import Permissions from '../../../../../enums/PermissionsEnum';
import CheckPermission from '../../../../../helpers/CheckPermissions';

export const NceTabs = [
  CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.NON_COLLECTION_EVENTS.NCE_CATEGORY
      .MODULE_CODE,
  ]) && {
    label: 'NCE Categories',
    link: '/system-configuration/tenant-admin/operations-admin/nce-categories/list',
  },
  CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.NON_COLLECTION_EVENTS.NCE_SUBCATEGORY
      .MODULE_CODE,
  ]) && {
    label: 'NCE Subcategories',
    link: '/system-configuration/tenant-admin/operations-admin/nce-subcategories/list',
  },
].filter(Boolean);
