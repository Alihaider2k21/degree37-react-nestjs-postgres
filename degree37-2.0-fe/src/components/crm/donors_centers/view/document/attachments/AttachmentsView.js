import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../../api/api-routes';
import ViewAttachments from '../../../../../common/DocumentComponent/Attachments/ViewAttachments';
import TopBar from '../../../../../common/topbar/index';
import TopTabsDonorCenters from '../../../topTabsDonorCenters';
import { DonorCentersBreadCrumbsData } from '../../../DonorCentersBreadCrumbsData';

export default function AttachmentsView() {
  const { id, attachId } = useParams();

  const BreadcrumbsData = [
    ...DonorCentersBreadCrumbsData,
    {
      label: 'View Donors Centers',
      class: 'disable-label',
      link: `/crm/donor_center/${id}`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/crm/donor-center/${id}/view/documents/notes`,
    },
    {
      label: 'Attachments',
      class: 'disable-label',
      link: `/crm/donor-center/${id}/view/documents/attachments`,
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
      <TopTabsDonorCenters donorCenterId={id} hideSession={true} />
      <ViewAttachments
        viewApi={API.crm.documents.attachments.getAttachmentByID}
        attachId={attachId}
        editLink={`/crm/donor-center/${id}/view/documents/attachments/${attachId}/edit`}
      />
    </div>
  );
}
