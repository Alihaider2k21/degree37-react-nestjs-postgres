import React, { useEffect, useMemo, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';
import Pagination from '../../../../../common/pagination';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import {
  BUSINESS_UNIT_PATH,
  SC_ORGANIZATIONAL_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../../../routes/path';
import SelectDropdown from '../../../../../common/selectDropdown';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import axios from 'axios';

const ListOrganizationalLevels = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const currentLocation = location.pathname;
  const [organizationalLevels, setOrganizationalLevels] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [parentLevels, setParentLevels] = useState([]);
  const [selectedParentLevel, setSelectedParentLevel] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({
    label: 'Active',
    value: 'true',
  });
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [levelToArchive, setLevelToArchive] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const bearerToken = localStorage.getItem('token');

  const handleOpenConfirmation = async (id) => {
    try {
      let url = `${BASE_URL}/organizational_levels?parent_level_id=${id}`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      const olData = response.data;
      url = `${BASE_URL}/business_units?organizational_level_id=${id}`;
      const result = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      const buData = result.data;
      if (!olData?.data?.length && !buData?.data?.length) {
        setLevelToArchive(id);
        setModalPopUp(true);
      } else {
        toast.error(
          'Impossible to archive this organization level because it is referenced. Please remove all its references.',
          {
            autoClose: 3000,
          }
        );
      }
    } catch (error) {
      toast.error('Failed to archive organizational level.', {
        autoClose: 3000,
      });
    }
  };

  const handleConfirmArchive = async () => {
    if (levelToArchive) {
      const body = {
        is_archived: true,
      };
      const response = await axios.patch(
        `${BASE_URL}/organizational_levels/archive/${levelToArchive}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      const data = response.data;
      if (data?.status === 'success') {
        setModalPopUp(false);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
        organizationalLevels?.length === 1 && currentPage > 1
          ? setCurrentPage(currentPage - 1)
          : fetchOrganizationalLevels();
        fetchParentLevels();
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      }
    }
    setModalPopUp(false);
  };

  useEffect(() => {
    fetchOrganizationalLevels();
    if (parentLevels?.length === 0) {
      fetchParentLevels();
    }
  }, [currentPage, limit, searchText, selectedParentLevel, selectedStatus]);

  const fetchOrganizationalLevels = async () => {
    try {
      setIsLoading(true);
      let url = `${BASE_URL}/organizational_levels?limit=${limit}&page=${currentPage}`;

      if (searchText) {
        url += `&keyword=${searchText}`;
      }

      if (selectedParentLevel) {
        url += `&parent_level_id=${selectedParentLevel?.value}`;
      }

      if (selectedStatus !== '') {
        url += `&status=${selectedStatus?.value ?? ''}`;
      }

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });

      const data = response.data;
      const levels = data?.data.map((data) => {
        return {
          ...data,
          parent_level_name: data.parent_level?.name,
          status: data.is_active ? 'Active' : 'Inactive',
        };
      });
      setOrganizationalLevels(levels);
      setTotalRecords(data?.total_records);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to fetch organizational levels.', {
        autoClose: 3000,
      });
    }
  };

  const fetchParentLevels = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/organizational_levels`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      console.log(response);
      const data = await response.data;
      setParentLevels(data?.data);
    } catch (error) {
      toast.error('Failed to fetch parent levels.', { autoClose: 3000 });
    }
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

  const sortedOrganizationalLevels = useMemo(() => {
    const sorted = [...organizationalLevels];

    if (sortBy && sortOrder) {
      sorted.sort((a, b) => {
        const aValue = a[sortBy]?.toLowerCase();
        const bValue = b[sortBy]?.toLowerCase();

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
  }, [organizationalLevels, sortBy, sortOrder]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

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
      label: 'Organizational Levels',
      class: 'active-label',
      link: '/system-configuration/organizational-levels',
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Organizational Levels'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <div className="tabs">
          <ul>
            {CheckPermission(null, [
              Permissions.ORGANIZATIONAL_ADMINISTRATION.HIERARCHY
                .ORGANIZATIONAL_LEVELS.MODULE_CODE,
            ]) && (
              <li>
                <Link
                  to={'/system-configuration/organizational-levels'}
                  className={
                    currentLocation ===
                    '/system-configuration/organizational-levels'
                      ? 'active'
                      : ''
                  }
                >
                  Organizational Levels
                </Link>
              </li>
            )}
            {CheckPermission(null, [
              Permissions.ORGANIZATIONAL_ADMINISTRATION.HIERARCHY.BUSINESS_UNITS
                .MODULE_CODE,
            ]) && (
              <li>
                <Link
                  to={BUSINESS_UNIT_PATH.LIST}
                  className={
                    currentLocation === BUSINESS_UNIT_PATH.LIST ? 'active' : ''
                  }
                >
                  Business Units
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <div className="filter">
              <form className="d-flex gap-3">
                <SelectDropdown
                  placeholder={'Parent Level'}
                  defaultValue={selectedParentLevel}
                  selectedValue={selectedParentLevel}
                  removeDivider
                  showLabel
                  onChange={(val) => {
                    setCurrentPage(1);
                    setSelectedParentLevel(val ?? null);
                  }}
                  options={parentLevels.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                    };
                  })}
                />
                <SelectDropdown
                  placeholder={'Status'}
                  defaultValue={selectedStatus}
                  selectedValue={selectedStatus}
                  removeDivider
                  showLabel
                  onChange={(value) => {
                    setCurrentPage(1);
                    setSelectedStatus(value);
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
      </div>
      <div className="mainContentInner">
        <div className="buttons">
          {CheckPermission([
            Permissions.ORGANIZATIONAL_ADMINISTRATION.HIERARCHY
              .ORGANIZATIONAL_LEVELS.WRITE,
          ]) && (
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate('/system-configuration/organizational-levels/create');
              }}
            >
              Create Organizational Level
            </button>
          )}
        </div>
        <div className="table-listing-main">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th width="15%" align="center">
                    <div className="inliner">
                      <span className="title">Name</span>
                      <div
                        className="sort-icon"
                        onClick={() => handleSort('name')}
                      >
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>
                  <th width="25%" align="center">
                    <div className="inliner">
                      <span className="title">Description</span>
                      <div
                        className="sort-icon"
                        onClick={() => handleSort('description')}
                      >
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>
                  <th width="15%" align="center">
                    <div className="inliner">
                      <span className="title">Short Label</span>
                      <div
                        className="sort-icon"
                        onClick={() => handleSort('short_label')}
                      >
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>
                  <th width="15%" align="center">
                    <div className="inliner">
                      <span className="title">Parent Level</span>
                      <div
                        className="sort-icon"
                        onClick={() => handleSort('parent_level_name')}
                      >
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>
                  <th width="15%" align="center">
                    <div className="inliner">
                      <span className="title">Status</span>
                      <div
                        className="sort-icon"
                        onClick={() => handleSort('status')}
                      >
                        <SvgComponent name={'SortIcon'} />
                      </div>
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
                {isLoading ? (
                  <tr>
                    <td className="no-data" colSpan="10">
                      Data Loading
                    </td>
                  </tr>
                ) : sortedOrganizationalLevels?.length ? (
                  sortedOrganizationalLevels?.map((level) => {
                    return (
                      <tr key={level.id}>
                        <td>{level.name}</td>
                        <td>
                          {level.description?.length > 70
                            ? `${level.description.substring(0, 70)} ...`
                            : level.description}
                        </td>
                        <td>{level.short_label}</td>
                        <td>{level.parent_level_name}</td>
                        <td>
                          {level.is_active ? (
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
                              // style={{justifyContent:"start",position:"relative"}}
                            >
                              <SvgComponent name={'ThreeDots'} />
                            </div>
                            <ul className="dropdown-menu">
                              {CheckPermission([
                                Permissions.ORGANIZATIONAL_ADMINISTRATION
                                  .HIERARCHY.ORGANIZATIONAL_LEVELS.READ,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/system-configuration/organizational-levels/${level.id}`}
                                  >
                                    View
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.ORGANIZATIONAL_ADMINISTRATION
                                  .HIERARCHY.ORGANIZATIONAL_LEVELS.WRITE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/system-configuration/organizational-levels/${level.id}/edit`}
                                  >
                                    Edit
                                  </Link>
                                </li>
                              )}
                              {level?.is_collection_operation === false &&
                                CheckPermission([
                                  Permissions.ORGANIZATIONAL_ADMINISTRATION
                                    .HIERARCHY.ORGANIZATIONAL_LEVELS.ARCHIVE,
                                ]) && (
                                  <li>
                                    <Link
                                      className="dropdown-item"
                                      to={`#`}
                                      onClick={() =>
                                        handleOpenConfirmation(level.id)
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
          message="Organizational Level is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
        />
      </div>
    </div>
  );
};

export default ListOrganizationalLevels;
