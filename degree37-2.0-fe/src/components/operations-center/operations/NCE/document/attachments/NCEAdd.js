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
      link: '/operations-center/operations/non-collection-events',
    },
    {
      label: 'Non-Collection Events',
      class: 'disable-label',
      link: '/operations-center/operations/non-collection-events',
    },
    {
      label: 'View Non-Collection Event',
      class: 'disable-label',
      link: `/operations-center/operations/non-collection-events/${id}/view/about`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/operations-center/operations/non-collection-events/${id}/view/documents/notes`,
    },
    {
      label: 'Attachments',
      class: 'disable-label',
      link: `/operations-center/operations/non-collection-events/${id}/view/documents/attachments`,
    },
    {
      label: 'Create Attachment',
      class: 'active-label',
      link: '#',
    },
  ];
  return (
    <div className="">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Attachments'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />
      <CreateAttachments
        type="oc_non_collection_events"
        submitApi={API.crm.documents.attachments.createAttachment}
        categoryApi={API.systemConfiguration.operationAdministrations.notesAttachment.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.operationAdministrations.notesAttachment.attachmentSubcategories.getAll()}
        listLink={`/operations-center/operations/non-collection-events/${id}/view/documents/attachments`}
      />
    </div>
  );
}
