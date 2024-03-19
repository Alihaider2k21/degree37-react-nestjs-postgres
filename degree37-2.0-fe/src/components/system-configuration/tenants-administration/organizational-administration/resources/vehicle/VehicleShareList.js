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
const formatDate = (dateStr, hideTime = false) => {
  const date = new Date(dateStr);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  if (hideTime) {
    return `${month} ${ordinalSuffix(day)}, ${year}`;
  }
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

const VehicleShareList = ({ vehicleId }) => {
  const bearerToken = localStorage.getItem('token');
  const location = useLocation();
  const currentLocation = location.pathname;
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [vehicleShareData, setVehicleShareData] = useState([]);

  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'View Vehicle',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/view`,
    },
  ];

  const getData = async (vehicleId) => {
    const result = await fetch(`${BASE_URL}/vehicles/${vehicleId}/shares`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setVehicleShareData(data);
    } else {
      toast.error('Error Fetching Vehicle Share Details', { autoClose: 3000 });
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
              .SHARE_VEHICLE,
          ]) && (
            <div className="text-end h6 fw-normal cursor-pointer edit-icon">
              <Link
                to={`/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/share`}
                className="d-flex align-items-center"
              >
                <img src={CreateIcon} className="" alt="CreateIcon" /> Share
                Vehicle
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="mainContentInner">
        {vehicleShareData?.length ? (
          vehicleShareData.map((vehicleShare, key) => {
            return (
              <div className="maintenance-box" key={key}>
                <p>&nbsp;</p>
                <ul className="clearfix mw-100">
                  <div className="d-flex">
                    <div className="w-50">
                      <li className="circle-icon line">Start Date</li>
                      <li>
                        <p>{formatDate(vehicleShare.vs_start_date)}</p>
                      </li>
                      <li className="circle-icon">End Date</li>
                      <li>
                        <p>{formatDate(vehicleShare.vs_end_date)}</p>
                      </li>
                    </div>
                    <div className="w-50">
                      <li className="circle-icon line">From</li>
                      <li>
                        <p>{vehicleShare.from_name}</p>
                      </li>
                      <li className="circle-icon">To</li>
                      <li>
                        <p>{vehicleShare.to_name}</p>
                      </li>
                    </div>
                  </div>
                </ul>
                <p className="position-absolute right text-grey">
                  {formatDate(vehicleShare.vs_created_at)}
                  <div className="buttons mt-2">
                    <Link
                      to={`/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/share/${vehicleShare.vs_id}`}
                    >
                      <span className="icon">
                        <SvgComponent name="EditIcon" />
                      </span>
                      <span className="text">Edit</span>
                    </Link>
                  </div>
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

export default VehicleShareList;
