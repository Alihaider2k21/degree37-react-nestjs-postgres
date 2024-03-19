import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../pagination';
import TableList from '../tableListing';
import SuccessPopUpModal from '../successModal';
import SelectDropdown from '../selectDropdown';
import Styles from './index.module.scss';
import { toast } from 'react-toastify';
import Topbar from '../topbar/index';

const ListTask = ({
  taskableType = null,
  taskableId = null,
  createTaskUrl,
  customTopBar,
  searchText,
  hideAssociatedWith,
  breadCrumbsData,
  tasksNotGeneric,
  calendarIconShowHeader,
  show = true,
  search = '',
}) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [taskListData, setTaskListData] = useState([]);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [getData, setGetData] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dueDateDataText, setDueDateDataText] = useState(null);
  const [associatedWithDataText, setAssociatedWithDataText] = useState(null);
  const [statusDataText, setStatusDataText] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveID, setArchiveID] = useState('');
  const [statusFilterData, setStatusFilterData] = useState('');
  const [dueDateFilterData, setDueDateFilterData] = useState('');
  const [associateWithFilterData, setAssociateWithFilterData] = useState('');
  const [archiveStatus, setArchiveStatus] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const statusOption = useMemo(() => {
    const statusOption = [
      {
        id: 1,
        status: 'Not Started',
        className: 'badge Grey',
      },
      {
        id: 2,
        status: 'In Process',
        className: 'badge Yellow',
      },
      {
        id: 3,
        status: 'Deferred',
        className: 'badge Blue',
      },
      {
        id: 4,
        status: 'Completed',
        className: 'badge active',
      },
      {
        id: 5,
        status: 'Cancelled',
        className: 'badge inactive',
      },
    ];
    return statusOption;
  }, []);

  const associatedWithOptions = useMemo(() => {
    const associatedWithOptions = [
      { label: 'Account', value: 'accounts' },
      {
        label: 'CRM Location',
        value: 'crm_locations',
      },
      { label: 'Staff', value: 'staff' },
      {
        label: 'Volunteer',
        value: 'crm_volunteer',
      },
      { label: 'Donor', value: 'donors' },
      {
        label: 'Donor Center',
        value: 'donor_centers',
      },
      {
        label: 'Non-Collection Profile',
        value: 'crm_non_collection_profiles',
      },
      {
        label: 'Session',
        value: 'sessions',
      },
      {
        label: 'NCE',
        value: 'oc_non_collection_events',
      },
      {
        label: 'Drives',
        value: 'drives',
      },
    ];
    return associatedWithOptions;
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const getData = async () => {
      setIsLoading(true);
      try {
        const result = await fetch(
          `${BASE_URL}/tasks?limit=${limit}&page=${currentPage}${
            sortBy ? `&sortBy=${sortBy}&sortOrder=${sortOrder}` : ''
          }${statusFilterData ? `&status=${statusFilterData}` : ''}${
            associateWithFilterData
              ? `&taskable_type=${associateWithFilterData}`
              : ''
          }${
            taskableType && taskableId
              ? `&taskable_type=${taskableType}&taskable_id=${taskableId}`
              : ''
          }${dueDateFilterData ? `&due_date=${dueDateFilterData}` : ''}${
            searchText !== ''
              ? `&task_name=${searchText}`
              : search
              ? `&task_name=${search}`
              : ''
          }`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await result.json();
        const updatedTaskListData = data?.data?.map((task) => {
          const statusOptionItem = statusOption?.find(
            (option) => option.id === task.status
          );
          const associateWithItem = associatedWithOptions?.find((option) =>
            option.value !== null ? option.value === task.taskable_type : ''
          );
          return {
            ...task,
            status: statusOptionItem ? statusOptionItem?.status : '',
            className: statusOptionItem ? statusOptionItem?.className : '',
            taskable_type: associateWithItem ? associateWithItem?.label : 'N/A',
            taskable_name: task.taskable_name,
          };
        });
        setTaskListData(updatedTaskListData);
        if (!(updatedTaskListData?.length > 0) && currentPage > 1) {
          setCurrentPage(1);
        }
        setTotalRecords(data?.total_records);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (!searchText && !search) {
      getData(limit, currentPage);
    }

    if (searchText?.length > 1 || search?.length > 1) {
      if (searchText?.length > 1) {
        getData(searchText);
      }
      if (search?.length > 1) {
        getData(search);
      }
    }

    if (searchText?.length === 1 || search?.length === 1) {
      setCurrentPage(1);
    }
    return () => {
      setGetData(false);
    };
  }, [
    currentPage,
    limit,
    searchText,
    search,
    BASE_URL,
    associateWithFilterData,
    taskableType,
    taskableId,
    statusFilterData,
    dueDateFilterData,
    getData,
    sortBy,
    statusOption,
    sortOrder,
    associatedWithOptions,
  ]);

  const handleArchive = async () => {
    if (archiveID) {
      const accessToken = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/tasks/archive/${archiveID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      });
      let data = await response.json();
      if (data.status === 'success') {
        setArchiveStatus(true);
        setGetData(true);
      } else {
        toast.error('Failed to Archive Task.');
      }
      setModalPopUp(false);
    }
  };

  const statusOptions = [
    { label: 'Not Started', value: '1' },
    { label: 'In Process', value: '2' },
    { label: 'Deferred', value: '3' },
    { label: 'Completed', value: '4' },
    { label: 'Cancelled', value: '5' },
  ];

  const dueDateOptions = [
    { label: 'Past Due', value: '2' },
    {
      label: 'Due This Week',
      value: '3',
    },
    {
      label: 'Due Next Week',
      value: '4',
    },
  ];

  const handleSort = (columnName) => {
    if (sortBy === columnName) {
      setSortOrder((prevSortOrder) =>
        prevSortOrder === 'ASC' ? 'DESC' : 'ASC'
      );
    } else {
      setSortBy(columnName);
      setSortOrder('ASC');
    }
  };

  const handleStatus = (value) => {
    if (value !== null) {
      setStatusFilterData(value?.value);
      setStatusDataText(value);
    } else {
      setStatusFilterData('');
      setStatusDataText(value);
    }
  };

  const handleDueDates = (value) => {
    if (value !== null) {
      setDueDateFilterData(value?.value);
      setDueDateDataText(value);
    } else {
      setDueDateFilterData('');
      setDueDateDataText(value);
    }
  };

  const handleAssociatedWith = (value) => {
    if (value !== null) {
      setAssociatedWithDataText(value);
      setAssociateWithFilterData(value?.value);
    } else {
      setAssociateWithFilterData('');
      setAssociatedWithDataText(value);
    }
  };

  const optionsConfig = [
    {
      label: 'View',
      path: (rowData) => `${location.pathname}/${rowData.id}/view`,
    },
    {
      label: 'Edit',
      path: (rowData) => `${location.pathname}/${rowData.id}/edit`,
    },
    {
      label: 'Archive',
      action: (rowData) => {
        setModalPopUp(true);
        setArchiveID(rowData.id);
      },
    },
  ];

  const tableHeaders = [
    {
      name: 'assigned_to',
      label: 'Assigned To',
      width: '17.5%',
      sortable: true,
    },
    {
      name: 'assigned_by',
      label: 'Assigned By',
      width: '17.5%',
      sortable: true,
    },
    { name: 'task_name', label: 'Task Name', width: '20%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '20%',
      sortable: true,
    },
    {
      name: 'due_date',
      label: 'Due Date',
      width: '10%',
      sortable: true,
      icon: calendarIconShowHeader ? true : false,
    },
    { name: 'status', label: 'Status', width: '10%', sortable: true },
  ];

  const tableHeadersGeneric = [
    { name: 'task_name', label: 'Task Name', width: '15%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '20%',
      sortable: true,
    },
    {
      name: 'taskable_type',
      label: 'Associated With',
      width: '15%',
      sortable: true,
    },
    {
      name: 'taskable_name',
      label: 'Reference',
      width: '10%',
    },
    {
      name: 'assigned_by',
      label: 'Assigned By',
      width: '20%',
      sortable: true,
    },
    {
      name: 'due_date',
      label: 'Due Date',
      width: '10%',
      sortable: true,
      icon: true,
    },
    { name: 'status', label: 'Status', width: '10%', sortable: true },
  ];

  return (
    <div className="mainContent">
      {show && (
        <Topbar
          BreadCrumbsData={breadCrumbsData}
          BreadCrumbsTitle={'Tasks'}
          SearchPlaceholder={'Search'}
          SearchValue={searchText}
          // SearchOnChange={searchFieldChange}
        />
      )}
      {show && customTopBar && customTopBar}
      <div className="filterBar">
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className={`d-flex`}>
              <div className={`me-4 ${Styles.dropdownWidthMenu}`}>
                <SelectDropdown
                  label="Due Date"
                  options={dueDateOptions}
                  selectedValue={dueDateDataText}
                  onChange={(val) => {
                    handleDueDates(val);
                  }}
                  removeDivider
                  showLabel
                  placeholder="Due Date"
                />
              </div>
              {(taskableId && taskableType) || hideAssociatedWith ? (
                ''
              ) : (
                <div className={`me-4 ${Styles.dropdownWidthMenu}`}>
                  <SelectDropdown
                    label="Associate With"
                    options={associatedWithOptions}
                    selectedValue={associatedWithDataText}
                    onChange={(val) => {
                      handleAssociatedWith(val);
                    }}
                    removeDivider
                    showLabel
                    placeholder="Associate With"
                  />
                </div>
              )}
              <div className={`me-4 ${Styles.dropdownWidthMenu}`}>
                <SelectDropdown
                  label="Status"
                  options={statusOptions}
                  selectedValue={statusDataText}
                  onChange={(val) => {
                    handleStatus(val);
                  }}
                  removeDivider
                  showLabel
                  placeholder="Status"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        <div className="buttons">
          <button
            style={{
              minHeight: '0px',
              padding: '12px 32px 12px 32px',
            }}
            className="btn btn-primary"
            onClick={() => navigate(createTaskUrl)}
          >
            Add Task
          </button>
        </div>
        <TableList
          isLoading={isLoading}
          data={taskListData}
          hideActionTitle={true}
          headers={
            (taskableType && taskableId) || tasksNotGeneric
              ? tableHeaders
              : tableHeadersGeneric
          }
          // headers={tableHeaders}
          handleSort={handleSort}
          sortName={sortBy}
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
        title="Confirmation"
        message={'Are you sure you want to archive?'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={false}
        isArchived={true}
        archived={handleArchive}
      />
      <SuccessPopUpModal
        title="Success!"
        message={'Task is archived.'}
        modalPopUp={archiveStatus}
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setArchiveStatus}
      />
    </div>
  );
};

export default ListTask;
