import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../../../../../common/pagination';
import { toast } from 'react-toastify';
import TableList from '../../../../../common/tableListing';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import WarningIconImage from '../../../../../../assets/images/warningIcon.png';
import ConfirmModal from '../../../../../common/confirmModal';
import NavTabs from '../../../../../common/navTabs';
import SuccessPopUpModal from '../../../../../common/successModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import { BookingDrivesBreadCrumbsData } from '../BookingDrivesBreadCrumbsData';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
const ListAllOperationStatus = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const currentLocation = location.pathname;
  const [operationStatus, setOperationStatus] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [sortName, setSortName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const [appliesToFilter, setAppliesToFilter] = useState([]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [checkArchive, setCheckArchive] = useState(false);
  const bearerToken = localStorage.getItem('token');

  const statusAssociation = async (rowData) => {
    try {
      const apiResponse = await fetch(
        `${BASE_URL}/booking-drive/operation-status/association/${rowData?.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const result = await apiResponse.json();
      if (result?.status === 200) {
        if (result?.data?.is_associated_with) {
          setCheckArchive(true);
        } else {
          setShowConfirmation(true);
          setItemToArchive(rowData);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleArchive = (rowData) => {
    statusAssociation(rowData);
  };

  const confirmArchive = async () => {
    if (itemToArchive) {
      try {
        const operationStatusId = itemToArchive.id;
        const apiResponse = await fetch(
          `${BASE_URL}/booking-drive/operation-status/${operationStatusId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const { status_code } = await apiResponse.json();

        if (status_code === 200) {
          setShowConfirmation(false);
          setTimeout(() => {
            setArchiveSuccess(true);
          }, 600);
          setRefresh(true);
        } else {
          toast.error('Error Archiving Operaion Status', { autoClose: 3000 });
        }
      } catch (error) {
        console.error('Error archiving data:', error);
      }

      setShowConfirmation(false);
      setItemToArchive(null);
    }
  };

  const cancelArchive = () => {
    setShowConfirmation(false);
    setItemToArchive(null);
  };

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const result = await fetch(
          `${BASE_URL}/booking-drive/operation-status?limit=${limit}&page=${currentPage}&status=${
            isActive?.value ?? ''
          }&sortOrder=${sortOrder}&sortName=${sortName}&appliesTo=${
            appliesToFilter?.map((e) => e.id) ?? ''
          }`,
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const data = await result.json();
        setOperationStatus(data?.data);
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
        const result = await fetch(
          `${BASE_URL}/booking-drive/operation-status?limit=${limit}&page=${currentPage}&name=${searchText}&status=${
            isActive?.value ?? ''
          }&sortOrder=${sortOrder}&sortName=${sortName}&appliesTo=${
            appliesToFilter?.map((e) => e.id) ?? ''
          }`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const data = await result.json();
        setOperationStatus(data.data);
        setTotalRecords(data?.count);
      } catch (error) {
        console.error('Error searching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!searchText) {
      getData(limit, currentPage);
    }

    if (searchText.length > 1) {
      handleSearchChange(searchText);
    }

    if (searchText.length === 1) {
      setCurrentPage(1);
    }
  }, [
    currentPage,
    limit,
    searchText,
    BASE_URL,
    isActive,
    appliesToFilter,
    refresh,
    sortOrder,
    sortName,
  ]);

  const handleSort = (columnName) => {
    if (sortName === columnName) {
      setSortOrder((prevSortOrder) =>
        prevSortOrder === 'ASC' ? 'DESC' : 'ASC'
      );
    } else {
      setSortName(columnName);
      setSortOrder('ASC');
    }
  };

  const searchFieldChange = (e) => {
    setCurrentPage(1);
    setSearchText(e.target.value);
  };

  const handleIsActive = (value) => {
    setCurrentPage(1);
    setIsActive(value);
  };

  const handleAppliesTo = (value) => {
    setCurrentPage(1);
    handleAppliesToSelect(value);
  };

  const BreadcrumbsData = [
    ...BookingDrivesBreadCrumbsData,

    {
      label: 'Operation Status',
      class: 'active-label',
      link: `/system-configuration/operations-admin/booking-drives/operation-status`,
    },
  ];

  const tableHeaders = [
    { name: 'name', label: 'Name', width: '15%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '20%',
      sortable: true,
    },
    {
      name: 'schedulable',
      label: 'Schedulable',
      width: '10%',
      sortable: true,
    },
    {
      name: 'hold_resources',
      label: 'Hold Resources',
      width: '10%',
      sortable: true,
    },
    {
      name: 'contribute_to_scheduled',
      label: 'Contribution To Schedule',
      width: '10%',
      splitlabel: true,
      sortable: true,
    },
    {
      name: 'requires_approval',
      label: 'Requires Approval',
      width: '10%',
      splitlabel: true,
      sortable: true,
    },
    {
      name: 'applies_to',
      label: 'Applies To',
      width: '15%',
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: '10%', sortable: true },
  ];

  const optionsConfig = [
    CheckPermission([
      Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.OPERATION_STATUS
        .READ,
    ]) && {
      label: 'View',
      path: (rowData) => `${rowData.id}`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.OPERATION_STATUS
        .WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) => `${rowData.id}/edit`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.OPERATION_STATUS
        .ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => handleArchive(rowData),
    },
  ].filter(Boolean);
  const handleAppliesToSelect = (appliesTo) => {
    setAppliesToFilter((prevSelected) =>
      prevSelected.some((item) => item.id === appliesTo.id)
        ? prevSelected.filter((item) => item.id !== appliesTo.id)
        : [...prevSelected, appliesTo]
    );
  };

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

  const dropdownItems = [
    {
      options: [
        { label: 'Drives', value: 'Drives', handler: handleAppliesTo },
        {
          label: 'Sessions',
          value: 'Sessions',
          handler: handleAppliesTo,
        },
        { label: 'NCEs', value: 'NCEs', handler: handleAppliesTo },
      ],
    },
    {
      options: [
        { label: 'Active', value: 'true', handler: handleIsActive },
        { label: 'Inactive', value: 'false', handler: handleIsActive },
      ],
    },
    // Add more dropdown items as needed
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Operation Status'}
        SearchPlaceholder={'Search'}
        SearchValue={null}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <NavTabs tabs={tabs} currentLocation={currentLocation} />
        <div className="filterInner">
          <h2>Filters</h2>
          <form className="d-flex gap-4">
            <GlobalMultiSelect
              label="Applies To *"
              data={dropdownItems[0].options?.map((item) => ({
                name: item?.label,
                id: item?.value,
              }))}
              selectedOptions={appliesToFilter}
              onChange={handleAppliesTo}
              onSelectAll={(data) => setAppliesToFilter(data)}
            />
            {/* <SelectDropdown
              placeholder={'Applies To'}
              selectedValue={appliesToFilter}
              onChange={(option) => {
                handleAppliesTo(option);
              }}
              options={dropdownItems[0].options?.map((item) => ({
                label: item?.label,
                value: item?.value,
              }))}
              removeDivider
              showLabel
            /> */}
            <SelectDropdown
              placeholder={'Status'}
              selectedValue={isActive}
              onChange={(val) => {
                handleIsActive(val);
              }}
              options={[
                { label: 'Active', value: 'true' },
                { label: 'Inactive', value: 'false' },
              ]}
              removeDivider
              showLabel
            />
          </form>
        </div>
      </div>
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.OPERATION_STATUS
            .WRITE,
        ]) && (
          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate(
                  '/system-configuration/operations-admin/booking-drives/operation-status/create'
                );
              }}
            >
              Create Operation Status
            </button>
          </div>
        )}
        <TableList
          isLoading={isLoading}
          data={operationStatus}
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
        <ConfirmModal
          showConfirmation={showConfirmation}
          onCancel={cancelArchive}
          onConfirm={confirmArchive}
          icon={ConfirmArchiveIcon}
          heading={'Confirmation'}
          description={'Are you sure you want to archive?'}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Operation Status is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
        />
        <section
          className={`popup full-section ${checkArchive ? 'active' : ''}`}
        >
          <div className="popup-inner" style={{ maxWidth: '500px' }}>
            <div className="icon">
              <img src={WarningIconImage} alt="CancelIcon" />
            </div>
            <div className="content">
              <h3>Warning!</h3>
              <p>This record has associations and cannot be archived. </p>
              <div className="buttons">
                <button
                  style={{ width: '100%' }}
                  className="btn btn-primary"
                  onClick={(e) => {
                    setCheckArchive(false);
                  }}
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

export default ListAllOperationStatus;
