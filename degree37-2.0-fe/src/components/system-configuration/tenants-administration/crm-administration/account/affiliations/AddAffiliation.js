import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import SuccessPopUpModal from '../../../../../common/successModal';
import TopBar from '../../../../../common/topbar/index';
import FormInput from '../../../../../common/form/FormInput';
// import SelectDropdown from '../../../../../common/selectDropdown';
import styles from './index.module.scss';
import { AccountBreadCrumbsData } from '../AccountBreadCrumbsData';
import FormFooter from '../../../../../common/FormFooter';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';

const errorIniitialState = {
  name: '',
  description: '',
};

const affiliationInitialState = {
  name: '',
  description: '',
  is_active: true,
};

function isEmpty(value) {
  return value === '' || value === null || value === undefined;
}

const AddAffiliation = () => {
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [affiliation, setAffiliation] = useState(affiliationInitialState);
  const [errors, setErrors] = useState(errorIniitialState);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [collectionOperationError, setCollectionOperationError] = useState('');
  const bearerToken = localStorage.getItem('token');

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'description' && value?.length > 500) {
      toast.dismiss();
      toast.warn('Max Characters allowed for Description are 500');
      return;
    }
    setAffiliation({ ...affiliation, [name]: value });
    setChangesMade(true);
    if (!value) {
      if (name === 'name') {
        setErrors({ ...errors, [name]: 'Name is required.' });
      }
      if (name === 'description') {
        setErrors({ ...errors, [name]: 'Description is required.' });
      }
    } else {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCollectionOperation = (val) => {
    setChangesMade(true);
    setCollectionOperationError('');
    // setCollectionOperation(val);
    const currentState = collectionOperation;

    if (currentState?.find((item) => item.id === val.id)) {
      setCollectionOperation(currentState.filter((co) => co.id !== val.id));
    } else {
      setCollectionOperation([...currentState, val]);
    }
  };

  const BreadcrumbsData = [
    ...AccountBreadCrumbsData,
    {
      label: 'Create Affiliation',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/crm-admin/accounts/affiliations/create',
    },
  ];
  const handleCheckboxChange = (event) => {
    setChangesMade(true);
    setAffiliation({ ...affiliation, is_active: event.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrorcheck = false;
    if (!collectionOperation.length) {
      setCollectionOperationError('Collection operation is required.');
      tempErrorcheck = true;
    }
    for (const key in errors) {
      if (isEmpty(affiliation[key])) {
        tempErrorcheck = true;
        setErrors((prev) => ({
          ...prev,
          [key]:
            key === 'name' ? 'Name is required.' : 'Description is required.',
        }));
      }
    }
    if (tempErrorcheck) {
      return;
    }
    const result = await fetch(BASE_URL + '/affiliations', {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
      method: 'POST',
      body: JSON.stringify({
        ...affiliation,
        collection_operation: collectionOperation?.map((item) =>
          parseInt(item.id)
        ),
      }),
    });
    if (result.status === 201) {
      setShowSuccessMessage(true);
      setChangesMade(false);
      setAffiliation(affiliationInitialState);
      setErrors(errorIniitialState);
      setCollectionOperationError('');
    } else if (result.status === 409) {
      toast.error('Email already exists', { autoClose: 3000 });
    } else {
      toast.error(`Error with statusCode:${result.status}`, {
        autoClose: 3000,
      });
    }
  };

  const fetchCollectionOperations = async () => {
    const result = await fetch(
      `${BASE_URL}/business_units/collection_operations/list`,
      {
        headers: {
          method: 'GET',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      let formatCollectionOperations = data?.map((operation) => ({
        name: operation?.name,
        id: operation?.id,
      }));
      setCollectionOperationData(formatCollectionOperations);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  useEffect(() => {
    fetchCollectionOperations();
  }, []);
  const handleCancel = () => {
    if (changesMade) setShowCancelModal(true);
    else navigate(-1);
  };
  const handleInputBlur = (e, config_name = null, other = null) => {
    const { name, value } = e.target;
    console.log({ name, value });
    if (config_name) {
      !collectionOperation
        ? setCollectionOperationError('Collection operation is required.')
        : setCollectionOperationError('');
      return;
    }

    let errorMessage = '';

    if (value.trim() === '') {
      errorMessage =
        name === 'name' ? 'Name is required.' : 'Description is required.';
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
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,
          }));
        } else if (value.length > 50) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: 'Maximum 50 characters are allowed.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            name: errorMessage,
          }));
        }
        break;
      case 'description':
        if (value.length > 500) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: 'Maximum 500 characters are allowed.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,
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

  return (
    <div className="mainContent d-flex flex-column">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Affiliations'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form>
          <div className="formGroup">
            <h5>Create Affiliation</h5>
            <FormInput
              label="Name"
              name="name"
              displayName="Name"
              value={affiliation.name}
              onChange={handleChange}
              maxLength={50}
              required
              error={errors.name}
              onBlur={(e) => handleInputBlur(e)}
            />

            <div className="form-field">
              <div className={`field`}>
                <GlobalMultiSelect
                  data={collectionOperationData}
                  selectedOptions={collectionOperation}
                  onChange={(e) => {
                    handleCollectionOperation(e);
                  }}
                  onSelectAll={(e) => {
                    if (
                      collectionOperation.length !==
                      collectionOperationData.length
                    )
                      setCollectionOperation(collectionOperationData);
                    else setCollectionOperation([]);
                  }}
                  error={collectionOperationError}
                  label={'Collection Operation*'}
                />
              </div>
            </div>

            <div className="form-field textarea-new w-100">
              <div className="field ">
                <textarea
                  type="text"
                  className="form-control textarea"
                  placeholder=" "
                  name="description"
                  value={affiliation.description}
                  onChange={handleChange}
                  required
                  onBlur={(e) => handleInputBlur(e)}
                  maxLength={500}
                />
                <label>Description*</label>
              </div>
              {errors?.description && (
                <div>
                  <div>
                    <p className={styles.error}>{errors.description}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="form-field checkbox">
              <span className="toggle-text">
                {affiliation.is_active ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  checked={affiliation.is_active}
                  onChange={handleCheckboxChange}
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  name="is_active"
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </form>
      </div>
      <FormFooter
        enableCancel={true}
        onClickCancel={handleCancel}
        enableCreate={true}
        onClickCreate={handleSubmit}
      />
      <SuccessPopUpModal
        title="Confirmation"
        message={'Unsaved changes will be lost. Do you want to continue?'}
        modalPopUp={showCancelModal}
        setModalPopUp={setShowCancelModal}
        showActionBtns={false}
        isArchived={true}
        archived={() => navigate(-1)}
      />
      <SuccessPopUpModal
        title="Success!"
        message={'Affiliation created.'}
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

export default AddAffiliation;
