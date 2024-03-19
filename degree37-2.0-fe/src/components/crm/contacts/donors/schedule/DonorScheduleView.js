import React, { useEffect, useState } from 'react';
import { DonorBreadCrumbsData } from '../../donor/DonorBreadCrumbsData';
import { CRM_DONOR_SCHEDULE_PATH } from '../../../../../routes/path';
import { useOutletContext, useParams } from 'react-router-dom';
import ViewForm from '../../../../common/ViewForm';
import { toast } from 'react-toastify';
import { fetchData } from '../../../../../helpers/Api';
import { formatUser } from '../../../../../helpers/formatUser';
import {
  customDateformat,
  formatCustomDate,
  formatTime,
} from '../../../../../helpers/formatDate';

const DonorScheduleView = () => {
  const { donorId, schedule } = useParams();
  const context = useOutletContext();
  const [appointmentData, setAppointmentData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (id) => {
      try {
        setIsLoading(true);
        if (id) {
          const result = await fetchData(
            `/contact-donors/donor-appointments/${id}`
          );
          let { data, status } = result;
          if (status == 200 && data?.length > 0) {
            const newData = data[0];
            setAppointmentData({
              date_appointment: customDateformat(newData?.date?.date),
              slot_start_time: formatTime(
                newData?.shifts_slots?.slot_start_time
              ),
              location: newData?.date?.location?.location,
              procedure_type_name: newData?.procedure_types?.donation_type,
              note: newData?.donor_appointment?.note,
              status: newData?.donor_appointment?.status,
              created: `${formatUser(
                newData.created_by,
                1
              )} | ${formatCustomDate(newData?.donor_appointment?.created_at)}`,
              updated: `${formatUser(
                newData.created_by,
                1
              )} | ${formatCustomDate(newData?.donor_appointment?.created_at)}`,
            });
          } else {
            toast.error('Error Fetching Appointment Details', {
              autoClose: 3000,
            });
          }
        }
      } catch (error) {
        toast.error('Error getting Appointment Details', {
          autoClose: 3000,
        });
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (schedule) {
      getData(schedule);
    }
  }, []);
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
      {
        label: 'View Schedule',
        class: 'active-label',
        link: `/crm/contacts/donor/${donorId}/view/schedule/${schedule}`,
      },
    ]);
  }, []);
  const config = [
    {
      section: 'Schedule Details',
      fields: [
        { label: 'Date', field: 'date_appointment' },
        { label: 'Appointment Time', field: 'slot_start_time' },
        { label: 'Location', field: 'location' },
        { label: 'Donation Type', field: 'procedure_type_name' },
        { label: 'Note', field: 'note' },
      ],
    },
    {
      section: 'Insights',
      fields: [
        {
          label: 'Status',
          field: 'status',
          //   format: (value) =>
          //     value == 1 ? `${AppointmentStatusTypeEnum?.Scheduled}` : null,
        },
        {
          label: 'Created',
          field: 'created',
        },
        {
          label: 'Updated',
          field: `updated`,
        },
      ],
    },
  ];
  console.log('appointementData', appointmentData);
  return (
    <>
      <div className="mainContent">
        <ViewForm
          isLoading={isLoading}
          config={config}
          DonorScheduleView={true}
          data={appointmentData}
          editLink={
            // CheckPermission([CrmPermissions.CRM.NON_COLLECTION_PROFILES.WRITE])
            //   ?
            `/crm/contacts/donor/${donorId}/view/schedule/${schedule}/edit`
            //   : null
          }
        />
      </div>
    </>
  );
};

export default DonorScheduleView;
