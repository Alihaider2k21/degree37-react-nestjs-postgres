import React, { useState, useEffect } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
// import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
// import ConfirmModal from '../../../../../common/confirmModal';
import SuccessPopUpModal from '../../../../../common/successModal';
import { AccountBreadCrumbsData } from '../AccountBreadCrumbsData';
import SelectDropdown from '../../../../../common/selectDropdown';

const EditIndustrySubCategories = () => {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [showSaveChange, setShowSaveChange] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  // const [showConfirmation, setShowConfirmation] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const { id } = useParams();
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    selectedIndustryCategories: '',
  });
  const [industryCategories, setIndustryCategories] = useState([]);

  const [selectedIndustryCategories, setSelectedIndustryCategories] =
    useState(null);

  const handleCancelClick = () => {
    setShowCancelModal(true);
    // navigate(
    //   '/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories'
    // );
  };

  // const handleConfirmationResult = (confirmed) => {
  //   // setShowConfirmation(false);
  //   if (confirmed) {
  //     navigate(
  //       '/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories'
  //     );
  //   }
  // };

  const fieldDefinitions = {
    name: 'Name',
    description: 'Description',
    selectedIndustryCategories: 'Industry Category',
  };

  const handleInputBlur = (e) => {
    setUnsavedChanges(true);
    const { name, value } = e.target;
    let errorMessage = '';

    if (value.trim() === '') {
      errorMessage = `${fieldDefinitions[[name]]} is required.`;
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    switch (name) {
      case 'name':
        if (!value) {
          setError('name', errorMessage);
        } else if (value.length > 50) {
          setError(name, 'Maximum 50 characters are allowed');
        } else {
          setError('name', '');
        }
        break;

      case 'description':
        if (!value) {
          setError('description', errorMessage);
        } else {
          setError('description', '');
        }
        break;

      case 'industryCategories':
        if (!value) {
          setError('industryCategories', errorMessage);
        } else {
          setError('industryCategories', '');
        }
        break;

      default:
        setError(name, errorMessage);
        break;
    }
  };

  useEffect(() => {
    const fetchFormData = async (id) => {
      if (id) {
        const result = await fetch(
          `${BASE_URL}/accounts/industry_categories/${id}`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        let { data, status } = await result.json();
        if (status === 200 && data) {
          setName(data.name);
          setDescription(data.description);
          setIsActive(data.is_active);
          setSelectedIndustryCategories({
            value: data.parent_id.id,
            label: data.parent_id.name,
          });
        } else {
          toast.error('Error Fetching Industry Subcategory Details', {
            autoClose: 3000,
          });
        }
      } else {
        toast.error('Error getting Industry Subcategory Details', {
          autoClose: 3000,
        });
      }
    };

    if (id) {
      fetchFormData(id);
    }

    const fetchIndustryCategories = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/accounts/industry_categories?fetchAll=`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
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

  const saveChanges = async (e) => {
    await handleSubmit(e);
    setShowSaveChange(true);
  };

  const saveAndClose = async (e) => {
    await handleSubmit(e);
    setShowSuccessMessage(true);
  };

  const handleSubmit = async (e, redirect = false) => {
    e.preventDefault();

    const errors = {};
    setErrors(errors);

    if (name === '') {
      errors.name = 'Name is required.';
    }
    if (description === '') {
      errors.description = 'Description is required.';
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const body = {
        name: name,
        description: description,
        minimum_oef: null,
        maximum_oef: null,
        is_active: isActive,
        parent_id: selectedIndustryCategories.value,
      };
      const response = await fetch(
        `${BASE_URL}/accounts/industry_categories/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },

          body: JSON.stringify(body),
        }
      );
      let data = await response.json();
      if (data?.status === 204) {
        if (redirect) {
          navigate(
            '/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories'
          );
        }
      } else if (data?.status_code === 400) {
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

  const handleNameChange = (event) => {
    setUnsavedChanges(true);
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    setUnsavedChanges(true);
  };

  const handleIsActiveChange = (event) => {
    setUnsavedChanges(true);
    setIsActive(event.target.checked);
  };

  const BreadcrumbsData = [
    ...AccountBreadCrumbsData,
    {
      label: 'Edit Industry Subcategory',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories/${id}/edit`,
    },
  ];

  const confirmArchive = async () => {
    try {
      const industryCategoryId = id;
      const response = await fetch(
        `${BASE_URL}/accounts/industry_categories/${industryCategoryId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const { status } = await response.json();

      if (status === 204) {
        setArchiveModal(false);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
      } else {
        toast.error('Error Archiving Industry Subcategory', {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error archiving data:', error);
    }

    setArchiveModal(false);
  };
  return (
    <div className={` mainContent`}>
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
            <h5>Edit Industry Subcategory</h5>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder=" "
                  value={name}
                  required
                  onChange={handleNameChange}
                  onBlur={handleInputBlur}
                  maxLength={50}
                />
                <label>Name</label>
              </div>
              {errors.name && (
                <div className="error">
                  <p>{errors.name}</p>
                </div>
              )}
            </div>
            <div className="form-field custom-select-main">
              <div className="field">
                <SelectDropdown
                  styles={{ root: 'w-100 m-0' }}
                  placeholder={'Industry Categories*'}
                  defaultValue={
                    selectedIndustryCategories
                      ? selectedIndustryCategories
                      : null
                  }
                  selectedValue={
                    selectedIndustryCategories
                      ? selectedIndustryCategories
                      : null
                  }
                  removeDivider
                  showLabel
                  onChange={(option) => {
                    setSelectedIndustryCategories(option);
                    setUnsavedChanges(true);
                  }}
                  options={industryCategories.map((option) => ({
                    value: option.id,
                    label: option.name,
                  }))}
                />
              </div>
              {errors.selectedIndustryCategories && (
                <div className="error">
                  <p>{errors.selectedIndustryCategories}</p>
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
                  value={description}
                  onChange={handleDescriptionChange}
                  onBlur={handleInputBlur}
                  maxLength={500}
                />
                <label>Description</label>
              </div>
              {errors.description && (
                <div className="error">
                  <p>{errors.description}</p>
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
                  onChange={handleIsActiveChange}
                  checked={isActive}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </form>
        <SuccessPopUpModal
          title="Confirmation"
          message={'Are you sure want to archive?'}
          modalPopUp={archiveModal}
          setModalPopUp={setArchiveModal}
          showActionBtns={false}
          isArchived={true}
          archived={confirmArchive}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Industry Subcategory is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories'
          }
        />
        <div className="form-footer">
          <div
            onClick={() => {
              setArchiveModal(true);
            }}
            className="archived"
          >
            <span>Archive</span>
          </div>
          <button
            className="btn btn-secondary border-0"
            onClick={handleCancelClick}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={saveAndClose}
          >
            Save & Close
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={saveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
      <SuccessPopUpModal
        title="Confirmation"
        message={'Unsaved changes will be lost, do you wish to proceed?'}
        modalPopUp={showCancelModal}
        setModalPopUp={setShowCancelModal}
        showActionBtns={false}
        isArchived={true}
        archived={() =>
          navigate(
            '/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories'
          )
        }
      />
      <SuccessPopUpModal
        title="Success"
        message={'Note Category updated.'}
        modalPopUp={showSuccessMessage}
        isNavigate={true}
        redirectPath={-1}
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setShowSuccessMessage}
      />
      <SuccessPopUpModal
        title="Success"
        message={'Note Category updated.'}
        modalPopUp={showSaveChange}
        isNavigate={true}
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setShowSaveChange}
      />
    </div>
  );
};

export default EditIndustrySubCategories;
