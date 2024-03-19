import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import { fetchData } from '../../../../helpers/Api';
import { VolunteersBreadCrumbsData } from '../../../../components/crm/contacts/volunteers/VolunteersBreadCrumbsData';
import TopBar from '../../../../components/common/topbar/index';
import Layout from '../../../../components/common/layout';
import StaffNavigation from '../../../../components/crm/contacts/staff/StaffNavigation';
import { STAFF_TASKS_PATH } from '../../../../routes/path';

export default function StaffLayout() {
  const params = useParams();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [staff, setStaff] = React.useState(null);
  const [breadCurmbState, setBreadCrumbsState] = useState([
    ...VolunteersBreadCrumbsData,
    {
      label: 'View Volunteers',
      class: 'disable-label',
      link: `/crm/contacts/volunteers/${params?.id}/view`,
    },
    {
      label: 'About',
      class: 'active-label',
      link: `/crm/contacts/volunteers/${params?.volunteerId}/view`,
    },
  ]);

  const searchFieldChange = (e) => {
    setSearch(e.target.value);
  };

  React.useEffect(() => {
    const fetchStaff = async () => {
      try {
        const [staff, staffRoles] = await Promise.all([
          fetchData(
            `/contact-staff/${
              params?.staff_id ?? params?.staffId ?? params?.id
            }`
          ),
          fetchData(
            `/contact-staff/${
              params?.staff_id ?? params?.staffId ?? params?.id
            }/roles`
          ),
        ]);
        const staffRole = staffRoles?.data.find(
          (staffRole) => staffRole.is_primary
        );
        setStaff({ ...staff?.data, role: staffRole?.role_id });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStaff();
  }, [params?.staffId, params?.staff_id, params?.id]);

  return (
    <Layout>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={breadCurmbState}
          BreadCrumbsTitle={
            breadCurmbState[breadCurmbState?.length - 1].label?.includes('View')
              ? breadCurmbState[breadCurmbState?.length - 2].label
              : breadCurmbState[breadCurmbState?.length - 1].label
          }
          SearchValue={
            location.pathname.split('/').pop() === 'view' ||
            location.pathname.split('/').pop() === 'availability'
              ? null
              : search
          }
          SearchOnChange={
            location.pathname.split('/').pop() === 'availability' ||
            location.pathname.split('/').pop() === 'view'
              ? null
              : searchFieldChange
          }
          SearchPlaceholder={
            location.pathname.split('/').pop() === 'availability' ||
            location.pathname.split('/').pop() === 'view'
              ? null
              : 'Search'
          }
        />
        {location?.pathname !==
          `/crm/contacts/staff/${params?.staffId}/view/leave` &&
          location?.pathname !==
            STAFF_TASKS_PATH.VIEW.replace(
              ':staff_id',
              params?.staff_id
            ).replace(':id', params?.id) &&
          location?.pathname !==
            `/crm/contacts/staff/${
              params?.staff_id ?? params?.staffId ?? params?.id
            }/view/communication` && <StaffNavigation staff={staff} />}
        <Outlet
          context={{ setBreadCrumbsState, breadCurmbState, search, staff }}
        />
      </div>
    </Layout>
  );
}
