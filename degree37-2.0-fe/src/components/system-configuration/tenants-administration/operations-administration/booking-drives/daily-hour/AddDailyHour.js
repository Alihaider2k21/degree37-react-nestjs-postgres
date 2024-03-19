import React, { useEffect, useState, useRef } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import styles from './dailyHour.module.scss';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import SuccessPopUpModal from '../../../../../common/successModal';
import { isNumber } from 'lodash';
import jwt from 'jwt-decode';
import DailyHourForm from './DailyHourForm';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import ToolTip from '../../../../../common/tooltip';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import { BookingDrivesBreadCrumbsData } from '../BookingDrivesBreadCrumbsData';

const AddDailyHour = () => {
  const initialInputState = [
    {
      name: 'mon_earliest_depart_time',
      label: 'Earliest Depart Time',
      value: '',
      error: '',
      isDrive: 'Monday',
    },
    {
      name: 'mon_latest_return_time',
      label: 'Latest Return Time',
      value: '',
      error: '',
    },
    {
      name: 'tue_earliest_depart_time',
      label: 'Earliest Depart Time',
      value: '',
      error: '',
      isDrive: 'Tuesday',
    },
    {
      name: 'tue_latest_return_time',
      label: 'Latest Return Time',
      value: '',
      error: '',
    },
    {
      name: 'wed_earliest_depart_time',
      label: 'Earliest Depart Time',
      value: '',
      error: '',
      isDrive: 'Wednesday',
    },
    {
      name: 'wed_latest_return_time',
      label: 'Latest Return Time',
      value: '',
      error: '',
    },
    {
      name: 'thu_earliest_depart_time',
      label: 'Earliest Depart Time',
      value: '',
      error: '',
      isDrive: 'Thursday',
    },
    {
      name: 'thu_latest_return_time',
      label: 'Latest Return Time',
      value: '',
      error: '',
    },
    {
      name: 'fri_earliest_depart_time',
      label: 'Earliest Depart Time',
      value: '',
      error: '',
      isDrive: 'Friday',
    },
    {
      name: 'fri_latest_return_time',
      label: 'Latest Return Time',
      value: '',
      error: '',
    },
    {
      name: 'sat_earliest_depart_time',
      label: 'Earliest Depart Time',
      value: '',
      error: '',
      isDrive: 'Saturday',
    },
    {
      name: 'sat_latest_return_time',
      label: 'Latest Return Time',
      value: '',
      error: '',
    },
    {
      name: 'sun_earliest_depart_time',
      label: 'Earliest Depart Time',
      value: '',
      error: '',
      isDrive: 'Sunday',
    },
    {
      name: 'sun_latest_return_time',
      label: 'Latest Return Time',
      value: '',
      error: '',
    },
  ];
  const navigate = useNavigate();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [formData, setFormData] = useState(initialInputState);
  const [collectionOperations, setCollectionOperations] = useState([]);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [createBy, setCreateBy] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const isFirstRender = useRef(true);

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

  // function compareNames(a, b) {
  //   const nameA = a.name.toUpperCase();
  //   const nameB = b.name.toUpperCase();

  //   if (nameA < nameB) {
  //     return -1;
  //   }
  //   if (nameA > nameB) {
  //     return 1;
  //   }
  //   return 0;
  // }

  const getCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list?status=true`
    );
    const res = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/booking-drive/daily-hour`
    );
    let { data } = await result.json();
    let dailyHourData = await res.json();
    const collectionOperationIdsInDailyHour = dailyHourData?.data?.map(
      (dailyData) =>
        dailyData.collection_operation.map((operation) => operation.id)
    );

    const allCollectionOperationIdsInDailyHour =
      collectionOperationIdsInDailyHour?.flat();

    const collectionOperationsNotInDailyHour = data?.filter(
      (operation) =>
        !allCollectionOperationIdsInDailyHour?.includes(operation.id)
    );

    // const sortedData = collectionOperationsNotInDailyHour.sort(compareNames);

    if (result.ok || result.status === 200) {
      setCollectionOperationData(collectionOperationsNotInDailyHour ?? []);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  const handleCancelClick = () => {
    if (
      formData.some((field) => isNumber(field.value)) ||
      collectionOperations.length
    ) {
      setShowConfirmationDialog(true);
    } else {
      navigate(
        '/system-configuration/operations-admin/booking-drives/daily-hours'
      );
    }
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(
        '/system-configuration/operations-admin/booking-drives/daily-hours'
      );
    }
  };
  const handleCollectionOperationChange = (collectionOperation) => {
    isFirstRender.current = false;
    setCollectionOperations((prevSelected) =>
      prevSelected.some((item) => item.id === collectionOperation.id)
        ? prevSelected.filter((item) => item.id !== collectionOperation.id)
        : [...prevSelected, collectionOperation]
    );
  };

  useEffect(() => {
    if (!isFirstRender.current) {
      if (collectionOperations.length === 0) {
        setErrors((prevErrors) => {
          return {
            ...prevErrors,
            collection_operations: 'Collection Operations is required.',
          };
        });
      } else {
        setErrors((prevErrors) => {
          return {
            ...prevErrors,
            collection_operations: '',
          };
        });
      }
    }
  }, [collectionOperations]);

  const handleCollectionOperationChangeAll = (data) => {
    setCollectionOperations(data);
  };

  const validateForm = () => {
    let flag = true;
    const copy = [...formData];
    copy.forEach((field) => {
      if (!field.value) {
        field.error = `${(
          field.name.charAt(0).toUpperCase() + field.name.slice(1)
        ).replace(/_/g, ' ')} is required.`;
        flag = false;
      } else if (field.value && field.error) {
        field.error = `${field.error}`;
        flag = false;
      } else {
        field.error = '';
      }
    });
    if (!collectionOperations.length) {
      setErrors({
        ...errors,
        collection_operations: 'Collection Operation is required.',
      });
      flag = false;
    }
    setFormData([...copy]);
    return flag;
  };
  const handleSubmit = async (e) => {
    if (validateForm()) {
      const collections = collectionOperations.map((item) => item.id);
      const payload = {
        collection_operation: collections,
        data: {},
        created_by: +createBy,
      };
      formData.forEach((input) => {
        const { name, value, isDrive } = input;
        if (isDrive) {
          const dayKey = name.split('_')[0];
          payload.data[`${dayKey}_earliest_depart_time`] = value;
        } else {
          const dayKey = name.split('_')[0];
          payload.data[`${dayKey}_latest_return_time`] = value;
        }
      });

      try {
        setIsSubmitting(true);
        const response = await makeAuthorizedApiRequest(
          'POST',
          `${BASE_URL}/booking-drive/daily-hour`,
          JSON.stringify(payload)
        );

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
        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    } else {
      //nothing
    }
  };

  const BreadcrumbsData = [
    ...BookingDrivesBreadCrumbsData,
    {
      label: 'Create Daily Hours',
      class: 'disable-label',
      link: '/system-configuration/operations-admin/booking-drives/daily-hours/create',
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Daily Hours'}
      />
      <div className="mainContentInner form-container">
        <form className="formGroup">
          <div className="formGroup">
            <h5 style={{ display: 'flex', gap: '13px' }}>
              Create Daily Hours
              <ToolTip
                text={
                  'Please enter the maximum hours for each day of the week.'
                }
                isDailyCapacity={true}
              />
            </h5>

            <div className="row w-50 field">
              <GlobalMultiSelect
                label="Collection Operations *"
                data={collectionOperationData?.map(
                  (collectionOperationItem) => {
                    return {
                      id: collectionOperationItem.id,
                      name: collectionOperationItem.name,
                    };
                  }
                )}
                selectedOptions={collectionOperations}
                error={errors?.collection_operations}
                onChange={handleCollectionOperationChange}
                onSelectAll={handleCollectionOperationChangeAll}
              />
            </div>
          </div>
          <div className="formGroup">
            <DailyHourForm
              setFormData={setFormData}
              initialInputState={formData}
              setErrors={setErrors}
              isDisabled={false}
              isTime={true}
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
          message="Daily Hours created."
          modalPopUp={showSuccessDialog}
          isNavigate={true}
          setModalPopUp={setShowSuccessDialog}
          showActionBtns={true}
          redirectPath="/system-configuration/operations-admin/booking-drives/daily-hours"
        />

        <div className="form-footer">
          <button className="btn btn-secondary" onClick={handleCancelClick}>
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            className={`btn btn-primary`}
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDailyHour;
