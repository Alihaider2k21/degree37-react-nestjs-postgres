import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../../api/api-routes';
import CreateAttachments from '../../../../../common/DocumentComponent/Attachments/CreateAttachments';
import TopBar from '../../../../../common/topbar/index';
import { LocationsBreadCrumbsData } from '../../../LocationsBreadCrumbsData';

export default function AttachmentsAdd() {
  const { id } = useParams();

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
      label: 'Add Attachment',
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
      <CreateAttachments
        type="crm_locations"
        submitApi={API.crm.documents.attachments.createAttachment}
        categoryApi={API.systemConfiguration.crmAdministration.location.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.crmAdministration.location.attachmentSubcategories.getAll()}
        listLink={`/crm/locations/${id}/view/documents/attachments`}
      />
    </div>
  );
}
