import React, { useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { API } from '../../../../../../../api/api-routes';
import ListAttachments from '../../../../../../common/DocumentComponent/Attachments/ListAttachments';

import { DonorBreadCrumbsData } from '../../../../donor/DonorBreadCrumbsData';
import { useEffect } from 'react';

export default function AttachmentsList() {
  const { donorId: id } = useParams();
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
        class: 'active-label',
        link: `/crm/contacts/donor/${id}/view/documents/attachments`,
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
  //     class: 'active-label',
  //     link: `/crm/contacts/donor/${id}/view/documents/attachments`,
  //   },
  // ];
  const [search, setSearch] = useState('');
  const searchFieldChange = (e) => {
    setSearch(e.target.value);
  };
  console.log(searchFieldChange);
  return (
    // <div className="mainContent">
    //   <TopBar
    //     BreadCrumbsData={BreadcrumbsData}
    //     BreadCrumbsTitle={'Attachments'}
    //     SearchValue={search}
    //     SearchOnChange={searchFieldChange}
    //     SearchPlaceholder={'Search'}
    //   />
    //   <DonorNavigation />
    <ListAttachments
      search={search}
      type="donors"
      categoryApi={API.systemConfiguration.crmAdministration.contact.attachmentCategories.getAll()}
      subCategoryApi={API.systemConfiguration.crmAdministration.contact.attachmentSubcategories.getAll()}
      listApi={API.crm.documents.attachments.getAllAttachment}
      archiveApi={API.crm.documents.attachments.archiveAttachment}
      viewEditApi={`/crm/contacts/donor/${id}/view/documents/attachments`}
      notesApi={`/crm/contacts/donor/${id}/view/documents/notes`}
      attachmentApi={`/crm/contacts/donor/${id}/view/documents/attachments`}
      createApi={`/crm/contacts/donor/${id}/view/documents/attachments/create`}
    />
    // </div>
  );
}
