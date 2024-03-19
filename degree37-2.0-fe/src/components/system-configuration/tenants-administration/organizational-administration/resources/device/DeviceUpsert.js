import React, { useState, useEffect } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import styles from './device.module.scss';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import SuccessPopUpModal from '../../../../../common/successModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';

const DeviceUpsert = () => {
  const { id: deviceId } = useParams();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [id, setId] = useState('');
  const [deviceName, setDeviceName] = useState();
  const [shortName, setShortName] = useState();
  const [collectionOperation, setCollectionOperation] = useState(null);
  const [deviceType, setDeviceType] = useState(null);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [successModalPopUp, setSuccessModalPopUp] = useState(false);
  const [successUpdateModalPopUp, setSuccessUpdateModalPopUp] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [archivedStatus, setArchivedStatus] = useState(false);
  const bearerToken = localStorage.getItem('token');
  const [createdBy, setCreatedBy] = useState();
  const [redirectToMainScreen, setRedirectToMainScreen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    deviceName: '',
    short_name: '',
    device_type: '',
  });

  const handleCancelClick = () => {
    if (unsavedChanges) {
      setShowConfirmationDialog(true);
    } else {
      navigate(
        '/system-configuration/tenant-admin/organization-admin/resources/devices'
      );
    }
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(
        '/system-configuration/tenant-admin/organization-admin/resources/devices'
      );
    }
  };

  const [deviceTypeData, setDeviceTypeData] = useState([]);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  useEffect(() => {
    fetchDeviceTypes();
    fetchCollectionOperations();
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }

    if (deviceId) {
      fetchDeviceData();
    }
  }, []);

  const fetchDeviceData = async () => {
    const result = await fetch(`${BASE_URL}/devices/${deviceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setDeviceData(data);
    } else {
      toast.error('Error Fetching Device Details', { autoClose: 3000 });
    }
  };

  const fetchDeviceTypes = async () => {
    const result = await fetch(
      `${BASE_URL}/system-configuration/device-type?fetchAll=true&status=true`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setDeviceTypeData(data);
    } else {
      toast.error('Error Fetching Devices', { autoClose: 3000 });
    }
  };

  const fetchCollectionOperations = async () => {
    const result = await fetch(
      `${BASE_URL}/business_units/collection_operations/list?status=true`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          method: 'GET',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setCollectionOperationData(data);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  const setDeviceData = (data) => {
    setDeviceName(data?.name);
    setShortName(data?.short_name);
    setCollectionOperation({
      label: data?.collection_operation.name,
      value: data?.collection_operation.id,
    });
    setDeviceType({
      label: data?.device_type.name,
      value: data?.device_type.id,
    });
    setDescription(data?.description);
    setIsActive(data?.status);
    setCreatedBy(data?.created_by?.id);
  };

  const validationSchema = yup.object({
    short_name: yup
      .string()
      .matches(/^[0-9\s\S]+$/, 'Invalid Name. Only alphabets are allowed.')
      .min(1, 'Short name is required.')
      .max(10, 'Short name is too long, Only 10 alphabets are allowed.')
      .required('Short name is required.'),
    name: yup
      .string()
      .matches(/^[0-9\s\S]+$/, 'Invalid Name. Only alphabets are allowed.')
      .min(1, 'Name is required.')
      .max(20, 'Name is too long, Only 20 alphabets are allowed.')
      .required('Name is required.'),
    description: yup
      .string()
      .max(500, 'Description is too long, Only 500 characters are allowed.')
      .required('Description is required.'),
    device_type: yup
      .object()
      .typeError('Device type is required.')
      .required('Device type is required.')
      .label('Device Type'),
    collection_operation: yup
      .object()
      .typeError('Collection operation is required.')
      .required('Collection operation is required.')
      .label('Collection Operation'),
  });

  const handleOnBlur = async (event) => {
    const key = event.target.name;
    const value = event.target.value;
    validationSchema
      .validate({ [key]: value }, { abortEarly: false })
      .then(async () => {
        setErrors((prevErrors) => ({ ...prevErrors, [key]: '' }));
      })
      .catch((validationErrors) => {
        const newErrors = {};
        setErrors((prevErrors) => ({ ...prevErrors, [key]: '' }));
        validationErrors?.inner?.forEach((error) => {
          if (error?.path === key) newErrors[error?.path] = error.message;
        });
        setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
      });
  };
  // Function to handle form submission
  const handleSubmit = async (e, redirect = true) => {
    e.preventDefault();
    validationSchema
      .validate(
        {
          short_name: shortName,
          name: deviceName,
          device_type: deviceType,
          collection_operation: collectionOperation,
          description: description,
        },
        { abortEarly: false }
      )
      .then(async () => {
        setErrors({});
        let body = {};
        if (deviceId) {
          body = {
            name: deviceName,
            short_name: shortName,
            description: description,
            collection_operation_id: parseInt(collectionOperation?.value),
            device_type_id: parseInt(deviceType?.value),
            status: isActive,
            created_by: +createdBy,
            updated_by: +id,
          };
        } else {
          body = {
            name: deviceName,
            short_name: shortName,
            description: description,
            collection_operation_id: parseInt(collectionOperation?.value),
            device_type_id: parseInt(deviceType?.value),
            status: isActive,
            created_by: +id,
          };
        }
        try {
          setIsSubmitting(true);
          const bearerToken = localStorage.getItem('token');
          const res = await fetch(
            deviceId
              ? `${BASE_URL}/devices/${deviceId}`
              : `${BASE_URL}/devices/create`,
            {
              method: deviceId ? 'PUT' : 'POST',
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${bearerToken}`,
              },
              body: JSON.stringify(body),
            }
          );

          let resJson = await res.json();
          let { data, status, response } = resJson;

          if (resJson?.statusCode === 400) {
            toast.error(`${resJson?.message?.[0] ?? data?.response}`, {
              autoClose: 3000,
            });
            setIsSubmitting(false);
          } else if (status === 'success') {
            // Handle successful response
            deviceId
              ? setSuccessUpdateModalPopUp(true)
              : setSuccessModalPopUp(true);
            setIsSubmitting(false);
          } else if (response?.status === 400) {
            toast.error(`${data?.message?.[0] ?? data?.response}`, {
              autoClose: 3000,
            });
            setIsSubmitting(false);
            // Handle bad request
          } else {
            toast.error(`${data?.message?.[0] ?? data?.response}`, {
              autoClose: 3000,
            });
            setIsSubmitting(false);
          }
        } catch (error) {
          toast.error(`${error?.message}`, { autoClose: 3000 });
          setIsSubmitting(false);
        }
      })
      .catch((validationErrors) => {
        const newErrors = {};
        validationErrors?.inner?.forEach((error) => {
          newErrors[error?.path] = error.message;
        });
        setErrors(newErrors);
      });
  };

  const handleNameChange = (event) => {
    setUnsavedChanges(true);
    setDeviceName(event.target.value);
  };

  const handleShortNameChange = (event) => {
    setUnsavedChanges(true);
    setShortName(event.target.value);
  };

  // Function to handle changes in the "Collection Operation" select field
  const handleCollectionOperationChange = (event) => {
    setUnsavedChanges(true);
    setCollectionOperation(event.target.value);
  };

  const handleDeviceTypeChange = (event) => {
    setUnsavedChanges(true);
    setDeviceType(event.target.value);
  };

  // Function to handle changes in the "Description" textarea field
  const handleDescriptionChange = (event) => {
    setUnsavedChanges(true);
    setDescription(event.target.value);
    if (event.target.value.length >= 1) {
      setErrors((prevErrors) => ({ ...prevErrors, description: '' }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: 'Description is required.',
      }));
    }
  };

  // Function to handle changes in the "Active/Inactive" checkbox
  const handleIsActiveChange = (event) => {
    setUnsavedChanges(true);
    setIsActive(event.target.checked);
  };

  const archiveDevice = async () => {
    try {
      const bearerToken = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/devices/${deviceId}`, {
        method: 'Delete',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      let { data, status, response } = await res.json();
      if (status === 'success') {
        // Handle successful response
        setModalPopUp(false);
        setTimeout(() => {
          setArchivedStatus(true);
        }, 600);
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        // Handle bad request
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
    ...ResourcesManagementBreadCrumbsData,
    {
      label: deviceId ? 'Edit Device' : 'Create Device',
      class: 'active-label',
      link: deviceId
        ? `/system-configuration/tenant-admin/organization-admin/resources/devices/${deviceId}/edit`
        : '/system-configuration/tenant-admin/organization-admin/resources/devices/create',
    },
  ];

  return (
    <div className="h-100 position-relative">
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Devices'}
          SearchPlaceholder={null}
          SearchValue={null}
          SearchOnChange={null}
        />
        <div className="mainContentInner form-container">
          <form className={styles.device}>
            <div className="formGroup">
              <h5>{deviceId ? 'Edit Device' : 'Create Device'}</h5>

              <div className="form-field">
                <div className="field">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder=" "
                    onBlur={handleOnBlur}
                    onChange={handleNameChange}
                    value={deviceName}
                    required
                  />
                  <label>Name*</label>
                </div>
                {errors?.name && (
                  <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                    <p>{errors.name}</p>
                  </div>
                )}
              </div>

              <div className="form-field">
                <div className="field">
                  <input
                    type="text"
                    className="form-control"
                    name="short_name"
                    placeholder=" "
                    onBlur={handleOnBlur}
                    onChange={handleShortNameChange}
                    value={shortName}
                    required
                  />
                  <label>Short Name*</label>
                </div>
                {errors?.short_name && (
                  <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                    <p>{errors.short_name}</p>
                  </div>
                )}
              </div>

              <div className="form-field">
                <div className="field">
                  <SelectDropdown
                    styles={{ root: 'w-100' }}
                    placeholder={'Collection Operation*'}
                    defaultValue={collectionOperation}
                    selectedValue={collectionOperation}
                    removeDivider
                    showLabel
                    onChange={(val) => {
                      let e = {
                        target: {
                          value: val,
                        },
                      };
                      handleCollectionOperationChange(e);
                      e = {
                        target: {
                          name: 'collection_operation',
                          value: val,
                        },
                      };
                      handleOnBlur(e);
                    }}
                    options={collectionOperationData.map((item) => {
                      return {
                        label: item.name,
                        value: item.id,
                      };
                    })}
                  />
                </div>
                {errors?.collection_operation && (
                  <div
                    className={`error ${styles.collection_operation} ml-1 mt-1`}
                  >
                    <p>{errors.collection_operation}</p>
                  </div>
                )}
              </div>

              <div className="form-field">
                <div className="field">
                  <SelectDropdown
                    styles={{ root: 'w-100' }}
                    placeholder={'Device Type*'}
                    defaultValue={deviceType}
                    selectedValue={deviceType}
                    removeDivider
                    showLabel
                    onChange={(val) => {
                      let e = {
                        target: {
                          name: 'device_type',
                          value: val,
                        },
                      };
                      handleDeviceTypeChange(e);
                      e = {
                        target: {
                          name: 'device_type',
                          value: val,
                        },
                      };
                      handleOnBlur(e);
                    }}
                    options={deviceTypeData.map((item) => {
                      return {
                        label: item.name,
                        value: item.id,
                      };
                    })}
                  />
                </div>
                {errors?.device_type && (
                  <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                    <p>{errors.device_type}</p>
                  </div>
                )}
              </div>
              <div className="form-field textarea w-100">
                <div className="field">
                  <textarea
                    type="text"
                    className="form-control textarea"
                    placeholder=" "
                    name="description"
                    onBlur={handleOnBlur}
                    value={description}
                    onChange={handleDescriptionChange}
                    required
                  />
                  <label>Description*</label>
                </div>
                {errors.description && (
                  <div className="error">
                    <p>{errors.description}</p>
                  </div>
                )}
              </div>

              <div className="form-field checkbox mt-3">
                <span className="toggle-text">
                  {isActive ? 'Active' : 'Inactive'}
                </span>
                <label htmlFor="toggle" className="switch">
                  <input
                    type="checkbox"
                    id="toggle"
                    className="toggle-input"
                    name="is_active"
                    checked={isActive}
                    onChange={handleIsActiveChange}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </form>
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
      <div className="form-footer-custom">
        {deviceId ? (
          <>
            <div className="archived" onClick={() => setModalPopUp(true)}>
              Archive
            </div>
            <button className="btn btn-link" onClick={handleCancelClick}>
              Cancel
            </button>
            <button
              className="btn btn-secondary"
              onClick={(e) => {
                handleSubmit(e);
                setRedirectToMainScreen(true);
              }}
            >
              Save & Close
            </button>
            <button
              type="button"
              className={` ${`btn btn-primary`}`}
              onClick={(e) => {
                handleSubmit(e);
                setRedirectToMainScreen(false);
              }}
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-secondary  btn-border-none"
              onClick={handleCancelClick}
            >
              Cancel
            </button>

            <button
              type="button"
              className={` ${`btn btn-primary`}`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Create
            </button>
          </>
        )}
      </div>
      <SuccessPopUpModal
        title="Success!"
        message="Device created."
        modalPopUp={successModalPopUp}
        isNavigate={true}
        setModalPopUp={setSuccessModalPopUp}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resources/devices'
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message="Device updated."
        modalPopUp={successUpdateModalPopUp}
        isNavigate={true}
        setModalPopUp={setSuccessUpdateModalPopUp}
        showActionBtns={true}
        redirectPath={
          redirectToMainScreen
            ? '/system-configuration/tenant-admin/organization-admin/resources/devices'
            : ''
        }
      />
      <SuccessPopUpModal
        title="Confirmation"
        message={'Are you sure you want to archive?'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={false}
        isArchived={true}
        archived={archiveDevice}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Device is archived."
        modalPopUp={archivedStatus}
        isNavigate={true}
        setModalPopUp={setArchivedStatus}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resources/devices'
        }
      />
    </div>
  );
};

export default DeviceUpsert;
