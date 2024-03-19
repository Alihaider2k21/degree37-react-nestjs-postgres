import React, { useState } from 'react';
import TopBar from '../../../../../../components/common/topbar/index';
import { useNavigate } from 'react-router-dom';
import styles from './note-category.module.scss';
import { toast } from 'react-toastify';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import SuccessPopUpModal from '../../../../../../components/common/successModal/index';
import Layout from '../../../../../../components/common/layout';
import { fetchData } from '../../../../../../helpers/Api';
import { ContactBreadCrumbsData } from '../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/ContactBreadCrumbsData';
import NotFoundPage from '../../../../../not-found/NotFoundPage';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

let crmAdminType = 'contacts';
// let crmAdminTypeLabel = 'Contact';
let categoryTypeLabel = 'Attachment';
let categoryType = 'attachment';
let navigateToMainPageLink = `/system-configuration/tenant-admin/crm-admin/${crmAdminType}/${categoryType}-categories`;

const CreateAttachmentCategory = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [redirectToMainScreen, setRedirectToMainScreen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

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

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Assuming you have the base URL in an environment variable named "BASE_URL"

    const isValid = validateForm();

    if (isValid) {
      try {
        const body = {
          name: formData.category_name,
          description: formData.category_description,
          is_active: isActive,
        };

        let url = `/${crmAdminType}/${categoryType}-category`;

        const result = await fetchData(url, 'POST', body);

        let { data, status_code } = result;

        console.log('status_code', status_code);

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

  function titleCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }

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
        errorMessage = `${titleCase(fieldDefinition.label)} is required.`;
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
      errorMessage = `${titleCase(fieldDefinition.label)} is required.`;
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
    ...ContactBreadCrumbsData,
    {
      label: `Create ${categoryTypeLabel} Category`,
      class: 'disable-label',
      link: `${navigateToMainPageLink}/create`,
    },
  ];
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.CONTACTS.ATTACHMENTS_CATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
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
                <h5>{`Create ${categoryTypeLabel} Category`}</h5>
                <div className="col">
                  <div className="form-field">
                    <div className="field ">
                      <input
                        type="text"
                        className="form-control"
                        name="category_name"
                        placeholder=" "
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
                        onBlur={handleInputChange}
                        required
                      />
                      <label>Description *</label>
                    </div>
                    <br />
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
              message={`${categoryTypeLabel} Category created.`}
              modalPopUp={showSuccessDialog}
              isNavigate={true}
              setModalPopUp={setShowSuccessDialog}
              showActionBtns={true}
              redirectPath={redirectToMainScreen ? navigateToMainPageLink : ''}
            />

            <div className="form-footer">
              <button
                className="btn btn-secondary border-0"
                onClick={handleCancelClick}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`btn btn-primary`}
                onClick={(e) => {
                  setRedirectToMainScreen(true);
                  handleSubmit(e);
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateAttachmentCategory;
