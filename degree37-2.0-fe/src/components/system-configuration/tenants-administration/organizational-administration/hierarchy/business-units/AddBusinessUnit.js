import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import styles from './index.module.scss';
import SuccessPopUpModal from '../../../../../common/successModal';
import { Col, Row } from 'react-bootstrap';
import jwt from 'jwt-decode';
import { toast } from 'react-toastify';
import CancelModalPopUp from '../../../../../common/cancelModal';
import { BUSINESS_UNIT_PATH } from '../../../../../../routes/path';
import { BusinessBreadCrumbData } from '../breadCrumbsData';
import handleInputChange from '../../../../../../helpers/handleInputChange';
import validateForm from '../../../../../../helpers/formValidation';
import SelectDropdown from '../../../../../common/selectDropdown';
import axios from 'axios';

const AddBusinessUnit = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [businessData, setBusinessData] = useState({
    name: '',
    parent_level_id: null,
    organizational_level_id: null,
    is_active: true,
  });
  const [errors, setErrors] = useState({
    name: '',
    organizational_level_id: '',
  });
  const [parentLevelData, setParentLevelData] = useState([]);
  const [tempParentLevelData, setTempParentLevelData] = useState([]);
  const [organizationalLevelData, setOrganizationalLevelData] = useState([]);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [id, setId] = useState('');
  const bearerToken = localStorage.getItem('token');
  const [parentLevelExists, setParentLevelExists] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const BreadcrumbsData = [
    ...BusinessBreadCrumbData,
    {
      label: 'Create Business Unit',
      class: 'active-label',
      link: BUSINESS_UNIT_PATH.CREATE,
    },
  ];

  const getOrganizationalLevelData = async () => {
    const response = await axios.get(`${BASE_URL}/organizational_levels`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });

    const data = response.data;
    setOrganizationalLevelData(data?.data);
  };
  const getBusinessUnits = async () => {
    const response = await axios.get(`${BASE_URL}/business_units?limit=1000`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });

    const data = response.data;
    setParentLevelData([]);
    setTempParentLevelData(data?.data);
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }
    getOrganizationalLevelData();
    getBusinessUnits();
    // eslint-disable-next-line
  }, []);

  const handleFormInput = (event) => {
    const { value, name, checked } = event.target;
    const parsedValue =
      name === 'parent_level_id' || name === 'organizational_level_id'
        ? +value
        : value;
    if (name === 'is_active') {
      setBusinessData({ ...businessData, [name]: checked });
    } else {
      setBusinessData({ ...businessData, [name]: parsedValue });
    }
  };

  const fieldNames = [
    { label: 'Name', name: 'name', required: true, maxLength: 50 },
    {
      label: 'Short Label',
      name: 'short_label',
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
      label: 'Organizational Level',
      name: 'organizational_level_id',
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
    handleInputChange(name, value, setBusinessData, fieldNames, setErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm(
      businessData,
      titleCase(fieldNames),
      setErrors
    );

    if (isValid) {
      let body = {
        ...businessData,
        organizational_level_id: +businessData?.organizational_level_id?.value,
        parent_level_id: +businessData?.parent_level_id?.value,
        created_by: +id,
      };
      try {
        const response = await axios.post(
          `${BASE_URL}/business_units?limit=1000`,
          body,
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );

        const data = response.data;
        if (data.status === 'success') {
          setModalPopUp(true);
          setIsButtonDisabled(false);
        } else if (response?.status === 400) {
          setIsButtonDisabled(false);
          toast.error(`${data?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
        } else {
          setIsButtonDisabled(false);
          toast.error(`${data?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
        }
      } catch (error) {
        setIsButtonDisabled(false);
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Business Units'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form>
          <div className="formGroup">
            <h5>Create Business Unit</h5>
            <Row className={`mb-4 ${styles.rows}`}>
              <Col lg={6}>
                <div className="form-field w-100 ">
                  <div className="field ">
                    <input
                      type="text"
                      className="form-control "
                      name="name"
                      placeholder=" "
                      onChange={handleChange}
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
              </Col>
              <Col lg={6}>
                <div className={`form-field w-100 form-floating mb-0`}>
                  <SelectDropdown
                    disabled={!parentLevelExists}
                    styles={{ root: 'w-100' }}
                    placeholder={'Parent'}
                    defaultValue={businessData.parent_level_id}
                    selectedValue={businessData.parent_level_id}
                    removeDivider
                    showLabel
                    onChange={(val) => {
                      let e = {
                        target: {
                          name: 'parent_level_id',
                          value: val ?? null,
                        },
                      };
                      handleChange(e);
                    }}
                    options={parentLevelData.map((item) => {
                      return {
                        label: item.name,
                        value: item.id,
                      };
                    })}
                  />
                  {businessData.organizational_level_id &&
                    !parentLevelExists && (
                      <p style={{ fontSize: '14px' }}>
                        Note: Selected Organizational Level has no Parent.
                      </p>
                    )}
                  {errors.parent_level_id && (
                    <p className={styles.errorcolor}>
                      {errors.parent_level_id}
                    </p>
                  )}
                </div>
              </Col>
            </Row>

            <Row className={`mb-4 ${styles.rows}`}>
              <Col lg={6}>
                <div className={`form-field w-100 form-floating mb-0`}>
                  <SelectDropdown
                    styles={{ root: 'w-100 mb-0' }}
                    placeholder={'Organizational Level*'}
                    defaultValue={businessData.organizational_level_id}
                    selectedValue={businessData.organizational_level_id}
                    removeDivider
                    showLabel
                    onChange={(val) => {
                      let e = {
                        target: {
                          name: 'organizational_level_id',
                          value: val ?? null,
                        },
                      };

                      if (
                        val?.value !=
                        businessData?.organizational_level_id?.value
                      ) {
                        setBusinessData((prevData) => ({
                          ...prevData,
                          parent_level_id: null,
                        }));
                      }

                      let organization = organizationalLevelData?.find(
                        (item) => item.id == +val?.value
                      );

                      let updatedParentList = tempParentLevelData?.filter(
                        (item) =>
                          item.organizational_level_id?.id ==
                          organization?.parent_level?.id
                      );
                      if (updatedParentList.length > 0) {
                        setParentLevelExists(true);
                      } else {
                        setParentLevelExists(false);
                      }
                      setParentLevelData(
                        [...updatedParentList]?.filter(
                          (item) =>
                            item.is_active === true &&
                            item.is_archived === false
                        )
                      );
                      handleChange(e);
                    }}
                    options={organizationalLevelData.map((item) => {
                      return {
                        label: item.name,
                        value: item.id,
                      };
                    })}
                  />
                </div>
                {errors.organizational_level_id && (
                  <p className={styles.errorcolor}>
                    {errors.organizational_level_id}
                  </p>
                )}
              </Col>
            </Row>
            <div className="form-field checkbox">
              <span className="toggle-text">
                {businessData?.is_active ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  value={businessData.is_active}
                  name="is_active"
                  defaultChecked
                  onChange={(e) => {
                    handleFormInput(e);
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
            className={` btn btn-md me-4 ${styles.createbtn} ${` btn-primary`}`}
            disabled={isButtonDisabled}
            onClick={(e) => {
              setIsButtonDisabled(true);
              handleSubmit(e);
            }}
          >
            Create
          </button>
        </div>
      </div>
      <SuccessPopUpModal
        title="Success!"
        message="Business Unit created."
        modalPopUp={modalPopUp}
        isNavigate={true}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        redirectPath={BUSINESS_UNIT_PATH.LIST}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={BUSINESS_UNIT_PATH.LIST}
      />
    </div>
  );
};

export default AddBusinessUnit;
