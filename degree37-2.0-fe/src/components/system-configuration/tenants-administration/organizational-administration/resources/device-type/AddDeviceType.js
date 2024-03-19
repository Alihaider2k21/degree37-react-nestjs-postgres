/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import jwt from 'jwt-decode';
import styles from './index.module.scss';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import handleInputChange from '../../../../../../helpers/handleInputChange';
import validateForm from '../../../../../../helpers/formValidation';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import SelectDropdown from '../../../../../common/selectDropdown';

const AddDeviceType = () => {
  const bearerToken = localStorage.getItem('token');
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [closeModal, setCloseModal] = useState(false);
  const [typeData, setTypeData] = useState({
    name: '',
    procedure_type: null,
    description: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    procedure_type: '',
    description: '',
  });
  const [id, setId] = useState('');
  const [modalPopUp, setModalPopUp] = useState(false);
  const [typeProcedure, setTypeProcedure] = useState([]);
  const [status, setStatus] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const BreadcrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'Device Type',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/organization-admin/resource/device-type',
    },
    {
      label: 'Create',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/organization-admin/resource/device-type/create',
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

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }
    getProcedureType();
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(name, value, setTypeData, fieldNames, setErrors);
  };

  function titleCase(valueArray) {
    const fieldValue = valueArray.map((value) => ({
      ...value,
      label: value.label[0].toUpperCase() + value.label.slice(1).toLowerCase(),
    }));
    return fieldValue;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm(typeData, titleCase(fieldNames), setErrors);

    if (isValid) {
      let body = {
        ...typeData,
        procedure_type: +typeData.procedure_type.value,
        created_by: +id,
        status,
      };
      try {
        setIsSubmitting(true);
        const response = await fetch(
          `${BASE_URL}/system-configuration/device-type/create`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify(body),
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
        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Device Type'}
      />
      <div className="mainContentInner form-container">
        <form className={`adddevicetype ${styles.formcontainer}`}>
          <div className="formGroup">
            <h5>Create Device Type</h5>
            <Row className={`mb-4 ${styles.rows}`}>
              <Col lg={6}>
                <div className="form-field">
                  <div className={`field ${styles.devicetypeselectfields}`}>
                    <input
                      type="text"
                      className={`form-control ${styles.devicetypeinputfields}`}
                      value={typeData.name}
                      name="name"
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
                          ? typeProcedure
                              .filter((item) => item.is_active)
                              .map((item) => ({
                                label: item.name,
                                value: item.id,
                              }))
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
              <Col lg={12} className={`${styles.pright}`}>
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
                {status ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  value={status}
                  name="status"
                  defaultChecked
                  onChange={() => {
                    setStatus(!status);
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
              setCloseModal(true);
            }}
          >
            Cancel
          </p>

          <button
            type="button"
            disabled={isSubmitting}
            className={` btn btn-md me-4 ${styles.createbtn} ${` btn-primary`}`}
            onClick={(e) => handleSubmit(e)}
          >
            Create
          </button>
        </div>
      </div>
      <SuccessPopUpModal
        title="Success!"
        message="Device Type created."
        modalPopUp={modalPopUp}
        isNavigate={true}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
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
    </div>
  );
};

export default AddDeviceType;
