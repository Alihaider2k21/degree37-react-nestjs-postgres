import React, { useEffect, useState } from 'react';
import styles from './task-management.module.scss';
import { Row, Col } from 'react-bootstrap';
import jwt from 'jwt-decode';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import CancelModalPopUp from '../../../../../common/cancelModal';

const schema = yup.object({
  id: yup.number().integer().required(),
  name: yup.string().required('Required'),
  description: yup.string().required(),
  offset: yup.number().integer().required(),
  owner: yup.string().required(),
  applies_to: yup.string().required(),
  is_active: yup.boolean().required(),
  created_by: yup.number().integer(),
  collection_operation: yup.number().integer().required(),
});

const appliesToOptions = [
  'Accounts',
  'Locations',
  'Donor centers',
  'Donors',
  'Staff',
  'Volunteers',
  'Drives',
  'Sessions',
  'NCEs',
];

const ownerOptions = ['Recruiters', 'Schedulers', 'Lead Telerecruiter'];

export default function TaskManagementForm({ isEdit }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  const [closeModal, setCloseModal] = useState(false);
  const [saveChanges, setSaveChanges] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [taskData, setTaskData] = useState({});
  const bearerToken = localStorage.getItem('token');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { collection_operation: 123 },
  });
  const navigate = useNavigate();
  const onSubmit = (data) => {
    isEdit ? handleEditForm(data) : handleSubmitForm(data);
    if (isEdit && saveChanges) {
      navigate(
        '/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list'
      );
    }
  };

  const getTaskbyId = async () => {
    try {
      const taskData = await fetch(`${BASE_URL}/booking-drive/task/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      const { data } = await taskData.json();
      setTaskData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditForm = async (values) => {
    try {
      const body = values;
      const response = await fetch(`${BASE_URL}/booking-drive/task/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(body),
      });
      let data = await response.json();
      if (data?.status === 'success') {
        // setShowSuccessDialog(true)
        // Handle successful response
        toast.success(`Task udated. `, { autoClose: 3000 });
        Navigate(
          '/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list'
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
      // toast.error(`${error?.message}`, { autoClose: 3000 })
    }
  };

  const handleSubmitForm = async (values) => {
    try {
      const body = values;
      const response = await fetch(`${BASE_URL}/booking-drive/task`, {
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
        // Handle successful response
        // toast.success(`Booking Rule Edit/Set `, { autoClose: 3000 });
        // Navigate(
        //   "/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list"
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
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setValue('id', decodeToken?.id);
        setValue('created_by', decodeToken?.id);
      }
    }
    getTaskbyId();
  }, []);

  useEffect(() => {
    if (isEdit) {
      setValue('applies_to', taskData?.applies_to);
      setValue('name', taskData?.name);
      setValue('description', taskData?.description);
      setValue('owner', taskData?.owner);
      setValue('offset', taskData?.offset);
      setValue('is_active', taskData?.is_active);
      setValue('created_by', taskData?.created_by);
    }
  }, [taskData]);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.taskManagement}>
        <div className={`${styles.group} ${styles['formGroup']}`}>
          <h6 style={{ fontWeight: 500 }}>
            {isEdit ? 'Edit Task' : 'Create Task'}
          </h6>
          <Row>
            <Col md={6} className="my-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                {...register('name')}
                style={
                  touchedFields.name && errors.name && { borderColor: 'red' }
                }
              />
            </Col>
            <Col md={6} className="my-3">
              <input
                type="text"
                className="form-control"
                placeholder="Offset"
                {...register('offset')}
              />
            </Col>
            <Col md={6} className="my-3">
              <select {...register('applies_to')}>
                <option>Applies to</option>
                {appliesToOptions.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </Col>
            <Col md={6} className="my-3">
              <select {...register('owner')}>
                <option value="">Owners</option>
                {ownerOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Col>
            <Col md={6} className="my-3">
              <select
                placeholder="collection_operation"
                {...register('collection_operation')}
              >
                <option value={''}>collection operation</option>
                <option value={1345}>1345</option>
              </select>
            </Col>

            <Col md={12}>
              <textarea
                style={{ borderRadius: '10px' }}
                className="w-100"
                {...register('description')}
                placeholder="Description"
              />
            </Col>
          </Row>

          <div className="form-field checkbox">
            <span style={{ color: 'black' }}>Active/Inactive</span>
            <label htmlFor="toggle" className="switch">
              <input
                type="checkbox"
                id="toggle"
                className="toggle-input"
                {...register('is_active')}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <div className="form-footer">
          <p
            onClick={() => setCloseModal(true)}
            className={styles.cancelbutton}
          >
            Cancel
          </p>
          <button
            type="submit"
            className={`btn btn-primary`}
            onClick={() => {
              if (isEdit) {
                setSaveChanges(true);
              }
            }}
          >
            {isEdit ? 'Save & Close' : 'Create'}
          </button>
          {isEdit && (
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          )}
        </div>
      </form>

      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={
          '/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list'
        }
      />
      <SuccessPopUpModal
        modalPopUp={showSuccessDialog}
        setModalPopUp={setShowSuccessDialog}
        title="Success!"
        message="Task created."
        showActionBtns
      />
    </>
  );
}
