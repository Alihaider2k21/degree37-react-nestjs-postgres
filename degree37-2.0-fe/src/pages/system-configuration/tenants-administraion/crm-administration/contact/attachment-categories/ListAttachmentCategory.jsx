import React from 'react';
import Layout from '../../../../../../components/common/layout';
import TopBar from '../../../../../../components/common/topbar/index';
import ContactNavigation from '../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/ContactNavigation';
import SelectDropdown from '../../../../../../components/common/selectDropdown';
import TableList from '../../../../../../components/common/tableListing';
import Pagination from '../../../../../../components/common/pagination/index';
import ConfirmModal from '../../../../../../components/common/confirmModal';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';
import { fetchData } from '../../../../../../helpers/Api';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../../components/common/successModal';
import { ContactBreadCrumbsData } from '../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/ContactBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const initialSearchParams = {
  page: 1,
  limit: 10,
  keyword: '',
  sortOrder: 'DESC',
  sortName: 'created_at',
};

export default function ListAttachmentCategory() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(initialSearchParams);
  const [page, setPage] = React.useState(initialSearchParams.page);
  const [limit, setLimit] = React.useState(
    process.env.REACT_APP_PAGE_LIMIT || initialSearchParams.limit
  );
  const [categories, setCategories] = React.useState([]);
  const [totalCategories, setTotalCategories] = React.useState(-1);
  const [isActive, setIsActive] = React.useState({
    label: 'Active',
    value: 'true',
  });
  const [sortOrder, setSortOrder] = React.useState(
    initialSearchParams.sortOrder
  );
  const [sortName, setSortName] = React.useState(initialSearchParams.sortName);
  const [showConfirmation, setConfirmation] = React.useState(null);
  const [archiveSuccess, setArchiveSuccess] = React.useState(false);

  const BreadcrumbsData = [
    ...ContactBreadCrumbsData,
    {
      label: 'Attachment Categories',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/crm-admin/contacts/attachment-categories',
    },
  ];

  const TableHeaders = [
    { name: 'name', label: 'Name', width: '20%', sortable: true },
    {
      name: 'description',
      label: 'Description',
      width: '20%',
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: '5%', sortable: true },
  ];

  const OptionsConfig = [
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.CONTACTS.ATTACHMENTS_CATEGORY.READ,
    ]) && {
      label: 'View',
      path: (rowData) => location.pathname + `/${rowData.id}/view`,
    },
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.CONTACTS.ATTACHMENTS_CATEGORY.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) => location.pathname + `/${rowData.id}/edit`,
    },
    CheckPermission([
      Permissions.CRM_ADMINISTRATION.CONTACTS.ATTACHMENTS_CATEGORY.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => setConfirmation(rowData.id),
    },
  ].filter(Boolean);

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
    fetchAttachmentCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isActive]);

  const fetchAttachmentCategories = () => {
    fetchData(`/contacts/attachment-category`, 'GET', {
      ...Object.fromEntries(searchParams),
      is_active: isActive?.value ?? '',
    })
      .then((res) => {
        setTimeout(() => {
          setCategories(res?.data?.data || []);
          setTotalCategories(res?.data?.count);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setSearchParams({
      ...Object.fromEntries(searchParams),
      name: value,
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
    fetchData(`/contacts/attachment-category/${attachmentId}`, 'PATCH')
      .then((res) => {
        if (res.status_code === 204) {
          setConfirmation(null);
          setTimeout(() => {
            setArchiveSuccess(true);
          }, 600);
          fetchAttachmentCategories();
        } else {
          toast.error(res.response, { autoClose: 3000 });
          setConfirmation(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setConfirmation(null);
      });
  };

  const handleIsActive = (value) => {
    setIsActive(value);
  };
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.CONTACTS.ATTACHMENTS_CATEGORY.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Attachment Categories'}
          SearchPlaceholder={'Search'}
          SearchValue={searchParams?.name}
          SearchOnChange={handleSearch}
        />
        <ContactNavigation>
          <div className="filter">
            <form className="d-flex">
              <SelectDropdown
                placeholder={'Status'}
                defaultValue={isActive}
                selectedValue={isActive}
                removeDivider
                showLabel
                onChange={handleIsActive}
                options={[
                  { label: 'Active', value: 'true' },
                  { label: 'Inactive', value: 'false' },
                ]}
              />
            </form>
          </div>
        </ContactNavigation>

        <div className="mainContentInner">
          {CheckPermission([
            Permissions.CRM_ADMINISTRATION.CONTACTS.ATTACHMENTS_CATEGORY.WRITE,
          ]) && (
            <div className="buttons">
              <button className="btn btn-primary" onClick={handleCreate}>
                Create Attachment Category
              </button>
            </div>
          )}
          <TableList
            isLoading={totalCategories === -1}
            data={categories}
            headers={TableHeaders}
            handleSort={handleSort}
            optionsConfig={OptionsConfig}
          />

          <Pagination
            limit={limit}
            setLimit={(value) => setLimit(value)}
            currentPage={page}
            setCurrentPage={(value) => setPage(value)}
            totalRecords={totalCategories}
          />
        </div>
        <SuccessPopUpModal
          title="Success!"
          message="Attachment Category is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
        />
        <ConfirmModal
          showConfirmation={showConfirmation !== null}
          onCancel={() => setConfirmation(null)}
          onConfirm={() => handleArchive(showConfirmation)}
          icon={ConfirmArchiveIcon}
          heading={'Confirmation'}
          description={'Are you sure you want to archive?'}
        />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
}
