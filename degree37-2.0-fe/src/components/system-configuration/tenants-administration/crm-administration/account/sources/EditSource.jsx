import React, { useState, useEffect } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './index.module.scss';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import { fetchData } from '../../../../../../helpers/Api';
import FormInput from '../../../../../common/form/FormInput';
import FormText from '../../../../../common/form/FormText';
import { AccountBreadCrumbsData } from '../AccountBreadCrumbsData';

const EditSources = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: false,
  });

  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const [modalPopUp, setModalPopUp] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [successNavigate, setSuccessNavigate] = useState(false);
  const [sourceToArchive, setSourceToArchive] = useState(null);
  const [isArchived, setIsArchived] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);

  const handleOpenConfirmation = (id) => {
    setSourceToArchive(id);
    setModalPopUp(true);
  };

  const handleConfirmArchive = async () => {
    if (sourceToArchive) {
      const response = await fetchData(
        `/accounts/sources/${sourceToArchive}`,
        'PATCH'
      );

      if (response?.status === 'success') {
        setModalPopUp(false);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
      } else {
        toast.error(`${response?.message?.[0] ?? response?.response}`, {
          autoClose: 3000,
        });
      }
    }
    setModalPopUp(false);
  };

  useEffect(() => {
    if (id) {
      fetchSources(id);
    }
  }, [id]);

  const fetchSources = async (id) => {
    try {
      const response = await fetchData(`/accounts/sources/${id}`, 'GET');
      setFormData(response?.data || {});
    } catch (error) {
      toast.error('Failed to fetch Sources data.', { autoClose: 3000 });
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

    console.log(!formData[name]);
    if (!formData[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]:
          name === 'name' ? 'Name is required.' : 'Description is required.',
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

  const saveAndClose = async (e) => {
    setIsArchived(false);
    await handleSubmit(e);
    setSuccessNavigate(true);
  };

  const save = async (e) => {
    setIsArchived(false);
    await handleSubmit(e);
    setSuccessNavigate(false);
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
    };

    try {
      const response = await fetchData(`/accounts/sources/${id}`, 'PUT', body);

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
      label: 'Edit Source',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/crm-admin/accounts/sources/${id}/edit`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Edit Source'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form className={styles.formcontainer}>
          <div className="formGroup">
            <h5>Edit Source</h5>
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
                  checked={formData?.is_active}
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
      </div>
      <div className={`form-footer ${styles.editSource}`}>
        <button
          type="button"
          className={`me-auto ${styles.archive}`}
          onClick={() => {
            setIsArchived(true);
            handleOpenConfirmation(id);
          }}
        >
          Archive
        </button>
        <div className="d-flex align-items-center">
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
            className={` btn btn-md me-4 ${styles.saveandclose} `}
            onClick={(e) => saveAndClose(e)}
          >
            Save & Close
          </button>

          <button
            type="button"
            className={` btn btn-md me-4 ${styles.createbtn}  btn-primary`}
            onClick={(e) => save(e)}
          >
            Save Changes
          </button>
        </div>

        <SuccessPopUpModal
          title={isArchived ? 'Confirmation' : 'Success!'}
          message={
            isArchived ? 'Are you sure you want to archive?' : 'Source updated.'
          }
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={isArchived ? false : true}
          isArchived={isArchived}
          archived={handleConfirmArchive}
          isNavigate={successNavigate}
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
        <SuccessPopUpModal
          title="Success!"
          message="Source is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/crm-admin/accounts/sources'
          }
        />
      </div>
    </div>
  );
};

export default EditSources;
