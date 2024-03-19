import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { USER_ROLES } from '../../../../routes/path';
import SvgComponent from '../../../common/SvgComponent';

const NavigationTabs = ({ roleId, showEdit }) => {
  const location = useLocation();
  const currentLocation = location.pathname;

  return (
    <div className="tabs d-flex justify-content-between">
      <ul>
        <li>
          <Link
            to={USER_ROLES.VIEW.replace(':id', roleId)}
            className={
              currentLocation === USER_ROLES.VIEW.replace(':id', roleId)
                ? 'active'
                : ''
            }
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to={USER_ROLES.ASSIGN.replace(':id', roleId)}
            className={
              currentLocation === USER_ROLES.ASSIGN.replace(':id', roleId)
                ? 'active'
                : ''
            }
          >
            Assigned Users
          </Link>
        </li>
      </ul>
      {showEdit && (
        <div
          className="text-end h6 fw-normal cursor-pointer align-self-end"
          style={{ marginTop: '-1%', right: '3em' }}
        >
          <Link to={USER_ROLES.EDIT.replace(':id', roleId)}>
            <SvgComponent name={'EditIcon'} /> Edit
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavigationTabs;
