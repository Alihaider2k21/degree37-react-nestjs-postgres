import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './index.module.scss';
import FormInput from './FormInput';
import Topbar from '../../../common/topbar/index';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../common/successModal';

const errorIniitialState = {
  password: '',
  confirm_password: '',
};

const formatDateDMY = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
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

function isEmpty(value) {
  return value === '' || value === null || value === undefined;
}

const ResetPassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [user, setUser] = useState(userInitialState);
  const [errors, setErrors] = useState(errorIniitialState);
  const [changesMade, setChangesMade] = useState(false);
  const [passFields, setPassFields] = useState({
    password: '',
    confirm_password: '',
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const getData = async (id) => {
      if (id) {
        const bearerToken = localStorage.getItem('token');
        const result = await fetch(`${BASE_URL}/user/${id}`, {
          headers: { authorization: `Bearer ${bearerToken}` },
        });
        if (result?.status === 200) {
          let { data } = await result.json();

          setUser({
            ...data,
            date_of_birth: formatDateDMY(data?.date_of_birth),
          });
        } else {
          toast.error('Error Fetching User Details', { autoClose: 3000 });
        }
      } else {
        toast.error('Error getting user Details', { autoClose: 3000 });
      }
    };
    if (id) {
      getData(id);
    }
  }, [id, BASE_URL]);

  const BreadcrumbsData = [
    { label: 'System Configurations', class: 'disable-label', link: '/' },
    {
      label: 'User Administration',
      class: 'active-label',
      link: '/system-configuration/platform-admin/user-administration/users',
    },
    {
      label: 'Reset Password',
      class: 'disable-label',
      link: `/system-configuration/platform-admin/user-administration/users/${id}/reset-password`,
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrorcheck = false;

    for (const key in errors) {
      if (isEmpty(passFields[key])) {
        tempErrorcheck = true;
        setErrors({ ...errors, [key]: 'Required' });
      }
    }
    if (tempErrorcheck) {
      toast.error('Please fill form properly.');
      return;
    }
    const bearerToken = localStorage.getItem('token');
    const result = await fetch(`${BASE_URL}/user/${user.id}/update_password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers you might need, such as authorization headers
        authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({ password: passFields?.password }),
    });
    if (result.status === 204) {
      setChangesMade(false);
      setShowSuccessMessage(true);
      setPassFields(errorIniitialState);
    } else if (result.status === 404) {
      toast.error('User not found', { autoClose: 3000 });
    } else {
      let res = await result.json();
      if (Array.isArray(res?.message))
        toast.error(res?.message?.[0], {
          autoClose: 3000,
        });
      else
        toast.error(`Error with statusCode:${result.status}`, {
          autoClose: 3000,
        });
    }
  };
  const handleCancel = () => {
    if (changesMade) setShowCancelModal(true);
    else navigate(-1);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPassFields({ ...passFields, [name]: value });
    setChangesMade(true);
  };
  const handleInputBlur = (e, config_name = null, other = null) => {
    const { name, value } = e.target;
    let errorMessage = '';

    if (value.trim() === '') {
      errorMessage = 'Required';
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    switch (name) {
      case 'password':
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
        if (other) {
          setError(other, errorMessage);
        } else {
          setError(name, errorMessage);
        }
        break;
    }
  };

  return (
    <div className="mainContent">
      <Topbar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'User Administration'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />

      <div className="mainContentInner">
        <form className={`${styles.addUserRoles} mt-5`}>
          <div className="formGroup">
            <h5>Reset Password</h5>
            <FormInput
              label="First Name"
              name="first_name"
              disabled
              readOnly
              value={user?.first_name}
              required
            />
            <FormInput
              label="Date of Birth"
              name="first_name"
              disabled
              readOnly
              value={user?.date_of_birth}
              required
            />

            <FormInput label="Gender" value={user.gender} disabled />
            <FormInput
              label="Work Phone Number"
              name="work_phone_number"
              value={user?.work_phone_number}
              disabled
            />

            <FormInput
              label="Address Line 1"
              value={user?.address_line_1}
              required
              disabled
              readOnly
            />
            <FormInput
              label="Admin Role"
              value={user?.role?.name}
              required
              disabled
              readOnly
            />

            <FormInput
              label="Email"
              name="email"
              value={user?.email}
              readOnly
              disabled
              required
            />

            <p className="w-100 mt-2">
              Status{' '}
              {user?.is_active ? (
                <span className={`${styles.badge} ${styles.active}`}>
                  {' '}
                  Active{' '}
                </span>
              ) : (
                <span className={`${styles.badge} ${styles.inactive}`}>
                  {' '}
                  Inactive{' '}
                </span>
              )}{' '}
            </p>
          </div>
        </form>

        <form className={`${styles.addUserRoles} mt-3  mb-5`}>
          <div className="formGroup">
            <h6 className="mt-2">Enter New Password</h6>

            <FormInput
              label="Password"
              name="password"
              value={passFields?.password}
              onChange={handleChange}
              isPassword
              error={errors?.password}
              errorHandler={handleInputBlur}
            />

            <FormInput
              label="Confirm Password"
              name="confirm_password"
              value={passFields?.confirm_password}
              onChange={handleChange}
              isPassword
              error={errors?.confirm_password}
              errorHandler={handleInputBlur}
            />
          </div>
        </form>

        <div className="form-footer position-absolute">
          <button className="btn btn-secondary border-0" onClick={handleCancel}>
            Cancel
          </button>

          <button
            type="button"
            className={` ${`btn btn-primary`}`}
            onClick={handleSubmit}
          >
            Update Password
          </button>
        </div>

        <SuccessPopUpModal
          title="Confirmation"
          message={'Unsaved changes will be lost, do you wish to proceed?'}
          modalPopUp={showCancelModal}
          setModalPopUp={setShowCancelModal}
          showActionBtns={false}
          isArchived={true}
          archived={() => navigate(-1)}
        />
        <SuccessPopUpModal
          title="Success"
          message={'Password updated.'}
          modalPopUp={showSuccessMessage}
          showActionBtns={true}
          isNavigate={true}
          isArchived={false}
          redirectPath={
            '/system-configuration/platform-admin/user-administration/users'
          }
          setModalPopUp={setShowSuccessMessage}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
