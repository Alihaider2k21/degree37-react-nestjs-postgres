import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode';
import { fetchData } from '../../../../../../helpers/Api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import validationSchema from './OperationStatusSchema';
import OperationStatusForm from './OperationStatusForm';
import { BookingDrivesBreadCrumbsData } from '../BookingDrivesBreadCrumbsData';

const OperationStatusEdit = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [token, setToken] = useState('');
  const [eventName, setEventName] = useState('');
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveStatus, setArchiveStatus] = useState(false);
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
    isActive: false,
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

    const fetchData = async (id) => {
      try {
        let url = `${BASE_URL}/booking-drive/operation-status/${id}`;

        const result = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        });
        let data = await result.json();
        data = data.data;

        let appliesTo = data?.applies_to.map((item) => {
          return operationStatusFormData.appliesTo.find(
            (entry) => entry.name === item
          );
        });

        setOperationStatusFormData((prevData) => ({
          ...prevData,
          operationStatusName: data?.name,
          selectedAppliesTo: appliesTo,
          description: data?.description,
          chipColor: data?.chip_color,
          schedulable: data?.schedulable,
          holdsResources: data?.hold_resources,
          requiresApproval: data?.requires_approval,
          ContributeToScheduled: data?.contribute_to_scheduled,
          isActive: data?.is_active,
        }));
      } catch (error) {
        // toast.error(`Failed to fetch report.`, { autoClose: 3000 });
      }
    };

    if (id) {
      fetchData(id);
    }
  }, [id, token, BASE_URL]);
  useEffect(() => {
    reset({ ...operationStatusFormData });
  }, [operationStatusFormData]);
  // Function to handle form submission
  const handleSubmit = async (formData, e, submitEventName) => {
    // Assuming you have the base URL in an environment variable named "BASE_URL"
    try {
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
      const bearerToken = localStorage.getItem('token');
      const response = await fetch(
        `${BASE_URL}/booking-drive/operation-status/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify(body),
        }
      );
      let data = await response.json();
      if (data?.status === 'Success' && data.status_code === 204) {
        // setShowSuccessDialog(true);
        // Handle successful response
        // toast.success(`${data.response} `, { autoClose: 3000 });
        setShowSuccessDialog(true);
        console.log(e.target.innerText == 'Save Changes');
        setEventName(
          e.target.innerText == 'Save Changes' ? 'saveClose' : 'saveAndClose'
        );
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
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const BreadcrumbsData = [
    ...BookingDrivesBreadCrumbsData,
    {
      label: 'Edit Operation Status',
      class: 'active-label',
      link: `/system-configuration/operations-admin/booking-drives/operation-status/${id}/edit`,
    },
  ];

  const [errors, setErrors] = useState({});

  let isDisabled =
    operationStatusFormData?.selectedAppliesTo?.length > 0 &&
    operationStatusFormData.description &&
    operationStatusFormData.chipColor &&
    operationStatusFormData.operationStatusName &&
    !errors.operation_status_name &&
    !errors.description &&
    !errors.appliesTo;

  isDisabled = Boolean(isDisabled);
  const handleArchive = () => {
    fetchData(`/booking-drive/operation-status/${id}`, 'PATCH')
      .then((res) => {
        setModalPopUp(false);
        setTimeout(() => {
          setArchiveStatus(true);
        }, 600);
      })
      .catch((err) => {
        console.error(err);
        setModalPopUp(false);
      });
  };
  const {
    handleSubmit: onSubmit,
    control,
    formState: { errors: formErrors, isDirty },
    setValue,
    getValues,
    reset,
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
      isDisabled={isDisabled}
      BreadcrumbsData={BreadcrumbsData}
      successModalMessage="Operation Status updated."
      editScreen={true}
      eventName={eventName}
      setModalPopUp={setModalPopUp}
      modalPopUp={modalPopUp}
      handleArchive={handleArchive}
      BreadCrumbsTitle={'Operation Status'}
      control={control}
      isDirty={isDirty}
      formErrors={formErrors}
      setValue={setValue}
      getValues={getValues}
      archiveStatus={archiveStatus}
      setArchiveStatus={setArchiveStatus}
    />
  );
};

export default OperationStatusEdit;
