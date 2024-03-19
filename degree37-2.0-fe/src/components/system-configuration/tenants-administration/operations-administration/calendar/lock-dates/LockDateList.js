import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../../../common/topbar/index';
import SvgComponent from '../../../../../common/SvgComponent';
import Pagination from '../../../../../common/pagination/index';
import { toast } from 'react-toastify';
import ArchivePopUpModal from '../../../../../common/successModal';
import CalendarNavigationTabs from '../navigationTabs';
import { groupBy, truncate } from 'lodash';
import moment from 'moment';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import SuccessPopUpModal from '../../../../../common/successModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import { CalendarBreadCrumbsData } from '../CalendarBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';

const LockDateList = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [lockDateId, setLockDateId] = useState(null);
  const [lockDates, setLockDates] = useState([]);
  const [lockDatesFilter, setLockDatesFilter] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [archivedStatus, setArchivedStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const BreadcrumbsData = [
    ...CalendarBreadCrumbsData,
    {
      label: 'Lock Dates',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/operations-admin/calendar/lock-dates',
    },
  ];

  const getLockDatesData = async () => {
    setIsLoading(true);
    let collectionOperationValues = '';
    if (collectionOperation?.length > 0)
      collectionOperationValues = collectionOperation
        ?.map((op) => op?.id)
        .join(',');
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/lock-dates?limit=${limit}&page=${currentPage}&title=${searchText}&collection_operation=${collectionOperationValues}&locked_dates=${
        lockDatesFilter?.value ?? ''
      }`
    );
    const data = await result.json();
    const lockDatesData = data?.data?.lockDates;
    const collectionOperationsData = groupBy(
      data?.data?.collectionOperations,
      (collectionOperation) => collectionOperation.lock_date_id.id
    );
    for (const lockDateData of lockDatesData) {
      lockDateData.collection_operations = collectionOperationsData[
        lockDateData.id
      ]
        ?.map((bco) => bco.collection_operation_id.name)
        .join(', ');
    }
    setLockDates(lockDatesData);
    setTotalRecords(data?.count);
    setIsLoading(false);
  };

  function compareNames(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  const getCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list?status=true`
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      const sortedData = data.sort(compareNames);
      let formatCollectionOperations = sortedData?.map((operation) => ({
        name: operation?.name,
        id: operation?.id,
      }));
      setCollectionOperationData([...formatCollectionOperations]);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  useEffect(() => {
    getLockDatesData();
    if (searchText.length === 1) {
      setCurrentPage(1);
    }
  }, [currentPage, limit, BASE_URL, collectionOperation, lockDatesFilter]);

  useEffect(() => {
    if (searchText.length > 1 || searchText.length === 0) getLockDatesData();
  }, [searchText]);

  useEffect(() => {
    getCollectionOperations();
  }, []);

  const searchFieldChange = (e) => {
    setCurrentPage(1);
    setSearchText(e.target.value);
  };

  const handleAddClick = () => {
    navigate(
      '/system-configuration/tenant-admin/operations-admin/calendar/lock-dates/create'
    );
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

  const sortedLockDates = useMemo(() => {
    if (!lockDates || !lockDates.length) return;
    const sorted = [...lockDates];

    if (sortBy && sortOrder) {
      sorted.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

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
  }, [lockDates, sortBy, sortOrder]);

  const archiveLockDate = async () => {
    try {
      const res = await makeAuthorizedApiRequest(
        'DELETE',
        `${BASE_URL}/lock-dates/${lockDateId}`
      );
      let { data, status, response } = await res.json();
      if (status === 'success') {
        // Handle successful response
        setModalPopUp(false);
        await getLockDatesData();
        setTimeout(() => {
          setArchivedStatus(true);
        }, 600);
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        // Handle bad request
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    } finally {
      setModalPopUp(false);
    }
  };

  const handleCollectionOperationChange = (collectionOperation) => {
    setCurrentPage(1);
    setCollectionOperation((prevSelected) =>
      prevSelected.some((item) => item.id === collectionOperation.id)
        ? prevSelected.filter((item) => item.id !== collectionOperation.id)
        : [...prevSelected, collectionOperation]
    );
  };

  const handleCollectionOperationChangeAll = (data) => {
    setCurrentPage(1);
    setCollectionOperation(data);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Lock Dates'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <CalendarNavigationTabs />
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter" style={{ width: '48%' }}>
            <form className="d-flex">
              <div className="form-field w-100 me-3">
                <SelectDropdown
                  placeholder={'Locked Dates'}
                  defaultValue={lockDatesFilter}
                  selectedValue={lockDatesFilter}
                  onChange={(val) => {
                    setCurrentPage(1);
                    setLockDatesFilter(val);
                  }}
                  removeDivider
                  showLabel
                  options={[
                    { label: 'Current', value: 'current' },
                    { label: 'Past', value: 'past' },
                  ]}
                />
              </div>
              <div className="form-field w-100">
                <GlobalMultiSelect
                  label="Collection Operation"
                  data={collectionOperationData}
                  selectedOptions={collectionOperation}
                  onChange={handleCollectionOperationChange}
                  onSelectAll={handleCollectionOperationChangeAll}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.LOCK_DATES.WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Create Lock Date
            </button>
          </div>
        )}

        <div className="table-listing-main">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th width="15%">
                    Title
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('title')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="30%">
                    Description
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('description')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="15%">
                    Start Date
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('start_date')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="15%">
                    End Date
                    <div
                      className="sort-icon"
                      onClick={() => handleSort('end_date')}
                    >
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th width="30%">Collection Operation</th>
                  <th width="5%" align="center">
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
                ) : sortedLockDates?.length ? (
                  sortedLockDates?.map((lockDate) => {
                    return (
                      <tr key={lockDate.id}>
                        <td>{lockDate.title}</td>
                        <td
                          data-toggle="tooltip"
                          data-placement="right"
                          title={lockDate.description}
                        >
                          {truncate(lockDate.description, { length: 80 })}
                        </td>
                        <td>
                          {moment(lockDate.start_date, 'YYYY-MM-DD').format(
                            'MM-DD-YYYY'
                          )}
                        </td>
                        <td>
                          {moment(lockDate.end_date, 'YYYY-MM-DD').format(
                            'MM-DD-YYYY'
                          )}
                        </td>
                        <td>{lockDate.collection_operations}</td>
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
                                Permissions.OPERATIONS_ADMINISTRATION.CALENDAR
                                  .LOCK_DATES.READ,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`${lockDate.id}/view`}
                                  >
                                    View
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.OPERATIONS_ADMINISTRATION.CALENDAR
                                  .LOCK_DATES.WRITE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`${lockDate.id}/edit`}
                                  >
                                    Edit
                                  </Link>
                                </li>
                              )}
                              {CheckPermission([
                                Permissions.OPERATIONS_ADMINISTRATION.CALENDAR
                                  .LOCK_DATES.ARCHIVE,
                              ]) && (
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    onClick={() => {
                                      setLockDateId(lockDate.id);
                                      setModalPopUp(true);
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

        <ArchivePopUpModal
          title={'Confirmation'}
          message={'Are you sure you want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={true}
          archived={archiveLockDate}
          isNavigate={false}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Lock Date is archived."
          modalPopUp={archivedStatus}
          isNavigate={true}
          setModalPopUp={setArchivedStatus}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/operations-admin/calendar/lock-dates'
          }
        />
      </div>
    </div>
  );
};

export default LockDateList;
