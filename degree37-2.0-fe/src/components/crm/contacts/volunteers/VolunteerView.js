import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { fetchData } from '../../../../helpers/Api';
import ViewForm from '../../../common/ViewForm';
import styles from './volunteer.module.scss';

import { DashDateFormat, dateFormat } from '../../../../helpers/formatDate';
import CommunicationModal from '../../../common/CommunicationModal';
import ContactPreferenceModal from '../../../common/ContactPreferenceModal';
import { toast } from 'react-toastify';

import { VolunteersBreadCrumbsData } from './VolunteersBreadCrumbsData';
import { removeCountyWord } from '../../../../helpers/utils';

const VolunteerView = () => {
  const params = useParams();
  const [volunteer, setVolunteer] = useState({});
  const [contactPreference, setContactPreference] = useState({});
  const [loading, setLoading] = useState(true);
  const [openCommunication, setOpenCommunication] = useState(false);
  const [openContactPreference, setOpenContactPreference] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const communicationable_type = 'crm_volunteer';
  const communicationable_id = params?.volunteerId;
  const [newContactPreference, setNewContactPreference] = useState({
    contact_preferenceable_id: params?.volunteerId,
    contact_preferenceable_type: 'crm_volunteer',
    next_call_date: new Date(),
    is_optout_email: false,
    is_optout_sms: false,
    is_optout_push: false,
    is_optout_call: false,
  });
  const [messageType, setMessageType] = useState('email');
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...VolunteersBreadCrumbsData,
      {
        label: 'View Volunteers',
        class: 'disable-label',
        link: `/crm/contacts/volunteers/${params?.id}/view`,
      },
      {
        label: 'About',
        class: 'active-label',
        link: `/crm/contacts/volunteers/${params?.volunteerId}/view`,
      },
    ]);
  }, []);

  React.useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        setLoading(true);

        const volunteerResponse = await fetchData(
          `/contact-volunteer/${params?.volunteerId}`,
          'GET'
        );
        setVolunteer(volunteerResponse.data);

        const preferencesResponse = await fetchData(
          `/contact-preferences?preference_id=${+params?.volunteerId}&type_name=crm_volunteer`,
          'GET'
        );
        if (preferencesResponse?.data?.next_call_date !== null) {
          preferencesResponse.data.next_call_date = new Date(
            preferencesResponse.data.next_call_date
          );
        }
        setContactPreference(preferencesResponse.data);
        setNewContactPreference(preferencesResponse.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAsync();
  }, [params?.volunteerId, refreshData]);

  const config = [
    {
      section: 'Volunteer Details',
      fields: [
        { label: 'Volunteer Name', field: 'full_name' },
        { label: 'Nick Name', field: 'nick_name' },
        { label: 'Mailing Address', field: 'mailing_address' },
        { label: 'County', field: 'address.county' },
        { label: 'Date of Birth', field: 'birth_date' },
        { label: 'Employer', field: 'employee' },
        { label: 'Title', field: 'title' },
      ],
    },
    {
      section: 'Contact Info',
      hasAction: true,
      actionUrl: '#',
      actionText: 'Communicate',
      onClick: () => setOpenCommunication(true),
      fields: [
        { label: 'Work Phone', field: 'work_phone' },
        { label: 'Mobile Phone', field: 'mobile_phone' },
        { label: 'Other Phone', field: 'other_phone' },
        { label: 'Work Email', field: 'work_email' },
        { label: 'Home Email', field: 'home_email' },
        { label: 'Other Email', field: 'other_email' },
      ],
    },
    {
      section: 'Contact Preferences',
      hasAction: true,
      actionUrl: '#',
      actionText: 'Update Preferences',
      onClick: () => setOpenContactPreference(true),
      fields: [
        { label: 'Next Call Date', field: 'next_call_date' },
        { label: 'Opt Out Email', field: 'is_optout_email' },
        { label: 'Opt Out SMS', field: 'is_optout_sms' },
        { label: 'Opt Out Push', field: 'is_optout_push' },
        { label: 'Opt Out Call', field: 'is_optout_call' },
      ],
    },
    {
      section: 'Insights',
      fields: [
        {
          label: 'Status',
          field: 'status',
          format: (value) => (value ? 'Active' : 'Inactive'),
        },
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

  const additionalItems = [
    {
      section: 'Tags',
      fields: [
        // {
        //   label: 'Call in Evening',
        //   field: 'call_in_evening',
        // },
        // {
        //   label: 'Sent Email',
        //   field: 'sent_email',
        // },
        // {
        //   label: 'Will Call Us',
        //   field: 'will_call_us',
        // },
      ],
    },
  ];

  const transformData = (data) => {
    let full_name = data.first_name + ' ' + data.last_name;
    let birth_date = DashDateFormat(data.birth_date);
    let primary_email_field = '';
    let primary_phone_field = '';
    let work_phone = '';
    let mobile_phone = '';
    let other_phone = '';
    let work_email = '';
    let home_email = '';
    let other_email = '';
    let mailing_address =
      data?.address?.address1 +
      ' ' +
      data?.address?.address2 +
      ', ' +
      data?.address?.city +
      ', ' +
      data?.address?.state +
      ' ' +
      data?.address?.zip_code;

    if (data.contact && Array.isArray(data.contact)) {
      // Find the contact with contact_type 1 and assign its data to work_phone
      const contactWithType1 = data.contact.find(
        (contact) => contact.contact_type === 1
      );
      if (contactWithType1) {
        work_phone = contactWithType1.data;
        if (contactWithType1.is_primary) {
          primary_phone_field = 'work_phone';
        }
      }
      const contactWithType2 = data.contact.find(
        (contact) => contact.contact_type === 2
      );
      if (contactWithType2) {
        mobile_phone = contactWithType2.data;
        if (contactWithType2.is_primary) {
          primary_phone_field = 'mobile_phone';
        }
      }
      const contactWithType3 = data.contact.find(
        (contact) => contact.contact_type === 3
      );
      if (contactWithType3) {
        other_phone = contactWithType3.data;
        if (contactWithType3.is_primary) {
          primary_phone_field = 'other_phone';
        }
      }
      const contactWithType4 = data.contact.find(
        (contact) => contact.contact_type === 4
      );
      if (contactWithType4) {
        work_email = contactWithType4.data;
        if (contactWithType4.is_primary) {
          primary_email_field = 'work_email';
        }
      }
      const contactWithType5 = data.contact.find(
        (contact) => contact.contact_type === 5
      );
      if (contactWithType5) {
        home_email = contactWithType5.data;
        if (contactWithType5.is_primary) {
          primary_email_field = 'home_email';
        }
      }
      const contactWithType6 = data.contact.find(
        (contact) => contact.contact_type === 6
      );
      if (contactWithType6) {
        other_email = contactWithType6.data;
        if (contactWithType6.is_primary) {
          primary_email_field = 'other_email';
        }
      }
    }
    const is_optout_email = newContactPreference?.is_optout_email
      ? 'Yes'
      : newContactPreference?.is_optout_email === false
      ? 'No'
      : 'Yes';
    const is_optout_sms =
      newContactPreference?.is_optout_sms === true
        ? 'Yes'
        : newContactPreference?.is_optout_sms === false
        ? 'No'
        : 'Yes';
    const is_optout_call =
      newContactPreference?.is_optout_call === true
        ? 'Yes'
        : newContactPreference?.is_optout_call === false
        ? 'No'
        : 'Yes';
    const is_optout_push =
      newContactPreference?.is_optout_push === true
        ? 'Yes'
        : newContactPreference?.is_optout_push === false
        ? 'No'
        : 'Yes';
    const next_call_date = !contactPreference?.next_call_date
      ? DashDateFormat(newContactPreference?.next_call_date)
      : dateFormat(contactPreference?.next_call_date, 2);
    return {
      ...data,
      full_name: full_name,
      birth_date: birth_date,
      work_phone: work_phone,
      mobile_phone: mobile_phone,
      other_phone: other_phone,
      work_email: work_email,
      address: {
        ...data.address,
        county: removeCountyWord(data.address.county),
      },
      home_email: home_email,
      other_email: other_email,
      mailing_address: mailing_address,
      primary_phone_field: primary_phone_field,
      primary_email_field: primary_email_field,
      next_call_date: next_call_date,
      is_optout_email: is_optout_email,
      is_optout_sms: is_optout_sms,
      is_optout_call: is_optout_call,
      is_optout_push: is_optout_push,
    };
  };

  const handleCommunicationButtons = (confirmed) => {
    setOpenCommunication(confirmed);
    setOpenContactPreference(confirmed);
  };

  const handleContactPreferencesButtons = async (data) => {
    if (data !== null) {
      const preferencesResponse = await fetchData(
        `/contact-preferences/${contactPreference?.id ?? ''}`,
        contactPreference?.id ? 'PUT' : 'POST',
        { ...data, contact_preferenceable_id: +params?.id }
      );
      if (
        preferencesResponse.status === 'success' ||
        preferencesResponse.status_code === 200
      ) {
        if (preferencesResponse.data.next_call_date !== null) {
          preferencesResponse.data.next_call_date = new Date(
            preferencesResponse.data.next_call_date
          );
        }
        setContactPreference(preferencesResponse?.data);
        setNewContactPreference(preferencesResponse?.data);
        setOpenContactPreference(false);
      } else {
        toast.error(preferencesResponse.response);
      }
    } else {
      setNewContactPreference({ ...newContactPreference });
      setOpenContactPreference(false);
    }
  };

  return (
    <div className={styles.accountViewMain}>
      {!loading && (
        <ViewForm
          className="contact-view"
          data={transformData(volunteer)}
          config={config}
          additional={additionalItems}
        />
      )}

      <CommunicationModal
        openModal={openCommunication}
        setOpenModal={setOpenCommunication}
        defaultMessageType={messageType}
        setDefaultMessageType={setMessageType}
        communicationable_id={communicationable_id}
        communicationable_type={communicationable_type}
        handleModalButtons={handleCommunicationButtons}
        refreshData={refreshData} // Pass the state as a prop
        setRefreshData={setRefreshData}
      />
      <ContactPreferenceModal
        openModal={openContactPreference}
        contactPreference={contactPreference}
        newContactPreference={newContactPreference}
        handleModalButtons={handleContactPreferencesButtons}
        setNewContactPreference={setNewContactPreference}
      />
    </div>
  );
};

export default VolunteerView;
