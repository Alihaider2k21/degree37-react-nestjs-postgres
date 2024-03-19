import React from 'react';
import { Link } from 'react-router-dom';
import '../../../../styles/Global/Global.scss';
import '../../../../styles/Global/Variable.scss';

const ContactsViewNavigationTabs = () => {
  // const location = useLocation();
  // const currentLocation = location.pathname;

  return (
    <div className="filterBar p-0 ">
      <div className="tabs">
        <ul>
          <li>
            <Link
              className="active"
              // to={
              //   '/system-configuration/tenant-admin/organization-admin/resources/devices'
              // }
              // className={
              //   currentLocation ===
              //   '/system-configuration/tenant-admin/organization-admin/resources/devices'
              //     ? 'active'
              //     : ''
              // }
            >
              About
            </Link>
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
              Communication
            </Link>
          </li>
          <li>
            <Link
            // to={
            //   '/system-configuration/tenant-admin/organization-admin/resources/vehicles'
            // }
            // className={
            //   currentLocation ===
            //   '/system-configuration/tenant-admin/organization-admin/resources/vehicles'
            //     ? 'active'
            //     : ''
            // }
            >
              Tasks
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
              Recent Activity
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
              Donation History
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
              Schedule
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactsViewNavigationTabs;
