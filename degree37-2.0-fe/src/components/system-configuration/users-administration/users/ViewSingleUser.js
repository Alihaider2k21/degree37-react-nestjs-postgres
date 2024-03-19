import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../../common/topbar/index';
import SvgComponent from '../../../common/SvgComponent';
import styles from './index.module.scss';
import { formatUser } from '../../../../helpers/formatUser';
// import { formatDate } from '../../../../helpers/formatDate';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/PermissionsEnum';
import { formatDate } from '../../../../helpers/formatDate';

const formatDateDMY = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Month is 0-indexed, so we add 1 to get the correct month
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const ViewSingleUser = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const bearerToken = localStorage.getItem('token');

  useEffect(() => {
    const getData = async (id) => {
      if (id) {
        const result = await fetch(`${BASE_URL}/user/${id}`, {
          headers: { authorization: `Bearer ${bearerToken}` },
        });
        if (result?.status === 404) {
          return toast.error('User with this id does not exist', {
            autoClose: 3000,
          });
        }
        if (result?.status === 200) {
          let { data } = await result.json();
          setUserData({ ...data, role: data?.role?.name });
        } else {
          toast.error('Error Fetching User Details', { autoClose: 3000 });
        }
      } else {
        toast.error('Error getting user Details', { autoClose: 3000 });
      }
    };

    if (id) {
      getData(id);
    }
  }, [id, BASE_URL, navigate]);

  const BreadcrumbsData = [
    { label: 'Dashboard', class: 'disable-label', link: '/dashboard' },
    {
      label: 'User Administration',
      class: 'active-label',
      link: '/system-configuration/platform-admin/user-administration/users',
    },
    {
      label: 'View User Details',
      class: 'active-label',
      link: `/system-configuration/platform-admin/user-administration/users/${id}`,
    },
  ];
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'User Administration'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />

      <div className="mainContentInner">
        {CheckPermission([
          Permissions.SYSTEM_CONFIGURATION.USER_ADMINISTRATION.WRITE,
        ]) && (
          <div className="editAnchor">
            <Link
              to={`/system-configuration/platform-admin/user-administration/users/${id}/edit`}
            >
              <SvgComponent name={'EditIcon'} /> Edit
            </Link>
          </div>
        )}
        <div className="col-sm-12 col-md-12 col-l-6 col-xl-6">
          <table className={`viewTables ${styles.viewusertable}`}>
            <thead>
              <tr>
                <th colSpan="2">User Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col1">First Name</td>
                <td className="col2"> {userData?.first_name} </td>
              </tr>
              <tr>
                <td className="col1">Last Name</td>
                <td className="col2"> {userData?.last_name} </td>
              </tr>
              <tr>
                <td className="col1">Unique Identifier</td>
                <td className="col2"> {userData?.unique_identifier} </td>
              </tr>
              <tr>
                <td className="col1">Email</td>
                <td className="col2"> {userData?.email} </td>
              </tr>
              <tr>
                <td className="col1">Date of Birth</td>
                <td className="col2">
                  {' '}
                  {formatDateDMY(userData?.date_of_birth) ?? ''}{' '}
                </td>
              </tr>
              <tr>
                <td className="col1">Gender</td>
                <td className="col2"> {userData?.gender} </td>
              </tr>
              <tr>
                <td className="col1">Home Phone Number</td>
                <td className="col2"> {userData?.home_phone_number} </td>
              </tr>
              <tr>
                <td className="col1">Work Phone Number</td>
                <td className="col2"> {userData?.work_phone_number} </td>
              </tr>
              <tr>
                <td className="col1">Work Phone Extension</td>
                <td className="col2"> {userData?.work_phone_extension} </td>
              </tr>

              <tr>
                <td className="col1">State</td>
                <td className="col2"> {userData?.state} </td>
              </tr>

              <tr>
                <td className="col1">Address Line 1</td>
                <td className="col2"> {userData?.address_line_1} </td>
              </tr>

              <tr>
                <td className="col1">Address Line 2</td>
                <td className="col2"> {userData?.address_line_2} </td>
              </tr>
              <tr>
                <td className="col1">Zip Code</td>
                <td className="col2"> {userData?.zip_code} </td>
              </tr>
              <tr>
                <td className="col1">City</td>
                <td className="col2"> {userData?.city} </td>
              </tr>

              <tr>
                <td className="col1">Admin Role</td>
                <td className="col2"> {userData?.role} </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-sm-12 col-md-12 col-l-6 col-xl-6">
          <table className={`viewTables ${styles.viewusertable}`}>
            <thead>
              <tr>
                <th colSpan="2">Insights </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col1">Status</td>
                <td className="col2">
                  {' '}
                  {userData?.is_active ? (
                    <span className="badge active"> Active </span>
                  ) : (
                    <span className="badge inactive"> Inactive </span>
                  )}{' '}
                </td>
              </tr>
              <tr>
                <td className="col1">Created</td>
                <td className="col2">
                  {userData && userData?.created_by && userData?.created_at ? (
                    <>
                      {formatUser(userData?.created_by)}
                      {formatDate(userData?.created_at)}
                    </>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
              <tr>
                <td className="col1">Modified</td>
                <td className="col2">
                  {formatUser(
                    userData?.modified_by
                      ? userData?.modified_by
                      : userData?.created_by
                  )}
                  {formatDate(
                    userData?.modified_at
                      ? userData?.modified_at
                      : userData?.created_at
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* </div> */}

        <div className="rightTables"></div>
      </div>
    </div>
  );
};

export default ViewSingleUser;
