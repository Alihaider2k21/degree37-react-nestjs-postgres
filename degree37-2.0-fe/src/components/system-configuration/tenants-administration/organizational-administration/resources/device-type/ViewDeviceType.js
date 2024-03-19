import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';
import { formatUser } from '../../../../../../helpers/formatUser';
import { formatDate } from '../../../../../../helpers/formatDate';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ViewDeviceType = () => {
  const bearerToken = localStorage.getItem('token');
  const [deviceTypeData, setDeviceTypeData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (id) => {
      setIsLoading(true);

      const result = await fetch(
        `${BASE_URL}/system-configuration/device-type/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        setDeviceTypeData(data);
      } else {
        toast.error('Error Fetching Device type Details', { autoClose: 3000 });
      }
      setIsLoading(false);
    };
    if (id) {
      getData(id);
    }
  }, [id, BASE_URL]);

  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'Device Type',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/organization-admin/resource/device-type',
    },
    {
      label: 'View',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organization-admin/resource/device-type/${id}/view`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'View'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICE_TYPE.WRITE,
        ]) && (
          <div className="text-end h6 fw-normal cursor-pointer">
            <Link
              to={`/system-configuration/tenant-admin/organization-admin/resource/device-type/${id}/edit`}
            >
              <SvgComponent name={'EditIcon'} /> Edit
            </Link>
          </div>
        )}
        <table className="viewTables w-50">
          <thead>
            <tr>
              <th colSpan="2">Device Type Details</th>
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
                <td className="col2"> {deviceTypeData?.name || 'N/A'} </td>
              </tr>
              <tr>
                <td className="col1">Procedure Type</td>
                <td className="col2">
                  {deviceTypeData?.procedure_type?.name || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="col1">Description</td>
                <td className="col2">{deviceTypeData?.description || 'N/A'}</td>
              </tr>
            </tbody>
          )}
        </table>

        <table className="viewTables w-50">
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
                  {deviceTypeData?.status ? (
                    <span className="badge active"> Active </span>
                  ) : (
                    <span className="badge inactive"> Inactive </span>
                  )}{' '}
                </td>
              </tr>
              <tr>
                <td className="col1">Created</td>
                <td className="col2">
                  {deviceTypeData &&
                  deviceTypeData?.created_by &&
                  deviceTypeData?.created_at ? (
                    <>
                      {formatUser(deviceTypeData?.created_by)}
                      {formatDate(deviceTypeData?.created_at)}
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
                  {deviceTypeData &&
                  deviceTypeData?.modified_at &&
                  deviceTypeData?.modified_by ? (
                    <>
                      {formatUser(deviceTypeData?.modified_by)}
                      {formatDate(deviceTypeData?.modified_at)}
                    </>
                  ) : (
                    <>
                      {formatUser(deviceTypeData?.created_by)}
                      {formatDate(deviceTypeData?.created_at)}
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default ViewDeviceType;
