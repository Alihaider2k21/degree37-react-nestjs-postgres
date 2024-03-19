import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode';
import styles from './category.module.scss';
import PopUpModal from '../../../../../common/PopUpModal';
// import CancelIconImage from "../../../../../../assets/images/ConfirmCancelIcon.png";
import SuccessPopUpModal from '../../../../../common/successModal';
import TopBar from '../../../../../common/topbar/index';
import { makeRequest } from '../../../../../../utils';

const CategoryUpsert = () => {
  const bearerToken = localStorage.getItem('token');
  const { id: categoryId } = useParams();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [successModalPopUp, setSuccessModalPopUp] = useState(false);
  const [successUpdateModalPopUp, setSuccessUpdateModalPopUp] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
  });

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }

    if (categoryId) {
      fetchCategoryData();
    }
  }, [categoryId]);

  const fetchCategoryData = async () => {
    try {
      const result = await fetch(
        `${BASE_URL}/location/attachment-category/${categoryId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const { data } = await result.json();
      if (result.ok || result.status === 200) {
        setCategoryData(data);
      } else {
        toast.error('Error Fetching Category Details', { autoClose: 3000 });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const setCategoryData = (data) => {
    setName(data.name);
    setDescription(data.description);
    setIsActive(data.is_active);
  };

  const validationSchema = yup.object({
    name: yup
      .string()
      .min(1, 'Name is required.')
      .required('Name is required.')
      .max(20, 'Name is too long')
      .matches(/^[a-zA-Z\s]+$/, 'Invalid Name. Only alphabets are allowed.'),
  });

  const handleOnBlur = async (event) => {
    const key = event.target.name;
    const value = event.target.value;
    validationSchema
      .validate({ [key]: value }, { abortEarly: false })
      .then(async () => {
        setErrors((prevErrors) => ({ ...prevErrors, [key]: '' }));
      })
      .catch((validationErrors) => {
        const newErrors = {};
        setErrors((prevErrors) => ({ ...prevErrors, [key]: '' }));
        validationErrors?.inner?.forEach((error) => {
          if (error?.path === key) newErrors[error?.path] = error.message;
        });
        setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
      });
  };

  const handleSubmit = async (e, redirect = true) => {
    e.preventDefault();
    validationSchema
      .validate(
        {
          name: name,
        },
        { abortEarly: false }
      )
      .then(async () => {
        setErrors({});
        try {
          const body = {
            name: name,
            description: description,
            isActive: isActive,
            created_by: parseInt(id),
            id: categoryId,
          };
          const result = await makeRequest(
            `${BASE_URL}/location/attachment-category/${categoryId}`,
            'PUT',
            body
          );
          const { status, response } = result;
          if (status === 'success') {
            categoryId
              ? redirect
                ? setSuccessUpdateModalPopUp(true)
                : toast.success(response, { autoClose: 3000 })
              : setSuccessModalPopUp(true);
          } else {
            toast.error(`${response?.message?.[0] ?? response}`, {
              autoClose: 3000,
            });
          }
        } catch (error) {
          toast.error(`${error?.message}`, { autoClose: 3000 });
        }
      })
      .catch((validationErrors) => {
        const newErrors = {};
        validationErrors?.inner?.forEach((error) => {
          newErrors[error?.path] = error.message;
        });
        setErrors(newErrors);
      });
  };

  const handleNameChange = (event) => {
    setUnsavedChanges(true);
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setUnsavedChanges(true);
    setDescription(event.target.value);
  };

  const handleIsActiveChange = (event) => {
    setUnsavedChanges(true);
    setIsActive(event.target.checked);
  };

  const handleCancelClick = () => {
    if (unsavedChanges) {
      setShowConfirmationDialog(true);
      showConfirmationDialog();
    } else {
      navigate(
        '/system-configuration/tenant-admin/crm-admin/location/attachment-categories/list'
      );
    }
  };
  //   const handleConfirmationResult = (confirmed) => {
  //     setShowConfirmationDialog(false);
  //     if (confirmed) {
  //       navigate(
  //         "/system-configuration/tenant-admin/organization-admin/resources/categories"
  //       );
  //     }
  //   };
  // Archive category
  const archiveCategory = async () => {
    try {
      const result = await fetch(
        `${BASE_URL}/location/attachment-category/${categoryId}`,
        {
          method: 'Delete',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      let { data, status, response } = await result.json();

      if (status === 'success') {
        // Handle successful response
        toast.success(response, { autoClose: 3000 });
        setModalPopUp(false);
        navigate(
          '/system-configuration/tenant-admin/crm-admin/location/attachment-categories/list'
        );
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        // Handle bad request
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
    { label: 'System Configuration', class: 'disable-label', link: '/' },
    {
      label: 'CRM Administration',
      class: 'disable-label',
      link: '/',
    },
    {
      label: 'Location',
      class: 'disable-label',
      link: '/',
    },
    {
      label: 'Attachment Categories',
      class: 'active-label',
      link: '/',
    },
  ];

  return (
    <div className="h-100 position-relative">
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Categories'}
        />
        <div className="mainContentInner mt-5">
          <form className={styles.category}>
            <div className="formGroup mt-5">
              <h5>{categoryId ? 'Edit Category' : 'Create Category'}</h5>

              <div className="form-field">
                <div className="field">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder=""
                    onBlur={handleOnBlur}
                    onChange={handleNameChange}
                    value={name}
                    required
                  />
                  <label>Name*</label>
                </div>
                {errors?.name && (
                  <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                    <p>{errors.name}</p>
                  </div>
                )}
              </div>

              <div className="col-12">
                <div className="field">
                  <textarea
                    type="text"
                    className="form-control"
                    placeholder="Description*"
                    name="description"
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </div>
              </div>

              <div className="form-field checkbox mt-3">
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

          {/* ... Confirmation dialog section ... */}
        </div>
      </div>
      <div className="form-footer-custom">
        {categoryId ? (
          <>
            <button
              className={`btn btn-danger archive-btn`}
              onClick={() => setModalPopUp(true)}
            >
              Archive
            </button>
            <button className="btn btn-link" onClick={handleCancelClick}>
              Cancel
            </button>
            <button className="btn btn-secondary" onClick={handleSubmit}>
              Update & Close
            </button>
            <button
              type="button"
              className={` ${`btn btn-primary`}`}
              onClick={(e) => handleSubmit(e, false)}
            >
              Update Changes
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-secondary  btn-border-none"
              onClick={handleCancelClick}
            >
              Cancel
            </button>

            <button
              type="button"
              className={` ${`btn btn-primary`}`}
              onClick={handleSubmit}
            >
              Create
            </button>
          </>
        )}
      </div>
      <SuccessPopUpModal
        title="Success!"
        message="Device created."
        modalPopUp={successModalPopUp}
        isNavigate={true}
        setModalPopUp={setSuccessModalPopUp}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/crm-admin/location/attachment-categories/list'
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message="Device updated."
        modalPopUp={successUpdateModalPopUp}
        isNavigate={true}
        setModalPopUp={setSuccessUpdateModalPopUp}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/crm-admin/location/attachment-categories/list'
        }
      />

      <PopUpModal
        title="Confirmation"
        message="Are you sure you want to archive?"
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        confirmAction={archiveCategory}
      />
    </div>
  );
};

export default CategoryUpsert;
