import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import TopBar from '../../../../../common/topbar/index';
import SelectDropdown from '../../../../../common/selectDropdown';
import Pagination from '../../../../../common/pagination';
import SuccessPopUpModal from '../../../../../common/successModal';
import styles from './index.module.scss';
import ConfirmationTeamAssignModal from './ConfirmationTeamAssignModal';
import { useNavigate } from 'react-router-dom';
import TableList from '../../../../../common/tableListing';
import { TeamsAssignMembersBreadCrumbsData } from '../TeamsBreadCrumbsData';

const AssignMembers = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [teams, setTeams] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [staffName, setStaffName] = useState('');
  const [collectionOperation, setCollectionOperation] = useState(null);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [team, setTeam] = useState(null);
  const [teamsData, setTeamsData] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const bearerToken = localStorage.getItem('token');
  const [selectedRows, setSelectedRows] = useState([]);
  const [assignModal, setAssignModal] = useState(false);
  const [role, setRole] = useState(null);
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const getStaffData = async () => {
    if (!team?.value) return;
    setIsLoading(true);
    const result = await fetch(
      `${BASE_URL}/staffing-admin/other-teams-staff?limit=${limit}&page=${currentPage}&name=${staffName}${
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
    const teamsData = data?.data?.staff;

    for (const teamData of teamsData) {
      teamData.collection_operations = teamData.collection_operation_id.name;
      teamData.role = teamData?.roles_name;
    }
    setIsLoading(false);
    setTeams(teamsData?.length > 0 ? teamsData : []);
    if (!(teamsData?.length > 0) && currentPage > 1)
      setCurrentPage(currentPage - 1);
    setSelectedRows([]);
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
    fetchTeams();
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

  const fetchTeams = async () => {
    const result = await fetch(`${BASE_URL}/staff-admin/teams?status=true`, {
      headers: {
        method: 'GET',
        authorization: `Bearer ${bearerToken}`,
      },
    });
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      let formatTeams = data?.teams?.map((operation) => ({
        label: operation?.name,
        value: operation?.id,
      }));
      setTeamsData(formatTeams);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  const assignMembers = async () => {
    if (!selectedRows?.length > 0) return;
    if (loading) return;
    setLoading(true);
    const result = await fetch(BASE_URL + '/staff-admin/teams/team-members', {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
      method: 'POST',
      body: JSON.stringify({
        staff_ids: selectedRows,
        team_id: team.value,
      }),
    });
    setLoading(false);
    if (result.ok || result.status === 201) {
      setShowSuccessMessage(true);
    } else toast.error('Error Assigning Members', { autoClose: 3000 });
  };

  const handleShowConfirmation = () => {
    if (!selectedRows?.length > 0) {
      toast.dismiss();
      return toast.warn('Please select staff member/s first');
    }
    setAssignModal(true);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [team]);
  const handleCancel = (e) => {
    e.preventDefault();
    if (!selectedRows?.length > 0) {
      navigate(-1);
    } else setShowCancelModal(true);
  };
  useEffect(() => {
    if (!role?.value) setRole(null);
    if (!collectionOperation?.value) setCollectionOperation(null);
  }, [role, collectionOperation]);
  const tableHeaders = [
    { name: 'first_name', label: 'Name', width: '15%', sortable: true },
    {
      name: 'role',
      label: 'Role',
      width: '20%',
      sortable: false,
    },
    {
      name: 'collection_operations',
      label: 'Collection Operation',
      width: '20%',
      sortable: true,
    },
    {
      name: 'teams_name',
      label: 'Team Name',
      width: '25%',
      sortable: false,
    },
    { name: 'is_active', label: 'Status', width: '15%', sortable: true },
  ];
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={TeamsAssignMembersBreadCrumbsData}
        BreadCrumbsTitle={'Assign Members'}
      />
      <div className="filterBar">
        <div className="filterInner">
          <h2>Select Team to Assign Members</h2>
          <div className="filter w-25">
            <form className="d-flex justify-content-center align-items-center">
              <div className="form-field w-100 me-3">
                <SelectDropdown
                  placeholder={'Team'}
                  defaultValue={team}
                  selectedValue={team}
                  removeDivider
                  showLabel
                  onChange={setTeam}
                  options={teamsData}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="filterBar">
        <div className="filterInner">
          <h2>Filters</h2>
          <div className={`filter ${styles.w60}`}>
            <form className="d-flex justify-content-center align-items-center">
              <div className="formGroup border-0 m-0 p-0 w-100 me-3">
                <div className="form-field w-100 m-0">
                  <div className="field">
                    <input
                      type="text"
                      className="form-control"
                      name="staffName"
                      placeholder=""
                      value={staffName}
                      required
                      onChange={(e) => setStaffName(e.target.value)}
                    />
                    {<label>{'Staff Name'}</label>}
                  </div>
                </div>
              </div>
              <div className="form-field w-100 me-3">
                <SelectDropdown
                  placeholder={'Collection Operation'}
                  defaultValue={collectionOperation}
                  selectedValue={collectionOperation}
                  onChange={setCollectionOperation}
                  removeDivider
                  showLabel
                  options={collectionOperationData}
                />
              </div>
              <div className="form-field w-100 me-3">
                <SelectDropdown
                  placeholder={'Role'}
                  defaultValue={role}
                  selectedValue={role}
                  showLabel
                  removeDivider
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
            data={teams}
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
              className="btn btn-secondary border-0"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="button"
              className={` ${`btn btn-primary`}`}
              onClick={handleShowConfirmation}
              disabled={loading}
            >
              Assign
            </button>
          </div>

          <SuccessPopUpModal
            title="Success!"
            message={'Members assigned.'}
            modalPopUp={showSuccessMessage}
            isNavigate={true}
            redirectPath={-1}
            showActionBtns={true}
            isArchived={false}
            setModalPopUp={setShowSuccessMessage}
          />
          <ConfirmationTeamAssignModal
            title="Confirmation"
            modalPopUp={assignModal}
            setModalPopUp={setAssignModal}
            certificateName={team?.label}
            records={selectedRows?.length}
            isArchived={true}
            archived={assignMembers}
          />
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
export default AssignMembers;
