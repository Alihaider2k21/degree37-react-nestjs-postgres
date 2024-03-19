import React, { useState, useEffect } from 'react';
import TopBar from '../../../../../../components/common/topbar/index';
import { useNavigate } from 'react-router-dom';
import styles from './note-subcategory.module.scss';
import { toast } from 'react-toastify';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import SuccessPopUpModal from '../../../../../../components/common/successModal/index';
import { fetchData } from '../../../../../../helpers/Api';
import Layout from '../../../../../../components/common/layout';
import SelectDropdown from '../../../../../../components/common/selectDropdown';
import { AccountBreadCrumbsData } from '../../../../../../components/system-configuration/tenants-administration/crm-administration/account/AccountBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

let crmAdminType = 'accounts';
// let crmAdminTypeLabel = 'Accounts';
let categoryTypeLabel = 'Attachment';
let categoryType = 'attachment';
let navigateToMainPageLink = `/system-configuration/tenant-admin/crm-admin/${crmAdminType}/${categoryType}-subcategories`;

const AccountsCreateAttachmentSubCategory = () => {
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(true);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [redirectToMainScreen, setRedirectToMainScreen] = useState(false);

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

  const fetchNoteCategories = async () => {
    let url = `/${crmAdminType}/${categoryType}-category?is_active=true`;

    const result = await fetchData(url, 'GET');

    let { data, status_code } = result;

    if (result.ok || status_code === 200) {
      let noteCategories = data?.data?.map((noteCategory) => ({
        label: noteCategory?.name,
        value: noteCategory?.id,
      }));

      setCategoriesData(noteCategories);
    } else {
      toast.error(`Error Fetching ${categoryType} Categories`, {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchNoteCategories();
  }, []);

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
          parent_id: +formData.parent_category_name.value,
        };
        let url = `/${crmAdminType}/${categoryType}-subcategory`;

        const result = await fetchData(url, 'POST', body);

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

  const [formData, setFormData] = useState({
    category_name: '',
    category_description: '',
    parent_category_name: null,
  });

  const [errors, setErrors] = useState({
    category_name: '',
    category_description: '',
    parent_category_name: '',
  });

  const fieldNames = [
    { label: 'Name', name: 'category_name', required: true, maxLength: 50 },
    {
      label: 'Description',
      name: 'category_description',
      required: true,
      maxLength: 500,
    },
    {
      label: `${categoryTypeLabel} Category`,
      name: 'parent_category_name',
      required: true,
    },
  ];

  function titleCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    fieldNames.forEach((fieldName) => {
      let value = formData[fieldName.name];
      const fieldDefinition = fieldNames.find(
        (field) => field.name === fieldName.name
      );
      let errorMessage = '';

      if (value === undefined) {
        value = '';
      }

      if (
        (fieldDefinition?.required && value === null) ||
        (fieldDefinition?.required && value.toString().trim() === '')
      ) {
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

  const handleDropDownChange = async (name, theValue) => {
    console.log(name, theValue);
    setFormData({ ...formData, [name]: theValue });
    setErrors({ ...errors, [name]: '' });
  };

  const handleIsActiveChange = (event) => {
    setUnsavedChanges(true);
    setIsActive(event.target.checked);
  };

  const BreadcrumbsData = [
    ...AccountBreadCrumbsData,
    {
      label: `Create ${categoryTypeLabel} Subcategory`,
      class: 'disable-label',
      link: `${navigateToMainPageLink}/create`,
    },
  ];
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.ATTACHMENTS_SUBCATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <div className="mainContent">
          <TopBar
            BreadCrumbsData={BreadcrumbsData}
            BreadCrumbsTitle={`${categoryTypeLabel} Subcategories`}
            SearchPlaceholder={null}
            SearchValue={null}
            SearchOnChange={null}
          />
          <div className="mainContentInner form-container">
            <form className={styles.addAdminRoles}>
              <div className="formGroup">
                <h5>{`Create ${categoryTypeLabel} Subcategory`}</h5>

                <div className="row w-100">
                  <div className="form-field col-md-6">
                    <div className="field">
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

                      <label>Name* </label>
                    </div>
                    {errors.category_name && (
                      <div className="error">
                        <p>{errors.category_name}</p>
                      </div>
                    )}
                  </div>

                  <div className=" form-field col-md-6">
                    <div className="note-field field select-field">
                      <SelectDropdown
                        name="parent_category_name"
                        styles={{ root: 'w-100 mb-2' }}
                        placeholder={'Attachment Category'}
                        defaultValue={formData.parent_category_name}
                        selectedValue={formData.parent_category_name}
                        removeDivider
                        showLabel
                        onBlur={handleInputChange}
                        onChange={(val) => {
                          handleDropDownChange('parent_category_name', val);
                        }}
                        options={categoriesData}
                      />

                      {errors?.parent_category_name && (
                        <div className={`error ${styles.errorcolor} ml-1 mt-2`}>
                          <p>{errors.parent_category_name}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className=" form-field w-100 textarea-new">
                    <div className={`field`}>
                      <textarea
                        type="text"
                        className={`form-control textarea`}
                        placeholder=" "
                        name="category_description"
                        onChange={handleInputChange}
                        onBlur={handleInputChange}
                        value={formData.category_description}
                        required
                      />
                      <label>Description *</label>
                    </div>

                    <br />

                    {errors.category_description && (
                      <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                        <p>{errors.category_description} </p>
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
                      checked={isActive}
                      className="toggle-input"
                      name="is_active"
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
              message={`${categoryTypeLabel} Subcategory created.`}
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
                className="btn btn-primary"
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

export default AccountsCreateAttachmentSubCategory;
