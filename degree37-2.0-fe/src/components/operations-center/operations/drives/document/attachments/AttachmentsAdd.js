import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../../api/api-routes';
import CreateAttachments from '../../../../../common/DocumentComponent/Attachments/CreateAttachments';
import TopBar from '../../../../../common/topbar/index';

export default function AttachmentsAdd() {
  const { id } = useParams();

  const BreadcrumbsData = [
    { label: 'Operations Center', class: 'disable-label', link: '/' },
    {
      label: 'Operations',
      class: 'disable-label',
      link: '/operations-center/operations/drives',
    },
    {
      label: 'Drives',
      class: 'disable-label',
      link: '/operations-center/operations/drives',
    },
    {
      label: 'View Drive',
      class: 'disable-label',
      link: `/operations-center/operations/drives/${id}/view/about`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/operations-center/operations/drives/${id}/view/documents/notes`,
    },
    {
      label: 'Attachments',
      class: 'disable-label',
      link: `/operations-center/operations/drives/${id}/view/documents/attachments`,
    },
    {
      label: 'Create Attachment',
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
        type="drives"
        submitApi={API.crm.documents.attachments.createAttachment}
        categoryApi={API.systemConfiguration.operationAdministrations.notesAttachment.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.operationAdministrations.notesAttachment.attachmentSubcategories.getAll()}
        listLink={`/operations-center/operations/drives/${id}/view/documents/attachments`}
      />
    </div>
  );
}
