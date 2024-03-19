import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import TopBar from '../../../../common/topbar/index';
import SuccessPopUpModal from '../../../../common/successModal';
import CancelModalPopUp from '../../../../common/cancelModal';
import { CLASSIFICATIONS_PATH } from '../../../../../routes/path';
import FormInput from '../../../users-administration/users/FormInput';
import jwt from 'jwt-decode';
import { fetchData } from '../../../../../helpers/Api';
import FormText from '../../../../common/form/FormText';
import styles from './index.module.scss';
import { ClassificationsBreadCrumbsData } from './ClassificationsBreadCrumbsData';

const errorInitialState = {
  name: '',
  short_description: '',
  description: '',
};

const classificationInitialState = {
  status: true,
  name: '',
  short_description: '',
  description: '',
};

const AddClassification = () => {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [classification, setClassification] = useState(
    classificationInitialState
  );
  const [errors, setErrors] = useState(errorInitialState);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [userId, setUserId] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const fieldNames = [
    { label: 'Name', name: 'name', required: true, maxLength: 50 },
    {
      label: 'Short Description',
      name: 'short_description',
      required: true,
      maxLength: 500,
    },
    {
      label: 'Description',
      name: 'description',
      required: true,
      maxLength: 500,
    },
  ];

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    fieldNames.forEach((fieldName) => {
      const value = classification[fieldName.name];
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

  const BreadcrumbsData = [
    ...ClassificationsBreadCrumbsData,
    {
      label: 'Create Classification',
      class: 'active-label',
      link: CLASSIFICATIONS_PATH.CREATE,
    },
  ];

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

  const handleSubmit = async (e) => {
    setIsRequesting(true);
    e.preventDefault();

    const result = validateForm();
    if (result) {
      await fetchData('/staffing-admin/classifications', 'POST', {
        ...classification,
        name: classification.name?.trim(),
        created_by: +userId,
      })
        .then((res) => {
          setIsRequesting(false);
          if (res.status_code === 201) {
            setShowSuccessMessage(true);
            setErrors(errorInitialState);
          } else if (res.status_code === 404) {
            toast.error(res.response, { autoClose: 3000 });
            setShowSuccessMessage(false);
          }
        })
        .catch((err) => {
          setIsRequesting(false);
          if (err.status_code === 404) {
            setShowSuccessMessage(false);
            setErrors(errorInitialState);
            toast.error(err.response, { autoClose: 3000 });
          }
        });
    } else {
      setIsRequesting(false);
    }
  };

  const handleCancel = () => {
    if (
      !Object.values(classification)
        .slice(1)
        .every((a) => a == '')
    ) {
      setShowCancelModal(true);
    } else {
      navigate(
        '/system-configuration/tenant-admin/staffing-admin/classifications/list'
      );
    }
  };

  const handleInputChange = (e) => {
    let { name, value, type } = e.target;

    switch (type) {
      case 'checkbox':
        value = !classification[name];
        break;
      default:
        break;
    }
    setClassification((prevData) => {
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
    setError(name, errorMessage);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Classifications'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form>
          <div className="formGroup">
            <h5>Create Classification</h5>

            <FormInput
              label="Name"
              name="name"
              required
              value={classification.name}
              onChange={handleInputChange}
              error={errors.name}
              errorHandler={handleInputChange}
              className="form-control"
            />

            <FormInput
              displayName="Short Description"
              label="Short Description"
              name="short_description"
              required
              value={classification.short_description}
              onChange={handleInputChange}
              error={errors.short_description}
              errorHandler={handleInputChange}
              className="form-control"
            />

            <FormText
              name="description"
              displayName="Description"
              value={classification.description}
              error={errors.description}
              classes={{ root: 'w-100' }}
              required
              onChange={handleInputChange}
              onBlur={handleInputChange}
            />
            <div className="form-field checkbox w-100">
              <span className="toggle-text">
                {classification?.status ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  checked={classification.status}
                  onChange={handleInputChange}
                  type="checkbox"
                  id="toggle"
                  className="toggle-input form-control"
                  name="status"
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </form>

        <div className="form-footer">
          <p className={`mb-0 ${styles.cancelbutton}`} onClick={handleCancel}>
            Cancel
          </p>
          <button
            type="button"
            className={`btn btn-md  ${styles.createBtn} ${'btn-primary'}`}
            onClick={handleSubmit}
            disabled={isRequesting}
          >
            Create
          </button>
        </div>
      </div>
      <CancelModalPopUp
        title="Confirmation"
        message={'Unsaved changes will be lost, do you wish to proceed?'}
        modalPopUp={showCancelModal}
        setModalPopUp={setShowCancelModal}
        showActionBtns={false}
        isNavigate={true}
        redirectPath={
          '/system-configuration/tenant-admin/staffing-admin/classifications/list'
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message={'Classification created.'}
        modalPopUp={showSuccessMessage}
        isNavigate={true}
        redirectPath={
          '/system-configuration/tenant-admin/staffing-admin/classifications/list'
        }
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setShowSuccessMessage}
      />
    </div>
  );
};

export default AddClassification;
