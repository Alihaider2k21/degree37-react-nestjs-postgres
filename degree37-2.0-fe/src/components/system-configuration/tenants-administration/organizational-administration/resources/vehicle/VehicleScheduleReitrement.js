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

const VehicleScheduleRetirement = ({ vehicleId }) => {
  const bearerToken = localStorage.getItem('token');
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [id, setId] = useState('');
  const [retireOnDate, setRetireOnDate] = useState('');
  const [replaceVehicleId, setReplaceVehicleId] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [tempVehicles, setTempVehicles] = useState([]);
  const [cancelModal, setCancelModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const [isStateDirty, setIsStateDirty] = useState(false);
  const [errors, setErrors] = useState({
    retire_on: '',
    replace_vehicle_id: '',
  });

  const [vehicleName, setVehicleName] = useState('');

  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'Schedule Retirement',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/schedule-retirement`,
    },
  ];

  const getVehicleList = async () => {
    let result = await fetch(`${BASE_URL}/vehicles?fetchAll=true&status=true`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });
    const data = await result.json();

    result = await fetch(`${BASE_URL}/vehicles/${vehicleId}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });
    let vehicleData = await result.json();

    setVehicleName(vehicleData?.data?.vehicle?.name);
    setVehicles(
      data?.data?.vehicles.filter((item) => {
        return (
          +item?.collection_operation_id?.id ==
            +vehicleData?.data?.vehicle?.collection_operation_id?.id &&
          +item?.vehicle_type_id?.id ==
            +vehicleData?.data?.vehicle?.vehicle_type_id?.id &&
          +item.id != vehicleId
        );
      })
    );

    setTempVehicles(
      data?.data?.vehicles.filter((item) => {
        return (
          +item?.collection_operation_id?.id ==
            +vehicleData?.data?.vehicle?.collection_operation_id?.id &&
          +item?.vehicle_type_id?.id ==
            +vehicleData?.data?.vehicle?.vehicle_type_id?.id &&
          +item.id != vehicleId
        );
      })
    );
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }
    getVehicleList();
  }, []);

  const handleOnBlur = async (key, value) => {
    if (!value) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        retire_on: new Date(retireOnDate).toLocaleDateString('en-US'),
        replace_vehicle_id: +replaceVehicleId,
        created_by: +id,
      };
      const res = await fetch(`${BASE_URL}/vehicles/${vehicleId}/retirement`, {
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
        toast.error('Failed to schedule vehicle share.', { autoClose: 3000 });
        // Handle bad request
      } else {
        toast.error('Failed to schedule vehicle share.', { autoClose: 3000 });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  let isDisabled =
    retireOnDate &&
    replaceVehicleId &&
    !errors.retire_on &&
    !errors.replace_vehicle_id;

  isDisabled = Boolean(isDisabled);

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
            <h5>Schedule Retirement</h5>

            <div className="form-field">
              <div className="field">
                {retireOnDate && (
                  <label
                    style={{
                      fontSize: '12px',
                      top: '24%',
                      color: '#555555',
                      zIndex: 1,
                    }}
                  >
                    Retire On*
                  </label>
                )}
                <DatePicker
                  dateFormat="MM/dd/yyyy"
                  className={`custom-datepicker${
                    !retireOnDate ? ' custom-datepicker-placeholder' : ''
                  }`}
                  placeholderText="Retire On*"
                  selected={retireOnDate}
                  minDate={new Date()}
                  onBlur={(e) => handleOnBlur('retire_on', e.target.value)}
                  onChange={(date) => {
                    setVehicles(
                      tempVehicles.filter((item) => {
                        if (
                          item?.retire_on == null ||
                          new Date(item?.retire_on) < date
                        ) {
                          return item;
                        }
                      })
                    );
                    handleOnBlur('retire_on', date);
                    setIsStateDirty(true);
                    setRetireOnDate(date);
                  }}
                />
              </div>
              {errors?.retire_on && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.retire_on}</p>
                </div>
              )}
            </div>

            <div className="form-field"></div>

            <div className="form-field mt-2">
              <div className="field">
                <p>
                  Replace{' '}
                  <span style={{ fontWeight: 'bold' }}>{vehicleName}</span>{' '}
                  Vehicle*
                </p>
                <select
                  style={{ color: !replaceVehicleId ? '#a3a3a3' : '#212529' }}
                  onBlur={(e) =>
                    handleOnBlur('replace_vehicle_id', parseInt(e.target.value))
                  }
                  onChange={(e) => {
                    setIsStateDirty(true);
                    handleOnBlur(
                      'replace_vehicle_id',
                      parseInt(e.target.value)
                    );
                    e.target.value === 'reset'
                      ? setReplaceVehicleId('')
                      : setReplaceVehicleId(e.target.value);
                  }}
                  name="vehicle"
                  id="vehicle"
                >
                  <option selected={!replaceVehicleId} value="reset">
                    Select Vehicle
                  </option>
                  {vehicles.map((vehicleData, index) => {
                    return (
                      <option
                        key={index}
                        value={vehicleData.id}
                        selected={vehicleData.id === replaceVehicleId}
                      >
                        {vehicleData.name}
                      </option>
                    );
                  })}
                </select>
                <p className="mt-1" style={{ fontSize: '10px' }}>
                  Selected vehicle will replace the retired vehicle beginning on
                  the retire date.
                </p>
              </div>
              {errors?.replace_vehicle_id && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.replace_vehicle_id}</p>
                </div>
              )}
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

          <button
            type="button"
            className="btn btn-md btn-primary"
            onClick={handleSubmit}
            disabled={!isDisabled}
          >
            Schedule
          </button>
        </div>
      </div>
      <SuccessPopUpModal
        title={'Success!'}
        message={'Vehicle Retirement scheduled.'}
        modalPopUp={successModal}
        setModalPopUp={setSuccessModal}
        showActionBtns={true}
        isNavigate={isNavigate}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resources/vehicles'
        }
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={cancelModal}
        isNavigate={true}
        setModalPopUp={setCancelModal}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resources/vehicles'
        }
      />
    </div>
  );
};

export default VehicleScheduleRetirement;
