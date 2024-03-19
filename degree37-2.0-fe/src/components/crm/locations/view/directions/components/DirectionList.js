/* eslint-disable */

import React, { useEffect, useMemo, useState } from 'react';
import Pagination from '../../../../../common/pagination';
import SelectDropdown from '../../../../../common/selectDropdown';
import TableList from '../../../../../common/tableListing/index';
import SuccessPopUpModal from '../../../../../common/successModal';
import './index.scss';

import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../../../api/api-routes';
import ArchiveImage from '../../../../../../assets/archive.svg';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function DirectionList({ search }) {
  const { locationId } = useParams();
  const [notes, setNotes] = useState([]);
  const [isLoading] = useState(false);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [DirectionId, setDirectionId] = useState();
  const [status, setStatus] = useState();
  const [archive, setArchive] = useState(true);
  const [isActive, setIsActive] = useState({
    label: 'Active',
    value: 'true',
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [sort, setSort] = useState({
    sortName: '',
    sortOrder: 'ASC',
  });
  const [collectionOperationDataId, setCollectionOperationDataId] =
    useState(null);
  const [showConfirmationDialogArchive, setShowConfirmationDialogArchive] =
    useState(false);
  const [collectionOperationData, setCollectionOperationData] = useState(null);
  useEffect(() => {
    handleSort();
  }, [currentPage, collectionOperationDataId]);

  useEffect(() => {
    getNotes();
    fetchCollectionOperations();
  }, []);
  useEffect(() => {
    getNotes();
  }, [
    search,
    limit,
    totalRecords,
    currentPage,
    isActive,
    sort,
    collectionOperationDataId,
  ]);

  const formattedNotes = useMemo(() => {
    return notes.map((note) => ({
      ...note,
      is_active: note.is_active,
      direction_collection_operation: note.collection_operation,
    }));
  }, [notes]);
  const handleClickArchive = (DirectionId) => {
    setDirectionId(DirectionId);
    setShowConfirmationDialogArchive(true);
  };
  const handleConfirmationResultArchive = async (action) => {
    if (!action) {
      setShowConfirmationDialogArchive(false);
      return;
    }

    setShowConfirmationDialogArchive(false);

    try {
      const response =
        await API.crm.location.directions.archiveDirection(DirectionId);
      if (response?.status) {
        getNotes();
        setArchive(true);
        setShowSuccessDialog(true);
      } else {
        toast.error('Unable to add in archive.');
      }
    } catch (error) {
      toast.error('An error occurred while fetching user details', {
        autoClose: 3000,
      });
    }
  };

  const getNotes = async () => {
    let queryParams = {
      limit: collectionOperationDataId?.value ? 100 : limit,
      page:
        collectionOperationDataId?.value || search?.length > 1
          ? 1
          : currentPage,
      location_id: locationId,
      keyword: search.length > 1 ? search : '',
    };
    if (collectionOperationDataId?.value) {
      queryParams = {
        ...queryParams,
        collection_operation_id: collectionOperationDataId?.value,
      };
    }
    if (sort?.sortName) {
      queryParams = {
        ...queryParams,
        sortName: sort?.sortName,
        sortOrder: sort?.sortOrder,
      };
    }
    if (isActive) {
      queryParams = {
        ...queryParams,
        is_active: isActive?.value,
      };
    }
    try {
      const result =
        await API.crm.location.directions.getAllDirections(queryParams);
      const f_notes = result?.data?.data;
      arrangeData(f_notes);
      setTotalRecords(result?.data?.count);
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const tableHeaders = [
    {
      name: 'direction_collection_operation',
      label: 'Collection Operation ',
      width: '15%',
      sortable: true,
    },
    {
      name: 'direction',
      label: 'Directions',
      width: '14%',
      sortable: true,
    },
    {
      name: 'miles',
      label: 'Miles',
      width: '14%',
      sortable: true,
    },
    {
      name: 'minutes',
      label: 'Minutes',
      width: '15%',
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: '25%', sortable: true },
  ];

  const arrangeData = (fNotes) => {
    const outputDataArray = [];
    for (const addDirectionData of fNotes) {
      const outputData = {
        id: addDirectionData.id,
        collection_operation: addDirectionData.collection_operation_id.name,
        direction: addDirectionData.direction,
        miles: addDirectionData.miles.toFixed(2),
        minutes: addDirectionData.minutes,
        is_active: addDirectionData.is_active,
      };

      outputDataArray.push(outputData);
    }
    setNotes(outputDataArray);
  };
  const handleSort = async (name) => {
    let tempSort = {};
    if (name) {
      setSort({
        sortName: name,
        sortOrder:
          sort.sortName === name && sort.sortOrder === 'ASC' ? 'DESC' : 'ASC',
      });
      tempSort = {
        sortName: name,
        sortOrder:
          sort.sortName === name && sort.sortOrder === 'ASC' ? 'DESC' : 'ASC',
      };
    }
  };
  const optionsConfig = [
    {
      label: 'View',
      path: (rowData) => `${rowData.id}/view`,
      action: (rowData) => {},
    },
    {
      label: 'Edit',
      path: (rowData) => `${rowData.id}/edit`,
      action: (rowData) => {},
    },
    {
      label: 'Archive',
      action: (rowData) => handleClickArchive(rowData.id),
    },
  ];
  const handleChange = (selectedOption) => {
    setStatus(selectedOption);
  };
  const fetchCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list`
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
  return (
    <>
      <section
        className={`popup full-section ${
          showConfirmationDialogArchive ? 'active' : ''
        }`}
      >
        <div className="popup-inner">
          <div className="icon">
            <img src={ArchiveImage} alt="CancelIcon" />
          </div>
          <div className="content">
            <h3>Confirmation</h3>
            <p>Are you sure you want to archive?</p>
            <div className="buttons">
              <button
                className="btn btn-secondary"
                onClick={() => handleConfirmationResultArchive(false)}
              >
                No
              </button>
              <button
                className="btn btn-primary"
                disabled={!archive}
                onClick={() => {
                  setArchive(false);
                  handleConfirmationResultArchive(true);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className="px-4">
        <div className="mb-3 filterBar px-0 accountFilters">
          <div className="filterInner">
            <h2>Filters</h2>
            <div className="filter">
              <form className="d-flex align-items-center gap-4 ">
                <div className="" style={{ width: '255px' }}>
                  <SelectDropdown
                    label="Collection Operation"
                    options={collectionOperationData}
                    selectedValue={collectionOperationDataId}
                    onChange={(selectedOption) => {
                      setCollectionOperationDataId(selectedOption);
                    }}
                    removeDivider
                    showLabel
                    placeholder="Collection Operation"
                  />
                </div>

                <SelectDropdown
                  placeholder={'Status'}
                  defaultValue={isActive}
                  selectedValue={isActive}
                  removeDivider
                  showLabel
                  onChange={(val) => {
                    setIsActive(val);
                  }}
                  options={[
                    { label: 'Active', value: 'true' },
                    { label: 'Inactive', value: 'false' },
                  ]}
                />
                {/* <div className="" style={{ width: '255px' }}>
                  <SelectDropdown
                    placeholder={'Status'}
                    selectedValue={status}
                    defaultValue={status}
                    removeDivider
                    removeTheClearCross
                    onChange={handleChange}
                    options={[
                      {
                        label: 'Status',
                      },
                      {
                        label: 'Active',
                        value: true,
                      },
                      {
                        label: 'Inactive',
                        value: false,
                      },
                    ]}
                    name="Status"
                    // showLabel={true}
                    //   error={collectionOperationError}
                    //   onBlur={(e) => handleInputBlur(e, true)}
                  />
                </div> */}
              </form>
            </div>
          </div>
        </div>
        <div className={`NotesBar mt-2`}>
          <div className="d-flex align-items-center h-100"></div>
          <Link to={'create'}>
            <p className={`addNote`}>Create Direction</p>
          </Link>
        </div>

        <TableList
          isLoading={isLoading}
          data={formattedNotes}
          headers={tableHeaders}
          handleSort={handleSort}
          optionsConfig={optionsConfig}
        />
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
          setTotalRecords={setTotalRecords}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Direction is archived."
          modalPopUp={showSuccessDialog}
          isNavigate={true}
          setModalPopUp={setShowSuccessDialog}
          showActionBtns={true}
        />
      </div>

      {/* <TableList /> */}
    </>
  );
}
