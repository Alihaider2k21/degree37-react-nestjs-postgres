import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../api/api-routes';
import EditAttachments from '../../../../common/DocumentComponent/Attachments/EditAttachments';
import TopBar from '../../../../common/topbar/index';
import { CRMAccountsBreadCrumbsData } from '../../AccountsBreadCrumbsData';

export default function AttachmentsEdit() {
  const { id, attachId } = useParams();
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
        type="accounts"
        attachId={attachId}
        editApi={API.crm.documents.attachments.updateAttachment}
        categoryApi={API.systemConfiguration.crmAdministration.account.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.crmAdministration.account.attachmentSubcategories.getAll()}
        listLink={`/crm/accounts/${id}/view/documents/attachments`}
        archiveApi={API.crm.documents.attachments.archiveAttachment}
      />
    </div>
  );
}
