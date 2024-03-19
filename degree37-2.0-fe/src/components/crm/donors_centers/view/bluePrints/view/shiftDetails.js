import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import '../index.scss';
import Styles from '../index.module.scss';
import TopTabsDonorCenters from '../../../topTabsDonorCenters';
// import SvgComponent from '../../../../common/SvgComponent';
import { API } from '../../../../../../api/api-routes';
import { toast } from 'react-toastify';
import moment from 'moment';

// import { toast } from 'react-toastify';

export default function DonorBluePrintShiftDetails() {
  const { id, blueprintId } = useParams();
  const [selectedShift, setSelectedShift] = useState(1);
  const [shiftDetails, setShiftDetails] = useState([]);
  const [shiftDetailsData, setShiftDetailsData] = useState();
  const [totalProcedureQty, setTotalProcedureQty] = useState(0);
  const [totalProductQty, setTotalProductQty] = useState(0);
  const [oefToggle, setOefToggle] = useState(false);
  // const [wholeBloodToggle, setWholeBloodToggle] = useState(false);
  // const [doubleRbcToggle, setDoubleRbcToggle] = useState(false);
  const accessToken = localStorage.getItem('token');

  useEffect(() => {
    const getShiftDetails = async () => {
      const { data } = await API.crm.donorCenter.getShiftDetails(
        blueprintId,
        accessToken
      );
      if (data?.status_code === 201) {
        setShiftDetails(data?.data[0]?.shifts);
      } else {
        toast.error(`Error in fetching`, { autoClose: 3000 });
      }
    };
    getShiftDetails();
  }, [blueprintId]);

  useEffect(() => {
    setShiftDetailsData(shiftDetails[selectedShift - 1]);
  }, [selectedShift, shiftDetails]);

  useEffect(() => {
    let procedureQtyTotal = 0;
    let productQtyTotal = 0;

    if (shiftDetailsData && shiftDetailsData.shifts_projections_staff) {
      shiftDetailsData.shifts_projections_staff.forEach((staffItem, index) => {
        if (staffItem && index < shiftDetailsData.products.length) {
          procedureQtyTotal += staffItem.procedure_type_qty || 0;
          productQtyTotal += staffItem.product_qty || 0;
        }
      });
    }
    setTotalProcedureQty(procedureQtyTotal);
    setTotalProductQty(productQtyTotal);
  }, [shiftDetailsData]);

  const BreadcrumbsData = [
    {
      label: 'CRM',
      class: 'disable-label',
      link: `/`,
    },
    {
      label: 'Donor Centers',
      class: 'disable-label',
      link: `/crm/donor_center`,
    },
    {
      label: 'View Donors Center',
      class: 'active-label',
      link: `/crm/donor_center/${id}`,
    },
    {
      label: 'Blueprints',
      class: 'disable-label',
      link: `/crm/donor-centers/${id}/blueprints`,
    },
    {
      label: 'View Blueprints',
      class: 'active-label',
      link: `/crm/donor-centers/${id}/blueprints/${blueprintId}/view`,
    },
    {
      label: 'Shift Details',
      class: 'active-label',
      link: `/crm/donor-centers/${id}/blueprints/${blueprintId}/shiftDetails`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Blueprints'}
      />
      <TopTabsDonorCenters
        donorCenterId={id}
        bluePrintId={blueprintId}
        editIcon={true}
      />
      <div className="mainContentInner">
        <div className="filterBar p-0 mb-3">
          <div className="flex justify-content-between tabs mb-0 position-relative">
            <div className="border-0">
              <ul>
                <li>
                  <Link
                    to={`/crm/donor-centers/${id}/blueprints/${blueprintId}/view`}
                    className=""
                  >
                    Details
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/crm/donor-centers/${id}/blueprints/${blueprintId}/shiftDetails`}
                    className="active"
                  >
                    Shift Details
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/crm/donor-centers/${id}/blueprints/${blueprintId}/donorSchedules`}
                    className=""
                  >
                    Donor Schedules
                  </Link>
                </li>
              </ul>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <h5
                className="text m-0 p-0 me-1"
                style={{ fontWeight: '400', fontSize: 20 }}
              >
                Shift
              </h5>
              {shiftDetails?.map((entry, index) => (
                <button
                  key={index}
                  style={{ marginLeft: '0.5rem' }}
                  className={
                    index === selectedShift - 1
                      ? Styles.pageCardactive
                      : Styles.pageCard
                  }
                  onClick={() => {
                    if (index === selectedShift - 1) return;
                    setSelectedShift(index + 1);
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="tableView blueprintView">
          <div className="row">
            <div className="col-md-6">
              <div className="tableViewInner test">
                <div className="group">
                  <div className="group-head">
                    <h2>Shift Details</h2>
                  </div>
                  <div className="group-body">
                    <ul>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          Start Time
                        </span>
                        <span className="right-data">
                          {shiftDetailsData?.start_time
                            ? moment(shiftDetailsData?.start_time)
                                .local()
                                .format('hh:mm A')
                            : 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          End Time
                        </span>
                        <span className="right-data">
                          {shiftDetailsData?.end_time
                            ? moment(shiftDetailsData?.end_time)
                                .local()
                                .format('hh:mm A')
                            : 'N/A'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="group">
                  <div className="group-head">
                    <h2>Projection(s)</h2>
                  </div>
                  <div className="group-body">
                    <div className="shift-title">
                      <ul>
                        <li className="shift-span">
                          <span>&nbsp;</span>
                          <span className="left-shift">Procedure</span>
                          <span className="right-shift">Products</span>
                          <span className="shift-icon"></span>
                        </li>
                        {shiftDetailsData?.products?.map(
                          (productItem, index) => (
                            <li key={index} className="shift-span">
                              <span>{productItem?.name}</span>
                              {shiftDetailsData?.shifts_projections_staff &&
                                shiftDetailsData.shifts_projections_staff[
                                  index
                                ] && (
                                  <>
                                    <span className="left-shift">
                                      {
                                        shiftDetailsData
                                          .shifts_projections_staff[index]
                                          ?.procedure_type_qty
                                      }
                                    </span>
                                    <span className="right-shift">
                                      {
                                        shiftDetailsData
                                          .shifts_projections_staff[index]
                                          ?.product_qty
                                      }
                                    </span>
                                  </>
                                )}
                              <span
                                className="shift-icon"
                                style={{ cursor: 'pointer' }}
                              ></span>
                            </li>
                          )
                        )}

                        {/* <li className="shift-span">
                          <span>Whole Blood</span>
                          <span className="left-shift">20</span>
                          <span className="right-shift">15</span>
                          <span
                            className="shift-icon"
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              setWholeBloodToggle(!wholeBloodToggle)
                            }
                          >
                            <SvgComponent
                              name={
                                wholeBloodToggle
                                  ? 'TagsMinusIcon'
                                  : 'TagsPlusIcon'
                              }
                            />
                          </span>
                        </li> */}
                        {/* <li className="shift-span">
                          <span>Double RBC</span>
                          <span className="left-shift">15</span>
                          <span className="right-shift">20</span>
                          <span
                            onClick={() => setDoubleRbcToggle(!doubleRbcToggle)}
                            style={{ cursor: 'pointer' }}
                            className="shift-icon"
                          >
                            <SvgComponent
                              name={
                                doubleRbcToggle
                                  ? 'TagsMinusIcon'
                                  : 'TagsPlusIcon'
                              }
                            />
                          </span>
                        </li> */}
                        {/* <li className="shift-span">
                          <span>Platelets</span>
                          <span className="left-shift">5</span>
                          <span className="right-shift">20</span>
                          <span
                            className="shift-icon"
                            style={{ cursor: 'pointer' }}
                          >
                            <SvgComponent name={'TagsPlusIcon'} />
                          </span>
                        </li> */}
                        <li className="shift-span">
                          <span>
                            <strong>Total</strong>
                          </span>
                          <span className="left-shift">
                            <strong>{totalProcedureQty}</strong>
                          </span>
                          <span className="right-shift">
                            <strong>{totalProductQty}</strong>
                          </span>
                          <span className="shift-icon"></span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="group">
                  <div className="group-head">
                    <div className="d-flex align-items-center justify-between w-100">
                      <h2>Operational Efficiency Factor (OEF)</h2>
                      <button
                        onClick={() => setOefToggle(!oefToggle)}
                        className="btn btn-link btn-md bg-transparent"
                      >
                        {oefToggle ? 'View As Products' : 'View As Procedures'}
                      </button>
                    </div>
                  </div>
                  <div className="group-body">
                    <ul>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          {oefToggle ? 'OEF (Procedures)' : 'OEF (Products)'}
                        </span>
                        <span className="right-data">
                          {oefToggle
                            ? shiftDetailsData?.oef_procedures
                              ? shiftDetailsData?.oef_procedures
                              : 'N/A'
                            : shiftDetailsData?.oef_products
                            ? shiftDetailsData?.oef_products
                            : 'N/A'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tableViewInner test">
                <div className="group">
                  <div className="group-head">
                    <h2>Resources</h2>
                  </div>
                  <div className="group-body">
                    <ul>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          Staff Setup
                        </span>
                        <span className="right-data">
                          {shiftDetailsData?.staff_setup?.length
                            ? shiftDetailsData?.staff_setup?.map(
                                (item, index) => (
                                  <>
                                    {item?.name}
                                    {index !==
                                    shiftDetailsData?.staff_setup?.length - 1
                                      ? ', '
                                      : ''}
                                  </>
                                )
                              )
                            : 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          Vehicles
                        </span>
                        <span className="right-data">
                          {shiftDetailsData?.vehicle?.length
                            ? shiftDetailsData?.vehicle?.map((item, index) => (
                                <>
                                  {item?.name}
                                  {index !==
                                  shiftDetailsData?.vehicle?.length - 1
                                    ? ', '
                                    : ''}
                                </>
                              ))
                            : 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          Devices
                        </span>
                        <span className="right-data">
                          {shiftDetailsData?.device?.length
                            ? shiftDetailsData?.device?.map((item, index) => (
                                <>
                                  {item?.name}
                                  {index !==
                                  shiftDetailsData?.device?.length - 1
                                    ? ', '
                                    : ''}
                                </>
                              ))
                            : 'N/A'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="group">
                  <div className="group-head">
                    <h2>Staff Break</h2>
                  </div>
                  <div className="group-body">
                    <ul>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          Start Time
                        </span>
                        <span className="right-data">
                          {shiftDetailsData?.break_start_time
                            ? moment(shiftDetailsData?.break_start_time)
                                .local()
                                .format('hh:mm A')
                            : 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          End Time
                        </span>
                        <span className="right-data">
                          {shiftDetailsData?.break_end_time
                            ? moment(shiftDetailsData?.break_end_time)
                                .local()
                                .format('hh:mm A')
                            : 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          Reduce Slots
                        </span>
                        <span className="right-data">
                          {shiftDetailsData?.reduce_slots ? 'Yes' : 'No'}
                        </span>
                      </li>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          Appointment Reduction
                        </span>
                        <span className="right-data">
                          {shiftDetailsData?.reduction_percentage
                            ? `${shiftDetailsData?.reduction_percentage}%`
                            : 'N/A'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
