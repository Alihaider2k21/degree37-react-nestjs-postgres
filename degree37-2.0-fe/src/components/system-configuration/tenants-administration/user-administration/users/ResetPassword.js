import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './index.module.scss';
import FormInput from './FormInput';
import Topbar from '../../../../common/topbar/index';
import SuccessPopUpModal from '../../../../common/successModal';
import CancelIconImage from '../../../../../assets/images/ConfirmCancelIcon.png';
import ResetPasswordImage from '../../../../../assets/password-reset.svg';
import { UsersBreadCrumbsData } from '../UsersBreadCrumbsData';
import { useAuth } from '../../../../common/context/AuthContext';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

const errorIniitialState = {
  password: '',
  confirm_password: '',
};

const userInitialState = {
  first_name: '',
  last_name: '',
  unique_identifier: '',
  email: '',
  date_of_birth: '',
  gender: '',
  home_phone_number: '',
  work_phone_number: '',
  work_phone_extension: '',
  address_line_1: '',
  address_line_2: '',
  zip_code: '',
  city: '',
  state: '',
  role: '',
  is_active: true,
};

const ResetPassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [passwordResetDialog, setPasswordResetDialog] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [user, setUser] = useState(userInitialState);
  const { authenticated } = useAuth();
  const [errors, setErrors] = useState(errorIniitialState);
  const [passFields, setPassFields] = useState({
    password: '',
    confirm_password: '',
  });

  useEffect(() => {
    fetchData(id);
  }, [id]);

  async function fetchData(id) {
    try {
      const bearerToken = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/tenant-users/${id}`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
      if (response.status === 200) {
        const data = response.data; // Extract the JSON data
        setUser(data?.data); // Update state with the extracted data
      } else {
        toast.error('Error getting user details', { autoClose: 3000 });
      }
    } catch (error) {
      toast.error('An error occurred while fetching user details', {
        autoClose: 3000,
      });
    }
  }
  const handleLogout = async () => {
    const jwtToken = localStorage.getItem('token');
    const currentUser = jwtDecode(jwtToken);
    const isCurrentUserId = currentUser?.id === id;
    if (!isCurrentUserId) {
      navigate('/system-configuration/tenant-admin/user-admin/users');
    } else {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('menuItems');
        authenticated.logout();
        navigate('/login');
      } catch (e) {
        console.log(e);
        navigate('/login');
      }
    }
  };
  const BreadcrumbsData = [
    ...UsersBreadCrumbsData,
    {
      label: 'Users',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/user-admin/users',
    },
    {
      label: 'Reset Password',
      class: 'disable-label',
      link: `/system-configuration/tenant-admin/user-admin/users/${id}/reset-password`,
    },
  ];
  const handleCancelClick = () => {
    setShowConfirmationDialog(true);
  };
  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate('/system-configuration/tenant-admin/user-admin/users');
    }
  };

  const handleConfirmationPassword = async (e, confirmed) => {
    setPasswordResetDialog(false);
    if (confirmed) {
      try {
        const bearerToken = localStorage.getItem('token');
        const response = await axios.patch(
          `${BASE_URL}/tenant-users/${id}/update_password`,
          { password: passFields?.password },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        if (response?.status === 200) {
          setSuccessMessage(true);
          setTimeout(() => {
            handleLogout();
          }, 1200);
        } else {
          toast.error('Unable to update password.');
        }
      } catch (error) {
        toast.error('An error occurred while fetching user details', {
          autoClose: 3000,
        });
      }
    }
  };

  const checkErrors = (e, config_name = null, state_name = null) => {
    const { name, value } = e.target;
    let errorMessage = '';
    if (value.trim() === '') {
      errorMessage = `${
        name == 'password' ? 'Password' : 'Confirm password'
      } is required.`;
    }

    switch (name) {
      case 'password':
        if (passFields.confirm_password) {
          if (value !== passFields.confirm_password) {
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
        if (passFields.password !== value) {
          return "Confirm password didn't match with password.";
        } else {
          return errorMessage;
        }

      default:
        return errorMessage;
    }
  };
  const handlePasswordResetCLick = () => {
    const copy = {
      password: checkErrors({
        target: { name: 'password', value: passFields.password },
      }),
      confirm_password: checkErrors({
        target: {
          name: 'confirm_password',
          value: passFields.confirm_password,
        },
      }),
    };
    setErrors({ ...copy });

    if (!(copy.password || copy.confirm_password)) {
      setPasswordResetDialog(true);
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPassFields({ ...passFields, [name]: value });
  };
  const handleInputBlur = (e, config_name = null, state_name = null) => {
    const { name, value } = e.target;
    let errorMessage = '';
    if (value.trim() === '') {
      errorMessage = `${
        name == 'password' ? 'Password' : 'Confirm password'
      } is required.`;
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    switch (name) {
      case 'password':
        if (passFields.confirm_password) {
          if (value !== passFields.confirm_password) {
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
        if (passFields.password !== value) {
          setError(
            'confirm_password',
            "Confirm password didn't match with password."
          );
        } else {
          setError(name, errorMessage);
        }
        break;

      default:
        setError(name, errorMessage);
    }
  };

  return (
    <div className="mainContent">
      <Topbar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Users'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className={`mainContentInner`}>
        <form className={`${styles.addUserRoles} mt-1 mb-4`}>
          <div className={`formGroup ${styles.formGroup}`}>
            <h5>Reset Password</h5>
            <FormInput
              label="First Name*"
              name="first_name"
              disabled
              value={user?.first_name}
            />
            <FormInput
              label="Last Name*"
              name="last_name"
              disabled
              value={user?.last_name}
            />
            <FormInput
              label="Work Email*"
              name="last_name"
              disabled
              value={user?.email}
            />
            <FormInput
              label="Work Phone"
              name="work_phone_number"
              value={user?.work_phone_number}
              disabled
            />
            <FormInput
              label="Mobile Phone"
              name="mobile_number"
              value={user?.mobile_number}
              disabled
            />
            <p className="w-100 mt-2">
              Status
              {user?.is_active ? (
                <span className={`${styles.badge} ${styles.active}`}>
                  Active
                </span>
              ) : (
                <span className={`${styles.badge} ${styles.inactive}`}>
                  Inactive
                </span>
              )}
            </p>
          </div>
        </form>
        <form className={`${styles.addUserRoles} mt-3  mb-5`}>
          <div className={`formGroup ${styles.formGroup}`}>
            <h6 className="mt-2">Enter New Password</h6>
            <FormInput
              label="Password*"
              name="password"
              value={passFields?.password}
              onChange={(e) => {
                handleChange(e, 'password');
                handleInputBlur(e);
              }}
              isPassword
              error={errors?.password}
              errorHandler={handleInputBlur}
            />
            <FormInput
              label="Confirm Password*"
              name="confirm_password"
              value={passFields?.confirm_password}
              isPassword
              error={errors?.confirm_password}
              errorHandler={handleInputBlur}
              onChange={(e) => {
                handleChange(e, 'confirm_password');
                handleInputBlur(e);
              }}
            />
          </div>
        </form>
        <div className={`form-footer`}>
          <div></div>
          <div>
            <button
              className={`btn btn-md btn-link me-0 pe-4`}
              style={{ fontSize: '14px' }}
              onClick={handleCancelClick}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-md btn-primary`}
              onClick={handlePasswordResetCLick}
            >
              Update Password
            </button>
          </div>
        </div>
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
            passwordResetDialog ? 'active' : ''
          }`}
        >
          <div className="popup-inner">
            <div className="icon border-0 ">
              <img src={ResetPasswordImage} alt="ResetPasswordIcon" />
            </div>
            <div className="content">
              <h3>Confirmation</h3>
              <p>Are you sure you want to Reset Password?</p>
              <div className="buttons">
                <button
                  className="btn btn-secondary"
                  onClick={(e) => handleConfirmationPassword(e, false)}
                >
                  No
                </button>
                <button
                  className="btn btn-primary"
                  onClick={(e) => handleConfirmationPassword(e, true)}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </section>
        <SuccessPopUpModal
          title="Success!"
          message={'Password updated.'}
          modalPopUp={showSuccessMessage}
          showActionBtns={true}
          isNavigate={true}
          isArchived={false}
          setModalPopUp={setShowSuccessMessage}
        />
        <SuccessPopUpModal
          title="Success!"
          message={'Password updated.'}
          modalPopUp={successMessage}
          showActionBtns={true}
          isArchived={false}
          isNavigate={false}
          redirectPath={'/system-configuration/tenant-admin/user-admin/users'}
          setModalPopUp={setSuccessMessage}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
