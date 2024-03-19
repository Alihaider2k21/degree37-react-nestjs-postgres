import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import TopBar from '../../../../../common/topbar/index';
import CreateIcon from '../../../../../../assets/plus.svg';

import 'react-toastify/dist/ReactToastify.css';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import SvgComponent from '../../../../../common/SvgComponent';

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

const VehicleMaintenanceList = ({ vehicleId }) => {
  const location = useLocation();
  const currentLocation = location.pathname;
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [vehicleMaintenaceData, setVehicleMaintenaceData] = useState([]);

  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'View Vehicle',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/view`,
    },
  ];

  const getData = async (vehicleId) => {
    const bearerToken = localStorage.getItem('token');
    const result = await fetch(
      `${BASE_URL}/vehicles/${vehicleId}/maintenances`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setVehicleMaintenaceData(data);
    } else {
      toast.error('Error Fetching Vehicle Maintenance Details', {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    getData(vehicleId);
  }, []);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Vehicles'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="filterBar">
        <div className="tabs vehicle-tab">
          <ul>
            <li>
              <Link
                to={`/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/view`}
                className={
                  currentLocation ===
                  `/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/view`
                    ? 'active'
                    : ''
                }
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to={`/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/maintenance`}
                className={
                  currentLocation ===
                  `/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/maintenance`
                    ? 'active'
                    : ''
                }
              >
                Vehicle Maintenance
              </Link>
            </li>
            <li>
              <Link
                to={`/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/sharing`}
                className={
                  currentLocation ===
                  `/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/sharing`
                    ? 'active'
                    : ''
                }
              >
                Vehicle Sharing
              </Link>
            </li>
          </ul>
          {CheckPermission([
            Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLES
              .SCHEDULE_MAINTENANCE,
          ]) && (
            <div className="text-end h6 fw-normal cursor-pointer edit-icon">
              <Link
                to={`/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/schedule-maintenance`}
                className="d-flex align-items-center"
              >
                <img src={CreateIcon} className="" alt="CreateIcon" /> Schedule
                Maintenance
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="mainContentInner">
        {vehicleMaintenaceData?.length ? (
          vehicleMaintenaceData.map((vehicleMaintenace, key) => {
            return (
              <div className="maintenance-box" key={key}>
                <div className="col-10">
                  <p>{vehicleMaintenace.vm_description}</p>
                  <ul className="clearfix">
                    <li className="circle-icon line">Start Date/Time</li>
                    <li>
                      <p>{formatDate(vehicleMaintenace.vm_start_date_time)}</p>
                    </li>
                    <li className="circle-icon">End Date/Time</li>
                    <li>
                      <p>{formatDate(vehicleMaintenace.vm_end_date_time)}</p>
                    </li>
                    <li>
                      <p>Prevent Booking</p>
                    </li>
                    <li>
                      <p>
                        {vehicleMaintenace.vm_prevent_booking ? 'Yes' : 'No'}
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="col-2">
                  <p className="position-absolute right text-grey">
                    {formatDate(vehicleMaintenace.vm_created_at)}
                    <div className="buttons mt-2">
                      <Link
                        to={`/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/schedule-maintenance/${vehicleMaintenace.vm_id}`}
                      >
                        <span className="icon">
                          <SvgComponent name="EditIcon" />
                        </span>
                        <span className="text">Edit</span>
                      </Link>
                    </div>
                  </p>
                </div>
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

export default VehicleMaintenanceList;
