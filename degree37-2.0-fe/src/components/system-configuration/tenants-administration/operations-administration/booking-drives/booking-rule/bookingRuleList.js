import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import BookingRulesForm from '../../../../../common/BookingRules/bookingRulesForm';
import { BookingDrivesBreadCrumbsData } from '../BookingDrivesBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const BookingRulesList = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [setRecords] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAuditField, setSelectedAuditField] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showExpireDuration, setShowExpireDuration] = useState(false);

  const currentLocation = location.pathname;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);

  const bearerToken = localStorage.getItem('token');

  useEffect(() => {
    // Reset for new report type
    setLimit(process.env.REACT_APP_PAGE_LIMIT ?? 10);
    setSearchText('');
    setCurrentPage(1);
    fetchData();
    fetchAllAuditFieldData();
  }, []);
  const auditFieldsList = [
    {
      name: 'Drive - Recruiter',
      id: 1,
    },
    {
      name: 'NCE - Owner',
      id: 2,
    },
    {
      name: 'Drive or Session - Appointment Slots (quantity)',
      id: 3,
    },
    {
      name: 'Drive, Session or NCE - Staff Break (yes/no)',
      id: 4,
    },
    {
      name: 'Drive or Session - Devices - add or remove from shift',
      id: 5,
    },
    {
      name: 'Drive or Session - Vehicles - add or remove from shift',
      id: 6,
    },
    {
      name: 'Drive - Open to Public - yes/no',
      id: 7,
    },
    {
      name: 'Drive, Session or NCE - Certifications add or remove from shift',
      id: 8,
    },
  ];

  const [bookingRuleFormData, setBookingRuleFormData] = useState({
    allAuditFields: [],
    isStateDirty: false,
    readOnly: true,
    selectedAuditFields: [],
    auditFieldData: [],
    thirdRailFields: {
      date: true,
      hours: true,
      staffing_setup: true,
      projection: true,
      location: true,
      status: true,
      add_field_id_list: [],
    },

    CurrentLockLeadTimeDto: {
      lead_time: '',
      effective_date: '',
    },

    ScheduleLockLeadTimeDto: {
      lead_time: '',
      effective_date: '',
    },

    MaximumDrawHoursDto: {
      hours: '',
      allow_appointment: true,
    },

    OefBlockOnDto: {
      product: true,
      procedures: true,
    },

    LocationQualificationDto: {
      drive_scheduling: true,
      expires: true,
      expiration_period: '',
    },

    sharingMaxMiles: '',
    createdBy: '',
  });

  useEffect(() => {
    fetchData();
  }, [currentPage, limit, searchText]);

  const handleAddClick = () => {
    navigate(
      '/system-configuration/operations-admin/booking-drives/booking-rule/create'
    );
  };

  const fetchData = async () => {
    try {
      let url = `${BASE_URL}/booking-drive/booking-rule/{id}`;

      if (searchText) {
        url += `&keyword=${searchText}`;
      }

      const result = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      let data = await result.json();
      data = data.data;
      setShowExpireDuration(data?.location_quali_expires);
      setBookingRuleFormData((prevData) => ({
        ...prevData,
        sharingMaxMiles: data?.sharing_max_miles,
        thirdRailFields: {
          ...prevData.thirdRailFields[0],
          date: data?.third_rail_fields_date,
          hours: data?.third_rail_fields_hours,
          location: data?.third_rail_fields_location,
          projection: data?.third_rail_fields_projection,
          staffing_setup: data?.third_rail_fields_staffing_setup,
          status: data?.third_rail_fields_,
        },

        CurrentLockLeadTimeDto: {
          ...prevData.CurrentLockLeadTimeDto[0],
          effective_date: data?.current_lock_lead_time_eff_date
            ? new Date(data?.current_lock_lead_time_eff_date)
            : '',
          lead_time: data?.current_lock_lead_time,
        },

        ScheduleLockLeadTimeDto: {
          ...prevData.ScheduleLockLeadTimeDto[0],
          effective_date: data?.schedule_lock_lead_time_eff_date
            ? new Date(data?.schedule_lock_lead_time_eff_date)
            : '',
          lead_time: data?.schedule_lock_lead_time,
        },

        MaximumDrawHoursDto: {
          ...prevData.MaximumDrawHoursDto[0],
          allow_appointment: data?.maximum_draw_hours_allow_appt,
          hours: data?.maximum_draw_hours,
        },
        OefBlockOnDto: data?.oef_block_on_procedures
          ? 'procedures'
          : data?.oef_block_on_product
          ? 'product'
          : '',

        LocationQualificationDto: {
          ...prevData.LocationQualificationDto[0],
          drive_scheduling: data?.location_quali_drive_scheduling,
          expiration_period: data?.location_quali_expiration_period,
          expires: data?.location_quali_expires,
        },
        readOnly: true,
      }));
      const extractedFields = data?.booking_rules_add_field.map((addField) => ({
        id: parseInt(addField.add_field_id),
        name: auditFieldsList.find((item) => item.id == addField.add_field_id)
          .name,
        created_at: addField.created_at,
      }));

      console.log('extractedFields', extractedFields);
      setSelectedAuditField(extractedFields || []);

      setBookingRuleFormData((prevData) => ({
        ...prevData,
        allAuditFields: auditFieldsList,
      }));

      setRecords(data?.data);
    } catch (error) {
      // toast.error(`Failed to fetch report.`, { autoClose: 3000 });
    }
  };

  const fetchAllAuditFieldData = async () => {
    try {
      setBookingRuleFormData((prevData) => ({
        ...prevData,
        allAuditFields: auditFieldsList,
      }));
    } catch (error) {
      // toast.error(`Failed to fetch report.`, { autoClose: 3000 });
    }
  };

  const BreadcrumbsData = [
    ...BookingDrivesBreadCrumbsData,
    {
      label: 'Booking Rules',
      class: 'active-label',
      link: `/system-configuration/operations-admin/booking-drives/booking-rule`,
    },
  ];

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(
        '/system-configuration/operations-admin/booking-drives/booking-rule'
      );
    }
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Booking Rules'}
      />
      <div className="filterBar">
        <div className="tabs">
          <ul>
            {CheckPermission(null, [
              Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.BOOKING_RULE
                .MODULE_CODE,
            ]) && (
              <li>
                <Link
                  to={
                    '/system-configuration/operations-admin/booking-drives/booking-rule'
                  }
                  className={
                    currentLocation ===
                    '/system-configuration/operations-admin/booking-drives/booking-rule'
                      ? 'active'
                      : ''
                  }
                >
                  Booking Rules
                </Link>
              </li>
            )}
            {CheckPermission(null, [
              Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES
                .DAILY_CAPACITY.MODULE_CODE,
            ]) && (
              <li>
                <Link
                  to={
                    '/system-configuration/operations-admin/booking-drives/daily-capacities'
                  }
                  className={
                    currentLocation ===
                    '/system-configuration/operations-admin/booking-drives/daily-capacities'
                      ? 'active'
                      : ''
                  }
                >
                  Daily Capacity
                </Link>
              </li>
            )}
            {CheckPermission(null, [
              Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.DAILY_HOURS
                .MODULE_CODE,
            ]) && (
              <li>
                <Link
                  to={
                    '/system-configuration/operations-admin/booking-drives/daily-hours'
                  }
                  className={
                    currentLocation ===
                    '/system-configuration/operations-admin/booking-drives/daily-hours'
                      ? 'active'
                      : ''
                  }
                >
                  Daily Hours
                </Link>
              </li>
            )}
            {CheckPermission(null, [
              Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES
                .OPERATION_STATUS.MODULE_CODE,
            ]) && (
              <li>
                <Link
                  to={
                    '/system-configuration/operations-admin/booking-drives/operation-status'
                  }
                  className={
                    currentLocation ===
                    '/system-configuration/operations-admin/booking-drives/operation-status'
                      ? 'active'
                      : ''
                  }
                >
                  Operation Status
                </Link>
              </li>
            )}
            {CheckPermission(null, [
              Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES
                .TASK_MANAGEMENT.MODULE_CODE,
            ]) && (
              <li>
                <Link
                  to={
                    '/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list'
                  }
                  className={
                    currentLocation ===
                    '/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list'
                      ? 'active'
                      : ''
                  }
                >
                  Task Management
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.BOOKING_RULE
            .WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Set Booking Rule
            </button>
          </div>
        )}
        <BookingRulesForm
          bookingRuleFormData={bookingRuleFormData}
          setBookingRuleFormData={setBookingRuleFormData}
          selectedAuditField={selectedAuditField}
          setSelectedAuditField={setSelectedAuditField}
          justShow={true}
          showExpireDuration={showExpireDuration}
          setShowExpireDuration={setShowExpireDuration}
        />

        {/* Confirmation Dialog */}
        <section
          className={`popup full-section ${
            showConfirmationDialog ? 'active' : ''
          }`}
        >
          <div className="popup-inner">
            <div className="icon">
              <img src={CancelIconImage} alt="CancelIcon" />
            </div>
            <div className="content">
              <h3>Confirmation</h3>
              <p>Unsaved changes will be lost. Do you want to continue?</p>
              <div className="buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleConfirmationResult(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleConfirmationResult(true)}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookingRulesList;
