import React from 'react';
import Layout from '../../../../../components/common/layout';
import TopBar from '../../../../../components/common/topbar/index';
import CertificationsNavigation from '../../../../../components/system-configuration/tenants-administration/staffing-administration/certifications/CertificationsNavigation';
import SelectDropdown from '../../../../../components/common/selectDropdown';
import GlobalMultiSelect from '../../../../../components/common/GlobalMultiSelect';
import TableList from '../../../../../components/common/tableListing';
import Pagination from '../../../../../components/common/pagination/index';
import ConfirmModal from '../../../../../components/common/confirmModal';
import ConfirmArchiveIcon from '../../../../../assets/images/ConfirmArchiveIcon.png';
import styles from './Certification.module.scss';
import { formatDate } from '../../../../../helpers/formatDate';
import { fetchData } from '../../../../../helpers/Api';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { CertificationBreadCrumbsData } from './CertificationBreadCrumbsData';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';

const initialFilters = {
  team_id: [],
  co_id: [],
  certification_id: [],
};

const initialSearchParams = {
  ...initialFilters,
  page: 1,
  limit: 10,
  keyword: '',
  sortOrder: 'DESC',
  sortName: 'staff_certification.created_at',
};

const Filters = ({ params, handleFilter }) => {
  const [filters, setFilters] = React.useState(initialFilters);
  const [teams, setTeams] = React.useState([]);
  const [certifications, setCertifications] = React.useState([]);
  const [collectionOperations, setCollectionOperations] = React.useState([]);
  const statusOptions = [
    { label: 'Active', value: 'true' },
    { label: 'Expire', value: 'false' },
  ];

  React.useEffect(() => {
    const fetcher = async () => {
      let responses = await Promise.all([
        fetchData('/staff-admin/teams', 'GET'),
        fetchData('/staffing-admin/certification/list', 'GET'),
        fetchData('/business_units/collection_operations/list', 'GET'),
      ]);
      return [
        responses[0]?.data?.teams || [],
        responses[1]?.data?.records || [],
        responses[2]?.data || [],
      ];
    };

    // const filter = async (objs, key) => {
    //   const obj = objs.find(
    //     (obj) => obj.id.toString() === params[key].toString()
    //   );
    //   return obj ? { label: obj.name, value: obj.id } : null;
    // };

    const multiFilter = async (objs, key) => {
      if (params[key]) {
        const filteredObjs = objs.filter((obj) =>
          params[key].toString().split(',').includes(obj.id.toString())
        );
        return filteredObjs.map((obj) => ({ id: obj.id, name: obj.name }));
      } else {
        return [];
      }
    };

    const setter = async (_teams, _certifications, _collectionOperations) => {
      const [team_id, certification_id, co_id] = await Promise.all([
        multiFilter(_teams, 'team_id'),
        multiFilter(_certifications, 'certification_id'),
        multiFilter(_collectionOperations, 'co_id'),
      ]);
      const status = statusOptions.find(
        (status) => status.value === params?.status
      );
      setTimeout(() => {
        setTeams(_teams);
        setCertifications(_certifications);
        setCollectionOperations(_collectionOperations);
        setFilters({
          ...filters,
          team_id,
          certification_id,
          co_id,
          status: status === undefined ? null : status,
        });
      });
    };

    fetcher()
      .then(async (responses) => {
        await setter(...responses);
      })
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.team_id, params.certification_id, params.co_id, params.status]);

  const onDropdownChange = (option, e) => {
    const { value = '' } = option || {};
    const { name } = e;
    handleFilter(name, value);
  };

  const onMultiDropdownChange = (data, name) => {
    let newIds = [];
    const ids = filters[name].map((obj) => obj.id);
    if (Array.isArray(data)) {
      newIds = data.map((option) => option.id);
    } else {
      if (ids.some((obj) => obj === data.id)) {
        newIds = ids.filter((obj) => obj !== data.id);
      } else {
        newIds = [...ids, data.id];
      }
    }
    handleFilter(name, newIds.join(','));
  };

  return (
    <form className="formGroup">
      <div className="d-flex gap-4">
        <div>
          <GlobalMultiSelect
            label="Certification Name"
            data={certifications.map((certif) => ({
              id: certif.id,
              name: certif.name,
            }))}
            selectedOptions={filters.certification_id}
            onChange={(data) => onMultiDropdownChange(data, 'certification_id')}
            onSelectAll={(data) =>
              onMultiDropdownChange(data, 'certification_id')
            }
          />
          {/* <SelectDropdown
            name="certification_id"
            placeholder={'Certification Name'}
            selectedValue={filters.certification_id}
            onChange={onDropdownChange}
            options={certifications.map((certif) => ({
              label: certif.name,
              value: certif.id,
            }))}
            removeDivider
            showLabel
          /> */}
        </div>
        <div>
          <GlobalMultiSelect
            label="Team"
            data={teams.map((team) => ({
              id: team.id,
              name: team.name,
            }))}
            selectedOptions={filters.team_id}
            onChange={(data) => onMultiDropdownChange(data, 'team_id')}
            onSelectAll={(data) => onMultiDropdownChange(data, 'team_id')}
          />
        </div>
        <div>
          <GlobalMultiSelect
            label="Collection Operation"
            data={collectionOperations.map((co) => ({
              id: co.id,
              name: co.name,
            }))}
            selectedOptions={filters.co_id}
            onChange={(data) => onMultiDropdownChange(data, 'co_id')}
            onSelectAll={(data) => onMultiDropdownChange(data, 'co_id')}
          />
        </div>
        <div className={styles.filter}>
          <SelectDropdown
            name="status"
            placeholder={'Certification Status'}
            selectedValue={filters.status}
            onChange={onDropdownChange}
            options={statusOptions}
            removeDivider
            showLabel
          />
        </div>
      </div>
    </form>
  );
};

export default function AssignedCertification() {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams(initialSearchParams);
  const [certifications, setCertifications] = React.useState([]);
  const [totalCertifications, setTotalCertifications] = React.useState(-1);
  const [page, setPage] = React.useState(initialSearchParams.page);
  const [limit, setLimit] = React.useState(
    process.env.REACT_APP_PAGE_LIMIT || initialSearchParams.limit
  );
  const [sortOrder, setSortOrder] = React.useState(
    initialSearchParams.sortOrder
  );
  const [sortName, setSortName] = React.useState(initialSearchParams.sortName);
  const [confirmation, setConfirmation] = React.useState(null);

  const BreadcrumbsData = [
    ...CertificationBreadCrumbsData,
    {
      label: 'Assigned Certifications',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/staffing-admin/certifications/assigned-certification',
    },
  ];

  const TableHeaders = [
    { name: 'staff_name', label: 'Name', width: '10%', sortable: true },
    { name: 'roles', label: 'Roles', width: '10%', sortable: true },
    { name: 'teams', label: 'Teams', width: '10%', sortable: true },
    {
      name: 'collection_operation_name',
      label: 'Collection Operation',
      width: '10%',
      sortable: true,
    },
    {
      name: 'certificate_name',
      label: 'Certification Name',
      width: '10%',
      sortable: true,
    },
    {
      name: 'certificate_start_date',
      label: 'Date of Certification',
      splitlabel: true,
      width: '10%',
      sortable: true,
    },
    {
      name: 'expiration_date',
      label: 'Expiration Date',
      width: '10%',
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: '5%', sortable: true },
  ];

  const OptionsConfig = [
    {
      label: 'Remove Certification',
      action: (rowData) => setConfirmation(rowData),
    },
  ];

  React.useEffect(() => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      sortName,
      sortOrder,
      page,
      limit,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortName, sortOrder, page, limit]);

  React.useEffect(() => {
    const fetchCertifications = () => {
      fetchData(
        `/staffing-admin/certification/staff-certification/list`,
        'GET',
        Object.fromEntries(searchParams)
      )
        .then((res) => {
          let { records = [], count = 0 } = res?.data || {};
          setTimeout(() => {
            setCertifications(
              records?.map((record) => {
                record['certificate_start_date'] = formatDate(
                  record['certificate_start_date']
                ).split('|')[0];
                record['expiration_date'] = formatDate(
                  record['expiration_date']
                ).split('|')[0];
                return record;
              }) || []
            );
            setTotalCertifications(count);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    };

    fetchCertifications();
  }, [searchParams, confirmation]);

  const handleSearch = (e) => {
    e.preventDefault();
    const { value } = e.target;
    const searchObj = { ...Object.fromEntries(searchParams), keyword: value };

    setTimeout(() => {
      if (searchParams.get('keyword') !== value) setPage(1);
      setSearchParams(searchObj);
    });
  };

  const handleFilter = (name, value) => {
    const searchObj = { ...Object.fromEntries(searchParams), [name]: value };
    setTimeout(() => {
      if (searchParams.get(name) !== value) setPage(1);
      if (searchObj['status'] === '') delete searchObj['status'];
      setSearchParams(searchObj);
    });
  };

  const handleSort = (columnName) => {
    setTimeout(() => {
      setSortName(columnName);
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    });
  };

  const handleAssign = (e) => {
    e.preventDefault();
    navigate(location.pathname + '/assign');
  };

  const handleRemove = (obj) => {
    fetchData(
      `/staffing-admin/certification/staff-certification/${obj.staff_certification_id}/delete`,
      'DELETE'
    )
      .then((_) => setConfirmation(null))
      .catch((err) => {
        console.error(err);
        setConfirmation(null);
      });
  };

  return (
    <Layout className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Assigned Certifications'}
        SearchPlaceholder={'Search'}
        SearchValue={searchParams.get('keyword')}
        SearchOnChange={handleSearch}
      />
      <CertificationsNavigation>
        <Filters
          params={Object.fromEntries(searchParams)}
          handleFilter={handleFilter}
        />
      </CertificationsNavigation>

      <div className="mainContentInner">
        {CheckPermission([
          Permissions.STAFF_ADMINISTRATION.CERTIFICATIONS.ASSIGNED_CERTIFICATION
            .WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAssign}>
              Assign Certifications
            </button>
          </div>
        )}

        <TableList
          isLoading={totalCertifications === -1}
          data={certifications}
          headers={TableHeaders}
          handleSort={handleSort}
          optionsConfig={OptionsConfig}
        />

        <Pagination
          limit={limit}
          setLimit={(value) => setLimit(value)}
          currentPage={page}
          setCurrentPage={(value) => setPage(value)}
          totalRecords={totalCertifications}
        />
      </div>

      <ConfirmModal
        showConfirmation={confirmation !== null}
        onCancel={() => setConfirmation(null)}
        onConfirm={() => handleRemove(confirmation)}
        icon={ConfirmArchiveIcon}
        heading={'Confirmation'}
        description={`Are you sure you want to Remove Certification from ${confirmation?.certificate_name}?`}
      />
    </Layout>
  );
}
