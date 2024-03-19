import React, { useEffect, useState } from 'react';
import NavigationTopBar from '../../../../common/NavigationTopBar';
import viewimage from '../../../../../assets/images/viewimage.png';
import TopBar from '../../../../common/topbar/index';
import { useParams } from 'react-router-dom';
import DriveViewNavigationTabs from '../navigationTabs';
import { toast } from 'react-toastify';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import {
  OPERATIONS_CENTER,
  OPERATIONS_CENTER_DRIVES_PATH,
  OPERATIONS_CENTER_DRIVES_DONOR_SCHEDULES,
} from '../../../../../routes/path';
import OperationCenterDonorSchedules from './OperationCenterDonorSchedules';

export default function DonorSchedulesView() {
  const [driveData, setDriveData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id, slug } = useParams();
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
      class: 'disable-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.EDIT.replace(':id', id),
    },
    {
      label: 'Donor Schedules',
      class: 'active-label',
      link: OPERATIONS_CENTER_DRIVES_DONOR_SCHEDULES.LIST.replace(':id', id),
    },
  ];

  const getDriveData = async (id) => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    try {
      setIsLoading(true);
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/drives/${id}`
      );
      const { data } = await result.json();
      data[0] ? setDriveData(data[0]) : setDriveData(null);
    } catch (error) {
      toast.error('Error fetching drive');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDriveData(id);
  }, []);

  console.log(isLoading, 'slug', slug);

  return (
    <div>
      <div className="mainContent ">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Donor Schedules'}
          SearchValue={null}
          SearchOnChange={null}
          SearchPlaceholder={null}
        />
        <div className="imageMainContent">
          <NavigationTopBar img={viewimage} data={driveData} />
          <div className="d-flex align-items-center justify-between">
            <DriveViewNavigationTabs />
          </div>
        </div>
      </div>
      <div className="bodyMainContent">
        <OperationCenterDonorSchedules />
      </div>
    </div>
  );
}
