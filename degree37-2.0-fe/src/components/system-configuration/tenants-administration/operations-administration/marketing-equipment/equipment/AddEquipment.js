import React, { useState, useEffect, useRef } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './equipment.module.scss';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import SuccessPopUpModal from '../../../../../common/successModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import {
  fetchData,
  makeAuthorizedApiRequest,
} from '../../../../../../helpers/Api';
import moment from 'moment';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import FormInput from '../../../../../common/form/FormInput';
import FormText from '../../../../../common/form/FormText';
import { MarketingEquipmentBreadCrumbsData } from '../MarketingEquipmentBreadCrumbsData';
import DatePicker from '../../../../../common/DatePicker';

const equipmentTypes = [
  {
    label: 'Recruitment',
    value: 'RECRUITMENT',
  },
  {
    label: 'Collections',
    value: 'COLLECTIONS',
  },
  {
    label: 'Pickup',
    value: 'PICKUP',
  },
];

const AddEquipment = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const { id } = useParams();
  const [collectionOperations, setCollectionOperations] = useState([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [redirectToMainScreen, setRedirectToMainScreen] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archivedStatus, setArchivedStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const isFirstRender = useRef(true);

  useEffect(() => {
    getCollectionOperations();
  }, []);

  const saveChanges = async (e) => {
    await handleSubmit(e, false);
    setRedirectToMainScreen(true);
  };

  const getCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list?status=true`
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setCollectionOperationData(data);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  const handleCancelClick = () => {
    if (unsavedChanges) {
      setShowConfirmationDialog(true);
    } else {
      navigate(
        '/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/list'
      );
    }
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(
        '/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/list'
      );
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      try {
        setIsSubmitting(true);
        const parsedDate = formData.equipment_retire_on
          ? moment(formData.equipment_retire_on).toDate()
          : null;
        const formattedDate = parsedDate
          ? moment(parsedDate).format('YYYY-MM-DDThh:mm:ss.000Z')
          : null;
        let body = {
          name: formData.equipment_name,
          description: formData.equipment_description,
          short_name: formData.equipment_short_name,
          is_active: isActive,
          type: formData.equipment_type.label.toUpperCase(),
          retire_on: formattedDate,
          collection_operations: collectionOperations.map((item) => item.id),
        };
        let url;
        if (id) {
          body.status = body.is_active;
          url = `${BASE_URL}/marketing-equipment/equipment/${id}`;
        } else {
          url = `${BASE_URL}/marketing-equipment/equipment`;
        }

        const response = await makeAuthorizedApiRequest(
          id ? 'PUT' : 'POST',
          url,
          JSON.stringify(body)
        );

        let data = await response.json();
        if (data?.status === 'success' || data?.status === 'Success') {
          // Handle successful response
          if (!id) {
            setRedirectToMainScreen(true);
          }

          setShowSuccessDialog(true);
          setIsSubmitting(false);
        } else if (response?.status === 400) {
          // setModalPopUp(false);
          // const error = await response.json();
          toast.error(`${data?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
          setIsSubmitting(false);
          // Handle bad request
        } else {
          // const error = await response.json();
          toast.error(`${data?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
          setIsSubmitting(false);
        }
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    const getData = async (id) => {
      if (id) {
        const result = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/marketing-equipment/equipment/${id}`
        );

        let { data, status } = await result.json();
        if ((result.ok || result.status === 200) & (status === 200)) {
          setIsActive(data.is_active);
          setCollectionOperations(
            data.collectionOperations.map((item) => {
              return {
                id: item.collection_operation_id.id,
                name: item.collection_operation_name,
              };
            })
          );
          setFormData({
            ...formData,
            equipment_name: data.name,
            equipment_type: {
              label: data.type,
              value: data.type,
            },
            equipment_collection_operations: data.collectionOperations.map(
              (item) => {
                return {
                  value: item.collection_operation_id.id,
                  label: item.collection_operation_name,
                };
              }
            ),

            equipment_retire_on: data.retire_on
              ? new Date(data.retire_on)
              : null,
            equipment_description: data.description,
            equipment_short_name: data.short_name,
          });
        } else {
          toast.error('Error Fetching Equipment Details', {
            autoClose: 3000,
          });
        }
      } else {
        toast.error('Error getting Equipment Details', { autoClose: 3000 });
      }
    };
    if (id) {
      getData(id);
    }
  }, []);

  const [formData, setFormData] = useState({
    equipment_name: '',
    equipment_short_name: '',
    equipment_description: '',
    equipment_type: null,
    equipment_retire_on: '',
    equipment_collection_operations: [],
  });

  const [errors, setErrors] = useState({
    equipment_name: '',
    equipment_short_name: '',
    equipment_description: '',
    equipment_type: '',
    equipment_collection_operations: '',
  });

  const fieldNames = [
    { label: 'Name', name: 'equipment_name', required: true, maxLength: 50 },
    {
      label: 'Short Name',
      name: 'equipment_short_name',
      required: true,
      maxLength: 50,
    },
    {
      label: 'Description',
      name: 'equipment_description',
      required: true,
      maxLength: 500,
    },
    { label: 'Type', name: 'equipment_type', required: true },
    {
      label: 'Retire on',
      name: 'equipment_retire_on',
      required: false,
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

      if (fieldDefinition?.required) {
        if (
          (typeof value === 'string' && value.trim() === '') ||
          value === null
        ) {
          errorMessage = `${fieldDefinition.label} is required.`;
        } else if (Array.isArray(value) && value?.length === 0) {
          errorMessage = `${fieldDefinition.label} is required.`;
        }
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

    if (collectionOperations.length === 0) {
      newErrors['equipment_collection_operations'] =
        'Collection Operations is required.';
      isValid = false;
    }

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

    if (fieldDefinition?.required && value.toString().trim() === '') {
      errorMessage = `${fieldDefinition.label} is required.`;
    }

    if (
      fieldDefinition?.maxLength &&
      value.length > fieldDefinition?.maxLength
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
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: theValue && { label: theValue, value: theValue },
      };
    });
    setErrors({ ...errors, [name]: '' });
  };

  const handleDateChange = async (name, theValue) => {
    setFormData({ ...formData, [name]: theValue });
    setErrors({ ...errors, [name]: '' });
  };
  const handleIsActiveChange = (event) => {
    setUnsavedChanges(true);
    setIsActive(event.target.checked);
  };
  const confirmArchive = async () => {
    try {
      const response = await fetchData(
        `/marketing-equipment/equipment/archive/${id}`,
        'PATCH'
      );
      const { status_code, status } = await response;

      if (status_code === 204 && status === 'Success') {
        setModalPopUp(false);
        setTimeout(() => {
          setArchivedStatus(true);
        }, 600);
      } else {
        toast.error('Error Archiving Equipment', { autoClose: 3000 });
      }
    } catch (error) {
      console.error('Error archiving data:', error);
    }

    setModalPopUp(false);
  };

  const handleCollectionOperationChange = (collectionOperation) => {
    isFirstRender.current = false;
    setCollectionOperations((prevSelected) =>
      prevSelected.some((item) => item.id === collectionOperation.id)
        ? prevSelected.filter((item) => item.id !== collectionOperation.id)
        : [...prevSelected, collectionOperation]
    );
  };

  useEffect(() => {
    if (!isFirstRender.current) {
      if (collectionOperations.length === 0) {
        setErrors((prevErrors) => {
          return {
            ...prevErrors,
            equipment_collection_operations:
              'Collection Operations is required.',
          };
        });
      } else {
        setErrors((prevErrors) => {
          return {
            ...prevErrors,
            equipment_collection_operations: '',
          };
        });
      }
    }
  }, [collectionOperations]);

  const handleCollectionOperationChangeAll = (data) => {
    isFirstRender.current = false;
    setCollectionOperations(data);
  };

  const BreadcrumbsData = [
    ...MarketingEquipmentBreadCrumbsData,
    {
      label: `${id ? 'Edit' : 'Create'} Equipment`,
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/create',
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Equipment'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />

      <div className="mainContentInner form-container">
        <form className={styles.addAdminRoles}>
          <div className="formGroup">
            <h5>{id ? 'Edit' : 'Create'} Equipment</h5>
            <FormInput
              label="Name"
              displayName="Name"
              name="equipment_name"
              error={errors.equipment_name}
              required
              value={formData.equipment_name}
              onChange={(e) => {
                const filteredValue = e.target.value.replace(/^\s+/g, '');
                e.target.value = filteredValue;
                handleInputChange(e);
              }}
              onBlur={handleInputChange}
            />
            <FormInput
              label="Short Name"
              displayName="Short Name"
              name="equipment_short_name"
              error={errors.equipment_short_name}
              required
              value={formData.equipment_short_name}
              onChange={(e) => {
                const filteredValue = e.target.value.replace(/^\s+/g, '');
                e.target.value = filteredValue;
                handleInputChange(e);
              }}
              onBlur={handleInputChange}
            />
            <FormText
              name="equipment_description"
              displayName="Description"
              value={formData?.equipment_description}
              error={errors?.equipment_description}
              classes={{ root: 'w-100' }}
              required
              onChange={(e) => {
                const filteredValue = e.target.value.replace(/^\s+/g, '');
                e.target.value = filteredValue;
                handleInputChange(e);
              }}
              onBlur={handleInputChange}
            />
            <SelectDropdown
              placeholder={'Type*'}
              selectedValue={formData.equipment_type}
              name="equipment_type"
              onBlur={handleInputChange}
              onChange={(val) => {
                handleDropDownChange('equipment_type', val?.label ?? null);
              }}
              options={equipmentTypes}
              removeDivider
              showLabel
              error={errors?.equipment_type}
              required
            />

            <div className="form-field">
              <div className="field">
                <div className="custom-datepicker-container">
                  <DatePicker
                    dateFormat="MM/dd/yyyy"
                    className="custom-datepicker"
                    placeholderText="Retire On"
                    selected={formData?.equipment_retire_on}
                    minDate={new Date()}
                    onBlur={handleInputChange}
                    onChange={(val) => {
                      handleDateChange('equipment_retire_on', val);
                    }}
                  />
                  {errors?.equipment_retire_on && (
                    <div className={`error ml-1`}>
                      <p>{errors.equipment_retire_on}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ width: '49%' }}>
              <GlobalMultiSelect
                label="Collection Operation*"
                data={collectionOperationData}
                selectedOptions={collectionOperations}
                error={errors.equipment_collection_operations}
                onChange={handleCollectionOperationChange}
                onSelectAll={handleCollectionOperationChangeAll}
              />
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
          title="Confirmation"
          message={'Are you sure want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={true}
          archived={confirmArchive}
        />
        <SuccessPopUpModal
          title="Success!"
          message={id ? 'Equipment updated.' : 'Equipment created.'}
          modalPopUp={showSuccessDialog}
          isNavigate={redirectToMainScreen}
          setModalPopUp={setShowSuccessDialog}
          showActionBtns={true}
          redirectPath={
            redirectToMainScreen
              ? '/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/list'
              : ''
          }
        />
        <SuccessPopUpModal
          title="Success!"
          message="Equipment is archived."
          modalPopUp={archivedStatus}
          isNavigate={true}
          setModalPopUp={setArchivedStatus}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/list'
          }
        />
        {id ? (
          <div className="form-footer">
            <div
              className="archived"
              onClick={() => {
                setModalPopUp(true);
              }}
            >
              Archive
            </div>
            <button
              type="button"
              className="btn btn-md btn-secondary border-0"
              onClick={handleCancelClick}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-md btn-secondary"
              onClick={saveChanges}
            >
              Save & Close
            </button>

            <button
              type="button"
              className="btn  btn-md btn-primary"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="form-footer">
            <button
              className="btn btn-md btn-secondary border-0"
              onClick={handleCancelClick}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Create
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEquipment;
