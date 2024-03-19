import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../common/topbar/index';
import { USER_ROLES } from '../../../../routes/path';
import SvgComponent from '../../../common/SvgComponent';
import ConfirmArchiveIcon from '../../../../assets/images/ConfirmArchiveIcon.png';
import Pagination from '../../../common/pagination';
import { makeAuthorizedApiRequestAxios } from '../../../../helpers/Api';
import SelectDropdown from '../../../common/selectDropdown';
import SuccessPopUpModal from '../../../common/successModal';
import { UsersBreadCrumbsData } from '../../tenants-administration/user-administration/UsersBreadCrumbsData';
import CheckPermission from '../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../enums/PermissionsEnum.js';

const ListUserRole = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [userRoles, setUserRoles] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [archivePopup, setArchivePopup] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [roleId, setRoleId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const BreadcrumbsData = [
    ...UsersBreadCrumbsData,
    {
      label: 'User Roles',
      class: 'disable-label',
      link: USER_ROLES.LIST,
    },
  ];

  const getData = async () => {
    setIsLoading(true);
    const result = await makeAuthorizedApiRequestAxios(
      'GET',
      `${BASE_URL}/roles/tenant/list?search=${searchText}&page=${currentPage}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&isActive=${
        isActive?.value ?? ''
      }`
    );
    const data = result.data;
    const modifiedData = data?.data?.map((entry) => ({
      ...entry,
      role: {
        ...entry.role,
        name: entry.role.is_auto_created
          ? `${entry.role.name} (System Defined)`
          : entry.role.name,
      },
    }));
    setUserRoles(modifiedData);
    setIsLoading(false);
    setTotalRecords(data?.count);
  };

  useEffect(() => {
    getData();
  }, [currentPage, limit, BASE_URL, isActive, sortBy, sortOrder]);

  useEffect(() => {
    if (searchText.length >= 2 || searchText.length === 0) {
      setCurrentPage(1);
      getData();
    }
  }, [searchText]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortOrder('asc');
      } else {
        setSortOrder('asc');
        setSortBy('');
      }
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const archive = async () => {
    try {
      const res = await makeAuthorizedApiRequestAxios(
        'PATCH',
        `${BASE_URL}/roles/archive/${roleId}`,
        JSON.stringify({ is_archived: true })
      );
      let { data, status, response } = res.data;
      if (status === 'success') {
        setArchivePopup(false);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
        getData();
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const handleIsActive = (item) => {
    setIsActive(item);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'User Roles'}
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
                placeholder={'Status'}
                defaultValue={isActive}
                selectedValue={isActive}
                removeDivider
                showLabel
                onChange={handleIsActive}
                options={[
                  { label: 'Active', value: 'true' },
                  { label: 'Inactive', value: 'false' },
                ]}
              />
            </form>
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.USER_ADMINISTRATIONS.USER_ROLES.WRITE,
        ]) && (
          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate(USER_ROLES.CREATE);
              }}
            >
              Create User Role
            </button>
          </div>
        )}

        <div className="table-listing-main">
          <div className="table-responsive" style={{ overflow: 'auto' }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className="table-head">
                    Role Name
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head" style={{ width: '60%' }}>
                    Role Details
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('description')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="table-head">
                    Status
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('status')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className="align-center">
                    <div className="inliner justify-content-center">
                      <span className="title">Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="no-data" colSpan="10">
                      Data Loading
                    </td>
                  </tr>
                ) : userRoles?.length > 0 ? (
                  userRoles?.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.role.name}</td>
                        <td>{item.role.description}</td>
                        <td>
                          {item.role.is_active ? (
                            <span className="badge active">Active</span>
                          ) : (
                            <span className="badge inactive">InActive</span>
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
                            <ul className="dropdown-menu">
                              {CheckPermission([
                                Permissions.USER_ADMINISTRATIONS.USER_ROLES
                                  .READ,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={USER_ROLES.VIEW.replace(
                                      ':id',
                                      item.role.id
                                    )}
                                  >
                                    View
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.USER_ADMINISTRATIONS.USER_ROLES
                                  .WRITE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={USER_ROLES.EDIT.replace(
                                      ':id',
                                      item.role.id
                                    )}
                                  >
                                    Edit
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.USER_ADMINISTRATIONS.USER_ROLES
                                  .WRITE,
                              ]) && (
                                <li>
                                  <Link className="dropdown-item">
                                    Duplicate Role
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.USER_ADMINISTRATIONS.USER_ROLES
                                  .ARCHIVE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    onClick={() => {
                                      setRoleId(item.role.id);
                                      setArchivePopup(true);
                                    }}
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
                ) : (
                  <tr>
                    <td className="no-data" colSpan="10">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
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
        <SuccessPopUpModal
          title="Success!"
          message="Role is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
        />
        <section
          className={`popup full-section ${archivePopup ? 'active' : ''}`}
        >
          <div className="popup-inner">
            <div className="icon">
              <img src={ConfirmArchiveIcon} alt="CancelIcon" />
            </div>
            <div className="content">
              <h3>Confirmation</h3>
              <p>Are you sure you want to archive?</p>
              <div className="buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setArchivePopup(false);
                  }}
                >
                  No
                </button>
                <button className="btn btn-primary" onClick={() => archive()}>
                  Yes
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ListUserRole;
