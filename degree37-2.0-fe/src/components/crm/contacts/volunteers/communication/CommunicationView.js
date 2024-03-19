import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ViewForm from '../../../../common/ViewForm';
import { VolunteersBreadCrumbsData } from '../VolunteersBreadCrumbsData';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import { toast } from 'react-toastify';

const CommunicationView = () => {
  const params = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...VolunteersBreadCrumbsData,
      {
        label: 'View Volunteer',
        class: 'disable-label',
        link: `/crm/contacts/volunteers/${params?.id}/view`,
      },
      {
        label: 'Communications',
        class: 'active-label',
        link: `/crm/contacts/volunteers/${params?.volunteerId}/view/communication`,
      },
      {
        label: 'View Message',
        class: 'active-label',
        link: `/crm/contacts/volunteers/${params?.volunteerId}/view/communication/${params?.id}/view`,
      },
    ]);
  }, []);
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const config = [
    {
      section: 'Message Details',
      fields: [
        { label: 'Date', field: 'date' },
        { label: 'Message Type', field: 'message_type' },
        { label: 'Subject', field: 'subject' },
        { label: 'Status', field: 'communications_status' },
      ],
    },
  ];
  const fetchSingle = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/contacts/volunteers/communications/${params.id}`
      );
      const data = await response.json();
      if (data.status !== 500) {
        setRows(data.data);
      }
    } catch (error) {
      toast.error(`Failed to fetch Communication ${error}`, {
        autoClose: 3000,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSingle();
  }, []);
  const additionalMessage = {
    section: 'Message',
    message: rows?.message_text,
  };

  const transformData = (data) => {
    let communications_type;
    let communications_status;
    if (data.status === 'sent') {
      communications_status = 'sent';
    } else {
      communications_status = 'Closed';
    }
    if (data.message_type === 'email') {
      communications_type = 'Email';
    } else {
      communications_type = 'SMS';
    }

    return {
      ...data,
      communications_status: communications_status,
      message_type: communications_type,
    };
  };

  return (
    <ViewForm
      isLoading={isLoading}
      className="contact-view"
      data={transformData(rows)}
      config={config}
      additionalMessage={additionalMessage}
    />
  );
};

export default CommunicationView;
