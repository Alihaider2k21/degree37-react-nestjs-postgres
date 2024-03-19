import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../index.module.scss';
import '../driveView.scss';
import TopBar from '../../../../common/topbar/index';
import viewimage from '../../../../../assets/images/viewimage.png';
import NavigationTopBar from '../../../../common/NavigationTopBar';
import {
  OPERATIONS_CENTER,
  OPERATIONS_CENTER_DRIVES_PATH,
} from '../../../../../routes/path';
// import NavigationTopBar from '../../../../common/NavigationTopBar';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/OcPermissionsEnum';
import { toast } from 'react-toastify';
import DriveViewNavigationTabs from '../navigationTabs';
// import viewimage from '../../../../../assets/images/viewimage.png';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { ShiftDetails } from '../../sessions/SessionBreadCrumbs';
// import ViewForm from './ViewForm';
import ShiftDetail from './shiftDetail';
import Projection from './projection';
import Resources from './resources';
import StaffBreak from './staffBreak';
import OperationalEfficiencyFactor from './OEF';
import { API } from '../../../../../api/api-routes';
const NceShiftDetails = () => {
  const navigate = useNavigate();
  const { id, slug } = useParams();
  const [driveData, setDriveData] = useState(null);

  const [selectedShift, setSelectedShift] = useState(1);
  const [shiftDetails, setShiftDetails] = useState([]);
  const [shiftDetailsData, setShiftDetailsData] = useState();
  const [totalProcedureQty, setTotalProcedureQty] = useState(0);
  const [totalProductQty, setTotalProductQty] = useState(0);
  const breadCrumbsTitle =
    slug === 'about'
      ? 'About'
      : slug === 'shift_details'
      ? 'Shift Details'
      : slug === 'marketing_details'
      ? 'Marketing Details'
      : slug === 'tasks'
      ? 'Tasks'
      : slug === 'documents'
      ? 'Documents'
      : slug === 'change_audit'
      ? 'Change Audit'
      : slug === 'donor_schedules'
      ? 'Donor Schedules'
      : slug === 'staffing'
      ? 'Staffing'
      : slug === 'results'
      ? 'Results'
      : null;
  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'disable-label',
      link: OPERATIONS_CENTER.DASHBOARD,
    },
    {
      label: 'Operations',
      class: 'disable-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: 'Drives',
      class: 'disable-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: 'View Drive',
      class: 'active-label',
      link: `/operations-center/operations/drives/${id}/view/about`,
    },
    {
      label: 'Shift Details',
      class: 'active-label',
      link: `/operations-center/operations/drives/${id}/view/shift-details`,
    },
    // {
    //   label: breadCrumbsTitle,
    //   class: 'disable-label',
    //   link: '#',
    // },
  ];
  const getShiftDetails = async (id) => {
    const { data } = await API.operationCenter.drives.getShiftDetails(id);
    if (data?.status_code === 201) {
      setShiftDetails(data?.data[0]?.shifts);
    } else {
      toast.error(`Error in fetching`, { autoClose: 3000 });
    }
  };
  const getDriveData = async (id) => {
    const { data } = await API.operationCenter.drives.getDriveData(id);
    let drive =
      Array.isArray(data?.data) && data?.data[0] ? data?.data[0] : null;
    setDriveData(drive);
  };

  useEffect(() => {
    getDriveData(id);
    getShiftDetails(id);
  }, [id]);
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
    <div className={styles.DriveViewMain}>
      <div className="mainContent ">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={breadCrumbsTitle}
          SearchValue={null}
          SearchOnChange={null}
          SearchPlaceholder={null}
        />
        <div className="imageMainContent">
          <NavigationTopBar img={viewimage} data={driveData} />
          <div className="d-flex align-items-center justify-between">
            <DriveViewNavigationTabs />
            <div className="d-flex align-items-center gap-3">
              {CheckPermission([
                Permissions.OPERATIONS_CENTER.OPERATIONS.DRIVES.WRITE,
              ]) && (
                <button
                  className="btn btn-md btn-link p-0 editBtn"
                  color="primary"
                  onClick={() => {
                    navigate(`/operations-center/operations/drives/${id}/edit`);
                  }}
                >
                  <FontAwesomeIcon
                    className="m-1"
                    width={15}
                    height={15}
                    icon={faPenToSquare}
                  />
                  Edit Drive
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
                    ? styles.pageCardactive
                    : styles.pageCard
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
