import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SelectDropdown from '../../../../../common/selectDropdown';
import FormInput from '../../../../../common/form/FormInput';
import TopBar from '../../../../../common/topbar/index';
import DatePicker from '../../../../../common/DatePicker';
import SuccessPopUpModal from '../../../../../common/successModal';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../../../../../helpers/Api';
import moment from 'moment';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import { MarketingEquipmentBreadCrumbsData } from '../MarketingEquipmentBreadCrumbsData';

const errorIniitialState = {
  name: '',
  short_name: '',
  description: '',
};

const promotionalitemInitialState = {
  name: '',
  short_name: '',
  description: '',
  status: true,
};

function isEmpty(value) {
  return value === '' || value === null || value === undefined;
}

const AddPromotionalItem = () => {
  const navigate = useNavigate();
  const [promotionalItem, setPromotionalItem] = useState(
    promotionalitemInitialState
  );
  const [retireDate, setRetireDate] = useState('');
  const [retireDateError, setRetireDateError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [collectionOperationError, setCollectionOperationError] = useState('');
  const [promotion, setPromotion] = useState(null);
  const [promotionsData, setPromotionsData] = useState([]);
  const [promotionError, setPromotionError] = useState('');
  const [errors, setErrors] = useState(errorIniitialState);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCollectionOperations = async () => {
    const result = await fetchData(
      '/business_units/collection_operations/list?status=true'
    );
    let { data, status_code, status } = result;
    if (status === 'success' || status_code === 200) {
      let formatCollectionOperations = data?.map((operation) => ({
        name: operation?.name,
        id: operation?.id,
      }));
      setCollectionOperationData(formatCollectionOperations);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };
  const fetchPromotions = async () => {
    const result = await fetchData(
      '/marketing-equipment/promotions?limit=10000'
    );
    let { data, status } = result;

    if (status === 200) {
      const formatPromotions = data?.promotions
        ?.filter((promotion) => promotion.status === true)
        .map((promotion) => ({
          label: promotion.name,
          value: promotion.id,
        }));

      setPromotionsData(formatPromotions);
    } else {
      toast.error('Error Fetching Promotions ', { autoClose: 3000 });
    }
  };

  useEffect(() => {
    fetchCollectionOperations();
    fetchPromotions();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPromotionalItem({ ...promotionalItem, [name]: value });
    setChangesMade(true);
    setErrors({ ...errors, [name]: '' });
  };

  const BreadcrumbsData = [
    ...MarketingEquipmentBreadCrumbsData,
    {
      label: 'Create Promotional Item',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotional-item/create',
    },
  ];

  const setCollectionError = (latestCollectionOperation) => {
    setCollectionOperationError(
      !latestCollectionOperation.length
        ? ''
        : 'Collection Operation is required.'
    );
  };

  const handlePromotion = (val) => {
    if (val === null) {
      setPromotion(null);
      setPromotionError('Promotion is required.');
    } else {
      setChangesMade(true);
      setPromotion(val);
      setPromotionError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrorcheck = false;
    if (collectionOperation.length === 0) {
      setCollectionOperationError('Collection Operation is required.');
      tempErrorcheck = true;
    }
    if (promotion === null) {
      setPromotionError('Promotion is required.');
      tempErrorcheck = true;
    }
    for (const key in errors) {
      if (isEmpty(promotionalItem[key])) {
        tempErrorcheck = true;
        setErrors((prev) => ({
          ...prev,
          [key]: `${(key.charAt(0).toUpperCase() + key.slice(1)).replace(
            /_/g,
            ' '
          )} is required.`,
        }));
      }
    }
    if (!tempErrorcheck) {
      const parsedDate = moment(retireDate).toDate();
      let formattedDate;
      formattedDate = moment(parsedDate).format('MM-DD-YYYYThh:mm:ss');
      setIsSubmitting(true);
      const result = await fetchData(
        '/marketing-equipment/promotional-items',
        'POST',
        {
          ...promotionalItem,
          collection_operations: collectionOperation.map((item) => +item.id),
          promotion_id: +promotion?.value,
          retire_on: formattedDate == 'Invalid date' ? null : formattedDate,
        }
      );
      if (result.status === 'success' || result.status_code === 201) {
        setShowSuccessMessage(true);
        setChangesMade(false);
        setPromotionalItem(promotionalitemInitialState);
        setErrors(errorIniitialState);
      } else {
        toast.error(`Error with statusCode:${result.status}`, {
          autoClose: 3000,
        });
      }
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (event) => {
    setChangesMade(true);
    setPromotionalItem({ ...promotionalItem, status: event.target.checked });
  };

  const handleInputBlur = (e, config_name = null, other = null) => {
    const { name, value } = e.target;

    if (config_name) {
      if (collectionOperation.length === 0)
        setCollectionOperationError('Collection Operation is required.');
      if (promotion === null) setPromotionError('Promotion is required.');
      return;
    }

    let errorMessage = '';

    if (value.trim() === '') {
      errorMessage = `${(name.charAt(0).toUpperCase() + name.slice(1)).replace(
        /_/g,
        ' '
      )} is required.`;
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    switch (name) {
      case 'name':
        if (value.length > 50) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: 'Maximum 50 characters are allowed',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            name: errorMessage,
          }));
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

  const handleCancel = () => {
    if (changesMade) setShowCancelModal(true);
    else navigate(-1);
  };

  const handleCollectionOperationChange = (collectionOperation) => {
    setCollectionOperation((prevSelected) =>
      prevSelected.some((item) => item.id === collectionOperation.id)
        ? prevSelected.filter((item) => item.id !== collectionOperation.id)
        : [...prevSelected, collectionOperation]
    );
    setCollectionError(collectionOperation);
  };
  const handleCollectionOperationChangeAll = (data) => {
    setCollectionOperation(data);
    setCollectionError(collectionOperation);
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Promotional Items'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form>
          <div className="formGroup">
            <h5>Create Promotional Item </h5>
            <FormInput
              label="Name*"
              name="name"
              displayName="Name"
              value={promotionalItem.name}
              onChange={(e) => {
                const filteredValue = e.target.value.replace(/^\s+/g, '');
                e.target.value = filteredValue;
                handleChange(e);
                handleInputBlur(e);
              }}
              maxLength={60}
              required
              error={errors.name}
              handleBlur={handleInputBlur}
            />

            <FormInput
              label="Short Name*"
              name="short_name"
              displayName="Short Name"
              value={promotionalItem.short_name}
              onChange={(e) => {
                const filteredValue = e.target.value.replace(/^\s+/g, '');
                e.target.value = filteredValue;
                handleChange(e);
                handleInputBlur(e);
              }}
              maxLength={60}
              required
              error={errors.short_name}
              handleBlur={handleInputBlur}
            />

            <div className="row w-100">
              <div className="form-field textarea col-md-12 w-100">
                <div className="field ">
                  <textarea
                    type="text"
                    className="form-control textarea w-100"
                    placeholder=" "
                    name="description"
                    onBlur={handleInputBlur}
                    value={promotionalItem.description}
                    onChange={(e) => {
                      const filteredValue = e.target.value.replace(/^\s+/g, '');
                      e.target.value = filteredValue;
                      handleChange(e);
                      handleInputBlur(e);
                    }}
                    maxLength={500}
                    required
                  />
                  <label>Description *</label>
                </div>
                {errors?.description && (
                  <div className="error">
                    <p>{errors?.description}</p>
                  </div>
                )}
              </div>
            </div>
            <SelectDropdown
              className="dropdown-selector full_height"
              placeholder={'Promotion*'}
              defaultValue={promotion}
              showLabel
              name="promotion"
              selectedValue={promotion}
              onChange={(e) => {
                handlePromotion(e);
              }}
              options={promotionsData}
              error={promotionError}
              removeDivider={true}
              onBlur={(e) =>
                promotion == null && setPromotionError('Promotion is required.')
              }
            />

            <div className="form-field">
              <div className="field">
                <DatePicker
                  dateFormat="MM/dd/yyyy"
                  className="custom-datepicker"
                  placeholderText="Retire Date"
                  selected={retireDate}
                  minDate={new Date()}
                  onChange={(val) => {
                    setRetireDate(val);
                    setRetireDateError('');
                  }}
                />
              </div>
              {retireDateError && (
                <div className={`error ml-1 mt-1`}>
                  <p>{retireDateError}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <GlobalMultiSelect
                  label="Collection Operation*"
                  data={collectionOperationData}
                  selectedOptions={collectionOperation}
                  error={collectionOperationError}
                  onChange={handleCollectionOperationChange}
                  onSelectAll={handleCollectionOperationChangeAll}
                />
              </div>
            </div>
            <div className="form-field checkbox w-100">
              <span className="toggle-text">
                {promotionalItem.status ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  checked={promotionalItem.status}
                  onChange={handleCheckboxChange}
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  name="status"
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </form>
        <div className="form-footer">
          <button className="btn btn-secondary border-0" onClick={handleCancel}>
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            className={` ${`btn btn-primary`}`}
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
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
        message={'Promotional Item created.'}
        modalPopUp={showSuccessMessage}
        isNavigate={true}
        redirectPath={-1}
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setShowSuccessMessage}
      />
    </div>
  );
};

export default AddPromotionalItem;
