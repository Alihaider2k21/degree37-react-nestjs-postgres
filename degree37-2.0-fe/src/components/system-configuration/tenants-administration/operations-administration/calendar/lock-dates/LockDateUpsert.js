import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../../../common/topbar/index';
import styles from './lock-date.module.scss';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';

import 'react-datepicker/dist/react-datepicker.css';
import { CalendarBreadCrumbsData } from '../CalendarBreadCrumbsData';

const LockDateUpsert = ({ lockDateId }) => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [title, setTitle] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [description, setDescription] = useState('');
  const [collectionOperations, setCollectionOperations] = useState([]);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [cancelModal, setCancelModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const [isStateDirty, setIsStateDirty] = useState(false);
  const [archivedStatus, setArchivedStatus] = useState(false);
  const [collectionOperationError, setCollectionOperationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    title: '',
    start_date: '',
    end_date: '',
    description: '',
    collection_operations: '',
  });

  const BreadcrumbsData = [
    ...CalendarBreadCrumbsData,
    {
      label: lockDateId ? 'Edit Lock Date' : 'Create Lock Date',
      class: 'active-label',
      link: lockDateId
        ? `/system-configuration/tenant-admin/operations-admin/calendar/lock-dates/${lockDateId}/edit`
        : '/system-configuration/tenant-admin/operations-admin/calendar/lock-dates/create',
    },
  ];

  useEffect(() => {
    getCollectionOperations();
    if (lockDateId) {
      getLockDateData();
    }
  }, []);

  const getLockDateData = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/lock-dates/${lockDateId}`
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      console.log(data.lockDate);
      setLockDateData(data.lockDate);
      setCollectionOperations(
        data?.collectionOperations?.map((co) => {
          return {
            name: co.collection_operation_id.name,
            id: co.collection_operation_id.id,
          };
        })
      );
    } else {
      toast.error('Error Fetching Lock Date Details', { autoClose: 3000 });
    }
  };

  const setLockDateData = (data) => {
    setTitle(data.title);
    setDescription(data.description);
    const startDate = new Date(data.start_date);
    startDate.setDate(startDate.getDate() + 1);
    setStartDate(startDate);
    const endDate = new Date(data.end_date);
    endDate.setDate(endDate.getDate() + 1);
    setEndDate(endDate);
  };

  function compareNames(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  const getCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list?status=true`
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      const sortedData = data.sort(compareNames);
      setCollectionOperationData(sortedData);
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

  const checkError = async (key, value, obj) => {
    if (!value) {
      obj[key] = `${(key.charAt(0).toUpperCase() + key.slice(1)).replace(
        /_/g,
        ' '
      )} is required.`;
    } else {
      obj[key] = '';
    }
  };
  const validateForm = () => {
    const copy = { ...errors };
    checkError('title', title, copy);
    checkError('end_date', endDate, copy);
    checkError('start_date', startDate, copy);
    checkError('description', description, copy);
    checkError('collection_operations', collectionOperations.length, copy);
    setErrors({ ...copy });
    return copy;
  };
  const handleSubmit = async (e, redirect = true) => {
    const err = validateForm();
    if (!(collectionOperations?.length > 0)) {
      setCollectionOperationError('Collection Operation is required.');
    } else setCollectionOperationError('');
    if (!Object.values(err).some((value) => value !== '')) {
      try {
        const body = {
          title: title,
          start_date: new Date(startDate).toLocaleDateString('en-US'),
          end_date: new Date(endDate).toLocaleDateString('en-US'),
          description: description,
          collection_operations: collectionOperations.map(
            (collectionOperation) => collectionOperation.id
          ),
        };
        setIsSubmitting(true);
        const res = await makeAuthorizedApiRequest(
          lockDateId ? 'PUT' : 'POST',
          lockDateId
            ? `${BASE_URL}/lock-dates/${lockDateId}`
            : `${BASE_URL}/lock-dates`,
          JSON.stringify(body)
        );
        let { data, status, response } = await res.json();
        if (status === 'success') {
          // Handle successful response
          if (redirect) {
            setIsNavigate(true);
          }
          setSuccessModal(true);
          if (lockDateId) {
            setLockDateData(data.lockDate);
            setCollectionOperations(
              data.collectionOperations.map((co) => {
                return {
                  id: co.collection_operation_id.id,
                  name: co.collection_operation_id.name,
                };
              })
            );
          }
        } else if (response?.status === 400) {
          toast.error('Failed to create lock date.', { autoClose: 3000 });
          // Handle bad request
        } else {
          toast.error('Failed to create lock date.', { autoClose: 3000 });
        }
        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };

  const archiveLockDate = async () => {
    try {
      const res = await makeAuthorizedApiRequest(
        'DELETE',
        `${BASE_URL}/lock-dates/${lockDateId}`
      );
      let { data, status, response } = await res.json();
      if (status === 'success') {
        // Handle successful response
        setArchiveModal(false);
        setTimeout(() => {
          setArchivedStatus(true);
        }, 600);
      } else if (response?.status === 400) {
        setArchiveModal(false);
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        // Handle bad request
      } else {
        setArchiveModal(false);
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const handleCollectionOperationChange = (collectionOperationTemp) => {
    let tempCo = [...collectionOperations];
    tempCo = tempCo.some((item) => item.id === collectionOperationTemp.id)
      ? tempCo.filter((item) => item.id !== collectionOperationTemp.id)
      : [...tempCo, collectionOperationTemp];
    if (!(tempCo?.length > 0)) {
      setCollectionOperationError('Collection Operation is required.');
    } else setCollectionOperationError('');
    setCollectionOperations(tempCo);
  };
  const handleCollectionOperationChangeAll = (data) => {
    if (!(data?.length > 0)) {
      setCollectionOperationError('Collection Operation is required.');
    } else setCollectionOperationError('');
    setCollectionOperations(data);
  };
  const collectionOperationOnBlur = () => {
    if (!(collectionOperations?.length > 0)) {
      setCollectionOperationError('Collection Operation is required.');
    } else setCollectionOperationError('');
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={lockDateId ? 'Edit Lock Date' : 'Create Lock Date'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner mt-5">
        <form className={styles.lockDate}>
          <div className="formGroup mt-5">
            <h5>{lockDateId ? 'Edit Lock Date' : 'Create Lock Date'}</h5>

            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="Title"
                  placeholder=" "
                  onBlur={(e) => handleOnBlur('title', e.target.value)}
                  onChange={(e) => {
                    const filteredValue = e.target.value.replace(/^\s+/g, '');
                    setTitle(filteredValue);
                    setIsStateDirty(true);
                    handleOnBlur('title', filteredValue);
                  }}
                  value={title}
                  required
                />
                <label>Title*</label>
              </div>
              {errors?.title && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.title}</p>
                </div>
              )}
            </div>
            <div className="w-50">
              <GlobalMultiSelect
                label="Collection Operation*"
                data={collectionOperationData?.map(
                  (collectionOperationItem) => {
                    return {
                      id: collectionOperationItem.id,
                      name: collectionOperationItem.name,
                    };
                  }
                )}
                selectedOptions={collectionOperations}
                error={collectionOperationError}
                onChange={handleCollectionOperationChange}
                onSelectAll={handleCollectionOperationChangeAll}
                onBlur={collectionOperationOnBlur}
              />
            </div>
            <div className="form-field">
              <div className="field">
                {startDate && (
                  <label
                    style={{
                      fontSize: '12px',
                      top: '25%',
                      color: '#555555',
                      zIndex: 1,
                    }}
                  >
                    Start Date*
                  </label>
                )}
                <DatePicker
                  dateFormat="MM/dd/yyyy"
                  className={`custom-datepicker${
                    !startDate ? ' custom-datepicker-placeholder' : ''
                  }`}
                  placeholderText="Start Date*"
                  selected={startDate}
                  minDate={new Date()}
                  onBlur={(e) => handleOnBlur('start_date', e.target.value)}
                  onChange={(date) => {
                    handleOnBlur('start_date', date);
                    setIsStateDirty(true);
                    setStartDate(date);
                  }}
                />
              </div>
              {errors?.start_date && (
                <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                  <p>{errors.start_date}</p>
                </div>
              )}
            </div>

            <div className="form-field w-50">
              <div className="field">
                {endDate && (
                  <label
                    style={{
                      fontSize: '12px',
                      top: '24%',
                      color: '#555555',
                      zIndex: 1,
                    }}
                  >
                    End Date*
                  </label>
                )}
                <DatePicker
                  minDate={startDate}
                  dateFormat="MM/dd/yyyy"
                  className={`custom-datepicker${
                    !endDate ? ' custom-datepicker-placeholder' : ''
                  }`}
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
                {description && (
                  <label
                    style={{ fontSize: '12px', top: '10%', color: '#555555' }}
                  >
                    Description*
                  </label>
                )}
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Description*"
                  name="description"
                  onBlur={(e) => handleOnBlur('description', e.target.value)}
                  onChange={(e) => {
                    const filteredValue = e.target.value.replace(/^\s+/g, '');
                    setDescription(filteredValue);
                    setIsStateDirty(true);
                    handleOnBlur('description', filteredValue);
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
          </div>
        </form>
        <div className="form-footer">
          {lockDateId ? (
            <>
              <div className="archived" onClick={() => setArchiveModal(true)}>
                Archive
              </div>
              <button
                className="btn btn-md btn-link me-0 pe-4"
                onClick={() =>
                  isStateDirty
                    ? setCancelModal(true)
                    : navigate(
                        '/system-configuration/tenant-admin/operations-admin/calendar/lock-dates'
                      )
                }
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                className="btn btn-md btn-secondary"
                onClick={handleSubmit}
                type="button"
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
            </>
          ) : (
            <>
              <button
                className="btn btn-md btn-link me-0 pe-4"
                onClick={() =>
                  isStateDirty
                    ? setCancelModal(true)
                    : navigate(
                        '/system-configuration/tenant-admin/operations-admin/calendar/lock-dates'
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
            </>
          )}
        </div>
      </div>
      <SuccessPopUpModal
        title={archiveModal ? 'Confirmation' : 'Success!'}
        message={
          archiveModal
            ? 'Are you sure you want to archive?'
            : lockDateId
            ? 'Lock Date updated.'
            : 'Lock Date created.'
        }
        modalPopUp={successModal || archiveModal}
        setModalPopUp={archiveModal ? setArchiveModal : setSuccessModal}
        showActionBtns={archiveModal ? false : true}
        isArchived={archiveModal}
        archived={archiveLockDate}
        isNavigate={isNavigate}
        redirectPath={
          '/system-configuration/tenant-admin/operations-admin/calendar/lock-dates'
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message="Lock Date is archived."
        modalPopUp={archivedStatus}
        isNavigate={true}
        setModalPopUp={setArchivedStatus}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/operations-admin/calendar/lock-dates'
        }
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={cancelModal}
        isNavigate={true}
        setModalPopUp={setCancelModal}
        redirectPath={
          '/system-configuration/tenant-admin/operations-admin/calendar/lock-dates'
        }
      />
    </div>
  );
};

export default LockDateUpsert;
