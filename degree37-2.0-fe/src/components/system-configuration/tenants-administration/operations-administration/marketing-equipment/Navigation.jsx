import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';

export default function MarketingEquipmentNavigation({ children }) {
  const location = useLocation();

  const tabs = [
    CheckPermission(null, [
      Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.PROMOTIONS
        .MODULE_CODE,
    ]) && {
      name: 'Promotions',
      path: '/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions',
    },
    CheckPermission(null, [
      Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS
        .PROMOTIONAL_ITEMS.MODULE_CODE,
    ]) && {
      name: 'Promotional Items',
      path: '/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotional-items',
    },
    CheckPermission(null, [
      Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS
        .MARKETING_MATERIAL.MODULE_CODE,
    ]) && {
      name: 'Marketing Materials',
      path: '/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/list',
    },
    CheckPermission(null, [
      Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.APPROVALS
        .MODULE_CODE,
    ]) && {
      name: 'Approvals',
      path: '/system-configuration/tenant-admin/operations-admin/marketing-equipment/approvals',
    },
    CheckPermission(null, [
      Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.EQUIPMENTS
        .MODULE_CODE,
    ]) && {
      name: 'Equipment',
      path: '/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/list',
    },
  ].filter(Boolean);

  return (
    <div>
      <div className="tabs">
        <ul>
          {tabs.map((tab, index) => (
            <li key={`Tab-${index}`}>
              <Link
                to={tab.path}
                className={
                  location.pathname === tab.path ||
                  location.pathname.startsWith(tab.path + '/edit')
                    ? 'active'
                    : ''
                }
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
