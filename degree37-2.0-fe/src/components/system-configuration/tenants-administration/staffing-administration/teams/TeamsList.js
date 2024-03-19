import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import TopBar from '../../../../common/topbar/index';
import NavTabs from '../../../../common/navTabs';
import SelectDropdown from '../../../../common/selectDropdown';
import styles from './index.module.scss';
import Pagination from '../../../../common/pagination';
import SuccessPopUpModal from '../../../../common/successModal';
import { TEAMS_ASSIGN_MEMBERS, TEAMS_PATH } from '../../../../../routes/path';
import { groupBy } from 'lodash';
import TableList from '../../../../common/tableListing';
import GlobalMultiSelect from '../../../../common/GlobalMultiSelect';
import axios from 'axios';
import { TeamsBreadCrumbsData } from './TeamsBreadCrumbsData';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';

const TeamsList = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const currentLocation = location.pathname;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [teamId, setTeamId] = useState(null);
  const [teams, setTeams] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isActive, setIsActive] = useState({ label: 'Active', value: 'true' });
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const bearerToken = localStorage.getItem('token');
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);

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
    let search = searchText.length > 1 ? searchText : '';
    let collectionOperationValues = '';
    if (collectionOperation?.length > 0)
      collectionOperationValues = collectionOperation
        ?.map((op) => op?.id)
        .join(',');

    const result = await fetch(
      `${BASE_URL}/staff-admin/teams?limit=${limit}&page=${currentPage}&name=${search}&status=${
        isActive?.value ? isActive.value : ''
      }&collection_operation=${collectionOperationValues}&sortName=${
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
    const teamsData = data?.data?.teams;
    const collectionOperationsData = groupBy(
      data?.data?.collectionOperations,
      (collectionOperation) => collectionOperation.team_id.id
    );
    for (const teamData of teamsData) {
      teamData.collection_operations = collectionOperationsData[teamData.id]
        ?.map((bco) => bco.collection_operation_id.name)
        .join(', ');
    }

    setTeams(teamsData?.length > 0 ? teamsData : []);
    if (teamsData?.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    setIsLoading(false);

    setTotalRecords(data?.count);
  };

  useEffect(() => {
    getTeamsData();
  }, [
    currentPage,
    limit,
    BASE_URL,
    isActive,
    collectionOperation,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchCollectionOperations();
  }, []);
  useEffect(() => {
    if (!isActive?.value) setIsActive(null);
  }, [isActive]);
  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

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

  const handleAddClick = () => {
    navigate(TEAMS_PATH.CREATE);
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
    const result = await axios.get(
      `${BASE_URL}/business_units/collection_operations/list?status=true`
    );
    let { data } = await result.data;
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

  const archiveTeam = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/staff-admin/teams/archive/${teamId?.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({
            created_by: teamId?.created_by?.id,
          }),
        }
      );
      if (res.status === 404) {
        toast.error('Team not found.');
        return;
      }
      if (res.status === 204) {
        setModalPopUp(false);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
        if (teams?.length === 1 && currentPage > 1)
          setCurrentPage(currentPage - 1);

        await getTeamsData();
        return;
      } else toast.error('Something went wrong.');
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const tableHeaders = [
    { name: 'name', label: 'Name', width: '15%', sortable: true },
    {
      name: 'short_description',
      label: 'Short Description',
      width: '20%',
      sortable: true,
    },
    {
      name: 'description',
      label: 'Description',
      width: '25%',
      sortable: true,
    },
    {
      name: 'collection_operations',
      label: 'Collection Operation',
      width: '20%',
      sortable: false,
    },
    {
      name: 'member_count',
      label: 'Assigned Member',
      width: '15%',
      sortable: false,
    },
    { name: 'is_active', label: 'Status', width: '15%', sortable: true },
  ];

  const optionsConfig = [
    CheckPermission([Permissions.STAFF_ADMINISTRATION.TEAMS.TEAMS.READ]) && {
      label: 'View',
      path: (rowData) => `${TEAMS_PATH.VIEW.replace(':id', rowData?.id)}`,
      action: (rowData) => {},
    },
    CheckPermission([Permissions.STAFF_ADMINISTRATION.TEAMS.TEAMS.WRITE]) && {
      label: 'Edit',
      path: (rowData) => `${TEAMS_PATH.EDIT.replace(':id', rowData?.id)}`,
      action: (rowData) => {},
    },
    CheckPermission([Permissions.STAFF_ADMINISTRATION.TEAMS.TEAMS.ARCHIVE]) && {
      label: 'Archive',
      action: (rowData) => {
        setTeamId(rowData);
        setModalPopUp(true);
      },
    },
  ].filter(Boolean);

  const handleCollectionOperationChange = (collectionOperation) => {
    setCollectionOperation((prevSelected) =>
      prevSelected.some((item) => item.id === collectionOperation.id)
        ? prevSelected.filter((item) => item.id !== collectionOperation.id)
        : [...prevSelected, collectionOperation]
    );
  };

  const handleCollectionOperationChangeAll = (data) => {
    setCollectionOperation(data);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={TeamsBreadCrumbsData}
        BreadCrumbsTitle={'Teams'}
        SearchPlaceholder={'Search'}
        SearchValue={searchText}
        SearchOnChange={searchFieldChange}
      />
      <div className="filterBar">
        <NavTabs tabs={tabs} currentLocation={currentLocation} />
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter">
            <form className="d-flex justify-content-end">
              <div className="me-3">
                <GlobalMultiSelect
                  label="Collection Operation"
                  data={collectionOperationData}
                  selectedOptions={collectionOperation}
                  onChange={handleCollectionOperationChange}
                  onSelectAll={handleCollectionOperationChangeAll}
                />
              </div>

              <div className={`form-field ${styles.width255}`}>
                <SelectDropdown
                  placeholder={'Status'}
                  defaultValue={isActive}
                  selectedValue={isActive}
                  custHeight={62}
                  onChange={setIsActive}
                  removeDivider
                  showLabel
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
        {CheckPermission([
          Permissions.STAFF_ADMINISTRATION.TEAMS.TEAMS.WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Create Team
            </button>
          </div>
        )}
        <TableList
          isLoading={isLoading}
          data={teams}
          headers={tableHeaders}
          handleSort={handleSort}
          sortOrder={sortOrder}
          optionsConfig={optionsConfig}
        />
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
        />
        <SuccessPopUpModal
          title="Confirmation"
          message={'Are you sure you want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={true}
          archived={archiveTeam}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Team is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
        />
      </div>
    </div>
  );
};
export default TeamsList;
