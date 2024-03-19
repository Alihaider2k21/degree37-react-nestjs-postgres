import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../../../../common/topbar/index';
import jwt from 'jwt-decode';
import styles from './index.module.scss';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../common/successModal';
import CancelModalPopUp from '../../../../common/cancelModal';
import { makeAuthorizedApiRequestAxios } from '../../../../../helpers/Api';
import SelectDropdown from '../../../../common/selectDropdown';
import FormInput from '../../../../common/form/FormInput';
import FormText from '../../../../common/form/FormText';
import { GeoAdministrationBreadCrumbsData } from '../GeoAdministrationBreadCrumbsData';

const EditTerritory = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const params = useParams();

  const [formData, setFormData] = useState({
    territory_name: '',
    tenant_id: '',
    description: '',
    status: true,
  });
  const [modalPopUp, setModalPopUp] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [archiveStatus, setArchiveStatus] = useState(false);
  const [errors, setErrors] = useState({
    territory_name: '',
  });
  //const [id, setId] = useState("");
  const [recruiters, setRecruiters] = useState([]);
  const [tenantId, setTenantId] = useState('');

  const BreadcrumbsData = [
    ...GeoAdministrationBreadCrumbsData,
    {
      label: 'Edit Territory',
      class: 'disable-label',
      link: `/system-configuration/tenant-admin/geo-admin/territories/${+params.id}/edit`,
    },
  ];

  const getRecruiters = async () => {
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

  const getTerritoryData = async () => {
    const result = await makeAuthorizedApiRequestAxios(
      'GET',
      `${BASE_URL}/territories/${params.id}`
    );
    const data = result.data;

    const addTerritoryUpdates = {
      territory_name: data?.data?.territory_name,
      description: data?.data?.description,
      status: data?.data?.status,
    };
    setFormData(addTerritoryUpdates);
    setTenantId({
      label: `${data?.data?.recruiter?.first_name} ${data?.data?.recruiter?.last_name}`,
      value: +data?.data?.recruiter?.id,
    });
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      // setToken(jwtToken);
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        //setId(decodeToken?.id);
      }
    }
    getRecruiters();
    getTerritoryData();
  }, []);

  const handleSubmit = async (e) => {
    const isValid = validateForm();

    if (isValid) {
      const body = {
        territory_name: formData.territory_name,
        description: formData.description,
        recruiter: tenantId ? +tenantId.value : null,
        status: formData.status,
      };

      try {
        try {
          const res = await makeAuthorizedApiRequestAxios(
            'PUT',
            `${BASE_URL}/territories/${+params.id}`,
            JSON.stringify(body)
          );
          let { status_code, response } = res.data;

          if (status_code === 204) {
            setModalPopUp(true);
          } else {
            toast.error(response, {
              autoClose: 3000,
            });
          }
        } catch (error) {
          toast.error(`${error?.message}`, { autoClose: 3000 });
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

      if (fieldDefinition?.required && value?.toString().trim() === '') {
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

  const handleCheckboxChange = (e, name) => {
    const { checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
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

    if (fieldDefinition?.required && value?.toString().trim() === '') {
      errorMessage = `${fieldDefinition.label} is required.`;
    }

    if (
      fieldDefinition?.maxLength &&
      value?.length > fieldDefinition?.maxLength
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
    setTenantId(val);
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

  const saveAndClose = async () => {
    setIsArchived(false);
    await handleSubmit();
    setIsNavigate(true);
  };

  const saveChanges = async () => {
    setIsArchived(false);
    await handleSubmit();
  };

  const archieveHandle = async () => {
    try {
      const res = await makeAuthorizedApiRequestAxios(
        'PATCH',
        `${BASE_URL}/territories/${+params.id}`
      );
      let { data, status, response } = res.data;
      if (status === 'success') {
        // Handle successful response
        setModalPopUp(false);
        setTimeout(() => {
          setArchiveStatus(true);
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

  return (
    <div className={`position-relative ${styles.footerminheight}`}>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Territory Management'}
        />
        <div className="mainContentInner form-container">
          <form className={`adddevicetype ${styles.formcontainer}`}>
            <div className="formGroup">
              <h5>Edit Territory</h5>
              <FormInput
                label="Territory Name"
                displayName="Territory Name"
                name="territory_name"
                error={errors?.territory_name}
                required
                value={formData?.territory_name}
                onChange={handleInputChange}
              />
              <SelectDropdown
                placeholder="Recruiter*"
                name="recruiter"
                options={recruiters?.map((item) => ({
                  value: item?.id,
                  label: `${item?.first_name} ${item?.last_name}`,
                }))}
                removeDivider
                showLabel
                selectedValue={tenantId}
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
              <div className="form-field checkbox">
                <span className="toggle-text">
                  {formData.status ? 'Active' : 'Inactive'}
                </span>
                <label htmlFor="toggle" className="switch">
                  <input
                    type="checkbox"
                    id="toggle"
                    className="toggle-input"
                    checked={formData?.status}
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
        </div>
      </div>
      <div className="form-footer-custom">
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
            className={`btn btn-link ${styles.footercancelbtn}`}
            onClick={(e) => {
              e.preventDefault();
              setCloseModal(true);
            }}
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
            : 'Territory updated.'
        }
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={isArchived ? false : true}
        isArchived={isArchived}
        archived={archieveHandle}
        isNavigate={isNavigate}
        redirectPath={
          '/system-configuration/tenant-admin/geo-admin/territories/list'
        }
      />

      <SuccessPopUpModal
        title="Success!"
        message="Territory is archived."
        modalPopUp={archiveStatus}
        isNavigate={true}
        setModalPopUp={setArchiveStatus}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/geo-admin/territories/list'
        }
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={
          '/system-configuration/tenant-admin/geo-admin/territories/list'
        }
      />
    </div>
  );
};

export default EditTerritory;
