import React, { useState, useEffect } from 'react';
import TopBar from '../../common/topbar/index';
import SelectDropdown from '../../common/selectDropdown';
import { useNavigate } from 'react-router-dom';
import TableList from '../../common/tableListing';
import Pagination from '../../common/pagination';
import SuccessPopUpModal from '../../common/successModal';
import { OPERATIONS_CENTER, OS_PROSPECTS_PATH } from '../../../routes/path';
import DatePicker from '../../common/DatePicker';

const ProspectsList = () => {
  const [searchText, setSearchText] = useState('');
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [prospectsData, setProspectsData] = useState([]);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [modalPopUp, setModalPopUp] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showModalText, setShowModalText] = useState(null);

  const handleArchive = async () => {
    setModalPopUp(false);
    setShowModalText('Prospect is archived.');
    setShowSuccessMessage(true);
    setIsActionLoading(false);
    getWithStatus();
    // if (actionId) {
    //   setIsActionLoading(true);
    //   try {
    //     const result = await fetchData(
    //       `/operations-center/manage-favorites/archive/${actionId}`,
    //       'PUT'
    //     );
    //     const { status, response } = result;
    //     if (status === 'success') {
    //       setModalPopUp(false);
    //       setShowModalText('Favorite is archived.');
    //       setShowSuccessMessage(true);
    //       setIsActionLoading(false);
    //       getWithStatus();
    //       return;
    //     } else {
    //       toast.error(response, { autoClose: 3000 });
    //       setIsActionLoading(false);
    //     }
    //   } catch (error) {
    //     setIsActionLoading(false);
    //     console.log(error);
    //     toast.error('Error archiving favorite.');
    //   }
    // }
  };

  const getWithStatus = async () => {
    setIsLoading(true);
    setProspectsData([
      {
        name: 'test',
        description: 'test',
        contacts: 'test',
        delivered: 'test',
        read: 'test',
        click_throughts: 'test',
        conversions: 'test',
        create_date: 'test',
        send_date: 'test',
        status: 'test',
      },
    ]);
    setTotalRecords(1);
    setCurrentPage(1);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    // let search = searchText?.length > 1 ? searchText : '';
    // const result = await fetchData(
    //   `/operations-center/manage-favorites?limit=${limit}&page=${currentPage}&status=${
    //     isActive?.value ?? ''
    //   }&sortName=${sortBy}&sortOrder=${sortOrder}&name=${search}`
    // );
    // const { data, status, count } = result;
    // if (status === 200) {
    //   setProspectsData(data);
    //   setTotalRecords(count);
    //   if (!(data?.length > 0) && currentPage > 1) {
    //     setCurrentPage(currentPage - 1);
    //   }
    //   setIsLoading(false);
    // } else {
    //   toast.error('Error Manage Favorite ', { autoClose: 3000 });
    //   setIsLoading(false);
    // }
  };
  useEffect(() => {
    getWithStatus();
  }, [isActive, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, sortOrder]);

  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'disable-label',
      link: OPERATIONS_CENTER.DASHBOARD,
    },
    {
      label: 'Prospect',
      class: 'disable-label',
      link: OS_PROSPECTS_PATH.LIST,
    },
  ];
  const tableHeaders = [
    {
      name: 'name',
      label: 'Prospect Name',
      minWidth: '15rem',
      width: '15rem',
      sortable: true,
    },
    { name: 'description', label: 'Description', sortable: true },
    {
      name: 'contacts',
      label: 'Contacts',
      sortable: true,
    },
    { name: 'delivered', label: 'Delivered', sortable: true },
    { name: 'read', label: 'Read', sortable: true },
    { name: 'click_throughts', label: 'Click Throughts', sortable: true },
    { name: 'conversions', label: 'Conversions', sortable: true },
    { name: 'create_date', label: 'Create Date', sortable: true },
    { name: 'send_date', label: 'Send Date', sortable: true },
    { name: 'status', label: 'Status', width: '25%', sortable: true },
  ];
  const optionsConfig = [
    {
      label: 'View',
      // path: (rowData) => {},
      path: () => '1/about',
    },
    {
      label: 'Edit',
      path: (rowData) => {},
    },
    {
      label: 'Duplicate',
      path: (rowData) => {},
      action: (rowData) => {},
    },
    {
      label: 'Cancel',
      path: (rowData) => {},
      action: (rowData) => {},
    },
    {
      label: 'Archive',
      action: (rowData) => {
        // setActionID(rowData?.id);
        // setModalPopUpType('archive');
        // setShowModalText('Are you sure you want to archive?');
        // setModalPopUp(true);
      },
    },
  ];
  useEffect(() => {
    if (searchText?.length > 1) {
      setSearched(true);
      setCurrentPage(1);
      getWithStatus();
    }
    if (searchText.length === 1 && searched) {
      setCurrentPage(1);
      getWithStatus();
      setSearched(false);
    }
  }, [searchText]);

  const handleAddClick = () => {
    navigate(OS_PROSPECTS_PATH.CREATE);
  };
  const handleIsActive = (value) => {
    setIsActive(value);
  };
  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };
  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'ASC') {
        setSortOrder('DESC');
      } else {
        setSortOrder('ASC');
      }
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
  };

  return (
    <>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Prospect'}
          SearchPlaceholder={'Search'}
          SearchValue={searchText}
          SearchOnChange={searchFieldChange}
        />
        <div className="filterBar">
          <div className="filterInner">
            <h2>Filters</h2>
            <div className="filter">
              <form className="d-flex justify-content-end flex-wrap">
                <div className="dropdown mt-2 mb-2">
                  <DatePicker
                    placeholderText={'Date Range'}
                    showLabel
                    removeDivider
                    onChange={() => {}}
                  />
                </div>
                <div className="dropdown mt-2 mb-2">
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
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="mainContentInner">
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Create New Prospect
            </button>
          </div>
          <TableList
            isLoading={isLoading}
            data={prospectsData}
            headers={tableHeaders}
            handleSort={handleSort}
            sortOrder={sortOrder}
            optionsConfig={optionsConfig}
            showVerticalLabel={true}
          />

          <SuccessPopUpModal
            title="Confirmation"
            message={showModalText}
            modalPopUp={modalPopUp}
            setModalPopUp={setModalPopUp}
            showActionBtns={false}
            loading={isActionLoading}
            isArchived={true}
            archived={() => handleArchive()}
          />
          <SuccessPopUpModal
            title="Success"
            message={showModalText}
            modalPopUp={showSuccessMessage}
            showActionBtns={true}
            isArchived={false}
            setModalPopUp={setShowSuccessMessage}
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
};

export default ProspectsList;
