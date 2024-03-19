import React, { useState, useEffect } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './equipment.module.scss';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import SuccessPopUpModal from '../../../../../common/successModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import MultiSelectDropdown from '../../../../../common/mutliSelectDropdown';
import DatePicker from 'react-datepicker';
import { MarketingEquipmentBreadCrumbsData } from '../MarketingEquipmentBreadCrumbsData';

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

const EquipmentEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentShortName, setEquipmentShortName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [retireOnDate, setRetireOnDate] = useState('');
  const [collectionOperations, setCollectionOperations] = useState([]);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState('');

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [redirectToMainScreen, setRedirectToMainScreen] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [errors, setErrors] = useState({
    equipment_description: '',
    equipment_name: '',
    equipment_short_name: '',
    equipment_type: '',
    equipment_retire_on: '',
  });

  useEffect(() => {
    getCollectionOperations();
    const getData = async (id) => {
      if (id) {
        const result = await fetch(
          `${BASE_URL}/marketing-equipment/equipment/${id}`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        let { data, status } = await result.json();
        if ((result.ok || result.status === 200) & (status === 200)) {
          console.log('data', data);
          setEquipmentName(data.name);
          setEquipmentShortName(data.short_name);
          setDescription(data.description);
          setIsActive(data.is_active);
          setRetireOnDate(data?.retire_on ? new Date(data.retire_on) : '');
          setSelectedEquipmentType({
            label:
              data.type.toLowerCase().charAt(0).toUpperCase() +
              data.type.toLowerCase().slice(1),
            value: data.type,
          });

          setCollectionOperations(
            data.collectionOperations.map((item) => {
              return {
                label: item.collection_operation_name,
                value: item.collection_operation_id?.id,
              };
            })
          );

          //toast.success(message, { autoClose: 3000 })
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

  const handleOnBlur = async (key, value) => {
    if (!value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: `${(key.charAt(0).toUpperCase() + key.slice(1)).replace(
          /_/g,
          ' '
        )} is required.`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: '',
      }));
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
  const handleCollectionOperationChange = (selected) => {
    handleOnBlur('collection_operations', selected.length);
    !selected.length
      ? setCollectionOperations([])
      : setCollectionOperations(selected);
  };

  // Function to handle form submission
  const handleSubmit = async (e, showToast = true) => {
    e.preventDefault();

    // Assuming you have the base URL in an environment variable named "BASE_URL"

    try {
      const body = {
        name: equipmentName,
        description: description,
        short_name: equipmentShortName,
        status: isActive,
        type: selectedEquipmentType.value,
        retire_on: retireOnDate,
        collection_operations: collectionOperations.map((item) => item.value),
      };
      console.log(body);
      const response = await fetch(
        `${BASE_URL}/marketing-equipment/equipment/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          body: JSON.stringify(body),
        }
      );
      let data = await response.json();
      console.log(data);
      if (data?.status === 'Success') {
        // Handle successful response
        //toast.success(data?.message, { autoClose: 3000 })

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
  };

  const handleNameChange = (event) => {
    setUnsavedChanges(true);
    setEquipmentName(event.target.value);
  };

  const handleShortNameChange = (event) => {
    setUnsavedChanges(true);
    setEquipmentShortName(event.target.value);
  };
  const saveChanges = async (e) => {
    await handleSubmit(e, false);
    setRedirectToMainScreen(true);
  };

  // Function to handle changes in the "Description" textarea field
  const handleDescriptionChange = (event) => {
    setUnsavedChanges(true);
    setDescription(event.target.value);
  };

  // Function to handle changes in the "Active/Inactive" checkbox
  const handleIsActiveChange = (event) => {
    setUnsavedChanges(true);
    setIsActive(event.target.checked);
  };

  const handleInputBlur = (e, config_name = null, state_name = null) => {
    setUnsavedChanges(true);
    const { name, value } = e.target;
    let errorMessage = '';

    if (value.trim() === '') {
      errorMessage = 'Required';
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    switch (name) {
      case 'equipment_name':
        if (value.length > 50) {
          setError(name, 'Maximum 50 characters are allowed');
        } else {
          setError(name, errorMessage);
        }
        break;
      case 'equipment_short_name':
        if (value.length > 50) {
          setError(name, 'Maximum 50 characters are allowed');
        } else {
          setError(name, errorMessage);
        }
        break;
      case 'description':
        if (!value) {
          setError('description', errorMessage);
        } else {
          setError('description', '');
        }
        break;

      default:
        setError(name, errorMessage);
        break;
    }
  };

  let isDisabled =
    equipmentName &&
    description &&
    equipmentShortName &&
    !errors.equipment_short_name &&
    !errors.equipment_name &&
    !errors.description &&
    retireOnDate &&
    !errors.equipment_retire_on &&
    selectedEquipmentType &&
    !errors.type &&
    collectionOperations.length > 0 &&
    !errors.collection_operations;

  isDisabled = Boolean(isDisabled);

  const BreadcrumbsData = [
    ...MarketingEquipmentBreadCrumbsData,
    {
      label: 'Edit Equipment',
      class: 'disable-label',
      link: `system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/edit/${id}`,
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
            <h5>Edit Equipment</h5>

            <div className="row w-100">
              <div className="text-field form-field col-md-6">
                <div className="field">
                  <input
                    type="text"
                    className="form-control"
                    name="equipment_name"
                    placeholder=" "
                    value={equipmentName}
                    onChange={handleNameChange}
                    onBlur={handleInputBlur}
                    required
                  />

                  <label>Name</label>
                </div>
                {errors.equipment_name && (
                  <div className="error">
                    <p>{errors.equipment_name}</p>
                  </div>
                )}
              </div>
              <div className="text-field form-field col-md-6">
                <div className="field">
                  <input
                    type="text"
                    className="form-control"
                    name="equipment_short_name"
                    placeholder=" "
                    value={equipmentShortName}
                    onChange={handleShortNameChange}
                    onBlur={handleInputBlur}
                    required
                  />

                  <label>Short Name</label>
                </div>
                {errors.equipment_short_name && (
                  <div className="error">
                    <p>{errors.equipment_short_name}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="row w-100">
              <div className="form-field textarea col-md-12 w-100">
                <div className={`field ${styles.contactroledescriptionfield}`}>
                  <textarea
                    type="text"
                    className={`form-control textarea  ${styles.textaeraPadding}  ${styles.contactrolename}`}
                    placeholder=" "
                    name="description"
                    value={description}
                    onBlur={handleInputBlur}
                    onChange={handleDescriptionChange}
                    required
                  />
                  <label
                    className={`text-secondary mb-2 ${styles.descriptionLabel}`}
                  >
                    Description*
                  </label>
                </div>
                <br />
                {errors.equipment_description && (
                  <div className="error">
                    <p>{errors.equipment_description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="row w-100">
              <div className="text-field note-field form-field">
                <SelectDropdown
                  placeholder={'Type*'}
                  defaultValue={''}
                  className="dropdown-selector"
                  removeDivider={true}
                  removeTheCursor={true}
                  removeTheClearCross={true}
                  selectedValue={selectedEquipmentType}
                  onBlur={(e) =>
                    handleOnBlur('equipment_type', selectedEquipmentType)
                  }
                  name="equipment_type"
                  onChange={(val) => {
                    setSelectedEquipmentType(val);
                    console.log(selectedEquipmentType);
                    handleOnBlur('equipment_type', selectedEquipmentType);
                  }}
                  options={equipmentTypes}
                />

                {errors?.equipment_type && (
                  <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                    <p>{errors.equipment_type}</p>
                  </div>
                )}
              </div>

              <div className="text-field form-field ">
                <div className="field">
                  <DatePicker
                    dateFormat="MM/dd/yyyy"
                    className=" custom-datepicker "
                    placeholderText="Retire On"
                    selected={retireOnDate}
                    minDate={new Date()}
                    onBlur={(e) =>
                      handleOnBlur('equipment_retire_on', e.target.value)
                    }
                    onChange={(date) => {
                      handleOnBlur('equipment_retire_on', date);
                      setRetireOnDate(date);
                    }}
                  />
                </div>
                {errors?.equipment_retire_on && (
                  <div className={`error ml-1`}>
                    <p>{errors.equipment_retire_on}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="row w-100">
              <div className="text-field form-field col-md-6">
                <div className="field">
                  {collectionOperations.length ? (
                    <label
                      style={{
                        fontSize: '12px',
                        top: '24%',
                        color: '#555555',
                        zIndex: 1,
                      }}
                    >
                      Collection Operation*
                    </label>
                  ) : (
                    ''
                  )}

                  <MultiSelectDropdown
                    options={collectionOperationData?.map(
                      (collectionOperationItem) => {
                        return {
                          value: collectionOperationItem.id,
                          label: collectionOperationItem.name,
                          is_active: true,
                        };
                      }
                    )}
                    key={2}
                    selected={collectionOperations}
                    onChange={handleCollectionOperationChange}
                    placeholder="Collection Operation*"
                  />

                  {errors?.collection_operations && (
                    <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                      <p>{errors.collection_operations}</p>
                    </div>
                  )}
                </div>
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
                  className="btn btn-md btn-secondary"
                  onClick={() => handleConfirmationResult(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-md btn-primary"
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
          message="Equipment updated."
          modalPopUp={showSuccessDialog}
          isNavigate={true}
          setModalPopUp={setShowSuccessDialog}
          showActionBtns={true}
          redirectPath={
            redirectToMainScreen
              ? '/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/list'
              : ''
          }
        />

        <div className="form-footer">
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
            disabled={!isDisabled}
          >
            Save & Close
          </button>

          <button
            type="button"
            className="btn btn-md btn-primary"
            onClick={handleSubmit}
            disabled={!isDisabled}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentEdit;
