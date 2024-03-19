import React from 'react';
import Layout from '../../../../../components/common/layout';
import FormInput from '../../../../../components/common/form/FormInput';
// import FormText from '../../../../../components/common/form/FormText';
import FormToggle from '../../../../../components/common/form/FormToggle';
import FormCheckbox from '../../../../../components/common/form/FormCheckBox';
import SelectDropdown from '../../../../../components/common/selectDropdown';
import CancelPopUpModal from '../../../../../components/common/cancelModal';
import SuccessPopUpModal from '../../../../../components/common/successModal';
import TopBar from '../../../../../components/common/topbar/index';
import styles from './Certification.module.scss';
import { fetchData } from '../../../../../helpers/Api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CertificationBreadCrumbsData } from './CertificationBreadCrumbsData';
import NotFoundPage from '../../../../not-found/NotFoundPage';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';

const initialState = {
  name: '',
  description: '',
  expires: false,
  expiration_interval: 0,
  is_active: true,
  short_name: '',
  association_type: '',
};

const initialErrorsState = {
  name: '',
  description: '',
  short_name: '',
  expiration_interval: '',
  association_type: '',
};

export default function CreateCertification() {
  const navigate = useNavigate();

  const [certification, setCertification] = React.useState(initialState);
  const [association, setAssociation] = React.useState(null);
  const [changed, setChanged] = React.useState(false);
  const [errors, setErrors] = React.useState(initialErrorsState);
  const [cancel, setCancel] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const BreadcrumbsData = [
    ...CertificationBreadCrumbsData,
    {
      label: 'Certifications',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/staffing-admin/certifications',
    },
    {
      label: 'Create Certification',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/staffing-admin/certifications/create',
    },
  ];

  const handleCancel = async (e) => {
    e.preventDefault();
    if (changed) setCancel(true);
    else navigate(-1);
  };

  const handleDropDown = async (association) => {
    const { value } = association || {};
    setTimeout(() => {
      setAssociation(association);
      setCertification({ ...certification, association_type: value });
      setErrors({ ...errors, association_type: '' });
    });
  };

  const fieldNames = [
    { label: 'Name', name: 'name', required: true, maxLength: 50 },
    {
      label: 'Short Name',
      name: 'short_name',
      required: true,
      maxLength: 500,
    },
    {
      label: 'Description',
      name: 'description',
      required: true,
      maxLength: 500,
    },
    {
      label: 'Association Type',
      name: 'association_type',
      required: true,
    },
  ];

  function titleCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    fieldNames.forEach((fieldName) => {
      const value = certification[fieldName.name];
      const fieldDefinition = fieldNames.find(
        (field) => field.name === fieldName.name
      );
      let errorMessage = '';

      if (fieldDefinition?.required && value?.toString().trim() === '') {
        errorMessage = `${titleCase(fieldDefinition?.label)} is required.`;
      }

      if (
        fieldDefinition?.maxLength &&
        value?.length > fieldDefinition?.maxLength
      ) {
        errorMessage = `Maximum ${titleCase(
          fieldDefinition?.maxLength
        )} characters are allowed`;
      }

      if (errorMessage === '') {
        newErrors[fieldName.name] = '';
      } else {
        newErrors[fieldName.name] = errorMessage;
        isValid = false;
      }
    });

    if (certification.expires && certification.expiration_interval <= 0) {
      newErrors['expiration_interval'] =
        'Expiration interval is required if expires is enabled.';
      isValid = false;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = validateForm();
    if (result) {
      setIsLoading(true);

      try {
        await fetchData('/staffing-admin/certification/create', 'POST', {
          ...certification,
          association_type: association.value,
        });
        setOpen(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      } catch (err) {
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
        console.error(`APIError ${err.status_code}: ${err.response}`);
        toast.error(err.response, { autoClose: 3000 });
      }
    }
  };

  const handleInputChange = (e) => {
    let { name, value, type } = e.target;

    switch (type) {
      case 'checkbox':
        value = !certification[name];
        break;
      case 'number':
        value = parseInt(value);
        break;
      default:
        break;
    }

    setTimeout(() => {
      setChanged(true);
      if (name === 'expires' && !value) {
        setCertification({
          ...certification,
          [name]: value,
          expiration_interval: 0,
        });
      } else setCertification({ ...certification, [name]: value });
    });

    let errorMessage = '';

    const fieldDefinition = fieldNames.find((field) => field.name === name);

    if (fieldDefinition?.required && value.toString().trim() === '') {
      errorMessage = `${fieldDefinition.label} is required.`;
    }

    // if (
    //   fieldDefinition?.maxLength &&
    //   value.length > fieldDefinition?.maxLength
    // ) {
    //   errorMessage = `Maximum ${fieldDefinition.maxLength} characters are allowed`;
    // }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMsg,
      }));
    };
    setError(name, errorMessage);
  };

  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.CERTIFICATIONS.CERTIFICATIONS.WRITE,
  ]) ? (
    <Layout>
      <TopBar
        className={styles.topBar}
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Certifications'}
      />
      <form onSubmit={handleSubmit} className="h-screen">
        <div className={`center ${styles.container}`}>
          <div className="formGroup">
            <h5>Create Certification</h5>

            <div className="d-flex w-100 gap-3">
              <FormInput
                name="name"
                displayName="Name*"
                value={certification.name}
                error={errors.name}
                classes={{ root: 'w-50' }}
                handleChange={handleInputChange}
                handleBlur={handleInputChange}
                required={false}
                className="form-control"
              />
              <FormInput
                name="short_name"
                displayName="Short Name*"
                value={certification.short_name}
                error={errors.short_name}
                classes={{ root: 'w-50' }}
                handleChange={handleInputChange}
                handleBlur={handleInputChange}
                required={false}
                className="form-control"
              />
            </div>
            <div className="form-field textarea-new w-100">
              <div className={`field`}>
                <textarea
                  type="text"
                  className={`form-control textarea`}
                  placeholder=" "
                  name="description"
                  value={certification.description}
                  onChange={handleInputChange}
                  onBlur={handleInputChange}
                  required={false}
                />
                <label>Description *</label>
              </div>

              {errors.description && (
                <div className="error">
                  <p>{errors.description}</p>
                </div>
              )}
            </div>
            {/* <FormText
              name="description"
              displayName="Description*"
              value={certification.description}
              error={errors.description}
              classes={{ root: 'w-100' }}
              handleChange={handleInputChange}
              handleBlur={handleInputChange}
              required={false}
            /> */}

            <SelectDropdown
              placeholder={'Association Type*'}
              selectedValue={association}
              error={errors.association_type}
              required={false}
              onChange={handleDropDown}
              onBlur={(e) => {
                e.target.name = 'association_type';
                e.target.value = association;
                handleInputChange(e);
              }}
              options={[
                { label: 'VEHICLE', value: 'VEHICLE' },
                { label: 'STAFF', value: 'STAFF' },
              ]}
              removeDivider
              removeTheClearCross
              showLabel
            />

            <FormCheckbox
              name="expires"
              displayName="Expires"
              checked={certification.expires}
              value={certification.expires}
              classes={{ root: 'w-100' }}
              handleChange={handleInputChange}
            />

            {certification.expires && (
              <FormInput
                name="expiration_interval"
                displayName="Expiration Interval"
                type={'number'}
                value={certification.expiration_interval}
                error={errors.expiration_interval}
                classes={{ root: `w-100` }}
                handleChange={handleInputChange}
                handleBlur={handleInputChange}
                min="0"
              />
            )}

            <FormToggle
              name="is_active"
              displayName={certification?.is_active ? 'Active' : 'Inactive'}
              checked={certification.is_active}
              classes={{ root: 'pt-2' }}
              handleChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-footer">
          <button
            className="btn btn-md btn-secondary border-0"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            type="submit"
            className="btn btn-md btn-primary"
          >
            Create
          </button>
        </div>
      </form>
      <CancelPopUpModal
        title="Confirmation"
        message="Unsaved changes will be lost, do you want to proceed?"
        modalPopUp={cancel}
        isNavigate={true}
        setModalPopUp={setCancel}
        redirectPath={-1}
      />

      <SuccessPopUpModal
        title="Success!"
        message="Certification created."
        modalPopUp={open}
        isNavigate={true}
        setModalPopUp={setOpen}
        showActionBtns={true}
        redirectPath={-1}
      />
    </Layout>
  ) : (
    <NotFoundPage />
  );
}
