import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TopBar from '../../../../../common/topbar/index';
import { formatUser } from '../../../../../../helpers/formatUser';
import { formatDate } from '../../../../../../helpers/formatDate';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import { FACILITIES_PATH } from '../../../../../../routes/path';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import {
  removeCountyWord,
  viewPhysicalAddress,
} from '../../../../../../helpers/utils';

const FacilityView = () => {
  const bearerToken = localStorage.getItem('token');
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [facility, setFacility] = useState({});
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDataById = async () => {
      setIsLoading(true);
      const result = await fetch(
        `${BASE_URL}/system-configuration/facilities/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = await result.json();
      // data.created_at = formatDate(data.created_at);
      // data.updated_at = formatDate(data.updated_at);
      setFacility({
        ...data[0],
        modified_by: data.modified_by,
        modified_at: data.modified_at,
      });
      setIsLoading(false);
    };
    getDataById();
  }, []);

  const handleRedirect = () => {
    navigate(
      `/system-configuration/resource-management/facilities/${facility.id}`
    );
  };
  const BreadCrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'View Facility',
      class: 'active-label',
      link: FACILITIES_PATH.VIEW.replace(':id', id),
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadCrumbsData}
        BreadCrumbsTitle={'Facilities'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.FACILITIES.WRITE,
        ]) && (
          <div
            className="d-flex justify-content-end align-items-center"
            style={{ width: '100%' }}
          >
            <p
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
                color: '#0d6efd',
              }}
              onClick={() => handleRedirect()}
            >
              <FontAwesomeIcon
                style={{ marginRight: '5px' }}
                icon={faPencil}
                color="#0d6efd"
              />
              Edit
            </p>
          </div>
        )}
        <div className="col-md-6">
          <table className="viewTables">
            <thead>
              <tr>
                <th colSpan="2">Facility Details</th>
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
                  <td className="col2"> {facility?.name || 'N/A'} </td>
                </tr>
                <tr>
                  <td className="col1">Alternate Name</td>
                  <td className="col2">
                    {' '}
                    {facility?.alternate_name || 'N/A'}{' '}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Physical Address</td>
                  <td className="col2">
                    {viewPhysicalAddress(facility?.address)}
                  </td>
                </tr>
                <tr>
                  <td className="col1">County</td>
                  <td className="col2">
                    {removeCountyWord(facility?.address?.county) || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Phone</td>
                  <td className="col2">{facility?.phone || 'N/A'}</td>
                </tr>
              </tbody>
            )}
          </table>
          <table className="viewTables">
            <thead>
              <tr>
                <th colSpan="2">Attributes</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <td className="col2 no-data text-center">Data Loading</td>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td className="col1">BECS Code</td>
                  <td className="col2"> {facility?.code || 'N/A'} </td>
                </tr>
                <tr>
                  <td className="col1">Collection Operation</td>
                  <td className="col2">
                    {' '}
                    {facility?.collection_operation?.name || 'N/A'}{' '}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Industry Category</td>
                  <td className="col2">
                    {' '}
                    {facility?.industry_category?.name || 'N/A'}{' '}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Industry SubCategory</td>
                  <td className="col2">
                    {' '}
                    {facility?.industry_sub_category[0]?.name || 'N/A'}{' '}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Donor Center</td>
                  <td className="col2">
                    {' '}
                    {facility?.donor_center ? 'Yes' : 'No'}{' '}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Staging Site</td>
                  <td className="col2">
                    {facility.staging_site ? 'Yes' : 'No'}
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
                    {facility?.status ? (
                      <span className="badge active"> Active </span>
                    ) : (
                      <span className="badge inactive"> Inactive </span>
                    )}{' '}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Created</td>
                  <td className="col2">
                    {' '}
                    {facility &&
                    facility?.created_by &&
                    facility?.created_at ? (
                      <>
                        {formatUser(facility?.created_by)}
                        {formatDate(facility?.created_at)}
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
                    {facility &&
                    facility?.modified_at &&
                    facility?.modified_by ? (
                      <>
                        {formatUser(facility?.modified_by)}
                        {formatDate(facility?.modified_at)}
                      </>
                    ) : (
                      <>
                        {formatUser(facility?.created_by)}
                        {formatDate(facility?.created_at)}
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

export default FacilityView;
