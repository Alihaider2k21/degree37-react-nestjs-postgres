import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../../../../../../api/api-routes';
import viewimage from '../../../../../../assets/images/viewimage.png';
import ListAttachments from '../../../../../common/DocumentComponent/Attachments/ListAttachments';
import TopBar from '../../../../../common/topbar/index';
import DriveNavigationTabs from '../../navigationTabs';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import NavigationTopBar from '../../../../../common/NavigationTopBar';

export default function AttachmentsList() {
  const { id } = useParams();
  const [search, setSearch] = useState('');
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [driveData, setDriveData] = useState(null);

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
      class: 'active-label',
      link: `/operations-center/operations/drives/${id}/view/documents/attachments`,
    },
  ];
  const searchFieldChange = (e) => {
    setSearch(e.target.value);
  };

  const getDriveData = async (id) => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/drives/${id}`
    );
    const { data } = await result.json();
    data[0] ? setDriveData(data[0]) : setDriveData(null);
  };

  console.log({ driveData });

  useEffect(() => {
    getDriveData(id);
  }, []);
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
        <NavigationTopBar img={viewimage} data={driveData} />
        <DriveNavigationTabs />
      </div>
      <ListAttachments
        search={search}
        type="drives"
        categoryApi={API.systemConfiguration.operationAdministrations.notesAttachment.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.operationAdministrations.notesAttachment.attachmentSubcategories.getAll()}
        listApi={API.crm.documents.attachments.getAllAttachment}
        archiveApi={API.crm.documents.attachments.archiveAttachment}
        viewEditApi={`/operations-center/operations/drives/${id}/view/documents/attachments`}
        notesApi={`/operations-center/operations/drives/${id}/view/documents/notes`}
        attachmentApi={`/operations-center/operations/drives/${id}/view/documents/attachments`}
        createApi={`/operations-center/operations/drives/${id}/view/documents/attachments/create`}
      />
    </div>
  );
}
