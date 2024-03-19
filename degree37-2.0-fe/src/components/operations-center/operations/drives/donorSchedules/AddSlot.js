import React from 'react';
import styles from './index.module.scss';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SelectDropdown from '../../../../common/selectDropdown';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';

const AddSlotModal = ({
  showConfirmation,
  setShowConfirmation,
  onCancel,
  onConfirm,
  heading,
  shiftId,
  handleShiftSlots,
  startTimeOption,
  endTimeOption,
  classes,
}) => {
  const [rows, setRows] = useState([0]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const startTimeOptionFilter = startTimeOption
    ?.filter((item, index, array) => {
      // Filter items based on whether their label and value are unique in the array
      return (
        array?.findIndex(
          (el) => el?.label === item?.label && el?.value === item?.value
        ) === index
      );
    })
    ?.map((item) => {
      // Map the filtered items to the desired format
      return {
        label: item?.label,
        value: item?.value,
      };
    });
  const endTimeOptionFilter = endTimeOption
    ?.filter((item, index, array) => {
      // Filter items based on whether their label and value are unique in the array
      return (
        array?.findIndex(
          (el) => el?.label === item?.label && el?.value === item?.value
        ) === index
      );
    })
    ?.map((item) => {
      // Map the filtered items to the desired format
      return {
        label: item?.label,
        value: item?.value,
      };
    });
  const schema = yup.object().shape({
    slot: yup.array().of(
      yup.object().shape({
        startTime: yup.object().required('Start time is required'),
        endTime: yup.object().required('End time is required'),
      })
    ),
  });

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const handleAddRow = () => {
    setRows([...rows, rows.length]); // Add a new row
  };

  const handleDeleteRow = () => {
    if (rows.length > 1) {
      const updatedRows = rows?.slice(0, -1); // Remove the last row
      setRows(updatedRows); // Remove the last row except the first one
      const test = getValues();
      const updatedSlot = test?.slot?.slice(0, -1);
      setValue('slot', updatedSlot);
    }
  };
  const onSubmit = async (data) => {
    const modified = {
      slots: data?.slot?.map((item) => {
        const start = item.startTime.value;
        const end = item.endTime.value;
        return {
          start_time: start,
          end_time: end,
          procedure_type_id: shiftId.procedure_type_id,
          shift_id: shiftId.shift_id,
        };
      }),
    };
    addDonorSchedules(modified);
  };

  const addDonorSchedules = async (item) => {
    try {
      const response = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/drives/shifts/${shiftId?.shift_id}/projection/${shiftId?.procedure_type_id}/slots`,
        JSON.stringify(item)
      );
      const data = await response.json();
      if (data.status === 'success') {
        reset();
        setShowConfirmation(false);
        handleShiftSlots(shiftId.procedure_type_id);
        setRows([0]);
      }
    } catch (error) {
      toast.error('Error fetching donor schedules:', error);
    }
  };

  return (
    <section
      className={`${styles.popup} ${showConfirmation && styles.active} ${
        classes?.root ?? ''
      }`}
    >
      <div className={`${styles.popupInner} ${classes?.inner ?? ''}`}>
        <div className={styles.content}>
          {heading ? <h3>{heading}</h3> : ''}
          <form
            className={styles.formContainer}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.fieldList}>
              <div className="d-flex">
                <div className={`${styles.selectMarginShift}`}>
                  <Controller
                    name={`slot[${0}].startTime`}
                    control={control}
                    render={({ field }) => (
                      <SelectDropdown
                        placeholder="Slot 1 Start Time"
                        defaultValue={null}
                        selectedValue={field.value ? field.value : null}
                        removeDivider
                        options={startTimeOptionFilter}
                        showLabel
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {errors.slot ? (
                    <div className={styles.error}>
                      {errors?.slot[0]?.startTime?.message}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className={`${styles.selectMarginShift}`}>
                  <Controller
                    name={`slot[${0}].endTime`}
                    control={control}
                    render={({ field }) => (
                      <SelectDropdown
                        placeholder="Slot 1 End Time"
                        defaultValue={null}
                        selectedValue={field.value ? field.value : null}
                        removeDivider
                        options={endTimeOptionFilter}
                        showLabel
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {errors.slot ? (
                    <div className={styles.error}>
                      {errors?.slot[0]?.endTime?.message}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div
                  className="d-flex"
                  style={{ alignItems: 'center', marginBottom: '27px' }}
                >
                  <span
                    onClick={handleDeleteRow}
                    style={{ marginRight: '13px' }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="24"
                      viewBox="0 0 22 24"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_44001_66827)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M17.418 11H15.001H11.918H10.0846H7.00098H4.58464C4.34152 11 4.10836 11.1054 3.93645 11.2929C3.76455 11.4804 3.66797 11.7348 3.66797 12C3.66797 12.2652 3.76455 12.5196 3.93645 12.7071C4.10836 12.8946 4.34152 13 4.58464 13H7.00098H10.0846H11.918H15.001H17.418C17.6611 13 17.8942 12.8946 18.0662 12.7071C18.2381 12.5196 18.3346 12.2652 18.3346 12C18.3346 11.7348 18.2381 11.4804 18.0662 11.2929C17.8942 11.1054 17.6611 11 17.418 11Z"
                          fill="#A3A3A3"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_44001_66827">
                          <rect width="22" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  <span onClick={handleAddRow}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="24"
                      viewBox="0 0 22 24"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_44001_66820)">
                        <path
                          d="M17.418 11H11.918V5C11.918 4.73478 11.8214 4.48043 11.6495 4.29289C11.4776 4.10536 11.2444 4 11.0013 4C10.7582 4 10.525 4.10536 10.3531 4.29289C10.1812 4.48043 10.0846 4.73478 10.0846 5V11H4.58464C4.34152 11 4.10836 11.1054 3.93645 11.2929C3.76455 11.4804 3.66797 11.7348 3.66797 12C3.66797 12.2652 3.76455 12.5196 3.93645 12.7071C4.10836 12.8946 4.34152 13 4.58464 13H10.0846V19C10.0846 19.2652 10.1812 19.5196 10.3531 19.7071C10.525 19.8946 10.7582 20 11.0013 20C11.2444 20 11.4776 19.8946 11.6495 19.7071C11.8214 19.5196 11.918 19.2652 11.918 19V13H17.418C17.6611 13 17.8942 12.8946 18.0662 12.7071C18.2381 12.5196 18.3346 12.2652 18.3346 12C18.3346 11.7348 18.2381 11.4804 18.0662 11.2929C17.8942 11.1054 17.6611 11 17.418 11Z"
                          fill="#387DE5"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_44001_66820">
                          <rect width="22" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </div>
              </div>
              {rows.slice(1).map((rowIndex, index) => (
                <div key={index} className="d-flex">
                  <div className={`${styles.selectMarginRender}`}>
                    <Controller
                      name={`slot[${rowIndex}].startTime`}
                      control={control}
                      render={({ field }) => (
                        <SelectDropdown
                          placeholder={`Slot ${rowIndex + 1} Start Time`}
                          defaultValue={null}
                          selectedValue={field.value ? field.value : null}
                          removeDivider
                          options={startTimeOptionFilter}
                          showLabel
                          onBlur={field.onBlur}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      )}
                    />
                    {errors.slot ? (
                      <div className={styles.error}>
                        {errors?.slot[rowIndex]?.startTime?.message}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className={`${styles.selectMarginRender}`}>
                    <Controller
                      name={`slot[${rowIndex}].endTime`}
                      control={control}
                      render={({ field }) => (
                        <SelectDropdown
                          placeholder={`Slot ${rowIndex + 1} End Time`}
                          defaultValue={null}
                          selectedValue={field.value ? field.value : null}
                          removeDivider
                          options={endTimeOptionFilter}
                          showLabel
                          onBlur={field.onBlur}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      )}
                    />
                    {errors.slot ? (
                      <div className={styles.error}>
                        {errors?.slot[rowIndex]?.endTime?.message}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.shiftBtns}>
              <span
                className={styles.cancelShiftBtn}
                onClick={() => {
                  onCancel();
                  reset();
                  setRows([0]);
                  //   getShiftScheduleData();
                }}
              >
                Cancel
              </span>
              <button
                type="submit"
                className={styles.saveShiftBtn}
                onClick={onConfirm}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* <SuccessPopUpModal
        title={'Success!'}
        message={'Shift Schedule Updated.'}
        modalPopUp={showModal}
        setModalPopUp={setShowModal}
        showActionBtns={true}
      /> */}
    </section>
  );
};

export default AddSlotModal;
