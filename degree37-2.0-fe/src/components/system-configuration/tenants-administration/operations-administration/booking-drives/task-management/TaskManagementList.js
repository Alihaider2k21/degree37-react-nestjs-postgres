import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import styles from './task-management.module.scss';
import SelectDropdown from '../../../../../common/selectDropdown';
import { Link, useLocation } from 'react-router-dom';
import NavTabs from '../../../../../common/navTabs';
import Pagination from '../../../../../common/pagination';
import { toast } from 'react-toastify';
import TableList from '../../../../../common/tableListing';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import SuccessPopUpModal from '../../../../../common/successModal';
import { BookingDrivesBreadCrumbsData } from '../BookingDrivesBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import { groupBy } from 'lodash';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';

const BreadcrumbsData = [
  ...BookingDrivesBreadCrumbsData,
  {
    label: 'Task Management',
    class: 'active-label',
    link: `/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list`,
  },
];
const tabs = [
  CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.BOOKING_RULE
      .MODULE_CODE,
  ]) && {
    label: 'Booking Rules',
    link: '/system-configuration/operations-admin/booking-drives/booking-rule',
  },
  CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.DAILY_CAPACITY
      .MODULE_CODE,
  ]) && {
    label: 'Daily Capacity',
    link: '/system-configuration/operations-admin/booking-drives/daily-capacities',
  },
  CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.DAILY_HOURS
      .MODULE_CODE,
  ]) && {
    label: 'Daily Hours',
    link: '/system-configuration/operations-admin/booking-drives/daily-hours',
  },
  CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.OPERATION_STATUS
      .MODULE_CODE,
  ]) && {
    label: 'Operation Status',
    link: '/system-configuration/operations-admin/booking-drives/operation-status',
  },
  CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.TASK_MANAGEMENT
      .MODULE_CODE,
  ]) && {
    label: 'Task Management',
    link: '/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list',
  },
];
const ownerOptions = [
  { id: 1, name: 'Recruiters' },
  { id: 2, name: 'Schedulers' },
  { id: 3, name: 'Lead Telerecruiter' },
];
const appliesToOptions = [
  { id: 1, name: 'Accounts' },
  { id: 2, name: 'Locations' },
  { id: 3, name: 'Donor Centers' },
  { id: 4, name: 'Donors' },
  { id: 5, name: 'Staff' },
  { id: 6, name: 'Volunteers' },
  { id: 7, name: 'Drives' },
  { id: 8, name: 'Sessions' },
  { id: 9, name: 'NCEs' },
];
const TaskManagementList = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [owner, setOwner] = useState([]);
  const [appliesTo, setAppliesTo] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [status, setStatus] = useState({ label: 'Active', value: 'true' });
  const [refresh, setRefresh] = useState(false);
  const [taskData, setTaskData] = useState([]);
  const location = useLocation();
  const currentLocation = location.pathname;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortOrder, setSortOrder] = useState('');
  const [sortName, setSortName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const bearerToken = localStorage.getItem('token');

  const optionsConfig = [
    CheckPermission([
      Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.TASK_MANAGEMENT.READ,
    ]) && {
      label: 'View',
      path: (rowData) =>
        `/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/view/${rowData.id}`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.TASK_MANAGEMENT
        .WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) =>
        `/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/${rowData.id}`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.TASK_MANAGEMENT
        .ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => handleArchive(rowData),
    },
  ].filter(Boolean);

  const handleSort = (columnName) => {
    if (columnName == 'task_applies_to') {
      setSortName('task_applies_to');
    } else if (columnName == 'task_collection_operation') {
      setSortName('collection_operation');
    } else if (columnName == 'status') {
      setSortName('is_active');
    } else {
      setSortName(columnName);
    }

    if (sortName === columnName) {
      if (sortOrder === 'ASC') {
        setSortOrder('DESC');
      } else if (sortOrder === 'DESC') {
        setSortName('');
        setSortOrder('');
      } else {
        setSortOrder('ASC');
      }
    } else {
      setSortName(columnName);
      setSortOrder('ASC');
    }
  };

  const tableHeaders = [
    { name: 'name', label: 'Name', width: '20%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '20%',
      sortable: true,
    },
    { name: 'offset', label: 'Offset', width: '20%', sortable: true },
    { name: 'owner', label: 'Owner', width: '20%', sortable: true },
    {
      name: 'task_applies_to',
      label: 'Applies To',
      width: '20%',
      sortable: true,
    },
    {
      name: 'collection_operations',
      label: 'Collection Operation',
      width: '15%',
    },
    {
      name: 'is_active',
      label: 'Status',
      width: '10%',
      sortable: true,
    },
  ];

  const handleCollectionOperationChange = (collectionOperation) => {
    setCollectionOperation((prevSelected) =>
      prevSelected.some((item) => item.id === collectionOperation.id)
        ? prevSelected.filter((item) => item.id !== collectionOperation.id)
        : [...prevSelected, collectionOperation]
    );
  };
  const handleAppliesToChange = (data) => {
    setAppliesTo((prevSelected) =>
      prevSelected.some((item) => item.id === data.id)
        ? prevSelected.filter((item) => item.id !== data.id)
        : [...prevSelected, data]
    );
  };

  const handleOwnerChange = (data) => {
    setOwner((prevSelected) =>
      prevSelected.some((item) => item.id === data.id)
        ? prevSelected.filter((item) => item.id !== data.id)
        : [...prevSelected, data]
    );
  };

  const handleCollectionOperationChangeAll = (data) => {
    setCollectionOperation(data);
  };
  useEffect(() => {
    getCollectionOperations();
  }, []);

  const getCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list`
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      let formatCollectionOperations = data?.map((operation) => ({
        name: operation?.name,
        id: operation?.id,
      }));
      setCollectionOperationData([...formatCollectionOperations]);
    } else {
      toast.error('Error Fetching Collection Operations', {
        autoClose: 3000,
      });
    }
  };

  const cancelArchive = () => {
    setShowConfirmation(false);
    setItemToArchive(null);
  };

  const handleArchive = (rowData) => {
    setShowConfirmation(true);
    setRefresh(false);
    setItemToArchive(rowData);
  };

  const confirmArchive = async () => {
    if (itemToArchive) {
      try {
        const taskId = itemToArchive.id;
        const response = await fetch(
          `${BASE_URL}/booking-drive/task/archive/${taskId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const { status_code, status } = await response.json();

        if (status_code === 204 && status === 'success') {
          setShowConfirmation(false);
          setTimeout(() => {
            setArchiveSuccess(true);
          }, 600);
          setRefresh(true);
        } else {
          toast.error('Error Archiving Task', { autoClose: 3000 });
        }
      } catch (error) {
        console.error('Error archiving data:', error);
      }

      setShowConfirmation(false);
      setItemToArchive(null);
    }
  };

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const getTask = async () => {
      setIsLoading(true);
      let collectionOperationValues = '';
      if (collectionOperation?.length > 0)
        collectionOperationValues = collectionOperation
          ?.map((op) => op?.id)
          .join(',');

      let appliesToValues = '';
      if (appliesTo?.length > 0)
        appliesToValues = appliesTo?.map((op) => op?.name).join(',');

      let ownerValues = '';
      if (owner?.length > 0)
        ownerValues = owner?.map((op) => op?.name).join(',');

      try {
        var url = `${BASE_URL}/booking-drive/task?limit=${limit}&page=${currentPage}&owner=${ownerValues}&applies_to=${appliesToValues}&keyword=${searchText}&is_active=${
          status?.value ?? ''
        }&collection_operation=${collectionOperationValues}`;

        if (sortOrder.length > 0) {
          url += `&sort_order=${sortOrder}`;
        }
        let updatedSortName = sortName;

        if (updatedSortName.length > 0) {
          if (updatedSortName == 'task_applies_to') {
            updatedSortName = 'applies_to';
          }
          url += `&sort_name=${updatedSortName}`;
        }

        const taskData = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        });
        const { data, count } = await taskData.json();
        const taskDataRes = data?.tasks;
        const collectionOperationsData = groupBy(
          data?.collectionOperations,
          (collectionOperation) => collectionOperation.task_id.id
        );
        for (const taskDataSingle of taskDataRes) {
          taskDataSingle.collection_operations = collectionOperationsData[
            taskDataSingle.id
          ]
            ?.map((bco) => bco.collection_operation_id.name)
            .join(', ');
        }
        setTaskData(taskDataRes?.length > 0 ? taskDataRes : []);
        if (taskDataRes?.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        setTotalRecords(count);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getTask();
  }, [
    owner,
    appliesTo,
    refresh,
    status,
    collectionOperation,
    currentPage,
    limit,
    BASE_URL,
    searchText,
    sortOrder,
    sortName,
  ]);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Task Management'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />

      <div className="filterBar">
        <NavTabs tabs={tabs} currentLocation={currentLocation} />
        <div className={`filterInner ${styles.filterBar}`}>
          <h2>Filters</h2>
          <div className={`filter`}>
            <form className="d-flex justify-content-end gap-3 flex-wrap p-3">
              <div className="me-3">
                <GlobalMultiSelect
                  label="Owner"
                  data={ownerOptions}
                  selectedOptions={owner}
                  onChange={handleOwnerChange}
                  onSelectAll={(data) => setOwner(data)}
                />
              </div>
              <div className="me-3">
                <GlobalMultiSelect
                  label="Applies To"
                  data={appliesToOptions}
                  selectedOptions={appliesTo}
                  onChange={handleAppliesToChange}
                  onSelectAll={(data) => setAppliesTo(data)}
                />
              </div>
              <div className="me-3">
                <GlobalMultiSelect
                  label="Collection Operation"
                  data={collectionOperationData}
                  selectedOptions={collectionOperation}
                  onChange={handleCollectionOperationChange}
                  onSelectAll={handleCollectionOperationChangeAll}
                />
              </div>

              <div className="form-field">
                <SelectDropdown
                  placeholder={'Status'}
                  defaultValue={status}
                  selectedValue={status}
                  removeDivider
                  showLabel
                  onChange={(value) => {
                    setStatus(value);
                  }}
                  options={[
                    { label: 'Active', value: 'true' },
                    { label: 'Inactive', value: 'false' },
                  ]}
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="mainContentInner">
        {CheckPermission([
          Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.BOOKING_RULE
            .WRITE,
        ]) && (
          <div className="buttons">
            <Link
              to={
                '/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/create'
              }
              className="btn btn-primary"
            >
              Create Task
            </Link>
          </div>
        )}
        <TableList
          isLoading={isLoading}
          data={taskData}
          headers={tableHeaders}
          handleSort={handleSort}
          sortName={sortName}
          sortOrder={sortOrder}
          optionsConfig={optionsConfig}
        />
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
        />
      </div>
      <SuccessPopUpModal
        title="Success!"
        message="Task is archived."
        modalPopUp={archiveSuccess}
        isNavigate={true}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
      />
      {/* Confirmation Dialog */}
      <section
        className={`popup full-section ${showConfirmation ? 'active' : ''}`}
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
                onClick={() => cancelArchive()}
              >
                No
              </button>
              <button
                className="btn btn-primary"
                onClick={() => confirmArchive()}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaskManagementList;
