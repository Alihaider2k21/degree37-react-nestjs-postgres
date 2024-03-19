import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import Layout from '../../../../components/common/layout';
import TopBar from '../../../../components/common/topbar/index';
import { DonorBreadCrumbsData } from '../../../../components/crm/contacts/donor/DonorBreadCrumbsData';
import { fetchData } from '../../../../helpers/Api';
import DonorNavigation from '../../../../components/crm/contacts/donors/DonorNavigation';

export default function DonorsLayout() {
  const { donorId: id } = useParams();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [donor, setDonor] = useState(null);
  const [breadCurmbState, setBreadCrumbsState] = useState([
    ...DonorBreadCrumbsData,
    {
      label: 'View Donors',
      class: 'disable-label',
      link: `/crm/contacts/donor/${id}/view`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/crm/contacts/donor/${id}/view/documents/notes`,
    },
    {
      label: 'Notes',
      class: 'active-label',
      link: `/crm/contacts/donor/${id}/view/documents/notes`,
    },
  ]);

  const searchFieldChange = (e) => {
    setSearch(e.target.value);
  };
  React.useMemo(() => {
    fetchData(`/contact-donors/${id}`, 'GET')
      .then((res) => setDonor(res?.data))
      .catch((err) => console.error(err));
  }, [id]);

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
            location.pathname.split('/').pop() === 'recent-activity'
              ? null
              : search
          }
          SearchOnChange={
            location.pathname.split('/').pop() === 'view' ||
            location.pathname.split('/').pop() === 'service' ||
            location.pathname.split('/').pop() === 'recent-activity'
              ? null
              : searchFieldChange
          }
          SearchPlaceholder={
            location.pathname.split('/').pop() === 'view' ||
            location.pathname.split('/').pop() === 'service' ||
            location.pathname.split('/').pop() === 'recent-activity'
              ? null
              : 'Search'
          }
        />
        {location?.pathname !==
          `/crm/contacts/donor/${id}/view/communication` && (
          <DonorNavigation donor={donor} />
        )}
        <Outlet
          context={{ setBreadCrumbsState, breadCurmbState, search, donor }}
        />
      </div>
    </Layout>
  );
}
