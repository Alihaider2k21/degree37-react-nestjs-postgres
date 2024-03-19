import React, { useEffect, useState } from 'react';
// import { toast } from "react-toastify";
import { useParams, Link } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import { formatUser } from '../../../../../../helpers/formatUser';
import {
  SC_ORGANIZATIONAL_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../../../routes/path';
import { formatDate } from '../../../../../../helpers/formatDate';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import axios from 'axios';

const ViewBusinessUnit = () => {
  const { id } = useParams();
  // eslint-disable-next-line
  const [orgData, setOrgData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  // const navigate = useNavigate();
  const bearerToken = localStorage.getItem('token');
  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id, BASE_URL]);

  const loadData = async (id) => {
    setIsLoading(true);
    const response = await axios.get(`${BASE_URL}/business_units/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });

    const statusCode = response.status;
    const data = response.data;
    if (statusCode === 200) {
      setOrgData(data);
    }
    setIsLoading(false);
  };

  // const handleRedirect = () => {
  //   navigate(`${BUSINESS_UNIT_PATH.EDIT.replace(':id',id)}`)
  // }

  const BreadcrumbsData = [
    {
      label: 'System Configurations',
      class: 'disable-label',
      link: SYSTEM_CONFIGURATION_PATH,
    },
    {
      label: 'Organizational Administration',
      class: 'disable-label',
      link: SC_ORGANIZATIONAL_ADMINISTRATION_PATH,
    },
    {
      label: 'Hierarchy',
      class: 'disable-label',
      link: '/system-configuration/organizational-levels',
    },
    {
      label: 'Business Units',
      class: 'disable-label',
      link: '/system-configuration/hierarchy/business-units',
    },
    {
      label: 'View',
      class: 'active-label',
      link: `/system-configuration/hierarchy/business-units/view/${id}`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Business Units'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.ORGANIZATIONAL_ADMINISTRATION.HIERARCHY.BUSINESS_UNITS
            .WRITE,
        ]) && (
          <div
            className="d-flex justify-content-end align-items-center"
            style={{ width: '100%' }}
          >
            <Link to={`/system-configuration/business-unit/edit/${id}`}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_9340_8863)">
                  <path
                    d="M19 20H5C4.73478 20 4.48043 20.1054 4.29289 20.2929C4.10536 20.4804 4 20.7348 4 21C4 21.2652 4.10536 21.5196 4.29289 21.7071C4.48043 21.8946 4.73478 22 5 22H19C19.2652 22 19.5196 21.8946 19.7071 21.7071C19.8946 21.5196 20 21.2652 20 21C20 20.7348 19.8946 20.4804 19.7071 20.2929C19.5196 20.1054 19.2652 20 19 20Z"
                    fill="#387DE5"
                  ></path>
                  <path
                    d="M5.0003 17.9999H5.0903L9.2603 17.6199C9.71709 17.5744 10.1443 17.3731 10.4703 17.0499L19.4703 8.04986C19.8196 7.68083 20.0084 7.18837 19.9953 6.68039C19.9822 6.17242 19.7682 5.69037 19.4003 5.33986L16.6603 2.59986C16.3027 2.26395 15.8341 2.07122 15.3436 2.05831C14.8532 2.0454 14.3751 2.21323 14.0003 2.52986L5.0003 11.5299C4.67706 11.8558 4.4758 12.2831 4.4303 12.7399L4.0003 16.9099C3.98683 17.0563 4.00583 17.204 4.05596 17.3422C4.10608 17.4805 4.1861 17.606 4.2903 17.7099C4.38374 17.8025 4.49455 17.8759 4.61639 17.9256C4.73823 17.9754 4.86869 18.0006 5.0003 17.9999ZM15.2703 3.99986L18.0003 6.72986L16.0003 8.67986L13.3203 5.99986L15.2703 3.99986ZM6.3703 12.9099L12.0003 7.31986L14.7003 10.0199L9.1003 15.6199L6.1003 15.8999L6.3703 12.9099Z"
                    fill="#387DE5"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_9340_8863">
                    <rect width="24" height="24" fill="white"></rect>
                  </clipPath>
                </defs>
              </svg>
              <span style={{ fontSize: '20px' }}>Edit</span>
            </Link>
          </div>
        )}
        <div className="row">
          <div className="col-md-6">
            <div className="tablesContainer">
              <div className="leftTables">
                <table className="viewTables">
                  <thead>
                    <tr>
                      <th colSpan="2">Details</th>
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
                        <td className="col2">{orgData?.name || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="col1">Parent</td>
                        <td className="col2">
                          {orgData?.parent_level?.name || 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td className="col1">Organizational Level</td>
                        <td className="col2">
                          {orgData?.organizational_level_id?.name || 'N/A'}
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
                          {orgData?.is_active ? (
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
                          {orgData &&
                          orgData?.created_by &&
                          orgData?.created_at ? (
                            <>
                              {formatUser(orgData?.created_by)}
                              {formatDate(orgData?.created_at)}
                            </>
                          ) : (
                            ''
                          )}{' '}
                        </td>
                      </tr>

                      <tr>
                        <td className="col1">Modified</td>
                        <td className="col2">
                          {' '}
                          <>
                            {formatUser(
                              orgData?.modified_by
                                ? orgData?.modified_by
                                : orgData?.created_by
                            )}
                            {formatDate(
                              orgData?.modified_at
                                ? orgData?.modified_at
                                : orgData?.created_at
                            )}
                          </>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-6"></div>
        </div>
      </div>
    </div>
  );
};

export default ViewBusinessUnit;
