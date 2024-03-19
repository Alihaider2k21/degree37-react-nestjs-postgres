import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import styles from './index.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProspectsBreadCrumbsData } from './ProspectsBreadCrumbsData';
import SuccessPopUpModal from '../../common/successModal';
import Pagination from '../../common/pagination';
import TableList from '../../common/tableListing';
import SelectDropdown from '../../common/selectDropdown';
import TopBar from '../../common/topbar/index';
import { OS_PROSPECTS_PATH } from '../../../routes/path';
import DatePicker from 'react-datepicker';

const initialDate = {
  startDate: null,
  endDate: null,
};

const ProspectsBuildSegments = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [driveBluePrint, setDriveBlueprint] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [staffName, setStaffName] = useState('');
  const [collectionOperation, setCollectionOperation] = useState(null);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [team] = useState({ value: true });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const bearerToken = localStorage.getItem('token');
  const [selectedRows, setSelectedRows] = useState([]);
  const [role, setRole] = useState(null);
  const [rolesData, setRolesData] = useState([]);
  //   const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState(initialDate);
  const location = useLocation();

  const navigate = useNavigate();

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    const value = { startDate: start, endDate: end };
    setDateRange(value);
  };
  const getStaffData = async () => {
    // if (!team?.value) return;
    setIsLoading(true);
    const result = await fetch(
      `${BASE_URL}/operations-center/prospects/build-segments?limit=${limit}&page=${currentPage}&name=${staffName}${
        role?.value ? `&role=${role.value}` : ''
      }${
        collectionOperation?.value
          ? `&collection_operation=${collectionOperation.value}`
          : ''
      }${team?.value ? `&team=${team.value}` : ''}&sortName=${
        sortBy === 'collection_operations' ? 'collection_operation' : sortBy
      }&sortOrder=${sortOrder}`,
      {
        headers: {
          method: 'GET',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    const data = await result.json();
    setIsLoading(false);
    setDriveBlueprint(data?.data || []);
    // if (!(teamsData?.length > 0) && currentPage > 1)
    //   setCurrentPage(currentPage - 1);
    // setSelectedRows([]);
    setTotalRecords(data?.count);
  };
  useEffect(() => {
    getStaffData();
    if (staffName.length === 1) {
      setCurrentPage(1);
    }
  }, [
    currentPage,
    limit,
    BASE_URL,
    role,
    collectionOperation,
    team?.value,
    staffName,
    sortBy,
    sortOrder,
  ]);

  const getRolesDropdown = async () => {
    try {
      const result = await fetch(`${BASE_URL}/contact-roles`, {
        method: 'GET',
        headers: { authorization: `Bearer ${bearerToken}` },
      });
      const data = await result.json();
      let formatRoles = data?.data?.map((role) => ({
        label: role?.name,
        value: role?.id,
      }));
      setRolesData([...formatRoles]);
    } catch (error) {
      console.error('Error searching data:', error);
    }
  };

  useEffect(() => {
    fetchCollectionOperations();
    // fetchTeams();
    getRolesDropdown();
  }, []);
  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortBy('');
        setSortOrder('');
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const fetchCollectionOperations = async () => {
    const result = await fetch(
      `${BASE_URL}/business_units/collection_operations/list`,
      {
        headers: {
          method: 'GET',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      let formatCollectionOperations = data?.map((operation) => ({
        label: operation?.name,
        value: operation?.id,
      }));
      setCollectionOperationData([...formatCollectionOperations]);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  //   const assignMembers = async () => {
  //     if (!selectedRows?.length > 0) return;
  //     if (loading) return;
  //     setLoading(true);
  //     const result = await fetch(BASE_URL + '/staff-admin/teams/team-members', {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         authorization: `Bearer ${bearerToken}`,
  //       },
  //       method: 'POST',
  //       body: JSON.stringify({
  //         staff_ids: selectedRows,
  //         team_id: team.value,
  //       }),
  //     });
  //     setLoading(false);
  //     if (result.ok || result.status === 201) {
  //       setShowSuccessMessage(true);
  //     } else toast.error('Error Assigning Members', { autoClose: 3000 });
  //   };

  const handleShowConfirmation = () => {
    if (!selectedRows?.length > 0) {
      toast.dismiss();
      return toast.warn('Please select blueprint/s first.');
    }
    if (
      !location?.state?.name ||
      !location?.state?.description ||
      !location?.state?.is_active
    ) {
      toast.dismiss();
      return toast.error(
        'One or more prospect details missing please start from create prospect screen.'
      );
    }
    navigate(OS_PROSPECTS_PATH.CREATE_MESSAGE, {
      state: {
        name: location?.state?.name,
        description: location?.state?.description,
        is_active: location?.state?.is_active,
        blueprints: selectedRows,
      },
    });
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [team]);
  //   const handleCancel = (e) => {
  //     e.preventDefault();
  //     if (!selectedRows?.length > 0) {
  //       navigate(-1);
  //     } else setShowCancelModal(true);
  //   };
  useEffect(() => {
    if (!role?.value) setRole(null);
    if (!collectionOperation?.value) setCollectionOperation(null);
  }, [role, collectionOperation]);

  const tableHeaders = [
    { name: 'account_name', label: 'Account', width: '15%', sortable: true },
    {
      name: 'location_name',
      label: 'Location',
      width: '15%',
      sortable: true,
    },
    {
      name: 'projection',
      label: 'Projection',
      width: '6%',
      sortable: false,
    },
    {
      name: 'last_drive',
      label: 'Last Drive',
      width: '7%',
      sortable: true,
    },
    {
      name: 'next_drive',
      label: 'Next Drive',
      width: '7%',
      sortable: true,
    },
    {
      name: 'cp_name',
      label: 'CP Name',
      width: '10%',
      sortable: true,
    },
    {
      name: 'cp_email',
      label: 'CP Email',
      width: '20%',
      sortable: true,
    },
    {
      name: 'cp_mobile',
      label: 'CP Mobile',
      width: '20%',
      sortable: true,
    },
    {},
  ];
  const BreadcrumbsData = [
    ...ProspectsBreadCrumbsData,
    {
      label: 'Build Segment',
      class: 'active-label',
      link: OS_PROSPECTS_PATH.BUILD_SEGMENTS,
    },
  ];
  return (
    <div className="mainContent">
      <TopBar BreadCrumbsData={BreadcrumbsData} BreadCrumbsTitle={'Prospect'} />
      <div className="filterBar">
        <div className="filterInner flex-column">
          <div className="w-100 d-flex justify-content-between align-items-center">
            <h2>Filters</h2>
            <div className={`filter ${styles.w80} py-3 mt-2`}>
              <form className="d-flex justify-content-center align-items-center">
                <div className={`${styles.fieldDate} w-100 me-3`}>
                  <DatePicker
                    dateFormat="MM/dd/yy"
                    className={`custom-datepicker ${styles.datepicker}`}
                    style={{ minWidth: '19rem' }}
                    selected={dateRange.startDate}
                    onChange={handleDateChange}
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    selectsRange
                    disabled={true}
                    placeholderText="Target Dates"
                  />
                </div>

                <div className="formGroup border-0 m-0 p-0 w-100 me-3">
                  <div className="form-field w-100 m-0">
                    <div className="field">
                      <input
                        type="text"
                        className="form-control"
                        name="projection"
                        placeholder=""
                        disabled={true}
                        value={staffName}
                        required
                        onChange={(e) => setStaffName(e.target.value)}
                      />
                      {<label>{'Projection'}</label>}
                    </div>
                  </div>
                </div>
                <div className="form-field w-100 me-3">
                  <SelectDropdown
                    placeholder={'Location Type'}
                    defaultValue={collectionOperation}
                    selectedValue={collectionOperation}
                    onChange={setCollectionOperation}
                    removeDivider
                    showLabel
                    disabled={true}
                    options={collectionOperationData}
                  />
                </div>
                <div className="form-field w-100 me-3">
                  <SelectDropdown
                    placeholder={'Eligibility'}
                    defaultValue={role}
                    selectedValue={role}
                    showLabel
                    removeDivider
                    disabled={true}
                    onChange={setRole}
                    options={rolesData}
                  />
                </div>
              </form>
            </div>
          </div>
          <div
            className={`filter d-flex pb-3 ${styles.w60} align-self-end justify-content-end mb-2`}
          >
            <form className="d-flex justify-content-center align-items-end w-100">
              <div className="form-field w-100 me-3" />
              <div className="form-field w-100 me-3">
                <SelectDropdown
                  placeholder={'Distance'}
                  defaultValue={collectionOperation}
                  selectedValue={collectionOperation}
                  onChange={setCollectionOperation}
                  removeDivider
                  disabled={true}
                  showLabel
                  options={collectionOperationData}
                />
              </div>
              <div className="form-field w-100 me-3">
                <SelectDropdown
                  placeholder={'Organization Level'}
                  defaultValue={role}
                  selectedValue={role}
                  showLabel
                  removeDivider
                  disabled={true}
                  onChange={setRole}
                  options={rolesData}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      {team?.value ? (
        <div className="mainContentInner">
          <TableList
            isLoading={isLoading}
            data={driveBluePrint}
            headers={tableHeaders}
            handleSort={handleSort}
            sortOrder={sortOrder}
            checkboxValues={selectedRows}
            handleCheckboxValue={(row) => row.id}
            handleCheckbox={setSelectedRows}
          />

          <Pagination
            limit={limit}
            setLimit={setLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalRecords={totalRecords}
          />
          <div className="form-footer">
            <button
              type="button"
              className={` ${`btn btn-primary`}`}
              onClick={handleShowConfirmation}
              //   disabled={loading}
            >
              Create Message
            </button>
          </div>

          <SuccessPopUpModal
            title="Success!"
            message={'Members assigned.'}
            modalPopUp={showSuccessMessage}
            isNavigate={false}
            // redirectPath={-1}
            showActionBtns={true}
            isArchived={false}
            setModalPopUp={setShowSuccessMessage}
          />
          {/* <ConfirmationTeamAssignModal
            title="Confirmation"
            modalPopUp={assignModal}
            setModalPopUp={setAssignModal}
            certificateName={team?.label}
            records={selectedRows?.length}
            isArchived={true}
            archived={assignMembers}
          /> */}
          <SuccessPopUpModal
            title="Confirmation"
            message={'Unsaved changes will be lost. Do you want to continue?'}
            modalPopUp={showCancelModal}
            setModalPopUp={setShowCancelModal}
            showActionBtns={false}
            isArchived={true}
            archived={() => navigate(-1)}
            acceptBtnTitle="Ok"
            rejectBtnTitle="Cancel"
          />
        </div>
      ) : null}
    </div>
  );
};
export default ProspectsBuildSegments;
