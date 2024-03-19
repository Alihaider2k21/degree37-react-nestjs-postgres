import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../../api/api-routes';
import EditAttachments from '../../../../../common/DocumentComponent/Attachments/EditAttachments';
import TopBar from '../../../../../common/topbar/index';
import { LocationsBreadCrumbsData } from '../../../LocationsBreadCrumbsData';

export default function AttachmentsEdit() {
  const { id, attachId } = useParams();
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
      label: 'Edit Attachment',
      class: 'active-label',
      link: '#',
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
        type="crm_locations"
        attachId={attachId}
        editApi={API.crm.documents.attachments.updateAttachment}
        categoryApi={API.systemConfiguration.crmAdministration.location.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.crmAdministration.location.attachmentSubcategories.getAll()}
        listLink={`/crm/locations/${id}/view/documents/attachments`}
        archiveApi={API.crm.documents.attachments.archiveAttachment}
      />
    </div>
  );
}
