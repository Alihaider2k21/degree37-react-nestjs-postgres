import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../../../../../api/api-routes';
import ListAttachments from '../../../../common/DocumentComponent/Attachments/ListAttachments';
import TopBar from '../../../../common/topbar/index';
import TopTabsNCP from '../../topTabsNCP.js';
import { NonCollectionProfilesBreadCrumbsData } from '../../NonCollectionProfilesBreadCrumbsData';

export default function AttachmentsList() {
  const { id } = useParams();
  const [search, setSearch] = useState('');
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
      class: 'active-label',
      link: `/crm/non-collection-profiles/${id}/documents/attachments`,
    },
  ];
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Attachments'}
        SearchValue={search}
        SearchOnChange={(e) => {
          setSearch(e.target.value);
        }}
        SearchPlaceholder={'Search'}
      />
      <TopTabsNCP
        NCPID={id}
        // editLink={`/crm/non-collection-profiles/${id}/edit`}
        // editName={'Edit NCP'}
        endPath={'attachments'}
      />
      <ListAttachments
        search={search}
        type="crm_non_collection_profiles"
        categoryApi={API.systemConfiguration.crmAdministration.account.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.crmAdministration.account.attachmentSubcategories.getAll()}
        listApi={API.crm.documents.attachments.getAllAttachment}
        archiveApi={API.crm.documents.attachments.archiveAttachment}
        viewEditApi={`/crm/non-collection-profiles/${id}/documents/attachments`}
        notesApi={`/crm/non-collection-profiles/${id}/documents/notes`}
        attachmentApi={`/crm/non-collection-profiles/${id}/documents/attachments`}
        createApi={`/crm/non-collection-profiles/${id}/documents/attachments/create`}
      />
    </div>
  );
}
