import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { API } from '../../../../../api/api-routes';
// import LocationNotes from '../../../../../assets/images/LocationNotes.png';
// import ListNotes from '../../../../common/DocumentComponent/Notes/ListNotes.js';
import ResolveImage from '../../../../assets/Resolve.svg';

import './index.scss';
import TableList from '../../../common/tableListing';
import Pagination from '../../../common/pagination';
import { toast } from 'react-toastify';
// import { toast } from 'react-toastify';

export default function DuplicatesList({ search }) {
  const { account_id } = useParams();
  const [sortName, setSortName] = useState('');
  const [order, setOrder] = useState();
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmationDialogResolve, setShowConfirmationDialogResolve] =
    useState(false);
  const [accountData, setAccountData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedChecked, setResolvedChecked] = useState(false);

  // const [categories, setCategories] = useState([]);
  // const [subCategories, setSubCategories] = useState([]);
  const [resloveId, setResolveId] = useState();
  const optionsConfig = [
    {
      label: 'View',
      path: (rowData) => `/crm/accounts/${rowData?.id}/view/about`,
      action: (rowData) => {},
    },
    {
      label: 'Resolve',
      // path: (rowData) => `${rowData.id}/edit`,
      action: (rowData) => {
        setShowConfirmationDialogResolve(true);
        setResolveId(+rowData?.id);
      },
    },
    // {
    //   label: 'Archive',
    //   action: (rowData) => handleClickArchive(rowData.id),
    // },
  ];
  const tableHeaders = [
    {
      name: 'becs_code',
      label: 'BECS Code',
      width: '14%',
      sortable: true,
    },
    {
      name: 'name',
      label: 'Name',
      width: '20%',
      sortable: true,
    },
    {
      name: 'street_address',
      label: 'Street Address',
      width: '20%',
      sortable: true,
    },
    {
      name: 'city',
      label: 'City',
      width: '15%',
      sortable: true,
    },
    {
      name: 'organization_level',
      label: 'Collection Operation',
      width: '16%',
      sortable: true,
    },
    {
      name: 'recruiter',
      label: 'Recruiter',
      width: '16%',
      sortable: true,
    },
  ];
  const [duplicates, setDuplicates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAccountData();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (accountData?.id) {
      getAccountDuplicates();
    }
  }, [
    accountData,
    order,
    sortName,
    search,
    limit,
    currentPage,
    resolvedChecked,
  ]);

  const fetchAccountData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/accounts/${account_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const res = await response.json();

      if (res?.status === 'success') {
        setAccountData(res?.data);
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAccountDuplicates = async () => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_BASE_URL
        }/accounts/${account_id}/duplicates/list?is_resolved=false&page=${currentPage}&limit=${limit}&${
          order ? `sortOrder=${order}` : ''
        }&${sortName ? `sortName=${sortName}` : 'sortName='}${
          search && `&keyword=${search}`
        }`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const res = await response.json();
      if (res?.status === 'success') {
        const records = res?.data?.records;
        if (records?.length) {
          records.unshift({
            id: accountData?.id,
            name: accountData?.name,
            street_address: `${accountData?.address?.address1}${
              accountData?.address?.address2 &&
              ` ${accountData?.address?.address2}`
            }`,
            organization_level: accountData?.collection_operation?.name,
            recruiter: `${accountData?.recruiter?.first_name} ${accountData?.recruiter?.last_name}`,
            city: accountData?.address?.city,
            becs_code: accountData?.BECS_code,
          });
          setDuplicates(records);
          setTotalRecords(res?.data?.count + 1);
        } else {
          setDuplicates([]);
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };
  const handleConfirmationResolve = async () => {
    setShowConfirmationDialogResolve(false);

    let data = {};
    if (account_id != resloveId) {
      data = {
        ...data,
        record_id: +resloveId,
      };
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/accounts/${account_id}/duplicates/resolve`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(data),
        }
      );
      const res = await response.json();
      if (res?.status === 'success') {
        setResolvedChecked(!resolvedChecked);
        toast.success('Duplicate resolved.');
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSort = (name) => {
    setSortName(name);
    setOrder(order === 'ASC' ? 'DESC' : 'ASC');
  };
  return (
    <div className="mainContent">
      {/* <ListNotes
        search={search}
        notesListPath={`/crm/locations/${id}/view/documents/notes`}
        attachmentsListPath={`/crm/locations/${id}/view/documents/attachments`}
        noteable_type={'crm_locations'}
        categories={categories}
        subCategories={subCategories}
      /> */}
      {/* ../../tableListing/index */}
      <div style={{ padding: '0px 24px' }}>
        <TableList
          isLoading={isLoading}
          data={duplicates}
          headers={tableHeaders}
          handleSort={handleSort}
          // sortName={sortName}
          optionsConfig={optionsConfig}
          showActionsLabel={false}
          current={duplicates[0]?.id}
        />
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
        />
      </div>
      <section
        className={`popup full-section ${
          showConfirmationDialogResolve ? 'active' : ''
        }`}
      >
        <div className="popup-inner">
          <div className="icon">
            <img src={ResolveImage} alt="CancelIcon" />
          </div>
          <div className="content">
            <h3>Resolve</h3>
            <p>Are you sure you want to merge?</p>
            <div className="buttons">
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirmationDialogResolve(false)}
              >
                No
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleConfirmationResolve()}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
