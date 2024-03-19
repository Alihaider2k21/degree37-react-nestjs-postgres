import React from 'react';
import Layout from '../../../../../components/common/layout';
import FormInput from '../../../../../components/common/form/FormInput';
import FormText from '../../../../../components/common/form/FormText';
import FormCheckbox from '../../../../../components/common/form/FormCheckBox';
import FormToggle from '../../../../../components/common/form/FormToggle';
import SuccessPopUpModal from '../../../../../components/common/successModal';
import CancelPopUpModal from '../../../../../components/common/cancelModal';
import ConfirmModal from '../../../../../components/common/confirmModal';
import ConfirmArchiveIcon from '../../../../../assets/images/ConfirmArchiveIcon.png';
import TopBar from '../../../../../components/common/topbar/index';
import SelectDropdown from '../../../../../components/common/selectDropdown';
import styles from './Certification.module.scss';
import { fetchData } from '../../../../../helpers/Api';
import { toTitle } from '../../../../../utils/str';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CertificationBreadCrumbsData } from './CertificationBreadCrumbsData';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../not-found/NotFoundPage';

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
  short_name: '',
  description: '',
  expiration_interval: '',
  association_type: '',
};

export default function EditCertification() {
  const params = useParams();
  const navigate = useNavigate();

  const [certification, setCertification] = React.useState(initialState);
  const [association, setAssociation] = React.useState('');
  const [changed, setChanged] = React.useState(false);
  const [errors, setErrors] = React.useState(initialErrorsState);
  const [success, setSuccess] = React.useState(false);
  const [showConfirmation, setConfirmation] = React.useState(false);
  const [cancel, setCancel] = React.useState(false);
  const [redirect, setRedirect] = React.useState(0);
  const [archiveStatus, setArchiveStatus] = React.useState(false);

  const BreadcrumbsData = [
    ...CertificationBreadCrumbsData,
    {
      label: 'Certifications',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/staffing-admin/certifications',
    },
    {
      label: 'Edit Certification',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/staffing-admin/certifications/${certification.id}/edit`,
    },
  ];

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
        errorMessage = `Maximum ${fieldDefinition?.maxLength} characters are allowed`;
      }

      if (errorMessage === '') {
        newErrors[fieldName.name] = '';
      } else {
        newErrors[fieldName.name] = errorMessage;
        isValid = false;
      }
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));

    return isValid;
  };

  React.useEffect(() => {
    fetchData(`/staffing-admin/certification/${params?.id}/find`, 'GET')
      .then((res) => {
        const { association_type } = res.data;

        setTimeout(() => {
          setCertification(res.data);
          setAssociation({
            label: toTitle(association_type),
            value: association_type,
          });
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [params]);

  const handleCancel = async (e) => {
    e.preventDefault();
    if (changed) setCancel(true);
    else navigate(-1);
  };

  function titleCase(string) {
    if (string) return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }

  const handleDropDown = async (association) => {
    const { value } = association || {};
    setTimeout(() => {
      setAssociation(association);
      setCertification({ ...certification, association_type: value });
      setErrors({ ...errors, association_type: '' });
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { type } = e.target;

    const result = validateForm();
    if (result) {
      try {
        await fetchData(
          `/staffing-admin/certification/${params?.id}/edit`,
          'PUT',
          {
            ...certification,
            association_type: association.value,
          }
        );
        setTimeout(() => {
          setChanged(false);
          if (type !== 'button') {
            setSuccess(true);
            setRedirect(
              '/system-configuration/tenant-admin/staffing-admin/certifications'
            );
          } else setSuccess(true);
        });
      } catch (err) {
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
      errorMessage = `${titleCase(fieldDefinition.label)} is required.`;
    }

    if (
      fieldDefinition?.maxLength &&
      value.length > fieldDefinition?.maxLength
    ) {
      errorMessage = `Maximum ${fieldDefinition.maxLength} characters are allowed`;
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMsg,
      }));
    };
    setError(name, errorMessage);
  };

  const handleArchive = (e) => {
    e.preventDefault();

    fetchData(`/staffing-admin/certification/${params?.id}/archive`, 'PATCH')
      .then((_) => {
        setConfirmation(false);
        setTimeout(() => {
          setArchiveStatus(true);
          setRedirect(
            '/system-configuration/tenant-admin/staffing-admin/certifications'
          );
        }, 600);
      })
      .catch((err) => {
        console.error(err);
        setConfirmation(false);
      });
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
      <form className="h-screen">
        <div className={`center ${styles.container}`}>
          <div className="formGroup">
            <h5>Edit Certification</h5>

            <div className="d-flex w-100 gap-3">
              <FormInput
                name="name"
                displayName="Name"
                value={certification.name}
                error={errors.name}
                classes={{ root: 'w-50' }}
                onChange={handleInputChange}
                handleBlur={handleInputChange}
              />
              <FormInput
                name="short_name"
                displayName="Short Name"
                value={certification.short_name}
                error={errors.short_name}
                classes={{ root: 'w-50' }}
                onChange={handleInputChange}
                handleBlur={handleInputChange}
              />
            </div>

            <FormText
              name="description"
              displayName="Description"
              value={certification.description}
              error={errors.description}
              classes={{ root: 'w-100' }}
              onChange={handleInputChange}
              handleBlur={handleInputChange}
            />

            <SelectDropdown
              placeholder={'Association Type*'}
              selectedValue={association}
              error={errors.association_type}
              required
              onChange={handleDropDown}
              onBlur={(e) => {
                e.target.name = 'association_type';
                e.target.value = association;
                handleInputChange(e);
              }}
              options={[
                { label: 'Vehicle', value: 'VEHICLE' },
                { label: 'Staff', value: 'STAFF' },
              ]}
              removeDivider
              removeTheClearCross
              showLabel
            />

            <FormCheckbox
              name="expires"
              displayName="Expires"
              value={certification.expires}
              checked={certification.expires}
              classes={{ root: 'w-100' }}
              onChange={handleInputChange}
            />

            {certification.expires && (
              <FormInput
                name="expiration_interval"
                displayName="Expiration Interval"
                type={'number'}
                value={certification.expiration_interval}
                error={errors.expiration_interval}
                classes={{ root: 'w-100' }}
                required={false}
                onChange={handleInputChange}
                min="0"
              />
            )}

            <FormToggle
              name="is_active"
              displayName={certification?.is_active ? 'Active' : 'Inactive'}
              checked={certification.is_active}
              classes={{ root: 'pt-2' }}
              handleChange={handleInputChange}
            />
          </div>
        </div>
      </form>

      <div className="form-footer">
        <div className={styles.btnGroup}>
          <div
            type="button"
            className="archived"
            onClick={() => setConfirmation(true)}
          >
            Archive
          </div>

          <button
            type="button"
            className="btn btn-md btn-primary float-end"
            onClick={handleSave}
          >
            Save Changes
          </button>

          <button
            type="submit"
            className="btn btn-md btn-secondary float-end"
            onClick={handleSave}
          >
            Save & Close
          </button>

          <button
            type="button"
            className="btn btn-md btn-secondary border-0 float-end"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>

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
        message="Certification updated."
        modalPopUp={success}
        isNavigate={true}
        setModalPopUp={setSuccess}
        showActionBtns={true}
        redirectPath={redirect}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Certification is archived."
        modalPopUp={archiveStatus}
        isNavigate={true}
        setModalPopUp={setArchiveStatus}
        showActionBtns={true}
        redirectPath={redirect}
      />

      <ConfirmModal
        showConfirmation={showConfirmation}
        onCancel={() => setConfirmation(false)}
        onConfirm={handleArchive}
        icon={ConfirmArchiveIcon}
        heading={'Confirmation'}
        description={'Are you sure you want to archive?'}
      />
    </Layout>
  ) : (
    <NotFoundPage />
  );
}
