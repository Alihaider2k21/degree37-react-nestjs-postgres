import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import { fetchData } from '../../../../helpers/Api';
import { VolunteersBreadCrumbsData } from '../../../../components/crm/contacts/volunteers/VolunteersBreadCrumbsData';
import VolunteerNavigation from '../../../../components/crm/contacts/volunteers/VolunteerNavigation';
import TopBar from '../../../../components/common/topbar/index';
import Layout from '../../../../components/common/layout';

export default function VolunteerLayout() {
  const params = useParams();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [volunteer, setVolunteer] = React.useState(null);
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

  React.useMemo(() => {
    const fetchVolunteer = async () => {
      try {
        const { data } = await fetchData(
          `/contact-volunteer/${params?.volunteerId}`
        );
        setVolunteer(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVolunteer();
  }, [params?.volunteerId]);

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
            location.pathname.split('/').pop() === 'service' ||
            location.pathname.split('/').pop() === 'activity'
              ? null
              : search
          }
          SearchOnChange={
            location.pathname.split('/').pop() === 'view' ||
            location.pathname.split('/').pop() === 'service' ||
            location.pathname.split('/').pop() === 'activity'
              ? null
              : searchFieldChange
          }
          SearchPlaceholder={
            location.pathname.split('/').pop() === 'view' ||
            location.pathname.split('/').pop() === 'service' ||
            location.pathname.split('/').pop() === 'activity'
              ? null
              : 'Search'
          }
        />
        {location.pathname !==
          `/crm/contacts/volunteers/${params?.volunteerId}/view/communication` && (
          <VolunteerNavigation volunteer={volunteer} />
        )}
        <Outlet
          context={{ setBreadCrumbsState, breadCurmbState, search, volunteer }}
        />
      </div>
    </Layout>
  );
}
