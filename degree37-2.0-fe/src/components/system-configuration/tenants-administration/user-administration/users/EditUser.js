import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import TopBar from '../../../../common/topbar/index';
import i from '../../../../../assets/i-icon.svg';
import ArchiveImage from '../../../../../assets/archive.svg';
import CancelIconImage from '../../../../../assets/images/ConfirmCancelIcon.png';
import SuccessIcon from '../../../../../assets/success.svg';
import jwtDecode from 'jwt-decode';
import SuccessPopUpModal from '../../../../common/successModal';
import FormInput from '../../../../common/form/FormInput';
import SelectDropdown from '../../../../common/selectDropdown';
import GlobalMultiSelect from '../../../../common/GlobalMultiSelect';
import { UsersBreadCrumbsData } from '../UsersBreadCrumbsData';
import axios from 'axios';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [loginUser, setLoginUser] = React.useState(null);
  const [siteNavigate, setSiteNavigate] = useState(false);
  const [tempBusinessUnits, setTempBusinessUnits] = useState();
  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState([]);
  const [showCreatedUser, setCreatedUser] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [archiveStatus, setArchiveStatus] = useState(false);
  const [showConfirmationDialogArchive, setShowConfirmationDialogArchive] =
    useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [businessUnitsError, setBusinessUnitsError] = useState('');
  const [addUser, setaddUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    work_phone_number: '',
    mobile_number: '',
    override: true,
    hierarchy_level: null,
    // resource_sharing: true,
    // adjust_appointment_slots: true,
    // edit_locked_fields: true,
    is_active: true,
    all_hierarchy_access: false,
    is_manager: true,
    account_state: true,
  });
  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    work_phone_number: '',
    mobile_number: '',
    hierarchy_level: '',
    role: '',
    // assigned_manager: "",
  });
  const [businessUnits, setBusinessUnits] = useState(null);
  const [roles, setRoles] = useState();
  const [users, setUsers] = useState();
  const [hierarchyLevel, setHierarchyLevel] = useState(null);
  const bearerToken = localStorage.getItem('token');

  const BreadcrumbsData = [
    ...UsersBreadCrumbsData,
    {
      label: 'Users',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/user-admin/users',
    },
    {
      label: 'Edit User',
      class: 'disable-label',
      link: `/system-configuration/tenant-admin/user-admin/users/${id}/edit`,
    },
  ];

  React.useMemo(() => {
    setLoginUser(jwtDecode(localStorage.getItem('token')));
  }, []);

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
        setBusinessUnits(data?.data);
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

      const response = await axios.get(`${BASE_URL}/tenant-users/managers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      if (data?.data) {
        setUsers(data?.data?.filter((user) => user?.id !== id));
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
    fetchData(id);
  }, [id]);

  useEffect(() => {
    if (
      addUser?.hierarchy_level?.value &&
      businessUnits?.length &&
      tempBusinessUnits?.length
    ) {
      let updatedParentList = tempBusinessUnits?.filter(
        (item) =>
          item.organizational_level_id?.id == addUser?.hierarchy_level?.value
      );

      setBusinessUnits([...updatedParentList]);
    }
  }, [addUser?.hierarchy_level, businessUnits?.length]);

  const isTenantAdminRole = (roleId) => {
    if (addUser) {
      return addUser?.role?.tenantAdminRole ?? false;
    } else {
      return false;
    }
  };

  async function fetchData(id) {
    try {
      const response = await axios.get(`${BASE_URL}/tenant-users/${id}`, {
        headers: { authorization: `Bearer ${bearerToken}` },
      });
      if (response.data.status_code === 200) {
        const data = response.data; // Extract the JSON data
        setaddUser(data?.data); // Update state with the extracted data
        setaddUser((prevUser) => ({
          ...prevUser,
          original_role: data?.data?.role,
          role: {
            label: data?.data?.role?.name,
            value: data?.data?.role?.id,
            tenantAdminRole: data?.data?.role?.is_auto_created,
          },
          assigned_manager: data?.data?.assigned_manager
            ? {
                label:
                  data?.data?.assigned_manager?.first_name +
                  ' ' +
                  data?.data?.assigned_manager?.last_name,
                value: data?.data?.assigned_manager?.id,
              }
            : null,
          hierarchy_level: data?.data?.hierarchy_level
            ? {
                label: data?.data?.hierarchy_level?.name,
                value: data?.data?.hierarchy_level?.id,
              }
            : null,
        }));
        setSelectedBusinessUnits(
          data?.data?.business_units.map((bu) => {
            return {
              name: bu.business_unit_id.name,
              id: bu.business_unit_id.id,
            };
          })
        );
      } else {
        toast.error('Error getting user details', { autoClose: 3000 });
      }
    } catch (error) {
      toast.error('An error occurred while fetching user details', {
        autoClose: 3000,
      });
    }
  }
  const handleUserCreated = (confirmed) => {
    setCreatedUser(false);
    setSiteNavigate(false);
    if (confirmed) {
      navigate('/system-configuration/tenant-admin/user-admin/users');
    }
  };
  const handleCancelClick = () => {
    console.log(unsavedChanges);
    setShowConfirmationDialog(true);
  };
  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate('/system-configuration/tenant-admin/user-admin/users');
    }
  };

  function titleCase(string) {
    if (string) return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }
  const handleClickArchive = () => {
    setShowConfirmationDialogArchive(true);
  };

  const handleConfirmationResultArchive = async (confirmed) => {
    setShowConfirmationDialogArchive(false);
    if (confirmed) {
      try {
        const response = await axios.patch(
          `${BASE_URL}/tenant-users/archive/${id}`,
          null,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        if (response?.status === 200) {
          setTimeout(() => {
            setArchiveStatus(true);
          }, 600);
        } else {
          const { message } = await response.json();
          toast.error(message, {
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error('An error occurred while fetching user details', {
          autoClose: 3000,
        });
      }
    }
  };

  const handleInputBlur = (e) => {
    setUnsavedChanges(true);
    const { name, value } = e.target;
    let errorMessage = '';
    if (value === null || value?.trim() === '') {
      const nameObject = {
        hierarchy_level: 'Organizational Level',
        role: 'Role',
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
        if (value?.length < 8) {
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
  const handleFormInput = (e, key, config_name = null) => {
    setUnsavedChanges(true);
    const { value } = e.target;
    setaddUser((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const checkErrors = (name, value) => {
    setUnsavedChanges(true);

    let errorMessage = '';
    if (value === null || value?.trim() === '') {
      const nameObject = {
        hierarchy_level: 'Organizational Level',
        role: 'Role',
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
        if (value?.length < 8) {
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
    };

    setErrors({ ...copy });
    return copy;
  };

  const handleSubmit = async (e) => {
    const errObject = validateForm();
    if (!(selectedBusinessUnits?.length > 0)) {
      setBusinessUnitsError('Business units are required.');
    } else setBusinessUnitsError('');
    e.preventDefault();
    if (Object.values(errObject).every((value) => value === '')) {
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
      const parsedId = parseInt(id, 10);
      const parsedHeirarcyLevel = parseInt(hierarchy_level?.value, 10);
      let user = jwtDecode(localStorage.getItem('token'));
      let body = {
        id: parsedId,
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
        updated_by: user?.id,
      };

      try {
        const response = await axios.put(`${BASE_URL}/tenant-users`, body, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
        });
        const data = response.data;
        if (data?.status === 'success') {
          setCreatedUser(true);
          setSiteNavigate(e.target.name === 'Save_&_Close');
        } else if (data?.status !== 'success') {
          // Handle the error response here
          // For instance, displaying the error message from the response
          toast.error(data.response, { autoClose: 3000 });
        }
      } catch (error) {
        // Handle network errors or other exceptions here
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };

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
      <section
        className={`popup full-section ${showCreatedUser ? 'active' : ''}`}
      >
        <div className="popup-inner">
          <div className="icon">
            <img className="bg-light" src={SuccessIcon} alt="SuccessIcon" />
          </div>
          <div className="content">
            <h3>Success!</h3>
            <p>User updated.</p>
            <div className="buttons  ">
              <button
                className="btn btn-primary w-100"
                onClick={() => handleUserCreated(siteNavigate)}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </section>
      <SuccessPopUpModal
        title="Success!"
        message="User is archived."
        modalPopUp={archiveStatus}
        isNavigate={true}
        setModalPopUp={setArchiveStatus}
        showActionBtns={true}
        redirectPath={`/system-configuration/tenant-admin/user-admin/users`}
      />
      <div className="mainContentInner form-container">
        <form className="addUser">
          <div className={`formGroup ${styles.formGroup}`}>
            <h5>Edit User</h5>
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
                  disabled
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
              className={`form-field ${styles.checkbox} align-self-center ${styles.formFeild}`}
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
            <div className={`form-field ${styles.formFeild}`}>
              <div className={`field d-flex ${styles.select_hover}`}>
                <SelectDropdown
                  styles={{ root: 'w-100' }}
                  placeholder={'Organizational Level*'}
                  defaultValue={addUser?.hierarchy_level}
                  selectedValue={addUser?.hierarchy_level}
                  removeDivider
                  showLabel
                  disabled={addUser?.role?.tenantAdminRole}
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
              <div className={`field d-flex ${styles.select_hover}`}>
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
                  disabled={id === loginUser?.id}
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
              {errors?.role && (
                <div className="error">
                  <p>{errors?.role}</p>
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
            <p className="fw-medium w-100 fs-6">Privileges</p>
            <div className="row w-100 mb-4">
              <div className="col-6">
                <div
                  className={`form-field mb-3 pb-2 w-100 ${styles.checkbox} ${styles.formFeild}`}
                >
                  <input
                    className="form-check-input mt-0 "
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
                  className={`form-field w-100 ${styles.checkbox} ${styles.formFeild}`}
                >
                  <input
                    className="form-check-input mt-0 "
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
              {/* <div className="col-6">
                <div
                  className={`form-field mb-3 pb-2 w-100 ${styles.checkbox} ${styles.formFeild}`}
                >
                  <input
                    className="form-check-input mt-0 "
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
                <div
                  className={`form-field w-100 ${styles.checkbox} ${styles.formFeild}`}
                >
                  <input
                    className="form-check-input mt-0 "
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
          className={`popup full-section ${
            showConfirmationDialogArchive ? 'active' : ''
          }`}
        >
          <div className="popup-inner">
            <div className="icon">
              <img src={ArchiveImage} alt="CancelIcon" />
            </div>
            <div className="content">
              <h3>Confirmation</h3>
              <p>Are you sure you want to archive?</p>
              <div className="buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleConfirmationResultArchive(false)}
                >
                  No
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleConfirmationResultArchive(true)}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </section>
        <div className="form-footer ">
          {!addUser?.original_role?.is_auto_created && (
            <div>
              <div className="archived" onClick={handleClickArchive}>
                Archive
              </div>
            </div>
          )}
          <div>
            <button
              className={`btn btn-md btn-link me-0 pe-4`}
              onClick={handleCancelClick}
            >
              Cancel
            </button>
            <button
              name="Save_&_Close"
              className={`btn btn-md btn-secondary`}
              onClick={handleSubmit}
            >
              Save & Close
            </button>
            <button
              type="button"
              name="Save Changes"
              className={`btn btn-md btn-primary`}
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
