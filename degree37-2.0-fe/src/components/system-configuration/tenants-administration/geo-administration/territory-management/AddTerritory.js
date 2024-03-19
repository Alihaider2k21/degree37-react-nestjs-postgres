import React, { useState, useEffect } from 'react';
import jwt from 'jwt-decode';
import TopBar from '../../../../common/topbar/index';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../common/successModal';
import CancelModalPopUp from '../../../../common/cancelModal';
import { makeAuthorizedApiRequestAxios } from '../../../../../helpers/Api';
import SelectDropdown from '../../../../common/selectDropdown';
import FormInput from '../../../../common/form/FormInput';
import FormText from '../../../../common/form/FormText';
import { GeoAdministrationBreadCrumbsData } from '../GeoAdministrationBreadCrumbsData';

const AddTerritory = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    territory_name: '',
    description: '',
    status: true,
    recruiter: '',
  });

  const [recruiters, setRecruiters] = useState([]);
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState('');
  const [modalPopUp, setModalPopUp] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [recruiterId, setRecruiterId] = useState(null);

  useEffect(() => {
    fetchRecruiters();
    getLoginUserId();
  }, []);

  const getLoginUserId = () => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      // setToken(jwtToken);
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setUserId(decodeToken?.id);
      }
    }
  };

  const fetchRecruiters = async () => {
    try {
      const response = await makeAuthorizedApiRequestAxios(
        'GET',
        `${BASE_URL}/tenant-users/recruiters`
      );
      const data = response.data;
      setRecruiters(data?.data);
    } catch (error) {
      console.error('Error Territory Create:', error);
    }
  };

  const handleCheckboxChange = (e, name) => {
    const { checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
  };

  let hasData = formData.territory_name || formData.description;

  hasData = Boolean(hasData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      const body = {
        territory_name: formData.territory_name,
        description: formData.description,
        recruiter: recruiterId ? +recruiterId.value : null,
        status: formData.status,
        created_by: +userId,
      };

      try {
        const res = await makeAuthorizedApiRequestAxios(
          'POST',
          `${BASE_URL}/territories`,
          JSON.stringify(body)
        );
        let { status_code, response } = res.data;

        if (status_code === 201) {
          setModalPopUp(true);
        } else {
          toast.error(response, {
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };

  const fieldNames = [
    {
      label: 'Territory name',
      name: 'territory_name',
      required: true,
      maxLength: 50,
    },
    {
      label: 'Description',
      name: 'description',
      required: true,
      maxLength: 500,
    },
    {
      label: 'Recruiter',
      name: 'recruiter',
      required: true,
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

      if (
        fieldDefinition?.required &&
        (value?.toString().trim() === '' || value === null)
      ) {
        errorMessage = `${fieldDefinition.label} is required.`;
      }

      if (
        fieldDefinition?.maxLength &&
        value?.length > fieldDefinition?.maxLength
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
    setError(name, errorMessage);
  };

  const handleDropdownChange = (val) => {
    setRecruiterId(val);
    let e = {
      target: {
        name: 'recruiter',
      },
    };
    if (val) {
      e.target.value = val.label;
    } else {
      e.target.value = '';
    }
    handleInputChange(e);
  };

  const BreadcrumbsData = [
    ...GeoAdministrationBreadCrumbsData,
    {
      label: 'Create Territory',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/geo-admin/territories/create',
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Territory Management'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form className={styles.formcontainer}>
          <div className="formGroup">
            <h5>Create Territory</h5>
            <FormInput
              label="Territory Name"
              displayName="Territory Name"
              name="territory_name"
              error={errors?.territory_name}
              required
              value={formData?.territory_name}
              onChange={handleInputChange}
            />
            {/* Custom Select Field */}
            <SelectDropdown
              placeholder="Recruiter*"
              name="recruiter"
              options={recruiters?.map((item) => ({
                value: item?.id,
                label: `${item?.first_name} ${item?.last_name}`,
              }))}
              removeDivider
              showLabel
              selectedValue={recruiterId}
              onChange={(val) => {
                handleDropdownChange(val);
              }}
              error={errors.recruiter}
              required={true}
            />

            <FormText
              name="description"
              displayName="Description"
              value={formData?.description}
              error={errors?.description}
              classes={{ root: 'w-100' }}
              required
              onChange={handleInputChange}
              onBlur={handleInputChange}
            />
            <div className="form-field checkbox w-100">
              <span className="toggle-text">
                {formData.status ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  value={formData.status}
                  checked={formData.status}
                  name="status"
                  onChange={(e) => {
                    handleCheckboxChange(e, 'status');
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
                    '/system-configuration/tenant-admin/geo-admin/territories/list'
                  )
                : setCloseModal(true);
            }}
          >
            Cancel
          </p>

          <button
            type="button"
            className={`btn btn-md me-4 ${styles.createbtn} ${'btn-primary'}`}
            onClick={(e) => handleSubmit(e)}
          >
            Create
          </button>

          <SuccessPopUpModal
            title="Success!"
            message="Territory created."
            modalPopUp={modalPopUp}
            isNavigate={true}
            setModalPopUp={setModalPopUp}
            showActionBtns={true}
            redirectPath={
              '/system-configuration/tenant-admin/geo-admin/territories/list'
            }
          />
          <CancelModalPopUp
            title="Confirmation"
            message="Unsaved changes will be lost. Do you want to continue?"
            modalPopUp={closeModal}
            isNavigate={true}
            setModalPopUp={setCloseModal}
            redirectPath={
              '/system-configuration/tenant-admin/geo-admin/territories/list'
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AddTerritory;
