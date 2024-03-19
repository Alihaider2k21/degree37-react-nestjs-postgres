import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './index.module.scss';
import FormInput from '../../../../common/form/FormInput';
import FormInputPassword from './FormInput';
import TopBar from '../../../../common/topbar/index';
import CancelIconImage from '../../../../../assets/images/ConfirmCancelIcon.png';
import SuccessIcon from '../../../../../assets/success.svg';
import i from '../../../../../assets/i-icon.svg';
import jwtDecode from 'jwt-decode';
import { useSearchParams } from 'react-router-dom';
import { API } from '../../../../../api/api-routes';
import SelectDropdown from '../../../../common/selectDropdown';
import GlobalMultiSelect from '../../../../common/GlobalMultiSelect';
import { UsersBreadCrumbsData } from '../UsersBreadCrumbsData';
import axios from 'axios';

const AddUser = () => {
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const createButton = useRef(null);
  const [hierarchyLevel, setHierarchyLevel] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showCreatedUser, setCreatedUser] = useState(false);
  const [businessUnits, setBusinessUnits] = useState();
  const [tempBusinessUnits, setTempBusinessUnits] = useState();
  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState([]);
  const [createButtonStatus, setCreateButtonStatus] = useState(false);
  const [roles, setRoles] = useState();
  const [searchParams] = useSearchParams();
  const staff_id = searchParams.get('staff_id');
  const [businessUnitsError, setBusinessUnitsError] = useState('');

  const [users, setUsers] = useState();
  const [addUser, setaddUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    work_phone_number: '',
    is_manager: false,
    hierarchy_level: null,
    role: null,
    assigned_manager: null,
    override: false,
    // adjust_appointment_slots: false,
    // resource_sharing: false,
    // edit_locked_fields: false,
    is_active: true,
    all_hierarchy_access: false,
    account_state: true,
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    work_phone_number: '',
    mobile_number: '',
    hierarchy_level: null,
    role: null,
    // assigned_manager: "",
    password: '',
    confirm_password: '',
  });

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');

    const getBusinessUnits = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/business_units?limit=1000&status=true`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        const data = response.data;
        setBusinessUnits([]);
        setTempBusinessUnits(data?.data);
      } catch (error) {
        toast.error(error);
      }
    };
    getBusinessUnits();

    const getAllRoles = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/roles/tenant/all`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const data = response.data;
        if (data?.status === 'success') {
          setRoles(
            data?.data?.filter((item) => item?.role?.is_auto_created == false)
          );
        }
      } catch (error) {
        toast.error(error);
      }
    };
    getAllRoles();

    const getManagersData = async () => {
      const accessToken = localStorage.getItem('token');
      try {
        const response = await axios.get(`${BASE_URL}/tenant-users/managers`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = response.data;
        if (data?.data) {
          setUsers(data?.data);
        }
      } catch (error) {
        // Handle error if needed
      }
    };

    getManagersData();

    const getHeirarchyData = async () => {
      const accessToken = localStorage.getItem('token');

      const response = await axios.get(`${BASE_URL}/organizational_levels`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      if (data?.data) {
        setHierarchyLevel(data?.data);
      }
    };
    getHeirarchyData();
  }, []);

  useEffect(() => {
    if (staff_id) {
      const getStaffData = async () => {
        const response = await API.crm.contacts.staff.getStaffByID(staff_id);
        const staffData = response?.data?.data;

        const getContactDetails = (contact_type) => {
          const details = staffData?.contact?.find(
            (ct) => ct?.contact_type === contact_type
          );
          return details?.data;
        };
        const email = getContactDetails(4);
        const mobile_number = getContactDetails(2);
        const work_phone = getContactDetails(1);

        if (staffData) {
          const data = {
            first_name: staffData?.first_name || '',
            last_name: staffData?.last_name || '',
            email: email || '',
            mobile_number: mobile_number || '',
            work_phone_number: work_phone || '',
          };

          setaddUser((prevData) => ({
            ...prevData,
            ...data,
          }));
        }
      };
      getStaffData();
    }
  }, [staff_id]);

  const isTenantAdminRole = (roleId) =>
    roles?.some((obj) => obj.role.id === roleId && obj.role.is_auto_created);

  const handleCancelClick = () => {
    console.log(unsavedChanges);
    setShowConfirmationDialog(true);
  };

  function titleCase(string) {
    if (string) return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate('/system-configuration/tenant-admin/user-admin/users');
    }
  };
  const handleUserCreated = (confirmed) => {
    setCreatedUser(false);
    if (confirmed) {
      navigate('/system-configuration/tenant-admin/user-admin/users');
    }
  };

  const handleFormInput = (e, key) => {
    setUnsavedChanges(true);

    setaddUser((prevData) => ({
      ...prevData,
      [key]: e?.target?.value ?? null,
    }));
  };

  const handleInputBlur = (e) => {
    setUnsavedChanges(true);
    const { name, value } = e.target;
    let errorMessage = '';
    if (value === null || value?.trim() === '') {
      const nameObject = {
        hierarchy_level: 'Organizational Level',
        role: 'Role',
        confirm_password: 'Confirm Password',
      };
      errorMessage = `${titleCase(nameObject[name])} is required.`;
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };
    switch (name) {
      case 'first_name':
      case 'last_name': {
        const nameRegex = /^[A-Za-z ]+$/;
        const isValidName = nameRegex.test(value);
        if (!value) {
          errorMessage = `${
            name == 'first_name' ? 'First name' : 'Last name'
          } is required.`;
        } else if (!isValidName) {
          errorMessage = 'Only alphabet characters are permitted.';
        }
        setError(name, errorMessage);
        break;
      }
      case 'password':
        if (addUser.confirm_password) {
          if (value !== addUser.confirm_password) {
            setError(
              'confirm_password',
              "Confirm password didn't match with password."
            );
          } else {
            setError('confirm_password', '');
          }
        }
        if (value.length < 8) {
          errorMessage = 'Password should be at least 8 characters long.';
        } else if (!/[A-Z]/.test(value)) {
          errorMessage =
            'Password should contain at least one uppercase letter.';
        } else if (!/[a-z]/.test(value)) {
          errorMessage =
            'Password should contain at least one lowercase letter.';
        } else if (!/[0-9]/.test(value)) {
          errorMessage =
            'Password should contain at least one numeric character.';
        } else if (!/[^A-Za-z0-9]/.test(value)) {
          errorMessage =
            'Password should contain at least one special character.';
        }
        setError(name, errorMessage);
        break;
      case 'confirm_password':
        if (addUser.password !== value) {
          setError(
            'confirm_password',
            "Confirm password didn't match with password."
          );
        } else {
          setError(name, errorMessage);
        }
        break;
      case 'mobile_number': {
        const regex = /^\(\d{3}\) \d{3}-\d{4}$/;
        const isValidPhoneNumber = regex.test(value);
        if (!value) {
          errorMessage = '';
        } else if (!isValidPhoneNumber) {
          errorMessage =
            'Please enter a valid phone number in the format (123) 456-7890.';
        }
        setError(name, errorMessage);
        break;
      }
      case 'work_phone_number': {
        const regex = /^\(\d{3}\) \d{3}-\d{4}$/;
        const isValidPhoneNumber = regex.test(value);
        if (!value) {
          errorMessage = '';
        } else if (!isValidPhoneNumber) {
          errorMessage =
            'Please enter a valid phone number in the format (123) 456-7890.';
        }
        setError(name, errorMessage);
        break;
      }
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(value);
        if (!value) {
          errorMessage =
            'Please enter a valid email address, e.g: example@example.com';
        } else if (!isValidEmail) {
          errorMessage =
            'Please enter a valid email address, e.g: example@example.com';
        }
        setError(name, errorMessage);
        break;
      }
      default:
        setError(name, errorMessage);
    }
  };

  const checkErrors = (name, value) => {
    setUnsavedChanges(true);

    let errorMessage = '';
    if (value === null || value?.trim() === '') {
      const nameObject = {
        hierarchy_level: 'Organizational Level',
        role: 'Role',
        confirm_password: 'Confirm Password',
      };

      errorMessage = `${titleCase(nameObject[name])} is required.`;
    }

    switch (name) {
      case 'first_name':
      case 'last_name': {
        const nameRegex = /^[A-Za-z ]+$/;
        const isValidName = nameRegex.test(value);
        if (!value) {
          errorMessage = `${
            name == 'first_name' ? 'First name' : 'Last name'
          } is required.`;
        } else if (!isValidName) {
          errorMessage = 'Only alphabet characters are permitted.';
        }
        return errorMessage;
      }
      case 'password':
        if (addUser.confirm_password) {
          if (value !== addUser.confirm_password) {
            return "Confirm password didn't match with password.";
          } else {
            return '';
          }
        }
        if (value.length < 8) {
          errorMessage = 'Password should be at least 8 characters long.';
        } else if (!/[A-Z]/.test(value)) {
          errorMessage =
            'Password should contain at least one uppercase letter.';
        } else if (!/[a-z]/.test(value)) {
          errorMessage =
            'Password should contain at least one lowercase letter.';
        } else if (!/[0-9]/.test(value)) {
          errorMessage =
            'Password should contain at least one numeric character.';
        } else if (!/[^A-Za-z0-9]/.test(value)) {
          errorMessage =
            'Password should contain at least one special character.';
        }
        return errorMessage;
      case 'confirm_password':
        if (addUser.password !== value) {
          return "Confirm password didn't match with password.";
        } else {
          return errorMessage;
        }
      case 'mobile_number': {
        const regex = /^\(\d{3}\) \d{3}-\d{4}$/;
        const isValidPhoneNumber = regex.test(value);
        if (!value) {
          errorMessage = '';
        } else if (!isValidPhoneNumber) {
          errorMessage =
            'Please enter a valid phone number in the format (123) 456-7890.';
        }
        return errorMessage;
      }
      case 'work_phone_number': {
        const regex = /^\(\d{3}\) \d{3}-\d{4}$/;
        const isValidPhoneNumber = regex.test(value);
        if (!value) {
          errorMessage = '';
        } else if (!isValidPhoneNumber) {
          errorMessage =
            'Please enter a valid phone number in the format (123) 456-7890.';
        }
        return errorMessage;
      }
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(value);
        if (!value) {
          errorMessage =
            'Please enter a valid email address, e.g: example@example.com';
        } else if (!isValidEmail) {
          errorMessage =
            'Please enter a valid email address, e.g: example@example.com';
        }
        return errorMessage;
      }
      default:
        return errorMessage;
    }
  };

  const validateForm = () => {
    const copy = {
      ...errors,
      first_name: checkErrors('first_name', addUser.first_name),
      last_name: checkErrors('last_name', addUser.last_name),
      email: checkErrors('email', addUser.email),
      work_phone_number: checkErrors(
        'work_phone_number',
        addUser.work_phone_number
      ),
      mobile_number: checkErrors('mobile_number', addUser.mobile_number),
      hierarchy_level: isTenantAdminRole(addUser.role?.value)
        ? ''
        : checkErrors(
            'hierarchy_level',
            addUser.hierarchy_level?.value ?? null
          ),
      role: checkErrors('role', addUser.role?.value ?? null),
      password: checkErrors('password', addUser.password),
      confirm_password: checkErrors(
        'confirm_password',
        addUser.confirm_password
      ),
    };

    setErrors({ ...copy });
    return copy;
  };

  const handleSubmit = async (e) => {
    const errObject = validateForm();
    if (!(selectedBusinessUnits?.length > 0)) {
      setBusinessUnitsError('Business units are required.');
    } else setBusinessUnitsError('');
    setCreateButtonStatus(true);
    if (Object.values(errObject).every((value) => value == '')) {
      e.preventDefault();
      // createButton.current.disabled = true;
      const {
        first_name,
        last_name,
        email,
        work_phone_number,
        mobile_number,
        hierarchy_level,
        role,
        assigned_manager,
        is_active,
        all_hierarchy_access,
        password,
        is_manager,
        override,
        // adjust_appointment_slots,
        // resource_sharing,
        // edit_locked_fields,
        account_state,
      } = addUser;
      const parsedassigned_manager = parseInt(assigned_manager?.value, 10);
      const parsedrole = parseInt(role?.value, 10);
      const parsedHeirarcyLevel = parseInt(hierarchy_level?.value, 10);
      let user = jwtDecode(localStorage.getItem('token'));
      let body = {
        first_name,
        last_name,
        email,
        work_phone_number,
        mobile_number,
        hierarchy_level: parsedHeirarcyLevel,
        business_units: selectedBusinessUnits.map((bu) => bu.id),
        role: parsedrole,
        assigned_manager: parsedassigned_manager,
        is_active,
        all_hierarchy_access,
        password,
        is_manager,
        override,
        // adjust_appointment_slots,
        // resource_sharing,
        // edit_locked_fields,
        account_state,
        created_by: user.id,
      };

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${BASE_URL}/tenant-users`, body, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;

        if (data?.status === 'success') {
          setCreateButtonStatus(false);
          setCreatedUser(true);
        } else {
          setCreateButtonStatus(false);
          const showMessage = Array.isArray(data?.message)
            ? data?.message[0]
            : data?.message;
          toast.error(`${showMessage}`, { autoClose: 3000 });
        }
      } catch (error) {
        setCreateButtonStatus(false);
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
    setCreateButtonStatus(false);
    // createButton.current.disabled = false;
  };

  const BreadcrumbsData = [
    ...UsersBreadCrumbsData,
    {
      label: 'Users',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/user-admin/users',
    },
    {
      label: 'Create User',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/user-admin/users/create',
    },
  ];

  const handleBusinessUnitsChange = (businessUnitsTemp) => {
    let tempBu = [...selectedBusinessUnits];
    tempBu = tempBu.some((item) => item.id === businessUnitsTemp.id)
      ? tempBu.filter((item) => item.id !== businessUnitsTemp.id)
      : [...tempBu, businessUnitsTemp];
    if (!(tempBu?.length > 0)) {
      setBusinessUnitsError('Business units are required.');
    } else setBusinessUnitsError('');
    setSelectedBusinessUnits(tempBu);
  };

  const handleBusinessUnitsChangeAll = (data) => {
    if (!(data?.length > 0)) {
      setBusinessUnitsError('Business units are required.');
    } else setBusinessUnitsError('');
    setSelectedBusinessUnits(data);
  };

  const handleBusinessUnitsOnBlur = () => {
    if (!(selectedBusinessUnits?.length > 0)) {
      setBusinessUnitsError('Business units are required.');
    } else setBusinessUnitsError('');
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Users'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form className="addUser">
          <div className={`formGroup ${styles.formGroup}`}>
            <h5>Create User</h5>
            <div className={`form-field ${styles.formFeild}`}>
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  value={addUser?.first_name}
                  name="first_name"
                  onBlur={handleInputBlur}
                  placeholder=" "
                  onChange={(e) => {
                    handleFormInput(e, 'first_name');
                    handleInputBlur(e);
                  }}
                  required
                />
                <label>First Name*</label>
              </div>
              {errors?.first_name && (
                <div className="error">
                  <div className="error">
                    <p>{errors?.first_name}</p>
                  </div>
                </div>
              )}
            </div>
            <div className={`form-field ${styles.formFeild}`}>
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  placeholder=" "
                  value={addUser?.last_name}
                  name="last_name"
                  onBlur={handleInputBlur}
                  onChange={(e) => {
                    handleFormInput(e, 'last_name');
                    handleInputBlur(e);
                  }}
                  required
                />
                <label>Last Name*</label>
              </div>
              {errors?.last_name && (
                <div className="error">
                  <p>{errors?.last_name}</p>
                </div>
              )}
            </div>
            <div className={`form-field ${styles.formFeild}`}>
              <div className="field">
                <input
                  type="email"
                  className="form-control"
                  placeholder=" "
                  value={addUser?.email}
                  name="email"
                  onBlur={handleInputBlur}
                  required
                  onChange={(e) => {
                    handleFormInput(e, 'email');
                    handleInputBlur(e);
                  }}
                />
                <label>Work Email*</label>
              </div>
              {errors?.email && (
                <div className="error">
                  <p>{errors?.email}</p>
                </div>
              )}
            </div>
            <div className={`form-field ${styles.formFeild}`}>
              <FormInput
                classes={{ root: 'w-100 mb-0' }}
                label="Work Phone"
                name="work_phone_number"
                variant="phone"
                displayName="Work Phone"
                value={addUser?.work_phone_number}
                onChange={(e) => {
                  handleFormInput(e, 'work_phone_number');
                  handleInputBlur(e);
                }}
                error={errors?.work_phone_number}
                required={false}
                onBlur={handleInputBlur}
              />
            </div>
            <div className={`form-field ${styles.formFeild}`}>
              <FormInput
                classes={{ root: 'w-100 mb-0' }}
                label="Mobile Phone"
                name="mobile_number"
                variant="phone"
                displayName="Mobile Phone"
                value={addUser?.mobile_number}
                onChange={(e) => {
                  handleFormInput(e, 'mobile_number');
                  handleInputBlur(e);
                }}
                error={errors?.mobile_number}
                required={false}
                onBlur={handleInputBlur}
              />
            </div>
            <div
              className={`form-field ${styles.formFeild} ${styles.checkbox} align-self-center `}
            >
              <input
                className="form-check-input mt-0"
                type="checkbox"
                id={`flexCheckDefault}`}
                onChange={() =>
                  setaddUser((prevState) => ({
                    ...prevState,
                    is_manager: !prevState?.is_manager,
                  }))
                }
                checked={addUser?.is_manager}
              />
              <label
                className="form-check-label me-2 "
                htmlFor="flexCheckDefault"
              >
                Manager
              </label>
              <div className={`${styles.tooltip}`}>
                <img src={i}></img>
                <span className={`${styles.tooltiptext}`}>
                  Managers are assigned to other users to manage requests
                  requiring approvals.
                </span>
              </div>
            </div>

            <p className="fw-medium w-100 fs-6">Other Information*</p>
            <div className={`form-field  ${styles.formFeild}}`}>
              <div className={`field d-flex ${styles.select_hover}`}>
                <SelectDropdown
                  styles={{ root: 'w-100' }}
                  placeholder={'Organizational Level*'}
                  defaultValue={addUser?.hierarchy_level}
                  selectedValue={addUser?.hierarchy_level}
                  disabled={isTenantAdminRole(addUser.role?.value)}
                  removeDivider
                  showLabel
                  onChange={(val) => {
                    if (val?.value != addUser?.hierarchy_level?.value) {
                      setSelectedBusinessUnits([]);
                    }

                    let updatedParentList = tempBusinessUnits?.filter(
                      (item) => item.organizational_level_id?.id == val?.value
                    );

                    setBusinessUnits([...updatedParentList]);

                    let e = {
                      target: {
                        value: val ?? null,
                      },
                    };
                    handleFormInput(e, 'hierarchy_level');
                    e = {
                      target: {
                        name: 'hierarchy_level',
                        value: val?.value ?? null,
                      },
                    };
                    handleInputBlur(e, null, 'hierarchy_level');
                  }}
                  options={hierarchyLevel?.map((hierarchy) => {
                    return {
                      value: hierarchy.id,
                      label: hierarchy.name,
                    };
                  })}
                />
              </div>
              {errors.hierarchy_level && (
                <div className="error">
                  <p>{errors.hierarchy_level}</p>
                </div>
              )}
            </div>
            <div className={`form-field ${styles.formFeild}`}>
              <div className={`field d-flex ${styles.select_hover} `}>
                <GlobalMultiSelect
                  label="Business Units*"
                  data={businessUnits?.map((businessUnit) => {
                    return {
                      id: businessUnit.id,
                      name: businessUnit.name,
                    };
                  })}
                  selectedOptions={selectedBusinessUnits}
                  error={businessUnitsError}
                  onChange={handleBusinessUnitsChange}
                  onSelectAll={handleBusinessUnitsChangeAll}
                  onBlur={handleBusinessUnitsOnBlur}
                />
              </div>
            </div>

            <div className={`form-field ${styles.formFeild}`}>
              <div className={`field d-flex ${styles.select_hover}`}>
                <SelectDropdown
                  styles={{ root: 'w-100' }}
                  placeholder={'Role* '}
                  defaultValue={addUser?.role}
                  selectedValue={addUser?.role}
                  removeDivider
                  showLabel
                  onChange={(val) => {
                    let e = {
                      target: {
                        value: val ?? null,
                      },
                    };
                    handleFormInput(e, 'role');
                    if (isTenantAdminRole(val?.value)) {
                      setaddUser((prev) => ({
                        ...prev,
                        hierarchy_level: null,
                      }));
                      setSelectedBusinessUnits([]);
                    }
                    e = {
                      target: {
                        name: 'role',
                        value: val?.value ?? null,
                      },
                    };
                    handleInputBlur(e, null, 'role');
                  }}
                  options={roles?.map((role) => ({
                    value: role?.role?.id,
                    label: role?.role?.name,
                  }))}
                />
              </div>
              {errors.role && (
                <div className="error">
                  <p>{errors.role}</p>
                </div>
              )}
            </div>
            <div className={`form-field ${styles.formFeild}`}>
              <div className={`field d-flex ${styles.select_hover}`}>
                <SelectDropdown
                  styles={{ root: 'w-100' }}
                  placeholder={'Assigned Manager'}
                  defaultValue={addUser?.assigned_manager}
                  selectedValue={addUser?.assigned_manager}
                  removeDivider
                  showLabel
                  onChange={(val) => {
                    let e = {
                      target: {
                        value: val ?? null,
                      },
                    };
                    handleFormInput(e, 'assigned_manager');
                    e = {
                      target: {
                        name: 'assigned_manager',
                        value: val?.value ?? null,
                      },
                    };
                  }}
                  options={users?.map((user) => {
                    return {
                      value: user.id,
                      label: user.first_name + '  ' + user.last_name,
                    };
                  })}
                />
              </div>
              {/* {errors?.assigned_manager && (
                <div className="error">
                  <p>{errors?.assigned_manager}</p>
                </div>
              )} */}
            </div>
            <p className="fw-medium w-100 fs-6">Password*</p>

            <FormInputPassword
              label="Password*"
              name="password"
              value={addUser?.password}
              onChange={(e) => {
                handleFormInput(e, 'password');
                handleInputBlur(e);
              }}
              isPassword
              error={errors?.password}
              errorHandler={handleInputBlur}
            />
            <FormInputPassword
              label="Confirm Password*"
              name="confirm_password"
              value={addUser?.confirm_password}
              onChange={(e) => {
                handleFormInput(e, 'confirm_password');
                handleInputBlur(e);
              }}
              isPassword
              error={errors?.confirm_password}
              errorHandler={handleInputBlur}
            />
            <p className="fw-medium w-100 fs-6">Privileges</p>
            <div className="row mb-4" style={{ minWidth: '80%' }}>
              <div className="col">
                <div
                  className={`form-field mb-3 pb-2 w-100 ${styles.checkbox} ${styles.formFeild}`}
                >
                  <input
                    className="form-check-input mt-0"
                    type="checkbox"
                    onChange={() =>
                      setaddUser((prevState) => ({
                        ...prevState,
                        override: !prevState?.override,
                      }))
                    }
                    checked={addUser?.override}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Override
                  </label>
                </div>
                {/* <div
                  className={`form-field mb-3 pb-2  w-100 ${styles.checkbox} ${styles.formFeild}`}
                >
                  <input
                    className="form-check-input mt-0"
                    type="checkbox"
                    onChange={() =>
                      setaddUser((prevState) => ({
                        ...prevState,
                        resource_sharing: !prevState?.resource_sharing,
                      }))
                    }
                    checked={addUser?.resource_sharing}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Resource Sharing Access
                  </label>
                </div> */}
              </div>
              {/* <div className="col-md-6">
                <div
                  className={`form-field  mb-3 pb-2 w-100 ${styles.checkbox} ${styles.formFeild}`}
                >
                  <input
                    className="form-check-input mt-0"
                    type="checkbox"
                    onChange={() =>
                      setaddUser((prevState) => ({
                        ...prevState,
                        adjust_appointment_slots:
                          !prevState?.adjust_appointment_slots,
                      }))
                    }
                    checked={addUser?.adjust_appointment_slots}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Adjust Appointment Slots
                  </label>
                </div>
                <div className={`form-field w-100 ${styles.checkbox}`}>
                  <input
                    className="form-check-input mt-0"
                    type="checkbox"
                    onChange={() =>
                      setaddUser((prevState) => ({
                        ...prevState,
                        edit_locked_fields: !prevState?.edit_locked_fields,
                      }))
                    }
                    checked={addUser?.edit_locked_fields}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Edit Locked Fields
                  </label>
                </div>
              </div> */}
            </div>
            <div className={`form-field checkbox ${styles.formFeild}`}>
              <span className="toggle-text">
                {addUser.is_active ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="status-toggle" className="switch">
                <input
                  type="checkbox"
                  id="status-toggle"
                  className="toggle-input"
                  onChange={() =>
                    setaddUser((prevState) => ({
                      ...prevState,
                      is_active: !prevState?.is_active,
                    }))
                  }
                  checked={addUser?.is_active}
                />
                <span className="slider round"></span>
              </label>
            </div>
            {/* <div className={`form-field checkbox ${styles.formFeild}`}>
              <span className="toggle-text">All Hierarchy Access</span>
              <label htmlFor="access-toggle" className="switch">
                <input
                  type="checkbox"
                  id="access-toggle"
                  className="toggle-input"
                  onChange={() =>
                    setaddUser((prevState) => ({
                      ...prevState,
                      all_hierarchy_access: !prevState?.all_hierarchy_access,
                    }))
                  }
                  checked={addUser?.all_hierarchy_access}
                />
                <span className="slider round"></span>
              </label>
            </div> */}
          </div>
        </form>
        <section
          className={`popup full-section ${
            showConfirmationDialog ? 'active' : ''
          }`}
        >
          <div className="popup-inner">
            <div className="icon">
              <img src={CancelIconImage} alt="CancelIcon" />
            </div>
            <div className="content">
              <h3>Confirmation</h3>
              <p>Unsaved changes will be lost. Do you wish to proceed?</p>
              <div className="buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleConfirmationResult(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleConfirmationResult(true)}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </section>
        <section
          className={`popup full-section ${showCreatedUser ? 'active' : ''}`}
        >
          <div className="popup-inner">
            <div className="icon">
              <img className="bg-light" src={SuccessIcon} alt="SuccessIcon" />
            </div>
            <div className="content">
              <h3>Success!</h3>
              <p>User created.</p>
              <div className="buttons  ">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => handleUserCreated(true)}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </section>
        <div className="form-footer">
          <p
            className={`mb-0 ${styles.cancelbutton}`}
            onClick={handleCancelClick}
          >
            Cancel
          </p>

          <button
            type="button"
            ref={createButton}
            disabled={createButtonStatus}
            className={` btn btn-md mb-0 btn-primary ${styles.createbtn} btn-primary
            `}
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
