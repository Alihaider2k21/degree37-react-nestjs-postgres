import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import {
  TEAMS_ASSIGN_MEMBERS,
  TEAMS_PATH,
} from '../../../../../../routes/path';
import TopBar from '../../../../../common/topbar/index';
import NavTabs from '../../../../../common/navTabs';
import SelectDropdown from '../../../../../common/selectDropdown';
import Pagination from '../../../../../common/pagination';
import SuccessPopUpModal from '../../../../../common/successModal';
import RemoveTeamModal from './RemoveTeamModal';
import TableList from '../../../../../common/tableListing';
import { TeamsAssignMembersBreadCrumbsData } from '../TeamsBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect/index.jsx';

const AssignMembersList = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const currentLocation = location.pathname;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [teams, setTeams] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const [sortOrder, setSortOrder] = useState('');
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [team, setTeam] = useState(null);
  const [teamsData, setTeamsData] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const bearerToken = localStorage.getItem('token');
  const [showRemoveTeam, setShowRemoveTeam] = useState();
  const [removeStaffId, setRemoveStaffId] = useState();
  const [removeShow, setRemoveShow] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (searchText?.length > 1) {
      setSearched(true);
      setCurrentPage(1);
      getTeamsData();
    }
    if (searchText.length === 1 && searched) {
      setCurrentPage(1);
      getTeamsData();
      setSearched(false);
    }
  }, [searchText]);

  const tabs = [
    CheckPermission(null, [
      Permissions.STAFF_ADMINISTRATION.TEAMS.TEAMS.MODULE_CODE,
    ]) && {
      label: 'Teams',
      link: TEAMS_PATH.LIST,
    },
    CheckPermission(null, [
      Permissions.STAFF_ADMINISTRATION.TEAMS.ASSIGNED_MEMBER.MODULE_CODE,
    ]) && {
      label: 'Assign Members',
      link: TEAMS_ASSIGN_MEMBERS.LIST,
    },
  ].filter(Boolean);

  const getTeamsData = async () => {
    setIsLoading(true);
    try {
      let collectionOperationValues = '';
      if (collectionOperation?.length > 0)
        collectionOperationValues = collectionOperation
          ?.map((op) => op?.id)
          .join(',');
      let search = searchText.length > 1 ? searchText : '';
      const result = await fetch(
        `${BASE_URL}/staffing-admin/team-members?limit=${limit}&page=${currentPage}${
          isActive?.value ? `&status=${isActive.value}` : ''
        }&collection_operation=${collectionOperationValues}${
          team?.value ? `&team=${team.value}` : ''
        }${searchText ? `&name=${search}` : ''}&sortName=${
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

      const staffsData = data?.data?.staff;

      for (const staffData of staffsData) {
        staffData.collection_operations =
          staffData.collection_operation_id.name;
        staffData.team_name = staffData?.teams_name
          ?.map((t) => t?.name)
          ?.join(', ');
        staffData.role = staffData?.roles_name;
      }
      if (staffsData?.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      setIsLoading(false);
      setShowRemoveTeam(team?.value ? true : false);
      setTeams(staffsData?.length > 0 ? staffsData : []);
      setTotalRecords(data?.count);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    getTeamsData();
  }, [
    currentPage,
    limit,
    BASE_URL,
    team,
    collectionOperation,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchCollectionOperations();
    fetchTeams();
  }, []);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };
  const handleAddClick = () => {
    navigate(TEAMS_ASSIGN_MEMBERS.ASSIGN);
  };
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
        name: operation?.name,
        id: operation?.id,
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
      setTeamsData([...formatTeams]);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  const removeRelation = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/staff-admin/teams/${team?.value}/team-members/${removeStaffId?.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      setIsLoading(false);
      if (res.status === 404) {
        toast.error('Relation not found.');
        return;
      }
      if (res.status === 200) {
        setRemoveShow(false);
        setShowSuccessMessage(true);
        if (teams?.length === 1 && currentPage > 1)
          setCurrentPage(currentPage - 1);

        await getTeamsData();
        return;
      } else toast.error('Something went wrong.');
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

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
      name: 'team_name',
      label: 'Team Name',
      width: '25%',
      sortable: false,
    },
    { name: 'is_active', label: 'Status', width: '15%', sortable: true },
  ];

  const optionsConfig = [
    {
      label: 'Remove From Team',
      action: (rowData) => {
        setRemoveStaffId(rowData);
        setRemoveShow(true);
      },
    },
  ];

  const handleCollectionOperation = (data) => {
    setCollectionOperation((prevSelected) =>
      prevSelected.some((item) => item.id === data.id)
        ? prevSelected.filter((item) => item.id !== data.id)
        : [...prevSelected, data]
    );
  };

  useEffect(() => {
    if (!team?.value) setTeam(null);
    if (!isActive?.value) setIsActive(null);
  }, [team, isActive, collectionOperation]);
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={TeamsAssignMembersBreadCrumbsData}
        BreadCrumbsTitle={'Assign Members'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <NavTabs tabs={tabs} currentLocation={currentLocation} />
        <div className="filterInner">
          <h2>Filters</h2>
          <div className={`filter`}>
            <form className="d-flex gap-3">
              <SelectDropdown
                placeholder={'Team'}
                defaultValue={team}
                selectedValue={team}
                removeDivider
                showLabel
                onChange={setTeam}
                options={teamsData}
              />
              <GlobalMultiSelect
                label="Collection Operation"
                data={collectionOperationData}
                selectedOptions={collectionOperation}
                onChange={(data) => handleCollectionOperation(data)}
                onSelectAll={(data) => setCollectionOperation(data)}
              />
              <SelectDropdown
                placeholder={'Status'}
                defaultValue={isActive}
                selectedValue={isActive}
                removeDivider
                showLabel
                onChange={setIsActive}
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
          Permissions.STAFF_ADMINISTRATION.TEAMS.ASSIGNED_MEMBER.WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Assign Members
            </button>
          </div>
        )}
        <TableList
          isLoading={isLoading}
          data={teams}
          headers={tableHeaders}
          handleSort={handleSort}
          sortOrder={sortOrder}
          optionsConfig={showRemoveTeam ? optionsConfig : null}
        />
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
        />
        <RemoveTeamModal
          title="Confirmation"
          message={`Are you sure want to remove ${
            removeStaffId?.first_name + ' ' + removeStaffId?.last_name
          } from team?`}
          modalPopUp={removeShow}
          setModalPopUp={setRemoveShow}
          showActionBtns={false}
          isArchived={true}
          archived={removeRelation}
        />
        <SuccessPopUpModal
          title="Success!"
          message={'Member removed.'}
          modalPopUp={showSuccessMessage}
          showActionBtns={true}
          crossIcon
          isArchived={false}
          setModalPopUp={setShowSuccessMessage}
        />
      </div>
    </div>
  );
};
export default AssignMembersList;
