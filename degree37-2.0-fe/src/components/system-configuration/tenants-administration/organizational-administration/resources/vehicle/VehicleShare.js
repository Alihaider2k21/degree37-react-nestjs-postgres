import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../../../common/topbar/index';
import styles from './vehicle.module.scss';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import jwt from 'jwt-decode';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import * as yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import SelectDropdown from '../../../../../common/selectDropdown';
import moment from 'moment';

const VehicleShare = ({ vehicleId, shareId }) => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const shareType = 'Vehicle';
  const bearerToken = localStorage.getItem('token');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [id, setId] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [cancelModal, setCancelModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  // const [navigateLink, setNavigateLink] = useState('');
  const [isStateDirty, setIsStateDirty] = useState(false);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [vehicleShareMaintenaceData, setVehicleShareMaintenaceData] = useState(
    []
  );
  const [retireDate, setRetireDate] = useState('');
  const [errors, setErrors] = useState({
    start_date: '',
    end_date: '',
    from: '',
    to: '',
  });

  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'View Vehicle',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/view`,
    },
  ];
  const validationSchema = yup.object({
    start_date: yup.string().required('Start Date is required'),
    end_date: yup.string().required('End Date is required'),
    from: yup.string().required('From is required'),
    to: yup.string().required('To is required'),
  });
  useEffect(() => {
    const getData = async (vehicleId, retire = false) => {
      const result = await fetch(`${BASE_URL}/vehicles/${vehicleId}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        if (retire) {
          setRetireDate(data.vehicle.retire_on);
        } else {
          setRetireDate(data.vehicle.retire_on);
          setFrom({
            value: data.vehicle.collection_operation_id.id,
            label: data.vehicle.collection_operation_id.name,
          });
        }
      } else {
        toast.error('Error Fetching Vehicle Details', { autoClose: 3000 });
      }
    };

    const getShareData = async (shareId) => {
      const result = await fetch(
        `${BASE_URL}/vehicles/${vehicleId}/share/${shareId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        data = data[0];
        setFrom({
          value: data.from.id,
          label: data.from.name,
        });
        setTo({
          value: data.to.id,
          label: data.to.name,
        });
        setStartDate(new Date(data.start_date));
        setEndDate(new Date(data.end_date));
      } else {
        toast.error('Error Fetching Vehicle Details', { autoClose: 3000 });
      }
    };

    const getShareMaintenaceData = async (vehicleId) => {
      const bearerToken = localStorage.getItem('token');
      const maintenanceResult = await fetch(
        `${BASE_URL}/vehicles/${vehicleId}/maintenances`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      const vehicleShareResult = await fetch(
        `${BASE_URL}/vehicles/${vehicleId}/shares`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const { data: maintenaceData } = await maintenanceResult.json();
      const { data: vehicleShareData } = await vehicleShareResult.json();
      if (
        (maintenanceResult.ok || maintenanceResult.status === 200) &&
        (vehicleShareResult.ok || vehicleShareResult.status === 200)
      ) {
        const vehicleShare = vehicleShareData.filter(
          (item) => item.vs_id !== shareId
        );
        // Iterate over vehicleShare to get start and end dates
        const vehicleShareDates = vehicleShare.map((item) => ({
          start: new Date(moment(item.vs_start_date).startOf('day').format()),
          end: new Date(moment(item.vs_end_date).endOf('day').format()),
        }));

        // Extract start and end dates from maintenaceData
        const maintenaceDates = maintenaceData.map((item) => ({
          start: new Date(
            moment(item.vm_start_date_time).startOf('day').format()
          ),
          end: new Date(moment(item.vm_end_date_time).endOf('day').format()),
        }));

        const combinedData = [...maintenaceDates, ...vehicleShareDates];
        setVehicleShareMaintenaceData(combinedData);
      } else {
        toast.error('Error Fetching Vehicle Maintenance Details', {
          autoClose: 3000,
        });
      }
    };

    if (shareId) {
      getShareData(shareId);
      getShareMaintenaceData(vehicleId);
      getData(vehicleId, true);
    } else {
      getData(vehicleId);
      getShareMaintenaceData(vehicleId);
    }
  }, [vehicleId, shareId]);

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
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
      `${BASE_URL}/business_units/collection_operations/list?status=true`,
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
      setCollectionOperationData(
        data.map((item) => ({ label: item.name, value: item.id }))
      );
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  const handleOnBlur = async (key, value) => {
    if (!value || value === 'reset') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: `${(key.charAt(0).toUpperCase() + key.slice(1)).replace(
          /_/g,
          ' '
        )} is required.`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: '',
      }));
    }
  };

  const checkDateOverlap = () => {
    // Convert shareStartDate and shareEndDate to Date objects
    const shareStart = new Date(startDate);
    const shareEnd = new Date(endDate);

    // Loop through the dateRanges array and check for overlap
    for (const dateRange of vehicleShareMaintenaceData) {
      const rangeStart = new Date(dateRange.start);
      const rangeEnd = new Date(dateRange.end);

      // Check for overlap
      if (shareStart <= rangeEnd && shareEnd >= rangeStart) {
        return true; // Overlapping dates found
      }
    }

    return false; // No overlapping dates found
  };

  const onSubmit = async () => {
    try {
      if (checkDateOverlap()) {
        toast.error(
          'Vehicle share overlap with vehicle maintenance or share dates.'
        );
        return;
      }
      setIsSubmitting(true);
      const body = {
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        from: parseInt(from.value),
        to: parseInt(to.value),
        created_by: +id,
      };
      if (shareId) {
        const res = await fetch(
          `${BASE_URL}/vehicles/${vehicleId}/share/${shareId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify(body),
          }
        );
        let { status, status_code, response } = await res.json();
        if (status === 'success' || status_code === 201) {
          setSuccessModal(true);
        } else if (status_code === 404) {
          toast.error(response, {
            autoClose: 3000,
          });
        } else {
          toast.error('Failed to schedule vehicle share.', { autoClose: 3000 });
        }
      } else {
        const res = await fetch(`${BASE_URL}/vehicles/${vehicleId}/shares`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify(body),
        });
        let { status, status_code, response } = await res.json();
        if (status === 'success') {
          setSuccessModal(true);
        } else if (status_code === 404) {
          toast.error(response, {
            autoClose: 3000,
          });
        } else {
          toast.error('Failed to schedule vehicle share.', { autoClose: 3000 });
        }
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
          from: from?.value,
          to: to?.value,
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

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Vehicles'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner mt-5">
        <form className={styles.vehicle}>
          <div className="formGroup mt-5">
            <h5>{shareId ? 'Edit ' : ''}Share Vehicle</h5>

            <div className="form-field">
              <div className="field">
                {startDate && (
                  <label
                    style={{
                      fontSize: '12px',
                      top: '24%',
                      color: '#555555',
                      zIndex: 1,
                    }}
                  >
                    Start Date/Time*
                  </label>
                )}
                <DatePicker
                  showTimeSelect
                  dateFormat="Pp"
                  excludeDateIntervals={vehicleShareMaintenaceData}
                  className={`custom-datepicker${
                    !startDate ? ' custom-datepicker-placeholder' : ''
                  }`}
                  placeholderText="Start Date/Time*"
                  selected={startDate}
                  minDate={new Date()}
                  maxDate={retireDate ? new Date(retireDate) : ''}
                  onBlur={(e) => handleOnBlur('start_date', e.target.value)}
                  onChange={(date) => {
                    handleOnBlur('start_date', date);
                    setIsStateDirty(true);
                    setStartDate(date);
                    setEndDate('');
                  }}
                />
              </div>
              {errors?.start_date && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.start_date}</p>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field">
                {endDate && (
                  <label
                    style={{
                      fontSize: '12px',
                      top: '24%',
                      color: '#555555',
                      zIndex: 1,
                    }}
                  >
                    End Date/Time*
                  </label>
                )}
                {console.log(vehicleShareMaintenaceData)}
                <DatePicker
                  showTimeSelect
                  dateFormat="Pp"
                  minDate={startDate}
                  maxDate={retireDate ? new Date(retireDate) : ''}
                  excludeDateIntervals={vehicleShareMaintenaceData}
                  className={`custom-datepicker${
                    !endDate ? ' custom-datepicker-placeholder' : ''
                  }`}
                  placeholderText="End Date/Time*"
                  selected={endDate}
                  onBlur={(e) => handleOnBlur('end_date', e.target.value)}
                  onChange={(date) => {
                    handleOnBlur('end_date', date);
                    setIsStateDirty(true);
                    setEndDate(date);
                  }}
                />
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
                <SelectDropdown
                  styles={{ root: 'w-100 m-0' }}
                  placeholder={'From*'}
                  selectedValue={from}
                  disabled={true}
                  removeDivider
                  showLabel={true}
                  onChange={(val) => {
                    if (val) {
                      setIsStateDirty(true);
                      setFrom(val);
                      setTo(null);
                    } else {
                      setFrom(val);
                    }
                  }}
                  options={collectionOperationData}
                />
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
                <SelectDropdown
                  styles={{ root: 'w-100 m-0' }}
                  placeholder={'To*'}
                  selectedValue={to}
                  removeDivider
                  onChange={(val) => {
                    if (val) {
                      setIsStateDirty(true);
                      setTo(val);
                    } else {
                      setTo('');
                    }
                  }}
                  options={collectionOperationData.filter(
                    (collectionOperationItem) =>
                      collectionOperationItem.value !== from?.value
                  )}
                />
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
            className="btn btn-md btn-link me-0 pe-4"
            onClick={() => (isStateDirty ? setCancelModal(true) : navigate(-1))}
          >
            Cancel
          </button>
          {shareId ? (
            <>
              <button
                type="submit"
                className="btn btn-md btn-secondary"
                onClick={(e) => {
                  setIsNavigate(true);
                  handleSubmit(e);
                }}
                disabled={isSubmitting}
              >
                Save & Close
              </button>
              <button
                type="button"
                className="btn btn-md btn-primary"
                onClick={(e) => {
                  setIsNavigate(false);
                  handleSubmit(e);
                }}
                disabled={isSubmitting}
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-md btn-primary"
              onClick={(e) => {
                setIsNavigate(true);
                handleSubmit(e);
              }}
              disabled={isSubmitting}
            >
              Share
            </button>
          )}
        </div>
      </div>
      <SuccessPopUpModal
        title={'Success!'}
        message={`Vehicle Share ${shareId ? 'updated' : 'scheduled'}.`}
        modalPopUp={successModal}
        setModalPopUp={setSuccessModal}
        showActionBtns={true}
        isNavigate={isNavigate}
        redirectPath={-1}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={cancelModal}
        isNavigate={true}
        setModalPopUp={setCancelModal}
        redirectPath={-1}
      />
    </div>
  );
};

export default VehicleShare;
