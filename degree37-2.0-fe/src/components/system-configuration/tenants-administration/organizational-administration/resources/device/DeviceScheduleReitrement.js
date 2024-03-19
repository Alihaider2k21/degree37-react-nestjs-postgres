import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../../../common/topbar/index';
import styles from './device.module.scss';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import jwt from 'jwt-decode';
import { toast } from 'react-toastify';

import 'react-datepicker/dist/react-datepicker.css';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import SuccessPopUpModal from '../../../../../common/successModal';

const DeviceScheduleReitrement = ({ deviceId }) => {
  const bearerToken = localStorage.getItem('token');
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [successPopup, setSuccessPopup] = useState(false);
  const [id, setId] = useState('');
  const [retireOnDate, setRetireOnDate] = useState('');
  const [replaceDeviceId, setReplaceDeviceId] = useState('');
  const [devices, setDevices] = useState([]);
  const [tempDevices, setTempDevices] = useState([]);
  const [deviceName, setDeviceName] = useState('');

  const [errors, setErrors] = useState({
    retire_on: '',
    replace_vehicle_id: '',
  });

  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'Schedule Device Retirement',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/schedule-retirement`,
    },
  ];

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

  const getDeviceList = async () => {
    let result = await fetch(`${BASE_URL}/devices?fetchAll=true&status=true`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });

    let data = await result.json();
    result = await fetch(`${BASE_URL}/devices/${deviceId}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });
    let deviceData = await result.json();

    setDeviceName(deviceData?.data?.name);
    setDevices(
      data?.data.filter(
        (item) =>
          +item?.collection_operation?.id ==
            +deviceData?.data?.collection_operation?.id &&
          +item?.device_type?.id == +deviceData?.data?.device_type?.id &&
          +item.id != deviceId
      )
    );

    setTempDevices(
      data?.data.filter(
        (item) =>
          +item?.collection_operation?.id ==
            +deviceData?.data?.collection_operation?.id &&
          +item?.device_type?.id == +deviceData?.data?.device_type?.id &&
          +item.id != deviceId
      )
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
    getDeviceList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        retire_on: retireOnDate,
        replace_device_id: +replaceDeviceId,
        created_by: +id,
      };
      const res = await fetch(`${BASE_URL}/devices/${deviceId}/retirement`, {
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
        setSuccessPopup(true);
      } else if (response?.status === 400) {
        toast.error('Failed to schedule device share.', { autoClose: 3000 });
        // Handle bad request
      } else {
        toast.error('Failed to schedule device share.', { autoClose: 3000 });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  let isDisabled =
    retireOnDate &&
    replaceDeviceId &&
    !errors.retire_on &&
    !errors.replace_device_id;

  isDisabled = Boolean(isDisabled);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Devices'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <form className={styles.device}>
          <div className="formGroup">
            <h5>Schedule Retirement</h5>

            <div className="form-field">
              <div className="field">
                <DatePicker
                  dateFormat="MM/dd/yyyy"
                  className="custom-datepicker"
                  placeholderText="Retire On"
                  selected={retireOnDate}
                  onBlur={(e) => handleOnBlur('retire_on', e.target.value)}
                  minDate={new Date()}
                  onChange={(date) => {
                    setRetireOnDate(date);
                    setDevices(
                      tempDevices.filter((item) => {
                        if (
                          item?.retire_on == null ||
                          new Date(item?.retire_on) < date
                        ) {
                          return item;
                        }
                      })
                    );
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
              <p>
                Replace <span style={{ fontWeight: 'bold' }}>{deviceName}</span>{' '}
                Device*
              </p>
              <select
                onBlur={(e) =>
                  handleOnBlur('replace_device_id', parseInt(e.target.value))
                }
                onChange={(e) => setReplaceDeviceId(e.target.value)}
                name="device"
                id="device"
              >
                <option disabled selected={!replaceDeviceId} value="">
                  Select Device
                </option>
                {devices?.map((deviceData, index) => {
                  return (
                    <option
                      key={index}
                      value={deviceData.id}
                      selected={deviceData.id === replaceDeviceId}
                    >
                      {deviceData.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </form>
        <div className="form-footer">
          <button
            className="btn btn-md btn-link me-0 pe-4"
            onClick={() =>
              navigate(
                '/system-configuration/tenant-admin/organization-admin/resources/devices'
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
        title="Success!"
        message="Device updated."
        modalPopUp={successPopup}
        isNavigate={true}
        setModalPopUp={setSuccessPopup}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resources/devices'
        }
      />
    </div>
  );
};

export default DeviceScheduleReitrement;
