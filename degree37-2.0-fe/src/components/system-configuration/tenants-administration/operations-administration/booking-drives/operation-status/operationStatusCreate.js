import React, { useEffect, useState } from 'react';
import jwt from 'jwt-decode';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import validationSchema from './OperationStatusSchema';
import OperationStatusForm from './OperationStatusForm';
import { BookingDrivesBreadCrumbsData } from '../BookingDrivesBreadCrumbsData';

const OperationStatusCreate = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [token, setToken] = useState('');
  const [eventName, setEventName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bearerToken = localStorage.getItem('token');

  const [operationStatusFormData, setOperationStatusFormData] = useState({
    operationStatusName: '',
    description: '',
    isStateDirty: false,
    readOnly: false,
    chipColor: '',
    appliesTo: [
      {
        id: 1,
        name: 'Drives',
      },
      {
        id: 2,
        name: 'Sessions',
      },
      {
        id: 3,
        name: 'NCEs',
      },
    ],
    schedulable: false,
    holdsResources: false,
    ContributeToScheduled: false,
    requiresApproval: false,
    isActive: true,
    selectedAppliesTo: [],
    createdBy: 0,
  });

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      setToken(jwtToken);
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setOperationStatusFormData((prevData) => ({
          ...prevData,
          created_by: decodeToken?.id,
        }));
      }
    }
  }, [token]);

  // Function to handle form submission
  const handleSubmit = async (formData) => {
    // Assuming you have the base URL in an environment variable named "BASE_URL"
    try {
      setIsSubmitting(true);
      const body = {
        name: formData.operationStatusName,
        applies_to: formData.selectedAppliesTo.map((item) => item.name),
        schedulable: !!formData.schedulable,
        hold_resources: !!formData.holdsResources,
        contribute_to_scheduled: !!formData.ContributeToScheduled,
        requires_approval: !!formData.requiresApproval,
        description: formData.description,
        chip_color: formData.chipColor,
        is_active: formData.isActive,
        created_by: parseInt(operationStatusFormData?.created_by),
      };
      const response = await fetch(
        `${BASE_URL}/booking-drive/operation-status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify(body),
        }
      );
      let data = await response.json();
      if (data?.status === 'success') {
        // setShowSuccessDialog(true);
        // Handle successful response
        setShowSuccessDialog(true);
        setEventName('saveAndClose');
        // toast.success(`${data.response} `, { autoClose: 3000 });
        // navigate(
        //   '/system-configuration/operations-admin/booking-drives/operation-status'
        // );
      } else if (response?.status === 400) {
        // setModalPopUp(false);
        // const error = await response.json();
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        // Handle bad request
      } else {
        // const error = await response.json();
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      }
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };
  const {
    handleSubmit: onSubmit,
    control,
    formState: { errors: formErrors, isDirty },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      selectedAppliesTo: [],
      operationStatusName: null,
      chipColor: null,
      description: null,
      isActive: true,
    },
    mode: 'onChange',
  });
  const BreadcrumbsData = [
    ...BookingDrivesBreadCrumbsData,
    {
      label: 'Create Operation Status',
      class: 'active-label',
      link: `/system-configuration/operations-admin/booking-drives/operation-status/create`,
    },
  ];

  const [errors, setErrors] = useState({});

  let isDisabled =
    operationStatusFormData.selectedAppliesTo.length > 0 &&
    operationStatusFormData.description &&
    operationStatusFormData.chipColor &&
    operationStatusFormData.operationStatusName &&
    !errors.operation_status_name &&
    !errors.description &&
    !errors.appliesTo;

  isDisabled = Boolean(isDisabled);
  return (
    <OperationStatusForm
      operationStatusFormData={operationStatusFormData}
      setOperationStatusFormData={setOperationStatusFormData}
      errors={errors}
      setErrors={setErrors}
      handleSubmit={onSubmit(handleSubmit)}
      showConfirmationDialog={showConfirmationDialog}
      setShowConfirmationDialog={setShowConfirmationDialog}
      showSuccessDialog={showSuccessDialog}
      setShowSuccessDialog={setShowSuccessDialog}
      onConfirmNavigate="/system-configuration/operations-admin/booking-drives/operation-status"
      isDisabled={isSubmitting || isDisabled}
      BreadcrumbsData={BreadcrumbsData}
      successModalMessage="Operation Status created."
      editScreen={false}
      BreadCrumbsTitle={'Operation Status'}
      control={control}
      isDirty={isDirty}
      formErrors={formErrors}
      setValue={setValue}
      getValues={getValues}
      eventName={eventName}
    />
  );
};

export default OperationStatusCreate;
