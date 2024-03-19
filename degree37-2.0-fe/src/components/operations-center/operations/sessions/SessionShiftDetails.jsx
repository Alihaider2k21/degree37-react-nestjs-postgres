import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import SvgComponent from '../../../common/SvgComponent';
import Styles from './Session.module.scss';
// import ViewForm from '../../../common/ViewForm/index.js';
import viewimage from '../../../../assets/images/viewimage.png';
import ShiftDetail from './ShiftDetail/shiftDetail.jsx';
import Projection from './ShiftDetail/projection.jsx';
import OperationalEfficiencyFactor from './ShiftDetail/OEF.jsx';
import Resources from './ShiftDetail/resources.jsx';
import StaffBreak from './ShiftDetail/staffBreak.jsx';
import { SessionBreadCrumbs } from './SessionBreadCrumbs';
// import SessionTopTabs from './SessionTopTabs';
// import { SESSION_TASKS_PATH } from '../../../../routes/path.js';
import CheckPermission from '../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../enums/OcPermissionsEnum';
import { API } from '../../../../api/api-routes.js';
import { toast } from 'react-toastify';
import TopBar from '../../../common/topbar/index.js';
import NavigationTopBar from '../../../common/NavigationTopBar.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import SessionsNavigationTabs from './navigationTabs.jsx';

const NceShiftDetails = () => {
  const navigate = useNavigate();
  const { id: session_id } = useParams();
  const [selectedShift, setSelectedShift] = useState(1);
  const [shiftDetails, setShiftDetails] = useState([]);
  const [shiftDetailsData, setShiftDetailsData] = useState();
  const [totalProcedureQty, setTotalProcedureQty] = useState(0);
  const [totalProductQty, setTotalProductQty] = useState(0);

  const getShiftDetails = async (id) => {
    const { data } = await API.operationCenter.sessions.getShiftDetails(id);
    if (data?.status_code === 201) {
      setShiftDetails(data?.data[0]?.shifts);
    } else {
      toast.error(`Error in fetching`, { autoClose: 3000 });
    }
  };

  useEffect(() => {
    getShiftDetails(session_id);
  }, [session_id]);
  useEffect(() => {
    if (shiftDetails?.length) {
      setShiftDetailsData(shiftDetails[selectedShift - 1]);
    }
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
  return (
    <div className={Styles.DriveViewMain}>
      <div className="mainContent ">
        <TopBar
          BreadCrumbsData={SessionBreadCrumbs}
          BreadCrumbsTitle={'Shift Details'}
          SearchValue={null}
          SearchOnChange={null}
          SearchPlaceholder={null}
        />
        <div className="imageMainContent">
          <NavigationTopBar img={viewimage} data={null} />
          <div className="d-flex align-items-center justify-between">
            <SessionsNavigationTabs />
            <div className="d-flex align-items-center gap-3">
              {CheckPermission([
                Permissions.OPERATIONS_CENTER.OPERATIONS.SESSIONS.WRITE,
              ]) && (
                <button
                  className="btn btn-md btn-link p-0 editBtn"
                  color="primary"
                  onClick={() => {
                    navigate(
                      `/operations-center/operations/non-collection-events/${session_id}/edit`
                    );
                  }}
                >
                  <FontAwesomeIcon
                    className="m-1"
                    width={15}
                    height={15}
                    icon={faPenToSquare}
                  />
                  Edit Session
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bodyMainContent">
        <div className={`NotesBar border-separator pb-0`}>
          <div className="d-flex align-items-center h-100"></div>
          <div className="d-flex justify-content-end align-items-center">
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
        <div>
          <div className="row row-gap-4 ">
            <div className="col-lg-6 col-md-6">
              <ShiftDetail shiftDetailsData={shiftDetailsData} />
              <Projection
                shiftDetailsData={shiftDetailsData}
                totalProcedureQty={totalProcedureQty}
                totalProductQty={totalProductQty}
              />
              <OperationalEfficiencyFactor
                shiftDetailsData={shiftDetailsData}
              />
            </div>
            <div className="col-lg-6 col-md-6">
              <Resources shiftDetailsData={shiftDetailsData} />
              <StaffBreak shiftDetailsData={shiftDetailsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NceShiftDetails;
