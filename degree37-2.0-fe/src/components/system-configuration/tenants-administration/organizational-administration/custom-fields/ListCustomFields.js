import React, { useEffect, useState } from 'react';
import TopBar from '../../../../common/topbar/index';
import SelectDropdown from '../../../../common/selectDropdown/index';
import TableList from '../../../../common/tableListing/index';
import Pagination from '../../../../common/pagination';
import SuccessPopUpModal from '../../../../common/successModal';
import { useNavigate } from 'react-router-dom';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import { CustomFieldsBreadCrumbsData } from './CustomFieldsBreadCrumbsData';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../enums/PermissionsEnum.js';

export default function ListCustomFields() {
  const [searchText, setSearchText] = useState('');
  const [appliesTo, setAppliesTo] = useState(null);
  const [status, setStatsus] = useState({ label: 'Active', value: 'true' });
  const [custonFieldList, setCustomFieldList] = useState();
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [archiveid, setArchiveId] = useState(null);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const appliesToOption = [
    {
      label: 'Accounts',
      value: '1',
    },
    {
      label: 'Locations',
      value: '5',
    },
    {
      label: 'Donor Centers',
      value: '2',
    },
    {
      label: 'Donors',
      value: '3',
    },
    {
      label: 'Staff',
      value: '8',
    },
    {
      label: 'Volunteers',
      value: '9',
    },
    {
      label: 'Drives',
      value: '4',
    },
    {
      label: 'Sessions',
      value: '7',
    },
    {
      label: 'NCEs',
      value: '6',
    },
  ];

  const fieldDataTypeOption = [
    {
      label: 'Text',
      value: '5',
    },
    {
      label: 'Number',
      value: '3',
    },
    {
      label: 'Decimal',
      value: '2',
    },
    {
      label: 'Date',
      value: '1',
    },
    {
      label: 'Yes or No',
      value: '8',
    },
    {
      label: 'True or false',
      value: '7',
    },
    {
      label: 'Text Array',
      value: '6',
    },
    {
      label: 'Pick List',
      value: '4',
    },
  ];

  const tableHeaders = [
    { name: 'field_name', label: 'Field Name', width: '15%', sortable: true },
    {
      name: 'field_data_type',
      label: 'Field Data Type',
      width: '15%',
      sortable: true,
    },
    {
      name: 'applies_to',
      label: 'Applies To',
      width: '15%',
      sortable: true,
    },
    {
      name: 'is_required',
      label: 'Required',
      width: '15%',
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: '15%', sortable: true },
  ];

  const optionsConfig = [
    CheckPermission([
      Permissions.ORGANIZATIONAL_ADMINISTRATION.CUSTOM_FIELDS.READ,
    ]) && {
      label: 'View',
      path: (rowData) =>
        `/system-configuration/tenant-admin/organizational-admin/custom-fields/${rowData.id}/view`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.ORGANIZATIONAL_ADMINISTRATION.CUSTOM_FIELDS.WRITE,
    ]) && {
      label: 'Edit',
      path: (rowData) =>
        `/system-configuration/tenant-admin/organizational-admin/custom-fields/${rowData.id}/edit`,
      action: (rowData) => {},
    },
    CheckPermission([
      Permissions.ORGANIZATIONAL_ADMINISTRATION.CUSTOM_FIELDS.ARCHIVE,
    ]) && {
      label: 'Archive',
      action: (rowData) => handleArchive(rowData),
    },
  ].filter(Boolean);

  const handleSort = (name) => {
    if (sortBy === name) {
      setSortOrder((prevSortOrder) =>
        prevSortOrder === 'ASC' ? 'DESC' : 'ASC'
      );
    } else {
      setSortBy(name);
      setSortOrder('ASC');
    }
  };

  useEffect(() => {
    getData();
  }, [sortBy, sortOrder, limit, currentPage, searchText, status, appliesTo]);

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/system-configuration/organization-administration/custom-fields?page=${currentPage}&limit=${limit}${
          sortBy ? `&sortBy=${sortBy}` : ''
        }${sortOrder ? `&sortOrder=${sortOrder}` : ''}${
          status ? `&status=${status?.value === 'true' ? true : false}` : ''
        }${appliesTo ? `&applies_to=${appliesTo?.value}` : ''}${
          searchText ? `&keyword=${searchText}` : ''
        }`
      );

      const res = await response.json();
      if (res) {
        const modifiedData = res?.data?.map((item) => ({
          ...item,
          field_data_type: fieldDataTypeOption?.find(
            (option) => option?.value === item?.field_data_type
          )?.label,
          applies_to: [
            `${
              appliesToOption?.find(
                (option) => option?.value === item?.applies_to
              )?.label || ''
            }`,
          ],
          is_required: item?.is_required ? 'Yes' : 'No',
        }));
        setCustomFieldList(modifiedData);
        setTotalRecords(res?.count);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };
  const handleArchive = (rowData) => {
    setShowModel(true);
    setArchiveId(rowData.id);
  };
  const archieveHandle = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'PATCH',
        `${BASE_URL}/system-configuration/organization-administration/custom-fields/archive/${archiveid}`
      );
      const data = await response?.json();
      if (data?.status === 'success') {
        setShowModel(false);
        setArchiveSuccess(true);
        getData();
      }
    } catch (err) {
      console.log({ err });
    }
  };

  const searchFieldChange = (e) => {
    setCurrentPage(1);
    setSearchText(e.target.value);
  };

  const BreadcrumbsData = [
    ...CustomFieldsBreadCrumbsData,
    {
      label: 'Custom Fields',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organizational-admin/custom-fields/list`,
    },
  ];
  return (
    <>
      <SuccessPopUpModal
        title={'Confirmation'}
        message={'Are you sure want to archive?'}
        modalPopUp={showModel}
        setModalPopUp={setShowModel}
        isArchived={true}
        archived={archieveHandle}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Custom field archived."
        modalPopUp={archiveSuccess}
        isNavigate={true}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
      />
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Custom Fields'}
          SearchPlaceholder={'Search'}
          SearchValue={searchText}
          SearchOnChange={searchFieldChange}
        />
        <div className="filterBar">
          <div className="filterInner">
            <h2>Filters</h2>
            <div className="filter">
              <form className="d-flex align-items-center gap-4">
                <div className="" style={{ width: '255px' }}>
                  <SelectDropdown
                    placeholder={'Applies To'}
                    name="applies_to_search"
                    showLabel={true}
                    required
                    removeDivider
                    selectedValue={appliesTo}
                    onChange={(selectedOption) => {
                      setCurrentPage(1);
                      // Update the selected value in the state
                      setAppliesTo(selectedOption);
                    }}
                    options={appliesToOption}
                  />
                </div>
                <div style={{ width: '255px' }}>
                  <SelectDropdown
                    placeholder={'Status'}
                    name="status"
                    showLabel={true}
                    required
                    removeDivider
                    selectedValue={status}
                    onChange={(selectedOption) => {
                      setCurrentPage(1);
                      // Update the selected value in the state
                      setStatsus(selectedOption);
                    }}
                    options={[
                      {
                        label: 'Active',
                        value: 'true',
                      },
                      {
                        label: 'Inactive',
                        value: 'false',
                      },
                    ]}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="mainContentInner">
          <div className="buttons">
            {CheckPermission([
              Permissions.ORGANIZATIONAL_ADMINISTRATION.CUSTOM_FIELDS.WRITE,
            ]) && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  navigate(
                    '/system-configuration/tenant-admin/organizational-admin/custom-fields/create'
                  );
                }}
              >
                Create Custom Field
              </button>
            )}
          </div>
          <TableList
            isLoading={isLoading}
            data={custonFieldList}
            headers={tableHeaders}
            handleSort={handleSort}
            // sortName={sortName}
            // sortOrder={sortOrder}
            optionsConfig={optionsConfig}
          />

          <Pagination
            limit={limit}
            setLimit={setLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalRecords={totalRecords}
          />
        </div>
      </div>
    </>
  );
}
