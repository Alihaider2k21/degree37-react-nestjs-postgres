import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import SvgComponent from '../../../../../common/SvgComponent';
import DetailView from './components/DetailView';
//import Loader from "./components/Loader";
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import { formatUser } from '../../../../../../helpers/formatUser';
import { formatDate } from '../../../../../../helpers/formatDate';
import { LocationBreadCrumbsData } from '../LocationBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ViewDetailOfRoomSize = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const bearerToken = localStorage.getItem('token');
  const { id } = useParams();
  /*  const [loading, setLoading] = useState(false); */
  const [RoomData, setRoomData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const getData = async () => {
    setIsLoading(true);
    try {
      const result = await fetch(`${BASE_URL}/room-size/${id}`, {
        headers: {
          authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
      });
      const data = await result.json();
      setRoomData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(`Error fetching data: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  /* if (loading) {
    return <Loader />;
  } */
  const ViewBreadcrumbsData = [
    ...LocationBreadCrumbsData,
    {
      label: 'View Room Size',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/crm-admin/locations/room-size/${id}`,
    },
  ];
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={ViewBreadcrumbsData}
        BreadCrumbsTitle={'Room Sizes'}
      />
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.CRM_ADMINISTRATION.LOCATIONS.ROOM_SIZES.WRITE,
        ]) && (
          <div className="tableView">
            <div className="buttons">
              <Link
                to={`/system-configuration/tenant-admin/crm-admin/locations/${id}/edit`}
              >
                <span className="icon">
                  <SvgComponent name={'EditIcon'} />
                </span>
                <span className="text">Edit</span>
              </Link>
            </div>
          </div>
        )}
        <DetailView
          isLoading={isLoading}
          title={'Room Size Detail'}
          data={[
            {
              label: 'Name',
              value: RoomData?.name,
            },
            {
              label: 'Description',
              value: RoomData?.description,
            },
          ]}
        />
        <DetailView
          isLoading={isLoading}
          title={'Insights'}
          data={[
            {
              label: 'Status',
              value: RoomData?.is_active,
            },
            {
              label: 'Created By',
              value: `${formatUser(RoomData?.created_by)} ${
                formatDate(RoomData?.created_at) ?? ''
              }`,
            },
            {
              label: 'Modified',
              value: `${formatUser(
                RoomData?.modified_by
                  ? RoomData?.modified_by
                  : RoomData?.created_by
              )} ${formatDate(
                RoomData?.modified_at
                  ? RoomData?.modified_at
                  : RoomData?.created_at
              )}`,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ViewDetailOfRoomSize;
