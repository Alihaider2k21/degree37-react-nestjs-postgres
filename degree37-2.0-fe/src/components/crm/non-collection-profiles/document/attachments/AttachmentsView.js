import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../api/api-routes';
import ViewAttachments from '../../../../common/DocumentComponent/Attachments/ViewAttachments';
import TopBar from '../../../../common/topbar/index';
import TopTabsNCP from '../../topTabsNCP.js';
import { NonCollectionProfilesBreadCrumbsData } from '../../NonCollectionProfilesBreadCrumbsData';

export default function AttachmentsView() {
  const { id, attachId } = useParams();

  const BreadcrumbsData = [
    ...NonCollectionProfilesBreadCrumbsData,
    {
      label: 'View Non-Collection Profile',
      class: 'disable-label',
      link: `/crm/non-collection-profiles/${id}/about`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/crm/non-collection-profiles/${id}/documents/notes`,
    },
    {
      label: 'Attachments',
      class: 'disable-label',
      link: `/crm/non-collection-profiles/${id}/documents/attachments`,
    },
    {
      label: 'View Attachment',
      class: 'active-label',
      link: `#`,
    },
  ];
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Attachments'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />
      <TopTabsNCP
        NCPID={id}
        // editLink={`/crm/non-collection-profiles/${id}/edit`}
        // editName={'Edit NCP'}
        activePath={`attachments/${attachId}/view`}
      />
      <ViewAttachments
        viewApi={API.crm.documents.attachments.getAttachmentByID}
        attachId={attachId}
        editLink={`/crm/non-collection-profiles/${id}/documents/attachments/${attachId}/edit`}
      />
    </div>
  );
}
