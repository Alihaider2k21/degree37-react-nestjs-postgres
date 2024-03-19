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

import 'react-datepicker/dist/react-datepicker.css';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import moment from 'moment';

const VehicleScheduleMaintenance = ({ vehicleId, maintenanceId }) => {
  const bearerToken = localStorage.getItem('token');
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [id, setId] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [description, setDescription] = useState('');
  const [preventBooking, setPreventBooking] = useState(true);
  const [cancelModal, setCancelModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const [isStateDirty, setIsStateDirty] = useState(false);
  const [vehicleShareMaintenaceData, setVehicleShareMaintenaceData] = useState(
    []
  );
  const [retireDate, setRetireDate] = useState('');
  // const [navigateLink, setNavigateLink] = useState('');
  const [errors, setErrors] = useState({
    start_date: '',
    end_date: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'View Vehicle',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/view`,
    },
  ];

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }
  }, []);

  const handleOnBlur = async (key, value) => {
    if (!value) {
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

  useEffect(() => {
    const getVehicleData = async (vehicleId) => {
      const result = await fetch(`${BASE_URL}/vehicles/${vehicleId}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        setRetireDate(data.vehicle.retire_on);
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
        const maintenace = maintenaceData.filter(
          (item) => item.vm_id !== maintenanceId
        );
        // Iterate over vehicleShareData to get start and end dates
        const vehicleShareDates = vehicleShareData.map((item) => ({
          start: new Date(moment(item.vs_start_date).startOf('day').format()),
          end: new Date(moment(item.vs_end_date).endOf('day').format()),
        }));

        // Extract start and end dates from maintenace
        const maintenaceDates = maintenace.map((item) => ({
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
    const getMaintenaceData = async (maintenanceId) => {
      const bearerToken = localStorage.getItem('token');
      const result = await fetch(
        `${BASE_URL}/vehicles/${vehicleId}/maintenances/${maintenanceId}`,
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
        setStartDate(new Date(data.vm_start_date_time));
        setEndDate(new Date(data.vm_end_date_time));
        setDescription(data.vm_description);
        setPreventBooking(data.vm_prevent_booking);
      } else {
        toast.error('Error Fetching Vehicle Maintenance Details', {
          autoClose: 3000,
        });
      }
    };
    if (maintenanceId) {
      getMaintenaceData(maintenanceId);
      getShareMaintenaceData(vehicleId);
      getVehicleData(vehicleId);
    } else {
      getVehicleData(vehicleId);
      getShareMaintenaceData(vehicleId);
    }
  }, [vehicleId, maintenanceId]);
  // console.log(startDate, endDate, description, preventBooking);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitCondition = !startDate || !endDate || !description;
      if (submitCondition) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          start_date: !startDate ? 'Start date is required.' : '',
          end_date: !endDate ? 'End date is required.' : '',
          description: !description ? 'Description is required.' : '',
        }));
        return;
      }

      if (checkDateOverlap()) {
        toast.error(
          'Vehicle maintenance dates overlap with vehicle maintenance or share dates.'
        );
        return;
      }
      const body = {
        start_date_time: startDate,
        end_date_time: endDate,
        description: description,
        prevent_booking: preventBooking,
        created_by: +id,
      };
      setIsSubmitting(true);
      if (maintenanceId) {
        const res = await fetch(
          `${BASE_URL}/vehicles/${vehicleId}/maintenances/${maintenanceId}`,
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
          toast.error('Failed to update vehicle maintenance.', {
            autoClose: 3000,
          });
        }
      } else {
        const res = await fetch(
          `${BASE_URL}/vehicles/${vehicleId}/maintenances`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify(body),
          }
        );
        let { status, status_code, response } = await res.json();
        if (status === 'success') {
          setSuccessModal(true);
        } else if (status_code === 404) {
          toast.error(response, {
            autoClose: 3000,
          });
        } else {
          toast.error('Failed to schedule vehicle maintenance.', {
            autoClose: 3000,
          });
        }
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  // let isDisabled =
  //   startDate &&
  //   endDate &&
  //   description &&
  //   !errors.start_date &&
  //   !errors.end_date &&
  //   !errors.description;

  // isDisabled = Boolean(isDisabled);

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
            <h5>{maintenanceId ? 'Edit ' : ''}Schedule Maintenance</h5>

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
                    setIsStateDirty(true);
                    handleOnBlur('start_date', date);
                    setEndDate('');
                    setStartDate(date);
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
                <DatePicker
                  minDate={startDate}
                  maxDate={retireDate ? new Date(retireDate) : ''}
                  excludeDateIntervals={vehicleShareMaintenaceData}
                  showTimeSelect
                  dateFormat="Pp"
                  className={`custom-datepicker${
                    !endDate ? ' custom-datepicker-placeholder' : ''
                  }`}
                  placeholderText="End Date/Time*"
                  selected={endDate}
                  onBlur={(e) => handleOnBlur('end_date', e.target.value)}
                  onChange={(date) => {
                    setIsStateDirty(true);
                    handleOnBlur('end_date', date);
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
                {description && (
                  <label
                    style={{ fontSize: '12px', top: '10%', color: '#555555' }}
                  >
                    Description*
                  </label>
                )}
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Description*"
                  name="description"
                  value={description}
                  onBlur={(e) => handleOnBlur('description', e.target.value)}
                  onChange={(e) => {
                    setIsStateDirty(true);
                    setDescription(e.target.value);
                  }}
                />
              </div>
              {errors?.description && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.description}</p>
                </div>
              )}
            </div>

            <div className="form-field"></div>

            <div className="form-field checkbox">
              <span className="toggle-text">Prevent Booking</span>
              <label htmlFor="toggle" className="switch">
                <input
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  name="prevent_booking"
                  checked={preventBooking}
                  onChange={(e) => {
                    setIsStateDirty(true);
                    setPreventBooking(e.target.checked);
                  }}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </form>
        <div className="form-footer">
          <button
            className="btn btn-md btn-link me-0 pe-4"
            onClick={() =>
              isStateDirty
                ? setCancelModal(true)
                : navigate(
                    '/system-configuration/tenant-admin/organization-admin/resources/vehicles'
                  )
            }
          >
            Cancel
          </button>

          {maintenanceId ? (
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
        message={`Vehicle Maintenance ${
          maintenanceId ? 'updated' : 'scheduled'
        }.`}
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

export default VehicleScheduleMaintenance;
