import React, { useEffect, useState, useRef } from 'react';
import TopBar from '../topbar/index';
import Pagination from '../pagination';
import TableList from '../tableListing';
import SelectDropdown from '../selectDropdown';
import moment from 'moment';
import GlobalMultiSelect from '../GlobalMultiSelect';
import DatePicker from 'react-datepicker';

const ListDonationHistory = ({
  donorId,
  breadCrumbsData,
  customTopBar,
  show = true,
  search = '',
}) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [searchText, setSearchText] = useState('');
  const [donationHistoryListData, setDonationHistoryListData] = useState([]);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [getData, setGetData] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusDataText, setStatusDataText] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [statusFilterData, setStatusFilterData] = useState('');
  const [hospitalsData, setHospitalsData] = useState([]);
  const [selectedHospitals, setSelectedHospitals] = useState([]);
  const [proceduresData, setProceduresData] = useState([]);
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const getData = async () => {
      setIsLoading(true);
      try {
        const body = {
          donor_id: +donorId,
          status: +statusDataText?.value,
          procedure_type: selectedProcedures.map((item) => item.id),
          hospital: selectedHospitals.map((item) => item.id),
          start_date: dateRange.startDate,
          end_date: dateRange.endDate,
        };

        const result = await fetch(
          `${BASE_URL}/donors/donations/history?limit=${limit}&page=${currentPage}${
            sortBy ? `&sortName=${sortBy}&sortOrder=${sortOrder}` : ''
          }&keyword=${searchText !== '' ? searchText : search}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
          }
        );
        const data = await result.json();

        let tempDonationHistoryData = data?.data?.records;

        if (tempDonationHistoryData) {
          tempDonationHistoryData = tempDonationHistoryData.map((record) => {
            if (isFirstRender.current) {
              setHospitalsData((prevData) => {
                if (
                  !prevData.some((hospital) => hospital.id === record?.hospital)
                ) {
                  return [
                    ...prevData,
                    {
                      name: record?.hospital,
                      id: record?.hospital,
                    },
                  ];
                }
                return prevData;
              });

              setProceduresData((prevData) => {
                if (
                  !prevData.some(
                    (procedure) => procedure.id === record?.procedure
                  )
                ) {
                  return [
                    ...prevData,
                    {
                      name: record?.procedure,
                      id: record?.procedure,
                    },
                  ];
                }
                return prevData;
              });
            }

            record.donation_date = moment(record.donation_date).format(
              'MM-DD-YYYY'
            );
            record.dateshipped = moment(record.dateshipped).format(
              'MM-DD-YYYY'
            );
            record.credit = 200;
            return record;
          });
          isFirstRender.current = false;
        }

        console.log({ hospitalsData });

        setDonationHistoryListData(tempDonationHistoryData);
        setTotalRecords(data?.data?.count);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (!searchText && !search) {
      getData(limit, currentPage);
    }

    if (searchText.length > 1 || search.length > 1) {
      if (searchText.length > 1) {
        getData(searchText);
      }
      if (search.length > 1) {
        getData(search);
      }
    }

    if (searchText.length === 1 || search.length === 1) {
      setCurrentPage(1);
    }
    return () => {
      setGetData(false);
    };
  }, [
    currentPage,
    limit,
    search,
    searchText,
    BASE_URL,
    donorId,
    dateRange,
    statusDataText,
    statusFilterData,
    selectedProcedures,
    selectedHospitals,
    getData,
    sortBy,
    sortOrder,
  ]);

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  const statusOptions = [
    { label: 'Donation', value: '1' },
    { label: 'Deferral', value: '2' },
  ];

  const handleSort = (columnName) => {
    if (sortBy === columnName) {
      setSortOrder((prevSortOrder) =>
        prevSortOrder === 'ASC' ? 'DESC' : 'ASC'
      );
    } else {
      setSortBy(columnName);
      setSortOrder('ASC');
    }
  };

  const handleStatus = (value) => {
    if (value !== null) {
      setStatusFilterData(value?.value);
      setStatusDataText(value);
    } else {
      setStatusFilterData('');
      setStatusDataText(value);
    }
  };

  const tableHeaders = [
    {
      name: 'donation_date',
      label: 'Date',
      width: '15%',
      sortable: true,
    },
    {
      name: 'location',
      label: 'Location',
      width: '15%',
      sortable: true,
    },
    { name: 'procedure', label: 'Procedure', width: '15%', sortable: true },
    {
      name: 'donation_status',
      label: 'Status',
      width: '15%',
      sortable: true,
    },
    {
      name: 'dateshipped',
      label: 'Date Shipped',
      width: '15%',
      sortable: true,
    },
    { name: 'hospital', label: 'Hospital', width: '15%', sortable: true },
    { name: 'points', label: 'Points', width: '15%', sortable: true },
    { name: 'credit', label: 'Credit', width: '15%', sortable: true },
  ];

  const handleHospitalsChange = (hospitalsTemp) => {
    let tempHo = [...selectedHospitals];
    tempHo = tempHo.some((item) => item.id === hospitalsTemp.id)
      ? tempHo.filter((item) => item.id !== hospitalsTemp.id)
      : [...tempHo, hospitalsTemp];
    setSelectedHospitals(tempHo);
  };

  const handleProceduresChange = (proceduresTemp) => {
    let tempPo = [...selectedProcedures];
    tempPo = tempPo.some((item) => item.id === proceduresTemp.id)
      ? tempPo.filter((item) => item.id !== proceduresTemp.id)
      : [...tempPo, proceduresTemp];
    setSelectedProcedures(tempPo);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setDateRange({ startDate: start, endDate: end });
  };

  return (
    <div className="mainContent">
      {show && (
        <TopBar
          BreadCrumbsData={breadCrumbsData}
          BreadCrumbsTitle={'Donation History'}
          SearchPlaceholder={'Search'}
          SearchValue={searchText}
          SearchOnChange={searchFieldChange}
        />
      )}
      {show && customTopBar && customTopBar}
      <div className="filterBar">
        <div className="filterInner">
          <h2>Filters</h2>
          <div className="filter ">
            <form className={`d-flex gap-2`}>
              <DatePicker
                dateFormat="MM/dd/yyyy"
                className=" custom-datepicker "
                selected={dateRange.startDate}
                onChange={handleDateChange}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                selectsRange
                placeholderText="Date Range"
              />

              <GlobalMultiSelect
                label="Hospital"
                data={hospitalsData}
                selectedOptions={selectedHospitals}
                onChange={handleHospitalsChange}
                onSelectAll={(val) => {
                  setSelectedHospitals(val);
                }}
              />
              <GlobalMultiSelect
                label="Procedure"
                data={proceduresData}
                selectedOptions={selectedProcedures}
                onChange={handleProceduresChange}
                onSelectAll={(val) => {
                  setSelectedProcedures(val);
                }}
              />

              <SelectDropdown
                label="Status"
                options={statusOptions}
                selectedValue={statusDataText}
                onChange={(val) => {
                  handleStatus(val);
                }}
                removeDivider
                showLabel
                placeholder="Status"
              />
            </form>
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        <TableList
          isLoading={isLoading}
          data={donationHistoryListData}
          hideActionTitle={true}
          headers={tableHeaders}
          handleSort={handleSort}
          sortName={sortBy}
          sortOrder={sortOrder}
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
    </div>
  );
};

export default ListDonationHistory;
