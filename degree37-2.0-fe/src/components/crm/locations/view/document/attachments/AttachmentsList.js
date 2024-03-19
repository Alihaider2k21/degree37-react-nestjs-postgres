import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../../../../../../api/api-routes';
import LocationNotes from '../../../../../../assets/images/LocationNotes.png';
import ListAttachments from '../../../../../common/DocumentComponent/Attachments/ListAttachments';
import TopBar from '../../../../../common/topbar/index';
import AccountViewNavigationTabs from '../../../navigationTabs';
import { useEffect } from 'react';
import { fetchData } from '../../../../../../helpers/Api';
import { LocationsBreadCrumbsData } from '../../../LocationsBreadCrumbsData';

export default function AttachmentsList() {
  const { id } = useParams();
  const [search, setSearch] = useState('');
  const [viewAddress, setViewAddress] = useState('');
  const [locations, setLocations] = useState('');

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
      class: 'active-label',
      link: '#',
    },
  ];

  useEffect(() => {
    fetchData(`/crm/locations/${id}`, 'GET')
      .then((res) => {
        if (res?.data) {
          let edit = res?.data;
          setViewAddress(`${edit?.address?.city}, ${edit?.address?.state}`);
          setLocations(edit?.name);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

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
      <div className="imageMainContent">
        <div className="d-flex align-items-center gap-3 ">
          <div style={{ width: '62px', height: '62px' }}>
            <img
              src={LocationNotes}
              style={{ width: '100%' }}
              alt="CancelIcon"
            />
          </div>
          <div className="d-flex flex-column">
            <h4 className="">{locations}</h4>
            <span>{viewAddress}</span>
          </div>
        </div>
        <AccountViewNavigationTabs />
      </div>
      <ListAttachments
        search={search}
        type="crm_locations"
        categoryApi={API.systemConfiguration.crmAdministration.location.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.crmAdministration.location.attachmentSubcategories.getAll()}
        listApi={API.crm.documents.attachments.getAllAttachment}
        archiveApi={API.crm.documents.attachments.archiveAttachment}
        viewEditApi={`/crm/locations/${id}/view/documents/attachments`}
        notesApi={`/crm/locations/${id}/view/documents/notes`}
        attachmentApi={`/crm/locations/${id}/view/documents/attachments`}
        createApi={`/crm/locations/${id}/view/documents/attachments/create`}
      />
    </div>
  );
}
