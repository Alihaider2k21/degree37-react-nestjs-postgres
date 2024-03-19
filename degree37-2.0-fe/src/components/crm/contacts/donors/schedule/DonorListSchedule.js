import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CRM_DONOR_SCHEDULE_PATH } from '../../../../../routes/path';
import TableList from '../../../../common/tableListing';
import SelectDropdown from '../../../../common/selectDropdown';
import { fetchData } from '../../../../../helpers/Api';
import Pagination from '../../../../common/pagination';
import DatePicker from 'react-datepicker';
import { DonorBreadCrumbsData } from '../../donor/DonorBreadCrumbsData';
import styles from './index.module.scss';
import CancelModalPopUp from '../../../../common/cancelModal';
import moment from 'moment';
import SuccessPopUpModal from '../../../../common/successModal';

const statusOptions = [
  { label: 'Scheduled', value: 1, className: 'badge Grey' },
  { label: 'Complete', value: 2, className: 'badge active' },
  { label: 'Incomplete', value: 3, className: 'badge Yellow' },
  { label: 'Cancelled', value: 4, className: 'badge inactive' },
];

const initialDate = {
  startDate: null,
  endDate: null,
};
const DonorListSchedule = () => {
  const [isActive, setIsActive] = useState(null);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();
  const [donationType, setDonationType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState([]);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [donationTypeData, setDonationTypeData] = useState([]);
  const [searched, setSearched] = useState(false);
  const [dateRange, setDateRange] = useState(initialDate);
  const [dateCrossColor, setDateCrossColor] = useState('#cccccc');
  const [modalPopUp, setModalPopUp] = useState(false);
  const [locationDropdownOptions, setLocationDropdownOptions] = useState([]);
  const [archiveStatus, setArchiveStatus] = useState(false);
  const [cancelAppointmentStatus, setCancelAppointmentStatus] = useState(false);
  const [appointmentId, setApointmentId] = useState();
  const [cancelAppointmentModal, setCancelAppointmentModal] = useState(false);
  const [archiveID, setArchiveID] = useState('');
  const { donorId } = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...DonorBreadCrumbsData,
      {
        label: 'View Donor',
        class: 'active-label',
        link: `/crm/contacts/donor/${donorId}/view`,
      },
      {
        label: 'Schedule',
        class: 'active-label',
        link: CRM_DONOR_SCHEDULE_PATH.LIST.replace(':donorId', donorId),
      },
    ]);
  }, []);
  const resetDateHandler = () => {
    setDateRange({ ...initialDate });
  };
  const getWithStatus = async () => {
    setIsLoading(true);
    let search = context?.search?.length > 1 ? context?.search : '';
    const result = await fetchData(
      `/contact-donors/donor-appointments?donor_id=${donorId}&limit=${limit}&page=${currentPage}&status=${
        isActive?.value ?? ''
      }&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}&procedure_type=${
        donationType?.value || ''
      }&dateRange=${
        dateRange?.startDate && dateRange?.endDate
          ? moment(dateRange?.startDate).format('YYYY-MM-DD') +
            ' ' +
            moment(dateRange?.endDate).format('YYYY-MM-DD')
          : ''
      }&locationType=${location?.label || ''}`
    );
    const { data, status, count } = result;
    if (status === 200) {
      setScheduleData(
        data.map((singleData) => {
          let tempStatus = statusOptions.find(
            (option) =>
              option.value === Number(singleData?.donor_appointment?.status)
          );
          return {
            ...singleData,
            note: singleData?.donor_appointment?.note,
            don_acc:
              singleData?.date?.location?.account_id ||
              singleData?.date?.location?.id,
            date: singleData?.date?.date,
            location: singleData?.date?.location?.location,
            slot_start_time: moment(
              singleData?.shifts_slots?.slot_start_time
            ).format('hh:mm A z'),
            status: tempStatus?.label,
            className: tempStatus?.className,
            donation_type: singleData?.procedure_types?.donation_type,
          };
        })
      );
      setTotalRecords(count);
      if (!(data?.length > 0) && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      setIsLoading(false);
    } else {
      toast.error('Error Getting Schedule ', { autoClose: 3000 });
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
    donationType,
    location,
    limit,
    archiveStatus,
    cancelAppointmentStatus,
  ]);

  useEffect(() => {
    if (
      (dateRange?.startDate && dateRange?.endDate) ||
      (!dateRange?.startDate && !dateRange?.endDate)
    ) {
      getWithStatus();
    }
  }, [dateRange.startDate, dateRange.endDate]);
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, sortOrder]);

  const tableHeaders = [
    { name: 'date', label: 'Date', sortable: true },
    { name: 'location', label: 'Location', sortable: true },
    {
      name: 'slot_start_time',
      label: 'Appointment Time',
      sortable: true,
    },
    { name: 'donation_type', label: 'Donation Type', sortable: true },
    { name: 'note', label: 'Note', sortable: true },
    {
      name: 'status',
      label: 'Status',
      sortable: true,
    },
  ];
  const optionsConfig = [
    {
      label: 'View',
      path: (rowData) =>
        `/crm/contacts/donor/${donorId}/view/schedule/${rowData?.donor_appointment?.id}`,
    },
    {
      label: 'Edit',
      path: (rowData) =>
        CRM_DONOR_SCHEDULE_PATH.EDIT.replace(':donorId', donorId).replace(
          ':schedule',
          rowData?.donor_appointment?.id
        ),
    },
    {
      label: 'Cancel',
      action: (rowData) => {
        setCancelAppointmentModal(true);
        setApointmentId(rowData?.donor_appointment?.id);
      },
    },
    {
      label: 'Schedule Again',
      path: (rowData) => {
        console.log({ rowData });
        return (
          CRM_DONOR_SCHEDULE_PATH.CREATE.replace(':donorId', donorId) +
          `?don-acc=${rowData?.don_acc}&type=${rowData?.donor_appointment?.type}&donation-type=${rowData?.procedure_types?.donation_id}`
        );
      },
    },
    {
      label: 'Archive',
      action: (rowData) => {
        setModalPopUp(rowData?.donor_appointment?.id);
        setArchiveID(rowData?.donor_appointment?.id);
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

  const getDonationTypeDropdown = async () => {
    try {
      const donationTypes = await fetchData(
        '/procedure_types?fetchAll=true',
        'GET'
      );
      let formatDonationtypes = donationTypes?.data?.map(
        (donationTypeSingle) => ({
          label: donationTypeSingle?.name,
          value: donationTypeSingle?.id,
        })
      );
      const locationsDropdown = await fetchData(
        '/crm/locations?fetchAll=true',
        'GET'
      );
      let formatLocationsDropdown = locationsDropdown?.data?.map(
        (donationTypeSingle) => ({
          label: donationTypeSingle?.name,
          value: donationTypeSingle?.id,
        })
      );
      setDonationTypeData([...formatDonationtypes]);
      setLocationDropdownOptions([...formatLocationsDropdown]);
    } catch (error) {
      toast.error('Error Fetching Dropdown Data');
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    getDonationTypeDropdown();
  }, []);
  const handleAddClick = () => {
    navigate(CRM_DONOR_SCHEDULE_PATH.CREATE.replace(':donorId', donorId));
  };
  const handleIsActive = (value) => {
    setIsActive(value);
  };
  const handleArchive = async () => {
    if (archiveID) {
      const response = await fetchData(
        `/contact-donors/donor-appointments/archive/${archiveID}`
      );
      let data = await response;
      if (data.status === 'success') {
        setArchiveStatus(true);
      } else {
        toast.error('Failed to Archive Task.');
      }
      setModalPopUp(false);
    }
  };
  const handleAppointmentCancel = async () => {
    const cancelStatus = statusOptions.filter(
      (i) => i.label === 'Cancelled'
    )[0];
    const body = { status: cancelStatus.value.toString() };
    if (appointmentId) {
      const response = await fetchData(
        `/contact-donors/donors/${donorId}/appointments/cancel/${appointmentId}`,
        'PUT',
        body
      );
      let data = await response;
      if (data.status === 'success') {
        setCancelAppointmentStatus(true);
      } else {
        toast.error('Failed to Cancel Appointment.');
      }
      setCancelAppointmentModal(false);
    }
  };
  const handleLocation = (value) => {
    setLocation(value);
  };
  const handleDonationType = (value) => {
    setDonationType(value);
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
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    const value = { startDate: start, endDate: end };
    setDateRange(value);
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
                  placeholderText="Date Range"
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
                  <label>Date Range</label>
                )}
              </div>
              <div className="me-3" />
              <SelectDropdown
                placeholder={'Location'}
                defaultValue={location}
                selectedValue={location}
                removeDivider
                showLabel
                onChange={handleLocation}
                options={locationDropdownOptions}
              />
              <div className="me-3" />

              <SelectDropdown
                placeholder={'Donation Type'}
                defaultValue={donationType}
                selectedValue={donationType}
                removeDivider
                showLabel
                onChange={handleDonationType}
                options={donationTypeData}
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
        <div className="buttons">
          <button className="btn btn-primary" onClick={handleAddClick}>
            New Appointment
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
        {!isLoading && (
          <Pagination
            limit={limit}
            setLimit={setLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalRecords={totalRecords}
          />
        )}
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
        message={'Schedule is archived.'}
        modalPopUp={archiveStatus}
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setArchiveStatus}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Are you sure you want to cancel?"
        modalPopUp={cancelAppointmentModal}
        isNavigate={false}
        setModalPopUp={setCancelAppointmentModal}
        methodsToCall={true}
        methods={handleAppointmentCancel}
        // redirectPath={listLink}
      />
    </>
  );
};

export default DonorListSchedule;
