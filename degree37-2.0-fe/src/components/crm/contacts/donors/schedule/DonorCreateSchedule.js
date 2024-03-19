import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import styles from './index.module.scss';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import TopBar from '../../../../common/topbar/index';
import SelectDropdown from '../../../../common/selectDropdown';
import TableList from '../../../../common/tableListing';
import Pagination from '../../../../common/pagination';
import { DonorBreadCrumbsData } from '../../donor/DonorBreadCrumbsData';
import { CRM_DONOR_SCHEDULE_PATH } from '../../../../../routes/path';
import moment from 'moment';
import { fetchData } from '../../../../../helpers/Api';
import DatePicker from '../../../../common/DatePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TimePicker from 'rc-time-picker';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SvgComponent from '../../../../common/SvgComponent';

const initialDate = {
  startDate: null,
  endDate: null,
};

const DonorCreateSchedule = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT || 25);
  const { donorId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [donorCreateAppointments, setDonorCreateAppointments] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [radius, setRadius] = useState('');
  const [donationTypeData, setDonationTypeData] = useState([]);
  const bearerToken = localStorage.getItem('token');
  const [account, setAccount] = useState(null);
  const [accountsData, setAccountsData] = useState([]);
  const [donorCenterData, setDonorCenterData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState(initialDate);
  const [donationType, setDonationType] = useState(null);
  const [donorCenter, setDonorCenter] = useState(null);
  const [earlierThan, setEarlierThan] = useState();
  const [laterThan, setLaterThan] = useState();
  const [searchParams] = useSearchParams();

  console.log({ searchParams });
  const checkCondition =
    !donationType &&
    !donorCenter &&
    !account &&
    !dateRange?.endDate &&
    !earlierThan &&
    !laterThan &&
    !radius;
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    const value = { startDate: start, endDate: end };
    setDateRange(value);
  };

  const getWithStatus = async () => {
    try {
      setIsLoading(true);
      const result = await fetchData(
        `/contact-donors/donor-appointments/create-listing/${donorId}?limit=${limit}&page=${currentPage}&sortBy=${sortBy}&sortOrder=${sortOrder}&procedureType=${
          donationType?.value || ''
        }&accountType=${account?.value || ''}&donorCenter=${
          donorCenter?.value || ''
        }&earlierThan=${earlierThan || ''}&laterThan=${
          laterThan || ''
        }&dateRange=${
          dateRange?.startDate && dateRange?.endDate
            ? moment(dateRange?.startDate).format('YYYY-MM-DD') +
              ' ' +
              moment(dateRange?.endDate).format('YYYY-MM-DD')
            : ''
        }&radius=${radius}`
      );
      const { data, status, count } = result;
      if (status === 200) {
        setDonorCreateAppointments(
          data.map((singleData) => {
            return {
              ...singleData,
              date: singleData?.date,
              location: singleData?.location,
              promotions: singleData?.promotions,
              appointmentTime:
                singleData?.later_than && singleData?.later_than
                  ? `${moment(singleData?.later_than, 'HH:mm:ss.SSSSSS').format(
                      'hh:mm A z'
                    )} - ${moment(
                      singleData?.earlier_than,
                      'HH:mm:ss.SSSSSS'
                    ).format('hh:mm A z')}`
                  : '',
            };
          })
        );
        setTotalRecords(count);
        if (!(data?.length > 0) && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
      //  else {
      // toast.error('Error Getting Schedule ', { autoClose: 3000 });
      // }
    } catch (error) {
      console.log(error);
      // toast.error('Error Getting Schedule ', { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (checkCondition) return;
    getWithStatus();
  }, [
    sortBy,
    sortOrder,
    currentPage,
    limit,
    donationType,
    donorCenter,
    account,
    earlierThan,
    laterThan,
    radius,
  ]);

  const getFilters = async () => {
    try {
      const result = await fetch(
        `${BASE_URL}/contact-donors/donor-appointments/filters/${donorId}`,
        {
          method: 'GET',
          headers: { authorization: `Bearer ${bearerToken}` },
        }
      );
      const data = await result.json();
      if (data?.status === 200) {
        setDonationTypeData(data.data?.procedureTypes);
        setAccountsData(data.data?.accounts);
        setDonorCenterData(data.data?.donorCenters);
        if (
          searchParams.get('don-acc') &&
          searchParams.get('type') &&
          searchParams.get('donation-type')
        ) {
          console.log(
            searchParams.get('don-acc'),
            searchParams.get('type'),
            searchParams.get('donation-type')
          );
          setDonationType(
            data?.data?.procedureTypes?.filter(
              (procTypes) =>
                procTypes.value === searchParams.get('donation-type')
            )?.[0]
          );
          if (searchParams.get('type') === 'drives') {
            setAccount(
              data?.data?.accounts?.filter(
                (acc) => acc.value === searchParams.get('don-acc')
              )?.[0]
            );
          } else {
            setDonorCenter(
              data?.data?.donorCenters?.filter(
                (dc) => dc.value === searchParams.get('don-acc')
              )?.[0]
            );
          }
        }
      } else toast.error('Error fetching filter data:');
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  useEffect(() => {
    getFilters();
  }, []);

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

  useEffect(() => {
    if (
      (dateRange?.startDate && dateRange?.endDate) ||
      (!dateRange?.startDate && !dateRange?.endDate)
    ) {
      if (checkCondition) return;
      getWithStatus();
    }
  }, [dateRange.startDate, dateRange.endDate]);

  const tableHeaders = [
    { name: 'date', label: 'Date', sortable: true },
    { name: 'location', label: 'Location', sortable: true },
    {
      name: 'appointmentTime',
      label: 'Appointment Time',
      sortable: true,
    },
    { name: 'promotions', label: 'Promotion', width: '15%', sortable: true },
    {
      type: 'custom-component',
      component: (data) => {
        return (
          <Link
            className={`btn btn-secondary px-2 py-1 ${styles.scheduleBtn}`}
            type="button"
            to={
              CRM_DONOR_SCHEDULE_PATH.CREATE_FORM.replace(':donorId', donorId) +
              `?id=${data?.id}&type=${data?.type}`
            }
          >
            Schedule
          </Link>
        );
      },
    },
    {},
  ];

  const breadCrumbsData = [
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
    {
      label: 'Create Appointment',
      class: 'active-label',
      link: CRM_DONOR_SCHEDULE_PATH.CREATE.replace(':donorId', donorId),
    },
  ];

  const handleChange = (e) => {
    let inputValue = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (e.nativeEvent.inputType === 'deleteContentBackward') {
      inputValue = inputValue?.substring(0, inputValue.length - 1);
    }
    setRadius(inputValue);
  };

  return (
    <div className="mainContent">
      <TopBar BreadCrumbsData={breadCrumbsData} BreadCrumbsTitle={'Schedule'} />
      <div className="filterBar">
        <div className="filterInner flex-column">
          <div className="w-100 d-flex justify-content-between align-items-center">
            <h2>Filters</h2>
            <div className={`filter ${styles.w80} py-3 mt-2`}>
              <form className="d-flex justify-content-center align-items-center">
                <div className="form-field w-100 me-3">
                  <SelectDropdown
                    placeholder={'Donation Type'}
                    defaultValue={donationType}
                    selectedValue={donationType}
                    onChange={setDonationType}
                    removeDivider
                    showLabel
                    options={donationTypeData}
                  />
                </div>
                <div className="form-field w-100 me-3">
                  <SelectDropdown
                    placeholder={'Account'}
                    defaultValue={account}
                    selectedValue={account}
                    showLabel
                    removeDivider
                    onChange={setAccount}
                    options={accountsData}
                  />
                </div>
                <div className="form-field w-100 me-3">
                  <SelectDropdown
                    placeholder={'Donor Center'}
                    defaultValue={donorCenter}
                    selectedValue={donorCenter}
                    showLabel
                    removeDivider
                    onChange={setDonorCenter}
                    options={donorCenterData}
                  />
                </div>
                <div className={`${styles.fieldDate} w-100 me-3`}>
                  <DatePicker
                    showLabel={true}
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    isClearable={true}
                    selected={dateRange.startDate}
                    selectsRange
                    placeholderText="Date Range"
                  />
                </div>
              </form>
            </div>
          </div>
          <div
            className={`filter d-flex pb-3 ${styles.w80} align-self-end justify-content-end mb-2`}
          >
            <form className="d-flex justify-content-center align-items-end w-100">
              <div className="form-field w-100 me-3" />
              <div className="w-100 h-100 me-3">
                <TimePickerCust
                  value={laterThan}
                  label={'Later Than'}
                  onChange={setLaterThan}
                />
              </div>
              <div className="w-100 h-100 me-3">
                <TimePickerCust
                  value={earlierThan}
                  label={'Earlier Than'}
                  onChange={setEarlierThan}
                />
              </div>
              <div className="formGroup border-0 m-0 p-0 w-100 me-3">
                <div className="form-field w-100 m-0">
                  <div className="field">
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={radius ? `${radius} miles` : ''}
                      required
                      onChange={handleChange}
                    />
                    {<label>{'Radius'}</label>}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        {checkCondition ? null : (
          <>
            <TableList
              isLoading={isLoading}
              data={donorCreateAppointments}
              headers={tableHeaders}
              handleSort={handleSort}
              sortOrder={sortOrder}
            />

            <Pagination
              limit={limit}
              setLimit={setLimit}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalRecords={totalRecords}
            />
          </>
        )}
      </div>
    </div>
  );
};
export default DonorCreateSchedule;

const TimePickerCust = ({ label, value, onChange }) => {
  return (
    <div className="form-field d-flex h-100 w-100">
      <div
        className={`field schedule-filter-donor custom-class w-100 position-relative`}
      >
        <TimePicker
          disabled={false}
          value={value}
          className="w-100"
          onChange={onChange}
          showSecond={false}
          allowEmpty
          use12Hours
          placeholder={label}
          clearIcon={
            <FontAwesomeIcon
              icon={faTimes}
              className={styles.timerCross}
              role="button"
            />
          }
          inputIcon={<SvgComponent name={'TimeClock'} />}
        />
        {value && (
          <label
            className={`text-secondary ${styles.labelselected} ml-1 mt-1 pb-2 mb-2`}
          >
            {label}
          </label>
        )}
      </div>
    </div>
  );
};
