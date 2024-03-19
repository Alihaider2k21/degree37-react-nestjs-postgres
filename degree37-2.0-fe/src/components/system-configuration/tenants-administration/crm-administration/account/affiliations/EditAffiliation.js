import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import SuccessPopUpModal from '../../../../../common/successModal';
import TopBar from '../../../../../common/topbar/index';
import FormInput from '../../../../../common/form/FormInput';
import FormFooter from '../../../../../common/FormFooter';
import styles from './index.module.scss';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import { AccountBreadCrumbsData } from '../AccountBreadCrumbsData';
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

const EditAffiliation = () => {
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [affiliation, setAffiliation] = useState(affiliationInitialState);
  const [errors, setErrors] = useState(errorIniitialState);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const params = useParams();
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [collectionOperationError, setCollectionOperationError] = useState('');
  const bearerToken = localStorage.getItem('token');
  const [initialTime, setInitialTime] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [fromSaveAndClose, setFromSaveAndClose] = useState(false);

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

  useEffect(() => {
    const getData = async (id) => {
      if (id) {
        const result = await fetch(`${BASE_URL}/affiliations/${id}`, {
          headers: {
            method: 'GET',
            authorization: `Bearer ${bearerToken}`,
          },
        });
        if (result?.status === 200) {
          let data = await result.json();

          setAffiliation({
            ...data,
          });
        } else {
          toast.error('Error Fetching Affiliation Details', {
            autoClose: 3000,
          });
        }
      } else {
        toast.error('Error Fetching Affiliation Details', { autoClose: 3000 });
      }
    };
    if (params?.id) {
      getData(params.id);
    }
  }, [params?.id, BASE_URL]);

  const BreadcrumbsData = [
    ...AccountBreadCrumbsData,

    {
      label: 'Edit Affiliation',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/crm-admin/accounts/affiliations/${affiliation?.id}/edit`,
    },
  ];

  const handleCheckboxChange = (event) => {
    setChangesMade(true);
    setAffiliation({ ...affiliation, is_active: event.target.checked });
  };

  const handleSubmit = async (fromSaveAndClose) => {
    setFromSaveAndClose(fromSaveAndClose);
    let tempErrorcheck = false;
    if (!collectionOperation.length) {
      setCollectionOperationError('Collection operation is required.');

      return;
    }
    for (const key in errors) {
      if (isEmpty(affiliation[key])) {
        tempErrorcheck = true;
        setErrors((prev) => ({
          ...prev,
          [key]:
            key === 'name' ? 'Name is required' : 'Description is required',
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
      method: 'PUT',
      body: JSON.stringify({
        ...affiliation,
        collection_operation: collectionOperation?.map((item) =>
          parseInt(item.id)
        ),
        created_by: affiliation?.created_by?.id,
      }),
    });
    if (result.status === 204) {
      setShowSuccessMessage(true);
      setChangesMade(false);
      setErrors(errorIniitialState);
    } else if (result.status === 404) {
      toast.error('Affiliation Not Found', { autoClose: 3000 });
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

  useEffect(() => {
    if (affiliation && !initialTime && collectionOperationData?.length > 0) {
      setCollectionOperation(
        affiliation?.collection_operation?.map((collecOperation) => {
          return {
            id: collecOperation?.id,
            name: collecOperation?.name,
          };
        })
      );
      setInitialTime(true);
    }
  }, [affiliation]);

  const handleCancel = () => {
    if (changesMade) setShowCancelModal(true);
    else navigate(-1);
  };

  const handleInputBlur = (e, config_name = null, other = null) => {
    const { name, value } = e.target;
    let errorMessage = '';

    if (config_name) {
      !collectionOperation
        ? setCollectionOperationError('Collection operation is required.')
        : setCollectionOperationError('');
      return;
    }
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
      case 'description':
        if (value.length > 500) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: 'Maximum 500 characters are allowed',
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

  const handleCollectionOperation = (val) => {
    setChangesMade(true);
    setCollectionOperationError('');
    const currentState = collectionOperation;

    if (currentState?.find((item) => item.id === val.id)) {
      setCollectionOperation(currentState.filter((co) => co.id !== val.id));
    } else {
      setCollectionOperation([...currentState, val]);
    }
  };
  const handleConfirmArchive = async () => {
    try {
      const res = await makeAuthorizedApiRequest(
        'DELETE',
        `${BASE_URL}/affiliations/archive/${affiliation.id}`,
        JSON.stringify({
          collection_operation_id: +affiliation?.collection_operation_id?.id,
          created_by: +affiliation?.created_by?.id,
        })
      );
      if (res.status === 404) {
        toast.error('Affiliation not found.');
        return;
      }
      if (res.status === 204) {
        setArchiveModal(false);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
      }
    } catch (error) {
      toast.error(`${error?.data?.resopnse || 'Failed to archive'}`, {
        autoClose: 3000,
      });
      setArchiveModal(false);
    }

    setArchiveModal(false);
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
            <h5>Edit Affiliation</h5>
            <FormInput
              label="Name"
              name="name"
              displayName="Name"
              value={affiliation.name}
              onChange={handleChange}
              required
              error={errors.name}
              onBlur={(e) => handleInputBlur(e)}
              maxLength={50}
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
        enableArchive={true}
        onClickArchive={() => setArchiveModal(true)}
        enableCancel={true}
        onClickCancel={handleCancel}
        enableSaveAndClose={true}
        onClickSaveAndClose={() => {
          handleSubmit(true);
        }}
        enableSaveChanges={true}
        onClickSaveChanges={() => {
          handleSubmit(false);
        }}
      />
      <SuccessPopUpModal
        title="Confirmation"
        message={'Are you sure want to archive?'}
        modalPopUp={archiveModal}
        setModalPopUp={setArchiveModal}
        showActionBtns={false}
        isArchived={true}
        archived={handleConfirmArchive}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Affiliation is archived."
        modalPopUp={archiveSuccess}
        isNavigate={true}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/crm-admin/accounts/affiliations'
        }
      />
      <SuccessPopUpModal
        title="Confirmation"
        message={'Unsaved changes will be lost. Do you want to continue?'}
        modalPopUp={showCancelModal}
        setModalPopUp={setShowCancelModal}
        showActionBtns={false}
        isArchived={true}
        archived={() =>
          navigate(
            '/system-configuration/tenant-admin/crm-admin/accounts/affiliations'
          )
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message={'Affiliation updated.'}
        modalPopUp={showSuccessMessage}
        isNavigate={fromSaveAndClose ? true : false}
        redirectPath={-1}
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setShowSuccessMessage}
      />
    </div>
  );
};

export default EditAffiliation;
