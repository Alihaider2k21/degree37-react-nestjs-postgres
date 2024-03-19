import React from 'react';
import { useParams, useOutletContext } from 'react-router';
import { API } from '../../../../../../../api/api-routes';
import ViewAttachments from '../../../../../../common/DocumentComponent/Attachments/ViewAttachments';

import { DonorBreadCrumbsData } from '../../../../donor/DonorBreadCrumbsData';
import { useEffect } from 'react';

export default function AttachmentsView() {
  const { donorId: id, attachId } = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...DonorBreadCrumbsData,
      {
        label: 'View Donors',
        class: 'disable-label',
        link: `/crm/contacts/donor/${id}/view`,
      },
      {
        label: 'Documents',
        class: 'disable-label',
        link: `/crm/contacts/donor/${id}/view/documents/notes`,
      },
      {
        label: 'Attachments',
        class: 'disable-label',
        link: `/crm/contacts/donor/${id}/view/documents/attachments`,
      },
      {
        label: 'View Attachment',
        class: 'active-label',
        link: `#`,
      },
    ]);
  }, []);
  // const BreadcrumbsData = [
  //   ...DonorBreadCrumbsData,
  //   {
  //     label: 'View Donors',
  //     class: 'disable-label',
  //     link: `/crm/contacts/donor/${id}/view`,
  //   },
  //   {
  //     label: 'Documents',
  //     class: 'disable-label',
  //     link: `/crm/contacts/donor/${id}/view/documents/notes`,
  //   },
  //   {
  //     label: 'Attachments',
  //     class: 'disable-label',
  //     link: `/crm/contacts/donor/${id}/view/documents/attachments`,
  //   },
  //   {
  //     label: 'View Attachment',
  //     class: 'active-label',
  //     link: `#`,
  //   },
  // ];
  return (
    // <div className="mainContent">
    //   <TopBar
    //     BreadCrumbsData={BreadcrumbsData}
    //     BreadCrumbsTitle={'Attachments'}
    //     SearchValue={null}
    //     SearchOnChange={null}
    //     SearchPlaceholder={null}
    //   />
    //   <DonorNavigation />
    <ViewAttachments
      viewApi={API.crm.documents.attachments.getAttachmentByID}
      attachId={attachId}
      editLink={`/crm/contacts/donor/${id}/view/documents/attachments/${attachId}/edit`}
    />
    // </div>
  );
}
