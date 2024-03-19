import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../../../styles/Global/Global.scss';
import '../../../../styles/Global/Variable.scss';

const StaffViewNavigationTabs = () => {
  // const location = useLocation();
  // const currentLocation = location.pathname;
  const params = useParams();

  return (
    <div className="filterBar p-0 ">
      <div className="tabs">
        <ul>
          <li>
            <Link
              className="active"
              to={`/crm/contacts/staff/${params?.id}/view`}
              // className={
              //   currentLocation ===
              //   '/crm/contacts/staff/'
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
            //   '/crm/contacts/staff'
            // }
            // className={
            //   currentLocation ===
            //   '/crm/contacts/staff/'
            //     ? 'active'
            //     : ''
            // }
            >
              Availability
            </Link>
          </li>
          <li>
            <Link
            // to={
            //   '/crm/contacts/staff'
            // }
            // className={
            //   currentLocation ===
            //   '/crm/contacts/staff/'
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
            //   '/crm/contacts/staff'
            // }
            // className={
            //   currentLocation ===
            //   '/crm/contacts/staff/'
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
            //   '/crm/contacts/staff'
            // }
            // className={
            //   currentLocation ===
            //   '/crm/contacts/staff/'
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
            //   '/crm/contacts/staff'
            // }
            // className={
            //   currentLocation ===
            //   '/crm/contacts/staff/'
            //     ? 'active'
            //     : ''
            // }
            >
              Schedule
            </Link>
          </li>
          <li>
            <Link
            // to={
            //   '/crm/contacts/staff'
            // }
            // className={
            //   currentLocation ===
            //   '/crm/contacts/staff/'
            //     ? 'active'
            //     : ''
            // }
            >
              Leave
            </Link>
          </li>
          <li>
            <Link
            // to={
            //   '/crm/contacts/staff'
            // }
            // className={
            //   currentLocation ===
            //   '/crm/contacts/staff/'
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

export default StaffViewNavigationTabs;
