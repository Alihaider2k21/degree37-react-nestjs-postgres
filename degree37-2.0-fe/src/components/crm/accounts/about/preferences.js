import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TableList from '../../../common/tableListing';
import CancelModalPopUp from '../../../common/cancelModal';
import moment from 'moment';
import * as _ from 'lodash';
import { makeAuthorizedApiRequest } from '../../../../helpers/Api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import SuccessPopUpModal from '../../../common/successModal';

const preference_type_enum = {
  1: 'Prefer',
  2: 'Decline',
};

const PreferenceTableHeaders = [
  {
    name: 'name',
    label: 'Staff Name',
    sortable: false,
    width: '30%',
  },
  {
    name: '',
    type: 'select',
    label: 'Preference',
    sortable: false,
    width: '30%',
  },
  {
    name: '',
    label: '',
    width: '34%',
    sortable: false,
  },
  {
    name: '',
    label: '',
    sortable: false,
  },
];

function PreferencesSection() {
  const { account_id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [closeModal, setCloseModal] = useState(false);
  const [addPreferenceModal, setAddPreferenceModal] = useState(false);
  const [selectedPreferenceDropdown, setSelectedPreferenceDropdown] = useState(
    {}
  );
  const [contactStaffSearch, setContactStaffSearch] = useState('');
  const [allStaffList, setAllStaffList] = useState({});
  const [selectedStaffs, setSelectedStaffs] = useState([]);
  const [accountPreferencesList, setAccountPreferencesList] = useState([]);
  const [deletedPreferences, setDeletedPreferences] = useState([]);
  const [archiveModal, setArchiveModal] = useState(false);
  const [selectedPreferenceId, setSelectedPreferenceId] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    if (selectedStaffs.length > 0) {
      const dupArr = [];
      accountPreferencesList.forEach((item) => {
        if (!selectedStaffs.includes(item.staff_id?.id)) {
          dupArr.push(item.id);
        }
      });
      setDeletedPreferences(dupArr);
    } else if (
      accountPreferencesList.length > 0 &&
      selectedStaffs.length === 0
    ) {
      setDeletedPreferences(accountPreferencesList.map((item) => item.id));
    }
  }, [selectedStaffs.length]);

  useEffect(() => {
    if (accountPreferencesList.length > 0) {
      setSelectedStaffs(accountPreferencesList.map((item) => item.staff_id.id));
      const dupObj = {};
      accountPreferencesList.forEach((item) => {
        dupObj[item.staff_id.id] = {
          value: +item.preference,
          label: preference_type_enum[+item.preference],
        };
      });
      setSelectedPreferenceDropdown(dupObj);
    } else {
      setSelectedStaffs([]);
      setSelectedPreferenceDropdown({});
    }
  }, [accountPreferencesList?.length, closeModal, addPreferenceModal]);

  useEffect(() => {
    getAccountPreferences(account_id);
  }, [account_id]);
  const getAccountPreferences = async (account_id) => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/accounts/${account_id}/account-preferences`
    );
    const { data } = await result.json();
    if (data) {
      setAccountPreferencesList(data);
    }
  };
  useEffect(() => {
    if (contactStaffSearch === '' || contactStaffSearch.length > 2)
      fetchAllContactStaff();
  }, [contactStaffSearch]);
  const fetchAllContactStaff = async () => {
    try {
      setIsLoading(true);
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/contact-staff?findAll=true${
          contactStaffSearch && contactStaffSearch.length
            ? '&name=' + contactStaffSearch
            : ''
        }`
      );
      const data = await response.json();
      if (data?.data.length > 0) {
        setAllStaffList(
          _.keyBy(
            data.data.map((item) => {
              return {
                id: item.id,
                name: `${item.first_name} ${item?.last_name || ''}`,
              };
            }),
            'id'
          )
        );
      } else {
        setAllStaffList({});
      }
    } catch (error) {
      toast.error(`Failed to fetch staff data ${error}`, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };
  const submitPreferences = async () => {
    setButtonDisabled(true);
    if (selectedStaffs.length > 0) {
      let condition = [];
      selectedStaffs.forEach((sc) => {
        Object.keys(selectedPreferenceDropdown).forEach((sr) => {
          if (sc == sr) {
            condition.push(sc);
          }
        });
      });
      if (
        selectedStaffs.length <=
          Object.keys(selectedPreferenceDropdown).length &&
        selectedStaffs.length === condition.length
      ) {
        const dupArr = [...selectedStaffs];
        const dupArrDelete = [...deletedPreferences];
        if (selectedStaffs.length > 0) {
          accountPreferencesList.forEach((item) => {
            if (
              selectedStaffs.includes(item.staff_id?.id) &&
              item?.preference ===
                selectedPreferenceDropdown[item.staff_id?.id]?.value
            ) {
              const indexToRemove = dupArr.findIndex(
                (record) => record === item.staff_id?.id
              );
              dupArr.splice(indexToRemove, 1);
            } else {
              if (!dupArrDelete.includes(item.id)) {
                dupArrDelete.push(item.id);
              }
            }
          });
        }
        const body = {
          deleteStaff: dupArrDelete,
          allStaff: dupArr.map((item) => {
            return {
              staff_id: item,
              preference: selectedPreferenceDropdown[item]?.value,
            };
          }),
        };
        try {
          const response = await makeAuthorizedApiRequest(
            'POST',
            `${BASE_URL}/accounts/${account_id}/account-preferences`,
            JSON.stringify(body)
          );
          let data = await response.json();
          if (data?.status === 'success') {
            getAccountPreferences(account_id);
            setAddPreferenceModal(false);
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
      } else {
        toast.error('Staff and Preference must be selected!');
        setButtonDisabled(false);
      }
    } else {
      toast.error('Select atleast one preference!');
      setButtonDisabled(false);
    }
    setDeletedPreferences([]);
  };

  const handleRemovePreference = async (item) => {
    try {
      const response = await makeAuthorizedApiRequest(
        'PUT',
        `${BASE_URL}/accounts/${account_id}/account-preferences/${item.id}`,
        JSON.stringify({ id: item?.id })
      );
      let data = await response.json();
      if (data?.status === 'success') {
        getAccountPreferences(account_id);
        setArchiveModal(false);
        toast.success(data?.response);
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
                <span>Preferences</span>
                <button
                  onClick={() => {
                    setAddPreferenceModal(true);
                  }}
                  className="btn btn-link btn-md bg-transparent"
                >
                  Add Preferences
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody
          className={`overflow-y-auto w-100 ${
            accountPreferencesList.length > 5 ? ' d-block' : ''
          }`}
          style={{
            height: accountPreferencesList.length > 5 ? '316px' : 'auto',
          }}
        >
          {accountPreferencesList.length > 0 ? (
            <tr className="bg-white position-sticky top-0 w-100">
              <td className="tableTD tableHead" style={{ width: '31%' }}>
                Staff Name
              </td>
              <td className="tableTD tableHead" style={{ width: '31%' }}>
                Preference
              </td>
              <td className="tableTD tableHead" style={{ width: '31%' }}>
                Assigned
              </td>
              <td className="tableTD tableHead" style={{ width: '10%' }}></td>
            </tr>
          ) : (
            <tr>
              <td className="no-data text-sm text-center">
                No preferences found
              </td>
            </tr>
          )}
          {accountPreferencesList.length > 0 &&
            accountPreferencesList.map((item, index) => (
              <tr className="bg-white" key={`${item.id}_${index}`}>
                <td
                  className="tableTD col1"
                  style={{ width: '30%', wordBreak: 'break-word' }}
                >
                  {item?.staff_id?.first_name} {item?.staff_id?.last_name || ''}
                </td>
                <td className="tableTD col2 ">
                  <div className="d-flex align-items-center gap-2 w-100 ">
                    <div
                      style={{
                        width: '7px',
                        height: item?.preference === 1 ? '7px' : '6px',
                        borderRadius: '100%',
                        background:
                          item?.preference === 1 ? '#5CA044' : '#FF1E1E',
                      }}
                    ></div>
                    <span style={{ fontStyle: 'inherit' }}>
                      {preference_type_enum?.[item?.preference] || ''}
                    </span>
                  </div>
                </td>
                <td className="tableTD col2">
                  {item?.assigned_date
                    ? moment(item?.assigned_date).format('DD MMM YYYY')
                    : ''}
                </td>
                <td className="tableTD col2" style={{ width: '10%' }}>
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    style={{ width: '20px', height: '20px' }}
                    color="#A3A3A3"
                    icon={faXmark}
                    onClick={() => {
                      setArchiveModal(true);
                      setSelectedPreferenceId(item);
                    }}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <section
        className={`popup full-section ${addPreferenceModal ? 'active' : ''}`}
      >
        <div
          className="popup-inner"
          style={{ maxWidth: '950px', padding: '30px', paddingTop: '25px' }}
        >
          <div className="content">
            <div className="d-flex align-items-center justify-between">
              <h3>Add Preferences</h3>
              <div className="search">
                <div className="formItem">
                  <input
                    name="preference_name"
                    type="text"
                    placeholder="Search"
                    value={contactStaffSearch}
                    onChange={(e) => setContactStaffSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 overflow-y-auto" style={{ height: '50vh' }}>
              <TableList
                isLoading={isLoading}
                data={Object.values(allStaffList)}
                headers={PreferenceTableHeaders}
                checkboxValues={selectedStaffs}
                handleCheckboxValue={(row) => row.id}
                handleCheckbox={setSelectedStaffs}
                selectOptions={[
                  {
                    value: 1,
                    label: 'Prefer',
                  },
                  {
                    value: 2,
                    label: 'Decline',
                  },
                ]}
                selectValues={selectedPreferenceDropdown}
                setSelectValues={setSelectedPreferenceDropdown}
              />
            </div>

            <div className="buttons d-flex align-items-center justify-content-end mt-4">
              <button
                className="btn btn-link"
                onClick={() => {
                  if (
                    selectedStaffs.length > 0 ||
                    Object.keys(selectedPreferenceDropdown).length > 0
                  ) {
                    setCloseModal(true);
                  } else {
                    setAddPreferenceModal(false);
                  }
                }}
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
            setAddPreferenceModal(false);
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
        archived={() => handleRemovePreference(selectedPreferenceId)}
        isNavigate={false}
        redirectPath={''}
      />
      {showModel === true ? (
        <SuccessPopUpModal
          title="Success!"
          message="Account preferences added."
          modalPopUp={showModel}
          isNavigate={true}
          setModalPopUp={setShowModel}
          showActionBtns={true}
          onConfirm={() => setShowModel(false)}
        />
      ) : null}
    </>
  );
}

export default PreferencesSection;
