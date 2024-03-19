import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import jwt from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import ConfirmModal from '../../../../../common/confirmModal';
import styles from './index.module.scss';
import SuccessPopUpModal from '../../../../../common/successModal';
import { AccountBreadCrumbsData } from '../AccountBreadCrumbsData';

const AddIndustryCategories = () => {
  const [id, setId] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [open, setOpen] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    parent_id: null,
    name: '',
    description: '',
    minimum_oef: null,
    maximum_oef: null,
    is_active: true,
    created_by: +id,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);

        setFormData((prevFormData) => ({
          ...prevFormData,
          created_by: +decodeToken.id,
        }));
      }
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    let fieldValue;
    if (type === 'checkbox') {
      fieldValue = checked;
    } else if (type === 'number') {
      const newValue = value.replace(/[^\d.]/g, ''); // Remove anything that's not a digit or a dot
      const [integerPart, decimalPart] = newValue.split('.');

      // Enforce up to 3 digits before the decimal point and up to 2 digits after
      fieldValue = `${integerPart.slice(0, 3) || '0'}${
        decimalPart ? '.' + decimalPart.slice(0, 2) : ''
      }`;

      // Allow an empty value for number inputs
      fieldValue = value === '' ? null : parseFloat(fieldValue);
    } else {
      fieldValue = value;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: fieldValue,
    }));
    setUnsavedChanges(true);
  };

  const fieldDefinitions = {
    name: 'Name',
    description: 'Description',
    minimum_oef: 'Minimum EOF',
    maximum_oef: 'Maximum EOF',
  };

  const validateField = (name, value) => {
    if (!value) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${fieldDefinitions[[name]]} is required.`,
      }));
    } else if (
      (name === 'minimum_oef' || name === 'maximum_oef') &&
      value === 0
    ) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Minimum 1 is required',
      }));
    } else if (name === 'name' && +value.length > 50) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Maximum 50 characters are allowed',
      }));
    } else if (name === 'minimum_oef' && +value > 0) {
      if (+value >= +formData?.maximum_oef && formData?.maximum_oef) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          minimum_oef: 'Minimum OEF should be less than Maximum OEF',
        }));
      }
      if (+value < +formData?.maximum_oef) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          maximum_oef: '',
          minimum_oef: '',
        }));
      }
    } else if (name === 'maximum_oef' && +value > 0) {
      if (+value <= +formData?.minimum_oef && formData?.minimum_oef) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          maximum_oef: 'Maximum OEF should be greater than Minimum OEF',
        }));
      }
      if (+value > +formData?.minimum_oef) {
        console.log(formData?.maximum_oef, value);
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          minimum_oef: '',
          maximum_oef: '',
        }));
      }
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    setFormErrors(errors);

    if (!formData.name) {
      errors.name = 'Name is required.';
    }
    if (!formData.description) {
      errors.description = 'Description is required.';
    }
    if (!formData.minimum_oef) {
      errors.minimum_oef = 'Minimum OEF is required.';
    }
    if (!formData.maximum_oef) {
      errors.maximum_oef = 'Maximum OEF is required.';
    }
    if (
      formData?.minimum_oef &&
      formData?.maximum_oef &&
      +formData?.minimum_oef > +formData?.maximum_oef
    ) {
      errors.minimum_oef = 'Minimum OEF should be less than Maximum OEF.';
    }
    if (
      formData?.minimum_oef &&
      formData?.maximum_oef &&
      +formData?.maximum_oef < +formData?.minimum_oef
    ) {
      errors.maximum_oef = 'Maximum OEF should be greater than Minimum OEF';
    }
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const body = {
      parent_id: null,
      name: formData.name,
      description: formData.description,
      minimum_oef: parseFloat(formData.minimum_oef),
      maximum_oef: parseFloat(formData.maximum_oef),
      is_active: formData.is_active,
      created_by: +id,
    };

    try {
      const bearerToken = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/accounts/industry_categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(body),
      });
      let data = await response.json();
      if (data?.status === 'success') {
        setOpen(true);
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
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
    ...AccountBreadCrumbsData,
    {
      label: 'Create Industry Category',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/crm-admin/accounts/industry-categories/create',
    },
  ];

  const handleCancelClick = () => {
    if (unsavedChanges) {
      setShowConfirmationDialog(true);
    } else {
      navigate(
        '/system-configuration/tenant-admin/crm-admin/accounts/industry-categories'
      );
    }
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(
        '/system-configuration/tenant-admin/crm-admin/accounts/industry-categories'
      );
    }
  };

  const handleWheel = (event) => {
    if (event.target.type === 'number') {
      event.target.blur();
    }
  };

  return (
    <div className={`mainContent`}>
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Industry Categories'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />

      <div className="mainContentInner form-container">
        <form className={`${styles.industryCategoriesForm}`}>
          <div className="formGroup">
            <h5>Create Industry Category</h5>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder=" "
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  maxLength={50}
                />

                <label>Name*</label>
              </div>
              {formErrors.name && (
                <div className="error">
                  <p>{formErrors.name}</p>
                </div>
              )}
            </div>
            <div className="form-field w-100 textarea-new">
              <div className="field">
                <textarea
                  type="text"
                  className="form-control textarea"
                  placeholder=" "
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  maxLength={500}
                />
                <label>Description*</label>
              </div>
              {formErrors.description && (
                <div className="error">
                  <p>{formErrors.description}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="number"
                  className="form-control"
                  name="minimum_oef"
                  placeholder=" "
                  required
                  min="1"
                  value={formData.minimum_oef}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleBlur(e);
                  }}
                  onBlur={handleBlur}
                  onWheel={handleWheel}
                />

                <label>Minimum OEF*</label>
              </div>
              {formErrors.minimum_oef && (
                <div className="error">
                  <p>{formErrors.minimum_oef}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="number"
                  className="form-control"
                  name="maximum_oef"
                  placeholder=" "
                  required
                  min={1}
                  value={formData.maximum_oef}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleBlur(e);
                  }}
                  onBlur={handleBlur}
                  onWheel={handleWheel}
                />

                <label>Maximum OEF*</label>
              </div>
              {formErrors.maximum_oef && (
                <div className="error">
                  <p>{formErrors.maximum_oef}</p>
                </div>
              )}
            </div>
            <div className="form-field checkbox">
              <span className="toggle-text">
                {formData.is_active ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </form>
        <div className="form-footer">
          <button className="btn btn-secondary" onClick={handleCancelClick}>
            Cancel
          </button>
          <button
            type="button"
            className={` ${`btn btn-primary`}`}
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
        <ConfirmModal
          showConfirmation={showConfirmationDialog}
          onCancel={() => handleConfirmationResult(false)}
          onConfirm={() => handleConfirmationResult(true)}
          icon={CancelIconImage}
          heading={'Confirmation'}
          description={'Unsaved changes will be lost. Do you want to continue?'}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Industry Category created."
          modalPopUp={open}
          isNavigate={true}
          setModalPopUp={setOpen}
          showActionBtns={true}
          redirectPath={-1}
        />
      </div>
    </div>
  );
};

export default AddIndustryCategories;
