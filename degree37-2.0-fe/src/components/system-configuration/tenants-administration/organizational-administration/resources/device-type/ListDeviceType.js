import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { Link, useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import SuccessPopUpModal from '../../../../../common/successModal';
import Pagination from '../../../../../common/pagination';
import SvgComponent from '../../../../../common/SvgComponent';
import { toast } from 'react-toastify';
import ResourceNavigationTabs from '../navigationTabs';
import SelectDropdown from '../../../../../common/selectDropdown';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ListDeviceType = () => {
  const bearerToken = localStorage.getItem('token');
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [getData, setGetData] = useState(false);
  const [deviceTypeData, setDeviceTypeData] = useState([]);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [modalPopUp, setModalPopUp] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [archiveId, setArchiveId] = useState();
  const [sortOrder, setSortOrder] = useState('desc');
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [isStatus, setIsStatus] = useState({ label: 'Active', value: 'true' });
  const [isLoading, setIsLoading] = useState(false);

  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'Device Type',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/organization-admin/resource/device-type',
    },
  ];

  const handleSearchChange = async (e) => {
    try {
      const result = await fetch(
        `${BASE_URL}/system-configuration/device-type?limit=${limit}&page=${currentPage}&name=${searchText}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = await result.json();
      setDeviceTypeData(data.data);
      setTotalRecords(data?.count);
    } catch (error) {
      toast.error(`Error:`, { autoClose: 3000 });
    }
  };

  if (searchText.length > 1) {
    handleSearchChange(searchText);
  }

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const deviceTypeUrl = `${BASE_URL}/system-configuration/device-type?limit=${limit}&page=${currentPage}${
        sortBy ? `&sortBy=${sortBy}&sortOrder=${sortOrder}` : ''
      }${isStatus ? `&status=${isStatus?.value ?? ''}` : ''}`;
      const result = await fetch(`${deviceTypeUrl}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      const data = await result.json();
      setDeviceTypeData(data?.data);
      setTotalRecords(data?.count);
      setIsLoading(false);
    };

    if (!searchText) {
      getData(limit, currentPage);
    }

    if (searchText.length === 1) {
      setCurrentPage(1);
    }
    return () => {
      setGetData(false);
    };
  }, [
    currentPage,
    limit,
    searchText,
    BASE_URL,
    isStatus,
    getData,
    sortBy,
    sortOrder,
  ]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleArchive = async () => {
    let archiveData = {
      id: archiveId, // device type id
      is_archive: true,
    };
    const bearerToken = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/system-configuration/device-type/archive`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(archiveData),
      }
    );
    let data = await response.json();
    if (data.status === 'success') {
      setModalPopUp(false);
      setTimeout(() => {
        setArchiveSuccess(true);
      }, 600);
    }
    setGetData(true);
    setModalPopUp(false);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortOrder('asc');
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortBy(column);
    }
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Device Type'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <ResourceNavigationTabs />
        <div className="filterInner">
          <h2>Filters</h2>

          <div className="filter">
            <form className="d-flex">
              <SelectDropdown
                placeholder={'Status'}
                defaultValue={isStatus}
                selectedValue={isStatus}
                removeDivider
                showLabel
                onChange={(value) => {
                  setCurrentPage(1);
                  setIsStatus(value);
                }}
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
          Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICE_TYPE.WRITE,
        ]) && (
          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate(
                  '/system-configuration/tenant-admin/organization-admin/resource/device-type/create'
                );
              }}
            >
              Create Device Type
            </button>
          </div>
        )}
        <div className="table-listing-main">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr className="border">
                  <th className={styles.tablepadding} height="72px" width="10%">
                    Name
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('name')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className={styles.tablepadding} height="72px" width="10%">
                    Description
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('description')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className={styles.tablepadding} height="72px" width="10%">
                    Procedure Type
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('procedure_type')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className={styles.tablepadding} height="72px" width="10%">
                    Status
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('status')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="10%">
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
                ) : deviceTypeData?.length ? (
                  deviceTypeData?.map((deviceType, index) => {
                    return (
                      <tr key={index}>
                        <td className={styles.tablepaddingbody} height="70px">
                          {deviceType?.name}
                        </td>
                        <td
                          className={`${styles.tablepaddingbody} ${styles.devicetypedes} d-flex flex-column justify-content-center`}
                          height="80px"
                        >
                          <p className="mb-0">{deviceType?.description}</p>
                        </td>
                        <td className={styles.tablepaddingbody} height="70px">
                          {deviceType?.procedure_type?.name}
                        </td>
                        <td className={styles.tablepaddingbody} height="70px">
                          {deviceType.status ? (
                            <span className="badge active">Active</span>
                          ) : (
                            <span className="badge inactive">InActive</span>
                          )}
                        </td>
                        <td
                          className={`${styles.tablepaddingbody} options`}
                          height="70px"
                        >
                          <div className="dropdown-center">
                            <div
                              className="optionsIcon"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              // style={{justifyContent:"start",position:"relative"}}
                            >
                              <SvgComponent name={'ThreeDots'} />
                            </div>
                            <ul className="dropdown-menu">
                              {CheckPermission([
                                Permissions.ORGANIZATIONAL_ADMINISTRATION
                                  .RESOURCES.DEVICE_TYPE.READ,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/system-configuration/tenant-admin/organization-admin/resource/device-type/${deviceType?.id}/view`}
                                  >
                                    View
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.ORGANIZATIONAL_ADMINISTRATION
                                  .RESOURCES.DEVICE_TYPE.WRITE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/system-configuration/tenant-admin/organization-admin/resource/device-type/${deviceType?.id}/edit`}
                                  >
                                    Edit
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.ORGANIZATIONAL_ADMINISTRATION
                                  .RESOURCES.DEVICE_TYPE.ARCHIVE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    onClick={() => {
                                      setModalPopUp(true);
                                      setIsArchived(true);
                                      setArchiveId(deviceType?.id);
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
                    <td colSpan="6" className="text-center">
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
      </div>
      <SuccessPopUpModal
        title={isArchived ? 'Confirmation' : 'Success!'}
        message={
          isArchived
            ? 'Are you sure you want to archive?'
            : 'Device Type updated.'
        }
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={isArchived ? false : true}
        isArchived={isArchived}
        archived={handleArchive}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Device Type is archived."
        modalPopUp={archiveSuccess}
        isNavigate={true}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resource/device-type'
        }
      />
    </div>
  );
};

export default ListDeviceType;
