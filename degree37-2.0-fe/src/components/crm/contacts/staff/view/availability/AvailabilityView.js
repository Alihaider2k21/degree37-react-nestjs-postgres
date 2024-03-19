import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { StaffBreadCrumbsData } from '../../StaffBreadCrumbsData';
import { useOutletContext, useParams } from 'react-router';

import ViewForm from './ViewForm';
import { API } from '../../../../../../api/api-routes';
import moment from 'moment';
import { toast } from 'react-toastify';

const AvailabilityView = () => {
  const params = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...StaffBreadCrumbsData,
      {
        label: 'View Staff',
        class: 'disable-label',
        link: `/crm/contacts/staff/${params?.id}/view`,
      },
      {
        label: 'About',
        class: 'active-label',
        link: `/crm/contacts/staff/${params?.id}/view`,
      },
      {
        label: 'Availability',
        class: 'active-label',
        link: `/crm/contacts/staff/${params?.id}/view/availability`,
      },
    ]);
  }, []);
  const [toggle, setToggle] = useState(false);
  const [classificationsData, setClassificationsData] = useState();
  const [classificationName, setClassificationName] = useState();
  const [shiftData, setShiftData] = useState();
  const accessToken = localStorage.getItem('token');

  const stateToggle = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    const getClassificationData = async () => {
      const { data } = await API.crm.contacts.staff.getClassificationData(
        params?.id,
        accessToken
      );
      if (data.status_code === 200) {
        setClassificationsData(data?.data);
        setClassificationName(data?.data?.staffing_classification_id?.name);
      } else {
        toast.error(`Error in fetching`, { autoClose: 3000 });
      }
    };

    if (params?.id) {
      getClassificationData();
    }
  }, [params?.id, toggle]);

  useEffect(() => {
    const getShiftScheduleData = async () => {
      const { data } = await API.crm.contacts.staff.getShiftScheduleData(
        params?.id,
        accessToken
      );
      if (data?.status_code === 200) {
        if (data?.data) {
          const convertTime = (time, key) => {
            return time
              ? time !== '00:00:00'
                ? moment(time, 'HH:mm:ss').format('hh:mm A')
                : key?.includes('start_time')
                ? 'Off'
                : ''
              : '';
          };

          const convertedData = Object.fromEntries(
            Object?.entries(data?.data)?.map(([key, value]) => {
              if (key?.includes('time')) {
                return [key, convertTime(value, key)];
              }
              return [key, value];
            })
          );
          setShiftData(convertedData);
        }
      } else {
        toast.error(`Error in fetching`, { autoClose: 3000 });
      }
    };
    if (params?.id) {
      getShiftScheduleData();
    }
  }, [params?.id, toggle]);

  const config = [
    {
      section: 'Classification',
      headActionText: 'Modify Settings',
      fields: [
        {
          label: 'Classification Name',
          field: 'classification_name',
          fullRow: true,
        },
        { label: 'Target Hours per Week', field: 'target_hours_per_week' },
        { label: 'Minimum Hours per Week', field: 'minimum_hours_per_week' },
        { label: 'Maximum Hours per Week', field: 'maximum_hours_per_week' },
        { label: 'Minimum Days per Week', field: 'minimum_days_per_week' },
        { label: 'Maximum Days per Week', field: 'maximum_days_per_week' },
        {
          label: 'Maximum Consecutive Days per Week',
          field: 'maximum_consecutive_days_per_week',
        },
        { label: 'Maximum OT per Week', field: 'maximum_ot_per_week' },
        { label: 'Maximum Weekend Hours', field: 'maximum_weekend_hours' },
        {
          label: 'Maximum Consecutive Weekends',
          field: 'maximum_consecutive_weekends',
        },
        {
          label: 'Maximum Weekends per Month',
          field: 'maximum_weekends_per_month',
        },
        { label: 'Overtime Threshold', field: 'overtime_threshold' },
        { label: 'Minimum Recovery Time', field: 'minimum_recovery_time' },
      ],
    },
    {
      section: 'Shift Schedule',
      headActionText: 'Update Schedule',
      fields: [
        {
          label: 'Day',
          label2: 'Start Time',
          label3: 'End Time',
          fullRow: true,
        },
        {
          label: 'Monday',
          field: 'monday_start_time',
          field2: 'monday_end_time',
        },
        {
          label: 'Tuesday',
          field: 'tuesday_start_time',
          field2: 'tuesday_end_time',
        },
        {
          label: 'Wednesday',
          field: 'wednesday_start_time',
          field2: 'wednesday_end_time',
        },
        {
          label: 'Thursday',
          field: 'thursday_start_time',
          field2: 'thursday_end_time',
        },
        {
          label: 'Friday',
          field: 'friday_start_time',
          field2: 'friday_end_time',
        },
        {
          label: 'Saturday',
          field: 'saturday_start_time',
          field2: 'saturday_end_time',
        },
        {
          label: 'Sunday',
          field: 'sunday_start_time',
          field2: 'sunday_end_time',
        },
      ],
    },
  ];

  return (
    <div className={styles.accountViewMain}>
      <ViewForm
        className="contact-view"
        data={classificationsData ?? classificationsData}
        shiftData={shiftData}
        config={config}
        classificationName={classificationName}
        submitButton={stateToggle}
      />
    </div>
  );
};

export default AvailabilityView;
