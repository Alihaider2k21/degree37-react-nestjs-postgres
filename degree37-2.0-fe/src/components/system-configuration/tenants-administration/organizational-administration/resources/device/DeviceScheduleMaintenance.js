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
import axios from 'axios';

const DeviceScheduleMaintenance = ({ deviceId }) => {
  const bearerToken = localStorage.getItem('token');
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [id, setId] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [description, setDescription] = useState('');
  const [reduceSlots, setReduceSlots] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deviceData, setDeviceData] = useState({});
  const [shareData, setShareData] = useState([]);

  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'Schedule Maintenance',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/schedule-maintenance`,
    },
  ];
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
    const getShares = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/devices/${deviceId}/shares`,
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        setShareData(data?.data);
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
        console.log(error);
      }
    };
    getShares();
    getDevice();
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const body = {
        start_date_time: startDate,
        end_date_time: endDate,
        description: description,
        reduce_slots: reduceSlots,
        created_by: +id,
      };
      const res = await fetch(`${BASE_URL}/devices/${deviceId}/maintenances`, {
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
        toast.success(response, { autoClose: 3000 });
        navigate(
          '/system-configuration/tenant-admin/organization-admin/resources/devices'
        );
      } else if (response?.status === 400) {
        toast.error('Failed to schedule Device maintenance.', {
          autoClose: 3000,
        });
        // Handle bad request
      } else {
        toast.error('Failed to schedule Device maintenance.', {
          autoClose: 3000,
        });
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };
  const generateExcludedDates = () => {
    const allExcludedDates = shareData.map((item) => ({
      start: new Date(item?.ds_start_date),
      end: new Date(item?.ds_end_date),
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
      <div className="mainContentInner">
        <form className={styles.device}>
          <div className="formGroup">
            <h5>Schedule Maintenance</h5>

            <div className="form-field">
              <div className="field">
                <DatePicker
                  showTimeSelect
                  minDate={new Date()}
                  maxDate={Date.parse(deviceData?.retire_on)}
                  dateFormat="Pp"
                  className="custom-datepicker"
                  placeholderText="Start Date/Time"
                  selected={startDate}
                  excludeDates={excludedDatesWithSameStartEnd}
                  excludeDateIntervals={excludedDatesWithDifferentStartEnd}
                  onChange={(date) => {
                    setStartDate(date);
                    const minDateTime = new Date(date);
                    minDateTime.setMinutes(minDateTime.getMinutes() + 30);
                    setEndDate(minDateTime);
                  }}
                />
              </div>
            </div>

            <div className="form-field">
              <div className="field">
                <DatePicker
                  minDate={startDate}
                  maxDate={Date.parse(deviceData?.retire_on)}
                  showTimeSelect
                  dateFormat="Pp"
                  filterTime={(time) => {
                    const minDateTime = new Date(startDate);
                    return time > minDateTime;
                  }}
                  className="custom-datepicker"
                  placeholderText="End Date/Time"
                  selected={(startDate && endDate) || null}
                  onChange={(date) => {
                    setEndDate(date);
                  }}
                />
              </div>
            </div>

            <div className="form-field">
              <div className="field">
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="form-field"></div>

            <div className="form-field checkbox">
              <span className="toggle-text">Reduce Slots</span>
              <label htmlFor="toggle" className="switch">
                <input
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  name="reduce_slots"
                  checked={reduceSlots}
                  onChange={(e) => setReduceSlots(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </form>
        <div className="form-footer">
          <button
            className="btn btn-secondary"
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
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceScheduleMaintenance;
