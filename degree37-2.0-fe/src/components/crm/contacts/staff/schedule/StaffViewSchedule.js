import React, { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { fetchData } from '../../../../../helpers/Api';
import ViewForm from '../../../../common/ViewForm';
import { StaffBreadCrumbsData } from '../StaffBreadCrumbsData';
import { CRM_STAFF_SCHEDULE_PATH } from '../../../../../routes/path';
import { formatTime } from '../../../../../helpers/formatDate';
import { toast } from 'react-toastify';

const StaffViewSchedule = () => {
  const params = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...StaffBreadCrumbsData,
      {
        label: 'View Staff',
        class: 'active-label',
        link: `/crm/contacts/staff/${params?.staff_id}/view`,
      },
      {
        label: 'Schedule',
        class: 'active-label',
        link: CRM_STAFF_SCHEDULE_PATH.LIST.replace(
          ':staff_id',
          params?.staff_id
        ),
      },
      {
        label: 'View',
        class: 'active-label',
        link: CRM_STAFF_SCHEDULE_PATH.VIEW.replace(
          ':staff_id',
          params?.staff_id
        ).replace(':schedule_id', params?.schedule_id),
      },
    ]);
  }, []);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        setLoading(true);

        const scheduleResponse = await fetchData(
          `/staff-schedules/${params?.schedule_id}/view`,
          'GET'
        );
        if (scheduleResponse?.status_code === 404) {
          toast.error('Staff schedule not found.');
          return;
        }

        const { data } = scheduleResponse;
        setSchedule({
          ...data,
          role_name: data?.role,
          total_hour_num: data?.staff_assignment?.total_hours?.toString(),
          start_time: new Date(
            data?.staff_assignment?.start_time
          ).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }),
          end_time: new Date(
            data?.staff_assignment?.end_time
          ).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }),
          created_at: data?.staff_assignment?.created_at,
          status: data?.staff_assignment?.status,
          className:
            data?.staff_assignment?.status === 'Current'
              ? 'badge active'
              : 'badge Grey',
        });
      } catch (error) {
        console.error(error);
        toast.error('Error fetching schedule details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDataAsync();
  }, [params?.scheduleId]);

  const config = [
    {
      section: 'Schedule Details',
      fields: [
        { label: 'Date', field: 'date_description.date' },
        { label: 'Description', field: 'date_description.description' },
        { label: 'Role', field: 'role_name' },
        { label: 'Start Time', field: 'start_time' },
        { label: 'End Time', field: 'end_time' },
        { label: 'Total Hours', field: 'total_hour_num' },
        { label: 'Status', field: 'status' },
      ],
    },

    {
      section: 'Insights',
      fields: [
        {
          label: 'Created',
          field: 'created_by',
        },
        {
          label: 'Modified',
          field: 'modified_by',
        },
      ],
    },
  ];

  const transformData = (data) => {
    let role = data?.role_id?.name;
    let startTime = formatTime(data?.clock_in_time);
    let endTime = formatTime(data?.clock_out_time);

    return {
      ...data,
      role: role,
      clock_in_time: startTime,
      clock_out_time: endTime,
    };
  };

  return (
    <div className="mainContent">
      <ViewForm
        className="contact-view"
        data={transformData(schedule)}
        config={config}
        isLoading={loading}
      />
    </div>
  );
};

export default StaffViewSchedule;
