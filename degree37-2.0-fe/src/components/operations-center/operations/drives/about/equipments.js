import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CancelModalPopUp from '../../../../common/cancelModal';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import * as _ from 'lodash';
import SuccessPopUpModal from '../../../../common/successModal';
import SvgComponent from '../../../../common/SvgComponent';
import { API } from '../../../../../api/api-routes';
import SelectDropdown from '../../../../common/selectDropdown';
import FormInput from '../../../../common/form/FormInput';
import './about.scss';
import { toast } from 'react-toastify';

function EquipmentsSection({ driveData, getDriveData }) {
  const { id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [closeModal, setCloseModal] = useState(false);
  const [addEquipmentsModal, setAddEquipmentsModal] = useState(false);
  const [deletedEquipments, setDeletedEquipments] = useState([]);
  const [archiveModal, setArchiveModal] = useState(false);

  const [showModel, setShowModel] = useState(false);
  const [showModelDeletionSuccess, setShowModelDeletionSuccess] =
    useState(false);
  const initialState = { quantity: '', select: null };
  const [driveEquipmentList, setDriveEquipmentList] = useState([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [allItemsList, setAllItemsList] = useState([]);
  const [allEquipments, setAllEquipments] = useState([]);
  const [formState, setFormState] = useState([initialState]);
  const [error, setError] = useState(false);

  const validation = () => {
    if (
      formState?.some((item) => item.quantity === '' || item.select === null)
    ) {
      setError(true);
      return true;
    }
    setError(false);
    return false;
  };
  useEffect(() => {
    if (formState?.length > 0 && allEquipments.length > 0) {
      const dupArr = [...allEquipments];
      const existingEquipments = formState?.map((item) =>
        item?.select?.value?.toString()
      );
      allEquipments.forEach((item) => {
        if (existingEquipments.includes(item.value)) {
          const finIndex = dupArr.findIndex((i) => i.value === item.value);
          dupArr.splice(finIndex, 1);
        }
      });
      setAllItemsList(dupArr);
    }
  }, [formState]);

  useEffect(() => {
    if (driveData !== null) {
      setDriveEquipmentList(driveData?.drives_equipments || []);
      setFormState(
        driveData?.drives_equipments?.map((item) => {
          return {
            quantity: item?.quantity || '',
            id: item?.drive_equipment_id,
            select: {
              value: item?.equipment_id?.id,
              label: item?.equipment_id?.name || '',
            },
          };
        })
      );
    }
    if (driveData?.drives_equipments === null) {
      setFormState([initialState]);
    }
  }, [driveData, addEquipmentsModal]);

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
    setAllEquipments(options);
    setAllItemsList(options);
  };

  const submitPreferences = async () => {
    if (!validation()) {
      setButtonDisabled(true);

      const body = {
        deleteEquipments: deletedEquipments,
        equipments: _.compact(
          formState?.map((item) => {
            if (!item?.id) {
              return {
                equipment_id: item.select.value,
                quantity: item?.quantity,
              };
            }
          })
        ),
      };
      try {
        const response = await makeAuthorizedApiRequest(
          'POST',
          `${BASE_URL}/drives/${id}/equipment`,
          JSON.stringify(body)
        );
        let data = await response.json();
        if (data?.status === 'success') {
          getDriveData(id);
          setAddEquipmentsModal(false);
          setShowModel(true);
          setButtonDisabled(false);
        } else if (data?.status_code === 400) {
          const showMessage = Array.isArray(data?.message)
            ? data?.message[0]
            : data?.message;
          toast.error(`${showMessage}`, { autoClose: 3000 });
          setButtonDisabled(false);
        } else {
          const showMessage = Array.isArray(data?.message)
            ? data?.message[0]
            : data?.message;
          toast.error(`${showMessage}`, { autoClose: 3000 });
          setButtonDisabled(false);
        }
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
        setButtonDisabled(false);
      }

      setDeletedEquipments([]);
    }
  };

  const handleRemoveEquipment = async (item) => {
    try {
      const response = await makeAuthorizedApiRequest(
        'PUT',
        `${BASE_URL}/drives/${id}/equipment/${item.drive_equipment_id}`,
        JSON.stringify({ id: item?.id })
      );
      let data = await response.json();
      if (data?.status === 'success') {
        setArchiveModal(false);
        setShowModelDeletionSuccess(true);
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
      <table className="viewTables w-100 mt-4">
        <thead>
          <tr>
            <th colSpan="5">
              <div className="d-flex align-items-center justify-between w-100">
                <span>Equipment</span>
                <button
                  onClick={() => {
                    setAddEquipmentsModal(true);
                  }}
                  className="btn btn-link btn-md bg-transparent"
                >
                  Add Equipment
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody
          className={`overflow-y-auto w-100 ${
            driveEquipmentList.length > 5 ? ' d-block' : ''
          }`}
          style={{
            height: driveEquipmentList.length > 5 ? '316px' : 'auto',
          }}
        >
          {driveEquipmentList.length > 0 ? (
            <tr className="bg-white position-sticky top-0 w-100">
              <td className="tableTD tableHead" style={{ width: '30%' }}>
                Item Name
              </td>
              <td className="tableTD tableHead" style={{ width: '30%' }}>
                Quantity
              </td>
              <td className="tableTD tableHead" style={{ width: '30%' }}>
                Provided By
              </td>
              <td className="tableTD tableHead" style={{ width: '10%' }}></td>
            </tr>
          ) : (
            <tr>
              <td className="no-data text-sm text-center">
                No equipments found
              </td>
            </tr>
          )}
          {driveEquipmentList.length > 0 &&
            driveEquipmentList.map((item, index) => (
              <tr
                className="bg-white"
                key={`${item?.drive_equipment_id?.id || ''}_${index}`}
              >
                <td
                  className="tableTD col2"
                  style={{ width: '30%', wordBreak: 'break-word' }}
                >
                  {item?.equipment_id?.name || ''}
                </td>
                <td className="tableTD col2 " style={{ width: '30%' }}>
                  {item?.quantity || ''}
                </td>
                <td
                  className="tableTD col2 text-capitalize "
                  style={{ width: '30%' }}
                >
                  {item?.equipment_id?.type?.toLowerCase() || ''}
                </td>
                <td className="tableTD col2" style={{ width: '10%' }}>
                  <div
                    style={{ width: 'fit-content', cursor: 'pointer' }}
                    onClick={() => {
                      setArchiveModal(true);
                      setSelectedEquipmentId(item);
                    }}
                  >
                    {driveEquipmentList?.length > 1 ?? (
                      <SvgComponent name={'DrivesCrossIcon'} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <section
        className={`popup full-section ${addEquipmentsModal ? 'active' : ''}`}
      >
        <div
          className="popup-inner"
          style={{ maxWidth: '800px', padding: '30px', paddingTop: '25px' }}
        >
          <div className="content">
            <div className="d-flex align-items-center justify-between">
              <h3>Add Equipment</h3>
            </div>
            <div className="mt-4 overflow-y-auto" style={{ height: '50vh' }}>
              <form>
                <div className="d-flex flex-column gap-4 w-100 ">
                  {formState?.map((item, index) => (
                    <div
                      key={`${index}`}
                      className="d-flex align-items-center justify-content-between gap-4 w-100"
                    >
                      <div style={{ width: '45%', textAlign: 'left' }}>
                        <SelectDropdown
                          placeholder={'Item Name'}
                          defaultValue={item.select}
                          selectedValue={item.select}
                          showLabel
                          removeDivider
                          onChange={(e) => {
                            let dupArr = [...formState];
                            dupArr[index].select = e;
                            setFormState(dupArr);
                          }}
                          options={allItemsList}
                          error={
                            error &&
                            item.select === null &&
                            'Item name is required.'
                          }
                          disabled={item?.id ? true : false}
                        />
                      </div>
                      <div style={{ width: '25%', textAlign: 'left' }}>
                        <FormInput
                          type="number"
                          name={'quantity'}
                          classes={{ root: 'w-100' }}
                          displayName={'Quantity'}
                          value={item?.quantity}
                          onChange={(e) => {
                            let dupArr = [...formState];
                            dupArr[index].quantity = e.target.value;
                            setFormState(dupArr);
                          }}
                          required={false}
                          error={
                            error &&
                            item.quantity === '' &&
                            'Quantity is required.'
                          }
                          disabled={item?.id ? true : false}
                        />
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-end gap-2 "
                        style={{ width: '30%' }}
                      >
                        <div
                          style={{
                            width: '24px',
                            lineHeight: '20px',
                            height: '20px',
                            color: '#A3A3A3',
                            fontSize: '30px',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            const dupArr = [...formState];
                            if (dupArr.length > 1) {
                              dupArr.splice(index, 1);
                              if (item?.id) {
                                setDeletedEquipments((prev) => [
                                  ...prev,
                                  item?.id?.toString(),
                                ]);
                              }
                            } else {
                              toast.error('Minimum one record is mandatory.');
                            }
                            setFormState(dupArr);
                          }}
                        >
                          -
                        </div>
                        {formState?.length - 1 === index && (
                          <div
                            style={{
                              lineHeight: '20px',
                              height: '24px',
                              width: 'fit-content',
                              color: '#387DE5',
                              fontSize: '30px',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              const dupArr = [...formState];
                              dupArr.push(initialState);
                              setFormState(dupArr);
                            }}
                          >
                            +
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </form>
            </div>
            <div className="buttons d-flex align-items-center justify-content-end mt-4">
              <button
                className="btn btn-link"
                onClick={() => setAddEquipmentsModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-md btn-primary"
                onClick={submitPreferences}
                disabled={buttonDisabled}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>

      {closeModal === true ? (
        <CancelModalPopUp
          title="Confirmation"
          message="Unsaved changes will be lost, do you wish to proceed?"
          modalPopUp={closeModal}
          isNavigate={false}
          setModalPopUp={setCloseModal}
          redirectPath={'/crm/accounts'}
          methodsToCall={true}
          methods={() => {
            setAddEquipmentsModal(false);
          }}
        />
      ) : null}
      <SuccessPopUpModal
        title={'Confirmation'}
        message={'Are you sure you want to archive?'}
        modalPopUp={archiveModal}
        setModalPopUp={setArchiveModal}
        showActionBtns={false}
        isArchived={true}
        archived={() => handleRemoveEquipment(selectedEquipmentId)}
        isNavigate={false}
        redirectPath={''}
      />
      {showModel === true ? (
        <SuccessPopUpModal
          title="Success!"
          message="Drive equipments added."
          modalPopUp={showModel}
          isNavigate={true}
          setModalPopUp={setShowModel}
          showActionBtns={true}
          onConfirm={() => setShowModel(false)}
        />
      ) : null}
      {showModelDeletionSuccess === true ? (
        <SuccessPopUpModal
          title="Success!"
          message="Drive equipment removed successfully."
          modalPopUp={showModelDeletionSuccess}
          isNavigate={true}
          setModalPopUp={setShowModelDeletionSuccess}
          showActionBtns={true}
          onConfirm={() => {
            getDriveData(id);
            setShowModelDeletionSuccess(false);
          }}
        />
      ) : null}
    </>
  );
}

export default EquipmentsSection;
