import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import TopBar from '../../../../common/topbar/index';
import FormInput from '../../../users-administration/users/FormInput';
import SuccessPopUpModal from '../../../../common/successModal';
import { TEAMS_PATH } from '../../../../../routes/path';
import FormText from '../../../../common/form/FormText';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import GlobalMultiSelect from '../../../../common/GlobalMultiSelect';
import axios from 'axios';
import { TeamsBreadCrumbsData } from './TeamsBreadCrumbsData';

const errorIniitialState = {
  name: '',
  short_description: '',
  description: '',
};

const teamInitialState = {
  name: '',
  short_description: '',
  description: '',
  is_active: true,
};

const EditTeam = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [team, setTeam] = useState(teamInitialState);
  const [errors, setErrors] = useState(errorIniitialState);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const params = useParams();
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [collectionOperationError, setCollectionOperationError] = useState('');
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveStatus, setArchiveStatus] = useState(false);
  const [saveChanges, setSaveChanges] = useState(false);

  const bearerToken = localStorage.getItem('token');

  useEffect(() => {
    const getData = async (id) => {
      if (id) {
        const result = await fetch(
          `${BASE_URL}/staff-admin/teams/${params.id}`,
          {
            headers: {
              method: 'GET',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        if (result?.status === 200) {
          let data = await result.json();
          setTeam(data?.team);
          setCollectionOperation(
            data.collectionOperations.map((co) => {
              return {
                name: co.collection_operation_id.name,
                id: co.collection_operation_id.id,
              };
            })
          );
        } else {
          toast.error('Error Fetching Team Details', {
            autoClose: 3000,
          });
        }
      } else {
        toast.error('Error Fetching Team Details', { autoClose: 3000 });
      }
    };
    if (params?.id) {
      getData(params.id);
    }
  }, [params?.id, BASE_URL]);
  const BreadcrumbsData = [
    ...TeamsBreadCrumbsData,
    {
      label: 'Edit Team',
      class: 'active-label',
      link: TEAMS_PATH.EDIT.replace(':id', params?.id),
    },
  ];

  function titleCase(string) {
    if (string) return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }

  const handleCheckboxChange = (event) => {
    setChangesMade(true);
    setTeam({ ...team, is_active: event.target.checked });
  };
  const handleSubmit = async (e, fromSaveAndClose) => {
    e.preventDefault();
    // handleCollectionOperationChange(collectionOperation);
    const isValid = validateForm();
    if (!(collectionOperation?.length > 0)) {
      setCollectionOperationError('Collection operation is required.');
      return;
    }

    if (isValid) {
      const result = await fetch(BASE_URL + '/staff-admin/teams/' + params.id, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
        method: 'PUT',
        body: JSON.stringify({
          ...team,
          collection_operation_id: collectionOperation.map((item) =>
            parseInt(item.id)
          ),
          created_by: team?.created_by?.id,
        }),
      });
      if (result.status === 204) {
        if (fromSaveAndClose) setShowSuccessMessage(true);
        else setChangesMade(false);
        setCollectionOperationError('');
        setErrors(errorIniitialState);
      } else if (result.status === 404) {
        toast.error('Team Not Found', { autoClose: 3000 });
      } else {
        toast.error(`Error with statusCode:${result.status}`, {
          autoClose: 3000,
        });
      }
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
  useEffect(() => {
    fetchCollectionOperations();
  }, []);

  const handleCancel = (e) => {
    e.preventDefault();

    if (changesMade) setShowCancelModal(true);
    else navigate(-1);
  };
  const collectionOperationOnBlur = () => {
    if (!(collectionOperation?.length > 0)) {
      setCollectionOperationError('Collection operation is required.');
    } else setCollectionOperationError('');
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
      if (fieldDefinition?.required && value?.toString().trim() === '') {
        errorMessage = `${titleCase(fieldDefinition.label)} is required.`;
      }

      if (
        fieldDefinition?.maxLength &&
        value?.length > fieldDefinition?.maxLength
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
  const archiveTeam = async () => {
    try {
      const res = await makeAuthorizedApiRequest(
        'DELETE',
        `${BASE_URL}/staff-admin/teams/archive/${params?.id}`,
        JSON.stringify({
          created_by: team?.created_by?.id,
        })
      );
      if (res.status === 404) {
        toast.error('Team not found.');
        return;
      }
      if (res.status === 204) {
        setModalPopUp(false);
        setTimeout(() => {
          setArchiveStatus(true);
        }, 600);

        return;
      } else toast.error('Something went wrong.');
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Teams'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form className="">
          <div className="formGroup">
            <h5>Edit Team</h5>
            <FormInput
              label="Name"
              name="name"
              value={team?.name}
              onChange={handleInputChange}
              required
              error={errors.name}
              errorHandler={handleInputChange}
            />
            <FormInput
              label="Short Description"
              name="short_description"
              value={team?.short_description}
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
                  checked={team?.is_active}
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
          <div className="form-footer-custom">
            {team?.id && (
              <>
                <div className="archived" onClick={() => setModalPopUp(true)}>
                  Archive
                </div>
                <button
                  className="btn btn-secondary border-0"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={(e) => {
                    handleSubmit(e, true);
                    setSaveChanges(false);
                  }}
                >
                  Save & Close
                </button>
                <button
                  type="button"
                  className={` ${`btn btn-primary`}`}
                  onClick={(e) => {
                    handleSubmit(e, true);
                    setSaveChanges(true);
                  }}
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </form>
        <SuccessPopUpModal
          title="Confirmation"
          message={'Unsaved changes will be lost. Do you want to continue?'}
          modalPopUp={showCancelModal}
          setModalPopUp={setShowCancelModal}
          showActionBtns={false}
          isArchived={true}
          acceptBtnTitle="Ok"
          rejectBtnTitle="Cancel"
          archived={() => navigate(TEAMS_PATH.LIST)}
        />
        <SuccessPopUpModal
          title="Success!"
          message={'Team updated.'}
          modalPopUp={showSuccessMessage}
          isNavigate={true}
          redirectPath={!saveChanges && TEAMS_PATH.LIST}
          showActionBtns={true}
          isArchived={false}
          setModalPopUp={setShowSuccessMessage}
        />
        <SuccessPopUpModal
          title="Confirmation"
          message={'Are you sure you want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={true}
          archived={archiveTeam}
        />
        <SuccessPopUpModal
          title="Success!"
          message={'Team is archived.'}
          modalPopUp={archiveStatus}
          isNavigate={true}
          redirectPath={TEAMS_PATH.LIST}
          showActionBtns={true}
          isArchived={false}
          setModalPopUp={setArchiveStatus}
        />
      </div>
    </div>
  );
};
export default EditTeam;
