import React, { useEffect, useState } from 'react';
import TopBar from '../../../common/topbar/index';
import { useParams } from 'react-router-dom';
import KPIs from './KPIs';
import viewimage from '../../../../assets/images/viewimage.png';
import { LocationsBreadCrumbsData } from '../LocationsBreadCrumbsData';
import AccountViewNavigationTabs from '../navigationTabs';
import Pagination from '../../../common/pagination';
import LocationHistoryListModal from './listModal';
import LocationHistoryFilters from './LocationHistoryFilters';
import LocationHistoryTableList from './LocationHistoryTableList';
import { API } from '../../../../api/api-routes';
import moment from 'moment';
import { toast } from 'react-toastify';
import { fetchData } from '../../../../helpers/Api';

const initialSearchParams = {
  page: 1,
  limit: 10,
  keyword: '',
  sortOrder: 'DESC',
  sortName: 'id',
};

export default function LocationsHistoryList() {
  const { id } = useParams();
  const [KPIData, setKPIData] = useState({
    lossRateTotal: 0,
    lossRateDeferrals: 0,
    lossQns: 0,
    lossWalkouts: 0,
  });
  const [viewNumbersPercentage, setViewNumbersPrcentage] = useState('numbers');
  const [viewProductsProcedure, setViewProductsProcedure] =
    useState('products');
  const [data, setData] = useState([]);
  const [page, setPage] = React.useState(initialSearchParams.page);
  const [limit, setLimit] = React.useState(
    process.env.REACT_APP_PAGE_LIMIT || initialSearchParams.limit
  );
  const [resultData, setResultData] = useState([]);
  const [sortOrder, setSortOrder] = React.useState(
    initialSearchParams.sortOrder
  );
  const [expandedRow, setExpandedRow] = React.useState(-1);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [sortName, setSortName] = React.useState(initialSearchParams.sortName);
  const [operationStatus, setOperationStatus] = useState([]);
  const [status, setStatus] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [viewAddress, setViewAddress] = useState('');

  const [locations, setLocations] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const showRowData = (rowData, index) => {
    getDriveDetailsData(rowData?.driveid);
    setSelectedIndex(index);
  };
  const fetchOperationStatus = async () => {
    try {
      const { data } =
        await API.systemConfiguration.operationAdministrations.bookingDrives.operationStatus.getOperationStatus(
          'Drives'
        );
      setOperationStatus([
        ...(data?.data?.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        }) || []),
      ]);
    } catch (error) {
      toast.error('Error fetching data:', error);
    }
  };

  const BreadCrumbsData = [
    ...LocationsBreadCrumbsData,
    {
      label: 'View Location',
      class: 'active-label',
      link: `/crm/locations/${id}/view`,
    },
    {
      label: 'Drive History',
      class: 'active-label',
      link: `/crm/locations/${id}/view/drive-history`,
    },
  ];
  const tableHeaders = [
    { name: 'date', label: 'Date', width: '10%', sortable: true },
    { name: 'appointment', label: 'Appts', width: '5%', sortable: true },
    { name: 'projection', label: 'Proj', width: '5%', sortable: true },
    { name: 'registered', label: 'Reg', width: '5%', sortable: true },
    { name: 'performed', label: 'Perf', width: '5%', sortable: true },
    { name: 'actual', label: 'Actual', width: '5%', sortable: true },
    { name: 'pa', label: 'PA', width: '5%', sortable: true },
    { name: 'deferrals', label: 'Def', width: '5%', sortable: true },
    { name: 'qns', label: 'QNS', width: '5%', sortable: true },
    { name: 'ftd', label: 'FTD', width: '5%', sortable: true },
    { name: 'walkouts', label: 'WO', width: '5%', sortable: true },
    { name: 'void', label: 'Void', width: '5%', sortable: true },
    { name: 'noofshifts', label: 'Shift', width: '10%', sortable: true },
    { name: 'tooltip', label: '', width: '10%', sortable: true },
    { name: 'status', label: 'Status', width: '5%', sortable: true },
  ];

  const handleSort = (columnName) => {
    setSortName(columnName);
    setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
  };

  const getHistory = async () => {
    const { data: response } = await API.crm.location.getDriveHistory(id, {
      page,
      limit,
      status,
      sortName,
      sortOrder,
      startDate,
      endDate,
    });
    const { count, result } = response;
    setTotalRecords(count);
    setResultData(result);
  };

  const handleKPI = async (dataKPI) => {
    let lossRateDeferrals = 0;
    let lossQns = 0;
    let lossWalkouts = 0;
    // let lossVoid = 0;
    let lossRateTotal = 0;
    let sumOEFProducts = 0;
    let sumOEFProcedures = 0;
    let totalDonors = 0;
    let firstTimeDonors = 0;
    let projProd = 0;
    let projProc = 0;
    let registered = 0;
    let actual = 0;
    let appointment_count = 0;
    let slots = 0;
    for (let i = 0; i < dataKPI.length; i++) {
      const item = dataKPI[i];
      item?.drives?.shifts?.forEach((shift) => {
        shift?.projections?.forEach((proj) => {
          projProd += proj?.product_yield || 0;
          projProc += proj?.procedure_type_qty || 0;
        });
        slots += shift?.shift_slots?.length || 0;
      });
      appointment_count += item?.drives?.appointment_count || 0;
      sumOEFProducts += item?.drives?.oef_products || 0;
      sumOEFProcedures += item?.drives?.oef_procedures || 0;
      const donorDonations = item?.drives?.donor_donations;
      totalDonors += donorDonations?.length || 0;
      registered += item?.drives?.donor_donations?.length || 0;
      actual += item?.drives?.donor_donations?.filter((item) =>
        [2, 4, 5, 6].includes(item?.donation_status)
      ).length;
      for (let j = 0; j < donorDonations?.length; j++) {
        const donation = donorDonations[j];

        if (!donation.donation_date) {
          firstTimeDonors++;
        }
        lossRateTotal++;
        if (donation.donation_status == 5 || donation.donation_status == 7) {
          lossRateDeferrals++;
        }
        if (donation.donation_status == 4) {
          lossQns++;
        }
        if (donation.donation_status == 3) {
          lossWalkouts++;
        }
      }
    }
    setKPIData({
      lossRateTotal: lossRateTotal / dataKPI.length,
      lossRateDeferrals: lossRateDeferrals / dataKPI.length,
      lossQns: lossQns / dataKPI.length,
      lossWalkouts: lossWalkouts / dataKPI.length,
      sumOEFProcedures: sumOEFProcedures / dataKPI.length,
      sumOEFProducts: sumOEFProducts / dataKPI.length,
      firstTimeDonors: firstTimeDonors / dataKPI.length,
      totalDonors: totalDonors / dataKPI.length,
      projProc: projProc / dataKPI.length,
      projProd: projProd / dataKPI.length,
      registered: registered / dataKPI.length,
      appointment_count: appointment_count / dataKPI.length,
      actual: actual / dataKPI.length,
      pa: (actual / dataKPI.length / (projProd / dataKPI.length)) * 100,
      slots: slots / dataKPI.length,
    });
  };

  const getKPIData = async () => {
    const { data: response } = await API.crm.location.getDriveHistoryKPI(id);
    const { dataKPI } = response;
    handleKPI(dataKPI);
  };
  const getDriveDetailsData = async (driveId) => {
    const { data: response } = await API.crm.location.getDriveHistoryDetail(
      id,
      driveId
    );
    const { data } = response;
    let driveData = [];
    for (let i = 0; i < data?.length; i++) {
      const item = data[i];
      let projProd = 0;
      let projProc = 0;
      item?.drives?.shifts?.map((shift) => {
        shift?.projections?.map((proj) => {
          projProd += proj?.product_yield || 0;
          projProc += proj?.procedure_type_qty || 0;
        });
      });
      const actual = item?.drives?.donor_donations?.filter((item) =>
        [2, 4, 5, 6].includes(item?.donation_status)
      ).length;

      const shiftsData = [];
      const donorFlow = [];
      let hour = 0;
      let minShiftStartTime = null;
      let maxShiftEndTime = null;
      item?.drives?.shifts?.forEach((item) => {
        if (!minShiftStartTime) minShiftStartTime = moment(item.start_time);
        else {
          if (moment(item.start_time).isBefore(minShiftStartTime)) {
            minShiftStartTime = moment(item.start_time);
          }
        }
        if (!maxShiftEndTime) maxShiftEndTime = moment(item.end_time);
        else {
          if (moment(item.end_time).isAfter(maxShiftEndTime)) {
            maxShiftEndTime = moment(item.end_time);
          }
        }
      });
      for (
        let startOfShift = moment(minShiftStartTime);
        startOfShift.isBefore(maxShiftEndTime);
        startOfShift.add(1, 'hour')
      ) {
        donorFlow.push({
          hour: hour,
          value: 0,
          start: moment(startOfShift),
          end: moment(startOfShift).add(1, 'hour'),
        });
        hour++;
      }
      for (let k = 0; k < item?.drives?.donor_appointments?.length; k++) {
        const appointmentSlot = item?.drives?.donor_appointments[k];
        const appointmentStartTime = moment(appointmentSlot.slot.start_time);
        const appointmentEndTime = moment(appointmentSlot.slot.end_time);
        for (let d = 0; d < donorFlow.length; d++) {
          if (
            appointmentStartTime.isSameOrAfter(donorFlow[d].start) &&
            appointmentEndTime.isSameOrBefore(donorFlow[d].end)
          ) {
            donorFlow[d].value += 1;
          }
        }
      }
      for (let k = 0; k < item?.drives?.shifts?.length; k++) {
        const shiftItem = item?.drives?.shifts?.[k];
        const projections = shiftItem?.projections;
        shiftsData.push({
          index: k + 1,
          date: shiftItem.start_time,
          projProc: 0,
          projProd: 0,
          reg: 0,
          perf: 0,
          actual: 0,
          def: 0,
          qns: 0,
          ftd: 0,
          wo: 0,
        });

        const projectionData = [];
        for (let j = 0; j < projections.length; j++) {
          projectionData.push({
            procedure: projections?.[j]?.procedure_type?.name,
            projProc: projections?.[j]?.procedure_type_qty || 0,
            projProd: projections?.[j]?.product_yield || 0,
            reg: projections?.[j]?.donor_donations?.length || 0,
            perf: projections?.[j]?.donor_donations?.filter((item) =>
              [2, 4, 5, 6, 7].includes(item?.donation_status)
            ).length,
            actual: projections?.[j]?.donor_donations?.filter((item) =>
              [2, 4, 5, 6].includes(item?.donation_status)
            ).length,
            def: projections?.[j]?.donor_donations?.filter((item) =>
              [5, 7].includes(item?.donation_status)
            ).length,
            qns: projections?.[j]?.donor_donations?.filter((item) =>
              [4].includes(item?.donation_status)
            ).length,
            ftd: projections?.[j]?.donor_donations?.filter(
              (item) => !item?.donation_date
            ).length,
            wo: projections?.[j]?.donor_donations?.filter((item) =>
              [3].includes(item?.donation_status)
            ).length,
          });
          shiftsData[k]['projProc'] += projectionData[j]['projProc'];
          shiftsData[k]['projProd'] += projectionData[j]['projProd'];
          shiftsData[k]['reg'] += projectionData[j]['reg'];
          shiftsData[k]['perf'] += projectionData[j]['perf'];
          shiftsData[k]['actual'] += projectionData[j]['actual'];
          shiftsData[k]['def'] += projectionData[j]['def'];
          shiftsData[k]['qns'] += projectionData[j]['qns'];
          shiftsData[k]['ftd'] += projectionData[j]['ftd'];
          shiftsData[k]['wo'] += projectionData[j]['wo'];
        }
        shiftsData[k] = { ...shiftsData[k], projectionData };
      }

      driveData.push({
        date: item?.drives?.date,
        appts: item?.drives?.appointment_count,
        projProd,
        projProc,
        reg: item?.drives?.donor_donations?.length || 0,
        perf: item?.drives?.donor_donations?.filter((item) =>
          [2, 4, 5, 6, 7].includes(item?.donation_status)
        ).length,
        actual,
        pa: `${(actual / projProd) * 100}%`,
        def: item?.drives?.donor_donations?.filter((item) =>
          [5, 7].includes(item?.donation_status)
        ).length,
        qns: item?.drives?.donor_donations?.filter((item) =>
          [4].includes(item?.donation_status)
        ).length,
        ftd: item?.drives?.donor_donations?.filter(
          (item) => !item?.donation_date
        ).length,
        wo: item?.drives?.donor_donations?.filter((item) =>
          [3].includes(item?.donation_status)
        ).length,
        void: 0,
        shift: item?.drives?.shifts?.length || 0,
        status: item?.drives?.operation_status?.name,
        shiftData: shiftsData,
        donorFlow,
      });
    }

    setData(driveData);
    setModalOpen(true);
  };
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
  useEffect(() => {
    getHistory();
    fetchOperationStatus();
    // setViewAddress('');
    // setLocations('');
    getKPIData();
  }, []);

  useEffect(() => {
    getHistory();
  }, [page, limit, status, sortName, sortOrder, startDate, endDate]);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadCrumbsData}
        BreadCrumbsTitle="Drives History"
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
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
        <div className="d-flex align-items-center justify-between">
          <AccountViewNavigationTabs />
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-md btn-link p-0 editBtn"
              color="primary"
              onClick={() => {
                if (viewNumbersPercentage === 'numbers')
                  setViewNumbersPrcentage('percentage');
                else setViewNumbersPrcentage('numbers');
              }}
            >
              {viewNumbersPercentage === 'percentage'
                ? 'View as Numbers'
                : 'View as Percentage'}
            </button>
            <button
              className="btn btn-md btn-link p-0 editBtn"
              color="primary"
              onClick={() => {
                if (viewProductsProcedure === 'products')
                  setViewProductsProcedure('procedures');
                else setViewProductsProcedure('products');
              }}
            >
              {viewProductsProcedure === 'products'
                ? 'View as Procedures'
                : 'View as Products'}
            </button>
          </div>
        </div>
      </div>
      <KPIs
        data={KPIData}
        viewNumbersPercentage={viewNumbersPercentage}
        viewProductsProcedure={viewProductsProcedure}
      />
      <LocationHistoryFilters
        operationStatus={operationStatus}
        handleFilter={(filters) => {
          if (filters?.status != '') setStatus(filters?.status);
          else setStatus('');
          if (filters?.date_range) {
            setStartDate(filters?.date_range?.startDate || '');
            setEndDate(filters?.date_range?.endDate || '');
          }
        }}
      />
      <div className="mainContentInner">
        <LocationHistoryTableList
          isLoading={false}
          data={resultData}
          headers={tableHeaders}
          handleSort={handleSort}
          onRowClick={showRowData}
        />
        {selectedIndex !== -1 && data?.[0] ? (
          <LocationHistoryListModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            selectedRow={data?.[0]}
            setExpandedRow={setExpandedRow}
            expandedRow={expandedRow}
          />
        ) : null}
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={page}
          setCurrentPage={setPage}
          totalRecords={totalRecords}
        />
      </div>
    </div>
  );
}
