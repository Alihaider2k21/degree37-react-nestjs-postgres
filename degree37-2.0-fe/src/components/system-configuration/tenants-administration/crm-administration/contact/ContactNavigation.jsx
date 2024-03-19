import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';

export default function ContactNavigation({ children }) {
  const location = useLocation();

  const tabs = [
    // {
    //   name: 'Functions',
    //   path: '#',
    //   // path: '/system-configuration/tenant-admin/crm-admin/contacts/functions',
    // },
    CheckPermission(null, [
      Permissions.CRM_ADMINISTRATION.CONTACTS.ROLES.MODULE_CODE,
    ]) && {
      name: 'Roles',
      path: '/system-configuration/tenant-admin/crm-admin/contacts/roles/list',
    },
    CheckPermission(null, [
      Permissions.CRM_ADMINISTRATION.CONTACTS.ATTACHMENTS_CATEGORY.MODULE_CODE,
    ]) && {
      name: 'Attachment Categories',
      path: '/system-configuration/tenant-admin/crm-admin/contacts/attachment-categories',
    },
    CheckPermission(null, [
      Permissions.CRM_ADMINISTRATION.CONTACTS.ATTACHMENTS_SUBCATEGORY
        .MODULE_CODE,
    ]) && {
      name: 'Attachment Subcategories',
      path: '/system-configuration/tenant-admin/crm-admin/contacts/attachment-subcategories',
    },
    CheckPermission(null, [
      Permissions.CRM_ADMINISTRATION.CONTACTS.NOTES_CATEGORY.MODULE_CODE,
    ]) && {
      name: 'Note Categories',
      path: '/system-configuration/tenant-admin/crm-admin/contacts/note-categories/list',
    },
    CheckPermission(null, [
      Permissions.CRM_ADMINISTRATION.CONTACTS.NOTES_SUBCATEGORY.MODULE_CODE,
    ]) && {
      name: 'Note Subcategories',
      path: '/system-configuration/tenant-admin/crm-admin/contacts/note-subcategories/list',
    },
  ].filter(Boolean);

  return (
    <div className="filterBar">
      <div className="tabs">
        <ul>
          {tabs.map((tab, index) => (
            <li key={`Tab-${index}`}>
              <Link
                to={tab.path}
                className={`${
                  location.pathname === tab.path ||
                  tab?.relevantLinks?.some((link) =>
                    window.location.pathname.includes(link)
                  )
                    ? 'active'
                    : ''
                } ${tab.className || ''}`}
              >
                {tab.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {children && (
        <div className="filterInner">
          <h2>Filters</h2>
          {children}
        </div>
      )}
    </div>
  );
}
