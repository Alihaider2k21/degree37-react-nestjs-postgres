import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';
import { formatUser } from '../../../../../../helpers/formatUser';
import { formatDate } from '../../../../../../helpers/formatDate';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const VehicleTypeView = ({ vehicleTypeId }) => {
  const bearerToken = localStorage.getItem('token');
  const [vehicleTypeData, setVehicleTypeData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (vehicleTypeId) => {
      setIsLoading(true);
      const result = await fetch(`${BASE_URL}/vehicle-types/${vehicleTypeId}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        setVehicleTypeData(data);
        setIsLoading(false);
      } else {
        toast.error('Error Fetching Vehicle Type Details', { autoClose: 3000 });
        setIsLoading(false);
      }
    };
    if (vehicleTypeId) {
      getData(vehicleTypeId);
    }
  }, [vehicleTypeId]);

  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'View Vehicle Type',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organization-admin/resources/vehicle-types/${vehicleTypeId}/view`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Vehicle Type'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLE_TYPE
            .WRITE,
        ]) && (
          <div className="text-end h6 fw-normal cursor-pointer">
            <Link
              to={`/system-configuration/tenant-admin/organization-admin/resources/vehicle-types/${vehicleTypeId}/edit`}
            >
              <SvgComponent name={'EditIcon'} /> Edit
            </Link>
          </div>
        )}
        <table className="viewTables w-50">
          <thead>
            <tr>
              <th colSpan="2">Vehicle Type Details</th>
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
                <td className="col2">
                  {vehicleTypeData?.name ? vehicleTypeData?.name : 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="col1">Location Type</td>
                <td className="col2">
                  {' '}
                  {`${
                    vehicleTypeData?.location_type_id === '1'
                      ? 'Outside'
                      : vehicleTypeData?.location_type_id === '2'
                      ? 'Inside'
                      : vehicleTypeData?.location_type_id === '3'
                      ? 'Combination'
                      : 'N/A'
                  }`}{' '}
                </td>
              </tr>
              <tr>
                <td className="col1">Collection Vehicle</td>
                <td className="col2">
                  {vehicleTypeData?.collection_vehicle ? 'Yes' : 'No'}
                </td>
              </tr>
              <tr>
                <td className="col1">Linkable</td>
                <td className="col2">
                  {vehicleTypeData?.linkable ? 'Yes' : 'No'}{' '}
                </td>
              </tr>
              <tr>
                <td className="col1">Description</td>
                <td className="col2">
                  {vehicleTypeData?.description
                    ? vehicleTypeData?.description
                    : 'N/A'}
                </td>
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
                  {vehicleTypeData?.is_active ? (
                    <span className="badge active"> Active </span>
                  ) : (
                    <span className="badge inactive"> Inactive </span>
                  )}{' '}
                </td>
              </tr>
              <tr>
                <td className="col1">Created</td>
                <td className="col2">
                  {vehicleTypeData?.created_by
                    ? formatUser(vehicleTypeData?.created_by)
                    : 'N/A |'}{' '}
                  {vehicleTypeData?.created_at
                    ? formatDate(vehicleTypeData?.created_at)
                    : 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="col1">Modified</td>
                <td className="col2">
                  {vehicleTypeData?.modified_by || vehicleTypeData?.created_by
                    ? formatUser(
                        vehicleTypeData?.modified_by ??
                          vehicleTypeData?.created_by
                      )
                    : 'N/A |'}{' '}
                  {vehicleTypeData?.modified_at || vehicleTypeData?.created_at
                    ? formatDate(
                        vehicleTypeData?.modified_at ??
                          vehicleTypeData?.created_at
                      )
                    : 'N/A'}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default VehicleTypeView;
