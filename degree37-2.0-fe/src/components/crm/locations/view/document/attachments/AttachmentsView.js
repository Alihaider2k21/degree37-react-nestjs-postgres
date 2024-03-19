import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../../api/api-routes';
import LocationNotes from '../../../../../../assets/images/LocationNotes.png';
import ViewAttachments from '../../../../../common/DocumentComponent/Attachments/ViewAttachments';
import TopBar from '../../../../../common/topbar/index';
import AccountViewNavigationTabs from '../../../navigationTabs';
import { useEffect } from 'react';
import { fetchData } from '../../../../../../helpers/Api';
import { useState } from 'react';
import { LocationsBreadCrumbsData } from '../../../LocationsBreadCrumbsData';

export default function AttachmentsView() {
  const { id, attachId } = useParams();
  const [viewAddress, setViewAddress] = useState('');
  const [locations, setLocations] = useState('');

  const BreadcrumbsData = [
    ...LocationsBreadCrumbsData,
    {
      label: 'View Location',
      class: 'disable-label',
      link: `/crm/locations/${id}/view`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/crm/locations/${id}/view/documents/notes`,
    },
    {
      label: 'Attachments',
      class: 'disable-label',
      link: `/crm/locations/${id}/view/documents/attachments`,
    },
    {
      label: 'View Attachment',
      class: 'active-label',
      link: '#',
    },
  ];

  useEffect(() => {
    fetchData(`/crm/locations/${id}`, 'GET')
      .then((res) => {
        if (res?.data) {
          let edit = res?.data;
          setViewAddress(`${edit?.address?.city}, ${edit?.address?.state}`);
          setLocations(edit?.name);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Attachments'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />
      <div className="imageMainContent">
        <div className="d-flex align-items-center gap-3 ">
          <div style={{ width: '62px', height: '62px' }}>
            <img
              src={LocationNotes}
              style={{ width: '100%' }}
              alt="CancelIcon"
            />
          </div>
          <div className="d-flex flex-column">
            <h4 className="">{locations}</h4>
            <span>{viewAddress}</span>
          </div>
        </div>
        <AccountViewNavigationTabs />
      </div>
      <ViewAttachments
        viewApi={API.crm.documents.attachments.getAttachmentByID}
        attachId={attachId}
        editLink={`/crm/locations/${id}/view/documents/attachments/${attachId}/edit`}
      />
    </div>
  );
}
