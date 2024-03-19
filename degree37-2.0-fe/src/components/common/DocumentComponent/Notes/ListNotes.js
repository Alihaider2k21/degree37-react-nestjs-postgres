/* eslint-disable */

import React, { useEffect, useState } from 'react';
// import AccountFilters from '../../AccountFilters';
import Pagination from '../../pagination';
import SelectDropdown from '../../selectDropdown';
import TableList from '../../tableListing/index';
import './index.scss';

import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../api/api-routes';
import ArchiveImage from '../../../../assets/archive.svg';
import SuccessPopUpModal from '../../successModal';

import moment from 'moment';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function ListNotes({
  noteable_type,
  categories,
  subCategories,
  notesListPath,
  attachmentsListPath,
  addNotesLink,
  search,
}) {
  const params = useParams();
  const id =
    noteable_type == 'donors'
      ? params?.donorId
      : params.account_id || params.volunteerId;
  const [notes, setNotes] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // const [sortOrder, setSortOrder] = useState('desc');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState(false);
  const [noteId, setNoteId] = useState();
  const [status, setStatus] = useState({ label: 'Active', value: 'true' });
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [sub_category_id, setSubCategoryId] = useState();
  const [category_id, setCategoryId] = useState();
  const [showConfirmationDialogArchive, setShowConfirmationDialogArchive] =
    useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    handleSort();
  }, [currentPage, status, sub_category_id, category_id]);

  useEffect(() => {
    getNotes();
  }, [sortBy, sortOrder, limit]);
  useEffect(() => {
    getNotes(1);
    setCurrentPage(1);
  }, [status, sub_category_id, category_id, search]);

  useEffect(() => {
    arrangeCategory(categories, 'category');
  }, [categories]);
  useEffect(() => {
    arrangeCategory(subCategories, 'subCategory');
  }, [subCategories]);

  const arrangeCategory = (data, type) => {
    const outputDataArray = [];
    for (const inputData of data) {
      const outputData = {
        id: inputData?.id,
        value: inputData?.name,
        label: inputData?.name,
        parent_id: inputData?.parent_id?.id,
      };

      outputDataArray.push(outputData);
    }
    if (type === 'subCategory') {
      // outputDataArray.unshift({
      //   value: 'SubCategory',
      //   label: 'SubCategory',
      // });
      setSubCategoryData(outputDataArray);
    } else {
      // outputDataArray.unshift({
      //   value: 'Category',
      //   label: 'Category',
      // });
      setCategoryData(outputDataArray);
    }
  };

  const handleClickArchive = (noteId) => {
    setNoteId(noteId);
    setShowConfirmationDialogArchive(true);
  };
  const handleConfirmationResultArchive = async (action) => {
    if (!action) {
      setShowConfirmationDialogArchive(false);
      return;
    }
    setShowConfirmationDialogArchive(false);

    try {
      const response = await API.crm.documents.notes.archiveNote(noteId);
      if (response?.status) {
        getNotes();
        setShowSuccessMessage(true);
      } else {
        toast.error('Note is archived.');
      }
    } catch (error) {
      toast.error('An error occurred while fetching user details', {
        autoClose: 3000,
      });
    }
  };

  const getNotes = async (page = currentPage) => {
    const queryParams = {
      noteable_type: noteable_type,
      id: id,
      sortBy: sortBy,
      sortOrder: sortOrder,
      limit: limit,
      currentPage: page,
      status: status,
      category_id: category_id,
      sub_category_id: sub_category_id,
      search,
    };
    try {
      setIsLoading(true);
      const result = await API.crm.documents.notes?.getAllNotes(queryParams);
      const notes = result?.data?.data;

      arrangeData(notes);
      setTotalRecords(result?.data?.count);
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };
  const tableHeaders = [
    { name: 'created_at', label: 'Created', width: '10%', sortable: true },
    {
      name: 'note_name',
      label: 'Note Name',
      width: '20%',
      sortable: true,
    },
    {
      name: 'category',
      label: 'Category',
      width: '14%',
      sortable: true,
    },
    {
      name: 'subcategory',
      label: 'Subcategory',
      width: '15%',
      sortable: true,
    },
    {
      name: 'created_by',
      label: 'Created by',
      width: '15%',
      sortable: true,
    },
    { name: 'is_active', label: 'Status', width: '15%', sortable: true },
  ];

  const arrangeData = (notes) => {
    const outputDataArray = [];
    for (const inputData of notes) {
      const outputData = {
        id: inputData.id,
        note_name: inputData.note_name,
        category: inputData.category_id.name,
        subcategory: inputData?.sub_category_id?.name, // You can replace this with the actual subcategory data if needed
        details: inputData?.details,
        is_active: inputData.is_active,
        noteable_id: inputData.noteable_id,
        noteable_type: inputData.noteable_type,
        created_at: moment(inputData.created_at).format('MM-DD-YYYY'),
        created_by:
          inputData.created_by?.first_name +
          ' ' +
          inputData.created_by?.last_name,
      };

      outputDataArray.push(outputData);
    }
    setNotes(outputDataArray);
  };
  const handleSort = (name) => {
    if (name === 'category') {
      setSortBy('category_id');
    } else if (name === 'subcategory') {
      setSortBy('sub_category_id');
    } else {
      setSortBy(name);
    }
    setSortOrder(sortOrder == 'desc' ? 'asc' : 'desc');
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
  // console.log(notes, 'nore'); // State to manage the selected value
  const handleChange = (selectedOption) => {
    // Handle the change of the selected value here
    // console.log(selectedOption, 'stay');
    setStatus(selectedOption);
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
                onClick={() => handleConfirmationResultArchive(true)}
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
                    placeholder={'Category'}
                    name="category_id"
                    showLabel={category_id ? true : false}
                    selectedValue={categoryData.find(
                      (option) => option?.value === category_id?.name
                    )}
                    defaultValue={categoryData.find(
                      (option) => option.value === category_id?.name
                    )}
                    required
                    removeDivider
                    onChange={(selectedOption) => {
                      // Update the selected value in the state
                      setCategoryId(selectedOption);
                      setSubCategoryId(null);
                    }}
                    options={categoryData}
                  />
                </div>
                <div className="" style={{ width: '255px' }}>
                  <SelectDropdown
                    placeholder={'Subcategory'}
                    name="sub_category_id"
                    showLabel={sub_category_id ? true : false}
                    required
                    selectedValue={sub_category_id}
                    onChange={(selectedOption) => {
                      // Update the selected value in the state
                      setSubCategoryId(selectedOption);
                    }}
                    disabled={!category_id}
                    removeDivider
                    options={subCategoryData.filter(
                      (el) => el.parent_id == category_id?.id
                    )}
                  />
                </div>
                <div className="" style={{ width: '255px' }}>
                  <div className="" style={{ width: '255px' }}>
                    <SelectDropdown
                      placeholder={'Status'}
                      selectedValue={status}
                      defaultValue={status}
                      removeDivider
                      showLabel={status ? true : false}
                      onChange={handleChange}
                      options={[
                        // {
                        //   label: 'Status',
                        // },
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
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div
          className={`NotesBar mt-2`}
          style={{ borderBottom: '1px solid #D9D9D9' }}
        >
          <div className="d-flex align-items-center h-100">
            <Link className="text-white h-100" to={notesListPath}>
              <p className="mb-0 activeNotes">Notes</p>
            </Link>
            <Link className="text-white h-100" to={attachmentsListPath}>
              <p className="mb-0">Attachments</p>
            </Link>
          </div>
          <Link to={addNotesLink}>
            <p className={`addNote`}>Add Note</p>
          </Link>
        </div>
        <TableList
          isLoading={isLoading}
          data={notes}
          headers={tableHeaders}
          handleSort={handleSort}
          // sortName={sortName}
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
      <SuccessPopUpModal
        title="Success!"
        message={'Note is archived.'}
        modalPopUp={showSuccessMessage}
        onConfirm={() => {}}
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setShowSuccessMessage}
      />
      {/* <TableList /> */}
    </>
  );
}
