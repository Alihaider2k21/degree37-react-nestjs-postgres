import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import SvgComponent from '../../../../../common/SvgComponent';
import { Link, useLocation } from 'react-router-dom';
import { formatUser } from '../../../../../../helpers/formatUser';
import { formatDate } from '../../../../../../helpers/formatDate';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const VehicleView = ({ vehicleId }) => {
  const bearerToken = localStorage.getItem('token');
  const location = useLocation();
  const currentLocation = location.pathname;
  const [vehicleData, setVehicleData] = useState({});
  const [certifications, setCertifications] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [modifiledDates, setModifiledDates] = useState({});
  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'View Vehicle',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/view`,
    },
  ];

  useEffect(() => {
    const getData = async (vehicleId) => {
      setIsLoading(true);

      const result = await fetch(`${BASE_URL}/vehicles/${vehicleId}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        setVehicleData(data.vehicle);
        setCertifications(data.certifications);
        setModifiledDates(data);
        setIsLoading(false);
      } else {
        toast.error('Error Fetching Vehicle Details', { autoClose: 3000 });
        setIsLoading(false);
      }
    };
    if (vehicleId) {
      getData(vehicleId);
    }
  }, [vehicleId]);
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
            Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLES.WRITE,
          ]) && (
            <div className="text-end h6 fw-normal cursor-pointer edit-icon">
              <Link
                to={`/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/edit`}
              >
                <SvgComponent name={'EditIcon'} /> Edit
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mainContentInner">
        <div className="col-md-6">
          <table className="viewTables">
            <thead>
              <tr>
                <th colSpan="2">Vehicle Details</th>
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
                    {vehicleData?.name ? vehicleData?.name : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Short Name</td>
                  <td className="col2">
                    {vehicleData?.short_name ? vehicleData?.short_name : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Description</td>
                  <td className="col2">
                    {vehicleData?.description
                      ? vehicleData?.description
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Vehicle Type</td>
                  <td className="col2">
                    {vehicleData?.vehicle_type_id?.name
                      ? vehicleData?.vehicle_type_id?.name
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Retire On</td>
                  <td className="col2">
                    {vehicleData?.retire_on
                      ? formatDate(vehicleData?.retire_on)
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Replace With</td>
                  <td className="col2">
                    {vehicleData?.replace_vehicle_id?.name
                      ? vehicleData?.replace_vehicle_id?.name
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Certifications</td>
                  <td className="col2">
                    {certifications?.length > 0
                      ? certifications
                          ?.map(
                            (certification) =>
                              `${certification.certification.name}`
                          )
                          .join(', ')
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Collection Operation</td>
                  <td className="col2">
                    {vehicleData?.collection_operation_id?.name
                      ? vehicleData?.collection_operation_id?.name
                      : 'N/A'}
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
                    {vehicleData?.is_active ? (
                      <span className="badge active"> Active </span>
                    ) : (
                      <span className="badge inactive"> Inactive </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Created</td>
                  <td className="col2">
                    {vehicleData?.created_by
                      ? formatUser(vehicleData?.created_by)
                      : 'N/A |'}{' '}
                    {vehicleData?.created_at
                      ? formatDate(vehicleData?.created_at)
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Modified</td>
                  <td className="col2">
                    {modifiledDates?.modified_by || vehicleData?.created_by
                      ? formatUser(
                          modifiledDates?.modified_by ?? vehicleData?.created_by
                        )
                      : 'N/A |'}{' '}
                    {modifiledDates?.modified_at || vehicleData?.created_at
                      ? formatDate(
                          modifiledDates?.modified_at ?? vehicleData?.created_at
                        )
                      : 'N/A'}
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

export default VehicleView;
