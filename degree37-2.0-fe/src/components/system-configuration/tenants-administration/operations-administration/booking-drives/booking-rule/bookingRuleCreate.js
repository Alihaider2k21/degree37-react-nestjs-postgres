import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import SuccessConfirm from '../../../../../../assets/images/SuccessConfirm.png';

import BookingRulesForm from '../../../../../common/BookingRules/bookingRulesForm';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode';
import { useForm } from 'react-hook-form';
import { bookingRuleSchema } from './bookingRules.schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { BookingDrivesBreadCrumbsData } from '../BookingDrivesBreadCrumbsData';

const BookingRulesCreate = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [setRecords] = useState([]);
  const navigate = useNavigate();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedAuditField, setSelectedAuditField] = useState([]);
  const [token, setToken] = useState('');
  const bearerToken = localStorage.getItem('token');
  const [bookingRuleFormData, setBookingRuleFormData] = useState({
    id: 0,
    startDate: '',
    isStateDirty: false,
    readOnly: false,
    selectedAuditFields: [],
    auditFieldData: [],
    thirdRailFields: {
      date: false,
      hours: false,
      staffing_setup: false,
      projection: false,
      location: false,
      status: false,
      add_field_id_list: [],
    },

    CurrentLockLeadTimeDto: {
      lead_time: null,
      effective_date: '',
    },

    ScheduleLockLeadTimeDto: {
      lead_time: null,
      effective_date: '',
    },

    MaximumDrawHoursDto: {
      hours: null,
      allow_appointment: false,
    },

    OefBlockOnDto: {
      product: true,
      procedures: false,
    },

    LocationQualificationDto: {
      drive_scheduling: false,
      expires: true,
      expiration_period: null,
    },

    sharingMaxMiles: null,
    createdBy: 0,
  });
  const {
    handleSubmit,
    control,
    formState: { errors: formErrors, isDirty },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(bookingRuleSchema),
    mode: 'onChange',
    defaultValues: useMemo(() => bookingRuleFormData, [bookingRuleFormData]),
  });

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
  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      setToken(jwtToken);
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setBookingRuleFormData((prevData) => ({
          ...prevData,
          created_by: decodeToken?.id,
        }));
      }
    }

    fetchData();
    fetchAllAuditFieldData();
  }, []);

  const onSubmit = async (formData) => {
    try {
      let decodeToken = 0;
      if (token) {
        decodeToken = jwt(token);
        if (decodeToken?.id) {
          setBookingRuleFormData((prevData) => ({
            ...prevData,
            created_by: decodeToken?.id,
          }));
        }
      }
      const add_field_id_list = formData?.selectedAuditField
        ? {
            add_field_id_list: formData?.selectedAuditField?.map((obj) =>
              parseInt(obj.id)
            ),
          }
        : {};
      const body = {
        third_rail_fields: [
          {
            ...formData.thirdRailFields,
            ...add_field_id_list,
          },
        ],
        CurrentLockLeadTimeDto: [
          {
            ...formData.CurrentLockLeadTimeDto,
            effective_date: new Date(
              formData.CurrentLockLeadTimeDto.effective_date
            ).toISOString(),
          },
        ],
        ScheduleLockLeadTimeDto: [
          {
            ...formData.ScheduleLockLeadTimeDto,
            effective_date: new Date(
              formData.ScheduleLockLeadTimeDto.effective_date || new Date()
            ).toISOString(),
          },
        ],
        MaximumDrawHoursDto: [
          {
            ...formData.MaximumDrawHoursDto,
            hours: String(formData.MaximumDrawHoursDto.hours),
          },
        ],
        OefBlockOnDto: [
          {
            product: formData.OefBlockOnDto === 'product',
            procedures: formData.OefBlockOnDto === 'procedures',
          },
        ],
        LocationQualificationDto: [formData.LocationQualificationDto],
        sharing_max_miles: parseInt(formData.sharingMaxMiles),
        id: parseInt(formData?.id),
        created_by: parseInt(decodeToken?.id),
      };

      const response = await fetch(`${BASE_URL}/booking-drive/booking-rule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(body),
      });
      let data = await response.json();
      if (data?.status === 'success') {
        setShowSuccessDialog(true);
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const BreadcrumbsData = [
    ...BookingDrivesBreadCrumbsData,
    {
      label: 'Edit Booking Rules',
      class: 'active-label',
      link: `/system-configuration/operations-admin/booking-drives/booking-rule/create`,
    },
  ];

  const handleCancelClick = () => {
    if (isDirty) {
      setShowConfirmationDialog(true);
    } else {
      navigate(
        '/system-configuration/operations-admin/booking-drives/booking-rule'
      );
    }
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(
        '/system-configuration/operations-admin/booking-drives/booking-rule'
      );
    }
  };

  const [errors, setErrors] = useState({
    date: '',
    hours: '',
    projection: '',
    staffing_setup: '',
    location: '',
    status: '',
    audit_field_ids: '',
    lock_lead_time: '',
    lock_lead_time_set: '',
    effective_date: '',
    effective_date_set: '',
    maximum_draw_hours: '',
    expiration_period: '',
    maximum_hours: '',
  });

  const fetchData = async () => {
    try {
      let url = `${BASE_URL}/booking-drive/booking-rule/{id}`;

      const result = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      let data = await result.json();

      if (!data?.data) {
        throw new Error('No data');
      }
      data = data.data;
      const extractedFields = data?.booking_rules_add_field.map((addField) => ({
        id: parseInt(addField.add_field_id),
        name: auditFieldsList.find((item) => item.id == addField.add_field_id)
          .name,
        created_at: addField.created_at,
      }));
      reset({
        ...bookingRuleFormData,
        selectedAuditField: extractedFields || [],
        sharingMaxMiles: data?.sharing_max_miles,
        id: data.id,
        thirdRailFields: {
          date: data.third_rail_fields_date,
          hours: data.third_rail_fields_hours,
          location: data.third_rail_fields_location,
          projection: data.third_rail_fields_projection,
          staffing_setup: data.third_rail_fields_staffing_setup,
          status: data.third_rail_fields_,
          // status: data.thirdRailFields.status,
          add_field_id_list: extractedFields.map((data) => parseInt(data.id)),
        },

        CurrentLockLeadTimeDto: {
          effective_date: new Date(data.current_lock_lead_time_eff_date),
          lead_time: data.current_lock_lead_time,
        },

        ScheduleLockLeadTimeDto: {
          effective_date: new Date(data.schedule_lock_lead_time_eff_date),
          lead_time: data.schedule_lock_lead_time,
        },

        MaximumDrawHoursDto: {
          allow_appointment: data.maximum_draw_hours_allow_appt,
          hours: data.maximum_draw_hours,
        },

        OefBlockOnDto: data?.oef_block_on_procedures
          ? 'procedures'
          : data?.oef_block_on_product
          ? 'product'
          : '',
        LocationQualificationDto: {
          drive_scheduling: data.location_quali_drive_scheduling,
          expiration_period: data.location_quali_expiration_period,
          expires: data.location_quali_expires,
        },
      });

      setSelectedAuditField(extractedFields || []);
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

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Booking Rules'}
      />

      <div className="mainContentInner">
        <BookingRulesForm
          bookingRuleFormData={bookingRuleFormData}
          setBookingRuleFormData={setBookingRuleFormData}
          errors={errors}
          setErrors={setErrors}
          selectedAuditField={selectedAuditField}
          setSelectedAuditField={setSelectedAuditField}
          control={control}
          error={formErrors}
          getValues={getValues}
          setValue={setValue}
          watch={watch}
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

        {/* Confirmation Dialog */}
        <section
          className={`popup full-section ${showSuccessDialog ? 'active' : ''}`}
        >
          <div className="popup-inner">
            <div className="icon">
              <img src={SuccessConfirm} alt="SuccessIcon" />
            </div>
            <div className="content">
              <h3>Success!</h3>
              <p>Set/Edit Booking Rule</p>
              <div className="buttons">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => handleConfirmationResult(true)}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="form-footer">
          <button
            className="btn btn-secondary border-0"
            onClick={handleCancelClick}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={false}
            onClick={handleSubmit(onSubmit)}
            className={`btn btn-primary`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingRulesCreate;
