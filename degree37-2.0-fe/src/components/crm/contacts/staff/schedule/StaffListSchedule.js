import React, { useState, useEffect } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CRM_STAFF_SCHEDULE_PATH } from '../../../../../routes/path';
import TableList from '../../../../common/tableListing';
import SelectDropdown from '../../../../common/selectDropdown';
import { fetchData } from '../../../../../helpers/Api';
import { StaffBreadCrumbsData } from '../StaffBreadCrumbsData';
import DatePicker from 'react-datepicker';
import styles from './index.module.scss';
import Pagination from '../../../../common/pagination';
import moment from 'moment';
import SvgComponent from '../../../../common/SvgComponent';
import PrintModal from '../../../../common/PrintModal';
import SuccessPopUpModal from '../../../../common/successModal';
import ConfirmModal from '../../../../common/confirmModal';
import ConfirmArchiveIcon from '../../../../../assets/images/ConfirmArchiveIcon.png';

const periodDropdownOptions = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'this_week' },
  { label: 'Next 2 Weeks', value: 'next_2_weeks' },
  { label: 'Past 2 Weeks', value: 'past_2_weeks' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'All Past', value: 'all_past' },
  { label: 'All Future', value: 'all_future' },
];

const initialDate = {
  startDate: null,
  endDate: null,
};

const statusOptions = [
  { label: 'Ended', value: 'Ended', className: 'badge Grey' },
  { label: 'Current', value: 'Current', className: 'badge active' },
];

const StaffListSchedule = () => {
  const [isActive, setIsActive] = useState(null);
  const [period, setPeriod] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState([]);
  const [printScheduleData, setPrintScheduleData] = useState([]);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [searched, setSearched] = useState(false);
  const [roleDropDown, setRoleDropDown] = useState([]);
  const { staff_id } = useParams();
  const [dateCrossColor, setDateCrossColor] = useState('#cccccc');
  const [dateRange, setDateRange] = useState(initialDate);
  const [isPrintModalVisible, setPrintModalVisible] = useState(false);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [archiveModalPopUp, setArchiveModalPopUp] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  const resetDateHandler = () => {
    setDateRange({ ...initialDate });
  };

  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...StaffBreadCrumbsData,
      {
        label: 'View Staff',
        class: 'active-label',
        link: `/crm/contacts/staff/${staff_id}/view`,
      },
      {
        label: 'Schedule',
        class: 'active-label',
        link: CRM_STAFF_SCHEDULE_PATH.LIST.replace(':staff_id', staff_id),
      },
    ]);
  }, []);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    const value = { startDate: start, endDate: end };
    setDateRange(value);
  };

  const getWithStatus = async () => {
    setIsLoading(true);
    try {
      let search = context?.search?.length > 1 ? context?.search : '';
      const result = await fetchData(
        `/staff-schedules/${staff_id}?limit=${limit}&page=${currentPage}&period=${
          period?.value || ''
        }&role=${role?.value || ''}&status=${isActive?.value || ''}&dateRange=${
          dateRange?.startDate && dateRange?.endDate
            ? moment(dateRange?.startDate).format('YYYY-MM-DD') +
              ' ' +
              moment(dateRange?.endDate).format('YYYY-MM-DD')
            : ''
        }&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`
      );
      const { data, status, count } = result;
      if (status === 200) {
        setScheduleData(
          data.map((singleData) => {
            let tempStatus = statusOptions.find(
              (option) => option.value === singleData?.staff_assignments?.status
            );
            return {
              ...singleData,
              date: singleData?.date_description?.date,
              description: singleData?.date_description?.description,
              start_time: new Date(
                singleData?.staff_assignments?.start_time
              ).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              }),
              end_time: new Date(
                singleData?.staff_assignments?.end_time
              ).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              }),
              status: tempStatus?.label,
              className: tempStatus?.className,
              total_hours: singleData?.staff_assignments?.total_hours,
              role: singleData?.role,
            };
          })
        );
        setTotalRecords(count);
        if (!(data?.length > 0) && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error('Error Getting Schedule ', { autoClose: 3000 });
      }
    } catch (error) {
      console.log(error);
      toast.error('Error Archiving Schedule ', { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getWithStatus();
  }, [
    isActive,
    sortBy,
    sortOrder,
    currentPage,
    role,
    period,
    limit,
    refreshData,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, sortOrder]);

  const getDropdownData = async () => {
    try {
      const roles = await fetchData('/contact-roles?fetchAll=true', 'GET');
      let formatRoles = roles?.data?.map((role) => ({
        label: role?.name,
        value: role?.id,
      }));
      setRoleDropDown([...formatRoles]);
    } catch (error) {
      toast.error('Error Fetching Dropdown Data');
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getDropdownData();
  }, []);

  useEffect(() => {
    if (
      (dateRange?.startDate && dateRange?.endDate) ||
      (!dateRange?.startDate && !dateRange?.endDate)
    ) {
      getWithStatus();
    }
  }, [dateRange.startDate, dateRange.endDate]);

  const tableHeaders = [
    { name: 'date', label: 'Date', sortable: true },
    { name: 'description', label: 'Description', sortable: true },
    {
      name: 'role',
      label: 'Role',
      sortable: true,
    },
    { name: 'start_time', label: 'Start Time', sortable: true },
    { name: 'end_time', label: 'End Time', sortable: true },
    { name: 'total_hours', label: 'Total Hours', sortable: true },
    { name: 'status', label: 'Status', sortable: true },
  ];

  const optionsConfig = [
    {
      label: 'View',
      path: (rowData) => `${rowData?.staff_assignments?.id}/view`,
      action: (rowData) => {},
    },
    {
      label: 'Archive',
      action: (rowData) => {
        handleArchive(rowData);
      },
    },
  ];

  useEffect(() => {
    if (context?.search?.length > 1) {
      setSearched(true);
      setCurrentPage(1);
      getWithStatus();
    }
    if (context?.search.length === 1 && searched) {
      setCurrentPage(1);
      getWithStatus();
      setSearched(false);
    }
  }, [context?.search]);

  const handlePrintClick = () => {
    setPrintModalVisible(true);
  };

  const handleIsActive = (value) => {
    setIsActive(value);
  };

  const handlePeriod = (value) => {
    setPeriod(value);
  };

  const handleRole = (value) => {
    setRole(value);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'ASC') {
        setSortOrder('DESC');
      } else if (sortOrder === 'DESC') {
        setSortBy('');
        setSortOrder('');
      } else {
        setSortOrder('ASC');
      }
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
  };

  const handlePrint = async (startDate, endDate) => {
    try {
      const result = await fetchData(
        `/staff-schedules/${staff_id}?limit=${limit}&page=${currentPage}&status=${
          isActive?.value || ''
        }&dateRange=${
          startDate && endDate
            ? moment(startDate).format('YYYY-MM-DD') +
              ' ' +
              moment(endDate).format('YYYY-MM-DD')
            : ''
        }`
      );
      const { data, status, count } = result;
      if (status === 200) {
        if (data.length > 0) {
          setPrintScheduleData(
            data.map((singleData) => {
              let tempStatus = statusOptions.find(
                (option) =>
                  option.value === singleData?.staff_assignments?.status
              );
              return {
                ...singleData,
                date: singleData?.date_description?.date,
                description: singleData?.date_description?.description,
                start_time: new Date(
                  singleData?.staff_assignments?.start_time
                ).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                }),
                end_time: new Date(
                  singleData?.staff_assignments?.end_time
                ).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                }),
                status: tempStatus?.label,
                className: tempStatus?.className,
                total_hours: singleData?.staff_assignments?.total_hours,
                role: singleData?.role,
                start_date: startDate,
                end_date: endDate,
                staff_id: staff_id,
              };
            })
          );
          setTotalRecords(count);
          if (!(data?.length > 0) && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        } else {
          toast.error('No Schedule Found. ', { autoClose: 3000 });
        }
      } else {
        toast.error('Error Getting Schedule ', { autoClose: 3000 });
      }
    } catch (error) {
      console.log(error);
      toast.error('Error Getting Schedule ', { autoClose: 3000 });
    }

    setPrintModalVisible(false);
  };

  const cancelArchive = () => {
    setShowConfirmation(false);
    setItemToArchive(null);
  };

  const handleArchive = (rowData) => {
    setShowConfirmation(true);
    setItemToArchive(rowData);
    setRefreshData(false);
  };

  const confirmArchive = async () => {
    if (itemToArchive) {
      try {
        const archiveID = itemToArchive?.staff_assignments?.id;
        const result = await fetchData(
          `/staff-schedules/${archiveID}`,
          'PATCH'
        );
        const { status } = result;

        if (status === 204) {
          setArchiveModalPopUp(true);
          setRefreshData(true);
        } else {
          toast.error('Error Archiving Staff', { autoClose: 3000 });
        }
      } catch (error) {
        console.error('Error archiving data:', error);
      }

      setShowConfirmation(false);
      setItemToArchive(null);
    }
  };

  return (
    <>
      <div className="filterBar">
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className="d-flex">
              <div className={`${styles.fieldDate} w-60`}>
                <DatePicker
                  dateFormat="MM/dd/yy"
                  className={`custom-datepicker ${styles.datepicker}`}
                  style={{ minWidth: '19rem' }}
                  selected={dateRange.startDate}
                  onChange={handleDateChange}
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  selectsRange
                  placeholderText="Dates"
                />
                {(dateRange?.startDate || dateRange?.endDate) && (
                  <span
                    className={`position-absolute ${styles.dateCross}`}
                    onClick={resetDateHandler}
                  >
                    <svg
                      height="20"
                      width="20"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      focusable="false"
                      className="css-tj5bde-Svg"
                      onMouseEnter={() => setDateCrossColor('#999999')}
                      onMouseLeave={() => setDateCrossColor('#cccccc')}
                    >
                      <path
                        fill={dateCrossColor}
                        d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
                      ></path>
                    </svg>
                  </span>
                )}
                {(dateRange?.startDate || dateRange?.endDate) && (
                  <label>Dates</label>
                )}
              </div>
              <div className="me-3" />
              <SelectDropdown
                placeholder={'Period'}
                defaultValue={period}
                selectedValue={period}
                removeDivider
                showLabel
                onChange={handlePeriod}
                options={periodDropdownOptions}
              />
              <div className="me-3" />

              <SelectDropdown
                placeholder={'Role'}
                defaultValue={role}
                selectedValue={role}
                removeDivider
                showLabel
                onChange={handleRole}
                options={roleDropDown}
              />
              <div className="me-3" />
              <SelectDropdown
                placeholder={'Status'}
                defaultValue={isActive}
                selectedValue={isActive}
                removeDivider
                showLabel
                onChange={handleIsActive}
                options={statusOptions}
              />
            </form>
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        <div className="buttons d-flex align-items-center">
          <div className="dropdown-center">
            <div
              className={`optionsIcon `}
              style={{
                marginRight: '30px',
                cursor: 'pointer',
                color: '#387DE5',
              }}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <SvgComponent name={'DownloadIcon'} /> Export Data
            </div>
            <ul className="dropdown-menu">
              <li>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="dropdown-item"
                >
                  PDF
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  CSV
                </Link>
              </li>
            </ul>
          </div>
          <button className="btn btn-primary" onClick={handlePrintClick}>
            Print Schedule
          </button>
        </div>
        <TableList
          isLoading={isLoading}
          data={scheduleData}
          headers={tableHeaders}
          handleSort={handleSort}
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
        <PrintModal
          visible={isPrintModalVisible}
          onCancel={() => setPrintModalVisible(false)}
          heading={'Print Schedule'}
          description={'Select dates to print schedules.'}
          onPrint={handlePrint}
          printingData={printScheduleData}
        />
        <SuccessPopUpModal
          title={'Success!'}
          message={'Schedule is archieved.'}
          modalPopUp={archiveModalPopUp}
          setModalPopUp={setArchiveModalPopUp}
          onConfirm={() => {
            setArchiveModalPopUp(false);
          }}
          showActionBtns={true}
        />
        <ConfirmModal
          showConfirmation={showConfirmation}
          onCancel={cancelArchive}
          onConfirm={confirmArchive}
          icon={ConfirmArchiveIcon}
          heading={'Confirmation'}
          description={'Are you sure you want to archive?'}
        />
      </div>
    </>
  );
};

export default StaffListSchedule;
