import React, { useEffect, useState } from 'react';
// import TopBar from '../topbar/index';
import styles from './index.module.scss';
import SelectDropdown from '../selectDropdown';
import FormInput from '../form/FormInput';
import FormText from '../form/FormText';
import ReactDatePicker from 'react-datepicker';
import SuccessPopUpModal from '../successModal';
import CancelModalPopUp from '../cancelModal';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode';
import { formatUser } from '../../../helpers/formatUser';
import FormFooter from '../FormFooter';

const CreateTask = ({
  formHeading,
  assignedUserOptions,
  taskStatusOptions,
  taskableType = null,
  taskableId = null,
  taskListUrl,
}) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [assignedToError, setAssignedToError] = useState('');
  const [assignedByError, setAssignedByError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
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
    status: {
      value: taskStatusOptions[0]?.id,
      label: taskStatusOptions[0]?.name,
    },
  });

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    const decodeToken = jwt(jwtToken);
    const selectedAssignedBy = assignedUserOptions.find((item) => {
      return +item.id === +decodeToken.id;
    });
    if (selectedAssignedBy) {
      setCreateTaskData({
        ...createTaskData,
        assigned_by: {
          value: selectedAssignedBy?.id,
          label: formatUser(selectedAssignedBy, 1),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignedUserOptions]);

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
      setLoading(true);
      const formattedDate = new Date(
        createTaskData.due_date
      ).toLocaleDateString('en-US');
      const accessToken = localStorage.getItem('token');
      let body = {
        ...createTaskData,
        due_date: formattedDate,
        assigned_to: +createTaskData?.assigned_to?.value,
        assigned_by: +createTaskData?.assigned_by?.value,
        status: +createTaskData.status?.value,
      };
      console.log('taskableType', taskableType, 'taskableId', taskableId);
      let queryParams = '';
      if (taskableType && taskableId) {
        queryParams = `?taskable_type=${taskableType}&taskable_id=${taskableId}`;
      }
      try {
        const response = await fetch(`${BASE_URL}/tasks${queryParams}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        });
        let data = await response.json();
        setTimeout(() => {
          setLoading(false);
        }, 10000);
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
        setLoading(false);
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };
  return (
    <>
      <div className="mainContentInner">
        <form className={styles.formcontainer}>
          <div className="formGroup">
            <h5 className={styles.heading}>{formHeading}</h5>
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
          </div>
        </form>
        <FormFooter
          enableCancel={true}
          onClickCancel={(e) => {
            e.preventDefault();
            setCloseModal(true);
          }}
          enableCreate={true}
          onCreateType={'submit'}
          onClickCreate={handleSubmit}
          disabled={loading}
        />
      </div>
      <SuccessPopUpModal
        title={'Success!'}
        message={'Task created.'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        isNavigate={true}
        redirectPath={taskListUrl}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost. Do you want to continue?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={taskListUrl}
      />
    </>
  );
};

export default CreateTask;
