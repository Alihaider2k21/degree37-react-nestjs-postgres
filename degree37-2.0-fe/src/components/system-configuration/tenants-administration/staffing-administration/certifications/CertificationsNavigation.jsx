import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';

export default function CertificationsNavigation({ children }) {
  const location = useLocation();

  const tabs = [
    CheckPermission(null, [
      Permissions.STAFF_ADMINISTRATION.CERTIFICATIONS.CERTIFICATIONS
        .MODULE_CODE,
    ]) && {
      name: 'Certifications',
      path: '/system-configuration/tenant-admin/staffing-admin/certifications',
    },
    CheckPermission(null, [
      Permissions.STAFF_ADMINISTRATION.CERTIFICATIONS.ASSIGNED_CERTIFICATION
        .MODULE_CODE,
    ]) && {
      name: 'Assigned Certifications',
      path: '/system-configuration/tenant-admin/staffing-admin/certifications/assigned-certification',
    },
  ];

  return (
    <div className="filterBar">
      <div className="tabs">
        <ul>
          {tabs.map((tab, index) => (
            <li key={`Tab-${index}`}>
              <Link
                to={tab.path}
                className={location.pathname === tab.path ? 'active' : ''}
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
