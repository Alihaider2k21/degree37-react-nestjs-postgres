import React, { useState, useEffect } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './note-category.module.scss';
import { toast } from 'react-toastify';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import SuccessPopUpModal from '../../../../../common/successModal';
import { fetchData } from '../../../../../../helpers/Api';
import { NonCollectionEventsBreadCrumbsData } from '../NonCollectionEventsBreadCrumbsData';

let crmAdminType = 'nce-categories';
// let crmAdminTypeLabel = 'Non Collection Events';
let categoryTypeLabel = 'NCE';
let navigateToMainPageLink = `/system-configuration/tenant-admin/operations-admin/${crmAdminType}/list`;

const NceCategoryEdit = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [redirectToMainScreen, setRedirectToMainScreen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { id } = useParams();
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archivedStatus, setArchivedStatus] = useState(false);
  const handleCancelClick = () => {
    if (unsavedChanges) {
      setShowConfirmationDialog(true);
    } else {
      navigate(navigateToMainPageLink);
    }
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(navigateToMainPageLink);
    }
  };

  useEffect(() => {
    const fetchFormData = async (id) => {
      if (id) {
        let url = `/nce-category/${id}`;

        const result = await fetchData(url, 'GET');

        let { data, status_code } = result;

        if (status_code === 200 && data) {
          setIsActive(data?.is_active);
          setFormData({
            ...formData,
            category_name: data.name,
            category_description: data.description,
          });
          // toast.success(message, { autoClose: 3000 });
        } else {
          toast.error(`Error Fetching ${categoryTypeLabel} Category Details`, {
            autoClose: 3000,
          });
        }
      } else {
        toast.error(`Error Fetching ${categoryTypeLabel} Category Details`, {
          autoClose: 3000,
        });
      }
    };

    if (id) {
      fetchFormData(id);
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      try {
        const body = {
          name: formData.category_name,
          description: formData.category_description,
          is_active: isActive,
        };

        let url = `/nce-category/${id}`;

        const result = await fetchData(url, 'PUT', body);

        let { data, status_code } = result;

        if ((status_code === 200 || status_code === 201) && data) {
          setShowSuccessDialog(true);
        } else {
          toast.error(`Error Fetching ${categoryTypeLabel} Category Details`, {
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };

  const saveChanges = async (e) => {
    await handleSubmit(e, false);
  };

  const saveAndClose = async (e) => {
    await handleSubmit(e);
    setRedirectToMainScreen(true);
  };

  const handleIsActiveChange = (event) => {
    setUnsavedChanges(true);
    setIsActive(event.target.checked);
  };

  const [formData, setFormData] = useState({
    category_name: '',
    category_description: '',
  });

  const [errors, setErrors] = useState({
    category_name: '',
    category_description: '',
  });

  const fieldNames = [
    { label: 'Name', name: 'category_name', required: true, maxLength: 50 },
    {
      label: 'Description',
      name: 'category_description',
      required: true,
      maxLength: 500,
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

      if (fieldDefinition?.required && value.toString().trim() === '') {
        errorMessage = `${fieldDefinition.label} is required.`;
      }

      if (
        fieldDefinition?.maxLength &&
        value.length > fieldDefinition?.maxLength
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
      errorMessage = `Maximum ${fieldDefinition.maxLength} characters are allowed.`;
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMsg,
      }));
    };

    setUnsavedChanges(true);
    setError(name, errorMessage);
  };

  const BreadcrumbsData = [
    ...NonCollectionEventsBreadCrumbsData,
    {
      label: `Edit ${categoryTypeLabel} Category`,
      class: 'disable-label',
      link: `${navigateToMainPageLink}/edit`,
    },
  ];
  const confirmArchive = async () => {
    try {
      const result = await fetchData(`/nce-category/${id}`, 'PATCH');
      const { status, response } = result;
      if (status === 'success') {
        setModalPopUp(false);
        setTimeout(() => {
          setArchivedStatus(true);
        }, 600);
        return;
      } else toast.error(response, { autoClose: 3000 });
    } catch (error) {
      toast.error(error?.response, { autoClose: 3000 });
    }

    setModalPopUp(false);
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={`${categoryTypeLabel} Categories`}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form className={styles.addAdminRoles}>
          <div className="formGroup">
            <h5>{`Edit ${categoryTypeLabel} Category`}</h5>
            <div className="col">
              <div className="form-field">
                <div className="field ">
                  <input
                    type="text"
                    className="form-control"
                    name="category_name"
                    placeholder=" "
                    onChange={(e) => {
                      const filteredValue = e.target.value.replace(/^\s+/g, '');
                      e.target.value = filteredValue;
                      handleInputChange(e);
                    }}
                    onBlur={handleInputChange}
                    value={formData.category_name}
                    required
                  />

                  <label>Name*</label>
                </div>
                {errors.category_name && (
                  <div className="error">
                    <p>{errors.category_name}</p>
                  </div>
                )}
              </div>

              <div className="form-field textarea-new w-100">
                <div className={`field`}>
                  <textarea
                    type="text"
                    className={`form-control textarea`}
                    placeholder=" "
                    name="category_description"
                    value={formData.category_description}
                    onChange={(e) => {
                      const filteredValue = e.target.value.replace(/^\s+/g, '');
                      e.target.value = filteredValue;
                      handleInputChange(e);
                    }}
                    onBlur={handleInputChange}
                    required
                  />
                  <label>Description *</label>
                </div>
                {errors.category_description && (
                  <div className="error">
                    <p>{errors.category_description}</p>
                  </div>
                )}
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
          message={`${categoryTypeLabel} Category updated.`}
          modalPopUp={showSuccessDialog}
          isNavigate={true}
          setModalPopUp={setShowSuccessDialog}
          showActionBtns={true}
          redirectPath={redirectToMainScreen ? navigateToMainPageLink : ''}
        />
        <SuccessPopUpModal
          title="Confirmation"
          message={'Are you sure you want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={true}
          archived={confirmArchive}
        />
        <SuccessPopUpModal
          title="Success!"
          message={'NCE Category is archived.'}
          modalPopUp={archivedStatus}
          isNavigate={true}
          setModalPopUp={setArchivedStatus}
          showActionBtns={true}
          redirectPath={navigateToMainPageLink}
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
            className="btn btn-secondary btn-md border-0"
            onClick={handleCancelClick}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-md btn-secondary"
            onClick={saveAndClose}
          >
            Save & Close
          </button>

          <button
            type="button"
            className="btn btn-md btn-primary"
            onClick={saveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default NceCategoryEdit;
