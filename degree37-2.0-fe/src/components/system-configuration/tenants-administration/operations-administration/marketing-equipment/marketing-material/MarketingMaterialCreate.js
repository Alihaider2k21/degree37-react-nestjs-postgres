import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import styles from './index.module.scss';
import { Col, Row } from 'react-bootstrap';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import jwt from 'jwt-decode';
import DatePicker from '../../../../../common/DatePicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import moment from 'moment';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import { MarketingEquipmentBreadCrumbsData } from '../MarketingEquipmentBreadCrumbsData';
import { urlRegex } from '../../../../../../helpers/Validation';

const MarketingMaterialCreate = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [modalPopUp, setModalPopUp] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [id, setId] = useState('');
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [collectionOperationError, setCollectionOperationError] = useState('');
  const [collectionOperations, setCollectionOperations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bearerToken = localStorage.getItem('token');
  const [marketingData, setMarketingData] = useState({
    name: '',
    short_name: '',
    description: '',
    collection_operation: [],
    retire_on: '',
    status: true,
  });
  const [errors, setErrors] = useState({
    name: '',
    short_name: '',
    description: '',
    collection_operation: '',
  });

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }

    const getCollectionOperation = async () => {
      const response = await fetch(
        `${BASE_URL}/business_units/collection_operations/list`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      let { data } = await response.json();
      if (response.ok || response.status === 200) {
        setCollectionOperationData(data);
      } else {
        toast.error('Error Fetching Device type Details', {
          autoClose: 3000,
        });
      }
    };
    getCollectionOperation();
    // eslint-disable-next-line
  }, []);
  const BreadcrumbsData = [
    ...MarketingEquipmentBreadCrumbsData,
    {
      label: 'Create Marketing Material',
      class: 'disable-label',
      link: `/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/create`,
    },
  ];

  const handleInputBlur = (e, config_name = null, state_name = null) => {
    const { name, value } = e.target;
    let errorMessage = '';
    if (name !== 'retire_on' && value?.trim() === '') {
      errorMessage = 'Required';
    } else {
      errorMessage = 'Required';
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };
    switch (name) {
      case 'name':
        if (!value) {
          setError('name', errorMessage);
        } else if (value?.length > 50) {
          setError(name, 'Maximum 50 characters are allowed');
        } else {
          setError('name', '');
        }
        break;
      case 'short_name':
        if (!value) {
          setError('short_name', errorMessage);
        } else if (value?.length > 50) {
          setError(name, 'Maximum 50 characters are allowed');
        } else {
          setError('short_name', '');
        }
        break;
      case 'description':
        if (!value) {
          setError('description', errorMessage);
        } else {
          setError('description', '');
        }
        break;
      case 'collection_operation':
        if (collectionOperations?.length === 0) {
          setError('collection_operation', 'Required');
        } else {
          setError('collection_operation', '');
        }
        break;
      default:
        if (config_name) {
          if (name === 'end_point_url') {
            if (!value || !urlRegex.test(value)) {
              errorMessage =
                'Please provide a correct endpoint URL, e.g: www.example.com';
            } else {
              errorMessage = '';
            }
          }

          setError(config_name, {
            ...errors[config_name],
            [name]: errorMessage,
          });
        } else if (state_name) {
          setError(state_name, errorMessage);
        } else {
          setError(name, errorMessage);
        }
        break;
    }
  };

  const handleFormInput = (event) => {
    const { value, name, checked } = event.target;
    if (name === 'status') {
      setMarketingData({ ...marketingData, [name]: checked });
    } else if (name === 'retire_on') {
      setMarketingData({ ...marketingData, [name]: value });
      setErrors((prevErrors) => ({
        ...prevErrors,
        retire_on: '',
      }));
    } else {
      setMarketingData({ ...marketingData, [name]: value });
    }
  };

  const checkError = (key, value) => {
    switch (key) {
      case 'name':
        if (!value) {
          return 'Name is required.';
        } else if (value?.length > 50) {
          return 'Maximum 50 characters are allowed.';
        } else {
          return '';
        }
      case 'short_name':
        if (!value) {
          return 'Short name is required.';
        } else if (value?.length > 50) {
          return 'Maximum 50 characters are allowed.';
        } else {
          return '';
        }
      case 'description':
        if (!value) {
          return 'Description is required.';
        } else {
          return '';
        }
      case 'collection_operation':
        if (collectionOperations?.length === 0) {
          return 'Collection operation is required.';
        } else {
          return '';
        }
      default:
        return '';
    }
  };
  const validateForm = () => {
    let copy = {
      ...errors,
      name: checkError('name', marketingData.name),
      short_name: checkError('short_name', marketingData.short_name),
      description: checkError('description', marketingData.description),
      collection_operation: checkError(
        'collection_operation',
        marketingData.collection_operation
      ),
    };
    setErrors({ ...copy });
    return copy;
  };

  const handleCollectionOperationChangeAll = (data) => {
    if (!(data?.length > 0)) {
      setCollectionOperationError('Collection Operation is required.');
    } else setCollectionOperationError('');
    setCollectionOperations(data);
  };

  const handleCollectionOperationChange = (collectionOperation) => {
    let operationData = [...collectionOperations];
    operationData = operationData.some(
      (item) => item.id === collectionOperation.id
    )
      ? operationData.filter((item) => item.id !== collectionOperation.id)
      : [...operationData, collectionOperation];
    if (!(operationData?.length > 0)) {
      setCollectionOperationError('Collection Operation is required.');
    } else setCollectionOperationError('');
    setCollectionOperations(operationData);
  };
  const collectionOperationOnBlur = () => {
    if (!(collectionOperations?.length > 0)) {
      setCollectionOperationError('Collection Operation is required.');
    } else {
      setCollectionOperationError('');
    }
  };

  const handleSubmit = async (e) => {
    const errObject = validateForm();
    const idMultiple =
      collectionOperations &&
      collectionOperations?.map((item) => {
        return +item.id;
      });
    if (!(collectionOperations?.length > 0)) {
      setCollectionOperationError('Collection Operation is required.');
    } else setCollectionOperationError('');
    if (Object.values(errObject).every((value) => value === '')) {
      const parsedDate = moment(marketingData.retire_on).toDate();
      const formattedDate = moment(parsedDate).format('DD-MM-yyyy');

      let body = {
        ...marketingData,
        collection_operation: idMultiple,
        retire_on: formattedDate == 'Invalid date' ? null : formattedDate,
        created_by: +id,
      };
      try {
        setIsSubmitting(true);
        const response = await fetch(
          `${BASE_URL}/marketing-equipment/marketing-material`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify(body),
          }
        );
        let data = await response.json();
        if (data.status === 'success') {
          setModalPopUp(true);
        } else if (response?.status === 400) {
          toast.error(`${data?.message ?? data?.response}`, {
            autoClose: 3000,
          });
        } else {
          toast.error(`${data?.message ?? data?.response}`, {
            autoClose: 3000,
          });
        }
        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Marketing Materials'}
      />
      <div className="mainContentInner form-container ">
        <form>
          <div className={`formGroup `}>
            <h5 className="w-50">Create Marketing Material</h5>
            <div className="container-fluid p-0 m-0">
              <Row className="w-100 p-0 m-0">
                <Col lg={6} className={`${styles.inputfieldgap} ps-0`}>
                  <div className="form-field  w-100">
                    <div className={`field`}>
                      <input
                        type="text"
                        className={`form-control ${styles.devicetypeinputfields}`}
                        value={marketingData?.name}
                        name="name"
                        onBlur={handleInputBlur}
                        placeholder=""
                        onChange={(e) => {
                          const filteredValue = e.target.value.replace(
                            /^\s+/g,
                            ''
                          );
                          e.target.value = filteredValue;
                          handleFormInput(e);
                          handleInputBlur(e);
                        }}
                        required
                      />
                      <label className="text-secondary">Name*</label>
                    </div>
                    {errors.name && (
                      <div className={`error ${styles.errorcolor}`}>
                        <p>{errors.name}</p>
                      </div>
                    )}
                  </div>
                </Col>
                <Col lg={6} className={`${styles.inputfieldgap} pe-0`}>
                  <div className="form-field  w-100">
                    <div className={`field`}>
                      <input
                        type="text"
                        className={`form-control ${styles.devicetypeinputfields}`}
                        value={marketingData?.short_name}
                        name="short_name"
                        onBlur={handleInputBlur}
                        placeholder=""
                        onChange={(e) => {
                          const filteredValue = e.target.value.replace(
                            /^\s+/g,
                            ''
                          );
                          e.target.value = filteredValue;
                          handleFormInput(e);
                          handleInputBlur(e);
                        }}
                        required
                      />
                      <label className="text-secondary">Short Name*</label>
                    </div>
                    {errors.short_name && (
                      <div className={`error ${styles.errorcolor}`}>
                        <p>{errors.short_name}</p>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
              <Row className="w-100 p-0 m-0">
                <Col lg={12} className={`mb-2 px-0`}>
                  <div className="form-field w-100 mb-4 textarea">
                    <div
                      className={`field ${styles.contactroledescriptionfield}`}
                    >
                      <textarea
                        type="text"
                        className={`form-control textarea  ${styles.textaeraPadding}  ${styles.contactrolename}`}
                        placeholder=""
                        name="description"
                        required
                        value={marketingData?.description}
                        onChange={(e) => {
                          const filteredValue = e.target.value.replace(
                            /^\s+/g,
                            ''
                          );
                          e.target.value = filteredValue;
                          handleFormInput(e);
                          handleInputBlur(e);
                        }}
                        onBlur={handleInputBlur}
                      />
                      <label
                        className={`text-secondary mb-2 ${styles.descriptionLabel}`}
                      >
                        Description*
                      </label>
                    </div>
                    <br />
                    {errors.description && (
                      <div
                        className={`error ${styles.descriptionMargin} ${styles.errorcolor}`}
                      >
                        <p className="mb-0">{errors.description}</p>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
              <Row className="w-100 p-0 m-0">
                <Col lg={6} className={`${styles.inputfieldgap} ps-0`}>
                  <div className="form-field  w-100">
                    <div className={`field`}>
                      <DatePicker
                        dateFormat="MM/dd/yyyy"
                        className="custom-datepicker"
                        placeholderText="Retire On"
                        selected={marketingData.retire_on}
                        minDate={new Date()}
                        onChange={(date) => {
                          handleFormInput({
                            target: { value: date, name: 'retire_on' },
                          });
                        }}
                      />
                    </div>
                  </div>
                </Col>
                <Col lg={6} className={styles.multiselectfield}>
                  <GlobalMultiSelect
                    label="Collection Operation*"
                    data={collectionOperationData}
                    selectedOptions={collectionOperations}
                    onChange={handleCollectionOperationChange}
                    onSelectAll={handleCollectionOperationChangeAll}
                    error={collectionOperationError}
                    onBlur={collectionOperationOnBlur}
                  />
                </Col>
              </Row>
            </div>

            <div className={`w-50 ${styles.inputfieldgap}`}>
              <div
                className={`form-field checkbox mb-0 ${styles.fieldcontact}`}
              >
                <span className="toggle-text">
                  {marketingData?.status ? 'Active' : 'Inactive'}
                </span>
                <label htmlFor="toggle" className="switch">
                  <input
                    type="checkbox"
                    id="toggle"
                    className="toggle-input"
                    checked={marketingData?.status}
                    name="status"
                    defaultChecked
                    onChange={(e) => {
                      handleFormInput(e);
                    }}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </form>
        <div className="form-footer">
          <p
            className={`mb-0 ${styles.cancelbutton}`}
            onClick={(e) => {
              e.preventDefault();
              setCloseModal(true);
            }}
          >
            Cancel
          </p>

          <button
            disabled={isSubmitting}
            type="button"
            className={` btn btn-md mb-0 btn-primary ${styles.createbtn} 
            ${'btn-primary'}
            `}
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
      <SuccessPopUpModal
        title={'Success!'}
        message={'Marketing Material created.'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        isNavigate={true}
        redirectPath={
          '/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/list'
        }
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={
          '/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/list'
        }
      />
    </div>
  );
};

export default MarketingMaterialCreate;
