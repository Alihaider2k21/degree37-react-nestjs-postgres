import React from 'react';
import Layout from '../../../../../components/common/layout';
import TopBar from '../../../../../components/common/topbar/index';
import CertificationsNavigation from '../../../../../components/system-configuration/tenants-administration/staffing-administration/certifications/CertificationsNavigation';
import SelectDropdown from '../../../../../components/common/selectDropdown';
import TableList from '../../../../../components/common/tableListing';
import Pagination from '../../../../../components/common/pagination/index';
import ConfirmModal from '../../../../../components/common/confirmModal';
import ConfirmArchiveIcon from '../../../../../assets/images/ConfirmArchiveIcon.png';
import styles from './Certification.module.scss';
import { fetchData } from '../../../../../helpers/Api';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import SuccessPopUpModal from '../../../../../components/common/successModal';
import { CertificationBreadCrumbsData } from './CertificationBreadCrumbsData';
import NotFoundPage from '../../../../not-found/NotFoundPage';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';

const initialSearchParams = {
  page: 1,
  limit: 10,
  keyword: '',
  sortOrder: 'DESC',
  sortName: 'created_at',
  is_active: true,
};

export default function ListCertification() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(initialSearchParams);
  const [certifications, setCertifications] = React.useState([]);
  const [totalCertifications, setTotalCertifications] = React.useState(-1);
  const [page, setPage] = React.useState(initialSearchParams.page);
  const [limit, setLimit] = React.useState(
    process.env.REACT_APP_PAGE_LIMIT || initialSearchParams.limit
  );
  const [active, setActive] = React.useState(null);
  const [associationType, setAssociationType] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState(
    initialSearchParams.sortOrder
  );
  const [archiveSuccess, setArchiveSuccess] = React.useState(false);
  const [sortName, setSortName] = React.useState(initialSearchParams.sortName);
  const [showConfirmation, setConfirmation] = React.useState(null);

  const statusOptions = [
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
  ];

  const associationTypeOptions = [
    { label: 'VEHICLE', value: 'VEHICLE' },
    { label: 'STAFF', value: 'STAFF' },
  ];

  const BreadcrumbsData = [
    ...CertificationBreadCrumbsData,
    {
      label: 'Certifications',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/staffing-admin/certifications',
    },
  ];

  const TableHeaders = [
    { name: 'name', label: 'Name', width: '10%', sortable: true },
    { name: 'short_name', label: 'Short Name', width: '10%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '20%',
      sortable: true,
    },
    {
      name: 'association_type',
      label: 'Association Type',
      width: '10%',
      sortable: true,
    },
    { name: 'assignments', label: 'Assignment', width: '10%', sortable: true },
    { name: 'expires', label: 'Expires', width: '10%', sortable: true },
    {
      name: 'expiration_interval',
      label: 'Expiration Interval',
      width: '10%',
      splitlabel: true,
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: '5%', sortable: true },
  ];

  const OptionsConfig = [
    {
      label: 'View',
      path: (rowData) => location.pathname + `/${rowData.id}/view`,
    },
    {
      label: 'Edit',
      path: (rowData) => location.pathname + `/${rowData.id}/edit`,
    },
    {
      label: 'Archive',
      action: (rowData) => setConfirmation(rowData.id),
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

  const fetchCertifications = () => {
    const params = Object.fromEntries(searchParams);
    fetchData(`/staffing-admin/certification/list`, 'GET', params)
      .then((res) => {
        setTimeout(() => {
          setCertifications(res?.data?.records || []);
          setTotalCertifications(res?.data?.count);
          setAssociationType(
            associationTypeOptions.find(
              (associationType) =>
                associationType.value === params?.associationType
            ) || null
          );
          setActive(
            statusOptions.find(
              (status) => status.value === params?.is_active
            ) || null
          );
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  React.useEffect(() => {
    fetchCertifications();
  }, [showConfirmation]);

  React.useEffect(() => {
    const params = Object.fromEntries(searchParams);
    if (params?.keyword?.length > 1 || params?.keyword?.length === 0)
      fetchCertifications();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const { value } = e.target;
    const searchObj = { ...Object.fromEntries(searchParams), keyword: value };

    if (searchParams.get('keyword') !== value)
      setTimeout(() => {
        setPage(1);
        setSearchParams(searchObj);
      });
    else setSearchParams(searchObj);
  };

  const handleFilter = (option, e) => {
    const { value = '' } = option || {};
    const { name } = e;

    setTimeout(() => {
      switch (name) {
        case 'is_active':
          setActive(option);
          break;
        default:
          setAssociationType(option);
          break;
      }
      const searchObj = { ...Object.fromEntries(searchParams), [name]: value };
      if (option === null) delete searchObj[name];
      setPage(1);
      setSearchParams(searchObj);
    });
  };

  const handleSort = (columnName) => {
    setTimeout(() => {
      setSortName(columnName);
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    navigate(location.pathname + '/create');
  };

  const handleArchive = (attachmentId) => {
    fetchData(`/staffing-admin/certification/${attachmentId}/archive`, 'PATCH')
      .then((_) => {
        setConfirmation(null);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
      })
      .catch((err) => {
        console.error(err);
        setConfirmation(null);
      });
  };

  return CheckPermission(null, [
    Permissions.STAFF_ADMINISTRATION.CERTIFICATIONS.CERTIFICATIONS.MODULE_CODE,
  ]) ? (
    <Layout className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Certifications'}
        SearchPlaceholder={'Search'}
        SearchValue={searchParams.get('keyword')}
        SearchOnChange={handleSearch}
      />
      <CertificationsNavigation>
        <form className="formGroup">
          <div className="d-flex gap-4">
            <div className={styles.filter}>
              <SelectDropdown
                name="associationType"
                placeholder={'Association Type'}
                selectedValue={associationType}
                onChange={handleFilter}
                options={associationTypeOptions}
                removeDivider
                showLabel
              />
            </div>
            <div className={styles.filter}>
              <SelectDropdown
                name="is_active"
                placeholder={'Status'}
                selectedValue={active}
                onChange={handleFilter}
                options={statusOptions}
                removeDivider
                showLabel
              />
            </div>
          </div>
        </form>
      </CertificationsNavigation>

      <div className="mainContentInner">
        {CheckPermission([
          Permissions.STAFF_ADMINISTRATION.CERTIFICATIONS.CERTIFICATIONS.WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleCreate}>
              Create Certification
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
        showConfirmation={showConfirmation !== null}
        onCancel={() => setConfirmation(null)}
        onConfirm={() => handleArchive(showConfirmation)}
        icon={ConfirmArchiveIcon}
        heading={'Confirmation'}
        description={'Are you sure you want to archive?'}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Certification is archived."
        modalPopUp={archiveSuccess}
        isNavigate={true}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
      />
    </Layout>
  ) : (
    <NotFoundPage />
  );
}
