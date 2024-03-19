import React, { useEffect, useState } from 'react';
import TopBar from '../../../../common/topbar/index';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormInput from '../../../../common/form/FormInput';
import SelectDropdown from '../../../../common/selectDropdown';
import FormCheckbox from '../../../../common/form/FormCheckBox';
import FormToggle from '../../../../common/form/FormToggle';
import CancelModalPopUp from '../../../../common/cancelModal';
import SuccessPopUpModal from '../../../../common/successModal';
import SvgComponent from '../../../../common/SvgComponent';
import { toast } from 'react-toastify';
import './index.scss';
import { useParams } from 'react-router-dom';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import { CustomFieldsBreadCrumbsData } from './CustomFieldsBreadCrumbsData';

export default function CustomFieldsEdit() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [appliesToData, setAppliesToData] = useState(null);
  const [fieldDataTypeData, setFieldDataTypeData] = useState(null);
  const [closeModal, setCloseModal] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [pickListData, setPickListData] = useState(false);
  const [showModelArchive, setShowModelArchive] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [pick_list, setpick_list] = useState([
    {
      type_name: '',
      type_value: '',
    },
  ]);

  const { id } = useParams();
  const schema = yup
    .object()
    .shape({
      field_name: yup.string().required('Field name is required.'),
      field_data_type: yup.string().required('Field data type is required.'),
      applies_to: yup.string().required('Applies to is required.'),
      pick_list: yup.string().when('field_data_type', {
        is: '4',
        then: () =>
          yup.array().of(
            yup.object().shape({
              type_name: yup.string().required('Name is required.'),
              type_value: yup.string().required('Value is required.'),
            })
          ),
        otherwise: () => yup.array().notRequired(),
      }),
    })
    .required();

  const {
    setValue,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    getData();
  }, [id]);

  const getData = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/system-configuration/organization-administration/custom-fields/${id}`
      );

      const res = await response.json();
      if (res?.status === 'success') {
        const data = res?.data;
        setValue('field_name', data?.field_name);
        setValue('is_active', data?.is_active);
        setValue('is_required', data?.is_required);
        setValue('applies_to', data?.applies_to);
        setValue('field_data_type', data?.field_data_type);
        const filterAppliesTo = appliesToOption?.find(
          (option) => option?.value === data?.applies_to
        );
        setAppliesToData({
          ...appliesToData,
          applies_to: filterAppliesTo,
        });
        const filterFieldDataTypes = fieldDataTypeOption?.find(
          (option) => option?.value === data?.field_data_type
        );
        setFieldDataTypeData({
          ...fieldDataTypeData,
          field_data_type: filterFieldDataTypes,
        });
        if (data?.field_data_type === '4') {
          setPickListData(true);
          const filterPickList = data?.pick_list?.map(
            ({ type_name, type_value, id }) => ({
              type_name,
              type_value,
              id,
            })
          );
          setpick_list(filterPickList);
          setValue('pick_list', filterPickList);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (field, e) => {
    const { name, value } = e.target;
    field.onChange({ target: { name, value } });
  };

  const appliesToOption = [
    {
      label: 'Accounts',
      value: '1',
    },
    {
      label: 'Locations',
      value: '5',
    },
    {
      label: 'Donor Centers',
      value: '2',
    },
    {
      label: 'Donors',
      value: '3',
    },
    {
      label: 'Staff',
      value: '8',
    },
    {
      label: 'Volunteers',
      value: '9',
    },
    {
      label: 'Drives',
      value: '4',
    },
    {
      label: 'Sessions',
      value: '7',
    },
    {
      label: 'NCEs',
      value: '6',
    },
  ];

  const fieldDataTypeOption = [
    {
      label: 'Text',
      value: '5',
    },
    {
      label: 'Number',
      value: '3',
    },
    {
      label: 'Decimal',
      value: '2',
    },
    {
      label: 'Date',
      value: '1',
    },
    {
      label: 'Yes or No',
      value: '8',
    },
    {
      label: 'True or false',
      value: '7',
    },
    {
      label: 'Text Array',
      value: '6',
    },
    {
      label: 'Pick List',
      value: '4',
    },
  ];
  const BreadcrumbsData = [
    ...CustomFieldsBreadCrumbsData,
    {
      label: 'Custom Fields',
      class: 'disable-label',
      link: `/system-configuration/tenant-admin/organizational-admin/custom-fields/list`,
    },
    {
      label: 'Edit Custom Field',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organizational-admin/custom-fields/${id}/edit`,
    },
  ];

  const handleChangeFieldDataType = (val) => {
    setValue('field_data_type', val?.value || null);
    setFieldDataTypeData({
      ...fieldDataTypeData,
      field_data_type: val,
    });
    if (val?.value === '4') {
      setpick_list([
        {
          type_name: '',
          type_value: '',
        },
      ]);
      setValue('pick_list', [
        {
          type_name: '',
          type_value: '',
        },
      ]);
      setPickListData(true);
    } else {
      setPickListData(false);
      setValue('pick_list', null);
    }

    if (val?.value === undefined) {
      setError('field_data_type', {
        type: 'custom',
        message: 'Field data type is required',
      });
    } else {
      setError('field_data_type', { type: 'custom', message: '' });
    }
  };
  const handleChangeAppliesTo = (val) => {
    setValue('applies_to', val?.value || null);
    setAppliesToData({
      ...appliesToData,
      applies_to: val,
    });
    if (val?.value === undefined) {
      setError('applies_to', {
        type: 'custom',
        message: 'Applies to is required',
      });
    } else {
      setError('applies_to', { type: 'custom', message: '' });
    }
  };

  const handleMinus = (index) => {
    const updatedpick_list = [...pick_list];
    updatedpick_list.splice(index, 1);
    setpick_list(updatedpick_list);
    setValue('pick_list', updatedpick_list);
  };
  const handlePlus = () => {
    setpick_list([...pick_list, { type_name: '', type_value: '' }]);
    setValue('pick_list', [...pick_list, { type_name: '', type_value: '' }]);
  };

  const hasDuplicateTypeName = (pickList) => {
    const typeNamesSet = new Set();
    for (const item of pickList) {
      const lowerCaseTypeName = item.type_name.toLowerCase();
      if (typeNamesSet.has(lowerCaseTypeName)) {
        return true; // Duplicate found
      }
      typeNamesSet.add(lowerCaseTypeName);
    }
    return false; // No duplicates
  };

  const hasDuplicateTypeValue = (pickList) => {
    const typeValuesSet = new Set();
    for (const item of pickList) {
      const lowerCaseTypeValue = item.type_value.toLowerCase();
      if (typeValuesSet.has(lowerCaseTypeValue)) {
        return true; // Duplicate found
      }
      typeValuesSet.add(lowerCaseTypeValue);
    }
    return false; // No duplicates
  };
  const onSubmit = async (data, event) => {
    const accessToken = localStorage.getItem('token');
    console.log(data);
    if (hasDuplicateTypeName(data.pick_list)) {
      toast.error('Duplicate Name in pick_list!');
      return; // Stop submitting
    }
    if (hasDuplicateTypeValue(data.pick_list)) {
      toast.error('Duplicate Value in pick_list!');
      return; // Stop submitting
    }
    let body = data;
    try {
      const response = await fetch(
        `${BASE_URL}/system-configuration/organization-administration/custom-fields/${id}`,
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
      // setLoading(false);
      if (data?.status === 'success') {
        setShowModel(true);
        if (event?.target?.name === 'Save & Close') {
          setRedirect(true);
        } else {
          setRedirect(false);
        }
        // setModalPopUp(true);
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
      // setLoading(false);
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, toIndex) => {
    e.preventDefault();

    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const updatedItems = [...pick_list];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setpick_list(updatedItems);
    setValue('pick_list', updatedItems);
    updatedItems?.map((e, index) => {
      if (e?.type_value === undefined || e?.type_name === undefined) {
        setError(`pick_list[${index}].type_value`, {
          type: 'custom',
          message: 'Value is required',
        });
        setError(`pick_list[${index}].type_name`, {
          type: 'custom',
          message: 'Name is required',
        });
      } else {
        setError(`pick_list[${index}].type_value`, {
          type: 'custom',
          message: '',
        });
        setError(`pick_list[${index}].type_name`, {
          type: 'custom',
          message: '',
        });
      }
    });
  };

  const archieveHandle = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'PATCH',
        `${BASE_URL}/system-configuration/organization-administration/custom-fields/archive/${id}`
      );
      const data = await response?.json();
      if (data?.status === 'success') {
        setShowModelArchive(false);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
      }
    } catch (err) {
      console.log({ err });
    }
  };
  return (
    <>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Custom Fields'}
        />
        <div className="mainContentInner">
          <form className="mt-5 pt-5">
            <div className="formGroup">
              <h5>Edit Custom Field</h5>
              <div className="w-100">
                <Controller
                  name="field_name"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      name={field.name}
                      displayName="Field Name*"
                      onChange={(e) => handleChange(field, e)}
                      value={field.value}
                      required={false}
                      error={errors?.field_name?.message}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </div>
              <Controller
                name="field_data_type"
                control={control}
                render={({ field }) => (
                  <SelectDropdown
                    name={field.name}
                    placeholder={'Field Data Type*'}
                    showLabel={
                      fieldDataTypeData?.field_data_type ? true : false
                    }
                    required
                    removeDivider
                    selectedValue={fieldDataTypeData?.field_data_type}
                    defaultValue={fieldDataTypeData?.field_data_type}
                    onChange={handleChangeFieldDataType}
                    options={fieldDataTypeOption}
                    onBlur={field.onBlur}
                    error={errors?.field_data_type?.message}
                  />
                )}
              />
              <Controller
                name="applies_to"
                control={control}
                render={({ field }) => (
                  <SelectDropdown
                    name={field.name}
                    placeholder={'Applies To*'}
                    showLabel={appliesToData?.applies_to ? true : false}
                    required
                    removeDivider
                    selectedValue={appliesToData?.applies_to}
                    defaultValue={appliesToData?.applies_to}
                    onChange={handleChangeAppliesTo}
                    error={errors?.applies_to?.message}
                    options={appliesToOption}
                    onBlur={field.onBlur}
                  />
                )}
              />

              {pickListData ? (
                <>
                  <div className="form-field w-100">
                    <div className="field">
                      <p className="mb-0 pick_list mt-3">Pick List</p>
                    </div>
                  </div>
                  {pick_list?.map((item, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e)}
                      onDrop={(e) => handleDrop(e, index)}
                      className="w-100 d-flex justify-content-between"
                    >
                      <div className="form-field">
                        <div className="field d-flex align-item-center">
                          <SvgComponent name="PickListIcon" />
                          <Controller
                            name={`pick_list[${index}].type_name`}
                            control={control}
                            render={({ field }) => (
                              <FormInput
                                name={field.name}
                                displayName="Name*"
                                classes={{ root: 'w-100' }}
                                onChange={(e) => {
                                  setpick_list((prevpick_list) => {
                                    const updatedpick_list = [...prevpick_list];
                                    updatedpick_list[index] = {
                                      ...updatedpick_list[index],
                                      type_name: e?.target?.value,
                                    };
                                    return updatedpick_list;
                                  });
                                  handleChange(field, e);
                                }}
                                value={item?.type_name}
                                required={false}
                                error={
                                  errors?.pick_list?.[index]?.type_name?.message
                                }
                                onBlur={field.onBlur}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="form-field">
                        <Controller
                          name={`pick_list[${index}].type_value`}
                          control={control}
                          render={({ field }) => (
                            <FormInput
                              name={field.name}
                              displayName="Value*"
                              classes={{ root: 'w-100' }}
                              onChange={(e) => {
                                setpick_list((prevpick_list) => {
                                  const updatedpick_list = [...prevpick_list];
                                  updatedpick_list[index] = {
                                    ...updatedpick_list[index],
                                    type_value: e.target.value,
                                  };
                                  return updatedpick_list;
                                });
                                handleChange(field, e);
                              }}
                              value={item?.type_value}
                              required={false}
                              error={
                                errors?.pick_list?.[index]?.type_value?.message
                              }
                              onBlur={field.onBlur}
                            />
                          )}
                        />
                        <div className="field d-flex justify-content-end">
                          {index === pick_list.length - 1 ? (
                            <>
                              {pick_list?.length - 1 === 0 ? (
                                <span>
                                  <SvgComponent name="PickListMinusGrayIcon" />
                                </span>
                              ) : (
                                <span
                                  onClick={() => handleMinus(index)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <SvgComponent name="PickListMinusIcon" />
                                </span>
                              )}

                              <span
                                onClick={handlePlus}
                                style={{ cursor: 'pointer' }}
                              >
                                <SvgComponent name="PickListPlusIcon" />
                              </span>
                            </>
                          ) : (
                            <span
                              onClick={() => handleMinus(index)}
                              style={{ cursor: 'pointer' }}
                            >
                              <SvgComponent name="PickListMinusIcon" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : null}
              <Controller
                name="is_active"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormToggle
                    name={field.name}
                    displayName={field.value ? 'Active' : 'Inactive'}
                    checked={field.value}
                    classes={{ root: 'is_active' }}
                    handleChange={(event) => {
                      field.onChange({
                        target: { value: event.target.checked },
                      });
                    }}
                  />
                )}
              />
              <Controller
                name="is_required"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormCheckbox
                    name={field.name}
                    displayName="Required"
                    classes={{ root: 'justify-content-end' }}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    labelClass="is_required"
                  />
                )}
              />
            </div>
          </form>
        </div>
        <CancelModalPopUp
          title="Confirmation"
          message="Unsaved changes will be lost, do you wish to proceed?"
          modalPopUp={closeModal}
          isNavigate={true}
          setModalPopUp={setCloseModal}
          redirectPath={-1}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Custom Field is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/organizational-admin/custom-fields/list'
          }
        />
        <SuccessPopUpModal
          title={'Success!'}
          message={'Custom field updated.'}
          modalPopUp={showModel}
          setModalPopUp={setShowModel}
          showActionBtns={true}
          isNavigate={redirect}
          redirectPath={-1}
        />
        <SuccessPopUpModal
          title={'Confirmation'}
          message={'Are you sure want to archive?'}
          modalPopUp={showModelArchive}
          setModalPopUp={setShowModelArchive}
          isArchived={true}
          archived={archieveHandle}
        />
        <div className="form-footer">
          <div
            onClick={() => {
              setShowModelArchive(true);
            }}
            className="archived"
          >
            <span>Archive</span>
          </div>
          <div className="custom-field-footers">
            <span
              className={`text-primary border-0 cursor-pointer cancel me-3`}
              onClick={() => setCloseModal(true)}
            >
              Cancel
            </span>
            <button
              name="Save & Close"
              className={`rounded  btn btn-primary bg-white text-primary`}
              onClick={handleSubmit(onSubmit)}
            >
              Save & Close
            </button>
            <button
              name="Save Changes"
              type="button"
              className={`rounded  btn btn-primary `}
              onClick={handleSubmit(onSubmit)}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
