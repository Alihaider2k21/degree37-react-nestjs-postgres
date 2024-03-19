import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../../api/api-routes';
import viewimage from '../../../../../../assets/images/viewimage.png';
import ViewAttachments from '../../../../../common/DocumentComponent/Attachments/ViewAttachments';
import TopBar from '../../../../../common/topbar/index';
import DriveNavigationTabs from '../../navigationTabs';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import NavigationTopBar from '../../../../../common/NavigationTopBar';

export default function AttachmentsView() {
  const { id, attachId } = useParams();
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
      class: 'disable-label',
      link: `/operations-center/operations/drives/${id}/view/documents/attachments`,
    },
    {
      label: 'View Attachment',
      class: 'active-label',
      link: '#',
    },
  ];
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
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />
      <div className="imageMainContent">
        <NavigationTopBar img={viewimage} data={driveData} />
        <DriveNavigationTabs />
      </div>
      <ViewAttachments
        viewApi={API.crm.documents.attachments.getAttachmentByID}
        attachId={attachId}
        editLink={`/operations-center/operations/drives/${id}/view/documents/attachments/${attachId}/edit`}
      />
    </div>
  );
}
