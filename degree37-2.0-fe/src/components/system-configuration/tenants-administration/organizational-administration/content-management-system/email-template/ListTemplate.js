import React, { useEffect, useMemo, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';
import Pagination from '../../../../../common/pagination';
import styles from './index.module.scss';
import SelectDropdown from '../../../../../common/selectDropdown';
import { ContentManagementSystemBreadCrumbsData } from '../ContentManagementSystemBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';
import { BASE_URL } from '../../../../../../helpers/constants';
import axios from 'axios';
import TemplateTypeEnum from '../entities/template-type.enum';

import SuccessPopUpModal from '../../../../../common/successModal';
import ArchivePopUpModal from '../../../../../common/successModal';
import { debounce } from 'lodash';

const ListTemplate = () => {
  const location = useLocation();
  const currentLocation = location.pathname;
  const [templates, setTemplates] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);

  const [type, setType] = useState(null);
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [deletedTemplate, setDeletedTemplate] = React.useState({});
  const [showArchiveSuccessModal, setShowArchiveSuccessModal] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);

  const getTemplates = async () => {
    const { data, status } = await axios.get(
      `${BASE_URL}/email-templates?limit=${limit}&page=${currentPage}&status=${
        isActive?.value ?? ''
      }&type=${type?.value ?? ''}&title=${searchText ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (status === 200) {
      setTemplates(data?.data);
      setTotalRecords(data?.count);
    } else {
      setTemplates([]);
      setTotalRecords(0);
    }
  };

  const handleArchive = async () => {
    try {
      await axios.patch(`${BASE_URL}/email-templates/${deletedTemplate?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getTemplates();
    } catch (error) {
      console.log(error);
    } finally {
      setModalPopUp(false);
      setShowArchiveSuccessModal(true);
    }
  };

  useEffect(() => {
    getTemplates();
  }, [currentPage, isActive, type]);

  useEffect(() => {
    debounceFetch(searchText);
  }, [searchText]);

  const debounceFetch = debounce((value) => {
    getTemplates();
  }, 500);

  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedTemplateTypes = useMemo(() => {
    const sorted = [...templates];

    if (sortBy && sortOrder) {
      sorted.sort((a, b) => {
        const aValue = a[sortBy]?.toString()?.toLowerCase();
        const bValue = b[sortBy]?.toString()?.toLowerCase();

        if (aValue < bValue) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sorted;
  }, [templates, sortBy, sortOrder]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleTemplateTypeChange = (event) => {
    const { value } = event.target;
    setType(value);
  };

  const BreadcrumbsData = [
    ...ContentManagementSystemBreadCrumbsData,
    {
      label: 'Email Templates',
      class: 'disable-label',
      link: '/system-configuration/platform-admin/email-template',
    },
  ];
  return (
    <>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Email Templates'}
          SearchPlaceholder={'Search'}
          SearchValue={searchText}
          SearchOnChange={searchFieldChange}
        />
        <div className="filterBar">
          <div className="tabs">
            <ul>
              {CheckPermission(null, [
                Permissions.ORGANIZATIONAL_ADMINISTRATION
                  .CONTENT_MANAGEMENT_SYSTEM.ADS.MODULE_CODE,
              ]) && (
                <li>
                  <Link
                    to={
                      '/system-configuration/tenant-admin/organizational-admin/content-management-system/ads/list'
                    }
                    className={
                      currentLocation ===
                      '/system-configuration/tenant-admin/organizational-admin/content-management-system/ads/list'
                        ? 'active'
                        : ''
                    }
                  >
                    Ads
                  </Link>
                </li>
              )}
              {CheckPermission(null, [
                Permissions.ORGANIZATIONAL_ADMINISTRATION
                  .CONTENT_MANAGEMENT_SYSTEM.EMAIL_TEMPLATES.MODULE_CODE,
              ]) && (
                <li>
                  <Link
                    to={'/system-configuration/platform-admin/email-template'}
                    className={
                      currentLocation ==
                      '/system-configuration/platform-admin/email-template'
                        ? `${styles.bg_blue}`
                        : ''
                    }
                  >
                    Email Templates
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div className="filterInner">
            <h2>Filters</h2>
            <div className="filter">
              <form className="d-flex">
                <SelectDropdown
                  styles={{ root: 'me-3' }}
                  placeholder={'Type'}
                  defaultValue={type}
                  selectedValue={type}
                  removeDivider
                  showLabel
                  onChange={(val) => {
                    let e = {
                      target: {
                        name: 'template_type',
                        value: val,
                      },
                    };
                    handleTemplateTypeChange(e);
                  }}
                  options={Object.values(TemplateTypeEnum).map((item) => {
                    return {
                      label: item,
                      value: item,
                    };
                  })}
                />
                <SelectDropdown
                  placeholder={'Status'}
                  defaultValue={isActive?.label ? isActive : null}
                  selectedValue={isActive?.label ? isActive : null}
                  removeDivider
                  showLabel
                  onChange={(value) => {
                    setIsActive(value);
                  }}
                  options={[
                    { label: 'Active', value: 'true' },
                    { label: 'Inactive', value: 'false' },
                  ]}
                />
              </form>
            </div>
          </div>
        </div>
        <div className="mainContentInner">
          {CheckPermission([
            Permissions.ORGANIZATIONAL_ADMINISTRATION.CONTENT_MANAGEMENT_SYSTEM
              .EMAIL_TEMPLATES.WRITE,
          ]) && (
            <div className="buttons">
              <button
                className="btn btn-primary"
                onClick={() => {
                  navigate(
                    '/system-configuration/platform-admin/email-template/create'
                  );
                }}
              >
                Create Template
              </button>
            </div>
          )}
          <div className="table-listing-main">
            <div className="table-responsive">
              <table className={`table table-striped ${styles.table_main} `}>
                <thead>
                  <tr>
                    <th width="25%" align="center">
                      <div className="inliner">
                        <span className="title">Name</span>
                        <div
                          className="sort-icon"
                          onClick={() => handleSort('name')}
                        >
                          <SvgComponent name={'SortIcon'} />
                        </div>
                      </div>
                    </th>
                    <th width="35%" align="center">
                      <div className="inliner">
                        <span className="title">Subject</span>
                        <div
                          className="sort-icon"
                          onClick={() => handleSort('subject')}
                        >
                          <SvgComponent name={'SortIcon'} />
                        </div>
                      </div>
                    </th>
                    <th width="15%" align="center">
                      <div className="inliner">
                        <span className="title">Type</span>
                        <div
                          className="sort-icon"
                          onClick={() => handleSort('type')}
                        >
                          <SvgComponent name={'SortIcon'} />
                        </div>
                      </div>
                    </th>
                    <th width="15%" align="center">
                      <div className="inliner">
                        <span className="title">Status</span>
                        <div
                          className="sort-icon"
                          onClick={() => handleSort('status')}
                        >
                          <SvgComponent name={'SortIcon'} />
                        </div>
                      </div>
                    </th>
                    <th className="d-flex justify-content-center">
                      <span className="title">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTemplateTypes?.length ? (
                    sortedTemplateTypes?.map((template) => {
                      return (
                        <tr key={template.id}>
                          <td>{template.name}</td>
                          <td
                            style={{
                              maxWidth: '100px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {template.subject}
                          </td>
                          <td>{template.type}</td>
                          <td>
                            {template.status ? (
                              <span className="badge active">Active</span>
                            ) : (
                              <span className="badge inactive">Inactive</span>
                            )}
                          </td>
                          <td className="options">
                            <div className="dropdown-center">
                              <div
                                className="optionsIcon"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <SvgComponent name={'ThreeDots'} />
                              </div>
                              <ul className="dropdown-menu">
                                {CheckPermission([
                                  Permissions.ORGANIZATIONAL_ADMINISTRATION
                                    .CONTENT_MANAGEMENT_SYSTEM.EMAIL_TEMPLATES
                                    .READ,
                                ]) && (
                                  <li>
                                    <Link
                                      className="dropdown-item"
                                      to={`/system-configuration/platform-admin/email-template/view/${template.id}`}
                                    >
                                      View
                                    </Link>
                                  </li>
                                )}
                                {CheckPermission([
                                  Permissions.ORGANIZATIONAL_ADMINISTRATION
                                    .CONTENT_MANAGEMENT_SYSTEM.EMAIL_TEMPLATES
                                    .WRITE,
                                ]) && (
                                  <li>
                                    <Link
                                      className="dropdown-item"
                                      to={`/system-configuration/platform-admin/email-template/edit/${template.id}`}
                                    >
                                      Edit
                                    </Link>
                                  </li>
                                )}
                                {CheckPermission([
                                  Permissions.ORGANIZATIONAL_ADMINISTRATION
                                    .CONTENT_MANAGEMENT_SYSTEM.EMAIL_TEMPLATES
                                    .ARCHIVE,
                                ]) && (
                                  <li
                                    onClick={() => {
                                      setDeletedTemplate(template);
                                      setModalPopUp(true);
                                    }}
                                  >
                                    <Link className="dropdown-item" to={``}>
                                      Archive
                                    </Link>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="no-data" colSpan="9">
                        {' '}
                        No Data Found{' '}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            limit={limit}
            setLimit={setLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalRecords={totalRecords}
          />
        </div>
      </div>

      <ArchivePopUpModal
        title={'Confirmation'}
        message={'Are you sure you want to Archive?'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={false}
        isArchived={modalPopUp}
        archived={handleArchive}
        isNavigate={false}
      />

      {showArchiveSuccessModal === true ? (
        <SuccessPopUpModal
          title="Success!"
          message={`Email Template is Archived.`}
          modalPopUp={showArchiveSuccessModal}
          isNavigate={false}
          setModalPopUp={setShowArchiveSuccessModal}
          showActionBtns={true}
        />
      ) : null}
    </>
  );
};

export default ListTemplate;
