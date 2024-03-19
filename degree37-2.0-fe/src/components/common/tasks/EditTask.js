/* eslint-disable */
import React, { useEffect, useState } from 'react';
// import TopBar from '../topbar/index';
import styles from './index.module.scss';
import SelectDropdown from '../selectDropdown';
import FormInput from '../form/FormInput';
import FormText from '../form/FormText';
import ReactDatePicker from 'react-datepicker';
import SuccessPopUpModal from '../successModal';
import CancelModalPopUp from '../cancelModal';
import moment from 'moment';
import { toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';
import { formatUser } from '../../../helpers/formatUser';
import FormFooter from '../FormFooter';

const EditTask = ({
  formHeading,
  assignedUserOptions,
  taskStatusOptions,
  taskEditData,
  tasksId,
  taskableType = null,
  taskableId = null,
  taskableIdName = null,
  taskListUrl,
  hideTopRefEdit,
}) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const jwt = jwtDecode(localStorage.getItem('token'));
  const [assignedToError, setAssignedToError] = useState('');
  const [assignedByError, setAssignedByError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [archiveStatus, setArchiveStatus] = useState(false);
  const [archiveModalPopUp, setArchiveModalPopUp] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const [errors, setErrors] = useState({
    task_name: '',
    description: '',
    due_date: '',
  });
  const [createTaskData, setCreateTaskData] = useState({
    assigned_to: null,
    assigned_by: null,
    task_name: '',
    description: '',
    due_date: '',
    status: null,
    taskable_id: '',
    taskable_type: '',
  });

  useEffect(() => {
    if (taskEditData) {
      const statusName = taskStatusOptions.find((name) => {
        return +name?.id === +taskEditData?.status;
      });
      let body = {
        ...taskEditData,
        assigned_to: {
          value: taskEditData?.assigned_to?.id,
          label: formatUser(taskEditData?.assigned_to, 1),
        },
        assigned_by: {
          value: taskEditData?.assigned_by?.id,
          label: formatUser(taskEditData?.assigned_by, 1),
        },
        status: {
          value: statusName?.id,
          label: statusName?.name,
        },
        taskable_id: {
          value: taskableId,
          label: taskableIdName,
        },
        taskable_type: {
          value: taskableType,
          label: taskableType,
        },
        due_date: moment(taskEditData?.due_date, 'YYYY-MM-DD').toDate(),
      };
      setCreateTaskData(body);
    }
  }, [taskEditData]);

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };
    switch (name) {
      case 'task_name':
        if (!value) {
          setError(name, 'Task name is required.');
        } else if (value.length > 50) {
          setError(name, 'Maximum 50 characters are allowed.');
        } else {
          setError(name, '');
        }
        break;
      case 'description':
        if (!value) {
          setError(name, 'Description is required.');
        } else {
          setError(name, '');
        }
        break;
      case 'due_date':
        if (!createTaskData.due_date) {
          setError(name, 'Due date is required.');
        } else {
          setError(name, '');
        }
        break;
      default:
        break;
    }
  };

  const handleAssignToDropdownFocus = () => {
    if (!createTaskData.assigned_to) {
      setAssignedToError('Assigned to is required.');
    }
  };

  const handleAssignByDropdownFocus = () => {
    if (!createTaskData.assigned_by) {
      setAssignedByError('Assigned by is required.');
    }
  };

  const handleStatusDropdownFocus = () => {
    if (!createTaskData.status) {
      setStatusError('Status is required.');
    }
  };

  const handleFormInput = (e) => {
    const { name, value } = e.target;
    if (name === 'task_name' || name === 'description' || name === 'due_date') {
      if (
        (name === 'task_name' && value?.length > 50) ||
        (name === 'description' && value?.length > 500)
      ) {
        return;
      }

      setCreateTaskData({ ...createTaskData, [name]: value });
    }
  };

  const handleChangeSelectAssignTo = (val) => {
    if (!val) {
      setAssignedToError('Assigned to is required.');
      setCreateTaskData({ ...createTaskData, assigned_to: null });
    } else {
      setAssignedToError('');
      setCreateTaskData({ ...createTaskData, assigned_to: val });
    }
  };
  const handleChangeSelectAssignBy = (val) => {
    if (!val) {
      setAssignedByError('Assigned by is required.');
      setCreateTaskData({ ...createTaskData, assigned_by: null });
    } else {
      setAssignedByError('');
      setCreateTaskData({ ...createTaskData, assigned_by: val });
    }
  };
  const handleChangeSelectStatus = (val) => {
    if (!val) {
      setStatusError('Status is required.');
      setCreateTaskData({ ...createTaskData, status: null });
    } else {
      setStatusError('');
      setCreateTaskData({ ...createTaskData, status: val });
    }
  };

  let isDisabled =
    createTaskData.assigned_to &&
    createTaskData.assigned_by &&
    createTaskData.task_name &&
    createTaskData.description &&
    createTaskData.due_date &&
    !errors.task_name &&
    !errors.description &&
    !errors.due_date &&
    !assignedToError &&
    !assignedByError &&
    !statusError;

  isDisabled = Boolean(isDisabled);

  const handleSubmit = async () => {
    if (!createTaskData.assigned_by) {
      setAssignedByError('Assigned by is required.');
    }
    if (!createTaskData.assigned_to) {
      setAssignedToError('Assigned to is required.');
    }
    if (!createTaskData.task_name) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        task_name: 'Task name is required.',
      }));
    }
    if (!createTaskData.description) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: 'Description is required.',
      }));
    }
    if (!createTaskData.due_date) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        due_date: 'Due date is required.',
      }));
    }
    if (!createTaskData.status) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        status: 'Status is required.',
      }));
    }
    if (isDisabled) {
      const formattedDate = new Date(
        createTaskData.due_date
      ).toLocaleDateString('en-US');
      const accessToken = localStorage.getItem('token');
      let body = {
        ...createTaskData,
        due_date: formattedDate,
        assigned_to: +createTaskData?.assigned_to?.value,
        assigned_by: +createTaskData?.assigned_by?.value,
        taskable_id: +createTaskData?.taskable_id?.value,
        taskable_type: createTaskData?.taskable_type?.value,
        status: +createTaskData.status?.value,
      };
      if (!taskableId && !taskableType) {
        delete body.taskable_id;
        delete body.taskable_type;
      }
      let queryParams = '';
      if (taskableType && taskableId) {
        queryParams = `?taskable_type=${taskableType}&taskable_id=${taskableId}`;
      }
      try {
        const response = await fetch(
          `${BASE_URL}/tasks/${tasksId}${queryParams}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
          }
        );
        let data = await response.json();
        if (data?.status === 'success') {
          setModalPopUp(true);
        } else if (response?.status === 400) {
          toast.error(`${data?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
        } else {
          toast.error(`${data?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };

  const saveAndClose = async () => {
    setIsNavigate(true);
    await handleSubmit();
  };
  const saveChanges = async () => {
    await handleSubmit();
  };
  const handleArchive = async () => {
    const accessToken = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/tasks/archive/${tasksId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    });
    let data = await response.json();
    setArchiveModalPopUp(false);
    if (data.status === 'success') {
      setArchiveStatus(true);
    } else {
      toast.error('Failed to Archive Task.');
    }
  };
  return (
    <>
      <div className="mainContentInner">
        <form className={styles.formcontainer}>
          <div className="formGroup">
            <h5 className={styles.heading}>{formHeading}</h5>
            {taskableType && taskableId && !hideTopRefEdit ? (
              <>
                <SelectDropdown
                  placeholder="Associated With*"
                  name="taskable_type"
                  searchable={false}
                  showLabel={true}
                  disabled={true}
                  removeTheClearCross={true}
                  removeDivider={true}
                  selectedValue={createTaskData.taskable_type}
                  defaultValue={createTaskData.taskable_type}
                  required={true}
                />
                <SelectDropdown
                  placeholder="Reference*"
                  name="taskable_id"
                  searchable={false}
                  showLabel={true}
                  disabled={true}
                  removeTheClearCross={true}
                  removeDivider={true}
                  selectedValue={createTaskData.taskable_id}
                  defaultValue={createTaskData.taskable_id}
                  required={true}
                />
              </>
            ) : (
              ''
            )}

            <SelectDropdown
              label="Assigned To*"
              options={
                assignedUserOptions?.length
                  ? assignedUserOptions.map((item) => ({
                      value: item?.id,
                      label: `${item?.first_name ? item?.first_name : ''} ${
                        item.last_name ? item?.last_name : ''
                      }`,
                    }))
                  : []
              }
              selectedValue={createTaskData.assigned_to}
              onChange={handleChangeSelectAssignTo}
              removeDivider
              showLabel
              error={assignedToError}
              onBlur={(e) => handleInputBlur(e, true)}
              onFocus={handleAssignToDropdownFocus}
              placeholder="Assigned To*"
            />
            <SelectDropdown
              label="Assigned By*"
              options={assignedUserOptions.map((item) => ({
                value: item?.id,
                label: `${item?.first_name ? item?.first_name : ''} ${
                  item.last_name ? item?.last_name : ''
                }`,
              }))}
              defaultValue={createTaskData.assigned_by}
              disabled={
                +jwt?.id === +createTaskData?.created_by?.id ? false : true
              }
              selectedValue={createTaskData.assigned_by}
              onChange={handleChangeSelectAssignBy}
              removeDivider
              showLabel
              error={assignedByError}
              onBlur={(e) => handleInputBlur(e, true)}
              onFocus={handleAssignByDropdownFocus}
              placeholder="Assigned By*"
            />
            <FormInput
              name="task_name"
              displayName="Task Name"
              value={createTaskData.task_name}
              error={errors.task_name}
              onBlur={handleInputBlur}
              // classes={{ root: "w-100" }}
              disabled={
                +jwt?.id === +createTaskData?.created_by?.id ? false : true
              }
              required
              onChange={handleFormInput}
            />
            <FormText
              name="description"
              displayName="Description"
              value={createTaskData.description}
              error={errors.description}
              classes={{ root: 'w-100' }}
              onBlur={handleInputBlur}
              required
              onChange={handleFormInput}
            />
            <div
              className="form-field"
              // style={{ marginTop: '56px' }}
            >
              <div className="field">
                {createTaskData?.due_date ? (
                  <label
                    style={{
                      fontSize: '12px',
                      top: '24%',
                      color: '#555555',
                      zIndex: 1,
                    }}
                  >
                    Due Date*
                  </label>
                ) : (
                  ''
                )}
                <ReactDatePicker
                  wrapperClassName={styles.secondDate}
                  minDate={new Date()}
                  dateFormat="MM/dd/yyyy"
                  className={`custom-datepicker ${styles.datepicker} ${
                    createTaskData?.due_date ? '' : ''
                  }`}
                  placeholderText="Due Date*"
                  disabled={
                    +jwt?.id === +createTaskData?.created_by?.id ? false : true
                  }
                  selected={createTaskData.due_date}
                  onChange={(date) => {
                    setCreateTaskData({ ...createTaskData, due_date: date });
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      due_date: '',
                    }));
                  }}
                  onBlur={(date) => {
                    handleInputBlur({
                      target: { value: date, name: 'due_date' },
                    });
                  }}
                />
              </div>
              {errors.due_date && (
                <div className={`error ml-1`}>
                  <p>{errors.due_date}</p>
                </div>
              )}
            </div>
            <SelectDropdown
              label="Select Status*"
              options={taskStatusOptions.map((item) => ({
                value: item?.id,
                label: `${item?.name}`,
              }))}
              defaultValue={createTaskData.status}
              selectedValue={createTaskData.status}
              onChange={handleChangeSelectStatus}
              removeDivider
              showLabel
              error={statusError}
              onBlur={(e) => handleInputBlur(e, true)}
              onFocus={handleStatusDropdownFocus}
              placeholder="Select Status*"
            />
            {/* <SelectDropdown
              placeholder="Select Status"
              options={taskStatusOptions.map((item) => ({
                value: item?.id,
                label: `${item?.name}`,
              }))}
              name="status"
              searchable={false}
              showLabel={true}
              removeTheClearCross={true}
              removeDivider={true}
              defaultValue={createTaskData.status}
              selectedValue={createTaskData.status}
              onChange={handleChangeSelectStatus}
            /> */}
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
            type="button"
            className={` btn btn-md mb-0 btn-primary ${styles.createbtn}
              ${!isDisabled ? ` btn-secondary` : 'btn-primary'}
            `}
            onClick={handleSubmit}
            disabled={!isDisabled}
          >
            Create
          </button>
        </div>
        <FormFooter
          enableArchive={true}
          onClickArchive={() => setArchiveModalPopUp(true)}
          enableCancel={true}
          onClickCancel={(e) => {
            e.preventDefault();
            setCloseModal(true);
          }}
          enableSaveAndClose={true}
          onClickSaveAndClose={saveAndClose}
          enableSaveChanges={true}
          onClickSaveChanges={saveChanges}
        />
      </div>
      <SuccessPopUpModal
        title={'Success!'}
        message={'Task updated.'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        isNavigate={isNavigate}
        redirectPath={-1}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost. Do you want to continue?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={taskListUrl}
      />
      <SuccessPopUpModal
        title="Confirmation"
        message={'Are you sure you want to archive?'}
        modalPopUp={archiveModalPopUp}
        setModalPopUp={setArchiveModalPopUp}
        showActionBtns={false}
        isArchived={true}
        archived={handleArchive}
      />
      <SuccessPopUpModal
        title="Success!"
        message={'Task is archived.'}
        modalPopUp={archiveStatus}
        showActionBtns
        isArchived={false}
        isReplace={true}
        isNavigate
        redirectPath={taskListUrl}
        setModalPopUp={setArchiveStatus}
      />
    </>
  );
};

export default EditTask;
