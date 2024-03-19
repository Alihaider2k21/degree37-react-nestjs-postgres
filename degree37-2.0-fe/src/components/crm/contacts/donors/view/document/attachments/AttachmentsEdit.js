import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../../../api/api-routes';
import EditAttachments from '../../../../../../common/DocumentComponent/Attachments/EditAttachments';
import TopBar from '../../../../../../common/topbar/index';
import { DonorBreadCrumbsData } from '../../../../donor/DonorBreadCrumbsData';

export default function AttachmentsEdit() {
  const { donorId: id, attachId } = useParams();
  const BreadcrumbsData = [
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
      label: 'Edit Attachment',
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
      <EditAttachments
        type="donors"
        attachId={attachId}
        editApi={API.crm.documents.attachments.updateAttachment}
        categoryApi={API.systemConfiguration.crmAdministration.contact.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.crmAdministration.contact.attachmentSubcategories.getAll()}
        listLink={`/crm/contacts/donor/${id}/view/documents/attachments`}
        archiveApi={API.crm.documents.attachments.archiveAttachment}
      />
    </div>
  );
}
