import React, { useState, useEffect } from 'react';
import jwt from 'jwt-decode';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import { fetchData } from '../../../../../../helpers/Api';
import FormText from '../../../../../common/form/FormText';
import FormInput from '../../../../../common/form/FormInput';
import { AccountBreadCrumbsData } from '../AccountBreadCrumbsData';

const AddSource = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
  });

  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState('');
  const [modalPopUp, setModalPopUp] = useState(false);
  const [closeModal, setCloseModal] = useState(false);

  useEffect(() => {
    getLoginUserId();
  }, []);

  const getLoginUserId = () => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setUserId(decodeToken?.id);
      }
    }
  };

  const handleFormInput = (e, name) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e, name) => {
    const { checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
  };

  const handleInputBlur = (e, name) => {
    const { value } = e.target;
    if (!formData[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]:
          name == 'name' ? 'Name is required.' : 'Description is required.',
      }));
    } else if (name === 'name' && value.length > 50) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Maximum 50 characters are allowed',
      }));
    } else if (name === 'description' && value.length > 500) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Maximum 500 characters are allowed',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  let hasData = formData.name || formData.description;

  hasData = Boolean(hasData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    setErrors(errors);

    if (!formData.name) {
      errors.name = 'Name is required.';
    }
    if (formData.name && formData.name.length > 50) {
      errors.name = 'Maximum 50 characters are allowed';
    }
    if (!formData.description) {
      errors.description = 'Description is required.';
    }
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Maximum 500 characters are allowed';
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const body = {
      name: formData.name,
      description: formData.description,
      is_active: formData.is_active,
      created_by: +userId,
    };

    try {
      const response = await fetchData('/accounts/sources', 'POST', body);

      if (response?.status === 'success') {
        setModalPopUp(true);
      } else if (response?.status === 400) {
        toast.error(`${response?.message?.[0] ?? response?.response}`, {
          autoClose: 3000,
        });
      } else {
        toast.error(`${response?.message?.[0] ?? response?.response}`, {
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
      label: 'Create Source',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/crm-admin/accounts/sources/create',
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Create Source'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form className={styles.formcontainer}>
          <div className="formGroup">
            <h5>Create Source</h5>
            <FormInput
              name="name"
              displayName="Name"
              value={formData.name}
              error={errors.name}
              onBlur={(e) => handleInputBlur(e, 'name')}
              required
              onChange={(e) => handleFormInput(e, 'name')}
            />

            <FormText
              label="description"
              name="description"
              classes={{ root: 'w-100 ' }}
              displayName="Description"
              value={formData.description}
              onChange={(e) => handleFormInput(e, 'description')}
              required
              error={errors.description}
              onBlur={(e) => handleInputBlur(e, 'description')}
            />

            <div className="form-field checkbox w-100">
              <span className="toggle-text">
                {formData.is_active ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  value={formData.is_active}
                  checked={formData.is_active}
                  name="is_active"
                  onChange={(e) => {
                    handleCheckboxChange(e, 'is_active');
                  }}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </form>
        <div className="form-footer">
          <p
            className={`mb-0 ${styles.cancelbutton}`}
            onClick={(e) => {
              e.preventDefault();
              !hasData
                ? navigate(
                    '/system-configuration/tenant-admin/crm-admin/accounts/sources'
                  )
                : setCloseModal(true);
            }}
          >
            Cancel
          </p>

          <button
            type="button"
            className={` btn btn-md me-4 ${styles.createbtn} btn-primary`}
            onClick={(e) => handleSubmit(e)}
          >
            Create
          </button>

          <SuccessPopUpModal
            title="Success!"
            message="Source created."
            modalPopUp={modalPopUp}
            isNavigate={true}
            setModalPopUp={setModalPopUp}
            showActionBtns={true}
            redirectPath={
              '/system-configuration/tenant-admin/crm-admin/accounts/sources'
            }
          />
          <CancelModalPopUp
            title="Confirmation"
            message="Unsaved changes will be lost, do you wish to proceed?"
            modalPopUp={closeModal}
            isNavigate={true}
            setModalPopUp={setCloseModal}
            redirectPath={
              '/system-configuration/tenant-admin/crm-admin/accounts/sources'
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AddSource;
