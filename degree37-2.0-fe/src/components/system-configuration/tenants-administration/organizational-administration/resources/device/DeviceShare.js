import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../../../common/topbar/index';
import styles from './device.module.scss';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import jwt from 'jwt-decode';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import * as yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import axios from 'axios';

const DeviceShare = ({ deviceId }) => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const shareType = 'Device';
  const bearerToken = localStorage.getItem('token');

  const [id, setId] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [cancelModal, setCancelModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const [isStateDirty, setIsStateDirty] = useState(false);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [errors, setErrors] = useState({
    start_date: '',
    end_date: '',
    from: '',
    to: '',
  });
  const [deviceData, setDeviceData] = useState({});
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'Share Device',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/share`,
    },
  ];
  const validationSchema = yup.object({
    start_date: yup.string().required('Start Date is required'),
    end_date: yup.string().required('End Date is required'),
    from: yup.string().required('From is required'),
    to: yup.string().required('To is required'),
  });
  useEffect(() => {
    const getData = async (deviceId) => {
      const result = await fetch(`${BASE_URL}/devices/${deviceId}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        setFrom(data.collection_operation.id);
      } else {
        toast.error('Error Fetching Tenant Details', { autoClose: 3000 });
      }
    };
    if (deviceId) {
      getData(deviceId);
    }
  }, [deviceId]);

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    const getDevice = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/devices/${deviceId}`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        });
        setDeviceData(data?.data);
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    };
    const getMaintenances = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/devices/${deviceId}/maintenances`,
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        setMaintenanceData(data?.data);
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
        console.log(error);
      }
    };
    getMaintenances();
    getDevice();
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }
    getCollectionOperations();
  }, []);
  const getCollectionOperations = async () => {
    const result = await fetch(
      `${BASE_URL}/business_units/collection_operations/list`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          method: 'GET',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setCollectionOperationData(data);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };
  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const body = {
        start_date: startDate,
        end_date: endDate,
        from: parseInt(from),
        to: parseInt(to),
        created_by: +id,
      };
      const res = await fetch(`${BASE_URL}/devices/${deviceId}/shares`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(body),
      });
      let { status, response } = await res.json();
      if (status === 'success') {
        // Handle successful response
        setIsNavigate(true);
        setSuccessModal(true);
      } else if (response?.status === 400) {
        toast.error('Failed to schedule device share.', { autoClose: 3000 });
        // Handle bad request
      } else {
        toast.error('Failed to schedule device share.', { autoClose: 3000 });
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    validationSchema
      .validate(
        {
          start_date: startDate,
          end_date: endDate,
          from: from,
          to: to,
        },
        { abortEarly: false }
      )
      .then(async () => {
        setErrors({});
        onSubmit();
      })
      .catch((validationErrors) => {
        const newErrors = {};
        validationErrors?.inner?.forEach((error) => {
          newErrors[error?.path] = error.message;
        });
        setErrors(newErrors);
      });
  };

  const handleOnBlur = async (key, value) => {
    if (!value || value === 'reset') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: 'Required',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: '',
      }));
    }
  };

  // let isDisabled =
  //   startDate &&
  //   endDate &&
  //   from &&
  //   to &&
  //   !errors.start_date &&
  //   !errors.end_date &&
  //   !errors.from &&
  //   !errors.to;

  // isDisabled = Boolean(isDisabled);
  const generateExcludedDates = () => {
    const allExcludedDates = maintenanceData?.map((item) => ({
      start: new Date(item?.dm_start_date_time),
      end: new Date(item?.dm_end_date_time),
    }));

    const excludedDatesWithSameStartEnd = allExcludedDates
      .filter((interval) => interval.start.getDate() === interval.end.getDate())
      .map((interval) => interval.start);

    const excludedDatesWithDifferentStartEnd = allExcludedDates.filter(
      (interval) => interval.start.getDate() !== interval.end.getDate()
    );

    return {
      allExcludedDates,
      excludedDatesWithSameStartEnd,
      excludedDatesWithDifferentStartEnd,
    };
  };

  const { excludedDatesWithSameStartEnd, excludedDatesWithDifferentStartEnd } =
    generateExcludedDates();

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Devices'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner mt-5">
        <form className={styles.device}>
          <div className="formGroup mt-5">
            <h5>Share Device</h5>

            <div className="form-field">
              <div className="field">
                <DatePicker
                  dateFormat="MM/dd/yyyy"
                  className="custom-datepicker"
                  placeholderText="Start Date"
                  selected={startDate}
                  minDate={new Date()}
                  maxDate={Date.parse(deviceData?.retire_on)}
                  onBlur={(e) => handleOnBlur('start_date', e.target.value)}
                  onChange={(date) => {
                    handleOnBlur('start_date', date);
                    setIsStateDirty(true);
                    setStartDate(date);
                    setEndDate('');
                  }}
                  excludeDates={excludedDatesWithSameStartEnd}
                  excludeDateIntervals={excludedDatesWithDifferentStartEnd}
                />
                {startDate && (
                  <label
                    className={`text-secondary custom-label ${styles.labelselected} ml-1 mt-1 pb-2`}
                  >
                    Start Date
                  </label>
                )}
              </div>
              {errors?.start_date && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.start_date}</p>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field">
                <DatePicker
                  minDate={startDate}
                  dateFormat="MM/dd/yyyy"
                  className="custom-datepicker"
                  placeholderText="End Date"
                  selected={endDate}
                  onBlur={(e) => handleOnBlur('end_date', e.target.value)}
                  onChange={(date) => {
                    handleOnBlur('end_date', date);
                    setIsStateDirty(true);
                    setEndDate(date);
                  }}
                  maxDate={Date.parse(deviceData?.retire_on)}
                />
                {endDate && (
                  <label
                    className={`text-secondary custom-label ${styles.labelselected} ml-1 mt-1 pb-2`}
                  >
                    End Date
                  </label>
                )}
              </div>
              {errors?.end_date && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.end_date}</p>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field">
                {from && (
                  <label
                    style={{ fontSize: '12px', top: '24%', color: '#555555' }}
                  >
                    From*
                  </label>
                )}
                <select
                  className={styles.selectBorder}
                  style={{
                    backgroundColor: '#F5F5F5',
                    color: !from ? '#a3a3a3' : '#555555',
                    padding: !from ? '10px 20px' : '20px 20px 10px 19px',
                  }}
                  onBlur={(e) => handleOnBlur('from', e.target.value)}
                  onChange={(e) => {
                    setIsStateDirty(true);
                    e.target.value === 'reset'
                      ? setFrom('')
                      : setFrom(e.target.value);
                    setTo('');
                  }}
                  disabled={true}
                  name="from"
                  id="from"
                >
                  <option selected={!from} value="reset">
                    From*
                  </option>
                  {collectionOperationData?.map(
                    (collectionOperationItem, key) => (
                      <option
                        key={key}
                        value={collectionOperationItem.id}
                        selected={collectionOperationItem.id === from}
                      >
                        {collectionOperationItem.name}
                      </option>
                    )
                  )}
                </select>
                {errors?.from && (
                  <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                    <p>{errors.from}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="form-field">
              <div className="field">
                {to && (
                  <label
                    style={{ fontSize: '12px', top: '24%', color: '#555555' }}
                  >
                    To*
                  </label>
                )}
                <select
                  style={{
                    color: !to ? '#a3a3a3' : '#212529',
                    padding: !to ? '10px 20px' : '20px 20px 10px 19px',
                  }}
                  onBlur={(e) => handleOnBlur('to', e.target.value)}
                  onChange={(e) => {
                    setIsStateDirty(true);
                    e.target.value === 'reset'
                      ? setTo('')
                      : setTo(e.target.value);
                  }}
                  name="to"
                  id="to"
                >
                  <option selected={!to} value="reset">
                    To*
                  </option>
                  {collectionOperationData?.map(
                    (collectionOperationItem, key) => {
                      return !from || collectionOperationItem.id != from ? (
                        <option
                          key={key}
                          value={collectionOperationItem.id}
                          selected={collectionOperationItem.id === to}
                        >
                          {collectionOperationItem.name}
                        </option>
                      ) : null;
                    }
                  )}
                </select>
                {errors?.to && (
                  <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                    <p>{errors.to}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="share-type"
                  placeholder=" "
                  disabled
                  value={shareType}
                />
                <label>Share Type</label>
              </div>
            </div>
          </div>
        </form>
        <div className="form-footer">
          <button
            className="btn btn-secondary"
            onClick={() =>
              isStateDirty
                ? setCancelModal(true)
                : navigate(
                    '/system-configuration/tenant-admin/organization-admin/resources/devices'
                  )
            }
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Share
          </button>
        </div>
      </div>
      <SuccessPopUpModal
        title={'Success!'}
        message={'Device Share scheduled.'}
        modalPopUp={successModal}
        setModalPopUp={setSuccessModal}
        showActionBtns={true}
        isNavigate={isNavigate}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resources/devices'
        }
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={cancelModal}
        isNavigate={true}
        setModalPopUp={setCancelModal}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resources/devices'
        }
      />
    </div>
  );
};

export default DeviceShare;
