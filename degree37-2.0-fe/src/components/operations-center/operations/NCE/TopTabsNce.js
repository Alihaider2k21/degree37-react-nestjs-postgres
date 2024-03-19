// import React, { useEffect, useState } from 'react';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import '../../../../styles/Global/Global.scss';
import '../../../../styles/Global/Global.scss';
import imageProfile from '../../../../assets/clock.svg';
// import { fetchData } from '../../../../helpers/Api';
import NavTabs from '../../../common/navTabs';
import { API } from '../../../../api/api-routes';
// import { toast } from 'react-toastify';
import {
  OPERATIONS_CENTER_NCE_CHANGE_AUDIT_PATH,
  OPERATIONS_CENTER_NCE,
  OPERATIONS_CENTER_NCE_DOCUMENT_ATTACHMENT_PATH,
  OPERATIONS_CENTER_NCE_DOCUMENT_NOTE_PATH,
  OPERATIONS_CENTER_NON_COLLECTION_EVENTS_STAFFING,
  OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS,
} from '../../../../routes/path';

const TopTabsNce = ({
  // NCEID,
  editLink,
  editName,
  custLeftComp = null,
  // endPath,
  // activePath,
  buttonRight,
  marginBtmZero,
}) => {
  const location = useLocation();
  const currentLocation = location.pathname;
  const { id, taskId, noteId, attachId } = useParams();
  const [singleData, setSingleData] = useState({
    event_name: '',
    location: '',
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const getData = async () => {
      const { data } = await API.ocNonCollectionEvents.getSingleData(token, id);
      if (data?.status_code === 200) {
        setSingleData((prevData) => ({
          ...prevData,
          event_name: data?.data?.event_name,
          location: data?.data?.location_id?.name,
        }));
      }
    };
    if (id) {
      getData();
    }
  }, []);

  // const BASE_URL = process.env.REACT_APP_BASE_URL;
  // useEffect(() => {
  // const getData = async (NCEID) => {
  // if (NCEID) {
  //   const result = await fetchData(`/non-collection-profiles/${NCEID}`);
  //   let { data, status, status_code } = result;
  //   if ((status === 'success') & (status_code === 200)) {
  //     const { owner_id } = data;
  //     owner_id.name = `${owner_id?.first_name ?? ''} ${
  //       owner_id?.last_name ?? ''
  //     }`;
  //     setNcpData({
  //       event_name: 'Event Name',
  //       location: 'Location',
  //     });
  //   } else {
  //     toast.error('Error Fetching Non-Collection Profile Details', {
  //       autoClose: 3000,
  //     });
  //   }
  // } else {
  //   toast.error('Error getting Non-Collection Profile Details', {
  //     autoClose: 3000,
  //   });
  // }
  // };
  // if (NCEID) {
  // getData(NCEID);
  // }
  // }, [NCEID, BASE_URL]);
  const NonCollectionTabs = [
    {
      label: 'About',
      link: OPERATIONS_CENTER_NCE.VIEW.replace(':id', id),
      className: 'p10',
    },
    {
      label: 'Shift Details',
      link: OPERATIONS_CENTER_NCE.SHIFT_DETAILS.replace(':id', id),
      className: 'p10',
    },
    {
      label: 'Tasks',
      link: OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS.LIST.replace(
        ':id',
        id
      ),
      relevantLinks: [
        OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS.VIEW.replace(
          ':id',
          id
        ).replace(':taskId', taskId),
      ],
      className: 'p10',
    },
    {
      label: 'Documents',
      link: OPERATIONS_CENTER_NCE_DOCUMENT_NOTE_PATH.LIST.replace(':id', id),
      relevantLinks: [
        OPERATIONS_CENTER_NCE_DOCUMENT_NOTE_PATH.VIEW.replace(
          ':id',
          id
        ).replace(':noteId', noteId),
        OPERATIONS_CENTER_NCE_DOCUMENT_ATTACHMENT_PATH.LIST.replace(':id', id),
        OPERATIONS_CENTER_NCE_DOCUMENT_ATTACHMENT_PATH.VIEW.replace(
          ':id',
          id
        ).replace(':attachId', attachId),
      ],
      className: 'p10',
    },
    {
      label: 'Change Audit',
      link: OPERATIONS_CENTER_NCE_CHANGE_AUDIT_PATH.LIST.replace(':id', id),
      className: 'p10',
    },
    {
      label: 'Staffing',
      link: OPERATIONS_CENTER_NON_COLLECTION_EVENTS_STAFFING.LIST.replace(
        ':id',
        id
      ),
      className: 'p10',
    },
  ];
  return (
    <div className="imageMainContent">
      <div className="d-flex align-items-center gap-3 pb-4 ">
        <img
          src={imageProfile}
          className="bg-white heroIconImg"
          alt="ClockIcon"
        />
        <div className="d-flex flex-column">
          <h4 className="">{singleData?.event_name}</h4>
          <span>{singleData?.location}</span>
        </div>
      </div>
      <div
        className={custLeftComp ? `d-flex justify-content-between mb-2` : ''}
      >
        <div className="crmTabBar">
          <NavTabs
            marginBtmZero={marginBtmZero}
            tabs={NonCollectionTabs}
            currentLocation={currentLocation}
            isedit={true}
            editLink={editLink}
            editLinkName={editName}
            buttonRight={buttonRight}
          />
        </div>
        {custLeftComp && custLeftComp}
      </div>
    </div>
  );
};

export default TopTabsNce;
