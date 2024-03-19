/*eslint-disable*/

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { API } from '../../../../../api/api-routes';
// import LocationNotes from '../../../../../assets/images/LocationNotes.png';
// import ListNotes from '../../../../common/DocumentComponent/Notes/ListNotes.js';
import viewimage from '../../../../assets/images/LocationNotes.png';
import ResolveImage from '../../../../assets/Resolve.svg';

import TopBar from '../../../common/topbar/index';
import LocationAboutNavigationTabs from '../navigationTabs';
import './index.scss';
import TableList from '../../../common/tableListing';
import Pagination from '../../../common/pagination';
import { toast } from 'react-toastify';
import { fetchData } from '../../../../helpers/Api';
import { LocationsBreadCrumbsData } from '../LocationsBreadCrumbsData';
// import { toast } from 'react-toastify';

const LocationDuplicatesList = () => {
  const [search, setSearch] = useState('');
  const { id } = useParams();
  const [sortName, setSortName] = useState('');
  const [order, setOrder] = useState();
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmationDialogResolve, setShowConfirmationDialogResolve] =
    useState(false);
  const [locationData, setLocationData] = useState(null);
  const [viewAddress, setViewAddress] = useState('');
  const [locations, setLocations] = useState('');

  const BreadcrumbsData = [
    ...LocationsBreadCrumbsData,
    {
      label: 'View Location',
      class: 'disable-label',
      link: `/crm/locations/${id}/view`,
    },
    {
      label: 'Duplicates',
      class: 'active-label',
      link: `/crm/locations/${id}/view/duplicates`,
    },
  ];

  const searchFieldChange = (e) => {
    setSearch(e.target.value);
    // setTotalRecords(20);
  };
  // const [categories, setCategories] = useState([]);
  // const [subCategories, setSubCategories] = useState([]);
  const [resloveId, setResolveId] = useState();
  const optionsConfig = [
    {
      label: 'View',
      path: (rowData) => `/crm/locations/${rowData?.id}/view`,
      action: (rowData) => {},
    },
    // {
    //   label: 'Resolve',
    //   // path: (rowData) => `${rowData.id}/edit`,
    //   action: (rowData) => {
    //     setShowConfirmationDialogResolve(true);
    //     setResolveId(+rowData?.id);
    //   },
    // },
  ];
  const tableHeaders = [
    {
      name: 'becs_code',
      label: 'BECS Code',
      width: '17.5%',
      sortable: false,
    },
    {
      name: 'name',
      label: 'Name',
      width: '17.5%',
      sortable: true,
    },
    {
      name: 'room',
      label: 'Room',
      width: '17.5%',
      sortable: true,
    },
    {
      name: 'address',
      label: 'Address',
      width: '30%',
      sortable: true,
    },
    {
      name: '',
      label: '',
      width: '17.5%',
    },
  ];
  const [duplicates, setDuplicates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchLocationData();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (locationData?.id) {
      getLocationDuplicates();
    }
  }, [locationData, order, sortName, search, limit, currentPage]);

  useEffect(() => {
    fetchData(`/crm/locations/${id}`, 'GET')
      .then((res) => {
        if (res?.data) {
          let edit = res?.data;
          setViewAddress(`${edit?.address?.city}, ${edit?.address?.state}`);
          setLocations(edit?.name);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const fetchLocationData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/crm/locations/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const res = await response.json();
      console.log(res, 'res res');
      if (res?.status === 'success') {
        setLocationData(res?.data);
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  const getLocationDuplicates = async () => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_BASE_URL
        }/crm/locations/${id}/duplicates/list?is_resolved=false&page=${currentPage}&limit=${limit}&${
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
      console.log(res, 'res record res records');

      if (res?.status === 'success') {
        const records = res?.data?.records;
        if (records.length) {
          records.unshift({
            id: locationData?.id,
            name: locationData?.name,
            address: `${locationData?.address?.address1}${
              locationData?.address?.address2 &&
              ` ${locationData?.address?.address2}`
            }`,
            recruiter: `${locationData?.recruiter?.first_name} ${locationData?.recruiter?.last_name}`,
            room: locationData?.room,
            becs_code: locationData?.becs_code,
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
    if (id !== resloveId) {
      data = {
        record_id: +resloveId,
      };
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/crm/locations/${id}/duplicates/resolve`,
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
        toast.success('Duplicate resolved.');
        getLocationDuplicates();
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSort = (name) => {
    setSortName(name);
    console.log(name, order);
    setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    // if (name === 'category') {
    //   setSortBy('category_id');
    // } else if (name === 'subcategory') {
    //   setSortBy('sub_category_id');
    // } else {
    //   setSortBy(name);
    // }
    // setSortOrder(sortOrder == 'desc' ? 'asc' : 'desc');
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Duplicates'}
        SearchValue={search}
        SearchOnChange={searchFieldChange}
        SearchPlaceholder={'Search'}
      />
      <div className="imageMainContent">
        <div className="d-flex align-items-center gap-3 ">
          <div style={{ width: '62px', height: '62px' }}>
            <img src={viewimage} style={{ width: '100%' }} alt="CancelIcon" />
          </div>

          <div className="d-flex flex-column">
            <h4 className="">{locations}</h4>
            <span>{viewAddress}</span>
          </div>
        </div>
        <LocationAboutNavigationTabs />
      </div>
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
          // isLoading={isLoading}
          data={duplicates}
          headers={tableHeaders}
          handleSort={handleSort}
          // sortName={sortName}
          optionsConfig={optionsConfig}
          current={duplicates[0]?.id}
          showActionsLabel={false}
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
            <p>Are you sure you want to Merge?</p>
            <div className="buttons">
              <button
                className="btn btn-secondary"
                onClick={() => handleConfirmationResolve()}
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
};

export default LocationDuplicatesList;
