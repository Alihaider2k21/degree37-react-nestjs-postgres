import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import jwt from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import ConfirmModal from '../../../../../common/confirmModal';
import SuccessPopUpModal from '../../../../../common/successModal';
import { AccountBreadCrumbsData } from '../AccountBreadCrumbsData';
import SelectDropdown from '../../../../../common/selectDropdown';

const AddIndustrySubCategories = () => {
  const [id, setId] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [industryCategories, setIndustryCategories] = useState([]);
  const [selectedIndustryCategories, setSelectedIndustryCategories] =
    useState(null);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    parent_id: null,
    name: '',
    description: '',
    minimum_oef: 0,
    maximum_oef: 0,
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

    const fetchIndustryCategories = async () => {
      const bearerToken = localStorage.getItem('token');
      try {
        const response = await fetch(
          `${BASE_URL}/accounts/industry_categories?categories=true&fetchAll=true`,
          {
            headers: {
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const data = await response.json();
        if (data) {
          const activeCategories = data.data.filter(
            (category) => category.is_active
          );
          const sortedCategories = activeCategories.slice().sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();

            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          setIndustryCategories(sortedCategories);
        }
      } catch (error) {
        console.error('Error fetching parent options:', error);
      }
    };

    fetchIndustryCategories();
  }, []);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue =
      type === 'checkbox'
        ? checked
        : type === 'number'
        ? parseFloat(value)
        : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: fieldValue,
    }));
    setUnsavedChanges(true);
  };

  const fieldDefinitions = {
    name: 'Name',
    description: 'Description',
    selectedIndustryCategories: 'Industry Category',
  };

  const validateField = (name, value) => {
    console.log(name, 'name');
    if (!value) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${fieldDefinitions[[name]]} is required.`,
      }));
    } else if (name === 'name' && value.length > 50) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Maximum 50 characters are allowed',
      }));
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
    if (!selectedIndustryCategories) {
      errors.selectedIndustryCategories = 'Industry category is required';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const body = {
      parent_id: selectedIndustryCategories.value,
      name: formData.name,
      description: formData.description,
      minimum_oef: formData.minimum_oef,
      maximum_oef: formData.maximum_oef,
      is_active: formData.is_active,
      created_by: +id,
    };

    try {
      const response = await fetch(`${BASE_URL}/accounts/industry_categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
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
      label: 'Create Industry Subcategory',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories/create',
    },
  ];

  const handleCancelClick = () => {
    if (unsavedChanges) {
      setShowConfirmationDialog(true);
    } else {
      navigate(
        '/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories'
      );
    }
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(
        '/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories'
      );
    }
  };

  return (
    <div className={`mainContent`}>
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Industry Subcategories'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />

      <div className="mainContentInner form-container">
        <form className="formGroup">
          <div className="formGroup">
            <h5>Create Industry Subcategory</h5>
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
            <div className="form-field custom-select-main">
              <div className="field">
                <SelectDropdown
                  styles={{ root: 'w-100 m-0' }}
                  placeholder={'Industry Categories*'}
                  defaultValue={selectedIndustryCategories}
                  selectedValue={selectedIndustryCategories}
                  removeDivider
                  showLabel
                  onChange={(option) => setSelectedIndustryCategories(option)}
                  onBlur={() => {
                    validateField(
                      'selectedIndustryCategories',
                      selectedIndustryCategories
                    );
                  }}
                  options={industryCategories.map((option) => ({
                    value: option.id,
                    label: option.name,
                  }))}
                />
              </div>
              {formErrors.selectedIndustryCategories && (
                <div className="error">
                  <p>{formErrors.selectedIndustryCategories}</p>
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
          message="Industry Subcategory created."
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

export default AddIndustrySubCategories;
