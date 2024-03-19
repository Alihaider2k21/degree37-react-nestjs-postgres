import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import styles from './index.module.scss';
import { Col, Row } from 'react-bootstrap';
import CancelModalPopUp from '../../../../../common/cancelModal';
import SuccessPopUpModal from '../../../../../common/successModal';
import jwt from 'jwt-decode';
import { toast } from 'react-toastify';
import { ContactBreadCrumbsData } from '../ContactBreadCrumbsData';

const CreateContactRole = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const bearerToken = localStorage.getItem('token');
  const [id, setId] = useState(null);
  const [closeModal, setCloseModal] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [volunteerSelected, setVolunteerSelected] = useState(false);
  const [donorSelected, setDonorSelected] = useState(false);
  const [staffSelected, setStaffSelected] = useState(true);
  const [contactRoleData, setContactRoleData] = useState({
    name: '',
    short_name: '',
    description: '',
    function_id: 1,
    average_hourly_rate: 0,
    oef_contribution: 0,
    impacts_oef: true,
    staffable: true,
    status: true,
  });
  const [errors, setErrors] = useState({
    name: '',
    short_name: '',
    description: '',
    function_id: '',
    average_hourly_rate: '',
    oef_contribution: '',
    impacts_oef: '',
    staffable: '',
  });

  const BreadcrumbsData = [
    ...ContactBreadCrumbsData,
    {
      label: 'Create Role',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/crm-admin/contacts/roles/create`,
    },
  ];

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }
  }, []);

  const handleFormInput = (event) => {
    const { value, name, checked } = event.target;
    const parsedValue = name === 'function_id' ? +value : value;
    if (name === 'status' || name === 'staffable' || name === 'impacts_oef') {
      setContactRoleData({ ...contactRoleData, [name]: checked });
    } else if (name === 'short_name' && value) {
      setContactRoleData({
        ...contactRoleData,
        [name]: value
          ?.trim()
          .replace(/[^\w\s]/gi, '')
          .toUpperCase(),
      });
    } else {
      setContactRoleData({ ...contactRoleData, [name]: parsedValue });
    }
  };

  const handleSubmit = async () => {
    const errors = {};
    setErrors(errors);

    if (!contactRoleData.name) {
      errors.name = 'Name is required.';
    }
    if (!contactRoleData.short_name) {
      errors.short_name = 'Short Name is required.';
    }
    if (contactRoleData.short_name && contactRoleData.short_name?.length > 5) {
      errors.short_name = 'Maximum value allowed for Short Name  is 5';
    }
    if (!contactRoleData.description) {
      errors.description = 'Description is required.';
    }
    if (staffSelected && contactRoleData.average_hourly_rate === '') {
      errors.average_hourly_rate = 'Average hourly rate is required.';
    }
    if (
      staffSelected &&
      contactRoleData.impacts_oef &&
      contactRoleData.oef_contribution === ''
    ) {
      errors.oef_contribution = 'OEF Contribution is required.';
    } else if (staffSelected && !contactRoleData.impacts_oef) {
      contactRoleData.oef_contribution = 0;
    }
    if (volunteerSelected || donorSelected) {
      contactRoleData.impacts_oef = false;
      contactRoleData.staffable = false;
    }

    if (contactRoleData?.average_hourly_rate > 100) {
      errors.average_hourly_rate = `Maximum value allowed for OEF Contribution  is 100`;
    }

    if (contactRoleData?.average_hourly_rate < 0) {
      errors.average_hourly_rate = `Negative number not allowed for Average Hourly Rate.`;
    }

    if (contactRoleData?.oef_contribution > 100) {
      errors.oef_contribution = `Maximum value allowed for OEF Contribution  is 100`;
    }

    if (contactRoleData?.oef_contribution < 0) {
      errors.oef_contribution = `Negative number not allowed for OEF Contribution.`;
    }

    if (!Number.isInteger(+contactRoleData?.average_hourly_rate)) {
      errors.average_hourly_rate = `Average Hourly Rate should be an integer.`;
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    let body = {
      ...contactRoleData,
      oef_contribution:
        contactRoleData.oef_contribution == ''
          ? 0
          : contactRoleData.oef_contribution,
      average_hourly_rate:
        contactRoleData.average_hourly_rate == ''
          ? 0
          : contactRoleData.average_hourly_rate,
      created_by: +id,
    };
    try {
      const response = await fetch(`${BASE_URL}/contact-roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(body),
      });
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
  };

  const fieldDefinitions = [
    { name: 'name', label: 'Name', required: true, maxLength: 50 },
    { name: 'short_name', label: 'Short Name', required: true, maxLength: 5 },
    {
      name: 'description',
      label: 'Description',
      required: true,
      maxLength: 500,
    },
    { name: 'function_id', label: 'Function ID', required: true },
    {
      name: 'oef_contribution',
      label: 'OEF Contribution',
      required: true,
    },
    {
      name: 'average_hourly_rate',
      label: 'Average Hourly Rate',
      required: true,
    },
  ];

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const fieldDefinition = fieldDefinitions.find(
      (field) => field.name === name
    );
    let errorMessage = '';

    if (fieldDefinition.required && value.trim() === '') {
      errorMessage = `${fieldDefinition.label} is required.`;
    }

    if (
      fieldDefinition?.maxLength &&
      value.length > fieldDefinition?.maxLength
    ) {
      errorMessage = `Maximum ${fieldDefinition.maxLength} characters are allowed.`;
    }

    if (
      ['oef_contribution', 'average_hourly_rate'].includes(name) &&
      +value > 100
    ) {
      errorMessage = `Maximum value allowed for ${fieldDefinition.label} is 100.`;
    }

    if (
      ['oef_contribution', 'average_hourly_rate'].includes(name) &&
      +value < 0
    ) {
      errorMessage = `Negative number not allowed for ${fieldDefinition.label}`;
    }

    if (['average_hourly_rate'].includes(name) && !Number.isInteger(+value)) {
      errorMessage = `${fieldDefinition.label} should be an integer.`;
    }

    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    setError(name, errorMessage);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Roles'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form>
          <div className={`formGroup`}>
            <h5>Create Role</h5>
            <Row className={`w-100 justify-content-between`}>
              <Col lg={6}>
                <div className={`form-field ${styles.fieldcontact}`}>
                  <div className={`field ${styles.contactrolenamefield}`}>
                    <input
                      type="text"
                      className={`${styles.contactrolename} form-control`}
                      value={contactRoleData.name}
                      name="name"
                      onBlur={(e) => handleInputBlur(e)}
                      placeholder=""
                      onChange={(e) => {
                        handleFormInput(e);
                      }}
                      required
                      maxLength={50}
                    />
                    <label className="text-secondary mb-2">Name*</label>
                  </div>
                  {errors.name && (
                    <div className="error">
                      <div
                        className={`error ${styles.errorPadding} ${styles.errorcolor}`}
                      >
                        <p className="mb-0">{errors.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
              <Col lg={6} className={styles.contactrolemarginbottom}>
                <div className={`form-field ${styles.fieldcontact}`}>
                  <div className={`field ${styles.contactrolenamefield}`}>
                    <input
                      type="text"
                      className={`${styles.contactrolename} form-control`}
                      value={contactRoleData.short_name}
                      name="short_name"
                      onBlur={(e) => handleInputBlur(e)}
                      placeholder=""
                      onChange={(e) => {
                        handleFormInput(e);
                      }}
                      required
                      maxLength={5}
                    />
                    <label className="text-secondary mb-2">Short Name*</label>
                  </div>
                  {errors.short_name && (
                    <div className="error">
                      <div
                        className={`error ${styles.errorPadding} ${styles.errorcolor}`}
                      >
                        <p className="mb-0">{errors.short_name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row className={`w-100`}>
              <Col lg={12}>
                <div className="form-field w-100 mb-4 textarea-new">
                  <div className={`field `}>
                    <textarea
                      type="text"
                      className={`form-control textarea `}
                      placeholder=""
                      name="description"
                      required
                      value={contactRoleData.description}
                      onChange={(e) => handleFormInput(e)}
                      onBlur={(e) => handleInputBlur(e)}
                      maxLength={500}
                    />
                    <label>Description*</label>
                  </div>
                  {errors.description && (
                    <div
                      className={`error ${styles.descriptionMargin} ${styles.errorcolor}`}
                    >
                      <p className="mb-0">{errors.description}</p>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row className={`w-100`}>
              <Col className={styles.contactrolemarginbottom} lg={6}>
                <div
                  className={`field form-floating ${styles.selectfieldfunction} ${styles.fieldcontact}`}
                >
                  <select
                    className={`form-select ${styles.formselect}`}
                    value={contactRoleData.function_id}
                    id="floatingSelect"
                    name="function_id"
                    onChange={(e) => {
                      if (e.target.value == 3) {
                        setVolunteerSelected(true);
                        setStaffSelected(false);
                        contactRoleData.average_hourly_rate = '';
                        contactRoleData.oef_contribution = '';
                        contactRoleData.impacts_oef = false;
                        contactRoleData.staffable = false;
                      } else if (e.target.value == 2) {
                        setDonorSelected(true);
                        setStaffSelected(false);
                        contactRoleData.average_hourly_rate = '';
                        contactRoleData.oef_contribution = '';
                        contactRoleData.impacts_oef = false;
                        contactRoleData.staffable = false;
                      } else {
                        setVolunteerSelected(false);
                        setDonorSelected(false);
                        setStaffSelected(true);
                        contactRoleData.impacts_oef = true;
                        contactRoleData.staffable = true;
                        contactRoleData.average_hourly_rate = 0;
                        contactRoleData.oef_contribution = 0;
                      }
                      handleFormInput(e);
                    }}
                    onBlur={(e) => handleInputBlur(e)}
                  >
                    <option value="1">Staff</option>
                    <option value="2">Donor</option>
                    <option value="3">Volunteer</option>
                    {/* {parentLevelData &&
                      parentLevelData.length &&
                      parentLevelData.map((item, index) => {
                        return (
                          <option key={index} value={item?.id}>
                            {item?.name}
                          </option>
                        );
                      })} */}
                  </select>
                  <label className={styles.labeltext} htmlFor="floatingSelect">
                    Function*
                  </label>
                </div>
                {errors.function_id && (
                  <div
                    className={`error ${styles.errorPadding} ${styles.errorcolor}`}
                  >
                    <p className="mb-0">{errors.function_id}</p>
                  </div>
                )}
              </Col>
            </Row>
            <Row className={`w-100 justify-content-between`}>
              <Col lg={6}>
                <div className={`form-field ${styles.fieldcontact}`}>
                  <div className={`field ${styles.contactrolenamefield}`}>
                    <input
                      type="number"
                      className={`form-control ${styles.contactrolename}`}
                      value={contactRoleData.oef_contribution}
                      name="oef_contribution"
                      onBlur={(e) => handleInputBlur(e)}
                      placeholder=""
                      onChange={(e) => {
                        handleFormInput(e);
                      }}
                      disabled={
                        (!contactRoleData.impacts_oef && staffSelected) ||
                        volunteerSelected ||
                        donorSelected
                      }
                      required
                    />
                    <label className="text-secondary">
                      OEF Contribution* (%)
                    </label>
                  </div>
                  {errors.oef_contribution &&
                    contactRoleData.impacts_oef &&
                    (!volunteerSelected || !donorSelected) && (
                      <div
                        className={`error ${styles.errorPadding} ${styles.errorcolor}`}
                      >
                        <p className="mb-0">{errors.oef_contribution}</p>
                      </div>
                    )}
                </div>
              </Col>
              <Col className={styles.contactrolemarginbottom} lg={6}>
                <div className={`form-field ${styles.fieldcontact}`}>
                  <div
                    className={`field ${styles.contactrolenamefield} ${styles.selectfieldgap}`}
                  >
                    <input
                      type="number"
                      className={`form-control ${styles.contactrolename}`}
                      value={contactRoleData.average_hourly_rate}
                      name="average_hourly_rate"
                      onBlur={(e) => handleInputBlur(e)}
                      placeholder=""
                      onChange={(e) => {
                        handleFormInput(e);
                      }}
                      disabled={
                        volunteerSelected || donorSelected || !staffSelected
                      }
                      required
                    />
                    <label className="text-secondary">
                      Average Hourly Rate*
                    </label>
                  </div>
                  {errors.average_hourly_rate &&
                    (!volunteerSelected || !donorSelected) && (
                      <div
                        className={`error ${styles.errorPadding} ${styles.errorcolor}`}
                      >
                        <p className="mb-0 ms-2">
                          {errors.average_hourly_rate}
                        </p>
                      </div>
                    )}
                </div>
              </Col>
            </Row>
            <Row className={`w-100 justify-content-between`}>
              <Col lg={6} className="d-flex align-items-center">
                <div
                  className={`form-field checkbox mb-0 ${styles.fieldcontact}`}
                >
                  <span className="toggle-text">
                    {contactRoleData.status ? 'Active' : 'Inactive'}
                  </span>
                  <label htmlFor="toggle" className="switch">
                    <input
                      type="checkbox"
                      id="toggle"
                      className="toggle-input"
                      checked={contactRoleData.status}
                      //   value={businessData.is_active}
                      name="status"
                      defaultChecked
                      onChange={(e) => {
                        handleFormInput(e);
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </Col>
              <Col
                className={`form-field d-flex align-items-center justify-content-lg-end mb-0 ${styles.margin}`}
                lg={6}
              >
                {/* <div className="form-field"> */}
                {/* <label className="d-flex field text-black align-items-center">
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={staffableChecked}
                    onChange={() => handleCheckboxChange('staffable')}
                  />
                  Staffable
                </label> */}
                <div className=" field d-flex align-items-center w-100">
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    name="staffable"
                    checked={contactRoleData.staffable}
                    onChange={(e) => {
                      handleFormInput(e);
                    }}
                    disabled={volunteerSelected || donorSelected}
                  />
                  <label
                    className={`d-flex flex-shrink-0 text-black align-items-center ms-3  ${styles.oefcheckbox}`}
                  >
                    Staffable
                  </label>
                </div>
                <div className=" field w-100 d-flex align-items-center">
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={contactRoleData.impacts_oef}
                    name="impacts_oef"
                    onChange={(e) => {
                      handleFormInput(e);
                      if (e?.target?.value) {
                        setStaffSelected(true);
                        setVolunteerSelected(false);
                        setDonorSelected(false);
                      }
                    }}
                    disabled={volunteerSelected || donorSelected}
                  />
                  <label
                    className={`d-flex flex-shrink-0 text-black align-items-center ms-3  ${styles.oefcheckbox}`}
                  >
                    Impacts OEF
                  </label>
                </div>
                {/* {errors.name && (
                    <div className={`error ${styles.errorcolor}`}>
                      <p>{errors.name}</p>
                    </div>
                  )} */}
                {/* </div> */}
              </Col>
            </Row>
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
            className={` btn btn-md mb-0 btn-primary ${styles.createbtn} btn-primary
            `}
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
      <SuccessPopUpModal
        title={'Success!'}
        message={'Contacts Role created.'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        isNavigate={true}
        redirectPath={
          '/system-configuration/tenant-admin/crm-admin/contacts/roles/list'
        }
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={
          '/system-configuration/tenant-admin/crm-admin/contacts/roles/list'
        }
      />
    </div>
  );
};

export default CreateContactRole;
