import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import TopBar from '../../../../../common/topbar/index';
import 'react-toastify/dist/ReactToastify.css';
import SvgComponent from '../../../../../common/SvgComponent';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

// Custom function to format the date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${month} ${ordinalSuffix(day)}, ${year} ${hours}:${minutes
    .toString()
    .padStart(2, '0')}`;
};

// Function to get the ordinal suffix (e.g., 1st, 2nd, 3rd, etc.)
const ordinalSuffix = (day) => {
  if (day === 1 || day === 21 || day === 31) {
    return `${day}st`;
  } else if (day === 2 || day === 22) {
    return `${day}nd`;
  } else if (day === 3 || day === 23) {
    return `${day}rd`;
  } else {
    return `${day}th`;
  }
};

const DeviceMaintenanceList = ({ deviceId }) => {
  const bearerToken = localStorage.getItem('token');
  const location = useLocation();
  const currentLocation = location.pathname;
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [maintenanceData, setMaintenanceData] = useState([]);
  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'Schedule Maintenance',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/maintenance`,
    },
  ];

  const getData = async (deviceId) => {
    const result = await fetch(`${BASE_URL}/devices/${deviceId}/maintenances`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setMaintenanceData(data);
    } else {
      toast.error('Error Fetching Device Maintenance Details', {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    getData(deviceId);
  }, []);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Devices'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="filterBar">
        <div className="tabs">
          <ul>
            <li>
              <Link
                to={
                  '/system-configuration/tenant-admin/organization-admin/resources/devices/' +
                  deviceId +
                  '/view'
                }
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to={`/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/maintenance`}
                className={
                  currentLocation ===
                  '/system-configuration/tenant-admin/organization-admin/resources/devices/' +
                    deviceId +
                    '/maintenance'
                    ? 'active'
                    : ''
                }
              >
                {' '}
                Device Maintenance
              </Link>
            </li>
            <li>
              <Link
                to={`/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/sharing`}
                className={''}
              >
                Device Sharing
              </Link>
            </li>
          </ul>
          {CheckPermission([
            Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICES
              .SCHEDULE_MAINTENANCE,
          ]) && (
            <div
              className="text-end h6 fw-normal cursor-pointer"
              style={{ marginTop: '-2%' }}
            >
              <Link
                to={`/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/schedule-maintenance`}
              >
                <SvgComponent name={'PlusIcon'} /> Schedule Maintenance
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="mainContentInner">
        {maintenanceData?.length ? (
          maintenanceData?.map((maintenance, key) => {
            return (
              <div className="maintenance-box" key={key}>
                <p>{maintenance.dm_description}</p>
                <ul className="clearfix">
                  <li className="circle-icon line">Start Date/Time</li>
                  <li>
                    <p>{formatDate(maintenance.dm_start_date_time)}</p>
                  </li>
                  <li className="circle-icon">End Date/Time</li>
                  <li>
                    <p>{formatDate(maintenance.dm_end_date_time)}</p>
                  </li>
                  <li>
                    <p>Reduce Slots</p>
                  </li>
                  <li>
                    <p>{maintenance.dm_reduce_slots ? 'Yes' : 'No'}</p>
                  </li>
                </ul>
                <p className="position-absolute right text-grey">
                  {formatDate(maintenance.dm_created_at)}
                </p>
              </div>
            );
          })
        ) : (
          <div className="no-data-found">
            <span className="text-center no-data-found-color">
              No data found.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceMaintenanceList;
