import jwt from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../common/successModal';
import TopBar from '../../../../common/topbar/index';
import { archiveLeaveTypeApi, getLeaveTypeApi } from './api.js';
import FormText from '../../../../common/form/FormText';
import FormInput from '../../../../common/form/FormInput';
import FormToggle from '../../../../common/form/FormToggle';
import CancelModalPopUp from '../../../../common/cancelModal/index.js';
import { LeaveTypesBreadCrumbsData } from './LeaveTypesBreadCrumbsData';
const errorInitialState = {
  name: '',
  short_description: '',
  description: '',
};

function areAllKeysTrue(obj) {
  for (const key in obj) {
    if (!obj[key]) {
      return false; // If any key has a value other than false, return false
    } else if (obj['status'] === false || obj['status'] === true) {
      return true;
    }
  }
  return true;
}

const AddOrEditLeave = () => {
  const { id } = useParams();
  const [errors, setErrors] = useState(errorInitialState);
  const navigate = useNavigate();
  const [currentBreadCrumb, setCurrentBreadCrumb] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createButtonToggle, setCreateButtonToggle] = useState(false);
  const [archiveStatus, setArchiveStatus] = useState(false);
  const [state, setState] = useState({
    status: true,
    name: '',
    description: '',
    short_description: '',
  });
  const [showModel, setShowModel] = useState(false);
  const [showCancel, setShowCancelModel] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [navigateOnSave, setNavigateOnSave] = useState(false);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const bearerToken = localStorage.getItem('token');

  // const [navigateOnSave, setNavigateOnSave] = useState(false)
  const BreadcrumbsData = [
    ...LeaveTypesBreadCrumbsData,
    {
      label: id ? 'Edit Leave Type' : 'Create Leave Type',
      class: 'active-label',
      link: id
        ? `/system-configuration/tenant-admin/staffing-admin/leave-types/${id}/edit`
        : '/system-configuration/tenant-admin/staffing-admin/leave-types/create',
    },
  ];

  const fieldNames = [
    { label: 'Name', name: 'name', required: true, maxLength: 50 },
    {
      label: 'Short Description',
      name: 'short_description',
      required: true,
      maxLength: 500,
    },
    {
      label: 'Description',
      name: 'description',
      required: true,
      maxLength: 500,
    },
  ];

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    fieldNames.forEach((fieldName) => {
      const value = state[fieldName.name];
      const fieldDefinition = fieldNames.find(
        (field) => field.name === fieldName.name
      );
      let errorMessage = '';

      if (fieldDefinition?.required && value.toString().trim() === '') {
        errorMessage = `${fieldDefinition.label} is required.`;
      }

      if (
        fieldDefinition?.maxLength &&
        value.length > fieldDefinition?.maxLength
      ) {
        errorMessage = `Maximum ${fieldDefinition.maxLength} characters are allowed.`;
      }

      if (errorMessage === '') {
        newErrors[fieldName.name] = '';
      } else {
        newErrors[fieldName.name] = errorMessage;
        isValid = false;
      }
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));

    return isValid;
  };

  const handleConfirmArchive = async () => {
    try {
      await archiveLeaveTypeApi({ id });
      setModalPopUp(false);
      setTimeout(() => {
        setArchiveStatus(true);
      }, 600);
    } catch (error) {
      toast.error(`Failed to archive`, { autoClose: 3000 });
      setModalPopUp(false);
    }
    setModalPopUp(false);
  };
  useEffect(() => {
    setCurrentBreadCrumb(BreadcrumbsData);
    if (id) {
      fetchLeave();
    }
  }, [id]);

  const fetchLeave = async () => {
    try {
      const { data } = await getLeaveTypeApi({ id });
      setState({
        id: data?.data?.id ? data?.data?.id : undefined,
        status: data?.data?.status ?? false,
        name: data?.data?.name ?? '',
        description: data?.data?.description ?? '',
        short_description: data?.data?.short_description ?? '',
      });
    } catch (error) {
      navigate(
        '/system-configuration/tenant-admin/staffing-admin/leave-types/list'
      );
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };
  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      setToken(jwtToken);
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setUserId(decodeToken?.id);
      }
    }
  }, [token]);
  const handleSubmit = async (saveFlag) => {
    setLoading(true);
    setCreateButtonToggle(true);
    let response;
    if (!id && saveFlag === 0) {
      setNavigateOnSave(true);
    } else if (id && saveFlag === 0) {
      setNavigateOnSave(false);
    } else if (id && saveFlag === 1) {
      setNavigateOnSave(true);
    }
    const valid = validateForm();
    if (valid) {
      try {
        const BASE_URL = process.env.REACT_APP_BASE_URL;
        if (id) {
          response = await fetch(
            `${BASE_URL}/staffing-admin/leave-type/${id}`,
            {
              method: 'PUT',
              body: JSON.stringify({
                name: state?.name,
                description: state?.description,
                short_description: state?.short_description,
                status: state?.status,
                created_by: Number(userId),
              }),
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${bearerToken}`,
              },
            }
          );
        } else {
          response = await fetch(`${BASE_URL}/staffing-admin/leave-type`, {
            method: 'POST',
            body: JSON.stringify({
              name: state?.name,
              description: state?.description,
              short_description: state?.short_description,
              status: state?.status,
              created_by: Number(userId),
            }),
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          });
        }

        let data = await response.json();
        if (data?.status_code === 201 || data?.status === 204) {
          if (!(id && saveFlag === 0)) {
            setShowModel(true);
          }
        } else if (data?.status_code === 404) {
          const showMessage = Array.isArray(data?.message)
            ? data?.message[0]
            : data?.message;

          toast.error(`${showMessage}`, { autoClose: 3000 });
        } else {
          const showMessage = Array.isArray(data?.message)
            ? data?.message[0]
            : data?.message;

          toast.error(`${showMessage}`, { autoClose: 3000 });
        }
      } catch (error) {
        // const showMessage = Array.isArray(error?.message)
        //   ? error?.message[0]
        //   : error?.message;
        // toast.error(`${showMessage}`, { autoClose: 3000 });
        // const errs = yupErrorHandler(error);
        // if (errs) {
        //   setErrors({ ...errors, ...errs });
        // }
      }
    }
    setCreateButtonToggle(false);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    let { name, value, type } = e.target;

    switch (type) {
      case 'checkbox':
        value = !state[name];
        break;
      default:
        break;
    }
    setState((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });

    let errorMessage = '';

    const fieldDefinition = fieldNames.find((field) => field.name === name);

    if (fieldDefinition?.required && value.toString().trim() === '') {
      errorMessage = `${fieldDefinition.label} is required.`;
    }

    if (
      fieldDefinition?.maxLength &&
      value.length > fieldDefinition?.maxLength
    ) {
      errorMessage = `Maximum ${fieldDefinition.maxLength} characters are allowed.`;
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMsg,
      }));
    };
    setError(name, errorMessage);
  };

  const handleModal = () => {
    if (
      !Object.values(state)
        .slice(1)
        .every((a) => a == '')
    ) {
      setShowCancelModel(true);
    } else {
      navigate(
        '/system-configuration/tenant-admin/staffing-admin/leave-types/list'
      );
    }
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={currentBreadCrumb}
        BreadCrumbsTitle={'Leave Types'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form className="">
          <div className="formGroup">
            <h5>
              {currentBreadCrumb[3]?.label === 'Edit Leave'
                ? 'Edit Leave Type'
                : 'Create Leave Type'}
            </h5>

            <div className="flex justify-between w-100 gap-2">
              <FormInput
                name="name"
                displayName="Name"
                value={state.name}
                error={errors.name}
                handleBlur={handleInputChange}
                // classes={{ root: "w-100" }}
                required
                onChange={handleInputChange}
                className="form-control"
              />
              <FormInput
                name="short_description"
                displayName="Short Description"
                value={state.short_description}
                error={errors.short_description}
                // classes={{ root: "w-100" }}
                handleBlur={handleInputChange}
                required
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <FormText
              name="description"
              displayName="Description"
              value={state.description}
              error={errors.description}
              classes={{ root: 'w-100' }}
              handleBlur={handleInputChange}
              required
              onChange={handleInputChange}
            />

            <FormToggle
              name="status"
              displayName={state?.status ? 'Active' : 'Inactive'}
              checked={state.status}
              classes={{ root: 'pt-2' }}
              handleChange={handleInputChange}
              className="form-control"
            />
          </div>
        </form>
        <div className="form-footer">
          {id ? (
            <div
              onClick={() => {
                setModalPopUp(true);
              }}
              className="archived"
            >
              <span>Archive</span>
            </div>
          ) : null}
          <button
            className="btn btn-secondary btn-border-none"
            style={{ color: '#005375' }}
            onClick={handleModal}
          >
            Cancel
          </button>
          {id && (
            <button
              type="button"
              className="btn btn-outlined"
              disabled={loading || !areAllKeysTrue(state)}
              onClick={() => {
                handleSubmit(1);
              }}
              // disabled={buttonWorking}
              style={{ fontSize: '16px', lineHeight: '24px' }}
            >
              Save & Close
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              handleSubmit(0);
            }}
            disabled={createButtonToggle}
            style={{
              width: id ? '200px' : '109px',
              height: '40px',
            }}
          >
            {id ? 'Save Changes' : 'Create'}
          </button>
        </div>
      </div>
      <SuccessPopUpModal
        title="Confirmation"
        message={'Are you sure, you want to archive?'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={false}
        isArchived={true}
        archived={handleConfirmArchive}
      />
      <CancelModalPopUp
        title="Cancel"
        message={`Unsaved changes will be lost, do you wish to proceed?`}
        modalPopUp={showCancel}
        isNavigate={true}
        setModalPopUp={setShowCancelModel}
        showActionBtns={true}
        cancel={true}
        redirectPath={
          '/system-configuration/tenant-admin/staffing-admin/leave-types/list'
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message={`Leave Type ${id ? 'updated' : 'created'}.`}
        modalPopUp={showModel}
        isNavigate={navigateOnSave}
        setModalPopUp={setShowModel}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/staffing-admin/leave-types/list'
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message={`Leave Type is archived.`}
        modalPopUp={archiveStatus}
        isNavigate={true}
        setModalPopUp={setArchiveStatus}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/staffing-admin/leave-types/list'
        }
      />
    </div>
  );
};

export default AddOrEditLeave;
