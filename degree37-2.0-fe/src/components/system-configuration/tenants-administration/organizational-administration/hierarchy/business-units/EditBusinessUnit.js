import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import TopBar from '../../../../../common/topbar/index';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router-dom';
import { BusinessUnitSchema } from './FormSchema';
import jwt from 'jwt-decode';
import { BusinessBreadCrumbData } from '../breadCrumbsData';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import styles from './index.module.scss';
import SelectDropdown from '../../../../../common/selectDropdown';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import axios from 'axios';
const EditBusinessUnit = () => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(BusinessUnitSchema) });

  const [redirect, SetRedirect] = useState(false);
  const [BusinessUnit, setBusinessUnit] = useState({});
  const [userId, setUserId] = useState(null);
  const [organizationalLevels, setOrganizationalLevels] = useState([]);
  const [parentLevelData, setParentLevelData] = useState([]);
  const [tempParentLevelData, setTempParentLevelData] = useState([]);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const bearerToken = localStorage.getItem('token');
  const [parentLevelExists, setParentLevelExists] = useState(true);
  const [isActive, setIsActive] = useState(false);

  const [confirmationModal, setConfirmationModal] = useState(false);
  const [archiveModalPopUp, setArchiveModalPopUp] = useState(false);
  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setUserId(decodeToken?.id);
      }
    }
  }, [userId]);

  const getBusinessUnits = async () => {
    const response = await axios.get(`${BASE_URL}/business_units?limit=1000`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
    });

    const data = response.data;

    setParentLevelData(data?.data);
    setTempParentLevelData(data?.data);
  };

  const getBusinessUnitByID = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/business_units/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });

      const data = response.data;
      let organizationId = data?.organizational_level_id?.id;
      data.organizational_level_id = {
        label: data?.organizational_level_id?.name,
        value: data?.organizational_level_id?.id,
      };
      data.parent_level = data?.parent_level?.id
        ? {
            label: data?.parent_level?.name,
            value: data?.parent_level?.id,
          }
        : null;
      setBusinessUnit(data);
      setIsActive(data.is_active);

      let organization = organizationalLevels?.find(
        (item) => item.id == +organizationId
      );

      let updatedParentList = tempParentLevelData?.filter(
        (item) =>
          item.organizational_level_id?.id == organization?.parent_level?.id
      );

      if (updatedParentList.length > 0) {
        setParentLevelExists(true);
      } else {
        setParentLevelExists(false);
      }
      setParentLevelData(
        [...updatedParentList]?.filter(
          (item) => item.is_active === true && item.is_archived === false
        )
      );
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const getOrganizationLevels = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/organizational_levels?limit=1000`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      const organizations = response.data;

      setOrganizationalLevels(organizations?.data);
    } catch (error) {
      console.log('error', error);
      toast.error('Failed to fetch Organizational Levels', { autoClose: 3000 });
    }
  };

  useEffect(() => {
    getOrganizationLevels();
  }, [id]);

  useEffect(() => {
    getBusinessUnits();
  }, []);

  useEffect(() => {
    getBusinessUnitByID(id);
  }, [id, organizationalLevels, tempParentLevelData]);

  useEffect(() => {
    BusinessUnit && reset(BusinessUnit);
  }, [BusinessUnit]);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const onSubmit = async (data) => {
    data.organizational_level_id = parseInt(
      data.organizational_level_id?.value
    );
    data.parent_level_id = parseInt(data.parent_level?.value);
    const body = {
      ...data,
      created_by: +data?.created_by?.id,
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/business_units/${id}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      const data = response.data;
      if (data?.status_code === 400) {
        return toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      }

      if (data?.status === 'succes') {
        setModalPopUp(true);
      }
    } catch (error) {
      toast.error(`${data?.response}`, { autoClose: 3000 });
    }
  };

  const BreadcrumbsData = [
    ...BusinessBreadCrumbData,
    {
      label: 'Edit Business Units',
      class: 'active-label',
      link: `/system-configuration/business-unit/edit/${id}`,
    },
  ];
  const handleArchive = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'PUT',
        `${BASE_URL}/business_units/archive/${id}`
      );
      const { status_code, status, response } = await result.json();

      if (status_code === 200 && status === 'success') {
        setArchiveModalPopUp(false);
        setTimeout(() => {
          setConfirmationModal(true);
        }, 600);
      } else {
        toast.error(response, { autoClose: 3000 });
      }
    } catch (error) {
      toast.error(error?.response, { autoClose: 3000 });
    }
  };
  return (
    <>
      <div className="mainContent ">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Edit Business Unit'}
          SearchPlaceholder={null}
          SearchValue={null}
          SearchOnChange={null}
        />
        <div className={`formContainer mainContentInner form-container`}>
          <form
            className={`addBusinessUnit ${styles.mainBody}`}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="formGroup ">
              <h5>Edit Business Unit</h5>

              <div className="form-field w-40 ">
                <div className="field ">
                  <input
                    {...register('name')}
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder=" "
                    required
                  />

                  <label>Name*</label>
                  {errors.name && (
                    <div className={`error ${styles.errorcolor}`}>
                      <p>{errors.name}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-field">
                <div className="field">
                  <div
                    className={`field form-floating ${styles.selectfieldfunction} ${styles.fieldcontact}`}
                  >
                    <SelectDropdown
                      disabled={!parentLevelExists}
                      styles={{ root: 'w-100' }}
                      placeholder={'Parent'}
                      defaultValue={BusinessUnit.parent_level}
                      selectedValue={BusinessUnit.parent_level}
                      removeDivider
                      showLabel
                      onChange={(val) => {
                        setBusinessUnit((prevData) => {
                          return {
                            ...prevData,
                            parent_level: val ?? null,
                          };
                        });
                      }}
                      options={parentLevelData.map((item) => {
                        return {
                          label: item.name,
                          value: item.id,
                        };
                      })}
                    />
                    {BusinessUnit.organizational_level_id &&
                      !parentLevelExists && (
                        <p style={{ fontSize: '14px' }}>
                          Note: Selected Organizational Level has no Parent
                          Level.
                        </p>
                      )}
                    {errors?.parent_level && (
                      <div className="error">
                        <p>{errors?.parent_level?.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-field">
                <div className="field">
                  <div
                    className={`field form-floating ${styles.selectfieldfunction} ${styles.fieldcontact} `}
                  >
                    <SelectDropdown
                      styles={{ root: 'w-100' }}
                      placeholder={'Organization Level'}
                      defaultValue={BusinessUnit.organizational_level_id}
                      selectedValue={BusinessUnit.organizational_level_id}
                      removeDivider
                      showLabel
                      onChange={(val) => {
                        if (
                          val?.value !=
                          BusinessUnit?.organizational_level_id?.value
                        ) {
                          setBusinessUnit((prevData) => ({
                            ...prevData,
                            parent_level: null,
                          }));
                        }

                        setBusinessUnit((prevData) => {
                          return {
                            ...prevData,
                            organizational_level_id: val ?? null,
                          };
                        });
                        let organization = organizationalLevels?.find(
                          (item) => item.id == +val?.value
                        );
                        let updatedParentList = tempParentLevelData?.filter(
                          (item) =>
                            item.organizational_level_id?.id ==
                            organization?.parent_level?.id
                        );
                        if (updatedParentList.length > 0) {
                          setParentLevelExists(true);
                        } else {
                          setParentLevelExists(false);
                        }
                        setParentLevelData(
                          [...updatedParentList]?.filter(
                            (item) =>
                              item.is_active === true &&
                              item.is_archived === false
                          )
                        );
                      }}
                      options={organizationalLevels.map((item) => {
                        return {
                          label: item.name,
                          value: item.id,
                        };
                      })}
                    />

                    {errors?.organizational_level && (
                      <div className="error">
                        <p>{errors?.organizational_level?.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-field checkbox" style={{ width: '52%' }}>
                <span className="toggle-text">
                  {isActive ? 'Active' : 'Inactive'}
                </span>
                <label htmlFor="toggle" className="switch">
                  <input
                    {...register('is_active')}
                    type="checkbox"
                    name="is_active"
                    id="toggle"
                    className="toggle-input"
                    onChange={(e) => {
                      setIsActive(e.target.checked);
                    }}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <div className="form-footer-custom ">
              <div
                className={`archived`}
                onClick={(e) => {
                  e.preventDefault();
                  setArchiveModalPopUp(true);
                }}
              >
                Archive
              </div>
              <>
                <button
                  className={`btn btn-link btn-secondary m-0 px-3 ${styles.footercancelbtn}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCloseModal(true);
                  }}
                  style={{ fontSize: '14px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-md  ${
                    styles.saveandclose
                  } ${` btn-secondary`}`}
                  onClick={() => {
                    SetRedirect(true);
                    setModalPopUp(true);
                  }}
                >
                  Save & Close
                </button>
                <button
                  type="submit"
                  className={` ${`btn btn-primary btn btn-md  ${styles.createbtn}`} ${`btn-primary `}`}
                  onClick={() => {
                    SetRedirect(false);
                    setModalPopUp(true);
                  }}
                >
                  Save Changes
                </button>
              </>

              {redirect ? (
                <SuccessPopUpModal
                  title="Success!"
                  message="Business Unit updated."
                  modalPopUp={modalPopUp}
                  isNavigate={true}
                  setModalPopUp={setModalPopUp}
                  showActionBtns={true}
                  redirectPath={
                    '/system-configuration/hierarchy/business-units'
                  }
                />
              ) : (
                <SuccessPopUpModal
                  title="Success!"
                  message="Business Unit updated."
                  modalPopUp={modalPopUp}
                  isNavigate={true}
                  setModalPopUp={setModalPopUp}
                  showActionBtns={true}
                  onConfirm={() => {}}
                />
              )}
              <CancelModalPopUp
                title="Confirmation"
                message="Unsaved changes will be lost, do you wish to proceed?"
                modalPopUp={closeModal}
                isNavigate={true}
                setModalPopUp={setCloseModal}
                redirectPath={'/system-configuration/hierarchy/business-units'}
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
                message={'Business Unit is archived.'}
                modalPopUp={confirmationModal}
                isNavigate={true}
                setModalPopUp={setConfirmationModal}
                showActionBtns={true}
                redirectPath={'/system-configuration/hierarchy/business-units'}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditBusinessUnit;
