import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import '../../../../styles/Global/Global.scss';
import '../../../../styles/Global/Variable.scss';
import { STAFF_TASKS_PATH } from '../../../../routes/path';
const AccountViewNavigationTabs = () => {
  const location = useLocation();
  const { id, staff_id } = useParams();
  const currentLocation = location.pathname;

  return (
    <div className="filterBar p-0 ">
      <div className="tabs">
        <ul>
          <li>
            <Link to={`/crm/contacts/staff/${id}/view`}>About</Link>
          </li>
          <li>
            <Link
            // to={
            //   '/system-configuration/tenant-admin/organization-admin/resource/device-type'
            // }
            // className={
            //   currentLocation ===
            //   '/system-configuration/tenant-admin/organization-admin/resource/device-type'
            //     ? 'active'
            //     : ''
            // }
            >
              Blueprints
            </Link>
          </li>
          <li>
            <Link
              to={STAFF_TASKS_PATH.LIST.replace(`:staff_id`, staff_id ?? id)}
              className={
                currentLocation ===
                STAFF_TASKS_PATH.LIST.replace(`:staff_id`, staff_id ?? id)
                  ? 'active'
                  : ''
              }
            >
              Tasks
            </Link>
          </li>
          <li>
            <Link
              to={`/crm/contacts/staff/${id}/view/documents/notes`}
              className={
                currentLocation.includes(
                  `/crm/contacts/staff/${id}/view/documents`
                )
                  ? 'active'
                  : ''
              }
            >
              Documents
            </Link>
          </li>
          <li>
            <Link
            // to={
            //   '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types'
            // }
            // className={
            //   currentLocation ===
            //   '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types'
            //     ? 'active'
            //     : ''
            // }
            >
              Drive History
            </Link>
          </li>
          <li>
            <Link
            // to={
            //   '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types'
            // }
            // className={
            //   currentLocation ===
            //   '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types'
            //     ? 'active'
            //     : ''
            // }
            >
              Duplicates
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccountViewNavigationTabs;
