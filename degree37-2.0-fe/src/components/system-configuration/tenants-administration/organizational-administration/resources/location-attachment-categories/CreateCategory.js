import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import BreadCrumbs from '../../../../../common/breadcrumbs';
import { makeRequest } from '../../../../../../utils';

const CreateCategory = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [successModal, setSuccessModal] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cancelModal, setCancelModal] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    description: '',
  });

  const navigate = useNavigate();
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleIsActiveChange = (event) => {
    setIsActive(event.target.checked);
  };

  const handleOnBlur = (key, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: value ? '' : 'Required',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        name,
        description,
        isActive: isActive,
        // type: "",
        created_by: 1,
        created_at: Date.now(),
      };

      setSuccessModal(true);
      const response = await makeRequest(
        `${BASE_URL}/location/attachment-category`,
        'POST',
        requestData
      );

      if (response.status === 201) {
        toast.success('Category created.', { autoClose: 3000 });
        navigate(
          '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types'
        );
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
      label: 'View Attachment Subcategory',
      class: 'disable-label',
      link: '/',
    },
  ];

  return (
    <div className="mainContent">
      <BreadCrumbs data={BreadcrumbsData} title={'Atttachment Subcategories'} />
      <div className="mainContentInner mt-5" style={{ height: '80vh' }}>
        <form onSubmit={handleSubmit}>
          <div
            className="formGroup mt-5 d-flex flex-column"
            style={{ width: '300px', height: '300px' }}
          >
            <div className="form-field w-100">
              <p style={{ color: 'black' }}>Create Attachment Category</p>

              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="vehicle_type_name"
                  placeholder=" "
                  onBlur={(e) => handleOnBlur('name', e.target.value)}
                  onChange={handleNameChange}
                  required
                />
                <label>Name*</label>
              </div>
              {errors.name && (
                <div className={`error`}>
                  <p>{errors.name}</p>
                </div>
              )}
            </div>

            <div className="form-field w-100 ">
              <div className="field">
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Description*"
                  name="description"
                  onBlur={(e) => handleOnBlur('description', e.target.value)}
                  onChange={handleDescriptionChange}
                  value={description}
                />
              </div>
              {errors.description && (
                <div className={`error `}>
                  <p>{errors.description}</p>
                </div>
              )}
            </div>

            <div className="form-field checkbox mb-0 w-100 ">
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
        <div className="form-footer position-absolute">
          <>
            <button
              className="btn btn-md btn-link me-0 pe-4"
              onClick={() => setCancelModal(true)}
            >
              Cancel
            </button>
          </>

          <>
            <button
              type="button"
              className="btn btn-md btn-primary"
              onClick={handleSubmit}
            >
              Save
            </button>
          </>
        </div>
      </div>
      <SuccessPopUpModal
        title="Success!"
        message="Attachment Category created."
        modalPopUp={successModal}
        isNavigate={true}
        setModalPopUp={setSuccessModal}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/crm-admin/location/attachment-categories/list'
        }
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={cancelModal}
        isNavigate={true}
        setModalPopUp={setCancelModal}
        redirectPath={
          '/system-configuration/tenant-admin/crm-admin/location/attachment-categories/list'
        }
      />
    </div>
  );
};

export default CreateCategory;
