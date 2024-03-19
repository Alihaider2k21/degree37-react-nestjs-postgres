import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PickupSchema } from './pickupFormSchema';
import SelectDropdown from '../../../../common/selectDropdown';
import './about.scss';
import FormText from '../../../../common/form/FormText';
import { API } from '../../../../../api/api-routes';
import { toast } from 'react-toastify';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import SuccessPopUpModal from '../../../../common/successModal';
import Pagination from '../../../../common/pagination';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker as MyTimePicker } from '@mui/x-date-pickers/TimePicker';
import 'rc-time-picker/assets/index.css';
import dayjs from 'dayjs';

function PickupDetailsSection({ driveData, getDriveData }) {
  const { id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [startTime, setStartTime] = useState(null);
  const [selectedEqipment, setSelectedEqipment] = useState(null);
  const [drivePickups, setDrivePickups] = useState([]);
  const [addPickupModal, setAddPickupModal] = useState(false);
  const [allEquipmentList, setAllEquipmentList] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(PickupSchema),
  });

  useEffect(() => {
    if (driveData !== null) {
      AllItemsListAPI();
    }
  }, [driveData]);
  const AllItemsListAPI = async () => {
    const { data } =
      await API.systemConfiguration.operationAdministrations.marketingEquipment.promotions.getMarketingEquipmentByCollectionOperationAndType(
        {
          collection_operations: driveData?.account?.collection_operation?.id,
          type: 'PICKUP',
        }
      );
    const options = data?.data?.map((item) => {
      return { label: item.name, value: item.id };
    });
    setAllEquipmentList(options);
  };

  useEffect(() => {
    if (id) {
      getDrivePickups();
    }
  }, [id, currentPage]);

  const getDrivePickups = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/drives/${id}/pickups?page=${currentPage}&limit=${1}`
      );
      const affiliatedPickups = await result.json();
      if (affiliatedPickups?.data?.length > 0) {
        setTotalRecords(affiliatedPickups?.count || 0);
        setDrivePickups(affiliatedPickups?.data);
      } else {
        setDrivePickups([]);
      }
    } catch (error) {
      toast.error(`Failed to fetch data ${error}`, { autoClose: 3000 });
    }
  };

  const handleSubmitForm = async (values) => {
    const body = {
      description: values.description,
      equipment_id: +values?.equipment_id,
      start_time: moment(values?.start_time).format('YYYY-MM-DD HH:mm:ss.SSSZ'),
      pickable_id: +id,
      pickable_type: 1,
    };
    try {
      const response = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/drives/${id}/pickups`,
        JSON.stringify(body)
      );
      let data = await response.json();
      if (data?.status === 'success') {
        setAddPickupModal(false);
        setAddPickupModal(false);
        setStartTime(null);
        reset();
        setSelectedEqipment(null);
        setShowModel(true);
        getDriveData(id);
      } else if (data?.status_code === 400) {
        const showMessage = Array.isArray(data?.message)
          ? data?.message[0]
          : data?.message;

        toast.error(`${showMessage}`, { autoClose: 3000 });
      } else {
        const showMessage = Array.isArray(data?.message)
          ? data?.message[0]
          : data?.message;
        toast.error(`${showMessage}`, { autoClose: 3000 });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };
  return (
    <>
      <table className="viewTables w-100 mt-5 pickup">
        <thead>
          <tr>
            <th colSpan="5">
              <div className="d-flex align-items-center justify-between w-100">
                <span>Pickup Details</span>
                <button
                  className="btn btn-link btn-md bg-transparent"
                  onClick={() => setAddPickupModal(true)}
                >
                  Add Pickup
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className={` w-100 `}>
          {drivePickups.length > 0 ? (
            <>
              {drivePickups.map((item, index) => (
                <>
                  <tr>
                    <td className="tableTD col1">Start Time</td>
                    <td className="tableTD col2">
                      {moment(item?.start_time).format('h:mm a') || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Type</td>
                    <td className="tableTD col2">
                      {item?.equipment_id?.name || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Description</td>
                    <td className="tableTD col2">
                      {item?.description || 'N/A'}
                    </td>
                  </tr>
                </>
              ))}
            </>
          ) : (
            <tr>
              <td className="no-data text-sm text-center">No pickups found.</td>
            </tr>
          )}
        </tbody>
      </table>
      {drivePickups.length > 0 && (
        <div className="paginationClasses d-flex align-items-center justify-content-end gap-3 mt-3 ">
          <p className="text-black mb-0 fs-5 fw-semibold ">Pickups</p>
          <Pagination
            limit={1}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalRecords={totalRecords}
          />
        </div>
      )}

      <section
        className={`popup full-section ${addPickupModal ? 'active' : ''}`}
      >
        <div
          className="popup-inner"
          style={{ maxWidth: '800px', padding: '30px', paddingTop: '25px' }}
        >
          <div className="content">
            <div className="d-flex align-items-center justify-between">
              <h3>Add Pickups</h3>
            </div>
            <div className="mt-4 overflow-y-auto overflow-x-hidden text-start ">
              <form onSubmit={handleSubmit(handleSubmitForm)}>
                <div className="row">
                  <div className="col-6">
                    <Controller
                      name={`start_time`}
                      control={control}
                      render={({ field }) => (
                        <div className="form-field">
                          <div className={`field shiftTime`}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <MyTimePicker
                                classes={{ root: 'dsd' }}
                                valueType="time"
                                value={dayjs(startTime)}
                                onChange={(e) => {
                                  setStartTime(e);
                                  field.onChange(e);
                                }}
                                className="w-100 shift"
                                label="Start Time"
                              />
                            </LocalizationProvider>
                          </div>
                          {errors?.[`start_time`] && (
                            <div className="error">
                              <div className="error">
                                <p>{errors?.[`start_time`].message}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  <div className="col-6">
                    <Controller
                      name="equipment_id"
                      control={control}
                      render={({ field }) => (
                        <SelectDropdown
                          removeDivider
                          placeholder="Type"
                          name={field.name}
                          options={allEquipmentList || []}
                          selectedValue={selectedEqipment}
                          onChange={(option) => {
                            field.onChange(option?.value);
                            setSelectedEqipment(option);
                            setValue('equipment_id', option?.value || null);
                          }}
                          required={false}
                          onBlur={field.onBlur}
                          error={errors?.equipment_id?.message}
                          showLabel
                        />
                      )}
                    />
                  </div>
                  <div className="col-12 pt-4 ">
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <FormText
                          name={field.name}
                          placeholder={
                            getValues('description') ? '' : 'Description*'
                          }
                          displayName={
                            !getValues('description') ? '' : 'Description*'
                          }
                          showLabel
                          classes={{ root: `w-100 field` }}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setValue('description', e.target.value || '');
                          }}
                          value={field.value}
                          required={false}
                          error={errors?.description?.message}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="buttons d-flex align-items-center justify-content-end mt-4">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => {
                      setAddPickupModal(false);
                      setStartTime(null);
                      reset();
                      setSelectedEqipment(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-md btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      {showModel === true ? (
        <SuccessPopUpModal
          title="Success!"
          message="Drive Pickups added."
          modalPopUp={showModel}
          isNavigate={true}
          setModalPopUp={setShowModel}
          showActionBtns={true}
          onConfirm={() => {
            setShowModel(false);
          }}
        />
      ) : null}
    </>
  );
}

export default PickupDetailsSection;
