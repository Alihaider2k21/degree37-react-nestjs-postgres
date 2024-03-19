import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import Pagination from '../../../../../common/pagination';
import DailyHourListTable from './dailyHourListTable';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import { toast } from 'react-toastify';
import SelectDropdown from '../../../../../common/selectDropdown';
import { BookingDrivesBreadCrumbsData } from '../BookingDrivesBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';

const DailyHourList = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const [dailyCapacities, setDailyCapacities] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [collectionOperations, setCollectionOperations] = useState([]);
  const [display, setDisplay] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const currentLocation = location.pathname;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [sortOrder, setSortOrder] = useState('');
  const [sortName, setSortName] = useState('');
  useEffect(() => {
    getCollectionOperations();
  }, []);

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
      setCollectionOperationData(sortedData);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        let url = `${BASE_URL}/booking-drive/daily-hour?limit=${limit}&page=${currentPage}&collectionOperation=${
          collectionOperations?.map((e) => e.id).join(',') ?? ''
        }&display=${display?.value ?? ''}`;
        if (sortOrder.length > 0) {
          url += `&sortOrder=${sortOrder}`;
        }

        if (sortName.length > 0) {
          url += `&sortBy=${sortName}`;
        }
        const result = await makeAuthorizedApiRequest('GET', url);
        const data = await result.json();
        setDailyCapacities(data?.data);
        setTotalRecords(data?.count);
        setRefresh(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleSearchChange = async (e) => {
      setIsLoading(true);

      try {
        let url = `${BASE_URL}/booking-drive/daily-hour?limit=${limit}&page=${currentPage}&display=${
          display?.value ?? ''
        }&keyword=${e}`;
        if (sortOrder.length > 0) {
          url += `&sortOrder=${sortOrder}`;
        }

        if (sortName.length > 0) {
          url += `&sortBy=${sortName}`;
        }
        const result = await makeAuthorizedApiRequest('GET', url);
        const data = await result.json();
        setDailyCapacities(data.data);
        setTotalRecords(data?.count);
      } catch (error) {
        console.error('Error searching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchText.length === 0) {
      getData(limit, currentPage);
    }

    if (searchText.length >= 2) {
      handleSearchChange(searchText);
    }
    if (!searchText) {
      getData(limit, currentPage);
    }
  }, [
    currentPage,
    limit,
    searchText,
    BASE_URL,
    collectionOperations,
    display,
    refresh,
    sortName,
    sortOrder,
  ]);
  const searchFieldChange = (e) => {
    setCurrentPage(1);
    setSearchText(e.target.value);
  };

  const handleCollectionSelect = (appliesTo) => {
    setCollectionOperations((prevSelected) =>
      prevSelected.some((item) => item.id === appliesTo.id)
        ? prevSelected.filter((item) => item.id !== appliesTo.id)
        : [...prevSelected, appliesTo]
    );
  };
  const handleCollectionOperation = (value) => {
    setCurrentPage(1);
    handleCollectionSelect(value);
  };
  const handleAddClick = () => {
    navigate(
      '/system-configuration/operations-admin/booking-drives/daily-hours/create'
    );
  };

  const handleSort = (columnName) => {
    columnName === 'is_active'
      ? setSortName('status')
      : setSortName(columnName);
    setSortOrder((prevSortOrder) => (prevSortOrder === 'ASC' ? 'DESC' : 'ASC'));
  };

  const BreadcrumbsData = [
    ...BookingDrivesBreadCrumbsData,
    {
      label: 'Daily Hours',
      class: 'active-label',
      link: `/system-configuration/operations-admin/booking-drives/daily-hours`,
    },
  ];
  const handleDisplay = (value) => {
    setDisplay(value);
  };

  const dropdownItems = [
    {
      options: [
        { label: 'Current', value: 'Current', handler: handleDisplay },
        { label: 'Past', value: 'Past', handler: handleDisplay },
        { label: 'Scheduled', value: 'Scheduled', handler: handleDisplay },
      ],
    },
  ];

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(
        '/system-configuration/operations-admin/booking-drives/daily-hours'
      );
    }
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Daily Hours'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <div className="tabs">
          <ul>
            {CheckPermission(null, [
              Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.BOOKING_RULE
                .MODULE_CODE,
            ]) && (
              <li>
                <Link
                  to={
                    '/system-configuration/operations-admin/booking-drives/booking-rule'
                  }
                  className={
                    currentLocation ===
                    '/system-configuration/operations-admin/booking-drives/booking-rule'
                      ? 'active'
                      : ''
                  }
                >
                  Booking Rules
                </Link>
              </li>
            )}
            {CheckPermission(null, [
              Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES
                .DAILY_CAPACITY.MODULE_CODE,
            ]) && (
              <li>
                <Link
                  to={
                    '/system-configuration/operations-admin/booking-drives/daily-capacities'
                  }
                  className={
                    currentLocation ===
                    '/system-configuration/operations-admin/booking-drives/daily-capacities'
                      ? 'active'
                      : ''
                  }
                >
                  Daily Capacity
                </Link>
              </li>
            )}
            {CheckPermission(null, [
              Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.DAILY_HOURS
                .MODULE_CODE,
            ]) && (
              <li>
                <Link
                  to={
                    '/system-configuration/operations-admin/booking-drives/daily-hours'
                  }
                  className={
                    currentLocation ===
                    '/system-configuration/operations-admin/booking-drives/daily-hours'
                      ? 'active'
                      : ''
                  }
                >
                  Daily Hours
                </Link>
              </li>
            )}
            {CheckPermission(null, [
              Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES
                .OPERATION_STATUS.MODULE_CODE,
            ]) && (
              <li>
                <Link
                  to={
                    '/system-configuration/operations-admin/booking-drives/operation-status'
                  }
                  className={
                    currentLocation ===
                    '/system-configuration/operations-admin/booking-drives/operation-status'
                      ? 'active'
                      : ''
                  }
                >
                  Operation Status
                </Link>
              </li>
            )}
            {CheckPermission(null, [
              Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES
                .TASK_MANAGEMENT.MODULE_CODE,
            ]) && (
              <li>
                <Link
                  to={
                    '/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list'
                  }
                  className={
                    currentLocation ===
                    '/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list'
                      ? 'active'
                      : ''
                  }
                >
                  Task Management
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="filterInner">
          <h2>Filters</h2>
          <form className="d-flex gap-4">
            <div className="form-field" style={{ width: '255px' }}>
              <SelectDropdown
                placeholder={'Display'}
                selectedValue={display}
                onChange={(option) => {
                  setCurrentPage(1);
                  handleDisplay(option);
                }}
                options={dropdownItems[0].options?.map((item) => ({
                  label: item?.label,
                  value: item?.value,
                }))}
                removeDivider
                showLabel
              />
            </div>
            <div className="form-field" style={{ width: '255px' }}>
              <GlobalMultiSelect
                label="Collection Operations"
                data={collectionOperationData?.map((item) => ({
                  id: item?.id,
                  name: item?.name,
                }))}
                selectedOptions={collectionOperations}
                onChange={handleCollectionOperation}
                onSelectAll={(data) => setCollectionOperations(data)}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.DAILY_HOURS
            .SCHEDULE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary mb-3" onClick={handleAddClick}>
              Schedule Daily Hours
            </button>
          </div>
        )}
        <DailyHourListTable
          data={dailyCapacities}
          isLoading={isLoading}
          handleSort={handleSort}
          setRefresh={setRefresh}
        />
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
        />
        {/* Confirmation Dialog */}
        <section
          className={`popup full-section ${
            showConfirmationDialog ? 'active' : ''
          }`}
        >
          <div className="popup-inner">
            <div className="icon">
              <img src={CancelIconImage} alt="CancelIcon" />
            </div>
            <div className="content">
              <h3>Confirmation</h3>
              <p>Unsaved changes will be lost. Do you want to continue?</p>
              <div className="buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleConfirmationResult(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleConfirmationResult(true)}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DailyHourList;
