import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import TopBar from '../../../../common/topbar/index';
import SuccessPopUpModal from '../../../../common/successModal';
import { TEAMS_PATH } from '../../../../../routes/path';
import FormInput from '../../../users-administration/users/FormInput';
import FormText from '../../../../common/form/FormText';
import GlobalMultiSelect from '../../../../common/GlobalMultiSelect';
import axios from 'axios';
import { TeamsBreadCrumbsData } from './TeamsBreadCrumbsData';

const errorIniitialState = {
  name: '',
  short_description: '',
  description: '',
  collectionOperation: '',
};

const teamInitialState = {
  name: '',
  short_description: '',
  description: '',
  is_active: true,
  collectionOperation: '',
};

const AddTeam = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [team, setTeam] = useState(teamInitialState);
  const [errors, setErrors] = useState(errorIniitialState);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [collectionOperationError, setCollectionOperationError] = useState('');
  const bearerToken = localStorage.getItem('token');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BreadcrumbsData = [
    ...TeamsBreadCrumbsData,
    {
      label: 'Create Team',
      class: 'active-label',
      link: TEAMS_PATH.CREATE,
    },
  ];

  const handleCheckboxChange = (event) => {
    setChangesMade(true);

    setTeam({ ...team, is_active: event.target.checked });
  };
  const fieldNames = [
    { label: 'Name', name: 'name', required: true, maxLength: 50 },
    {
      label: 'Short Description',
      name: 'short_description',
      required: true,
      maxLength: 50,
    },
    {
      label: 'Description',
      name: 'description',
      required: true,
      maxLength: 500,
    },
    {
      label: 'Collection Operation',
      name: 'collection_operation',
      required: true,
    },
  ];

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    fieldNames.forEach((fieldName) => {
      const value = team[fieldName.name];
      const fieldDefinition = fieldNames.find(
        (field) => field.name === fieldName.name
      );
      let errorMessage = '';

      console.log('value', value);

      if (fieldDefinition?.required && value?.toString().trim() === '') {
        errorMessage = `${titleCase(fieldDefinition.label)} is required.`;
      }

      if (
        fieldDefinition?.maxLength &&
        value?.length > fieldDefinition?.maxLength
      ) {
        errorMessage = `Maximum ${fieldDefinition.maxLength} characters are allowed.`;
      }

      console.log('errorMessage', errorMessage);

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

  function titleCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeam((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });

    let errorMessage = '';

    const fieldDefinition = fieldNames.find((field) => field.name === name);

    if (fieldDefinition?.required && value.toString().trim() === '') {
      errorMessage = `${titleCase(fieldDefinition.label)} is required.`;
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
    setChangesMade(true);
    setError(name, errorMessage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!(collectionOperation?.length > 0)) {
      setCollectionOperationError('Collection operation is required.');
      return;
    }
    if (isValid) {
      if (isSubmitting) return;
      setIsSubmitting(true);
      // handleCollectionOperationChange(collectionOperation);
      const result = await fetch(BASE_URL + '/staff-admin/teams', {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        body: JSON.stringify({
          ...team,
          collection_operation_id: collectionOperation?.map((item) =>
            parseInt(item.id)
          ),
        }),
      });

      if (result.status === 201) {
        setShowSuccessMessage(true);
        setChangesMade(false);
        setCollectionOperationError('');
        setErrors(errorIniitialState);
      } else {
        let err = await result.json();
        console.log({ err });
        if (err.message)
          toast.error(err?.message[0], {
            autoClose: 3000,
          });
        else
          toast.error(`Error with statusCode:${result.status}`, {
            autoClose: 3000,
          });
      }
      setIsSubmitting(false);
    }
  };
  const fetchCollectionOperations = async () => {
    const result = await axios.get(
      `${BASE_URL}/business_units/collection_operations/list?status=true`
    );
    let { data } = await result.data;
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
  const handleCollectionOperationChange = (collectionOperationTemp) => {
    let tempCo = [...collectionOperation];
    tempCo = tempCo.some((item) => item.id === collectionOperationTemp.id)
      ? tempCo.filter((item) => item.id !== collectionOperationTemp.id)
      : [...tempCo, collectionOperationTemp];
    if (!(tempCo?.length > 0)) {
      setCollectionOperationError('Collection operation is required.');
    } else setCollectionOperationError('');
    setCollectionOperation(tempCo);
  };
  const handleCollectionOperationChangeAll = (data) => {
    if (!(data?.length > 0)) {
      setCollectionOperationError('Collection operation is required.');
    } else setCollectionOperationError('');
    setCollectionOperation(data);
  };

  useEffect(() => {
    fetchCollectionOperations();
  }, []);

  const handleCancel = () => {
    if (changesMade) setShowCancelModal(true);
    else navigate(-1);
  };

  const collectionOperationOnBlur = () => {
    if (!(collectionOperation?.length > 0)) {
      setCollectionOperationError('Collection operation is required.');
    } else setCollectionOperationError('');
  };
  return (
    <div className="mainContent ">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Teams'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form>
          <div className="formGroup">
            <h5>Create Team</h5>

            <FormInput
              label="Name"
              name="name"
              value={team.name}
              onChange={handleInputChange}
              required
              error={errors.name}
              errorHandler={handleInputChange}
            />

            <FormInput
              label="Short Description"
              name="short_description"
              value={team.short_description}
              onChange={handleInputChange}
              required
              error={errors.short_description}
              errorHandler={handleInputChange}
            />
            <FormText
              name="description"
              displayName="Description"
              value={team.description}
              error={errors.description}
              classes={{ root: 'w-100' }}
              required
              onChange={handleInputChange}
              onBlur={handleInputChange}
            />
            <div className="w-50">
              <GlobalMultiSelect
                label="Collection Operation*"
                data={collectionOperationData}
                selectedOptions={collectionOperation}
                error={collectionOperationError}
                onChange={handleCollectionOperationChange}
                onSelectAll={handleCollectionOperationChangeAll}
                onBlur={collectionOperationOnBlur}
              />
            </div>
            <div className="form-field checkbox w-100">
              <span className="toggle-text">
                {team.is_active ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  checked={team.is_active}
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
      <div>
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
        message={'Unsaved changes will be lost. Do you want to continue?'}
        modalPopUp={showCancelModal}
        setModalPopUp={setShowCancelModal}
        showActionBtns={false}
        isArchived={true}
        archived={() => navigate(-1)}
        acceptBtnTitle="Ok"
        rejectBtnTitle="Cancel"
      />

      <SuccessPopUpModal
        title="Success!"
        message={'Team created.'}
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

export default AddTeam;
