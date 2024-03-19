import React from 'react';
import { useParams } from 'react-router';
import CreateAttachments from '../../../../common/DocumentComponent/Attachments/CreateAttachments';
import TopBar from '../../../../common/topbar/index';
import { API } from '../../../../../api/api-routes';
import { useState } from 'react';
import { NonCollectionProfilesBreadCrumbsData } from '../../NonCollectionProfilesBreadCrumbsData';

export default function AttachmentsAdd() {
  const { id } = useParams();

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
      label: 'Add Attachment',
      class: 'active-label',
      link: `#`,
    },
  ];
  const [search, setSearch] = useState('');
  const searchFieldChange = (e) => {
    setSearch(e.target.value);
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Attachments'}
        SearchValue={search}
        SearchOnChange={searchFieldChange}
        SearchPlaceholder={'Search'}
      />
      <CreateAttachments
        type="crm_non_collection_profiles"
        submitApi={API.crm.documents.attachments.createAttachment}
        categoryApi={API.systemConfiguration.crmAdministration.account.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.crmAdministration.account.attachmentSubcategories.getAll()}
        listLink={`/crm/non-collection-profiles/${id}/documents/attachments`}
      />
    </div>
  );
}
