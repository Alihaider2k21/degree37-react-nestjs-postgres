import React, { useState } from 'react';
import {
  SESSION_STAFFING_PATH,
  OPERATIONS_CENTER_DRIVES_PATH,
  OPERATIONS_CENTER_SESSIONS_PATH,
  OPERATIONS_CENTER_MANAGE_FAVORITES_PATH,
} from '../../../../../routes/path';
import { useParams } from 'react-router-dom';
import viewimage from '../../../../../assets/images/viewimage.png';
import ListStaffing from '../../../../common/staffing/ListStaffing';
import SessionsNavigationTabs from '../navigationTabs';
import styles from '../Session.module.scss';

const SessionsListStaffing = () => {
  const params = useParams();
  const [sessionData, setSessionData] = useState(null);

  React.useEffect(() => {
    setSessionData({
      id: params?.session_id,
      date: new Date().toISOString(),
      donor_center: {
        name: 'Metro Donor Center',
      },
    });
  }, [params?.session_id]);

  const sessionDate = (() => {
    const d = new Date(sessionData?.date);
    const month = d.toLocaleString('default', { month: 'short' });
    const date = d.getDate();
    const year = d.getFullYear();

    return `${month} ${date}, ${year}`;
  })();

  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'active-label',
      link: OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.LIST,
    },
    {
      label: 'Operations',
      class: 'active-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: 'Sessions',
      class: 'active-label',
      link: OPERATIONS_CENTER_SESSIONS_PATH.LIST,
    },
    {
      label: 'View Session',
      class: 'active-label',
      link: OPERATIONS_CENTER_SESSIONS_PATH.VIEW.replace(
        ':id',
        params?.session_id
      ).replace(':slug', 'about'),
    },
    {
      label: 'Staffing',
      class: 'active-label',
      link: SESSION_STAFFING_PATH.LIST.replace(
        ':session_id',
        params?.session_id
      ),
    },
  ];

  return (
    <ListStaffing
      customTopBar={
        <div className="imageMainContent">
          <div className="d-flex align-items-center gap-3 ">
            <img
              src={viewimage}
              className="bg-white heroIconImg"
              alt="CancelIcon"
            />
            <div className="d-flex flex-column">
              <h2 className={styles.name}>{sessionData?.donor_center?.name}</h2>
              <h2 className={styles.date}>{sessionDate}</h2>
            </div>
          </div>
          <div className="d-flex align-items-center justify-between">
            <SessionsNavigationTabs />
          </div>
        </div>
      }
      calendarIconShowHeader
      hideAssociatedWith
      taskableType={'sessions'}
      taskableId={params?.session_id}
      breadCrumbsData={BreadcrumbsData}
    />
  );
};

export default SessionsListStaffing;
