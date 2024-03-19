import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import TopBar from '../../../../../common/topbar/index';
import CreateIcon from '../../../../../../assets/plus.svg';
import 'react-toastify/dist/ReactToastify.css';
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

const DeviceShareList = ({ deviceId }) => {
  const bearerToken = localStorage.getItem('token');
  const location = useLocation();
  const currentLocation = location.pathname;
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [shareData, setShareData] = useState([]);
  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'Share Device',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/sharing`,
    },
  ];

  const getData = async (deviceId) => {
    const result = await fetch(`${BASE_URL}/devices/${deviceId}/shares`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setShareData(data);
    } else {
      toast.error('Error Fetching device Share Details', { autoClose: 3000 });
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
        <div className="tabs vehicle-tab">
          <ul>
            <li>
              <Link
                to={`/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/view`}
                className={
                  currentLocation ===
                  `/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/view`
                    ? 'active'
                    : ''
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
                  `/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/maintenance`
                    ? 'active'
                    : ''
                }
              >
                Device Maintenance
              </Link>
            </li>
            <li>
              <Link
                to={`/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/sharing`}
                className={
                  currentLocation ===
                  `/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/sharing`
                    ? 'active'
                    : ''
                }
              >
                Device Sharing
              </Link>
            </li>
          </ul>
          {CheckPermission([
            Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICES
              .SHARE_DEVICE,
          ]) && (
            <div className="text-end h6 fw-normal cursor-pointer edit-icon">
              <Link
                to={`/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/share`}
                className="d-flex align-items-center"
              >
                <img src={CreateIcon} className="" alt="CreateIcon" /> Share
                Device
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="mainContentInner">
        {shareData?.length ? (
          shareData?.map((deviceShare, key) => {
            return (
              <div className="maintenance-box" key={key}>
                <p>&nbsp;</p>
                <ul className="clearfix mw-100">
                  <div className="d-flex">
                    <div className="w-50">
                      <li className="circle-icon line">Start Date</li>
                      <li>
                        <p>{formatDate(deviceShare.ds_start_date)}</p>
                      </li>
                      <li className="circle-icon">End Date</li>
                      <li>
                        <p>{formatDate(deviceShare.ds_end_date)}</p>
                      </li>
                    </div>
                    <div className="w-50">
                      <li className="circle-icon line">From</li>
                      <li>
                        <p>{deviceShare.from_name}</p>
                      </li>
                      <li className="circle-icon">To</li>
                      <li>
                        <p>{deviceShare.to_name}</p>
                      </li>
                    </div>
                  </div>
                </ul>
                <p className="position-absolute right text-grey">
                  {formatDate(deviceShare.ds_created_at)}
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

export default DeviceShareList;
