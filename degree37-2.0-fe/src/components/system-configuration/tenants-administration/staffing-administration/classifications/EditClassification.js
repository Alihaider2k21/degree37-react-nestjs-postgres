import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import TopBar from '../../../../common/topbar/index';
import SuccessPopUpModal from '../../../../common/successModal';
import FormInput from '../../../../common/form/FormInput';
import styles from './index.module.scss';
import jwt from 'jwt-decode';
import {
  fetchData,
  makeAuthorizedApiRequest,
} from '../../../../../helpers/Api';
import CancelModalPopUp from '../../../../common/cancelModal';
import FormText from '../../../../common/form/FormText';
import { ClassificationsBreadCrumbsData } from './ClassificationsBreadCrumbsData';

const errorInitialState = {
  name: '',
  short_description: '',
  description: '',
};

const classificationInitialState = {
  name: '',
  short_description: '',
  description: '',
  status: true,
};

const EditClassification = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [modalPopUp, setModalPopUp] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [classification, setClassification] = useState(
    classificationInitialState
  );
  const [archiveStatus, setArchivedStatus] = useState(false);
  const [errors, setErrors] = useState(errorInitialState);
  const [userId, setUserId] = useState('');
  const params = useParams();
  const navigate = useNavigate();

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
      label: 'Edit Classification',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/staffing-admin/classifications/${+params.id}/edit`,
    },
  ];

  useEffect(() => {
    getLoginUserId();
  }, []);

  useEffect(() => {
    const getData = async (id) => {
      if (id) {
        const result = await fetchData(`/staffing-admin/classifications/${id}`);
        const { data } = result;

        if (result?.code === 200) {
          setClassification({
            ...data,
          });
        } else {
          toast.error('Error Fetching Classification Details', {
            autoClose: 3000,
          });
        }
      } else {
        toast.error('Error Fetching Classification Details', {
          autoClose: 3000,
        });
      }
    };
    if (params?.id) {
      getData(params.id);
    }
  }, [params?.id, BASE_URL]);

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
    const validate = validateForm();
    if (validate) {
      await fetchData(`/staffing-admin/classifications/${+params.id}`, 'PUT', {
        ...classification,
        created_by: +userId,
        modified_at: new Date(),
      })
        .then((res) => {
          console.log('Update code response:=>  ', res.status_code);
          setModalPopUp(true);
          if (res.status_code === 204) {
            setErrors(errorInitialState);
          } else if (res.status_code === 404) {
            toast.error(res.response, { autoClose: 3000 });
            // setModalPopUp(false);
          }
        })
        .catch((err) => {
          if (err.status_code === 404) {
            // setModalPopUp(false);
            setErrors(errorInitialState);
            toast.error(err.response, { autoClose: 3000 });
          }
        });
    }
  };

  const saveAndClose = async () => {
    setIsArchived(false);
    const validate = validateForm();
    if (validate) {
      await handleSubmit();
      // setModalPopUp(true);
      setIsNavigate(true);
    }
  };

  const saveChanges = async () => {
    setIsArchived(false);
    await handleSubmit();
    setModalPopUp(true);
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

  const archiveHandle = async () => {
    try {
      const res = await makeAuthorizedApiRequest(
        'PATCH',
        `${BASE_URL}/staffing-admin/classifications/${+params.id}`
      );
      let { data, status, response } = await res.json();
      if (status === 'success') {
        // Handle successful response
        setModalPopUp(false);
        setTimeout(() => {
          setArchivedStatus(true);
        }, 600);
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        setModalPopUp(false);

        // Handle bad request
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        setModalPopUp(false);
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
      setModalPopUp(false);
    }
  };

  const handleCancel = () => {
    const { name, description, short_description } = classification;
    if (name || description || short_description) {
      setCloseModal(true);
    } else {
      navigate(
        '/system-configuration/tenant-admin/staffing-admin/classifications/list'
      );
    }
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
            <h5>Edit Classification</h5>

            <FormInput
              displayName="Name"
              label="Name"
              name="name"
              required
              value={classification.name}
              onChange={handleInputChange}
              error={errors.name}
              errorHandler={handleInputChange}
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
            />

            <FormText
              name="description"
              displayName="Description"
              required
              value={classification.description}
              error={errors.description}
              classes={{ root: 'w-100' }}
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
                  className="toggle-input"
                  name="status"
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </form>
      </div>
      <div className={`form-footer ${styles.classificationFooter}`}>
        <>
          <div
            className="archived"
            onClick={(e) => {
              e.preventDefault();
              setIsArchived(true);
              setModalPopUp(true);
            }}
          >
            Archive
          </div>
          <button
            className={`btn btn-link ${styles.archivebtn}`}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className={`btn btn-md me-4 ${styles.saveandclose} ${styles.createbtn}  btn-secondary`}
            onClick={(e) => {
              e.preventDefault();
              saveAndClose();
            }}
          >
            Save & Close
          </button>
          <button
            type="button"
            className={` ${`btn btn-primary btn btn-md me-4 ${styles.createbtn}`}`}
            onClick={(e) => {
              e.preventDefault();
              saveChanges();
            }}
          >
            Save Changes
          </button>
        </>
      </div>
      <SuccessPopUpModal
        title={isArchived ? 'Confirmation' : 'Success!'}
        message={
          isArchived
            ? 'Are you sure you want to archive?'
            : 'Classification updated.'
        }
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={isArchived ? false : true}
        isArchived={isArchived}
        archived={archiveHandle}
        isNavigate={isNavigate}
        redirectPath={
          '/system-configuration/tenant-admin/staffing-admin/classifications/list'
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message={`Classification is archived.`}
        modalPopUp={archiveStatus}
        isNavigate={true}
        redirectPath={
          '/system-configuration/tenant-admin/staffing-admin/classifications/list'
        }
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setArchivedStatus}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={
          '/system-configuration/tenant-admin/staffing-admin/classifications/list'
        }
      />
    </div>
  );
};

export default EditClassification;
