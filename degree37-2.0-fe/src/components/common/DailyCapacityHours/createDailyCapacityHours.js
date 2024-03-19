import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './dailyCapacity.module.scss';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import SuccessPopUpModal from '../../../../../common/successModal';
import jwt from 'jwt-decode';
import DailyCapacityForm from './DailyCapacityForm';
import SelectDropdown from '../../../../../common/selectDropdown';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import ToolTip from '../../../../../common/tooltip';

const AddDailyCapacity = ({ link = '' }) => {
  const initialInputState = [
    {
      name: 'mon_max_drives',
      label: ' Maximum Drives',
      value: '',
      error: '',
      isDrive: 'Monday',
    },
    { name: 'mon_max_staff', label: ' Maximum Staff', value: '', error: '' },
    {
      name: 'tue_max_drives',
      label: ' Maximum Drives',
      value: '',
      error: '',
      isDrive: 'Tuesday',
    },
    { name: 'tue_max_staff', label: ' Maximum Staff', value: '', error: '' },
    {
      name: 'wed_max_drives',
      label: ' Maximum Drives',
      value: '',
      error: '',
      isDrive: 'Wednesday',
    },
    { name: 'wed_max_staff', label: ' Maximum Staff', value: '', error: '' },
    {
      name: 'thur_max_drives',
      label: ' Maximum Drives',
      value: '',
      error: '',
      isDrive: 'Thursday',
    },
    { name: 'thur_max_staff', label: ' Maximum Staff', value: '', error: '' },
    {
      name: 'fri_max_drives',
      label: ' Maximum Drives',
      value: '',
      error: '',
      isDrive: 'Friday',
    },
    { name: 'fri_max_staff', label: ' Maximum Staff', value: '', error: '' },
    {
      name: 'sat_max_drives',
      label: ' Maximum Drives',
      value: '',
      error: '',
      isDrive: 'Saturday',
    },
    { name: 'sat_max_staff', label: ' Maximum Staff', value: '', error: '' },
    {
      name: 'sun_max_drives',
      label: ' Maximum Drives',
      value: '',
      error: '',
      isDrive: 'Sunday',
    },
    { name: 'sun_max_staff', label: ' Maximum Staff', value: '', error: '' },
  ];
  const navigate = useNavigate();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState(initialInputState);
  const [collectionOperations, setCollectionOperations] = useState([]);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [createBy, setCreateBy] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [errors, setErrors] = useState({
    collection_operations: '',
    formData: null,
  });
  const [token, setToken] = useState('');
  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      setToken(jwtToken);
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setCreateBy(decodeToken.id);
      }
    }
    setFormData(initialInputState);
  }, [token]);

  useEffect(() => {
    getCollectionOperations();
  }, []);

  const getCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list`
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setCollectionOperationData(data);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };
  const handleOnBlur = async (key, value) => {
    if (!value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: `${(key.charAt(0).toUpperCase() + key.slice(1)).replace(
          /_/g,
          ' '
        )} is required.`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: '',
      }));
    }
  };

  const handleCancelClick = () => {
    if (unsavedChanges) {
      setShowConfirmationDialog(true);
    } else {
      navigate(link);
    }
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(link);
    }
  };
  const handleCollectionOperationChange = (selected) => {
    handleOnBlur('collection_operations', selected.length);
    !selected.length
      ? setCollectionOperations([])
      : setCollectionOperations(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const collectlions = collectionOperations.map((item) => item.value);
    const payload = {
      collection_operation: collectlions,
      data: {},
      created_by: +createBy,
    };
    formData.forEach((input) => {
      const { name, value, isDrive } = input;
      if (isDrive) {
        const dayKey = name.split('_')[0];
        payload.data[`${dayKey}_max_drives`] = value;
      }
      if (name.endsWith('staff')) {
        const dayKey = name.split('_')[0];
        payload.data[`${dayKey}_max_staff`] = value;
      }
    });

    try {
      const response = await fetch(`${BASE_URL}/booking-drive/daily-capacity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(payload),
      });
      let data = await response.json();
      if (data?.status === 'success') {
        setShowSuccessDialog(true);
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

  let isDisabled = false;
  if (!collectionOperations.length) {
    isDisabled = true;
  }
  if (formData) {
    for (const input of formData) {
      if (!input.value && input.value !== 0) {
        isDisabled = true;
        break;
      }
    }
  } else {
    isDisabled = true;
  }

  const BreadcrumbsData = [
    { label: 'System Configuration', class: 'disable-label', link: '/' },
    { label: 'Operations Administration', class: 'disable-label', link: '/' },
    {
      label: 'Booking Drives',
      class: 'disable-label',
      link: '/system-configuration/operations-admin/booking-drives/daily-capacities',
    },
    {
      label: 'Daily Capacities',
      class: 'active-label',
      link: `/system-configuration/operations-admin/booking-drives/daily-capacities`,
    },
    {
      label: 'Create Daily Capacity',
      class: 'disable-label',
      link: '/system-configuration/operations-admin/booking-drives/daily-capacities/create',
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Daily Capacity'}
      />
      <div className="mainContentInner">
        <form className={styles.addAdminRoles}>
          <div className="formGroup">
            <h5 style={{ display: 'flex', gap: '13px' }}>
              Create Daily Capacity
              <ToolTip
                text={
                  'Please enter the maximum capacities for each day of the week.'
                }
                isDailyCapacity={true}
              />
            </h5>

            <div className="row w-100 field">
              <SelectDropdown
                options={collectionOperationData?.map(
                  (collectionOperationItem) => {
                    return {
                      value: collectionOperationItem.id,
                      label: collectionOperationItem.name,
                    };
                  }
                )}
                isMulti={true}
                required={true}
                selectedValue={collectionOperations}
                onChange={handleCollectionOperationChange}
                placeholder={'Collection Operations*'}
                error={errors?.collection_operations}
                removeDivider={true}
                removeTheClearCross={true}
              />
            </div>
          </div>
          <div className="formGroup">
            <DailyCapacityForm
              setUnsavedChanges={setUnsavedChanges}
              setFormData={setFormData}
              initialInputState={formData}
              setErrors={setErrors}
              isDisabled={false}
            />
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
              <p>Unsaved changes will be lost. Do you want to continue?</p>
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

        <SuccessPopUpModal
          title="Success!"
          message="Daily Capacity created"
          modalPopUp={showSuccessDialog}
          isNavigate={true}
          setModalPopUp={setShowSuccessDialog}
          showActionBtns={true}
          redirectPath="/system-configuration/operations-admin/booking-drives/daily-capacities"
        />

        <div className="form-footer">
          <button className="btn btn-secondary" onClick={handleCancelClick}>
            Cancel
          </button>

          <button
            type="button"
            className={` ${
              isDisabled ? `btn btn-secondary` : `btn btn-primary`
            }`}
            onClick={handleSubmit}
            disabled={isDisabled}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDailyCapacity;
