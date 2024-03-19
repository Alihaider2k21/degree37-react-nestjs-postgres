import React, { useState, useEffect } from 'react';
import jwt from 'jwt-decode';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './index.module.scss';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import handleInputChange from '../../../../../../helpers/handleInputChange';
import validateForm from '../../../../../../helpers/formValidation';
import SelectDropdown from '../../../../../common/selectDropdown';
import FormText from '../../../../../common/form/FormText';
import FormInput from '../../../../../common/form/FormInput';
import {
  SC_ORGANIZATIONAL_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../../../routes/path';
import axios from 'axios';

const EditOrganizationalLevel = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    short_label: '',
    description: '',
    parent_level_id: '',
    is_active: false,
  });

  const [parentLevels, setParentLevels] = useState([]);
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState('');
  const { id } = useParams();
  const [modalPopUp, setModalPopUp] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [successNavigate, setSuccessNavigate] = useState(false);
  const bearerToken = localStorage.getItem('token');
  const [archivePopup, setArchivePopup] = useState(false);

  useEffect(() => {
    // Fetch parent levels from API
    if (!id) {
      fetchParentLevels();
    }

    getLoginUserId();
    if (id) {
      fetchOrganizationalLevel(id);
    }
  }, [id]);

  const fetchOrganizationalLevel = async (id) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/organizational_levels/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      const data = response.data;
      // Set the fetched organizational level data in the form
      if (data?.data) {
        data.data.parent_level_id = data.data.parent_level
          ? {
              label: data.data.parent_level.name,
              value: data.data.parent_level.id,
            }
          : null;
        fetchParentLevels(data?.data?.id);
      }

      setFormData(data?.data || {});
    } catch (error) {
      toast.error('Failed to fetch organizational level data.', {
        autoClose: 3000,
      });
    }
  };

  const getLoginUserId = () => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      // setToken(jwtToken);
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setUserId(decodeToken?.id);
      }
    }
  };

  const fetchParentLevels = async (selectedOrganizationID) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/organizational_levels?collectionOperation=false`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      const data = response.data;
      setParentLevels(
        data?.data.filter((item) => item.id !== selectedOrganizationID)
      );
    } catch (error) {
      toast.error('Failed to fetch parent levels.', { autoClose: 3000 });
    }
  };

  const handleCheckboxChange = (e, name) => {
    const { checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
  };

  const saveAndClose = async (e) => {
    await handleSubmit(e);
    setSuccessNavigate(true);
  };

  const save = async (e) => {
    await handleSubmit(e);
    setSuccessNavigate(false);
  };

  let hasData =
    formData.name ||
    formData.short_label ||
    formData.description ||
    formData.parent_level_id;

  hasData = Boolean(hasData);

  const fieldNames = [
    { label: 'Name', name: 'name', required: true, maxLength: 50 },
    {
      label: 'Short Label',
      name: 'short_label',
      required: true,
      maxLength: 50,
    },
    {
      label: 'Description',
      name: 'description',
      required: true,
      maxLength: 500,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(name, value, setFormData, fieldNames, setErrors);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm(formData, fieldNames, setErrors);

    if (isValid) {
      const body = {
        name: formData.name,
        short_label: formData.short_label,
        description: formData.description,
        is_active: formData.is_active,
        parent_level_id: formData.parent_level_id
          ? +formData.parent_level_id?.value
          : null,
        updated_by: +userId,
        created_by: +formData?.created_by?.id,
      };

      try {
        const response = await axios.put(
          `${BASE_URL}/organizational_levels/${id}`,
          body,
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const data = response.data;
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

  const BreadcrumbsData = [
    {
      label: 'System Configurations',
      class: 'disable-label',
      link: SYSTEM_CONFIGURATION_PATH,
    },
    {
      label: 'Organizational Administration',
      class: 'disable-label',
      link: SC_ORGANIZATIONAL_ADMINISTRATION_PATH,
    },
    {
      label: 'Hierarchy',
      class: 'disable-label',
      link: '/system-configuration/organizational-levels',
    },
    {
      label: 'Organizational Levels',
      class: 'disable-label',
      link: '/system-configuration/organizational-levels',
    },
    {
      label: 'Edit',
      class: 'active-label',
      link: `/system-configuration/organizational-levels/${id}/edit`,
    },
  ];
  const handleConfirmArchive = async () => {
    const body = {
      is_archived: true,
    };
    const response = await makeAuthorizedApiRequest(
      'PATCH',
      `${BASE_URL}/organizational_levels/archive/${id}`,
      JSON.stringify(body)
    );
    let data = await response.json();
    if (data?.status === 'success') {
      toast.success(`Organizational Level is archived.`, {
        autoClose: 3000,
      });
      navigate('/system-configuration/organizational-levels');
    } else {
      toast.error(`${data?.message?.[0] ?? data?.response}`, {
        autoClose: 3000,
      });
    }
    setArchivePopup(false);
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Edit Organizational Level'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form className={styles.formcontainer}>
          <div className="formGroup">
            <h5>Edit Organizational Level</h5>
            <FormInput
              label="Level Name"
              displayName="Level Name"
              name="name"
              error={errors.name}
              disabled={formData?.is_collection_operation}
              required
              value={formData.name}
              onChange={handleChange}
              onBlur={handleChange}
            />
            <FormInput
              label="Short Label"
              displayName="Short Label"
              name="short_label"
              error={errors.short_label}
              disabled={formData?.is_collection_operation}
              required
              value={formData.short_label}
              onChange={handleChange}
              onBlur={handleChange}
            />
            <FormText
              name="description"
              displayName="Description"
              value={formData?.description}
              error={errors?.description}
              classes={{ root: 'w-100' }}
              required
              onChange={handleChange}
              onBlur={handleChange}
            />
            <div className="form-field w-100">
              <div className="field">
                <SelectDropdown
                  placeholder={'Parent Level'}
                  defaultValue={formData.parent_level_id}
                  selectedValue={formData.parent_level_id}
                  removeDivider
                  showLabel
                  onChange={(val) => {
                    console.log({ val });
                    let e = {
                      target: {
                        name: 'parent_level_id',
                        value: val ?? null,
                      },
                    };
                    handleChange(e);
                  }}
                  options={parentLevels.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                    };
                  })}
                />

                {errors.parent_level_id && (
                  <p className={styles.error}>{errors.parent_level_id}</p>
                )}
              </div>
            </div>
            <div className="form-field checkbox w-100">
              <span className="toggle-text">
                {formData?.is_active ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  type="checkbox"
                  id="toggle"
                  disabled={formData?.is_collection_operation}
                  className="toggle-input"
                  checked={formData.is_active}
                  name="is_active"
                  onChange={(e) => {
                    handleCheckboxChange(e, 'is_active');
                  }}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </form>
        <div className="form-footer">
          {!formData?.is_collection_operation && (
            <div
              className="archived"
              onClick={() => {
                setArchivePopup(true);
              }}
            >
              Archive
            </div>
          )}
          <p
            className={`mb-0 ${styles.cancelbutton}`}
            onClick={(e) => {
              e.preventDefault();
              !hasData
                ? navigate('/system-configuration/organizational-levels')
                : setCloseModal(true);
            }}
          >
            Cancel
          </p>

          <button
            className={`btn btn-md me-4 ${styles.saveandclose} ${styles.createbtn}  btn-secondary`}
            onClick={(e) => saveAndClose(e)}
          >
            Save & Close
          </button>
          <button
            type="button"
            className={` ${`btn btn-primary btn btn-md me-4 ${styles.createbtn}`}`}
            onClick={(e) => save(e)}
          >
            Save Changes
          </button>

          <SuccessPopUpModal
            title="Success!"
            message="Organizational Level updated."
            modalPopUp={modalPopUp}
            isNavigate={successNavigate}
            setModalPopUp={setModalPopUp}
            showActionBtns={true}
            redirectPath={'/system-configuration/organizational-levels'}
          />
          <CancelModalPopUp
            title="Confirmation"
            message="Unsaved changes will be lost, do you wish to proceed?"
            modalPopUp={closeModal}
            isNavigate={true}
            setModalPopUp={setCloseModal}
            redirectPath={'/system-configuration/organizational-levels'}
          />
          <SuccessPopUpModal
            title="Confirmation"
            message={'Are you sure you want to archive?'}
            modalPopUp={archivePopup}
            setModalPopUp={setArchivePopup}
            showActionBtns={false}
            isArchived={true}
            archived={handleConfirmArchive}
          />
        </div>
      </div>
    </div>
  );
};

export default EditOrganizationalLevel;
