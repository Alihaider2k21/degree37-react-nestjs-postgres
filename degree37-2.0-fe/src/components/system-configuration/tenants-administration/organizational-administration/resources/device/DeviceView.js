import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';

import { formatUser } from '../../../../../../helpers/formatUser';
import { formatDate } from '../../../../../../helpers/formatDate';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const DeviceView = ({ deviceId }) => {
  const bearerToken = localStorage.getItem('token');
  const location = useLocation();
  const currentLocation = location.pathname;
  const [deviceData, setDeviceData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (deviceId) => {
      setIsLoading(true);

      const result = await fetch(`${BASE_URL}/devices/${deviceId}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        setDeviceData(data);
      } else {
        toast.error('Error Fetching Tenant Details', { autoClose: 3000 });
      }
      setIsLoading(false);
    };
    if (deviceId) {
      getData(deviceId);
    }
  }, [deviceId]);

  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'View Device',
      class: 'active-label',
      link: deviceId
        ? `/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/view`
        : '/system-configuration/tenant-admin/organization-admin/resources/devices/create',
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Devices'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <div className="filterBar">
          <div className="tabs">
            <ul>
              <li>
                <Link
                  to={
                    '/system-configuration/tenant-admin/organization-admin/resources/devices/' +
                    deviceId
                  }
                  className={
                    currentLocation ===
                    '/system-configuration/tenant-admin/organization-admin/resources/devices/' +
                      deviceId +
                      '/view'
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
                  className={''}
                >
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
              Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICES.WRITE,
            ]) && (
              <div
                className="text-end h6 fw-normal cursor-pointer"
                style={{ marginTop: '-2%' }}
              >
                <Link
                  to={`/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/edit`}
                >
                  <SvgComponent name={'EditIcon'} /> Edit
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <table className="viewTables">
            <thead>
              <tr>
                <th colSpan="2">Device Details</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <td className="col2 no-data text-center">Data Loading</td>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td className="col1">Name</td>
                  <td className="col2"> {deviceData?.name || 'N/A'} </td>
                </tr>
                <tr>
                  <td className="col1">Short Name</td>
                  <td className="col2"> {deviceData?.short_name || 'N/A'} </td>
                </tr>
                <tr>
                  <td className="col1">Description</td>
                  <td className="col2"> {deviceData?.description || 'N/A'} </td>
                </tr>
                <tr>
                  <td className="col1">Device Type</td>
                  <td className="col2">
                    {' '}
                    {deviceData?.device_type?.name || 'N/A'}{' '}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Retires On</td>
                  <td className="col2"> {deviceData?.retire_on || 'N/A'} </td>
                </tr>
                <tr>
                  <td className="col1">Collection Operation</td>
                  <td className="col2">
                    {deviceData?.collection_operation?.name || 'N/A'}
                  </td>
                </tr>
              </tbody>
            )}
          </table>

          <table className="viewTables">
            <thead>
              <tr>
                <th colSpan="2">Insights</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <td className="col2 no-data text-center">Data Loading</td>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td className="col1">Status</td>
                  <td className="col2">
                    {' '}
                    {deviceData?.status ? (
                      <span className="badge active"> Active </span>
                    ) : (
                      <span className="badge inactive"> Inactive </span>
                    )}{' '}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Created</td>
                  <td className="col2">
                    {deviceData &&
                    deviceData?.created_by &&
                    deviceData?.created_at ? (
                      <>
                        {formatUser(deviceData?.created_by)}
                        {formatDate(deviceData?.created_at)}
                      </>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Modified</td>
                  <td className="col2">
                    {' '}
                    {deviceData &&
                    deviceData?.modified_at &&
                    deviceData?.modified_by ? (
                      <>
                        {formatUser(deviceData?.modified_by)}
                        {formatDate(deviceData?.modified_at)}
                      </>
                    ) : (
                      <>
                        {formatUser(deviceData?.created_by)}
                        {formatDate(deviceData?.created_at)}
                      </>
                    )}
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeviceView;
