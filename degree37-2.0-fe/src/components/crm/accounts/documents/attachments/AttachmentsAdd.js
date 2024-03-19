import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../api/api-routes';
import CreateAttachments from '../../../../common/DocumentComponent/Attachments/CreateAttachments';
import TopBar from '../../../../common/topbar/index';
import { CRMAccountsBreadCrumbsData } from '../../AccountsBreadCrumbsData';

export default function AttachmentsAdd() {
  const { id } = useParams();

  const BreadcrumbsData = [
    ...CRMAccountsBreadCrumbsData,
    {
      label: 'View Account',
      class: 'disable-label',
      link: `/crm/accounts/${id}/view/about`,
    },
    {
      label: 'Document',
      class: 'disable-label',
      link: `/crm/accounts/${id}/view/documents/notes`,
    },
    {
      label: 'Attachments',
      class: 'disable-label',
      link: `/crm/accounts/${id}/view/documents/attachments`,
    },
    {
      label: 'Add Attachment',
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
      <CreateAttachments
        type="accounts"
        submitApi={API.crm.documents.attachments.createAttachment}
        categoryApi={API.systemConfiguration.crmAdministration.account.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.crmAdministration.account.attachmentSubcategories.getAll()}
        listLink={`/crm/accounts/${id}/view/documents/attachments`}
      />
    </div>
  );
}
