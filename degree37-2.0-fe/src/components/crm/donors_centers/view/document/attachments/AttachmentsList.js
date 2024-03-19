import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../../../../../../api/api-routes';
// import viewimage from '../../../../../../assets/images/viewimage.png';
import ListAttachments from '../../../../../common/DocumentComponent/Attachments/ListAttachments';
import TopBar from '../../../../../common/topbar/index';
// import AccountViewNavigationTabs from '../../../navigationTabs';
import TopTabsDonorCenters from '../../../topTabsDonorCenters';
import { DonorCentersBreadCrumbsData } from '../../../DonorCentersBreadCrumbsData';

export default function AttachmentsList() {
  const { id } = useParams();
  const [search, setSearch] = useState('');

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
      class: 'active-label',
      link: `#`,
    },
  ];
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
      <TopTabsDonorCenters donorCenterId={id} />
      <ListAttachments
        search={search}
        type="donor_centers"
        categoryApi={API.systemConfiguration.crmAdministration.account.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.crmAdministration.account.attachmentSubcategories.getAll()}
        listApi={API.crm.documents.attachments.getAllAttachment}
        archiveApi={API.crm.documents.attachments.archiveAttachment}
        viewEditApi={`/crm/donor-center/${id}/view/documents/attachments`}
        notesApi={`/crm/donor-center/${id}/view/documents/notes`}
        attachmentApi={`/crm/donor-center/${id}/view/documents/attachments`}
        createApi={`/crm/donor-center/${id}/view/documents/attachments/create`}
      />
    </div>
  );
}
