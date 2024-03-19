import React, { useEffect, useState } from 'react';
import TopBar from '../../../../common/topbar/index';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import SvgComponent from '../../../../common/SvgComponent';
import styles from './index.module.scss';
import { formatUser } from '../../../../../helpers/formatUser';
// import { formatDate } from '../../../../../helpers/formatDate';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import axios from 'axios';
import { formatDate } from '../../../../../helpers/formatDate';

const humanize = (str) => {
  if (str.includes('bbcs_client_evironment')) {
    return 'BBCS Client Environment';
  }
  if (str.includes('google_api')) {
    return 'Google API';
  }
  if (str.includes('daily_story_api')) {
    return 'Daily Story API';
  }
  if (str.includes('quick_pass_api')) {
    return 'Quick-Pass API';
  }
};

const ViewSingleTenant = () => {
  const { id } = useParams();
  const [tenantData, setTenantData] = useState({});
  const [applications, setApplications] = useState([]);
  const [selectedAppIds, setSelectedAppIds] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const accessToken = localStorage.getItem('token');

  useEffect(() => {
    const getData = async (id) => {
      if (id) {
        const result = await axios.get(`${BASE_URL}/tenants/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        let { data, status_code } = await result.data;
        if (status_code === 200) {
          setTenantData(data);
          setSelectedAppIds(data?.applications?.map((app) => app?.id));
          // toast.success("Tenant Fetched Succesfully", { autoClose: 3000 });
        } else {
          toast.error('Error Fetching Tenant Details', { autoClose: 3000 });
        }
      } else {
        toast.error('Error getting Tenant Details', { autoClose: 3000 });
      }
    };
    if (id) {
      getData(id);
    }
  }, [id, BASE_URL]);

  useEffect(() => {
    const getApplications = async () => {
      const result = await axios.get(`${BASE_URL}/application`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data } = await result.data;
      const uniqueNamesSet = new Set();
      const uniqueApplications = data.filter((app) => {
        if (!uniqueNamesSet.has(app?.name)) {
          uniqueNamesSet.add(app?.name);
          return true;
        }
        return false;
      });

      setApplications(uniqueApplications);
    };
    getApplications();
  }, []);

  const BreadcrumbsData = [
    { label: 'Dashboard', class: 'disable-label', link: '/dashboard' },
    {
      label: 'Tenant Management',
      class: 'active-label',
      link: '/system-configuration/platform-admin/tenant-management',
    },
    {
      label: 'View Tenant Details',
      class: 'active-label',
      link: `/system-configuration/platform-admin/tenant-management/${id}/view`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Tenant Management'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />

      <div className="mainContentInner">
        {CheckPermission([
          Permissions.SYSTEM_CONFIGURATION.TENANT_MANAGEMENT.WRITE,
        ]) && (
          <div className="editAnchor">
            <Link
              to={`/system-configuration/platform-admin/tenant-management/${id}/edit`}
            >
              <SvgComponent name={'EditIcon'} /> Edit
            </Link>
          </div>
        )}

        <div className="tablesContainer">
          <div className="leftTables">
            <table className="viewTables">
              <thead>
                <tr>
                  <th colSpan="2">Tenant Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="col1">Tenant Name</td>
                  <td className="col2"> {tenantData?.tenant_name} </td>
                </tr>
                <tr>
                  <td className="col1">Tenant Domain</td>
                  <td className="col2"> {tenantData?.tenant_domain} </td>
                </tr>
                <tr>
                  <td className="col1">Admin Domain</td>
                  <td className="col2"> {tenantData?.admin_domain} </td>
                </tr>
                <tr>
                  <td className="col1">Email</td>
                  <td className="col2"> {tenantData?.email} </td>
                </tr>
                <tr>
                  <td className="col1">Tenant Code</td>
                  <td className="col2"> {tenantData?.tenant_code} </td>
                </tr>
                <tr>
                  <td className="col1">Phone Number</td>
                  <td className="col2"> {tenantData?.phone_number} </td>
                </tr>
                {tenantData?.addresses?.length
                  ? tenantData?.addresses?.map((address, key) => {
                      return (
                        <>
                          <tr key={key}>
                            <td className="col1">Address Line 1</td>
                            <td className="col2"> {address?.address1} </td>
                          </tr>

                          <tr key={key}>
                            <td className="col1">Address Line 2</td>
                            <td className="col2"> {address?.address2} </td>
                          </tr>

                          <tr key={key}>
                            <td className="col1">Zip Code</td>
                            <td className="col2"> {address?.zip_code} </td>
                          </tr>

                          <tr>
                            <td className="col1">City</td>
                            <td className="col2"> {address?.city} </td>
                          </tr>

                          <tr>
                            <td className="col1">State</td>
                            <td className="col2"> {address?.state} </td>
                          </tr>
                        </>
                      );
                    })
                  : ''}

                <tr>
                  <td className="col1">Time Zones</td>
                  <td className="col2"> {tenantData?.tenant_timezone} </td>
                </tr>
              </tbody>
            </table>

            <table className="viewTables">
              <thead>
                <tr>
                  <th colSpan="2">Configuration Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="col1">Tenant</td>
                  <td className="col2"> {tenantData?.tenant_name} </td>
                </tr>

                {tenantData?.configuration_detail?.length
                  ? tenantData?.configuration_detail?.map(
                      (configuration, key) => {
                        return (
                          <>
                            <tr key={key}>
                              <td
                                colSpan="2"
                                className="col2 carbon-color  fw-medium "
                              >
                                {humanize(configuration.element_name)}
                              </td>
                            </tr>

                            <tr key={key}>
                              <td className="col1">End Point URL</td>
                              <td className="col2">
                                {configuration?.end_point_url}
                              </td>
                            </tr>
                            <tr key={key}>
                              <td className="col1">Secret Value</td>
                              <td className="col2">
                                {configuration?.secret_value}
                              </td>
                            </tr>

                            <tr key={key}>
                              <td className="col1">Secret Key</td>
                              <td className="col2">
                                {configuration?.secret_key}
                              </td>
                            </tr>
                          </>
                        );
                      }
                    )
                  : ''}
              </tbody>
            </table>

            <table className="viewTables">
              <thead>
                <tr>
                  <th colSpan="2">Insights </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="col1">Status</td>
                  <td className="col2">
                    {tenantData?.is_active ? (
                      <span className="badge active"> Active </span>
                    ) : (
                      <span className="badge inactive"> Inactive </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Email</td>
                  <td className="col2">
                    {tenantData?.allow_email
                      ? 'Can Receive Email'
                      : "Can't Receive Email"}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Created</td>
                  <td className="col2">
                    {tenantData?.created_at && tenantData?.created_by ? (
                      <>
                        {formatUser(tenantData?.created_by)}{' '}
                        {formatDate(tenantData?.created_at)}
                      </>
                    ) : null}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Modified</td>
                  <td className="col2">
                    {formatUser(
                      tenantData?.modified_by ?? tenantData?.created_by
                    )}{' '}
                    {formatDate(
                      tenantData?.modified_at ?? tenantData?.created_at
                    )}{' '}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="rightTables">
            <table className="viewTables">
              <thead>
                <tr>
                  <th colSpan="2">Product Licensing </th>
                </tr>
              </thead>
              <tbody>
                {applications?.length &&
                  applications?.map((app, index) => {
                    if (index % 2 === 0) {
                      return (
                        <tr key={index}>
                          <td className="col2 check-box">
                            <div className="d-flex">
                              <label className={`${styles.checkbox_labe}`}>
                                <input
                                  type="checkbox"
                                  checked={selectedAppIds.includes(app.id)}
                                />
                                <span
                                  className={`${styles.checkbox_custom}`}
                                ></span>
                              </label>
                              <small>
                                {app?.name === 'CRM'
                                  ? 'Client Relationship Manager - CRM'
                                  : app?.name}
                              </small>
                            </div>
                          </td>
                          {applications[index + 1] && (
                            <td className="col2 check-box">
                              <div className="d-flex">
                                <label className={`${styles.checkbox_labe}`}>
                                  <input
                                    type="checkbox"
                                    checked={selectedAppIds.includes(
                                      applications[index + 1].id
                                    )}
                                  />
                                  <span
                                    className={`${styles.checkbox_custom}`}
                                  ></span>
                                </label>
                                <small>
                                  {applications[index + 1]?.name === 'CRM'
                                    ? 'Client Relationship Manager - CRM'
                                    : applications[index + 1]?.name}
                                </small>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    }
                    return null;
                  })}
                {/* <tr>
                  <td className="col2 check-box">
                    <div className="d-flex">
                      <label className={`${styles.checkbox_labe}`}>
                        <input type="checkbox" checked />
                        <span className={`${styles.checkbox_custom}`}></span>
                      </label>
                      <small>System Configuration</small>
                    </div>
                  </td>
                  <td className="col2 check-box">
                    <div className="d-flex">
                      <label className={`${styles.checkbox_labe}`}>
                        <input type="checkbox" checked />
                        <span className={`${styles.checkbox_custom}`}></span>
                      </label>
                      <small>Client Relationship Manager - CRM</small>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="col2 check-box">
                    <div className="d-flex">
                      <label className={`${styles.checkbox_labe}`}>
                        <input type="checkbox" checked />
                        <span className={`${styles.checkbox_custom}`}></span>
                      </label>
                      <small>Flow</small>
                    </div>
                  </td>
                  <td className="col2 check-box">
                    <div className="d-flex">
                      <label className={`${styles.checkbox_labe}`}>
                        <input type="checkbox" checked />
                        <span className={`${styles.checkbox_custom}`}></span>
                      </label>
                      <small>Call Center Manager</small>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="col2 check-box">
                    <div className="d-flex">
                      <label className={`${styles.checkbox_labe}`}>
                        <input type="checkbox" checked />
                        <span className={`${styles.checkbox_custom}`}></span>
                      </label>
                      <small>Operations Center</small>
                    </div>
                  </td>
                  <td className="col2 check-box">
                    <div className="d-flex">
                      <label className={`${styles.checkbox_labe}`}>
                        <input type="checkbox" checked />
                        <span className={`${styles.checkbox_custom}`}></span>
                      </label>
                      <small>Staffing Management</small>
                    </div>
                  </td>
                </tr> */}
                {/* <tr>

                  <td className="col2 check-box">
                    <small> </small>
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSingleTenant;
