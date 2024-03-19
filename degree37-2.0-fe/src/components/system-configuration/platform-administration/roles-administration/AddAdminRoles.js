import React, { useState, useEffect } from 'react';
import TopBar from '../../../common/topbar/index';
import jwtDecode from 'jwt-decode';
import styles from './addAdminRole.module.scss';
import SuccessPopUpModal from '../../../common/successModal';
import { toast } from 'react-toastify';
import CancelModalPopUp from '../../../common/cancelModal';
import axios from 'axios';

const AddAdminRoles = () => {
  const [sendData, setSendData] = useState({});
  const [permissions, setPermissions] = useState();
  const [showModel, setShowModel] = useState(false);
  const [array, setArray] = useState([]);
  const [buttonWorking, setButtonWorking] = useState(true);
  const [closeModal, setCloseModal] = useState(false);
  const [errors, setErrors] = useState({ role_name: '' });
  const bearerToken = localStorage.getItem('token');
  const BASE_URL = process.env.REACT_APP_BASE_URL;

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
      const data = await res.data; // Resolve the promise to get the data
      if (res.status === 200) {
        setPermissions(data.data); // Assuming the actual array of permissions is in data.data
      } else {
        toast.error(`${data?.message}`, { autoClose: 3000 });
      }
    } catch (err) {
      console.error('Error:', err);
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

  const saveData = async (sendData, array, createdBy) => {
    const data = {
      ...sendData,
      permissions: [...array],
      created_by: createdBy,
    };
    try {
      const response = await axios.post(`${BASE_URL}/roles`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
      });

      if (response.status === 201) {
        setShowModel(true);
      } else {
        const data = await response?.data;
        toast.error(`${data?.message}`, { autoClose: 3000 });
      }
    } catch (err) {
      console.log(err);
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
      label: 'Create New Role',
      class: 'disable-label',
      link: '/system-configuration/platform-admin/roles/create',
    },
  ];

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
          if (per.name === 'Read') {
            temp = [...temp, per.code];
            setArray(temp);
          }
          if (per.name === 'Add Config') {
            temp = [...temp, id];
            setArray(temp);
          }
        }
      }
      if (name === 'Login as Tenant') {
        let temp = [...array];
        for (let per of permission) {
          if (per.name === 'Read') {
            temp = [...temp, per.code];
            setArray(temp);
          }
          if (per.name === 'Login as Tenant') {
            temp = [...temp, id];
            setArray(temp);
          }
        }
      }
      if (name === 'Update Password') {
        let temp = [...array];
        for (let per of permission) {
          if (per.name === 'Read') {
            temp = [...temp, per.code];
            setArray(temp);
          }
          if (per.name === 'Update Password') {
            temp = [...temp, id];
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
              <React.Fragment key={index} className={'mb-2'}>
                {item?.permissions && item?.permissions.length > 0 && (
                  <div className="w-100">
                    <p>
                      <b>{item.name}</b>
                    </p>
                  </div>
                )}
                {/* <div style={{ display: "flex", justifyContent: "space-between" }}> */}
                {item?.permissions &&
                  item?.permissions.length > 0 &&
                  item.permissions.map((per, index) => {
                    return (
                      <>
                        <div className={'mb-4'}>
                          <div className="form-field checkbox">
                            <span className="toggle-text">{per.name}</span>
                            <label htmlFor={`${per.code}`} className="switch">
                              <input
                                style={{ width: '50px' }}
                                key={item.code}
                                type="checkbox"
                                id={`${per.code}`}
                                className="toggle-input"
                                name={per.name}
                                checked={array.includes(per.code)}
                                onChange={(e) => {
                                  //   (e) => {
                                  //   if (e.target.checked) {
                                  //     let temp = [...array, per.code];
                                  //     // temp.push(per.code)
                                  //     setArray(temp);
                                  //   } else {
                                  //     const newArray = array.filter(
                                  //       (item) => item !== per.code
                                  //     );
                                  //     setArray(newArray);
                                  //   }
                                  // }
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

                        {/* <p key={index}></p> */}
                      </>
                    );
                  })}
                {/* </div> */}
                {item?.child_modules?.length > 0 && recursiveFunction(item)}
              </React.Fragment>
            );
          })
        ) : (
          <React.Fragment>
            {child?.permissions && child?.permissions.length > 0 && (
              <div className="w-100 mb-1">
                <p style={{ fontWeight: '600' }}> {child.name}</p>
              </div>
            )}
            <div className="container mb-3" style={{ paddingLeft: 0 }}>
              <div className="row">
                {child?.permissions &&
                  child?.permissions.length > 0 &&
                  child.permissions.map((per, index) => {
                    return (
                      <>
                        <div className="col-3">
                          <div className="form-field checkbox">
                            <span className="toggle-text">{per.name}</span>
                            <label htmlFor={`${per.code}`} className="switch">
                              <input
                                style={{ width: '50px' }}
                                key={child.code}
                                type="checkbox"
                                id={`${per.code}`}
                                className="toggle-input"
                                name={per.name}
                                checked={array.includes(per.code)}
                                onChange={(e) => {
                                  //  {
                                  //   console.log("per.code", per.code, per.name)
                                  //   if (e.target.checked && per.name === "Write") {
                                  //     let temp = [...array, per.code, (per.code - 1).toString()];
                                  //     // temp.push(per.code)
                                  //     console.log({ temp })
                                  //     setArray(temp);
                                  //   } else {
                                  //     const newArray = array.filter(
                                  //       (child) => child !== per.code
                                  //     );
                                  //     setArray(newArray);
                                  //   }
                                  // }
                                  console.log(array);
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
              </div>
            </div>
            {child?.child_modules?.length > 0 && recursiveFunction(child)}
          </React.Fragment>
        )}
      </>
    );
  };
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setSendData((pre) => ({ ...pre, [name]: value }));
  };

  return (
    <div className="mainContent">
      {showModel === true ? (
        <SuccessPopUpModal
          title="Success!"
          message="Role created."
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
        BreadCrumbsTitle={'Create New Role'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <form className={styles.addAdminRoles}>
          <div className="formGroup">
            <h5>Create New Role</h5>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder=" "
                  onChange={inputHandler}
                  required
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
                  onChange={inputHandler}
                />
              </div>
            </div>
            <h5>Permissions Legend</h5>
            <h6 className={'mb-1'}>Read</h6>
            <p className={'mb-3'}>View listing, searching, details and etc.</p>
            <h6 className={'mb-1'}>Write</h6>
            <p className={'mb-3'}>Add, Update operation.</p>
            <h6 className={'mb-1'}>Archive</h6>
            <p>Archive item/object.</p>
          </div>

          <div className={`${styles.permissions} formGroup`}>
            <h5>Permissions</h5>
            {permissions?.application?.map((item, index) => {
              return (
                <>
                  {item?.modules?.map((moduleItem, moduleIndex) => (
                    <>{recursiveFunction(moduleItem)}</>
                  ))}
                </>
              );
            })}
          </div>
        </form>

        <div className="form-footer">
          <button
            className="btn btn-secondary btn-border-none"
            onClick={() => setCloseModal(true)}
          >
            Cancel
          </button>

          <button
            type="button"
            className={` ${`btn btn-primary`}`}
            onClick={handleSubmit}
            disabled={buttonWorking}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdminRoles;
