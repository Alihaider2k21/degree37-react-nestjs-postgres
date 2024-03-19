import React, { useEffect, useState } from 'react';
import TopBar from '../../../common/topbar/index';
import viewimage from '../../../../assets/images/viewimage.png';
import styles from './index.module.scss';
import './driveView.scss';
import DriveViewNavigationTabs from './navigationTabs';
import { useNavigate, useParams } from 'react-router-dom';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import About from './about';
import MarketingDetails from './marketingDetails';
import {
  OPERATIONS_CENTER,
  OPERATIONS_CENTER_DRIVES_PATH,
} from '../../../../routes/path';
import { makeAuthorizedApiRequest } from '../../../../helpers/Api';
import NavigationTopBar from '../../../common/NavigationTopBar';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/OcPermissionsEnum';
import { toast } from 'react-toastify';

function DriveView() {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { id, slug } = useParams();
  const [driveData, setDriveData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modifiedData, setModifiedData] = useState(null);

  const breadCrumbsTitle =
    slug === 'about'
      ? 'About'
      : slug === 'shift_details'
      ? 'Shift Details'
      : slug === 'marketing-details'
      ? 'Marketing Details'
      : slug === 'tasks'
      ? 'Tasks'
      : slug === 'documents'
      ? 'Documents'
      : slug === 'change_audit'
      ? 'Change Audit'
      : slug === 'donor_schedules'
      ? 'Donor Schedules'
      : slug === 'staffing'
      ? 'Staffing'
      : slug === 'results'
      ? 'Results'
      : null;
  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'disable-label',
      link: OPERATIONS_CENTER.DASHBOARD,
    },
    {
      label: 'Operations',
      class: 'disable-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: 'Drives',
      class: 'disable-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: 'View Drive',
      class: 'active-label',
      link: `/operations-center/operations/drives/${id}/view/about`,
    },
    // {
    //   label: breadCrumbsTitle,
    //   class: 'disable-label',
    //   link: '#',
    // },
  ];

  const getDriveData = async (id) => {
    try {
      setIsLoading(true);
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/drives/${id}`
      );
      const { data, modifiedData: md } = await result.json();
      data[0] ? setDriveData(data[0]) : setDriveData(null);
      setModifiedData(md);
    } catch (error) {
      toast.error('Error fetching drive');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDriveData(id);
  }, []);

  return (
    <div className={styles.DriveViewMain}>
      <div className="mainContent ">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={breadCrumbsTitle}
          SearchValue={null}
          SearchOnChange={null}
          SearchPlaceholder={null}
        />
        <div className="imageMainContent">
          <NavigationTopBar img={viewimage} data={driveData} />
          <div className="d-flex align-items-center justify-between">
            <DriveViewNavigationTabs />
            <div className="d-flex align-items-center gap-3">
              {CheckPermission([
                Permissions.OPERATIONS_CENTER.OPERATIONS.DRIVES.WRITE,
              ]) && (
                <button
                  className="btn btn-md btn-link p-0 editBtn"
                  color="primary"
                  onClick={() => {
                    navigate(`/operations-center/operations/drives/${id}/edit`);
                  }}
                >
                  <FontAwesomeIcon
                    className="m-1"
                    width={15}
                    height={15}
                    icon={faPenToSquare}
                  />
                  Edit Drive
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bodyMainContent">
        {slug === 'about' && (
          <About
            driveData={driveData}
            isLoading={isLoading}
            getDriveData={getDriveData}
            modifiedData={modifiedData}
          />
        )}
        {slug === 'marketing-details' && (
          <MarketingDetails
            driveData={driveData}
            isLoading={isLoading}
            getDriveData={getDriveData}
          />
        )}
      </div>
    </div>
  );
}

export default DriveView;
