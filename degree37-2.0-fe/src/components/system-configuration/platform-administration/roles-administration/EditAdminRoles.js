/* eslint-disable */
import React, { useState, useEffect } from 'react';
import TopBar from '../../../common/topbar/index';
import { useNavigate, useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import styles from './addAdminRole.module.scss';
import SuccessPopUpModal from '../../../common/successModal';
import { toast } from 'react-toastify';
import CancelIconImage from '../../../../assets/images/ConfirmCancelIcon.png';
import CancelModalPopUp from '../../../common/cancelModal';
import axios from 'axios';

const EditAdminRoles = () => {
  const navigate = useNavigate();
  const [sendData, setSendData] = useState({});
  const [permissions, setPermissions] = useState();
  const [showModel, setShowModel] = useState(false);
  const [formSetting, setFormSetting] = useState();
  const [formSettingVar, setFormSettingVar] = useState();
  const [array, setArray] = useState([]);
  const [isArchived, setIsArchived] = useState(false);
  const [buttonWorking, setButtonWorking] = useState(true);
  const [close, setClose] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [errors, setErrors] = useState({ role_name: '' });
  const bearerToken = localStorage.getItem('token');

  const getDataByid = async (req, res) => {
    try {
      const response = await axios.get(`${BASE_URL}/roles/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      const data = await response.data;
      if (data?.status_code === 200) {
        setFormSetting(data?.data?.permission?.application);
        setFormSettingVar(data?.data);
      } else {
        toast.error(`${data?.message}`, { autoClose: 3000 });
      }
    } catch (err) {
      toast.error(`${err}`, { autoClose: 3000 });
    }
  };

  useEffect(() => {
    getDataByid();
  }, [id]);

  useEffect(() => {
    getAllPermissions();
  }, []);

  const getAllPermissions = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/permissions?isSuperAdminPermission=true`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = await res?.data;
      if (res.status === 200) {
        setPermissions(data.data);
      } else {
        toast.error(`${data?.message}`, { autoClose: 3000 });
      }
    } catch (err) {
      toast.error(`${err}`, { autoClose: 3000 });
    }
  };

  useEffect(() => {
    if (
      sendData?.name &&
      (!/^[a-zA-Z\s]+$/.test(sendData?.name) || sendData?.name.trim() === '')
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role_name: 'Only alphabets are allowed in role name',
      }));
      setButtonWorking(true);
    } else if (sendData?.name?.length > 50) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role_name: 'Maximum 50 characters are allowed',
      }));
      setButtonWorking(true);
    } else if (sendData?.name && array.length > 0) {
      setErrors({});
      setButtonWorking(false);
    } else {
      setErrors({});
      setButtonWorking(true);
    }
  }, [sendData, array]);

  const saveData = async (sendData, array, EditedBy) => {
    const data = {
      ...sendData,
      ['permissions']: [...array],
      ['created_by']: EditedBy,
    };

    try {
      const response = await axios.patch(`${BASE_URL}/roles/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      const data2 = await response.data;
      if (data2?.status_code === 200) {
        setShowModel(true);
      } else {
        toast.error(`${data2?.message}`, { autoClose: 3000 });
      }
    } catch (err) {
      toast.error(`${err}`, { autoClose: 3000 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = jwtDecode(localStorage.getItem('token'));
    const uniqueNumbersSet = new Set(array);
    const uniqueNumbersArray = Array.from(uniqueNumbersSet);
    setArray(uniqueNumbersArray);
    saveData(sendData, uniqueNumbersArray, parseInt(user?.id, 10));
  };

  const BreadcrumbsData = [
    { label: 'System Configuration', class: 'disable-label', link: '/' },
    {
      label: 'Roles Administration',
      class: 'active-label',
      link: '/system-configuration/platform-admin/roles-admin',
    },
    {
      label: 'Edit New Role',
      class: 'disable-label',
      link: `/system-configuration/platform-admin/roles/${id}/Edit`,
    },
  ];

  let stems = [];
  const getAllData = () => {
    formSetting?.length > 0 &&
      formSetting?.map((item, index) => {
        if (item?.modules || item?.modules?.length > 0) {
          iteration(item?.modules);
        }
      });
  };
  const iteration = (child) => {
    child?.length > 0 &&
      child?.map((item, index) => {
        if (item?.permissions?.length > 0) {
          item?.permissions?.map((per, indexing) => {
            stems.push(per.code);
          });
        } else {
          iteration(item?.child_modules);
        }
      });
  };
  useEffect(() => {
    getAllData();
    setArray(stems);
    setSendData((pre) => ({ ...pre, ['name']: formSettingVar?.name }));
    setSendData((pre) => ({
      ...pre,
      ['description']: formSettingVar?.description,
    }));
  }, [formSetting?.length > 0 && formSettingVar]);

  const InsertReadPermission = (permission, id, name, checked = true) => {
    setArray('');
    if (checked) {
      if (name === 'Write') {
        let temp = [...array];
        for (let per of permission) {
          if (per.name === 'Read') {
            temp = [...temp, per.code];
            setArray(temp);
          }
          if (per.name === 'Write') {
            temp = [...temp, id];
            setArray(temp);
          }
        }
      }
      if (name === 'Read') {
        let temp = [...array];
        temp = [...temp, id];
        setArray(temp);
      }
      if (name === 'Archive') {
        let temp = [...array];
        for (let per of permission) {
          if (per.name === 'Read') {
            temp = [...temp, per.code];
            // temp.push(per.code)
            setArray(temp);
          }
          if (per.name === 'Archive') {
            temp = [...temp, id];
            // temp.push(per.code)
            setArray(temp);
          }
        }
      }
      if (name === 'Add Config') {
        let temp = [...array];
        for (let per of permission) {
          if (per.name === 'Add Config') {
            temp = [...temp, per.code];
            setArray(temp);
          }
          if (per.name === 'Read') {
            temp = [...temp, per.code];
            setArray(temp);
          }
        }
      }
      if (name === 'Login as Tenant') {
        let temp = [...array];
        for (let per of permission) {
          if (per.name === 'Login as Tenant') {
            temp = [...temp, per.code];
            setArray(temp);
          }
          if (per.name === 'Read') {
            temp = [...temp, per.code];
            setArray(temp);
          }
        }
      }
      if (name === 'Update Password') {
        let temp = [...array];
        for (let per of permission) {
          if (per.name === 'Update Password') {
            temp = [...temp, per.code];
            setArray(temp);
          }
          if (per.name === 'Read') {
            temp = [...temp, per.code];
            setArray(temp);
          }
        }
      }
    } else {
      if (name === 'Read') {
        let temp = [...array];
        temp = temp.filter((child) => child !== id);
        for (let per of permission) {
          if (per.name === 'Write') {
            temp = temp.filter((child) => child !== per.code);
            setArray(temp);
          }
          if (per.name === 'Archive') {
            temp = temp.filter((child) => child !== per.code);
            setArray(temp);
          }
          if (per.name === 'Add Config') {
            temp = temp.filter((child) => child !== per.code);
            setArray(temp);
          }
          if (per.name === 'Login as Tenant') {
            temp = temp.filter((child) => child !== per.code);
            setArray(temp);
          }
          if (per.name === 'Update Password') {
            temp = temp.filter((child) => child !== per.code);
            setArray(temp);
          }
        }
      }
    }
  };

  const recursiveFunction = (child) => {
    return (
      <>
        {child?.child_modules?.length > 0 ? (
          child?.child_modules?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                {item?.permissions && item?.permissions?.length > 0 && (
                  <div className="w-100">
                    <p> {item.name}</p>
                  </div>
                )}

                {item?.permissions &&
                  item?.permissions?.length > 0 &&
                  item?.permissions?.map((per, index) => {
                    return (
                      <>
                        <div>
                          <div className="form-field checkbox w-100">
                            <span className="toggle-text">{per.name}</span>
                            <label htmlFor={`${per.code}`} className="switch">
                              <input
                                style={{ width: '50px' }}
                                key={item.code}
                                type="checkbox"
                                id={`${per.code}`}
                                className="toggle-input"
                                name={per.name}
                                checked={
                                  array.includes(per.code) ? true : false
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    InsertReadPermission(
                                      child.permissions,
                                      per.code,
                                      per.name
                                    );
                                  } else if (per.name === 'Read') {
                                    InsertReadPermission(
                                      child.permissions,
                                      per.code,
                                      per.name,
                                      false
                                    );
                                  } else {
                                    const newArray = array.filter(
                                      (child) => child !== per.code
                                    );
                                    setArray(newArray);
                                  }
                                }}
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                        </div>
                      </>
                    );
                  })}
                {item?.child_modules?.length > 0 && recursiveFunction(item)}
              </React.Fragment>
            );
          })
        ) : (
          <React.Fragment>
            {child?.permissions && child?.permissions?.length > 0 && (
              <div className="w-100">
                <p> {child.name}</p>
              </div>
            )}
            {child?.permissions &&
              child?.permissions?.length > 0 &&
              child?.permissions?.map((per, index) => {
                return (
                  <>
                    <div>
                      <div className="form-field checkbox w-100">
                        <span className="toggle-text">{per.name}</span>
                        <label htmlFor={`${per.code}`} className="switch">
                          <input
                            // style={{ width: "50px" }}
                            key={child.code}
                            type="checkbox"
                            id={`${per.code}`}
                            className="toggle-input"
                            checked={array.includes(per.code) ? true : false}
                            name={per.name}
                            onChange={(e) => {
                              if (e.target.checked) {
                                InsertReadPermission(
                                  child.permissions,
                                  per.code,
                                  per.name
                                );
                              } else if (per.name === 'Read') {
                                InsertReadPermission(
                                  child.permissions,
                                  per.code,
                                  per.name,
                                  false
                                );
                              } else {
                                const newArray = array.filter(
                                  (child) => child !== per.code
                                );
                                setArray(newArray);
                              }
                            }}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  </>
                );
              })}

            {child?.child_modules?.length > 0 && recursiveFunction(child)}
          </React.Fragment>
        )}
      </>
    );
  };

  const archiveApi = async () => {
    const data = { is_archived: true };

    try {
      const response = await axios.patch(
        `${BASE_URL}/roles/archive/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data2 = await response?.data;
      if (data2?.status_code === 200) {
        setIsArchived(true);
        setShowModel(true);
      } else {
        toast.error(`${data2?.message}`, { autoClose: 3000 });
      }
    } catch (err) {
      toast.error(`${err}`, { autoClose: 3000 });
    }
  };

  const handleCancelClick = () => {
    setShowConfirmationDialog(true);
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate('/system-configuration/platform-admin/roles-admin');
    }
  };
  return (
    <div className="mainContent">
      {showModel === true && close === true ? (
        <SuccessPopUpModal
          title="Success!"
          message="Role updated."
          modalPopUp={showModel}
          isNavigate={true}
          setModalPopUp={setShowModel}
          showActionBtns={true}
          redirectPath={'/system-configuration/platform-admin/roles-admin'}
        />
      ) : null}
      {showModel === true && close === false ? (
        <SuccessPopUpModal
          title="Success!"
          message="Role updated."
          modalPopUp={showModel}
          isNavigate={true}
          setModalPopUp={setShowModel}
          showActionBtns={true}
          // redirectPath={'/system-configuration/platform-admin/roles-admin'}
        />
      ) : null}
      {isArchived === true ? (
        <SuccessPopUpModal
          title="Success!"
          message="Role is archived"
          modalPopUp={showModel}
          isNavigate={true}
          setModalPopUp={setShowModel}
          showActionBtns={true}
          redirectPath={'/system-configuration/platform-admin/roles-admin'}
        />
      ) : null}
      {
        <CancelModalPopUp
          title="Confirmation"
          message="Unsaved changes will be lost, do you wish to proceed?"
          modalPopUp={closeModal}
          isNavigate={true}
          setModalPopUp={setCloseModal}
          redirectPath={'/system-configuration/platform-admin/roles-admin'}
        />
      }

      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Edit New Role'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <form className={styles.addAdminRoles}>
          <div className="formGroup">
            <h5>Edit New Role</h5>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder=" "
                  onChange={(e) => {
                    setSendData((pre) => ({
                      ...pre,
                      ['name']: e.target.value,
                    }));
                  }}
                  required
                  value={sendData?.name}
                />

                <label>Role Name*</label>
                {errors.role_name && (
                  <div className="error">
                    <p>{errors.role_name}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="form-field w-100">
              <div className="field">
                <textarea
                  type="text"
                  className="form-control textarea"
                  placeholder="Role Details (Optional)"
                  name="description"
                  onChange={(e) => {
                    setSendData((pre) => ({
                      ...pre,
                      ['description']: e.target.value,
                    }));
                  }}
                  value={sendData?.description}
                />
              </div>
            </div>
            <h5>Permissions Legend</h5>
            <h6>Read</h6>
            <p>View listing, searching, details and etc.</p>
            <h6>Write</h6>
            <p>Add, Update operation.</p>
            <h6>Archive</h6>
            <p>Archive item/object.</p>
          </div>

          <div className={`${styles.permissions} formGroup`}>
            <h5>Permissions</h5>
            {permissions &&
              permissions?.application?.length > 0 &&
              permissions?.application?.map((item, index) => {
                return (
                  <>
                    {item?.modules &&
                      item?.modules?.length > 0 &&
                      item?.modules?.map((item, index) => {
                        return recursiveFunction(item);
                      })}
                  </>
                );
              })}
          </div>
        </form>

        <section
          className={`popup full-section ${
            showConfirmationDialog ? 'active' : ''
          }`}
        >
          <div className="popup-inner">
            <div className="icon">
              <img src={CancelIconImage} alt="CancelIcon" />
            </div>
            <div className="content">
              <h3>Confirmation</h3>
              <p>Unsaved changes will be lost. Do you want to continue?</p>
              <div className="buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleConfirmationResult(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    handleConfirmationResult(true);
                    setCloseModal(true);
                  }}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </section>
        <div className={styles.addAdminRoles}>
          <div className="form-footer">
            <span
              onClick={(e) => {
                e.preventDefault();
                archiveApi();
              }}
              className={`${styles.errorcolor} ${styles.footertext}`}
            >
              Archive
            </span>
            <button
              className={`btn btn-secondary ${styles.bordercolor}`}
              onClick={handleCancelClick}
            >
              Cancel
            </button>

            <button
              type="button"
              className={` ${
                buttonWorking ? `btn btn-primary` : `btn btn-secondary`
              }`}
              onClick={(e) => {
                handleSubmit(e);
                setClose(true);
              }}
              disabled={buttonWorking}
            >
              Save & Close
            </button>
            <button
              type="button"
              className={` ${
                buttonWorking ? `btn btn-secondary` : `btn btn-primary`
              }`}
              onClick={handleSubmit}
              disabled={buttonWorking}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAdminRoles;
