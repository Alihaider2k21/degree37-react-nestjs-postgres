import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import FormInput from '../../../../users-administration/users/FormInput';
import FormText from '../../../../../common/form/FormText';
import SuccessPopUpModal from '../../../../../common/successModal';
import ConfirmModal from '../../../../../common/confirmModal';
import {
  CreateBreadCrumbs,
  EditBreadcrumbsData,
  formValidation,
} from './components/data';
import TopBar from '../../../../../common/topbar/index';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import ConfirmArchiveIcon from '../../../../../../assets/images/ConfirmArchiveIcon.png';

const roomInitialState = {
  name: null,
  description: null,
  is_active: true,
};

const CreateUpdateForm = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const bearerToken = localStorage.getItem('token');
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showModalWitoutNavigate, setShowModalWitoutNavigate] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [showCancelConfirmationDialog, setShowCancelConfirmationDialog] =
    useState(false);
  const [room, setRoom] = useState(roomInitialState);
  const [errors, setErrors] = useState({});
  const [createdBy, setCreatedBy] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const errorValidation = (data = room) => {
    const validation = formValidation(data);
    if (Object?.keys(validation)?.length > 0) {
      setErrors({ ...errors, ...validation });
    }
  };
  console.log({ errors });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRoom({ ...room, [name]: value });
    if (Object?.keys(errors)?.length > 0) {
      if (Object?.prototype?.hasOwnProperty?.call(errors, name))
        delete errors[name];
    }
    errorValidation({ [name]: value });
  };
  const handleSubmit = async (e, withoutNavigation) => {
    e.preventDefault();
    errorValidation();
    if (!room.name || !room.description) {
      return;
    }
    let result;
    let body = {
      name: room?.name,
      description: room?.description,
      is_active: room?.is_active,
      is_archived: false,
    };
    setIsLoading(true);
    if (id) {
      result = await fetch(BASE_URL + `/room-size/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        method: 'PUT',
        body: JSON.stringify({
          ...body,
          created_by: +createdBy,
        }),
      });
    } else
      result = await fetch(BASE_URL + '/room-size/create', {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
        method: 'POST',
        body: JSON.stringify({ ...body }),
      });
    const data = await result.json();
    if (data?.status === 201 || data?.status === 'success') {
      setErrors({});
      if (id) {
        if (withoutNavigation) setShowSuccessMessage(true);
        else setShowModalWitoutNavigate(true);
        getData();
      } else {
        setShowSuccessMessage(true);
        setRoom(roomInitialState);
      }
    } else
      toast.error(
        `Error with statusCode:${data?.statusCode} \n${
          data?.message?.length > 0 ? data?.message[0] : ''
        } `,
        {
          autoClose: 3000,
        }
      );
    setTimeout(() => {
      setIsLoading(false);
    }, 30000);
  };

  const archiveRoom = async (popUp) => {
    popUp(false);
    try {
      const result = await fetch(`${BASE_URL}/room-size/archive/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ created_by: +createdBy }),
      });
      const data = await result.json();
      if (data?.status_code === 204) {
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
      } else {
        toast.error(`Error while archiving`, data?.message);
      }
    } catch (error) {
      toast.error(`Error while archiving: ${error}`);
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    if (room?.name || room?.description) {
      setShowCancelConfirmationDialog(true);
    } else {
      navigate(
        '/system-configuration/tenant-admin/crm-admin/locations/room-size'
      );
    }
  };

  const getData = async () => {
    try {
      const result = await fetch(`${BASE_URL}/room-size/${id}`, {
        headers: {
          authorization: `Bearer ${bearerToken}`,
        },
        method: 'GET',
      });
      const data = await result.json();
      setRoom({
        name: data?.name,
        description: data?.description,
        is_active: data?.is_active,
      });
      setCreatedBy(data?.created_by?.id);
    } catch (error) {
      toast.error(`Error with statusCode:${error}`, {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  return (
    <>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={id ? EditBreadcrumbsData : CreateBreadCrumbs}
          BreadCrumbsTitle={'Room Sizes'}
        />
        <div className="mainContentInner form-container">
          {/* <div className="d-flex justify-content-center align-items-center h-100"> */}
          <form className="mt-5">
            <div className="formGroup">
              <h5>{id ? 'Update' : 'Create'} Room Size</h5>
              <div className="form-field">
                <div className="field">
                  <FormInput
                    label="Name"
                    name="name"
                    required
                    isWidth={true}
                    value={room?.name}
                    onChange={handleChange}
                    error={errors.name}
                    maxLength={50}
                  />
                </div>
              </div>

              <FormText
                name="description"
                displayName="Description"
                value={room?.description}
                error={errors.description}
                classes={{ root: 'w-100' }}
                required
                onChange={handleChange}
                maxLength={500}
              />
              <div className="form-field checkbox">
                <span className="toggle-text">
                  {room.is_active ? 'Active' : 'Inactive'}
                </span>
                <label htmlFor="toggle" className="switch">
                  <input
                    type="checkbox"
                    id="toggle"
                    className="toggle-input"
                    name="is_active"
                    checked={room?.is_active}
                    defaultChecked={room?.is_active}
                    onChange={(e) =>
                      setRoom({
                        ...room,
                        is_active: e.target.checked,
                      })
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </form>
          <div className={`global-form-footer`}>
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
            <div className="d-flex">
              <button
                className="btn btn-secondary border-0"
                onClick={(e) => handleCancelClick(e)}
              >
                Cancel
              </button>
              {id ? (
                <>
                  <button
                    disabled={isLoading}
                    className="btn btn-secondary"
                    onClick={(e) => handleSubmit(e, true)}
                  >
                    Save & Close
                  </button>
                </>
              ) : null}

              <button
                type="button"
                disabled={isLoading}
                className={` ${`btn btn-primary`}`}
                onClick={(e) => handleSubmit(e)}
              >
                {id ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
      <SuccessPopUpModal
        title="Success!"
        message={`Room ${id ? 'updated' : 'created'}.`}
        modalPopUp={showSuccessMessage}
        isNavigate={true}
        redirectPath={-1}
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setShowSuccessMessage}
      />
      <SuccessPopUpModal
        title="Success!"
        message={`Room ${id ? 'updated' : 'created'}.`}
        modalPopUp={showModalWitoutNavigate}
        showActionBtns={true}
        isNavigate={true}
        isArchived={false}
        setModalPopUp={setShowModalWitoutNavigate}
      />

      <ConfirmModal
        showConfirmation={showConfirmationDialog}
        onCancel={() => setShowConfirmationDialog(false)}
        onConfirm={() => archiveRoom(setShowConfirmationDialog)}
        icon={ConfirmArchiveIcon}
        heading={'Confirmation'}
        description={
          'Are you sure to archive the room size? It can not be undone'
        }
      />
      <ConfirmModal
        showConfirmation={showCancelConfirmationDialog}
        onCancel={() => setShowCancelConfirmationDialog(false)}
        onConfirm={() =>
          navigate(
            '/system-configuration/tenant-admin/crm-admin/locations/room-size'
          )
        }
        icon={CancelIconImage}
        heading={'Confirmation'}
        description={'Unsaved changes will be lost, do you wish to proceed?'}
      />
      <SuccessPopUpModal
        title="Confirmation"
        message={'Are you sure want to archive?'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={false}
        isArchived={true}
        archived={() => archiveRoom(setModalPopUp)}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Room Size is archived."
        modalPopUp={archiveSuccess}
        isNavigate={true}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/crm-admin/locations/room-size'
        }
      />
    </>
  );
};

export default CreateUpdateForm;
