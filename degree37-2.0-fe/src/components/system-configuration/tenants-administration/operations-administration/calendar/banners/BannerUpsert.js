import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../../../common/topbar/index';
import styles from './banner.module.scss';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';

import 'react-datepicker/dist/react-datepicker.css';
import { CalendarBreadCrumbsData } from '../CalendarBreadCrumbsData';

const BannerUpsert = ({ bannerId }) => {
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
  const [archiveStatus, setArchivedStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    start_date: '',
    end_date: '',
    description: '',
    collection_operations: '',
  });
  const [collectionOperationError, setCollectionOperationError] = useState('');

  const BreadcrumbsData = [
    ...CalendarBreadCrumbsData,
    {
      label: bannerId ? 'Edit Banner' : 'Create Banner',
      class: 'active-label',
      link: bannerId
        ? `/system-configuration/tenant-admin/operations-admin/calendar/banners/${bannerId}/edit`
        : '/system-configuration/tenant-admin/operations-admin/calendar/banners/create',
    },
  ];

  useEffect(() => {
    getCollectionOperations();
    if (bannerId) {
      getBannerData();
    }
  }, []);

  const getBannerData = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/banners/${bannerId}`
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setBannerData(data.banner);
      setCollectionOperations(
        data.collectionOperations.map((co) => {
          return {
            name: co.collection_operation_id.name,
            id: co.collection_operation_id.id,
          };
        })
      );
    } else {
      toast.error('Error Fetching Banner Details', { autoClose: 3000 });
    }
  };

  const setBannerData = (data) => {
    setTitle(data.title);
    setDescription(data.description);
    setStartDate(new Date(data.start_date));
    setEndDate(new Date(data.end_date));
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
    const bearerToken = localStorage.getItem('token');
    const result = await fetch(
      `${BASE_URL}/business_units/collection_operations/list?status=true`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          method: 'GET',
          authorization: `Bearer ${bearerToken}`,
        },
      }
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
          bannerId ? 'PUT' : 'POST',
          bannerId ? `${BASE_URL}/banners/${bannerId}` : `${BASE_URL}/banners`,
          JSON.stringify(body)
        );
        let { data, status, response } = await res.json();
        if (status === 'success') {
          // Handle successful response
          if (redirect) {
            setIsNavigate(true);
          }
          setSuccessModal(true);
          if (bannerId) {
            setBannerData(data.banner);
            setCollectionOperations(
              data.collectionOperations.map((co) => {
                return {
                  name: co.collection_operation_id.name,
                  id: co.collection_operation_id.id,
                };
              })
            );
          }
        } else if (response?.status === 400) {
          toast.error('Failed to create banner.', { autoClose: 3000 });
          // Handle bad request
        } else {
          toast.error('Failed to create banner.', { autoClose: 3000 });
        }
        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };

  const archiveBanner = async () => {
    try {
      const res = await makeAuthorizedApiRequest(
        'DELETE',
        `${BASE_URL}/banners/${bannerId}`
      );
      let { data, status, response } = await res.json();
      if (status === 'success') {
        // Handle successful response
        setArchiveModal(false);
        setTimeout(() => {
          setArchivedStatus(true);
        }, 600);
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        setArchiveModal(false);

        // Handle bad request
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        setArchiveModal(false);
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
      setArchiveModal(false);
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
        BreadCrumbsTitle={bannerId ? 'Edit Banner' : 'Create Banner'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container ">
        <form className={styles.banner}>
          <div className="formGroup ">
            <h5>{bannerId ? 'Edit Banner' : 'Create Banner'}</h5>

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
                      top: '24%',
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
                  onBlur={(e) => handleOnBlur('start_date', e.target.value)}
                  onChange={(date) => {
                    handleOnBlur('start_date', date);
                    setIsStateDirty(true);
                    setStartDate(date);
                    const date1 = new Date(date);
                    const date2 = new Date(endDate);
                    if (date1 > date2) {
                      setEndDate(date);
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
        <div className="form-footer ">
          {bannerId ? (
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
                        '/system-configuration/tenant-admin/operations-admin/calendar/banners'
                      )
                }
              >
                Cancel
              </button>
              <button
                className="btn btn-md btn-secondary"
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
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
                        '/system-configuration/tenant-admin/operations-admin/calendar/banners'
                      )
                }
              >
                Cancel
              </button>

              <button
                type="button"
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
            : bannerId
            ? 'Banner updated.'
            : 'Banner created.'
        }
        modalPopUp={successModal || archiveModal}
        setModalPopUp={archiveModal ? setArchiveModal : setSuccessModal}
        showActionBtns={archiveModal ? false : true}
        isArchived={archiveModal}
        archived={archiveBanner}
        isNavigate={isNavigate}
        redirectPath={
          '/system-configuration/tenant-admin/operations-admin/calendar/banners'
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message="Banner is archived."
        modalPopUp={archiveStatus}
        isNavigate={true}
        setModalPopUp={setArchivedStatus}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/operations-admin/calendar/banners'
        }
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={cancelModal}
        isNavigate={true}
        setModalPopUp={setCancelModal}
        redirectPath={
          '/system-configuration/tenant-admin/operations-admin/calendar/banners'
        }
      />
    </div>
  );
};

export default BannerUpsert;
