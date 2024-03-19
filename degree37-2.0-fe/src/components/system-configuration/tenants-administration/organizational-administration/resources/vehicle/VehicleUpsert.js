import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate } from 'react-router-dom';
import styles from './vehicle.module.scss';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import SelectDropdown from '../../../../../common/selectDropdown';
import { fetchData } from '../../../../../../helpers/Api';
import handleInputChange from '../../../../../../../src/helpers/handleInputChange';
import validateForm from '../../../../../../helpers/formValidation';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';

const VehicleUpsert = ({ vehicleId }) => {
  const bearerToken = localStorage.getItem('token');
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [id, setId] = useState('');
  const [archiveModal, setArchiveModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [isStateDirty, setIsStateDirty] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const [archivedStatus, setArchivedStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    short_name: '',
    vehicle_type: '',
    collection_operation_id: '',
    certification: '',
    description: '',
  });

  const [vehicles, setVechicles] = useState({
    name: '',
    short_name: '',
    description: '',
    collection_operation_id: null,
    vehicle_type: null,
  });

  const fieldNames = [
    { label: 'Name', name: 'name', required: true, maxLength: 50 },
    {
      label: 'Short Name',
      name: 'short_name',
      required: true,
      maxLength: 500,
    },
    {
      label: 'Description',
      name: 'description',
      required: true,
      maxLength: 500,
    },
    {
      label: 'Collection Operation',
      name: 'collection_operation_id',
      required: true,
    },
    {
      label: 'Vehicle Type',
      name: 'vehicle_type',
      required: true,
    },
  ];

  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: vehicleId ? 'Edit Vehicle' : 'Create Vehicle',
      class: 'active-label',
      link: vehicleId
        ? `/system-configuration/tenant-admin/organization-admin/resources/vehicles/${vehicleId}/edit`
        : '/system-configuration/tenant-admin/organization-admin/resources/vehicles/create',
    },
  ];

  const handleIsActiveChange = (event) => {
    setIsStateDirty(true);
    setIsActive(event.target.checked);
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');

    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }

    getCollectionOperations();
    getVehicleTypesData();
    getCertifications();
    if (vehicleId) {
      getVehicleData();
    }
  }, []);

  const getVehicleData = async () => {
    const result = await fetch(`${BASE_URL}/vehicles/${vehicleId}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setVechicles({
        name: data.vehicle?.name,
        short_name: data.vehicle?.short_name,
        description: data.vehicle?.description,
        collection_operation_id: {
          value: data.vehicle?.collection_operation_id?.id,
          label: data.vehicle?.collection_operation_id?.name,
        },
        vehicle_type: {
          value: data.vehicle?.vehicle_type_id?.id,
          label: data.vehicle?.vehicle_type_id?.name,
        },
      });
      setSelectedCertifications(
        data.certifications.map((certification) => ({
          name: certification.certification.name,
          id: certification.certification_id,
        }))
      );
    } else {
      toast.error('Error Fetching Vehicle Details', { autoClose: 3000 });
    }
  };

  const getVehicleTypesData = async () => {
    const result = await fetch(
      `${BASE_URL}/vehicle-types?fetchAll=true&status=true`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    const data = await result.json();
    setVehicleTypes(data?.data);
  };

  const getCollectionOperations = async () => {
    const bearerToken = localStorage.getItem('token');
    const result = await fetch(
      `${BASE_URL}/business_units/collection_operations/list?status=true`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setCollectionOperationData(data);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  const getCertifications = () => {
    fetchData(`/staffing-admin/certification/list`, 'GET', {
      associationType: 'VEHICLE',
    })
      .then((res) => {
        setCertifications(res?.data?.records || []);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    handleInputChange(name, value, setVechicles, fieldNames, setErrors);
  };

  function titleCase(valueArray) {
    const fieldValue = valueArray.map((value) => ({
      ...value,
      label: value.label[0].toUpperCase() + value.label.slice(1).toLowerCase(),
    }));
    return fieldValue;
  }

  // Function to handle form submission
  const handleSubmit = async (e, redirect = true) => {
    e.preventDefault();

    const valid = validateForm(vehicles, titleCase(fieldNames), setErrors);

    if (valid) {
      let body = {};
      if (vehicleId) {
        body = {
          name: vehicles.name,
          short_name: vehicles.short_name,
          description: vehicles.description,
          vehicle_type_id: parseInt(vehicles.vehicle_type?.value),
          collection_operation_id: parseInt(
            vehicles.collection_operation_id?.value
          ),
          certifications: selectedCertifications.map((certif) => certif.id),
          is_active: isActive,
          created_by: +id,
        };
      } else {
        body = {
          name: vehicles.name,
          short_name: vehicles.short_name,
          description: vehicles.description,
          vehicle_type_id: parseInt(vehicles.vehicle_type?.value),
          collection_operation_id: parseInt(
            vehicles.collection_operation_id?.value
          ),
          certifications: selectedCertifications.map((certif) => certif.id),
          is_active: isActive,
          created_by: +id,
        };
      }
      try {
        setIsSubmitting(true);
        const bearerToken = localStorage.getItem('token');
        const res = await fetch(
          vehicleId
            ? `${BASE_URL}/vehicles/${vehicleId}`
            : `${BASE_URL}/vehicles`,
          {
            method: vehicleId ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify(body),
          }
        );
        let resJson = await res.json();
        let { data, status, response } = resJson;
        if (resJson?.statusCode === 400) {
          toast.error(`${resJson?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
        } else if (status === 'success') {
          // Handle successful response
          if (redirect) {
            setIsNavigate(true);
          }
          setSuccessModal(true);
          if (vehicleId) {
            setSelectedCertifications(
              data.certifications.map((certification) => ({
                label: certification.certification.name,
                value: certification.certification_id,
              }))
            );
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

  const archiveVehicle = async () => {
    try {
      const bearerToken = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/vehicles/${vehicleId}`, {
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

  const handleCertificationChangeAll = (data) => {
    setIsStateDirty(true);
    setSelectedCertifications(data);
  };

  const handleCertificationsChange = (certificationTemp) => {
    setIsStateDirty(true);
    let tempCo = [...selectedCertifications];
    tempCo = tempCo.some((item) => item.id === certificationTemp.id)
      ? tempCo.filter((item) => item.id !== certificationTemp.id)
      : [...tempCo, certificationTemp];
    setSelectedCertifications(tempCo);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={vehicleId ? 'Edit Vehicle' : 'Create Vehicle'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form className={styles.vehicle}>
          <div className="formGroup">
            <h5>{vehicleId ? 'Edit Vehicle' : 'Create Vehicle'}</h5>

            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder=" "
                  onBlur={handleChange}
                  onChange={handleChange}
                  value={vehicles.name}
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

            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="short_name"
                  placeholder=" "
                  onBlur={handleChange}
                  onChange={handleChange}
                  value={vehicles.short_name}
                  required
                />
                <label>Short Name*</label>
              </div>
              {errors?.short_name && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.short_name}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field w-100">
                <SelectDropdown
                  styles={{ root: 'w-100 m-0' }}
                  placeholder={'Collection Operation*'}
                  defaultValue={vehicles.collection_operation_id}
                  selectedValue={vehicles.collection_operation_id}
                  removeDivider
                  showLabel
                  onChange={(val) => {
                    let e = {
                      target: {
                        name: 'collection_operation_id',
                        value: val,
                      },
                    };
                    handleChange(e);
                  }}
                  options={
                    collectionOperationData.length > 0
                      ? collectionOperationData.map((item) => {
                          return {
                            label: item.name,
                            value: item.id,
                          };
                        })
                      : []
                  }
                />
              </div>
              {errors?.collection_operation_id && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.collection_operation_id}</p>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field w-100">
                <SelectDropdown
                  styles={{ root: 'w-100 m-0' }}
                  placeholder={'Vehicle Type*'}
                  defaultValue={vehicles.vehicle_type}
                  selectedValue={vehicles.vehicle_type}
                  removeDivider
                  showLabel
                  onChange={(val) => {
                    let e = {
                      target: {
                        name: 'vehicle_type',
                        value: val,
                      },
                    };
                    handleChange(e);
                  }}
                  options={
                    vehicleTypes.length > 0
                      ? vehicleTypes.map((item) => {
                          return {
                            label: item.name,
                            value: item.id,
                          };
                        })
                      : []
                  }
                />
              </div>
              {errors?.vehicle_type && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.vehicle_type}</p>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field w-100">
                <GlobalMultiSelect
                  label="Certifications"
                  data={certifications.map((certif) => ({
                    name: certif.name,
                    id: certif.id,
                  }))}
                  selectedOptions={selectedCertifications}
                  onChange={handleCertificationsChange}
                  onSelectAll={handleCertificationChangeAll}
                />
              </div>
            </div>

            <div className="form-field w-100">
              <div className="field">
                {vehicles.description && (
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
                  onBlur={handleChange}
                  onChange={handleChange}
                  value={vehicles.description}
                />
              </div>
              {errors?.description && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.description}</p>
                </div>
              )}
            </div>

            <div className="form-field checkbox">
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
      </div>
      <div className="form-footer">
        {vehicleId ? (
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
                      '/system-configuration/tenant-admin/organization-admin/resources/vehicles'
                    )
              }
            >
              Cancel
            </button>
            <button className="btn btn-md btn-secondary" onClick={handleSubmit}>
              Save & Close
            </button>
            <button
              type="button"
              className="btn btn-md btn-primary"
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
                      '/system-configuration/tenant-admin/organization-admin/resources/vehicles'
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
      <SuccessPopUpModal
        title={archiveModal ? 'Confirmation' : 'Success!'}
        message={
          archiveModal
            ? 'Are you sure you want to archive?'
            : vehicleId
            ? 'Vehicle updated.'
            : 'Vehicle created.'
        }
        modalPopUp={successModal || archiveModal}
        setModalPopUp={archiveModal ? setArchiveModal : setSuccessModal}
        showActionBtns={archiveModal ? false : true}
        isArchived={archiveModal}
        archived={archiveVehicle}
        isNavigate={isNavigate}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resources/vehicles'
        }
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={cancelModal}
        isNavigate={true}
        setModalPopUp={setCancelModal}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resources/vehicles'
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message="Vehicle is archived."
        modalPopUp={archivedStatus}
        isNavigate={true}
        setModalPopUp={setArchivedStatus}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resources/vehicles'
        }
      />
    </div>
  );
};

export default VehicleUpsert;
