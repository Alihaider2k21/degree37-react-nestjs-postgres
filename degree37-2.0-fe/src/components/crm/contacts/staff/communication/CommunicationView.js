import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ViewForm from '../../../../common/ViewForm';
import styles from '../staff.module.scss';
import { StaffBreadCrumbsData } from '../StaffBreadCrumbsData';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import { toast } from 'react-toastify';

const CommunicationView = () => {
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
        label: 'Communications',
        class: 'active-label',
        link: `/crm/contacts/staff/${params?.id}/view/communication`,
      },
      {
        label: 'View Message',
        class: 'active-label',
        link: `/crm/contacts/staff/${params?.id}/view/communication/${params?.secondID}/view`,
      },
    ]);
  }, []);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const fetchSingle = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/contacts/volunteers/communications/${params.secondID}`
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
    <>
      {!isLoading && (
        <div className={styles.accountViewMain}>
          <ViewForm
            className="contact-view"
            data={transformData(rows)}
            config={config}
            additionalMessage={additionalMessage}
          />
        </div>
      )}
    </>
  );
};

export default CommunicationView;
