/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import { Col, Row } from 'react-bootstrap';
import jwt from 'jwt-decode';
import styles from './index.module.scss';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import handleInputChange from '../../../../../../helpers/handleInputChange';
import validateForm from '../../../../../../helpers/formValidation';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import SelectDropdown from '../../../../../common/selectDropdown';

const EditDeviceType = () => {
  const bearerToken = localStorage.getItem('token');
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const params = useParams();
  const navigate = useNavigate();
  const [typeData, setTypeData] = useState({
    name: '',
    procedure_type: null,
    description: '',
    status: true,
  });
  const [modalPopUp, setModalPopUp] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [archivedStatus, setArchivedStatus] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    procedure_type: '',
    description: '',
  });
  const [id, setId] = useState('');
  const [typeProcedure, setTypeProcedure] = useState([]);

  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'Device Type',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/organization-admin/resource/device-type',
    },
    {
      label: 'Edit',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/organization-admin/resource/device-type/edit',
    },
  ];

  const getProcedureType = async () => {
    const result = await fetch(`${BASE_URL}/procedure_types?fetchAll=true`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });
    const data = await result.json();
    setTypeProcedure(data?.data);
  };
  const getEditData = async () => {
    const result = await fetch(
      `${BASE_URL}/system-configuration/device-type/${params.id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    const data = await result.json();
    const addTenantUpdates = {
      name: data?.data?.name,
      procedure_type: {
        value: data?.data?.procedure_type?.id,
        label: data?.data?.procedure_type?.name,
      },
      description: data?.data?.description,
      procedureName: data?.data?.procedure_type?.name,
      status: data?.data?.status,
      created_by: +data?.data?.created_by?.id,
    };
    setTypeData(addTenantUpdates);
  };
  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      // setToken(jwtToken);
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }
    getProcedureType();
    getEditData();
  }, []);

  const handleFormInput = (event) => {
    const { value, name, checked } = event.target;
    const parsedValue = name === 'procedure_type' ? +value : value;
    if (name === 'status') {
      setTypeData({ ...typeData, [name]: checked });
    } else {
      setTypeData({ ...typeData, [name]: parsedValue });
    }
  };

  const fieldNames = [
    { label: 'Name', name: 'name', required: true, maxLength: 50 },
    {
      label: 'Description',
      name: 'description',
      required: true,
      maxLength: 500,
    },
    {
      label: 'Procedure Type',
      name: 'procedure_type',
      required: true,
    },
  ];

  function titleCase(valueArray) {
    const fieldValue = valueArray.map((value) => ({
      ...value,
      label: value.label[0].toUpperCase() + value.label.slice(1).toLowerCase(),
    }));
    return fieldValue;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(name, value, setTypeData, fieldNames, setErrors);
  };

  const handleSubmit = async () => {
    const isValid = validateForm(typeData, titleCase(fieldNames), setErrors);

    if (isValid) {
      let editBody = {
        ...typeData,
        procedure_type: +typeData.procedure_type.value,
        updated_by: +id,
        id: +params.id,
      };
      delete editBody.procedureName;
      try {
        const bearerToken = localStorage.getItem('token');
        const response = await fetch(
          `${BASE_URL}/system-configuration/device-type/edit`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify(editBody),
          }
        );
        let data = await response.json();
        if (data.status === 'success') {
          setModalPopUp(true);
        } else if (response?.status === 400) {
          toast.error(`${data?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
        } else {
          toast.error(`${data?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
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
      let archiveData = {
        id: +params.id, // device type id
        is_archive: true,
      };
      const bearerToken = localStorage.getItem('token');
      const response = await fetch(
        `${BASE_URL}/system-configuration/device-type/archive`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify(archiveData),
        }
      );
      const res = await response.json();
      if (res.status === 'success') {
        setModalPopUp(false);
        setTimeout(() => {
          setArchivedStatus(true);
        }, 600);
      }
    } catch (error) {
      toast.error(`${error?.response || 'Some thing went wrong'}`, {
        autoClose: 3000,
      });
    }
  };

  let isDisabled =
    typeData.name &&
    typeData.procedure_type &&
    typeData.description &&
    !errors.name &&
    !errors.procedure_type &&
    !errors.description;

  isDisabled = Boolean(isDisabled);

  return (
    <div className={`position-relative ${styles.footerminheight}`}>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Device Type'}
        />
        <div className="mainContentInner form-container">
          <form className={`adddevicetype ${styles.formcontainer}`}>
            <div className="formGroup">
              <h5>Edit Device Type</h5>
              <Row className={`mb-4 ${styles.rows}`}>
                <Col lg={6}>
                  <div className="form-field w-100">
                    <div className="field">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={typeData.name}
                        onBlur={handleChange}
                        placeholder=""
                        onChange={handleChange}
                        required
                      />
                      <label className="text-secondary">Name*</label>
                    </div>
                    {errors.name && (
                      <div className={`error ${styles.errorcolor}`}>
                        <p>{errors.name}</p>
                      </div>
                    )}
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="form-field w-100">
                    <div className="field w-100">
                      <SelectDropdown
                        styles={{ root: 'w-100 m-0' }}
                        placeholder={'Procedure Type*'}
                        defaultValue={typeData.procedure_type}
                        selectedValue={typeData.procedure_type}
                        removeDivider
                        showLabel
                        onChange={(val) => {
                          let e = {
                            target: {
                              name: 'procedure_type',
                              value: val,
                            },
                          };
                          handleChange(e);
                        }}
                        options={
                          typeProcedure.length > 0
                            ? typeProcedure.map((item) => {
                                return {
                                  label: item.name,
                                  value: item.id,
                                };
                              })
                            : []
                        }
                      />
                    </div>
                    {errors.procedure_type && (
                      <div className={`error ${styles.errorcolor}`}>
                        <p>{errors.procedure_type}</p>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              <Row className={`mb-4 ${styles.rows}`}>
                <Col lg={12}>
                  <div className="form-field w-100">
                    <div className="field">
                      <textarea
                        type="text"
                        className={`form-control ${styles.description}`}
                        value={typeData.description}
                        name="description"
                        onBlur={handleChange}
                        placeholder="Description"
                        onChange={handleChange}
                        required
                        rows={5}
                      />
                    </div>
                    {errors.description && (
                      <div className={`error ${styles.errorcolor}`}>
                        <p>{errors.description}</p>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
              <div className="form-field checkbox">
                <span className="toggle-text">
                  {typeData?.status ? 'Active' : 'Inactive'}
                </span>
                <label htmlFor="toggle" className="switch">
                  <input
                    type="checkbox"
                    id="toggle"
                    className="toggle-input"
                    checked={typeData?.status}
                    name="status"
                    onChange={(e) => {
                      handleFormInput(e);
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
            onClick={saveAndClose}
            disabled={!isDisabled}
          >
            Save & Close
          </button>
          <button
            type="button"
            className={` ${`btn btn-primary btn btn-md me-4 ${styles.createbtn}`}`}
            onClick={saveChanges}
            disabled={!isDisabled}
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
            : 'Device Type updated.'
        }
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={isArchived ? false : true}
        isArchived={isArchived}
        archived={archieveHandle}
        isNavigate={isNavigate}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resource/device-type'
        }
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resource/device-type'
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message="Device Type is archived."
        modalPopUp={archivedStatus}
        isNavigate={true}
        setModalPopUp={setArchivedStatus}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/organization-admin/resource/device-type'
        }
      />
    </div>
  );
};

export default EditDeviceType;
