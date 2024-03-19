import React, { useState, useEffect } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './task-management.module.scss';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import SuccessPopUpModal from '../../../../../common/successModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import { BookingDrivesBreadCrumbsData } from '../BookingDrivesBreadCrumbsData';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';

const appliesToOptions = [
  {
    label: 'Accounts',
    value: 'ACCOUNTS',
  },
  {
    label: 'Locations',
    value: 'LOCATIONS',
  },
  {
    label: 'Donor Centers',
    value: 'DONORCENTERS',
  },
  {
    label: 'Donors',
    value: 'DONORS',
  },
  {
    label: 'Staff',
    value: 'STAFF',
  },
  {
    label: 'Volunteers',
    value: 'VOLUNTEERS',
  },
  {
    label: 'Drives',
    value: 'DRIVES',
  },
  {
    label: 'Sessions',
    value: 'SESSIONS',
  },
  {
    label: 'NCEs',
    value: 'NCES',
  },
];

const ownerOptions = [
  {
    label: 'Recruiters',
    value: 'RECRUITERS',
  },
  {
    label: 'Schedulers',
    value: 'SCHEDULERS',
  },
  {
    label: 'Lead Telerecruiter',
    value: 'LEADTELERECRUITER',
  },
];

const TaskManagementEdit = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [redirectToMainScreen, setRedirectToMainScreen] = useState(false);
  const { id } = useParams();
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveStatus, setArchiveStatus] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [collectionOperationError, setCollectionOperationError] = useState('');

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const bearerToken = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    task_name: '',
    task_description: '',
    task_offset: '',
    task_applies_to: null,
    task_owner: null,
  });

  const [errors, setErrors] = useState({
    task_description: '',
    task_name: '',
    task_offset: '',
    task_applies_to: '',
    task_owner: '',
  });
  useEffect(() => {
    getCollectionOperations();
  }, []);

  const BreadcrumbsData = [
    ...BookingDrivesBreadCrumbsData,
    {
      label: 'Edit Task',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list`,
    },
  ];

  useEffect(() => {
    getCollectionOperations();
    const getData = async (id) => {
      if (id) {
        const result = await fetch(`${BASE_URL}/booking-drive/task/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        });
        let { data } = await result.json();
        if (result.ok || result.status_code === 200) {
          setFormData({
            ...formData,
            task_name: data.name,
            task_offset: data.offset,
            task_description: data.description,

            task_applies_to: {
              label: data.applies_to,
              value: data.applies_to,
            },

            task_owner: {
              label: data.owner,
              value: data.owner,
            },
            task_collection_operation: {
              label: data.collection_operation,
              value: data.collection_operation,
            },
          });
          setCollectionOperation(
            data?.collection_operations_data?.map((co) => {
              return {
                name: co?.collection_operation_id?.name,
                id: co?.collection_operation_id?.id,
              };
            })
          );
          setIsActive(data.is_active);

          //toast.success(message, { autoClose: 3000 })
        } else {
          toast.error('Error Fetching Task Details', {
            autoClose: 3000,
          });
        }
      } else {
        toast.error('Error getting Task Details', { autoClose: 3000 });
      }
    };
    if (id) {
      getData(id);
    }

    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [id, BASE_URL]);

  function compareNames(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  const getCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list?status=true`
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      const sortedData = data.sort(compareNames);
      setCollectionOperationData(sortedData);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  const fieldNames = [
    { label: 'Name', name: 'task_name', required: true, maxLength: 50 },
    {
      label: 'Description',
      name: 'task_description',
      required: true,
      maxLength: 500,
    },
    { label: 'Offset', name: 'task_offset', required: true, maxLength: 10 },
    {
      label: 'Applies to',
      name: 'task_applies_to',
      required: true,
      maxLength: 50,
    },
    { label: 'Owner', name: 'task_owner', required: true },
    {
      label: 'Collection Operation ',
      name: 'task_collection_operation',
      required: true,
    },
  ];
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    fieldNames.forEach((fieldName) => {
      const value = formData[fieldName.name];
      const fieldDefinition = fieldNames.find(
        (field) => field.name === fieldName.name
      );
      let errorMessage = '';

      if (
        (fieldDefinition?.required && value === null) ||
        (fieldDefinition?.required && value.toString().trim() === '')
      ) {
        errorMessage = `${fieldDefinition.label} is required.`;
      }

      if (
        fieldDefinition?.maxLength &&
        value?.length > fieldDefinition?.maxLength
      ) {
        errorMessage = `Maximum ${fieldDefinition.maxLength} characters are allowed.`;
      }

      if (errorMessage === '') {
        newErrors[fieldName.name] = '';
      } else {
        newErrors[fieldName.name] = errorMessage;
        isValid = false;
      }
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));

    return isValid;
  };

  const handleInputChange = (e) => {
    setUnsavedChanges(true);
    const { name, value } = e.target;
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });

    let errorMessage = '';

    const fieldDefinition = fieldNames.find((field) => field.name === name);

    if (
      (fieldDefinition?.required && value === null) ||
      (fieldDefinition?.required && value.trim() === '')
    ) {
      errorMessage = `${fieldDefinition.label} is required.`;
    }

    if (
      fieldDefinition?.maxLength &&
      value?.length > fieldDefinition?.maxLength
    ) {
      errorMessage = `Maximum ${fieldDefinition.maxLength} characters are allowed`;
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMsg,
      }));
    };
    setError(name, errorMessage);
  };

  const handleDropDownChange = async (name, theValue) => {
    setUnsavedChanges(true);
    setFormData({
      ...formData,
      [name]: theValue ? { label: theValue, value: theValue } : null,
    });
    setErrors({ ...errors, [name]: '' });
  };

  const saveChanges = async (e) => {
    await handleSubmit(e, false);
    setRedirectToMainScreen(true);
  };

  const handleCancelClick = () => {
    if (unsavedChanges) {
      setShowConfirmationDialog(true);
    } else {
      navigate(
        '/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list'
      );
    }
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(
        '/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list'
      );
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Assuming you have the base URL in an environment variable named "BASE_URL"

    const isValid = validateForm();
    if (!(collectionOperation?.length > 0)) {
      setCollectionOperationError('Collection Operation is required.');
      return;
    }

    if (isValid) {
      try {
        const body = {
          name: formData.task_name,
          description: formData.task_description,
          offset: Number(formData.task_offset),
          owner: formData.task_owner.label,
          applies_to: formData.task_applies_to.label,
          is_active: isActive,
          collection_operation: formData.task_collection_operation.label,
        };

        const response = await fetch(`${BASE_URL}/booking-drive/task/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          body: JSON.stringify({
            ...body,
            collection_operation_id: collectionOperation?.map((item) =>
              parseInt(item.id)
            ),
          }),
        });
        let data = await response.json();

        if (data?.status === 'success') {
          // Handle successful response

          setShowSuccessDialog(true);
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
    }
  };
  const handleCollectionOperationChange = (collectionOperationTemp) => {
    let tempCo = [...collectionOperation];
    tempCo = tempCo.some((item) => item.id === collectionOperationTemp.id)
      ? tempCo.filter((item) => item.id !== collectionOperationTemp.id)
      : [...tempCo, collectionOperationTemp];
    if (!(tempCo?.length > 0)) {
      setCollectionOperationError('Collection Operation is required.');
    } else setCollectionOperationError('');
    setCollectionOperation(tempCo);
  };

  const handleCollectionOperationChangeAll = (data) => {
    if (!(data?.length > 0)) {
      setCollectionOperationError('Collection Operation is required.');
    } else setCollectionOperationError('');
    setCollectionOperation(data);
  };
  const collectionOperationOnBlur = () => {
    if (!(collectionOperation?.length > 0)) {
      setCollectionOperationError('Collection Operation is required.');
    } else setCollectionOperationError('');
  };
  // Function to handle changes in the "Active/Inactive" checkbox
  const handleIsActiveChange = (event) => {
    setUnsavedChanges(true);
    setIsActive(event.target.checked);
  };

  const handleArchive = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/booking-drive/task/archive/${id}`,
        {
          method: 'PATCH',
          headers: {
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const { status_code, status } = await response.json();

      if (status_code === 204 && status === 'success') {
        setModalPopUp(false);
        setTimeout(() => {
          setArchiveStatus(true);
        }, 600);
      } else {
        toast.error('Error Archiving Task', { autoClose: 3000 });
      }
    } catch (error) {
      console.error('Error archiving data:', error);
    }
    setModalPopUp(false);
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Task Management'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />

      <div className="mainContentInner form-container">
        <form className={styles.addAdminRoles}>
          <div className="formGroup">
            <h5>Edit Task</h5>

            <div className="row w-100">
              <div className="text-field form-field col-md-6">
                <div className="field">
                  <input
                    type="text"
                    className="form-control"
                    name="task_name"
                    value={formData.task_name}
                    placeholder=" "
                    onChange={(e) => {
                      const filteredValue = e.target.value.replace(/^\s+/g, '');
                      e.target.value = filteredValue;
                      handleInputChange(e);
                    }}
                    onBlur={handleInputChange}
                    required
                  />

                  <label>Name*</label>
                </div>
                {errors.task_name && (
                  <div className="error">
                    <p>{errors.task_name}</p>
                  </div>
                )}
              </div>
              <div className="text-field form-field col-md-6">
                <div className=" field">
                  <input
                    type="number"
                    className="form-control"
                    name="task_offset"
                    value={formData.task_offset}
                    placeholder=" "
                    onChange={handleInputChange}
                    required
                  />

                  <label>Offset*</label>
                </div>
                {errors.task_offset && (
                  <div className="error">
                    <p>{errors.task_offset}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="row w-100 ">
              <div className="text-field note-field form-field select-field">
                <SelectDropdown
                  placeholder={'Applies To*'}
                  defaultValue={''}
                  className="dropdown-selector"
                  removeDivider={true}
                  selectedValue={formData.task_applies_to}
                  name="task_applies_to"
                  onBlur={handleInputChange}
                  onChange={(val) => {
                    handleDropDownChange('task_applies_to', val?.label || null);
                  }}
                  options={appliesToOptions}
                  showLabel
                />

                {errors?.task_applies_to && (
                  <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                    <p>{errors.task_applies_to}</p>
                  </div>
                )}
              </div>

              <div className="text-field note-field form-field select-field">
                <SelectDropdown
                  placeholder={'Owner*'}
                  defaultValue={''}
                  className="dropdown-selector"
                  removeDivider={true}
                  selectedValue={formData.task_owner}
                  name="task_owner"
                  onBlur={handleInputChange}
                  onChange={(val) => {
                    handleDropDownChange('task_owner', val?.label || null);
                  }}
                  options={ownerOptions}
                  showLabel
                />

                {errors?.task_owner && (
                  <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                    <p>{errors.task_owner}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="row w-100 ">
              <div className="text-field note-field form-field select-field">
                <GlobalMultiSelect
                  label="Collection Operation*"
                  data={collectionOperationData}
                  selectedOptions={collectionOperation}
                  error={collectionOperationError}
                  onChange={handleCollectionOperationChange}
                  onSelectAll={handleCollectionOperationChangeAll}
                  onBlur={collectionOperationOnBlur}
                />
              </div>
            </div>

            <div className="row w-100">
              <div className="form-field textarea col-md-12 w-100">
                <div className={`field ${styles.contactroledescriptionfield}`}>
                  <textarea
                    type="text"
                    className={`form-control textarea  ${styles.textaeraPadding}  ${styles.contactrolename}`}
                    placeholder=" "
                    name="task_description"
                    value={formData.task_description}
                    onChange={(e) => {
                      const filteredValue = e.target.value.replace(/^\s+/g, '');
                      e.target.value = filteredValue;
                      handleInputChange(e);
                    }}
                    required
                  />
                  <label
                    className={`text-secondary mb-2 ${styles.descriptionLabel}`}
                  >
                    Description*
                  </label>
                </div>

                {errors.task_description && (
                  <div className="error">
                    <p>{errors.task_description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="form-field checkbox w-100">
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

        <SuccessPopUpModal
          title="Success!"
          message="Task updated."
          modalPopUp={showSuccessDialog}
          isNavigate={true}
          setModalPopUp={setShowSuccessDialog}
          showActionBtns={true}
          redirectPath={
            redirectToMainScreen
              ? '/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list'
              : ''
          }
        />
        <SuccessPopUpModal
          title="Success!"
          message="Task is archived."
          modalPopUp={archiveStatus}
          isNavigate={true}
          setModalPopUp={setArchiveStatus}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list'
          }
        />
        <SuccessPopUpModal
          title="Confirmation"
          message={'Are you sure want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={true}
          archived={handleArchive}
        />
        <div className="form-footer">
          <div
            onClick={() => {
              setModalPopUp(true);
            }}
            className="archived"
          >
            <span>Archive</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary border-0"
            onClick={handleCancelClick}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-secondary"
            onClick={saveChanges}
          >
            Save & Close
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskManagementEdit;
