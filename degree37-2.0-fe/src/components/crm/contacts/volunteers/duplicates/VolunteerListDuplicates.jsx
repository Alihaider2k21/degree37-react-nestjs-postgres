import React, { useEffect } from 'react';
import TableList from '../../../../common/tableListing';
import Pagination from '../../../../common/pagination/index';
import ConfirmModal from '../../../../common/confirmModal';
import ResolveIcon from '../../../../../assets/Resolve.svg';
import { useSearchParams, useParams, useOutletContext } from 'react-router-dom';
import { fetchData } from '../../../../../helpers/Api';

const initialSearchParams = {
  page: 1,
  limit: 10,
  keyword: '',
  sortOrder: 'DESC',
  sortName: 'id',
};

export default function VolunteerListDuplicates() {
  const params = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      { label: 'CRM', class: 'disable-label', link: '/' },
      { label: 'Contacts', class: 'disable-label', link: '/' },
      {
        label: 'Volunteer',
        class: 'disable-label',
        link: `/crm/contacts/volunteers`,
      },
      {
        label: 'View Volunteer',
        class: 'disable-label',
        link: `/crm/contacts/volunteers/${params?.volunteerId}/view`,
      },
      {
        label: 'Duplicates',
        class: 'disable-label',
        link: `/crm/contacts/volunteers/${params?.volunteerId}/view/duplicates`,
      },
    ]);
  }, []);
  const [searchParams, setSearchParams] = useSearchParams(initialSearchParams);
  const [volunteer, setVolunteer] = React.useState(null);
  const [duplicates, setDuplicates] = React.useState([]);
  const [totalDuplicates, setTotalDuplicates] = React.useState(-1);
  const [page, setPage] = React.useState(initialSearchParams.page);
  const [limit, setLimit] = React.useState(
    process.env.REACT_APP_PAGE_LIMIT || initialSearchParams.limit
  );
  const [sortOrder, setSortOrder] = React.useState(
    initialSearchParams.sortOrder
  );
  const [sortName, setSortName] = React.useState(initialSearchParams.sortName);
  const [showConfirmation, setConfirmation] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const TableHeaders = [
    { name: 'name', label: 'Name', width: '10%', sortable: true },
    { name: 'address', label: 'Address', width: '10%', sortable: true },
    {
      name: 'work_phone',
      label: 'Home Phone',
      width: '10%',
      sortable: true,
    },
    {
      name: 'mobile_phone',
      label: 'Mobile Phone',
      width: '10%',
      sortable: true,
    },
    {
      name: 'status',
      label: 'Status',
      width: '10%',
      sortable: true,
    },
  ];

  const OptionsConfig = [
    {
      label: 'View',
      path: (rowData) => `/crm/contacts/volunteers/${rowData?.id}/view`,
    },
    {
      label: 'Resolve',
      action: (rowData) => setConfirmation(rowData),
    },
  ];

  React.useEffect(() => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      keyword: context?.search,
      sortName,
      sortOrder,
      page,
      limit,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortName, sortOrder, page, limit, context?.search]);

  React.useEffect(() => {
    async function fetchDonor() {
      const { data: volunteerData } = await fetchData(
        `/contact-volunteer/${params?.volunteerId}`
      );
      return setVolunteer({
        id: volunteerData?.id,
        name: `${volunteerData?.first_name} ${volunteerData?.last_name}`,
        address: `${volunteerData?.address.address1}${
          volunteerData?.address.address2 &&
          ` ${volunteerData?.address.address2}`
        }, ${volunteerData?.address.city}, ${volunteerData?.address.zip_code}`,
        work_phone: volunteerData?.contact?.find(
          (contact) => contact?.contact_type === 1
        )?.data,
        mobile_phone: volunteerData?.contact?.find(
          (contact) => contact?.contact_type === 2
        )?.data,
        status: volunteerData?.is_active,
      });
    }
    fetchDonor();
  }, [params?.volunteerId]);

  React.useEffect(() => {
    const fetchDuplicates = async () => {
      setIsLoading(true);
      const {
        data: { records = [], count = 0 },
      } = await fetchData(
        `/contact-volunteer/${volunteer.id}/duplicates/list`,
        'GET',
        {
          ...Object.fromEntries(searchParams),
          is_resolved: false,
        }
      );

      if (count) records.unshift(volunteer);
      setTimeout(() => {
        setDuplicates(records);
        setTotalDuplicates(count ? count + 1 : 0);
      });
      setIsLoading(false);
    };

    if (volunteer && showConfirmation === null) fetchDuplicates();
  }, [volunteer, searchParams, showConfirmation]);

  const handleSort = (columnName) => {
    setTimeout(() => {
      setSortName(columnName);
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    });
  };

  const handleResolve = async (obj) => {
    const payload = {};
    if (params?.volunteerId !== obj.id) payload['record_id'] = obj.id;
    await fetchData(
      `/contact-volunteer/${params?.volunteerId}/duplicates/resolve`,
      'PATCH',
      payload
    );
    setConfirmation(null);
  };

  return (
    <>
      <div className="mainContentInner">
        <TableList
          isLoading={isLoading}
          data={duplicates}
          headers={TableHeaders}
          handleSort={handleSort}
          optionsConfig={OptionsConfig}
          current={params?.volunteerId}
          showActionsLabel={false}
        />
        <Pagination
          limit={limit}
          setLimit={(value) => setLimit(value)}
          currentPage={page}
          setCurrentPage={(value) => setPage(value)}
          totalRecords={totalDuplicates}
        />
      </div>
      <ConfirmModal
        showConfirmation={showConfirmation !== null}
        onCancel={() => setConfirmation(null)}
        onConfirm={() => handleResolve(showConfirmation)}
        icon={ResolveIcon}
        heading={'Resolve'}
        description={
          'Are you sure you want to resolve this possible duplicate? It will no longer appear on this listing.'
        }
      />
    </>
  );
}
