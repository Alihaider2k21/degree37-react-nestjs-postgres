import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../../../common/topbar/index';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import {
  fetchData,
  makeAuthorizedApiRequest,
} from '../../../../../../helpers/Api';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect/index';
import { MarketingEquipmentBreadCrumbsData } from '../MarketingEquipmentBreadCrumbsData';
const PromotionUpsert = ({ promotionId }) => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [fullName, setFullName] = useState('');

  const [shortName, setShortName] = useState('');

  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [collectionOperations, setCollectionOperations] = useState([]);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [cancelModal, setCancelModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const [isStateDirty, setIsStateDirty] = useState(false);
  const [archivedStatus, setArchivedStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    short_name: '',
    start_date: '',
    end_date: '',
    description: '',
    donor_message: '',
    collection_operations: '',
    status: '',
  });

  const BreadcrumbsData = [
    ...MarketingEquipmentBreadCrumbsData,
    {
      label: promotionId ? 'Edit Promotion' : 'Create Promotion',
      class: 'active-label',
      link: promotionId
        ? `/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions/${promotionId}/edit`
        : '/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions/create',
    },
  ];

  useEffect(() => {
    getCollectionOperations();
    if (promotionId) {
      getPromotionData();
    }
  }, []);

  const getPromotionData = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/marketing-equipment/promotions/${promotionId}`
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      const promotionalData = data.promotion;
      promotionalData.collectionOperations = data.collectionOperations;
      setPromotionData(promotionalData);
    } else {
      toast.error('Error Fetching Promotion Details', { autoClose: 3000 });
    }
  };
  const setPromotionData = (data) => {
    setFullName(data.name);
    setShortName(data.short_name);
    setDescription(data.description);
    setDonorMessage(data.donor_message);
    setStartDate(new Date(data.start_date));
    setEndDate(new Date(data.end_date));
    setIsActive(data.status);
    setCollectionOperations(
      data.collectionOperations.map((item) => {
        return {
          name: item.collection_operation_id.name,
          id: item.collection_operation_id.id,
        };
      })
    );
  };

  const getCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list?status=true`
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setCollectionOperationData(data);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  function handleChangeDescription(event) {
    const { value, name } = event.target;
    if (name === 'description' && value?.length > 500) {
      toast.dismiss();
      toast.warn('Max characters allowed for description are 500');
      return;
    }
    setDescription(value);
  }

  function handleChangeDonorMessage(event) {
    const { value, name } = event.target;
    if (name === 'donor_message' && value?.length > 500) {
      toast.dismiss();
      toast.warn('Max characters allowed for description are 500');
      return;
    }
    setDonorMessage(value);
  }

  const handleOnBlur = async (key, value) => {
    if (!value || value.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: `${(key.charAt(0).toUpperCase() + key.slice(1)).replace(
          /_/g,
          ' '
        )} is required.`,
      }));
    } else if ((key === 'name' || key === 'short_name') && value.length > 50) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: 'Maximum 50 characters are allowed.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: '',
      }));
    }
  };
  const handleCollectionOperationChange = (collectionOperation) => {
    let tempCo = [...collectionOperations];
    tempCo = tempCo.some((item) => item.id === collectionOperation.id)
      ? tempCo.filter((item) => item.id !== collectionOperation.id)
      : [...tempCo, collectionOperation];
    if (tempCo.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        collection_operations: '',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        collection_operations: 'Collection Operation is required.',
      }));
    }
    setCollectionOperations(tempCo);
  };
  const handleCollectionOperationChangeAll = (data) => {
    if (data.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        collection_operations: '',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        collection_operations: 'Collection Operation is required.',
      }));
    }
    setCollectionOperations(data);
  };

  const checkErrors = (key, value) => {
    if (!value || value.length === 0) {
      return `${(key.charAt(0).toUpperCase() + key.slice(1)).replace(
        /_/g,
        ' '
      )} is required.`;
    } else if ((key === 'name' || key === 'short_name') && value.length > 50) {
      return 'Maximum 50 characters are allowed.';
    } else {
      return '';
    }
  };

  const validateForm = () => {
    let copy = { ...errors };
    copy = {
      ...copy,
      name: checkErrors('name', fullName),
      short_name: checkErrors('short_name', shortName),
      start_date: checkErrors('start_date', startDate),
      end_date: checkErrors('end_date', endDate),
      collection_operations: checkErrors(
        'collection_operations',
        collectionOperations
      ),
    };
    setErrors({
      ...copy,
    });
    return copy;
  };

  const handleSubmit = async (e, redirect = true) => {
    const errObject = validateForm();

    if (Object.values(errObject).every((value) => value == '')) {
      const parsedStartDate = moment(startDate).toDate();
      const formattedStartDate = moment(parsedStartDate).format(
        'MM-DD-YYYYThh:mm:ss'
      );
      const parsedEndDate = moment(endDate).toDate();
      const formattedEndDate = moment(parsedEndDate).format(
        'MM-DD-YYYYThh:mm:ss'
      );

      e.preventDefault();
      try {
        const body = {
          name: fullName,
          short_name: shortName,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          description: description,
          donor_message: donorMessage,
          status: isActive,
          collection_operations: collectionOperations.map((item) => +item.id),
        };
        setIsSubmitting(true);
        const res = await makeAuthorizedApiRequest(
          promotionId ? 'PUT' : 'POST',
          promotionId
            ? `${BASE_URL}/marketing-equipment/promotions/${promotionId}`
            : `${BASE_URL}/marketing-equipment/promotions`,
          JSON.stringify(body)
        );
        let { status, response } = await res.json();
        if (status === 'success') {
          if (redirect) {
            setIsNavigate(true);
          }
          setSuccessModal(true);
        } else if (response?.status === 400) {
          toast.error('Failed to create promotion.', { autoClose: 3000 });
        } else {
          toast.error('Failed to create promotion.', { autoClose: 3000 });
        }
        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };

  // Function to handle changes in the "Active/Inactive" checkbox
  const handleIsActiveChange = (event) => {
    setIsActive(event.target.checked);
  };

  // Function to handle archive
  const handleConfirmArchive = async () => {
    if (promotionId && archiveModal) {
      const response = await fetchData(
        `/marketing-equipment/promotions/archive/${promotionId}`,
        'PATCH'
      );
      if (response?.status === 'success') {
        setArchiveModal(false);
        setTimeout(() => {
          setArchivedStatus(true);
        }, 600);
      } else {
        toast.error(`${response?.message?.[0] ?? response?.response}`, {
          autoClose: 3000,
        });
        setArchiveModal(false);
      }
    }
    // setModalPopUp(false);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Promotions'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form className={styles.promotion}>
          <div className="formGroup">
            <h5>{promotionId ? 'Edit Promotion' : 'Create Promotion'}</h5>

            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder=" "
                  onBlur={(e) => handleOnBlur('name', e.target.value)}
                  onChange={(e) => {
                    const filteredValue = e.target.value.replace(/^\s+/g, '');
                    setFullName(filteredValue);
                    handleOnBlur('name', filteredValue);
                    setIsStateDirty(true);
                  }}
                  value={fullName}
                  required
                />
                <label>Name*</label>
              </div>
              {errors?.name && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.name}</p>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="short_name"
                  placeholder=" "
                  onBlur={(e) => handleOnBlur('short_name', e.target.value)}
                  onChange={(e) => {
                    const filteredValue = e.target.value.replace(/^\s+/g, '');
                    setShortName(filteredValue);
                    setIsStateDirty(true);
                    handleOnBlur('short_name', filteredValue);
                  }}
                  value={shortName}
                  required
                />
                <label>Short Name*</label>
              </div>
              {errors?.short_name && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.short_name}</p>
                </div>
              )}
            </div>

            <div className="form-field w-100">
              <div className="field">
                {description && (
                  <label
                    style={{ fontSize: '12px', top: '10%', color: '#555555' }}
                  >
                    Description
                  </label>
                )}
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  name="description"
                  onChange={(e) => {
                    const filteredValue = e.target.value.replace(/^\s+/g, '');
                    e.target.value = filteredValue;
                    handleChangeDescription(e);
                    setIsStateDirty(true);
                  }}
                  value={description}
                />
              </div>
              {errors?.description && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.description}</p>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field">
                <DatePicker
                  dateFormat="MM/dd/yyyy"
                  className="custom-datepicker custom-datepicker-placeholder"
                  placeholderText="Start Date*"
                  selected={startDate}
                  // minDate={new Date()}
                  onBlur={(e) => handleOnBlur('start_date', e.target.value)}
                  onChange={(date) => {
                    handleOnBlur('end_date', date);
                    setIsStateDirty(true);
                    setStartDate(date);
                    if (date > endDate) {
                      setEndDate('');
                    }
                  }}
                />
              </div>
              {errors?.start_date && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.start_date}</p>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field">
                <DatePicker
                  minDate={startDate}
                  dateFormat="MM/dd/yyyy"
                  className="custom-datepicker custom-datepicker-placeholder"
                  placeholderText="End Date*"
                  selected={endDate}
                  onBlur={(e) => handleOnBlur('end_date', e.target.value)}
                  onChange={(date) => {
                    handleOnBlur('end_date', date);
                    setIsStateDirty(true);
                    setEndDate(date);
                  }}
                />
              </div>
              {errors?.end_date && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.end_date}</p>
                </div>
              )}
            </div>

            <div className="form-field w-100">
              <div className="field">
                {donorMessage && (
                  <label
                    style={{ fontSize: '12px', top: '10%', color: '#555555' }}
                  >
                    Donor Message
                  </label>
                )}
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Donor Message"
                  name="donor_message"
                  onChange={(e) => {
                    const filteredValue = e.target.value.replace(/^\s+/g, '');
                    e.target.value = filteredValue;
                    handleChangeDonorMessage(e);
                    setIsStateDirty(true);
                  }}
                  value={donorMessage}
                />
              </div>
              {errors?.donor_message && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.donor_message}</p>
                </div>
              )}
            </div>
            <div className="col-md-6">
              <GlobalMultiSelect
                label="Collection Operation*"
                data={collectionOperationData}
                selectedOptions={collectionOperations}
                error={errors?.collection_operations}
                onChange={handleCollectionOperationChange}
                onSelectAll={handleCollectionOperationChangeAll}
                onBlur={() => {}}
              />
            </div>
            <div className="form-field checkbox w-100">
              <span className="toggle-text">
                {isActive ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  name="status"
                  checked={isActive}
                  onChange={handleIsActiveChange}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </form>
        {promotionId ? (
          <div className={`form-footer-custom `}>
            <div
              className={`archived`}
              onClick={() => {
                setArchiveModal(true);
              }}
            >
              Archive
            </div>
            <button
              className="btn btn-md btn-link me-0 pe-4"
              onClick={() =>
                isStateDirty
                  ? setCancelModal(true)
                  : navigate(
                      '/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions'
                    )
              }
            >
              Cancel
            </button>
            <button
              className="btn btn-md btn-secondary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Save & Close
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              className="btn btn-md btn-primary"
              onClick={(e) => handleSubmit(e, false)}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className={`form-footer-custom `}>
            <button
              className="btn btn-md btn-link me-0 pe-4"
              onClick={() =>
                isStateDirty
                  ? setCancelModal(true)
                  : navigate(
                      '/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions'
                    )
              }
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              className="btn btn-md btn-primary"
              onClick={handleSubmit}
            >
              Create
            </button>
          </div>
        )}
      </div>
      <SuccessPopUpModal
        title={archiveModal ? 'Confirmation' : 'Success!'}
        message={
          archiveModal
            ? 'Are you sure you want to archive?'
            : promotionId
            ? 'Promotion updated.'
            : 'Promotion created.'
        }
        modalPopUp={successModal || archiveModal}
        setModalPopUp={archiveModal ? setArchiveModal : setSuccessModal}
        showActionBtns={archiveModal ? false : true}
        isArchived={archiveModal}
        archived={handleConfirmArchive}
        isNavigate={isNavigate}
        redirectPath={
          '/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions'
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message="Promotion is archived."
        modalPopUp={archivedStatus}
        isNavigate={true}
        setModalPopUp={setArchivedStatus}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions'
        }
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={cancelModal}
        isNavigate={true}
        setModalPopUp={setCancelModal}
        redirectPath={
          '/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions'
        }
      />
    </div>
  );
};

export default PromotionUpsert;
