import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import FormRadioButtons from '../../../../common/form/FormRadioButtons';
import styles from '../index.module.scss';
import { API } from '../../../../../api/api-routes';
import BluePrintSelectAccountsModal from './blueprint-select-account-modal';
import FormInput from '../../../../common/form/FormInput';
import SelectDropdown from '../../../../common/selectDropdown';
import SvgComponent from '../../../../common/SvgComponent';

export default function SelectDriveForm({
  control,
  heading = 'Select Drive Form',
  formFields = [
    { label: 'Blueprint', value: 'blueprint' },
    { label: 'Copy Existing Drive', value: 'existing_drive' },
    { label: 'Clean Slate', value: 'clean_slate' },
  ],
  watch,
  selectedAccount,
  setSelectedAccount,
  selectedBlueprint,
  setSelectedBlueprint,
  setShifts,
  initialShift,
  setValue,
  setTravelMinutes,
  setSelectedAccounts,
  setZipCodes,
  setEquipment,
  setPromotional,
  setMarketing,
  setSelectedContacts,
  blueprintAccounts,
  blueprintList,
  setBlueprintList,
}) {
  const [blueprintAccountsSearchText, setBlueprintAccountsSearchText] =
    useState('');
  const [drivesDateList, setDrivesDateList] = useState([]);
  const [blueprintSelectAccountModal, setBlueprintSelectAccountModal] =
    useState(false);
  const type = watch('form');

  const getAccountBlueprints = async () => {
    const { data } = await API.operationCenter.drives.getAccountBlueprints(
      selectedAccount.id
    );
    const options = data?.data?.map((item) => {
      return {
        value: item.id,
        label: `${item.account.name} ${item.location.name}`,
      };
    });
    setBlueprintList(options);
  };

  const getAccountDrives = async () => {
    const { data } = await API.operationCenter.drives.getAccountDrives(
      selectedAccount.id
    );
    const options = data?.data?.map((item) => {
      return {
        value: item.id,
        label: `${item.date}`,
      };
    });
    setDrivesDateList(options);
  };

  useEffect(() => {
    if (selectedAccount?.id) getAccountBlueprints();
    if (selectedAccount?.id) getAccountDrives();
  }, [selectedAccount]);

  return (
    <>
      <div className="formGroup mt-5">
        <h5>{heading}</h5>
        <div className="d-flex gap-5 mb-3">
          <Controller
            name="form"
            control={control}
            render={({ field }) => (
              <>
                {formFields?.map((formField, index) => (
                  <FormRadioButtons
                    label={formField.label}
                    value={formField.value}
                    key={index}
                    className={`${styles.formCheckBoxes} gap-2`}
                    selected={field.value}
                    handleChange={(event) => {
                      setShifts(initialShift);
                      setValue('start_date', null);
                      setValue('account', '');
                      setValue('collection_operation', '');
                      setValue('territory', '');
                      setValue('recruiter', '');
                      setValue('location', '');
                      setValue('location_type', '');
                      setValue('promotion', '');
                      setValue('status', '');
                      setValue('miles', '');
                      setValue('multi_day', false);
                      setValue('minutes', '');
                      setTravelMinutes(0);
                      setValue('open_public', false);
                      setEquipment([]);
                      setValue('certifications', []);
                      setValue('marketing_start_date', '');
                      setValue('marketing_end_date', '');
                      setValue('marketing_start_time', '');
                      setValue('marketing_end_time', '');
                      setValue('instructional_information', '');
                      setValue('donor_information', '');
                      setMarketing([]);
                      setValue('order_due_date', '');
                      setPromotional([]);
                      setValue('tele_recruitment', '');
                      setValue('email', false);
                      setValue('sms', false);
                      setSelectedAccounts([]);
                      setZipCodes([]);
                      setSelectedContacts([]);
                      field.onChange({
                        target: { value: event.target.value },
                      });
                    }}
                  />
                ))}
              </>
            )}
          />
        </div>
        {(type == 'blueprint' || type == 'existing_drive') && (
          <Controller
            name="blueprint_account"
            control={control}
            render={({ field }) => {
              return (
                <FormInput
                  classes={{ root: 'w-40', icon: `${styles.iconSearch}` }}
                  type="text"
                  className="form-control"
                  name={field.name}
                  value={selectedAccount?.label || ''}
                  onClick={() => {
                    setBlueprintSelectAccountModal(true);
                  }}
                  icon={<SvgComponent name={'SearchIcon'} />}
                  displayName={'Account Name'}
                />
              );
            }}
          />
        )}
        {type == 'blueprint' && (
          <Controller
            name="blueprint_select"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                styles={{ root: 'w-50' }}
                searchable={true}
                placeholder={'Blueprint'}
                required={true}
                showLabel={field?.value?.value}
                defaultValue={field?.value}
                selectedValue={field?.value}
                removeDivider
                onChange={(e) => {
                  field.onChange(e);
                }}
                handleBlur={(e) => {
                  field.onChange(e);
                }}
                options={blueprintList}
              />
            )}
          />
        )}
        {type == 'existing_drive' && (
          <Controller
            name="existing_drive_date"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                styles={{ root: 'w-50' }}
                searchable={true}
                placeholder={'Date'}
                required={true}
                showLabel={field?.value?.value}
                defaultValue={field?.value}
                selectedValue={field?.value}
                removeDivider
                onChange={(e) => {
                  field.onChange(e);
                }}
                handleBlur={(e) => {
                  field.onChange(e);
                }}
                options={drivesDateList}
              />
            )}
          />
        )}
      </div>
      <BluePrintSelectAccountsModal
        blueprintSelectAccountModal={blueprintSelectAccountModal}
        setBlueprintSelectAccountModal={setBlueprintSelectAccountModal}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        accountRows={blueprintAccounts}
        accountsSearchText={blueprintAccountsSearchText}
        setAccountsSearchText={setBlueprintAccountsSearchText}
      />
    </>
  );
}
