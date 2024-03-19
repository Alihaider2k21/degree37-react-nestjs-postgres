import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DetailView from './DetailView';
import { ViewDetailsBreadcrumbsData, label } from '../data';
import TopBar from '../../../../../common/topbar/index';
import SvgComponent from '../../../../../common/SvgComponent';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import { formatUser } from '../../../../../../helpers/formatUser';
import { formatDate } from '../../../../../../helpers/formatDate';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ViewDetail = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const bearerToken = localStorage.getItem('token');
  const { id } = useParams();
  const [staffSetup, setStaffSetup] = useState({});
  const [config, setCOnfig] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getStaffSetup = async () => {
    try {
      setIsLoading(true);
      const result = await fetch(
        `${BASE_URL}/staffing-admin/staff-setup/${id}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          method: 'GET',
        }
      );
      const data = await result.json();
      setStaffSetup(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching data:', error);
      toast.error(`Error fetching data: ${error}`);
    }
  };

  useEffect(() => {
    if (staffSetup?.staff_configuration?.length > 0) {
      let row = [
        {
          rowData: [
            {
              value: 'Contact Role',
              class: true,
            },
            {
              value: 'Qty',
              class: true,
            },
            {
              value: 'Lead Time',
              class: true,
            },
            {
              value: 'Setup Time',
              class: true,
            },
            {
              value: 'BreakDown Time',
              class: true,
            },
            {
              value: 'Wrapup Time',
              class: true,
            },
          ],
        },
      ];
      let temp = staffSetup?.staff_configuration?.map((item) => {
        return {
          rowData: [
            {
              value: item?.contact_role_id?.name,
              class: true,
            },
            {
              value: item?.qty,
            },
            {
              value: item?.lead_time,
            },
            {
              value: item?.setup_time,
            },
            {
              value: item?.breakdown_time,
            },
            {
              value: item?.wrapup_time,
            },
          ],
        };
      });
      setCOnfig([...row, ...temp]);
    }
  }, [staffSetup]);

  useEffect(() => {
    getStaffSetup();
  }, [id]);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={ViewDetailsBreadcrumbsData}
        BreadCrumbsTitle={label}
      />
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.STAFF_ADMINISTRATION.STAFF_SETUPS.WRITE,
        ]) && (
          <div className="editAnchor">
            <Link
              to={`/system-configuration/tenant-admin/staffing-admin/staff-setup/${id}/edit`}
              style={{ fontSize: '14px' }}
            >
              <SvgComponent name={'EditIcon'} /> Edit
            </Link>
          </div>
        )}
        <DetailView
          title={'Staff Setup Details'}
          isLoading={isLoading}
          data={[
            {
              label: 'Operation Type',
              value: staffSetup?.staff?.opeartion_type_id
                ? staffSetup?.staff?.opeartion_type_id
                : 'N/A',
            },
            {
              label: 'Name',
              value: staffSetup?.staff?.name ? staffSetup?.staff?.name : 'N/A',
            },
            {
              label: 'Short Name',
              value: staffSetup?.staff?.short_name
                ? staffSetup?.staff?.short_name
                : 'N/A',
            },
            {
              label: 'Location Type',
              value: staffSetup?.staff?.location_type_id
                ? staffSetup?.staff?.location_type_id
                : 'N/A',
            },
            {
              label: 'Procedure Type',
              value: staffSetup?.staff?.procedure_type_id?.name
                ? staffSetup?.staff?.procedure_type_id?.name
                : 'N/A',
            },
            {
              label: 'Beds',
              value: staffSetup?.staff?.beds ? staffSetup?.staff?.beds : 'N/A',
              icon: 'Beds setting determines the maximum number of appointment slots.',
            },
            {
              label: 'Concurent Beds',
              value: staffSetup?.staff?.concurrent_beds
                ? staffSetup?.staff?.concurrent_beds
                : 'N/A',
              icon: 'Concurrent Beds determines how appointment slots are staggered for this procedure type.',
            },
            {
              label: 'Stagger Slots',
              value: staffSetup?.staff?.stagger_slots
                ? staffSetup?.staff?.stagger_slots
                : 'N/A',
              icon: 'Value (in minutes) to space the slots apart for concurrent beds',
            },
          ]}
        />
        <DetailView
          title={'Configuration'}
          isMulti={true}
          colSpan={'6'}
          isLoading={isLoading}
          data={config}
        />
        <DetailView
          isLoading={isLoading}
          title={'Insights'}
          data={[
            {
              label: 'Status',
              value: staffSetup?.status,
            },
            {
              label: 'Created By',
              value: `${
                staffSetup?.created_by
                  ? formatUser(staffSetup?.created_by)
                  : 'N/A |'
              } ${
                staffSetup?.created_at
                  ? formatDate(staffSetup?.created_at)
                  : 'N/A'
              }`,
            },
            {
              label: 'Modified',
              value: `${
                staffSetup?.modified_by || staffSetup?.created_by
                  ? formatUser(
                      staffSetup?.modified_by
                        ? staffSetup?.modified_by
                        : staffSetup?.created_by
                    )
                  : 'N/A |'
              } ${
                staffSetup?.modified_by || staffSetup?.created_by
                  ? formatDate(
                      staffSetup?.modified_at
                        ? staffSetup?.modified_at
                        : staffSetup?.created_at
                    )
                  : 'N/A'
              }`,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ViewDetail;
