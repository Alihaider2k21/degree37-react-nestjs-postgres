import React from 'react';
import { useParams } from 'react-router';
import EditAttachments from '../../../../common/DocumentComponent/Attachments/EditAttachments';
import TopBar from '../../../../common/topbar/index';
import { API } from '../../../../../api/api-routes';
import { NonCollectionProfilesBreadCrumbsData } from '../../NonCollectionProfilesBreadCrumbsData';

export default function AttachmentsEdit() {
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
        type="crm_non_collection_profiles"
        attachId={attachId}
        editApi={API.crm.documents.attachments.updateAttachment}
        categoryApi={API.systemConfiguration.crmAdministration.account.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.crmAdministration.account.attachmentSubcategories.getAll()}
        listLink={`/crm/non-collection-profiles/${id}/documents/attachments`}
        archiveApi={API.crm.documents.attachments.archiveAttachment}
      />
    </div>
  );
}
