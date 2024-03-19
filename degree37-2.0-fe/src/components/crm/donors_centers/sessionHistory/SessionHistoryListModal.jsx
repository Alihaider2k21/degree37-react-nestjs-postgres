import React from 'react';
import { Modal } from 'react-bootstrap';
import SvgComponent from '../../../common/SvgComponent';
import styles from './index.module.scss';
import { OperationStatus } from './SessionHistoryUtils';
import { formatDate } from '../../../../helpers/formatDate';
import { API } from '../../../../api/api-routes';
import moment from 'moment';

export default function SessionHistoryListModal({
  modalOpen,
  setModalOpen,
  setExpandedRow,
  expandedRow,
  donorCenterId,
  selectedRowId,
}) {
  const [viewAs, setViewAs] = React.useState('Product');
  const [shiftData, setShiftData] = React.useState([]);
  const [sortBy, setSortBy] = React.useState({
    name: null,
    order: 'ASC',
  });
  const [selectedRow, setSelectedRow] = React.useState(null);

  React.useEffect(() => {
    const getHistoryDetail = async () => {
      const { data: response } =
        await API.systemConfiguration.organizationalAdministrations.facilities.getSessionHistoryDetail(
          donorCenterId,
          selectedRowId
        );
      const { data } = response;
      setSelectedRow(data);

      const shiftsData = [];
      const donorFlow = [];
      let hour = 0;
      let projProd = 0;
      let projProc = 0;
      let minShiftStartTime = null;
      let maxShiftEndTime = null;
      data?.shifts?.forEach((item) => {
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
      for (let k = 0; k < data.donor_appointments?.length; k++) {
        const appointmentSlot = data.donor_appointments[k];
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
      for (let k = 0; k < data?.shifts?.length; k++) {
        const shiftItem = data?.shifts?.[k];
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
          void: 0,
        });
        const projectionData = [];
        for (let j = 0; j < projections.length; j++) {
          projectionData.push({
            procedure: projections?.[j]?.procedure_type?.name,
            projProc: projections?.[j]?.procedure_type_qty || 0,
            projProd: projections?.[j]?.product_yield || 0,
            reg: projections?.[j]?.donor_donations?.length || 0,
            perf: projections?.[j]?.donor_donations?.filter((value) =>
              [2, 4, 5, 6, 7].includes(value?.donation_status)
            ).length,
            actual: projections?.[j]?.donor_donations?.filter((value) =>
              [2, 4, 5, 6].includes(value?.donation_status)
            ).length,
            def: projections?.[j]?.donor_donations?.filter((value) =>
              [5, 7].includes(value?.donation_status)
            ).length,
            qns: projections?.[j]?.donor_donations?.filter((value) =>
              [4].includes(value?.donation_status)
            ).length,
            ftd: projections?.[j]?.donor_donations?.filter(
              (value) => !value?.donation_date
            ).length,
            wo: projections?.[j]?.donor_donations?.filter((value) =>
              [3].includes(value?.donation_status)
            ).length,
            paProc:
              (projections?.[j]?.donor_donations?.filter((value) =>
                [2, 4, 5, 6].includes(value?.donation_status)
              ).length / projections?.[j]?.procedure_type_qty || 0) * 100,
            paProd:
              (projections?.[j]?.donor_donations?.filter((value) =>
                [2, 4, 5, 6].includes(value?.donation_status)
              ).length /
                parseFloat(projections?.[j]?.product_yield)) *
              100,
            void: 0,
          });
          projProd += projections?.[j]?.product_yield || 0;
          projProc += projections?.[j]?.procedure_type_qty || 0;
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
        shiftsData[k] = {
          ...shiftsData[k],
          projectionData,
          paProc: (shiftsData[k]['actual'] / shiftsData[k]['projProc']) * 100,
          paProd: (shiftsData[k]['actual'] / shiftsData[k]['projProd']) * 100,
        };
      }
      setSelectedRow({
        status: data?.operation_status?.name,
        donorFlow,
        projProd,
        projProc,
      });
      setShiftData(shiftsData);
    };

    getHistoryDetail();
  }, [donorCenterId, selectedRowId]);

  React.useEffect(() => {
    const sortedShiftData = [...shiftData].sort((obj1, obj2) => {
      if (sortBy.order === 'DESC') {
        return obj1[sortBy.name] - obj2[sortBy.name];
      }
      return obj2[sortBy.name] - obj1[sortBy.name];
    });

    setTimeout(() => {
      setShiftData(sortedShiftData);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const handleViewAs = () => {
    if (viewAs === 'Product') {
      setViewAs('Procedure');
    } else {
      setViewAs('Product');
    }
  };

  const handleSort = (name) => {
    setSortBy({
      name,
      order: sortBy.order === 'ASC' ? 'DESC' : 'ASC',
    });
  };

  const handleNaN = (value) => {
    return isNaN(value) ? 'N/A' : value;
  };

  const tableHeaders = [
    { name: 'index', label: 'Shift', width: '10%', sortable: true },
    { name: 'date', label: 'Date', width: '10%', sortable: true },
    { name: 'procedure', label: 'Procedure', width: '10%', sortable: false },
    { name: 'projProd', label: 'Proj', width: '5%', sortable: true },
    { name: 'reg', label: 'Reg', width: '5%', sortable: true },
    { name: 'perf', label: 'Perf', width: '5%', sortable: true },
    { name: 'actual', label: 'Actual', width: '5%', sortable: true },
    {
      name: viewAs === 'Product' ? 'paProd' : 'paProc',
      label: 'PA',
      width: '5%',
      sortable: true,
    },
    { name: 'def', label: 'Def', width: '5%', sortable: true },
    { name: 'qns', label: 'QNS', width: '5%', sortable: true },
    { name: 'ftd', label: 'FTD', width: '5%', sortable: true },
    { name: 'wo', label: 'WO', width: '5%', sortable: true },
    { name: 'void', label: 'Void', width: '5%', sortable: true },
    { name: 'status', label: 'Status', width: '5%', sortable: false },
  ];

  const sessionProj =
    viewAs === 'Product' ? selectedRow?.projProd : selectedRow?.projProc;
  let sumReg = 0;
  let sumPerf = 0;
  let sumAct = 0;
  let sumDef = 0;
  let sumQns = 0;
  let sumFtd = 0;
  let sumWo = 0;

  return (
    <div className="mainContent list-modal">
      <Modal
        size={'xl'}
        centered={true}
        show={modalOpen}
        onHide={() => {
          setModalOpen(false);
          setExpandedRow(-1);
        }}
      >
        <Modal.Header>
          <Modal.Title>
            Shift Details ({viewAs === 'Product' ? 'Procedure' : 'Product'}){' '}
            <span className={styles.viewAs} onClick={handleViewAs}>
              View As {viewAs}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="list-modal">
          <div className="table-listing-main">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    {tableHeaders.map((header) => (
                      <th key={header.name}>
                        {header.label}
                        {header.sortable && (
                          <div
                            className="sort-icon"
                            onClick={() => {
                              handleSort(header.name);
                            }}
                          >
                            <SvgComponent name={'SortIcon'} />
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shiftData.map((shift, index) => {
                    const shiftProj =
                      viewAs === 'Product' ? shift.projProd : shift.projProc;
                    const shiftPa =
                      viewAs === 'Product' ? shift.paProd : shift.paProc;
                    sumReg += shift.reg;
                    sumPerf += shift.perf;
                    sumAct += shift.actual;
                    sumDef += shift.def;
                    sumQns += shift.qns;
                    sumFtd += shift.ftd;
                    sumWo += shift.wo;
                    return (
                      <>
                        <tr key={'shifts-' + index}>
                          <td>
                            <span
                              onClick={() => {
                                if (expandedRow === index) {
                                  setExpandedRow(-1);
                                } else {
                                  setExpandedRow(index);
                                }
                              }}
                            >
                              <SvgComponent
                                name={
                                  expandedRow === index
                                    ? 'TagsMinusIcon'
                                    : 'TagsPlusIcon'
                                }
                              />{' '}
                            </span>
                            <span className={`text-center ${styles.textLink}`}>
                              Shift {shift.index}
                            </span>
                          </td>
                          <td>{formatDate(shift.date, 'MM-DD-YYYY')}</td>
                          <td>All</td>
                          <td>{handleNaN(shiftProj)}</td>
                          <td>{handleNaN(shift.reg)}</td>
                          <td>{handleNaN(shift.perf)}</td>
                          <td>{handleNaN(shift.actual)}</td>
                          <td>
                            {handleNaN(shiftPa.toFixed(2))}
                            {isNaN(shiftPa.toFixed(2)) ? '' : '%'}
                          </td>
                          <td>{handleNaN(shift.def)}</td>
                          <td>{handleNaN(shift.qns)}</td>
                          <td>{handleNaN(shift.ftd)}</td>
                          <td>{handleNaN(shift.wo)}</td>
                          <td>{shift.void || 0}</td>
                          <td></td>
                        </tr>
                        {shift.projectionData.map((item, j) => {
                          const proj =
                            viewAs === 'Product'
                              ? item.projProd
                              : item.projProc;
                          const projPa =
                            viewAs === 'Product' ? item.paProd : item.paProc;
                          return (
                            <tr
                              key={'shifts-expanded-row' + j}
                              style={{
                                display: expandedRow === index ? '' : 'none',
                              }}
                            >
                              <td></td>
                              <td></td>
                              <td>{item.procedure}</td>
                              <td>{proj}</td>
                              <td>{handleNaN(item.reg)}</td>
                              <td>{handleNaN(item.perf)}</td>
                              <td>{handleNaN(item.actual)}</td>
                              <td>
                                {handleNaN(projPa.toFixed(2))}
                                {isNaN(projPa.toFixed(2)) ? '' : '%'}
                              </td>
                              <td>{handleNaN(item.def)}</td>
                              <td>{handleNaN(item.qns)}</td>
                              <td>{handleNaN(item.ftd)}</td>
                              <td>{handleNaN(item.wo)}</td>
                              <td>{handleNaN(item.void)}</td>
                              <td></td>
                            </tr>
                          );
                        })}
                      </>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td>Total</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>{handleNaN(sessionProj)}</td>
                    <td>{handleNaN(sumReg)}</td>
                    <td>{handleNaN(sumPerf)}</td>
                    <td>{handleNaN(sumAct)}</td>
                    <td>
                      {handleNaN(
                        ((parseFloat(sumAct) / sessionProj) * 100).toFixed(2)
                      )}
                      {isNaN(parseFloat(sumAct) / sessionProj) ? '' : '%'}
                    </td>
                    <td>{handleNaN(sumDef)}</td>
                    <td>{handleNaN(sumQns)}</td>
                    <td>{handleNaN(sumFtd)}</td>
                    <td>{handleNaN(sumWo)}</td>
                    <td>0</td>
                    <td>
                      <span
                        className={`badge ${
                          OperationStatus[selectedRow?.status?.toLowerCase()]
                        }`}
                      >
                        {selectedRow?.status}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Header>
          <Modal.Title>Hourly Donor Flow</Modal.Title>
        </Modal.Header>
        <Modal.Body className="list-modal">
          <div className="table-listing-main">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    {selectedRow?.donorFlow?.map((flow, indexY) => {
                      return <th key={indexY}>H{flow.hour + 1}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {selectedRow?.donorFlow?.map((flow, indexZ) => {
                      return <td key={indexZ}>{flow.value}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="buttons d-flex align-items-center justify-content-end mt-4">
            <button
              className="btn btn-primary scheduleBtn"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
