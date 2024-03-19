import React, { useEffect } from 'react';
import TableList from '../../../../../components/common/tableListing';
import Pagination from '../../../../../components/common/pagination/index';
import ConfirmModal from '../../../../../components/common/confirmModal';
import ResolveIcon from '../../../../../assets/Resolve.svg';
import { useSearchParams, useParams, useOutletContext } from 'react-router-dom';
import { fetchData } from '../../../../../helpers/Api';
import { StaffBreadCrumbsData } from '../../../../../components/crm/contacts/staff/StaffBreadCrumbsData';

const initialSearchParams = {
  page: 1,
  limit: 100,
  keyword: '',
  sortOrder: 'DESC',
  sortName: '',
};

export default function ListDuplicates() {
  const params = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...StaffBreadCrumbsData,
      {
        label: 'View Staff',
        class: 'disable-label',
        link: `/crm/contacts/staff/${params?.staffId}/view`,
      },
      {
        label: 'Duplicates',
        class: 'disable-label',
        link: `/crm/contacts/staff/${params?.staffId}/view/duplicates`,
      },
    ]);
  }, []);
  const [searchParams, setSearchParams] = useSearchParams(initialSearchParams);
  const [staff, setStaff] = React.useState(null);
  const [duplicates, setDuplicates] = React.useState([]);
  const [totalDuplicates, setTotalDuplicates] = React.useState(-1);
  const [page, setPage] = React.useState(initialSearchParams.page);
  const [limit, setLimit] = React.useState(
    process.env.REACT_APP_PAGE_LIMIT || initialSearchParams.limit
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState(
    initialSearchParams.sortOrder
  );
  const [sortName, setSortName] = React.useState(initialSearchParams.sortName);
  const [showConfirmation, setConfirmation] = React.useState(null);

  const TableHeaders = [
    { name: 'id', label: 'Staff ID', width: '10%', sortable: true },
    { name: 'name', label: 'Name', width: '10%', sortable: true },
    { name: 'address', label: 'Address', width: '10%', sortable: true },
    { name: 'roles', label: 'Roles', width: '10%', sortable: true },
    {
      name: 'organization_level',
      label: 'Organization Level',
      width: '10%',
      sortable: true,
    },
    { name: 'status', label: 'Status', width: '10%', sortable: true },
  ];

  const OptionsConfig = [
    {
      label: 'View',
      path: (rowData) => `/crm/contacts/staff/${rowData?.id}/view`,
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
    async function fetchStaff() {
      const [st, staffRoles] = await Promise.all([
        fetchData(`/contact-staff/${params?.staffId}`),
        fetchData(`/contact-staff/${params?.staffId}/roles`),
      ]);

      return setStaff({ ...st?.data, roles: staffRoles?.data || [] });
    }

    fetchStaff();
  }, [params?.staffId]);

  React.useEffect(() => {
    const fetchDuplicates = async () => {
      try {
        setIsLoading(true);
        const {
          data: { records = [], count = 0 },
        } = await fetchData(
          `/contact-staff/${staff.id}/duplicates/list`,
          'GET',
          {
            ...Object.fromEntries(searchParams),
            is_resolved: false,
          }
        );
        if (count)
          records.unshift({
            id: staff?.id,
            name: `${staff?.first_name} ${staff?.last_name}`,
            address: `${staff?.address.address1}${
              staff?.address.address2 && ` ${staff?.address.address2}`
            }`,
            roles: staff?.roles.map((role) => role.role_id.name).join(', '),
            organization_level: staff?.collection_operation_id?.name,
            status: staff?.is_active,
          });
        setTimeout(() => {
          setDuplicates(records);
          setTotalDuplicates(count ? count + 1 : 0);
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (staff && showConfirmation === null) fetchDuplicates();
  }, [staff, searchParams, showConfirmation]);

  const handleSort = (columnName) => {
    setTimeout(() => {
      setSortName(columnName);
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    });
  };

  const handleResolve = async (obj) => {
    const payload = {};
    if (params?.staffId !== obj.id) payload['record_id'] = obj.id;
    await fetchData(
      `/contact-staff/${params?.staffId}/duplicates/resolve`,
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
          current={params?.staffId}
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
