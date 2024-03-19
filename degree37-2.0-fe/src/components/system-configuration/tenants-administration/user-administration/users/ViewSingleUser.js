import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import TopBar from '../../../../common/topbar/index';
import SvgComponent from '../../../../common/SvgComponent';
import styles from './index.module.scss';
import unlock from '../../../../../assets/unlock.svg';
import i from '../../../../../assets/i-icon.svg';
import { formatUser } from '../../../../../helpers/formatUser';
import { formatDate } from '../../../../../helpers/formatDate';
import { UsersBreadCrumbsData } from '../UsersBreadCrumbsData';
import jwt from 'jwt-decode';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../enums/PermissionsEnum.js';
import axios from 'axios';

// const formatDate = (dateStr) => {
//   const date = new Date(dateStr);
//   const day = date.getDate();
//   const month = date.getMonth() + 1;
//   const year = date.getFullYear();
//   const hours = date.getHours();
//   const minutes = date.getMinutes();
//   const formattedHours = hours % 12 || 12;
//   const amPm = hours < 12 ? 'AM' : 'PM';
//   return `${month.toString().padStart(2, '0')} ${day
//     .toString()
//     .padStart(2, '0')} ${year} | ${formattedHours
//     .toString()
//     .padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${amPm}`;
// };

const ViewSingleUser = () => {
  const { id } = useParams();

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [userData, setUserData] = useState();
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const BreadcrumbsData = [
    ...UsersBreadCrumbsData,
    {
      label: 'Users',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/user-admin/users',
    },
    {
      label: 'View User',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/user-admin/users/${id}/view`,
    },
  ];

  useEffect(() => {
    fetchData(id);
  }, [id]);

  useEffect(() => {
    getLoginUserId();
  }, []);

  const getLoginUserId = () => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodedData = jwt(jwtToken);
      if (decodedData?.id) {
        setUserId(decodedData.id);
      }
    }
  };
  async function fetchData(id) {
    try {
      setIsLoading(true);
      const bearerToken = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/tenant-users/${id}`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });

      if (response.status === 200) {
        const data = response.data; // Extract the JSON data
        setUserData(data?.data); // Update state with the extracted data
      } else {
        toast.error('Error getting user details', { autoClose: 3000 });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error('An error occurred while fetching user details', {
        autoClose: 3000,
      });
    }
  }

  const handleAccount = async (confirmed) => {
    setShowAccountDialog(false);
    if (confirmed) {
      try {
        const bearerToken = localStorage.getItem('token');
        const response = await axios.patch(
          `${BASE_URL}/tenant-users/${id}`,
          { account_state: !userData?.account_state },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const data = response.data;
        if (data) {
          fetchData(id);
        }
      } catch (error) {
        toast.error('An error occurred while fetching user details', {
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Users'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        {CheckPermission([Permissions.USER_ADMINISTRATIONS.USERS.WRITE]) && (
          <div className="editAnchor">
            <Link
              to={`/system-configuration/tenant-admin/user-admin/users/${id}/edit`}
            >
              <SvgComponent name={'EditIcon'} />
              <span className={`${styles.edit}`}>Edit</span>
            </Link>
          </div>
        )}
        <section
          className={`popup full-section ${showAccountDialog ? 'active' : ''}`}
        >
          <div className="popup-inner">
            <div className="icon">
              <img src={unlock} alt="CancelIcon" />
            </div>
            <div className="content">
              <h3>Confirmation</h3>
              <p>
                Are you sure you want to{' '}
                {userData?.account_state ? 'lock' : 'unlock'}{' '}
                {userData?.first_name} account?
              </p>
              <div className="buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleAccount(false)}
                >
                  No
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAccount(true)}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </section>
        <div className="col-sm-12 col-md-12 col-l-6 col-xl-6">
          <table
            className={`viewTables ${styles.viewusertable} ${styles.tableBorder}`}
            style={{ overflow: 'visible' }}
          >
            <thead>
              <tr>
                <th colSpan="2" className="ps-30">
                  View User Details
                </th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <td className="col2 no-data text-center">Data Loading</td>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td className="col1 ps-30">First Name</td>
                  <td className="col2 ps-30">
                    {userData?.first_name ? userData?.first_name : 'N/A'}{' '}
                  </td>
                </tr>
                <tr>
                  <td className="col1 ps-30">Last Name</td>
                  <td className="col2 ps-30">
                    {userData?.last_name ? userData?.last_name : 'N/A'}{' '}
                  </td>
                </tr>
                <tr>
                  <td className="col1 ps-30">Work Email</td>
                  <td className="col2 ps-30">
                    {userData?.email ? userData?.email : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1 ps-30">Work Phone</td>
                  <td className="col2 ps-30">
                    {userData?.work_phone_number
                      ? userData?.work_phone_number
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1 ps-30">Mobile Phone</td>
                  <td className="col2 ps-30">
                    {userData?.mobile_number ? userData?.mobile_number : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1 ps-30">
                    <span className={`${styles.verticalAlign}`}>Manager </span>
                    <div className={`${styles.tooltip}`}>
                      <img src={i}></img>
                      <span className={`${styles.tooltipText}`}>
                        Managers are assigned to other users to manage requests
                        requiring approvals.
                      </span>
                    </div>
                  </td>
                  <td className="col2 ps-30">
                    {userData?.is_manager ? 'Yes' : 'No'}
                  </td>
                </tr>
                <tr>
                  <td className="col1 ps-30">Assigned Manager</td>
                  <td className="col2 ps-30">
                    {userData?.assigned_manager?.first_name
                      ? userData?.assigned_manager?.first_name
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1 ps-30">Organizational Level</td>
                  <td className="col2 ps-30">
                    {userData?.hierarchy_level?.name
                      ? userData?.hierarchy_level?.name
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1 ps-30">Business Units</td>
                  <td className="col2 ps-30">
                    {userData?.business_units?.length
                      ? userData?.business_units
                          ?.map((bu) => bu?.business_unit_id?.name)
                          ?.join(', ')
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1 ps-30">Role</td>
                  <td className="col2 ps-30">
                    {userData?.role?.name ? userData?.role?.name : 'N/A'}{' '}
                  </td>
                </tr>
                <tr>
                  <td className="col1 ps-30">Account State</td>
                  <td
                    className={`${styles.max_width} px-3 col4 m-0 d-flex justify-content-between bg-white p-0`}
                  >
                    <p
                      className={`${styles.fit_content} ${
                        userData?.account_state ? 'text-primary' : 'text-danger'
                      } col2  w-25 mb-0`}
                    >
                      {userData?.account_state ? 'Unlocked' : 'Locked'}
                    </p>
                    {userId != id && (
                      <p
                        onClick={() => {
                          setShowAccountDialog(true);
                        }}
                        className={`${styles.fit_content} ${
                          userData?.account_state
                            ? 'text-danger'
                            : 'text-primary'
                        } mb-0  col2  text-end cursor-pointer`}
                      >
                        {userData?.account_state
                          ? 'Locked Account'
                          : 'Unlock Account'}
                      </p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="col1 ps-30">Privileges</td>
                  <td className={`col2 ps-30 pe-4 ${styles.word_break_none}`}>
                    {userData?.override
                      ? userData?.adjust_appointment_slots
                        ? 'Override'
                        : 'Override'
                      : ''}{' '}
                    {/* {userData?.adjust_appointment_slots
                    ? userData?.resource_sharing
                      ? 'Adjust Appointment Slots,'
                      : 'Adjust Appointment Slots'
                    : ''}{' '}
                  {userData?.resource_sharing
                    ? userData?.edit_locked_fields
                      ? 'Resource Sharing Access,'
                      : 'Resource Sharing Access'
                    : ''}{' '} */}
                    {/* {userData?.edit_locked_fields ? 'Edit Locked Fields' : ''}{' '} */}
                    {userData?.edit_locked_fields ||
                    userData?.resource_sharing ||
                    userData?.adjust_appointment_slots ||
                    userData?.override
                      ? ''
                      : 'N/A'}
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        <div className="col-sm-12 col-md-12 col-l-6 col-xl-6">
          <table
            className={`viewTables ${styles.viewusertable} ${styles.tableBorder}`}
          >
            <thead>
              <tr>
                <th colSpan="2">Insights </th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <td className="col2 text-center">Data Loading</td>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td className="col1 ps-30">Status</td>
                  <td className="col2 ps-30">
                    {userData?.is_active ? (
                      <span className="badge active"> Active </span>
                    ) : (
                      <span className="badge inactive"> Inactive </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="col1 ps-30">Created</td>
                  <td className="col2 ps-30">
                    {userData?.created_by
                      ? formatUser(userData?.created_by)
                      : 'N/A | '}
                    {userData?.created_at
                      ? formatDate(userData?.created_at)
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1 ps-30">Modified</td>
                  <td className="col2 ps-30">
                    {userData?.modified_by || userData?.created_by
                      ? formatUser(
                          userData?.modified_by
                            ? userData?.modified_by
                            : userData?.created_by
                        )
                      : 'N/A | '}
                    {userData?.modified_at || userData?.created_at
                      ? formatDate(
                          userData?.modified_at ?? userData?.created_at
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

export default ViewSingleUser;
