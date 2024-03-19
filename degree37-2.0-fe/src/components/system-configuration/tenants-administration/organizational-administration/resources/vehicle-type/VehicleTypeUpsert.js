import React, { useState, useEffect } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate } from 'react-router-dom';
import styles from './vehicle-type.module.scss';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import handleInputChange from '../../../../../../helpers/handleInputChange';
import validateForm from '../../../../../../helpers/formValidation';
import SelectDropdown from '../../../../../common/selectDropdown';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';

const VehicleTypeUpsert = ({ vehicleTypeId }) => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [id, setId] = useState('');
  const [createdBy, setCreatedBy] = useState();
  const [isLinkable, setIsLinkable] = useState(true);
  const [isCollectionVehicle, setIsCollectionVehicle] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [archiveModal, setArchiveModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const [isStateDirty, setIsStateDirty] = useState(false);
  const [archivedStatus, setArchivedStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location_type_id: null,
    description: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    location_type_id: '',
    description: '',
  });
  const [locationTypeData] = useState([
    {
      value: 1,
      label: 'Outside',
    },
    {
      value: 2,
      label: 'Inside',
    },
    {
      value: 3,
      label: 'Combination',
    },
  ]);

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }

    if (vehicleTypeId) {
      fetchVehicleTypeData();
    }
  }, []);
  const fetchVehicleTypeData = async () => {
    const result = await fetch(`${BASE_URL}/vehicle-types/${vehicleTypeId}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setVehicleTypeData(data);
      setCreatedBy(data?.created_by?.id);
    } else {
      toast.error('Error Fetching Vehicle Type Details', { autoClose: 3000 });
    }
  };

  const setVehicleTypeData = (data) => {
    const matchingLocationType = locationTypeData.find(
      (item) => item.value === parseInt(data.location_type_id)
    );
    setFormData({
      name: data.name,
      location_type_id: matchingLocationType,
      description: data.description,
    });
    setIsLinkable(data.linkable);
    setIsCollectionVehicle(data.collection_vehicle);
    setIsActive(data.is_active);
  };

  const fieldNames = [
    { label: 'Name', name: 'name', required: true, maxLength: 50 },
    {
      label: 'Location Type',
      name: 'location_type_id',
      required: false,
    },
    {
      label: 'Description',
      name: 'description',
      required: true,
      maxLength: 500,
    },
  ];

  const handleChange = (e) => {
    setIsStateDirty(true);
    const { name, value } = e.target;
    handleInputChange(name, value, setFormData, fieldNames, setErrors);
  };

  // Function to handle form submission
  const handleSubmit = async (e, redirect = true) => {
    e.preventDefault();
    const valid = validateForm(formData, fieldNames, setErrors);

    if (valid) {
      let body = {};
      if (vehicleTypeId) {
        body = {
          ...formData,
          location_type_id: formData?.location_type_id?.value ?? null,
          linkable: isLinkable,
          collection_vehicle: isCollectionVehicle,
          is_active: isActive,
          updated_by: +id,
          created_by: +createdBy,
        };
      } else {
        body = {
          ...formData,
          location_type_id: formData?.location_type_id?.value ?? null,
          linkable: isLinkable,
          collection_vehicle: isCollectionVehicle,
          is_active: isActive,
          created_by: +id,
        };
      }
      try {
        setIsSubmitting(true);
        const bearerToken = localStorage.getItem('token');
        const res = await fetch(
          vehicleTypeId
            ? `${BASE_URL}/vehicle-types/${vehicleTypeId}`
            : `${BASE_URL}/vehicle-types`,
          {
            method: vehicleTypeId ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify(body),
          }
        );
        let { data, status, response } = await res.json();
        if (status === 'success') {
          // Handle successful response
          if (redirect) {
            setIsNavigate(true);
          }
          setSuccessModal(true);
          if (vehicleTypeId) {
            setVehicleTypeData(data);
          }
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
        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };

  // Function to handle changes in the "Linkable" checkbox
  const handleIsLinkableChange = (event) => {
    setIsStateDirty(true);
    setIsLinkable(event.target.checked);
  };

  const handleIsCollectionVehicleChange = (event) => {
    setIsStateDirty(true);
    setIsCollectionVehicle(event.target.checked);
  };

  // Function to handle changes in the "Active/Inactive" checkbox
  const handleIsActiveChange = (event) => {
    setIsStateDirty(true);
    setIsActive(event.target.checked);
  };
  const bearerToken = localStorage.getItem('token');
  const archiveVehicleType = async () => {
    try {
      const res = await fetch(`${BASE_URL}/vehicle-types/${vehicleTypeId}`, {
        method: 'Delete',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      let { data, status, response } = await res.json();
      if (status === 'success') {
        // Handle successful response
        setArchiveModal(false);
        setTimeout(() => {
          setArchivedStatus(true);
        }, 600);
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        setArchiveModal(false);

        // Handle bad request
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        setArchiveModal(false);
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
      setArchiveModal(false);
    }
  };
  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: vehicleTypeId ? 'Edit Vehicle Type' : 'Create Vehicle Type',
      class: 'active-label',
      link: vehicleTypeId
        ? `/system-configuration/tenant-admin/organization-admin/resources/vehicle-types/${vehicleTypeId}/edit`
        : '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types/create',
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Vehicle Type'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form className={styles.vehicleType}>
          <div className="formGroup">
            <h5>
              {vehicleTypeId ? 'Edit Vehicle Type' : 'Create Vehicle Type'}
            </h5>

            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder=" "
                  onBlur={handleChange}
                  onChange={handleChange}
                  value={formData.name}
                  required
                />
                <label>Name*</label>
              </div>
              {errors.name && (
                <div className={`error ${styles.errorcolor}`}>
                  <p>{errors.name}</p>
                </div>
              )}
            </div>

            <SelectDropdown
              name={'location_type_id'}
              placeholder="Location Type"
              options={locationTypeData}
              selectedValue={formData?.location_type_id}
              onChange={(option) => {
                setFormData({ ...formData, location_type_id: option });
              }}
              required={false}
              error={errors.location_type_id}
              showLabel
              removeDivider
            />

            <div className="form-field w-100">
              <div className="field">
                {formData.description && (
                  <label
                    style={{ fontSize: '12px', top: '10%', color: '#555555' }}
                  >
                    Description*
                  </label>
                )}
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Description*"
                  name="description"
                  value={formData.description}
                  onBlur={handleChange}
                  onChange={handleChange}
                />
              </div>
              {errors.description && (
                <div className={`error ${styles.errorcolor}`}>
                  <p>{errors.description}</p>
                </div>
              )}
            </div>

            <div className="form-field checkbox mb-0">
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
            <div style={{ width: '12%' }}></div>
            <div
              className="form-field checkbox justify-content-end mb-0"
              style={{ width: '23%' }}
            >
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="is_linkable"
                checked={isCollectionVehicle}
                onChange={handleIsCollectionVehicleChange}
              />
              <label className="form-check-label" htmlFor="is_goal_type">
                Collection Vehicle
              </label>
            </div>
            <div
              className="form-field checkbox justify-content-end mb-0"
              style={{ width: '15%' }}
            >
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="is_linkable"
                checked={isLinkable}
                onChange={handleIsLinkableChange}
              />
              <label className="form-check-label" htmlFor="is_goal_type">
                Linkable
              </label>
            </div>
          </div>
        </form>
        <div className="form-footer">
          {vehicleTypeId ? (
            <>
              <div className="archived" onClick={() => setArchiveModal(true)}>
                Archive
              </div>
              <button
                className="btn btn-md btn-link me-0 pe-4"
                onClick={() =>
                  isStateDirty
                    ? setCancelModal(true)
                    : navigate(
                        '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types'
                      )
                }
              >
                Cancel
              </button>
              <button
                className="btn btn-md me-4 btn-secondary"
                onClick={handleSubmit}
              >
                Save & Close
              </button>
              <button
                type="button"
                className={`btn btn-md me-4 ${` btn-primary`}`}
                onClick={(e) => handleSubmit(e, false)}
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-md btn-link me-0 pe-4"
                onClick={() =>
                  isStateDirty
                    ? setCancelModal(true)
                    : navigate(
                        '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types'
                      )
                }
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                className="btn btn-md btn-primary"
                onClick={handleSubmit}
              >
                Create
              </button>
            </>
          )}
        </div>
      </div>
      <SuccessPopUpModal
        title={archiveModal ? 'Confirmation' : 'Success!'}
        message={
          archiveModal
            ? 'Are you sure you want to archive?'
            : vehicleTypeId
            ? 'Vehicle Type updated.'
            : 'Vehicle Type created.'
        }
        modalPopUp={successModal || archiveModal}
        setModalPopUp={archiveModal ? setArchiveModal : setSuccessModal}
        showActionBtns={archiveModal ? false : true}
        isArchived={archiveModal}
        archived={archiveVehicleType}
        isNavigate={isNavigate}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types'
        }
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={cancelModal}
        isNavigate={true}
        setModalPopUp={setCancelModal}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types'
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message="Vehicle Type is archived."
        modalPopUp={archivedStatus}
        isNavigate={true}
        setModalPopUp={setArchivedStatus}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types'
        }
      />
    </div>
  );
};

export default VehicleTypeUpsert;
