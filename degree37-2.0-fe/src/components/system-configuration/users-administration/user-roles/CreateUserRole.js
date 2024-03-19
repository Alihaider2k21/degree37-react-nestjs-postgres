import React, { useEffect, useState } from 'react';
import Topbar from '../../../common/topbar/index';
import styles from './index.module.scss';
import { USER_ROLES } from '../../../../routes/path';
import { Col, Row } from 'react-bootstrap';
import * as yup from 'yup';
import './stepper.css';
import { makeAuthorizedApiRequestAxios } from '../../../../helpers/Api';
import SuccessPopUpModal from '../../../common/successModal';
import CancelModalPopUp from '../../../common/cancelModal';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import { UsersBreadCrumbsData } from '../../tenants-administration/user-administration/UsersBreadCrumbsData';

const CreateUserRole = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [permissions, setPermissions] = useState([]);
  const [closeModal, setCloseModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [tenantApplications, setTenantApplications] = useState([]);
  const [permissionError, setPermissionError] = useState(null);
  const [errors, setErrors] = useState({
    name: '',
    description: '',
  });

  const [rolesData, setRolesData] = useState({
    name: '',
    description: '',
    is_recruiter: false,
    is_active: true,
  });

  const BreadcrumbsData = [
    ...UsersBreadCrumbsData,
    {
      label: 'Create User Role',
      class: 'disable-label',
      link: USER_ROLES.CREATE,
    },
  ];
  let modulePermissions = [];

  const childModuleFilter = (childModule) => {
    childModule?.forEach((item1) => {
      if (item1?.permissions?.length) {
        const newPermissions = item1.permissions.map(({ code }) => code);
        modulePermissions = [...modulePermissions, ...newPermissions];
      }

      if (item1?.child_modules?.length) {
        childModuleFilter(item1?.child_modules, +item1?.id);
      }
    });
    return modulePermissions;
  };
  const handlePermission = (e, permission, allPermissions = []) => {
    if (e.target.checked && permission?.code) {
      let temp = [...permissions];
      if (!isNaN(permission?.code)) {
        temp = [...temp, permission.code];
      }
      if (permission.name == 'Write' || permission.name == 'Archive') {
        allPermissions.forEach((perm) => {
          if (perm.name == 'Read') {
            temp = [...temp, perm?.code];
          }
        });
      }
      !(temp?.length > 0)
        ? setPermissionError('Permissions are required.')
        : setPermissionError('');
      temp.filter(Boolean);
      const uniqueNumbersSet = new Set(temp);
      const uniqueNumbersArray = Array.from(uniqueNumbersSet);
      setPermissions(uniqueNumbersArray);
    } else {
      let filteredPermissions = [];
      if (permission?.name === 'System Configuration') {
        if (permission?.modules?.length) {
          permission?.modules?.map((item2) => {
            if (item2?.permissions?.length) {
              const filteredData = item2?.permissions?.map((obj) => obj?.code);
              filteredPermissions = [...filteredPermissions, ...filteredData];
            }
            if (item2?.child_modules?.length) {
              const filteredData = childModuleFilter(item2?.child_modules);
              filteredPermissions = [...filteredPermissions, ...filteredData];
              modulePermissions = [];
            }
          });
        }
        if (permission?.child_modules?.length) {
          const filteredData = childModuleFilter(permission?.child_modules);
          filteredPermissions = [...filteredPermissions, ...filteredData];
          modulePermissions = [];
        }
      } else {
        if (permission?.modules?.length) {
          permission?.modules?.map((item2) => {
            if (item2?.permissions?.length) {
              const filteredData = item2?.permissions?.map((obj) => obj?.code);
              filteredPermissions = [...filteredPermissions, ...filteredData];
            }
            if (item2?.child_modules?.length) {
              const filteredData = childModuleFilter(item2?.child_modules);
              filteredPermissions = [...filteredPermissions, ...filteredData];
              modulePermissions = [];
            }
            const filteredIds = permissions.filter(
              (id) => !filteredPermissions.includes(id)
            );
            !(filteredIds?.length > 0)
              ? setPermissionError('Permissions are required.')
              : setPermissionError('');
            filteredIds.filter(Boolean);
            const uniqueNumbersSet = new Set(filteredIds);
            const uniqueNumbersArray = Array.from(uniqueNumbersSet);
            setPermissions(uniqueNumbersArray);
          });
        }
        if (permission?.child_modules?.length) {
          const filteredData = childModuleFilter(permission?.child_modules);
          filteredPermissions = [...filteredPermissions, ...filteredData];
          modulePermissions = [];
        }
        if (permission?.permissions?.length) {
          const permissionId = permission?.permissions.map(
            (item) => item?.code
          );
          filteredPermissions = [...filteredPermissions, ...permissionId];
        }
      }
      const filteredIds = permissions?.filter(
        (item) => !filteredPermissions.includes(item)
      );
      !(filteredIds?.length > 0)
        ? setPermissionError('Permissions are required.')
        : setPermissionError('');
      filteredIds.filter(Boolean);
      const uniqueNumbersSet = new Set(filteredIds);
      const uniqueNumbersArray = Array.from(uniqueNumbersSet);
      setPermissions(uniqueNumbersArray);
      if (allPermissions?.length) {
        let newPermissions;
        if (permission.name === 'Read') {
          const readPermissionIds = allPermissions
            .filter(
              (item) => item.name != 'Read' && permissions.includes(item?.code)
            )
            .map((item) => item?.code);

          newPermissions = permissions?.filter(
            (item) =>
              !readPermissionIds.includes(item) && item !== permission?.code
          );
        } else {
          newPermissions = permissions?.filter(
            (item) => item !== permission?.code
          );
        }
        !(newPermissions?.length > 0)
          ? setPermissionError('Permissions are required.')
          : setPermissionError('');
        newPermissions.filter(Boolean);
        const uniqueNumbersSet = new Set(newPermissions);
        const uniqueNumbersArray = Array.from(uniqueNumbersSet);
        setPermissions(uniqueNumbersArray);
      }
    }
  };
  console.log(permissions);
  const validationSchema = yup.object({
    name: yup
      .string()
      .matches(/^[0-9\s\S]+$/, 'Invalid name. Only alphabets are allowed.')
      .min(1, 'Role name is required.')
      .max(20, 'Role name is too long, Only 20 alphabets are allowed.')
      .required('Role name is required.'),
    description: yup.string(),
  });

  function titleCase(string) {
    if (string.toLowerCase() == 'crm') return 'CRM';
    if (string == 'CRM Administration') return 'CRM Administration';
    if (string) return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }

  const handleOnBlur = async (event) => {
    const key = event.target.name;
    const value = event.target.value;
    validationSchema
      .validate({ [key]: value }, { abortEarly: false })
      .then(async () => {
        setErrors((prevErrors) => ({ ...prevErrors, [key]: '' }));
      })
      .catch((validationErrors) => {
        const newErrors = {};
        setErrors((prevErrors) => ({ ...prevErrors, [key]: '' }));
        validationErrors?.inner?.forEach((error) => {
          if (error?.path === key) newErrors[error?.path] = error.message;
        });
        setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
      });
  };

  const handleFormInput = (event) => {
    const { value, name } = event.target;
    switch (name) {
      case 'is_recruiter':
        setRolesData({
          ...rolesData,
          [name]: event.target.checked,
        });
        break;
      case 'is_active':
        setRolesData({
          ...rolesData,
          [name]: event.target.checked,
        });
        break;
      default:
        setRolesData({
          ...rolesData,
          [name]: value,
        });
        break;
    }
  };
  const [checkboxStates, setCheckboxStates] = useState({});

  const handleCheckboxChange = (id) => {
    const handelCheckBoxState = {
      ...checkboxStates,
      [id]: !checkboxStates[id],
    };
    setCheckboxStates(handelCheckBoxState);
  };

  const fetchTenantApplications = async () => {
    const result = await makeAuthorizedApiRequestAxios(
      'GET',
      `${BASE_URL}/application/tenant-permissions`
    );
    let data = result.data;
    if (result.ok || result.status === 200) {
      setTenantApplications(data?.data);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  useEffect(() => {
    fetchTenantApplications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(permissions?.length > 0)) {
      setPermissionError('Permissions are required.');
    }
    validationSchema
      .validate(
        {
          name: rolesData.name,
          description: rolesData.description,
        },
        { abortEarly: false }
      )
      .then(async () => {
        setErrors({});
        try {
          if (permissions.length === 0) {
            toast.error('Atleast one permissions is required');
            return;
          }
          const response = await makeAuthorizedApiRequestAxios(
            'POST',
            `${process.env.REACT_APP_BASE_URL}/roles/tenant/create`,
            JSON.stringify({ ...rolesData, permissions })
          );
          const resJson = response.data;
          if (resJson.status === 'error') {
            toast.error(`${resJson.response}`, { autoClose: 3000 });
          } else if (resJson.status === 'success') {
            setSuccessModal(true);
          } else {
            toast.error(`${resJson?.message?.[0]}`, {
              autoClose: 3000,
            });
          }
        } catch (error) {
          toast.error(`${error?.message}`, { autoClose: 3000 });
        }
      })
      .catch((validationErrors) => {
        const newErrors = {};
        validationErrors?.inner?.forEach((error) => {
          newErrors[error?.path] = error.message;
        });
        setErrors(newErrors);
      });
  };

  return (
    <div className="mainContent">
      <SuccessPopUpModal
        title="Success!"
        message="Role created."
        modalPopUp={successModal}
        isNavigate={true}
        setModalPopUp={setSuccessModal}
        showActionBtns={true}
        redirectPath={USER_ROLES.LIST}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={USER_ROLES.LIST}
      />
      <Topbar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'User Roles'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form className={` ${styles.formcontainer} `}>
          <div className="formGroup">
            <h5>Create User Role</h5>
            <Row className={`mb-4 ${styles.rows}`}>
              <Col lg={6}>
                <div className="form-field w-100">
                  <div className="field">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder=""
                      onBlur={handleOnBlur}
                      onChange={(e) => {
                        handleFormInput(e);
                        handleOnBlur(e);
                      }}
                      value={rolesData?.name}
                      required
                    />
                    <label>Role Name*</label>
                  </div>
                  {errors?.name && (
                    <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                      <p>{errors.name}</p>
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
                      className={`form-control pt-4 ${styles.textarea} ${
                        isEmpty(rolesData?.description)
                          ? styles.disabledcolor
                          : ''
                      }`}
                      placeholder="Role Details (Optional)"
                      name="description"
                      value={rolesData?.description}
                      onChange={(e) => {
                        handleFormInput(e);
                        handleOnBlur(e);
                      }}
                      onBlur={handleOnBlur}
                    />
                    {rolesData?.description !== '' && (
                      <label className={styles.textarealable}>
                        Role Details (Optional)
                      </label>
                    )}
                  </div>
                  {errors?.description && (
                    <div className={`error ml-1 mt-1`}>
                      <p className={`${styles.errorcolor}`}>
                        {errors.description}
                      </p>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row className={`mb-4 ${styles.rows}`}>
              <Col lg={6}>
                <div className="form-field w-100">
                  <div className="field">
                    <input
                      name="is_recruiter"
                      className="form-check-input p-0"
                      style={{ marginLeft: 0 }}
                      type="checkbox"
                      checked={rolesData?.is_recruiter}
                      onChange={(e) => {
                        handleFormInput(e);
                      }}
                    />
                    <label
                      style={{ left: 'auto' }}
                      className="text-dark font-small ms-2"
                    >
                      Recruiter
                    </label>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className={`${styles.rows}`}>
              <div className="form-field checkbox">
                <span className="toggle-text">
                  {rolesData.is_active ? 'Active' : 'Inactive'}
                </span>
                <label htmlFor="toggle" className="switch">
                  <input
                    type="checkbox"
                    id="toggle"
                    className="toggle-input"
                    name="is_active"
                    checked={rolesData?.is_active}
                    onChange={(e) => {
                      handleFormInput(e);
                    }}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </Row>
          </div>
          <div className="formGroup" style={{ overflowX: 'scroll' }}>
            <h5>Permissions</h5>
            <div className="w-100">
              {tenantApplications?.map((item, key) => {
                return (
                  <div key={key} className="w-100 level-1 position-relative">
                    <div
                      className={`${
                        key === 0
                          ? 'stepper-line-first'
                          : key === 7
                          ? 'stepper-line-last'
                          : 'stepper-line'
                      }`}
                    ></div>
                    <div className="stepper-indicator"></div>
                    {/* <p key={key} className="ms-5">
                      {item?.name}
                    </p> */}
                    <div
                      className={`form-check form-switch position-relative ${styles.maxContentWidth}`}
                      onClick={() =>
                        handleCheckboxChange('app' + item?.name + key)
                      }
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      <label
                        className={`form-check-label position-static ${styles.maxContentWidth}`}
                        style={{
                          color: 'black',
                          transform: 'translateY(0px)',
                        }}
                        htmlFor={key}
                      >
                        {titleCase(item?.name)}
                      </label>
                      <input
                        className="form-check-input ms-1 float-none"
                        style={{
                          float: 'right',
                          height: '1.2em',
                          cursor: 'pointer',
                        }}
                        type="checkbox"
                        id={key}
                        checked={checkboxStates['app' + item?.name + key]}
                        onChange={(e) => {
                          handleCheckboxChange('app' + item?.name + key);
                          handlePermission(e, item);
                        }}
                        // onChange={() =>
                        //   handleCheckboxChange('app' + item?.name + key)
                        // }
                      />
                    </div>
                    {checkboxStates['app' + item?.name + key] && (
                      <div>
                        {item?.modules?.map((item2, key2) => {
                          return (
                            <div
                              className="w-100 ps-5 level-2 position-relative"
                              key={key}
                            >
                              <div className="stepper-line-inner"></div>
                              <div className="stepper-indicator"></div>
                              <div
                                className={
                                  item2?.permissions?.length ? 'd-flex' : ''
                                }
                                // style={{ justifyContent: 'space-between' }}
                              >
                                <div
                                  className={`form-check form-switch position-relative ${styles.maxContentWidth}`}
                                  onClick={() =>
                                    handleCheckboxChange(
                                      'module' + item2?.name + key2
                                    )
                                  }
                                  style={{
                                    cursor: 'pointer',
                                    minWidth: '57%',
                                  }}
                                >
                                  <label
                                    className={`form-check-label position-static ${styles.maxContentWidth}`}
                                    style={{
                                      color: 'black',
                                      transform: 'translateY(0px)',
                                    }}
                                    htmlFor={key2}
                                  >
                                    {titleCase(item2?.name)}
                                  </label>
                                  <input
                                    className="form-check-input ms-1 float-none"
                                    style={{
                                      float: 'right',
                                      height: '1.2em',
                                      cursor: 'pointer',
                                    }}
                                    type="checkbox"
                                    id={key2}
                                    checked={
                                      checkboxStates[
                                        'module' + item2?.name + key2
                                      ]
                                    }
                                    onChange={(e) => {
                                      handleCheckboxChange(
                                        'module' + item2?.name + key2
                                      );
                                      handlePermission(e, item2);
                                    }}
                                  />
                                </div>
                                {checkboxStates[
                                  'module' + item2?.name + key2
                                ] && (
                                  <div>
                                    {item2?.child_modules?.length ? (
                                      item2?.child_modules?.map(
                                        (item3, key3) => {
                                          return (
                                            <div
                                              className="w-100 ps-5 level-3 position-relative"
                                              key={key}
                                            >
                                              <div className="stepper-line-inner"></div>
                                              <div className="stepper-indicator"></div>
                                              <div
                                                className={
                                                  item3?.permissions?.length
                                                    ? 'd-flex'
                                                    : ''
                                                }
                                                // style={{
                                                //   justifyContent:
                                                //     'space-between',
                                                // }}
                                              >
                                                <div
                                                  className={`form-check form-switch position-relative ${styles.maxContentWidth}`}
                                                  onClick={() =>
                                                    handleCheckboxChange(
                                                      'submodule1' +
                                                        item3?.name +
                                                        key3
                                                    )
                                                  }
                                                  style={{
                                                    cursor: 'pointer',
                                                    minWidth: '53%',
                                                  }}
                                                >
                                                  <label
                                                    className={`form-check-label position-static ${styles.maxContentWidth}`}
                                                    style={{
                                                      color: 'black',
                                                      transform:
                                                        'translateY(0px)',
                                                    }}
                                                    htmlFor={key3}
                                                  >
                                                    {titleCase(item3?.name)}
                                                  </label>
                                                  <input
                                                    className="form-check-input ms-1 float-none"
                                                    style={{
                                                      float: 'right',
                                                      height: '1.2em',
                                                      cursor: 'pointer',
                                                    }}
                                                    type="checkbox"
                                                    id={key3}
                                                    checked={
                                                      checkboxStates[
                                                        'submodule1' +
                                                          item3?.name +
                                                          key3
                                                      ]
                                                    }
                                                    onChange={(e) => {
                                                      handleCheckboxChange(
                                                        'submodule1' +
                                                          item3?.name +
                                                          key3
                                                      );
                                                      handlePermission(
                                                        e,
                                                        item3
                                                      );
                                                    }}
                                                  />
                                                </div>
                                                {checkboxStates[
                                                  'submodule1' +
                                                    item3?.name +
                                                    key3
                                                ] && (
                                                  <div>
                                                    {item3?.child_modules
                                                      ?.length ? (
                                                      item3?.child_modules?.map(
                                                        (item4, key4) => {
                                                          return (
                                                            <div
                                                              className="w-100 ps-5 level-4 position-relative"
                                                              key={key}
                                                            >
                                                              <div className="stepper-line-inner"></div>
                                                              <div className="stepper-indicator"></div>
                                                              <div
                                                                className="d-flex"
                                                                // style={{
                                                                //   justifyContent:
                                                                //     'space-between',
                                                                // }}
                                                              >
                                                                <div
                                                                  className={`form-check form-switch position-relative ${styles.maxContentWidth}`}
                                                                  onClick={() =>
                                                                    handleCheckboxChange(
                                                                      'submodule1' +
                                                                        key3 +
                                                                        'permission' +
                                                                        key4
                                                                    )
                                                                  }
                                                                  style={{
                                                                    cursor:
                                                                      'pointer',
                                                                    minWidth:
                                                                      '50%',
                                                                  }}
                                                                >
                                                                  <label
                                                                    className={`form-check-label position-static ${styles.maxContentWidth}`}
                                                                    style={{
                                                                      color:
                                                                        'black',
                                                                      transform:
                                                                        'translateY(0px)',
                                                                    }}
                                                                    htmlFor={
                                                                      key4
                                                                    }
                                                                  >
                                                                    {titleCase(
                                                                      item4?.name
                                                                    )}
                                                                  </label>
                                                                  <input
                                                                    className="form-check-input ms-1 float-none"
                                                                    style={{
                                                                      float:
                                                                        'right',
                                                                      height:
                                                                        '1.2em',
                                                                      cursor:
                                                                        'pointer',
                                                                    }}
                                                                    type="checkbox"
                                                                    id={key4}
                                                                    checked={
                                                                      checkboxStates[
                                                                        'submodule1' +
                                                                          key3 +
                                                                          'permission' +
                                                                          key4
                                                                      ]
                                                                    }
                                                                    onChange={(
                                                                      e
                                                                    ) => {
                                                                      handleCheckboxChange(
                                                                        'submodule1' +
                                                                          key3 +
                                                                          'permission' +
                                                                          key4
                                                                      );
                                                                      handlePermission(
                                                                        e,
                                                                        item4
                                                                      );
                                                                    }}
                                                                  />
                                                                </div>
                                                                {checkboxStates[
                                                                  'submodule1' +
                                                                    key3 +
                                                                    'permission' +
                                                                    key4
                                                                ] && (
                                                                  <div
                                                                    className="d-flex"
                                                                    style={{
                                                                      justifyContent:
                                                                        'space-between',
                                                                    }}
                                                                  >
                                                                    {item4?.permissions?.map(
                                                                      (
                                                                        item5,
                                                                        key5
                                                                      ) => {
                                                                        return (
                                                                          <div
                                                                            className="ms-2"
                                                                            key={
                                                                              key5
                                                                            }
                                                                          >
                                                                            <div
                                                                              className={`form-check ${styles.flexRow}`}
                                                                            >
                                                                              <input
                                                                                className="form-check-input me-2"
                                                                                style={{
                                                                                  padding:
                                                                                    '10px 10px',
                                                                                }}
                                                                                type="checkbox"
                                                                                id={
                                                                                  key5
                                                                                }
                                                                                checked={permissions.includes(
                                                                                  item5?.code
                                                                                )}
                                                                                onChange={(
                                                                                  e
                                                                                ) => {
                                                                                  handlePermission(
                                                                                    e,
                                                                                    item5,
                                                                                    item4?.permissions
                                                                                  );
                                                                                }}
                                                                              />
                                                                              <label
                                                                                className={`form-check-label position-static ${styles.maxContentWidth}`}
                                                                                style={{
                                                                                  color:
                                                                                    'black',
                                                                                  transform:
                                                                                    'translateY(0px)',
                                                                                }}
                                                                                htmlFor={
                                                                                  key5
                                                                                }
                                                                              >
                                                                                {
                                                                                  item5?.name
                                                                                }
                                                                              </label>
                                                                            </div>
                                                                          </div>
                                                                        );
                                                                      }
                                                                    )}
                                                                  </div>
                                                                )}
                                                              </div>
                                                            </div>
                                                          );
                                                        }
                                                      )
                                                    ) : item3?.permissions
                                                        .length ? (
                                                      <div
                                                        className="d-flex"
                                                        style={{
                                                          justifyContent:
                                                            'space-between',
                                                        }}
                                                      >
                                                        {item3?.permissions?.map(
                                                          (item5, key5) => {
                                                            return (
                                                              <div
                                                                className="ms-2"
                                                                key={key5}
                                                              >
                                                                <div
                                                                  className={`form-check ${styles.flexRow}`}
                                                                >
                                                                  <input
                                                                    className="form-check-input me-2"
                                                                    style={{
                                                                      padding:
                                                                        '10px 10px',
                                                                    }}
                                                                    type="checkbox"
                                                                    id={key5}
                                                                    checked={permissions.includes(
                                                                      item5?.code
                                                                    )}
                                                                    onChange={(
                                                                      e
                                                                    ) => {
                                                                      handlePermission(
                                                                        e,
                                                                        item5,
                                                                        item3?.permissions
                                                                      );
                                                                    }}
                                                                  />
                                                                  <label
                                                                    className={`form-check-label position-static ${styles.maxContentWidth}`}
                                                                    style={{
                                                                      color:
                                                                        'black',
                                                                      transform:
                                                                        'translateY(0px)',
                                                                    }}
                                                                    htmlFor={
                                                                      key5
                                                                    }
                                                                  >
                                                                    {
                                                                      item5?.name
                                                                    }
                                                                  </label>
                                                                </div>
                                                              </div>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    ) : (
                                                      ''
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        }
                                      )
                                    ) : item2?.permissions?.length ? (
                                      <div
                                        className="d-flex"
                                        style={{
                                          justifyContent: 'space-between',
                                        }}
                                      >
                                        {item2?.permissions?.map(
                                          (item5, key5) => {
                                            return (
                                              <div className="ms-2" key={key5}>
                                                <div
                                                  className={`form-check ${styles.flexRow}`}
                                                >
                                                  <input
                                                    className="form-check-input me-2"
                                                    style={{
                                                      padding: '10px 10px',
                                                    }}
                                                    type="checkbox"
                                                    id={key5}
                                                    checked={permissions.includes(
                                                      item5?.code
                                                    )}
                                                    onChange={(e) => {
                                                      handlePermission(
                                                        e,
                                                        item5,
                                                        item2?.permissions
                                                      );
                                                    }}
                                                  />
                                                  <label
                                                    className={`form-check-label position-static ${styles.maxContentWidth}`}
                                                    style={{
                                                      color: 'black',
                                                      transform:
                                                        'translateY(0px)',
                                                    }}
                                                    htmlFor={key5}
                                                  >
                                                    {item5?.name}
                                                  </label>
                                                </div>
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {permissionError && (
              <div className={`error ml-1 mt-2`}>
                <p className={`${styles.errorcolor}`}>{permissionError}</p>
              </div>
            )}
          </div>
        </form>
        <div className="form-footer">
          <button
            className="btn btn-secondary btn-md btn-border-none"
            onClick={() => setCloseModal(true)}
          >
            Cancel
          </button>

          <button
            type="button"
            className={` ${`btn btn-md btn-primary`}`}
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserRole;
