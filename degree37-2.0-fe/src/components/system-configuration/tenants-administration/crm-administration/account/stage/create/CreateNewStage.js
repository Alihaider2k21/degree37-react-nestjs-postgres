import jwt from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../../common/successModal';
import TopBar from '../../../../../../common/topbar/index';
import Button from '../../../../../../common/Button/Button.jsx';
import {
  archiveStageApi,
  createStageApi,
  getStageApi,
  updateStageApi,
} from '../api.js';
import CancelModalPopUp from '../../../../../../common/cancelModal';
import { addStagesSchema, yupErrorHandler } from '../yup.schema';
import FormInput from '../../../../../../common/form/FormInput';
import FormText from '../../../../../../common/form/FormText';
import FormToggle from '../../../../../../common/form/FormToggle';
import { AccountBreadCrumbsData } from '../../AccountBreadCrumbsData';
const errorInitialState = {
  name: '',
  description: '',
};
const CreateNewStage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentBreadCrumb, setCurrentBreadCrumb] = useState([]);
  const [state, setState] = useState({
    name: '',
    description: '',
    status: true,
  });
  const [errors, setErrors] = useState(errorInitialState);
  const [showModel, setShowModel] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [userId, setUserId] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [navigateOnSave, setNavigateOnSave] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const BreadcrumbsData = [
    ...AccountBreadCrumbsData,
    {
      label: id ? 'Edit Stage' : 'Create Stage',
      class: 'active-label',
      link: id
        ? `/system-configuration/tenant-admin/crm-admin/accounts/stages/${id}/edit`
        : '/system-configuration/tenant-admin/crm-admin/accounts/stages/create',
    },
  ];

  const handleConfirmArchive = async () => {
    try {
      const { data } = await archiveStageApi({ id: id });
      if (data.status === 204) {
        setModalPopUp(false);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
      } else {
        toast.error('Failed to archive', {
          autoClose: 3000,
        });
        setModalPopUp(false);
      }
    } catch (error) {
      toast.error(`${error?.data?.resopnse || 'Failed to archive'}`, {
        autoClose: 3000,
      });
      setModalPopUp(false);
    }

    setModalPopUp(false);
  };

  useEffect(() => {
    if (id) {
      fetchStage();
    }
    setCurrentBreadCrumb(BreadcrumbsData);
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setUserId(decodeToken?.id);
      }
    }
  }, [id]);

  const fetchStage = async () => {
    try {
      setEditLoading(true);
      const { data } = await getStageApi({ id });
      setState({
        id: data?.data?.id ? data?.data?.id : undefined,
        status: data?.data?.is_active ?? false,
        name: data?.data?.name ?? '',
        description: data?.data?.description ?? '',
      });
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
      navigate('/system-configuration/tenant-admin/crm-admin/accounts/stages');
    }
    setEditLoading(false);
  };

  const handleSubmit = async (saveFlag) => {
    if (!id && saveFlag === 0) {
      setNavigateOnSave(true);
    } else if (id && saveFlag === 0) {
      setNavigateOnSave(false);
    } else if (id && saveFlag === 1) {
      setNavigateOnSave(true);
    }
    try {
      addStagesSchema.validateSync(state, { abortEarly: false });
      setSaveLoading(true);
      if (id) {
        await updateStageApi({
          id,
          stage: {
            name: state?.name,
            description: state?.description,
            is_active: state?.status,
            created_by: Number(userId),
          },
        });
        // toast.success('Stage updated.')
        setShowModel(true);
        // if (close) {
        //   navigate(
        //     '/system-configuration/tenant-admin/crm-admin/accounts/stages'
        //   )
        // }
      } else {
        await createStageApi({
          stage: {
            name: state?.name,
            description: state?.description,
            is_active: state?.status,
            created_by: Number(userId),
          },
        });
        setShowModel(true);
        // toast.success('Stage created.')
        // navigate('/system-configuration/tenant-admin/crm-admin/accounts/stages')
      }
    } catch (error) {
      const errs = yupErrorHandler(error);
      if (errs) {
        setErrors({ ...errors, ...errs });
      }
    }
    setSaveLoading(false);
  };
  const handleChange = async (e) => {
    e.preventDefault();
    const { name, type } = e.target;
    let { value } = e.target;

    switch (name) {
      case 'name':
        if (value.length == 0) {
          setErrors({
            ...errors,
            [name]: 'Name is required.',
          });
        } else if (value.length > 50) {
          setErrors({
            ...errors,
            [name]: 'Maximum 50 characters are allowed',
          });
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            name: '',
          }));
        }
        break;
      case 'description':
        if (value.length == 0) {
          setErrors({
            ...errors,
            [name]: 'Description is required',
          });
        } else if (value.length > 500) {
          setErrors({
            ...errors,
            [name]: 'Maximum 500 characters are allowed',
          });
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            description: '',
          }));
        }
        break;
      default:
        break;
    }

    switch (type) {
      case 'checkbox':
        value = !state[name];
        break;
      default:
        break;
    }
    setState({ ...state, [name]: value });
    // setErrors({ ...errors, [name]: '' });
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={currentBreadCrumb}
        BreadCrumbsTitle={'Stage'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      {editLoading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginTop: '30px',
          }}
        >
          Fetching Data...
        </div>
      ) : (
        <>
          <div className="mainContentInner form-container">
            <form
              noValidate
              onSubmit={(e) => e.preventDefault()}
              className="mt-5"
            >
              <div className="formGroup">
                <h5>
                  {currentBreadCrumb[3]?.label === 'Edit Stage'
                    ? 'Edit Stage'
                    : 'Create New Stage'}
                </h5>
                <FormInput
                  name="name"
                  displayName="Name"
                  value={state.name}
                  error={errors.name}
                  // classes={{ root: "w-100" }}
                  required
                  onChange={handleChange}
                  maxLength={50}
                />

                <FormText
                  name="description"
                  displayName="Description"
                  value={state.description}
                  error={errors.description}
                  classes={{ root: 'w-100' }}
                  required
                  onChange={handleChange}
                  maxLength={500}
                />

                <FormToggle
                  name="status"
                  displayName={state.status ? 'Active' : 'Inactive'}
                  checked={state.status}
                  classes={{ root: 'pt-2' }}
                  handleChange={handleChange}
                />
              </div>
              <div className="form-footer">
                {id && (
                  <div
                    onClick={() => {
                      setModalPopUp(true);
                    }}
                    className="archived"
                  >
                    <span>Archive</span>
                  </div>
                )}

                <button
                  className="btn btn-secondary btn-border-none"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCloseModal(true);
                  }}
                >
                  Cancel
                </button>
                {id && (
                  <Button
                    type="submit"
                    className="btn btn-outlined"
                    loading={saveLoading}
                    onClick={() => handleSubmit(1)}
                  >
                    Save & Close
                  </Button>
                )}
                <Button
                  type="submit"
                  data-save="stay"
                  className="btn btn-primary"
                  loading={saveLoading}
                  onClick={() => handleSubmit(0)}
                >
                  {id ? 'Save Changes' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
      <SuccessPopUpModal
        title="Confirmation"
        message={'Are you sure you want to archive?'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={false}
        isArchived={true}
        archived={handleConfirmArchive}
      />
      <SuccessPopUpModal
        title="Success!"
        message={`Stage ${id ? 'updated' : 'created'}.`}
        modalPopUp={showModel}
        isNavigate={navigateOnSave}
        setModalPopUp={setShowModel}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/crm-admin/accounts/stages'
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message="Stage is archived."
        modalPopUp={archiveSuccess}
        isNavigate={true}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/crm-admin/accounts/stages'
        }
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={
          '/system-configuration/tenant-admin/crm-admin/accounts/stages'
        }
      />
    </div>
  );
};

export default CreateNewStage;
