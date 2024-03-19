import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../common/topbar/index';
import Pagination from '../../../common/pagination';
import SvgComponent from '../../../common/SvgComponent';
import style from './index.module.scss';
import SuccessPopUpModal from '../../../common/successModal';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/PermissionsEnum';
import SelectDropdown from '../../../common/selectDropdown';
import axios from 'axios';

const BreadcrumbsData = [
  { label: 'System Configurations', class: 'disable-label', link: '/' },
  {
    label: 'User Administration',
    class: 'active-label',
    link: '/system-configuration/platform-admin/user-administration/users',
  },
];

const UsersList = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const navigate = useNavigate();
  const [modalPopUp, setModalPopUp] = useState(false);
  const [userToArchive, setUserToArchive] = useState(null);
  const [updatedById, setUpdatedById] = useState();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [notFoundText, setNotFoundText] = useState(false);
  const bearerToken = localStorage.getItem('token');
  const [tenants, setTenants] = useState([]);
  const [tenantSelected, setTenantSelected] = useState(null);

  useEffect(() => {
    getTenants();
  }, [users]);

  const getTenants = async () => {
    const response = await axios.get(`${BASE_URL}/tenants`, {
      params: {
        limit: limit,
        page: currentPage,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    const data = await response.data;
    setTenants(data?.data);
  };

  const handleAddClick = () => {
    navigate(
      '/system-configuration/platform-admin/user-administration/users/create'
    );
  };
  const getData = async () => {
    let result;
    if (tenantSelected) {
      result = await fetch(
        `${BASE_URL}/tenant-users?limit=${limit}&page=${currentPage}&tenant_id=${tenantSelected.value}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
    } else {
      result = await fetch(
        `${BASE_URL}/user?limit=${limit}&page=${currentPage}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
    }

    const data = await result.json();
    setUsers(data?.data);
    setTotalRecords(data?.total_records);
  };
  useEffect(() => {
    const handleSearchChange = async (e) => {
      try {
        const result = await fetch(
          `${BASE_URL}/user?limit=${limit}&page=${currentPage}&keyword=${searchText}`,
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
            method: 'GET',
          }
        );
        const data = await result.json();
        setUsers(data?.data);
        if (data?.data?.length === 0) setNotFoundText(true);
        else setNotFoundText(false);
        setTotalRecords(data?.total_records);
      } catch (error) {
        console.error('Error searching data:', error);
      }
    };

    if (!searchText) {
      getData(limit, currentPage);
    }
    if (searchText?.length > 1) {
      handleSearchChange(searchText);
    }
    if (searchText.length === 1) {
      setCurrentPage(1);
    }
  }, [currentPage, limit, searchText, BASE_URL, tenantSelected]);

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setUpdatedById(decodeToken?.id);
      }
    }
  }, []);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortBy('');
        setSortOrder('');
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedUsers = useMemo(() => {
    const sorted = [...users];

    if (sortBy && sortOrder) {
      sorted.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (aValue < bValue) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [users, sortBy, sortOrder]);

  const handleConfirmArchive = async () => {
    if (userToArchive) {
      const body = {
        is_archived: true,
        updated_by: updatedById,
      };
      const bearerToken = localStorage.getItem('token');
      const response = await fetch(
        `${BASE_URL}/user/archive/${userToArchive}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (response.status === 404) {
        toast.error('User not found.');
        return;
      }
      if (response.status === 204) {
        setModalPopUp(false);
        setShowSuccessMessage(true);
        getData(limit, currentPage);
        return;
      } else toast.error('Something went wrong.');
    }
    setModalPopUp(false);
  };
  const handleOpenConfirmation = (id) => {
    setUserToArchive(id);
    setModalPopUp(true);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'User Administration'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className="d-flex">
              <SelectDropdown
                placeholder={'Tenant'}
                defaultValue={tenantSelected}
                selectedValue={tenantSelected}
                removeDivider
                showLabel
                onChange={(val) => {
                  setTenantSelected(val);
                }}
                options={tenants.map((item) => {
                  return {
                    label: item.tenant_name,
                    value: item.id,
                  };
                })}
              />
            </form>
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.SYSTEM_CONFIGURATION.USER_ADMINISTRATION.WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Create User
            </button>
          </div>
        )}
        <div className="table-listing-main">
          <div className="table-responsive">
            <table className={`table table-stripped`}>
              <thead>
                <tr>
                  <th>
                    First Name
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('first_name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th>
                    Last Name
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('last_name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th>
                    Unique Id
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('unique_identifier')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th>
                    Email Address
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('email')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th>
                    Role Name
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('role')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th>
                    Home Phone
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('home_phone_number')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th>
                    Work Phone
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('work_phone_number')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="10%">
                    Status
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('is_active')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="15%" align="center">
                    <div className="inliner justify-content-center">
                      <span className="title">Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers?.length > 0 ? (
                  sortedUsers?.map((user) => {
                    return (
                      <tr key={user.id}>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.unique_identifier}</td>
                        <td
                          style={{
                            maxWidth: 180,
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-all',
                          }}
                        >
                          {user.email}
                        </td>
                        <td>{user?.role?.name ?? 'N/A'}</td>
                        <td>{user.home_phone_number}</td>
                        <td>{user.work_phone_number}</td>
                        <td>
                          {user.is_active ? (
                            <span className={`${style.badge} ${style.active}`}>
                              Active
                            </span>
                          ) : (
                            <span
                              className={`${style.badge} ${style.inactive}`}
                            >
                              InActive
                            </span>
                          )}
                        </td>
                        <td className="options">
                          <div className="dropdown-center">
                            <div
                              className="optionsIcon"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <SvgComponent name={'ThreeDots'} />
                            </div>
                            <ul className="dropdown-menu p-0">
                              {CheckPermission([
                                Permissions.SYSTEM_CONFIGURATION
                                  .USER_ADMINISTRATION.READ,
                                Permissions.SYSTEM_CONFIGURATION
                                  .USER_ADMINISTRATION.WRITE,
                              ]) &&
                                !tenantSelected && (
                                  <li>
                                    <Link
                                      className="dropdown-item"
                                      to={`/system-configuration/platform-admin/user-administration/users/${user.id}`}
                                    >
                                      View
                                    </Link>
                                  </li>
                                )}
                              {CheckPermission([
                                Permissions.SYSTEM_CONFIGURATION
                                  .USER_ADMINISTRATION.WRITE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`${
                                      tenantSelected
                                        ? `/system-configuration/platform-admin/user-administration/users/${user.id}/edit?tenant=true`
                                        : `/system-configuration/platform-admin/user-administration/users/${user.id}/edit`
                                    }  `}
                                  >
                                    {tenantSelected
                                      ? 'Assign Tenant Admin Role'
                                      : 'Edit'}
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.SYSTEM_CONFIGURATION
                                  .USER_ADMINISTRATION.UPDATE_PASSWORD,
                              ]) &&
                                !tenantSelected && (
                                  <li>
                                    <Link
                                      className="dropdown-item"
                                      to={`/system-configuration/platform-admin/user-administration/users/${user.id}/reset-password`}
                                    >
                                      Update Password
                                    </Link>
                                  </li>
                                )}
                              {CheckPermission([
                                Permissions.SYSTEM_CONFIGURATION
                                  .USER_ADMINISTRATION.ARCHIVE,
                              ]) &&
                                !tenantSelected && (
                                  <li>
                                    <Link
                                      className="dropdown-item"
                                      onClick={() =>
                                        handleOpenConfirmation(user?.id)
                                      }
                                    >
                                      Archive
                                    </Link>
                                  </li>
                                )}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : notFoundText ? (
                  <tr>
                    <td className="no-data" colSpan="9">
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  ''
                )}
              </tbody>
              <SuccessPopUpModal
                title="Confirmation"
                message={'Are you sure you want to archive?'}
                modalPopUp={modalPopUp}
                setModalPopUp={setModalPopUp}
                showActionBtns={false}
                isArchived={true}
                archived={handleConfirmArchive}
              />

              <SuccessPopUpModal
                title="Success!"
                message={'User is archived.'}
                modalPopUp={showSuccessMessage}
                showActionBtns={true}
                isArchived={false}
                setModalPopUp={setShowSuccessMessage}
              />
            </table>
          </div>
        </div>

        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
        />
      </div>
    </div>
  );
};

export default UsersList;
