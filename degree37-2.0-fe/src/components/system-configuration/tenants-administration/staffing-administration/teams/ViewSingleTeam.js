import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { TEAMS_PATH } from '../../../../../routes/path';
import ViewForm from '../../../../common/ViewForm';
import { TeamsBreadCrumbsData } from './TeamsBreadCrumbsData';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';

const ViewSingleTeam = () => {
  const { id } = useParams();
  const [teamData, setTeamData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const bearerToken = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (id) => {
      try {
        setIsLoading(true);
        if (id) {
          const result = await fetch(`${BASE_URL}/staff-admin/teams/${id}`, {
            headers: {
              authorization: `Bearer ${bearerToken}`,
            },
          });
          if (result?.status === 200) {
            let data = await result.json();
            const teamDataRes = data.team;
            teamDataRes.status = teamDataRes.is_active;
            teamDataRes.collection_operations = data.collectionOperations
              .map((bco) => bco.collection_operation_id.name)
              .join(', ');
            setTeamData(teamDataRes);
          } else {
            toast.error('Error Fetching Team Details', {
              autoClose: 3000,
            });
          }
        } else {
          toast.error('Error Getting Team Details', { autoClose: 3000 });
        }
      } catch (error) {
        console.log(error);
        toast.error('Error Getting Team Details', { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      getData(id);
    }
  }, [id, BASE_URL]);

  const BreadcrumbsData = [
    ...TeamsBreadCrumbsData,
    {
      label: 'View Team',
      class: 'active-label',
      link: `${TEAMS_PATH.VIEW.replace(':id', teamData?.id)}`,
    },
  ];

  const config = [
    {
      section: 'Team Details',
      fields: [
        { label: 'Name', field: 'name' },
        { label: 'Short Description', field: 'short_description' },
        { label: 'Description', field: 'description' },
        { label: 'Collection Operation', field: 'collection_operations' },
      ],
    },
    {
      section: 'Insights',
      fields: [
        {
          label: 'Status',
          field: 'status',
          format: (value) => (value ? 'Active' : 'Inactive'),
        },
        {
          label: 'Created',
          field: 'created_by',
        },
        {
          label: 'Modified',
          field: 'updated_by',
        },
      ],
    },
  ];
  return (
    <ViewForm
      breadcrumbsData={BreadcrumbsData}
      breadcrumbsTitle={'Teams'}
      editLink={
        CheckPermission([Permissions.STAFF_ADMINISTRATION.TEAMS.TEAMS.WRITE]) &&
        `${TEAMS_PATH.EDIT.replace(':id', teamData?.id)}`
      }
      data={teamData}
      config={config}
      isLoading={isLoading}
    />
  );
};
export default ViewSingleTeam;
